import { ArrowUpRight, MessageCircle } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-orange px-7 py-14 sm:px-12 lg:px-16 lg:py-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-peach/40 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-brand-brown/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-brown/60">
                Une idée en tête ?
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-brand-brown sm:text-5xl">
                Parlons de votre prochain projet.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-brand-brown/65">
                Une création personnalisée, une question sur un produit ou
                simplement envie d&apos;en savoir plus ? Écrivez-nous.
              </p>
            </div>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-3 rounded-full bg-brand-brown px-6 py-4 text-sm font-bold text-brand-cream transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <MessageCircle size={19} />
              Nous écrire sur WhatsApp
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
