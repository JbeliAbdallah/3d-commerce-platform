import Link from "next/link";
import { Eye } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En préparation",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: {
              translations: {
                where: {
                  language: "fr",
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
          Commandes
        </p>

        <h1 className="mt-2 text-3xl font-bold text-brand-brown">
          Commandes clients
        </h1>

        <p className="mt-2 text-sm text-brand-brown/60">
          Consultez et gérez les commandes reçues depuis le site.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-brand-brown/10 bg-brand-cream/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Commande
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Client
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Produit
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Statut
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-brown/10">
              {orders.map((order) => {
                const firstItem = order.items[0];
                const productName =
                  firstItem?.product.translations[0]?.name ??
                  firstItem?.product.slug ??
                  "—";

                return (
                  <tr key={order.id} className="hover:bg-brand-cream/20">
                    <td className="px-6 py-5">
                      <p className="font-mono text-xs text-brand-brown">
                        {order.id}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-brand-brown">
                        {order.customer.name}
                      </p>
                      <p className="mt-1 text-sm text-brand-brown/50">
                        {order.customer.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm text-brand-brown">{productName}</p>

                      {order.items.length > 1 && (
                        <p className="mt-1 text-xs text-brand-brown/50">
                          + {order.items.length - 1} autre
                          {order.items.length - 1 > 1 ? "s" : ""}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-brand-brown">
                        {Number(order.total).toFixed(2)} DT
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-brand-brown/60">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-brown/5 text-brand-brown transition hover:bg-brand-orange hover:text-white"
                        title="Voir la commande"
                      >
                        <Eye size={17} />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-sm text-brand-brown/50"
                  >
                    Aucune commande pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
