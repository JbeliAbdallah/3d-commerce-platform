import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";

const links = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/products" },
  { label: "Catégories", href: "/categories" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-brown px-5 pb-6 pt-16 text-brand-cream lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-brand-cream/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-[-0.06em]">
                OUSSEMA
              </span>

              <span className="rounded-md bg-brand-orange px-2 py-1 text-sm font-bold tracking-wider">
                3D
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-brand-cream/55">
              Des créations 3D originales, des produits uniques et des idées qui
              prennent forme.
            </p>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-teal px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Navigation
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-brand-cream/65 transition-colors hover:text-brand-cream"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Contact
            </p>

            <div className="mt-5 space-y-3 text-sm text-brand-cream/65">
              <p>Tunis, Tunisie</p>
              <p>Disponible sur WhatsApp</p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-bold text-brand-cream"
              >
                Nous contacter
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-brand-cream/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Oussema 3D. Tous droits réservés.</p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-brand-cream"
            >
              Confidentialité
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-brand-cream"
            >
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
