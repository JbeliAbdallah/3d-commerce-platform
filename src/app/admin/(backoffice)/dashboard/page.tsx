import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-brand-cream px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-brand-brown p-8 text-brand-cream sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
            Backoffice
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Bonjour, {user.name}
          </h1>

          <p className="mt-3 text-brand-cream/60">
            Bienvenue dans votre espace d&apos;administration.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Produits", "0"],
            ["Catégories", "0"],
            ["Commandes", "0"],
            ["Clients", "0"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-brand-brown/10 bg-brand-surface p-6"
            >
              <p className="text-sm text-brand-brown/50">{label}</p>
              <p className="mt-3 text-3xl font-extrabold text-brand-brown">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
