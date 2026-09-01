import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import ArchiveProductButton from "@/components/products/ArchiveProductButton";
import { archiveProductAction } from "./archive-action";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
      category: {
        include: {
          translations: {
            where: {
              language: "fr",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
            Catalogue
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-brown">
            Produits
          </h1>

          <p className="mt-2 text-sm text-brand-brown/55">
            Gérez vos produits, prix et stocks.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-brown px-5 py-3 text-sm font-bold text-brand-cream transition-all hover:-translate-y-0.5 hover:bg-brand-orange"
        >
          <Plus size={18} />
          Ajouter un produit
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-surface">
        {products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-brand-brown">Aucun produit</p>

            <p className="mt-2 text-sm text-brand-brown/50">
              Commencez par ajouter votre premier produit.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-5 inline-flex rounded-xl bg-brand-orange px-5 py-3 text-sm font-bold text-white"
            >
              Ajouter un produit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-brand-brown/10 bg-brand-brown/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Produit
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Mis en avant
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-brown/50">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const translation = product.translations[0];
                  const category = product.category?.translations[0];

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-brand-brown/5 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-bold text-brand-brown hover:text-brand-orange"
                        >
                          {translation?.name ?? "Sans nom"}
                        </Link>

                        <p className="mt-1 text-xs text-brand-brown/40">
                          {product.slug}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-brand-brown/65">
                        {category?.name ?? "Sans catégorie"}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-brand-brown">
                        {product.price.toFixed(2)} DT
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`text-sm font-bold ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 5
                                ? "text-brand-orange"
                                : "text-brand-teal"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            product.status === "ACTIVE"
                              ? "bg-brand-teal/10 text-brand-teal"
                              : product.status === "DRAFT"
                                ? "bg-brand-orange/10 text-brand-orange"
                                : "bg-brand-brown/10 text-brand-brown/50"
                          }`}
                        >
                          {product.status === "ACTIVE"
                            ? "Actif"
                            : product.status === "DRAFT"
                              ? "Brouillon"
                              : "Archivé"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {product.featured ? (
                          <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
                            Oui
                          </span>
                        ) : (
                          <span className="text-sm text-brand-brown/35">
                            Non
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {product.status !== "ARCHIVED" ? (
                          <ArchiveProductButton
                            productId={product.id}
                            action={archiveProductAction}
                          />
                        ) : (
                          <span className="text-sm text-brand-brown/30">—</span>
                        )}
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
