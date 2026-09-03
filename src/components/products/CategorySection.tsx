import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Shapes } from "lucide-react";

const styles = [
  "bg-brand-orange text-white",
  "bg-brand-brown text-brand-cream",
  "bg-brand-peach text-brand-brown",
  "bg-brand-teal text-white",
  "bg-brand-cream text-brand-brown border border-brand-brown/10",
  "bg-brand-gray text-brand-brown",
];

export default async function CategorySection() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    take: 6,
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
    },
  });

  return (
    <section className="bg-brand-surface px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              Nos univers
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-extrabold tracking-[-0.04em] text-brand-brown sm:text-5xl">
              Explorez nos catégories.
            </h2>
          </div>

          <Link
            href="/categories"
            className="w-fit text-sm font-bold text-brand-brown underline decoration-brand-orange decoration-2 underline-offset-4 transition-colors hover:text-brand-orange"
          >
            Voir toutes les catégories →
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const translation = category.translations[0];
            const style = styles[index % styles.length];

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`group relative min-h-56 overflow-hidden rounded-[2rem] p-7 transition-transform duration-300 hover:-translate-y-1 ${style}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-white/15 p-3">
                      <Shapes size={24} strokeWidth={1.8} />
                    </div>

                    <span className="text-2xl opacity-60 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight">
                      {translation?.name ?? category.slug}
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 opacity-75">
                      {translation?.description ?? ""}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
