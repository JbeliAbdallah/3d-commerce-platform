"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/products" },
  { label: "Catégories", href: "/categories" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-brown/10 bg-brand-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-2xl font-extrabold tracking-[-0.06em] text-brand-brown">
            OUSSEMA
          </span>
          <span className="rounded-md bg-brand-orange px-2 py-1 text-sm font-bold tracking-wider text-white">
            3D
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-brand-brown/75 transition-colors hover:text-brand-orange"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-full border border-brand-brown/15 px-4 py-2 text-sm font-semibold text-brand-brown transition-colors hover:bg-brand-brown hover:text-brand-cream"
          >
            FR
          </button>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-full p-2 text-brand-brown md:hidden"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-brand-brown/10 bg-brand-cream px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold text-brand-brown transition-colors hover:bg-brand-peach/40"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex gap-2 border-t border-brand-brown/10 pt-4">
              <button
                type="button"
                className="rounded-full border border-brand-brown/15 px-4 py-2 text-sm font-semibold"
              >
                FR
              </button>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-teal py-2.5 text-sm font-bold text-white"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
