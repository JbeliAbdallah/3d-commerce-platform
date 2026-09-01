import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
            Catalogue
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-brown">
            Catégories
          </h1>

          <p className="mt-2 text-sm text-brand-brown/55">
            Organisez vos produits par catégories.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-brown px-5 py-3 text-sm font-bold text-brand-cream transition-all hover:-translate-y-0.5 hover:bg-brand-orange"
        >
          <Plus size={18} />
          Ajouter une catégorie
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-surface">
        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-brand-brown">
              Aucune catégorie
            </p>

            <p className="mt-2 text-sm text-brand-brown/50">
              Commencez par créer votre première catégorie.
            </p>

            <Link
              href="/admin/categories/new"
              className="mt-5 inline-flex rounded-xl bg-brand-orange px-5 py-3 text-sm font-bold text-white"
            >
              Ajouter une catégorie
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-brand-brown/10 bg-brand-brown/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Catégorie
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Produits
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Ordre
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => {
                  const translation = category.translations[0];

                  return (
                    <tr
                      key={category.id}
                      className="border-b border-brand-brown/5 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="font-bold text-brand-brown hover:text-brand-orange"
                        >
                          {translation?.name ?? "Sans nom"}
                        </Link>

                        <p className="mt-1 text-xs text-brand-brown/40">
                          {category.slug}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-brand-brown/65">
                        {category._count.products}
                      </td>

                      <td className="px-6 py-5 text-sm text-brand-brown/65">
                        {category.sortOrder}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            category.isActive
                              ? "bg-brand-teal/10 text-brand-teal"
                              : "bg-brand-brown/10 text-brand-brown/50"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
