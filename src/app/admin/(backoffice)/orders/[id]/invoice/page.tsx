import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import PrintButton from "@/components/invoices/PrintButton";

type InvoicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      invoice: true,
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

  if (!order || !order.invoice) {
    notFound();
  }

  const invoice = order.invoice;

  return (
    <div className="min-h-screen bg-brand-cream p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href={`/admin/orders/${order.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown/60 transition hover:text-brand-orange"
          >
            <ArrowLeft size={16} />
            Retour à la commande
          </Link>

          <PrintButton />
        </div>

        <article className="rounded-2xl bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <p className="text-3xl font-bold text-brand-orange">OUSSEMA 3D</p>

              <p className="mt-2 text-sm text-brand-brown/50">
                Produits 3D & créations
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-brown/45">
                Facture
              </p>

              <p className="mt-2 text-xl font-bold text-brand-brown">
                {invoice.invoiceNo}
              </p>

              <p className="mt-1 text-sm text-brand-brown/50">
                Date :{" "}
                {new Date(
                  invoice.issuedAt ?? invoice.createdAt,
                ).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="my-10 h-px bg-brand-brown/10" />

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown/45">
                Facturé à
              </p>

              <p className="mt-3 font-semibold text-brand-brown">
                {order.customer.name}
              </p>

              <p className="mt-1 text-sm text-brand-brown/60">
                {order.customer.phone}
              </p>

              {order.customer.email && (
                <p className="mt-1 text-sm text-brand-brown/60">
                  {order.customer.email}
                </p>
              )}

              {order.customer.address && (
                <p className="mt-1 text-sm text-brand-brown/60">
                  {order.customer.address}
                </p>
              )}

              {order.customer.city && (
                <p className="text-sm text-brand-brown/60">
                  {order.customer.city}
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown/45">
                Commande
              </p>

              <p className="mt-3 font-mono text-xs text-brand-brown/60">
                {order.id}
              </p>

              <p className="mt-2 text-sm text-brand-brown/60">
                Statut : {order.status}
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-brand-brown/10">
            <table className="w-full">
              <thead className="bg-brand-cream/60">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Produit
                  </th>

                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Qté
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Prix
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-brand-brown/10">
                {order.items.map((item) => {
                  const productName =
                    item.product.translations[0]?.name ?? item.product.slug;

                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-4 text-sm font-semibold text-brand-brown">
                        {productName}
                      </td>

                      <td className="px-4 py-4 text-center text-sm text-brand-brown/60">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-brand-brown/60">
                        {Number(item.unitPrice).toFixed(2)} DT
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-brand-brown">
                        {(Number(item.unitPrice) * item.quantity).toFixed(2)} DT
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between border-t border-brand-brown/10 pt-4">
                <span className="font-semibold text-brand-brown">Total</span>

                <span className="text-2xl font-bold text-brand-orange">
                  {Number(order.total).toFixed(2)} DT
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-brand-brown/10 pt-6 text-center text-xs text-brand-brown/45">
            Merci pour votre confiance.
          </div>
        </article>
      </div>
    </div>
  );
}
