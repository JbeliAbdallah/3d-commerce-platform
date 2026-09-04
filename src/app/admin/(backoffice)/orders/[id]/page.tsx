import Link from "next/link";
import { ArrowLeft, Phone, MapPin, Mail, MessageCircle } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { updateOrderStatusAction } from "./actions";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En préparation",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
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

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown/60 transition hover:text-brand-orange"
      >
        <ArrowLeft size={16} />
        Retour aux commandes
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Commande
          </p>

          <h1 className="mt-2 text-3xl font-bold text-brand-brown">
            Détails de la commande
          </h1>

          <p className="mt-2 font-mono text-xs text-brand-brown/45">
            {order.id}
          </p>
        </div>

        <form action={updateOrderStatusAction.bind(null, order.id)}>
          <select
            name="status"
            defaultValue={order.status}
            className="rounded-xl border border-brand-brown/10 bg-white px-4 py-3 text-sm font-semibold text-brand-brown outline-none focus:border-brand-orange"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="ml-2 rounded-xl bg-brand-orange px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange/90"
          >
            Mettre à jour
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-lg font-bold text-brand-brown">
            Produits commandés
          </h2>

          <div className="mt-6 divide-y divide-brand-brown/10">
            {order.items.map((item) => {
              const productName =
                item.product.translations[0]?.name ?? item.product.slug;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-brand-brown">
                      {productName}
                    </p>
                    <p className="mt-1 text-sm text-brand-brown/50">
                      Quantité : {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-brand-brown">
                    {(Number(item.unitPrice) * item.quantity).toFixed(2)} DT
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between border-t border-brand-brown/10 pt-5">
            <span className="font-semibold text-brand-brown/60">Total</span>
            <span className="text-xl font-bold text-brand-brown">
              {Number(order.total).toFixed(2)} DT
            </span>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6">
          <h2 className="text-lg font-bold text-brand-brown">
            Informations client
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="font-semibold text-brand-brown">
                {order.customer.name}
              </p>
            </div>

            <div className="flex gap-3 text-sm text-brand-brown/65">
              <Phone size={18} className="shrink-0 text-brand-orange" />
              <span>{order.customer.phone}</span>
            </div>

            <a
              href={`https://wa.me/21654625291?text=${encodeURIComponent(
                `Bonjour ${order.customer.name}, concernant votre commande ${order.id}.`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange/90"
            >
              <MessageCircle size={18} />
              Contacter sur WhatsApp
            </a>

            {order.customer.email && (
              <div className="flex gap-3 text-sm text-brand-brown/65">
                <Mail size={18} className="shrink-0 text-brand-orange" />
                <span>{order.customer.email}</span>
              </div>
            )}

            {(order.customer.address || order.customer.city) && (
              <div className="flex gap-3 text-sm text-brand-brown/65">
                <MapPin size={18} className="shrink-0 text-brand-orange" />
                <span>
                  {order.customer.address}
                  {order.customer.address && order.customer.city ? ", " : ""}
                  {order.customer.city}
                </span>
              </div>
            )}
          </div>

          {order.customerNotes && (
            <div className="mt-6 rounded-xl bg-brand-cream/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown/45">
                Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-brand-brown/70">
                {order.customerNotes}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
