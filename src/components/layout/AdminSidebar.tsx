"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  FileText,
  FolderOpen,
  LogOut,
  Menu,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    label: "Produits",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    label: "Catégories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    label: "Commandes",
    href: "/admin/orders",
    icon: Boxes,
  },
  {
    label: "Clients",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Factures",
    href: "/admin/invoices",
    icon: FileText,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-brown text-brand-cream shadow-lg lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-brand-brown/40 lg:hidden"
          aria-label="Fermer le menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-brand-brown text-brand-cream transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-brand-cream/10 px-6">
          <Link
            href="/admin/dashboard"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2"
          >
            <span className="text-xl font-extrabold tracking-[-0.06em]">
              OUSSEMA
            </span>

            <span className="rounded-md bg-brand-orange px-2 py-1 text-xs font-bold tracking-wider">
              3D
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="lg:hidden"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-8">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cream/35">
            Administration
          </p>

          <nav className="mt-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-orange text-brand-brown"
                      : "text-brand-cream/60 hover:bg-brand-cream/5 hover:text-brand-cream"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-brand-cream/10 p-4">
          <Link
            href="/"
            className="mb-2 block rounded-xl px-3 py-3 text-sm text-brand-cream/50 transition-colors hover:bg-brand-cream/5 hover:text-brand-cream"
          >
            ← Voir le site
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-brand-cream/60 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
