import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function CustomersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const customers = await prisma.customer.findMany({
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
          Relation client
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-brown">
          Clients
        </h1>

        <p className="mt-2 text-sm text-brand-brown/55">
          Consultez les clients ayant passé une commande.
        </p>
      </div>

      <div className="mt-8 rounded-[2rem] bg-brand-surface p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <Users size={20} />
          </div>

          <div>
            <p className="text-sm font-bold text-brand-brown">Total clients</p>
            <p className="text-2xl font-extrabold text-brand-brown">
              {customers.length}
            </p>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-brand-brown/15 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-brand-brown/50">
              Aucun client pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-brand-brown/10 text-xs uppercase tracking-wider text-brand-brown/40">
                  <th className="pb-4 pr-4 font-bold">Client</th>
                  <th className="pb-4 pr-4 font-bold">Téléphone</th>
                  <th className="pb-4 pr-4 font-bold">Ville</th>
                  <th className="pb-4 pr-4 font-bold">Commandes</th>
                  <th className="pb-4 font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-brand-brown/5 last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-bold text-brand-brown">
                        {customer.name}
                      </p>

                      {customer.email ? (
                        <p className="mt-1 text-xs text-brand-brown/45">
                          {customer.email}
                        </p>
                      ) : null}
                    </td>

                    <td className="py-4 pr-4 text-sm text-brand-brown/65">
                      {customer.phone}
                    </td>

                    <td className="py-4 pr-4 text-sm text-brand-brown/65">
                      {customer.city || "—"}
                    </td>

                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
                        {customer._count.orders}
                      </span>
                    </td>

                    <td className="py-4">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal transition-colors hover:text-brand-orange"
                      >
                        Voir commandes
                        <ArrowRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
