import Link from "next/link";
import { ArrowLeft, FileText, MessageCircle } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

type CustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
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

  const whatsappNumber = customer.phone.replace(/\D/g, "");

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown/55 transition-colors hover:text-brand-orange"
      >
        <ArrowLeft size={16} />
        Retour aux clients
      </Link>

      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
          Relation client
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-brown">
          {customer.name}
        </h1>

        <p className="mt-2 text-sm text-brand-brown/55">
          Historique et informations du client.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-brand-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">
            Téléphone
          </p>
          <p className="mt-2 font-bold text-brand-brown">{customer.phone}</p>

          {customer.email ? (
            <>
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-brand-brown/40">
                E-mail
              </p>
              <p className="mt-2 break-all text-sm text-brand-brown/65">
                {customer.email}
              </p>
            </>
          ) : null}
        </div>

        <div className="rounded-[2rem] bg-brand-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">
            Commandes
          </p>
          <p className="mt-2 text-3xl font-extrabold text-brand-brown">
            {customer.orders.length}
          </p>
        </div>

        <div className="rounded-[2rem] bg-brand-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">
            Total dépensé
          </p>
          <p className="mt-2 text-3xl font-extrabold text-brand-brown">
            {totalSpent.toFixed(2)} DT
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[2rem] bg-brand-surface p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">
              Contact
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-brand-brown">
              Contacter le client
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/customers/${customer.id}/statement`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-brown px-5 py-3 text-sm font-bold text-brand-cream transition hover:bg-brand-orange"
            >
              <FileText size={18} />
              Relevé client
            </Link>

            <a
              href={`https://wa.me/216${whatsappNumber.replace(/^216/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-orange/90"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>

        {customer.city || customer.address ? (
          <div className="mt-6 rounded-2xl bg-brand-cream p-5">
            {customer.city ? (
              <p className="text-sm text-brand-brown/70">
                <span className="font-bold text-brand-brown">Ville :</span>{" "}
                {customer.city}
              </p>
            ) : null}

            {customer.address ? (
              <p className="mt-2 text-sm text-brand-brown/70">
                <span className="font-bold text-brand-brown">Adresse :</span>{" "}
                {customer.address}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-5 rounded-[2rem] bg-brand-surface p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">
            Historique
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-brown">
            Commandes du client
          </h2>
        </div>

        {customer.orders.length === 0 ? (
          <p className="mt-6 text-sm text-brand-brown/50">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-brand-brown/10 bg-brand-cream p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-bold text-brand-brown">
                      Commande #{order.id}
                    </p>

                    <p className="mt-1 text-xs text-brand-brown/45">
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                      }).format(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
                      {order.status}
                    </span>

                    <span className="font-extrabold text-brand-brown">
                      {Number(order.total).toFixed(2)} DT
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-brand-brown/10 pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-brand-brown/65">
                        {item.product.translations[0]?.name ??
                          item.product.slug}{" "}
                        × {item.quantity}
                      </span>

                      <span className="font-semibold text-brand-brown">
                        {(Number(item.unitPrice) * item.quantity).toFixed(2)} DT
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-teal transition-colors hover:text-brand-orange"
                >
                  Voir la commande →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
