import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-[-0.06em] text-brand-brown">
              OUSSEMA
            </span>

            <span className="rounded-md bg-brand-orange px-2 py-1 text-sm font-bold tracking-wider text-white">
              3D
            </span>
          </div>

          <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-brand-brown">
            Backoffice
          </h1>

          <p className="mt-2 text-sm text-brand-brown/55">
            Connectez-vous pour gérer votre boutique.
          </p>
        </div>

        <div className="rounded-[2rem] border border-brand-brown/10 bg-brand-surface p-7 shadow-xl sm:p-9">
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-700"
            >
              {error === "missing"
                ? "Veuillez remplir tous les champs."
                : "Email ou mot de passe incorrect."}
            </div>
          )}

          <form action={loginAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-brand-brown"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@oussema3d.local"
                className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-brand-brown"
              >
                Mot de passe
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-brown px-5 py-3.5 text-sm font-bold text-brand-cream transition-all hover:-translate-y-0.5 hover:bg-brand-orange"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
