import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type SuccessPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order?: string }>;
};

export default async function SuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { slug } = await params;
  const { order } = await searchParams;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-cream px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
            <CheckCircle2 size={42} className="text-brand-orange" />
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-brand-orange">
            Commande reçue
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold text-brand-brown sm:text-5xl">
            Merci pour votre commande !
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-brand-brown/65">
            Votre demande a bien été enregistrée. Nous allons vous contacter
            prochainement pour confirmer les détails de votre commande.
          </p>

          {order ? (
            <div className="mx-auto mt-8 max-w-md rounded-2xl bg-brand-surface px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown/45">
                Référence de commande
              </p>
              <p className="mt-2 break-all font-mono text-sm text-brand-brown">
                {order}
              </p>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/products/${slug}`}
              className="inline-flex items-center justify-center rounded-full bg-brand-brown px-6 py-3 text-sm font-semibold text-brand-cream transition hover:bg-brand-brown/90"
            >
              Retour au produit
            </Link>

            <a
              href="https://wa.me/21654625291"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-orange/90"
            >
              <MessageCircle size={18} />
              Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
