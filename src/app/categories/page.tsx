import Link from "next/link";
import { Shapes } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-brand-cream px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
            Nos univers
          </p>

          <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.04em] text-brand-brown sm:text-6xl">
            Toutes nos catégories.
          </h1>

          <p className="mt-6 text-lg leading-8 text-brand-brown/60">
            Explorez nos différentes collections et découvrez des créations
            uniques.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const translation = category.translations[0];

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group min-h-64 rounded-[2rem] bg-brand-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-brand-orange p-3 text-white">
                      <Shapes size={24} strokeWidth={1.8} />
                    </div>

                    <span className="text-2xl text-brand-brown/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-orange">
                      →
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-brand-brown">
                      {translation?.name ?? category.slug}
                    </h2>

                    {translation?.description ? (
                      <p className="mt-2 text-sm leading-6 text-brand-brown/60">
                        {translation.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 ? (
          <div className="mt-14 rounded-[2rem] bg-brand-surface p-10 text-center">
            <p className="font-semibold text-brand-brown/60">
              Aucune catégorie disponible pour le moment.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
