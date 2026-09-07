import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import PrintButton from "@/components/invoices/PrintButton";

type StatementPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StatementPage({ params }: StatementPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
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
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  return (
    <div className="min-h-screen bg-brand-cream p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href={`/admin/customers/${customer.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown/60 transition hover:text-brand-orange"
          >
            <ArrowLeft size={16} />
            Retour au client
          </Link>

          <PrintButton />
        </div>

        <article className="rounded-2xl bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <p className="text-3xl font-bold text-brand-orange">OUSSEMA 3D</p>

              <p className="mt-2 text-sm text-brand-brown/50">Relevé client</p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-brown/45">
                Relevé
              </p>

              <p className="mt-2 text-xl font-bold text-brand-brown">
                {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="my-10 h-px bg-brand-brown/10" />

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown/45">
                Client
              </p>

              <p className="mt-3 font-semibold text-brand-brown">
                {customer.name}
              </p>

              <p className="mt-1 text-sm text-brand-brown/60">
                {customer.phone}
              </p>

              {customer.email ? (
                <p className="mt-1 text-sm text-brand-brown/60">
                  {customer.email}
                </p>
              ) : null}

              {customer.address ? (
                <p className="mt-1 text-sm text-brand-brown/60">
                  {customer.address}
                </p>
              ) : null}

              {customer.city ? (
                <p className="text-sm text-brand-brown/60">{customer.city}</p>
              ) : null}
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown/45">
                Résumé
              </p>

              <p className="mt-3 text-sm text-brand-brown/60">
                Nombre de commandes :{" "}
                <span className="font-semibold text-brand-brown">
                  {customer.orders.length}
                </span>
              </p>

              <p className="mt-2 text-sm text-brand-brown/60">
                Total :{" "}
                <span className="font-bold text-brand-orange">
                  {totalSpent.toFixed(2)} DT
                </span>
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-brand-brown/10">
            <table className="w-full">
              <thead className="bg-brand-cream/60">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Commande
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Date
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Statut
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-brand-brown/10">
                {customer.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4 text-sm font-semibold text-brand-brown">
                      {order.id}
                    </td>

                    <td className="px-4 py-4 text-sm text-brand-brown/60">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="px-4 py-4 text-sm text-brand-brown/60">
                      {order.status}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-brand-brown">
                      {Number(order.total).toFixed(2)} DT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between border-t border-brand-brown/10 pt-4">
                <span className="font-semibold text-brand-brown">
                  Total général
                </span>

                <span className="text-2xl font-bold text-brand-orange">
                  {totalSpent.toFixed(2)} DT
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-brand-brown/10 pt-6 text-center text-xs text-brand-brown/45">
            Ce document récapitule les commandes du client.
          </div>
        </article>
      </div>
    </div>
  );
}
