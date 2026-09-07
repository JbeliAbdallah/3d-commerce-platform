import Link from "next/link";
import { Package, AlertTriangle, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export default async function InventoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    where: {
      status: {
        not: "ARCHIVED",
      },
    },
    orderBy: {
      stock: "asc",
    },
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
    },
  });

  const totalProducts = products.length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
          Stock
        </p>

        <h1 className="mt-2 text-3xl font-bold text-brand-brown">
          Gestion du stock
        </h1>

        <p className="mt-2 text-sm text-brand-brown/60">
          Consultez rapidement les niveaux de stock de vos produits.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6">
          <Package className="text-brand-orange" size={24} />

          <p className="mt-4 text-sm text-brand-brown/50">Produits actifs</p>

          <p className="mt-1 text-3xl font-bold text-brand-brown">
            {totalProducts}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <AlertTriangle className="text-brand-orange" size={24} />

          <p className="mt-4 text-sm text-brand-brown/50">Stock faible</p>

          <p className="mt-1 text-3xl font-bold text-brand-brown">{lowStock}</p>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <XCircle className="text-brand-brown/50" size={24} />

          <p className="mt-4 text-sm text-brand-brown/50">Rupture de stock</p>

          <p className="mt-1 text-3xl font-bold text-brand-brown">
            {outOfStock}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-brand-brown/10 bg-brand-cream/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Produit
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Prix
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Stock
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Statut
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brand-brown/50">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-brown/10">
              {products.map((product) => {
                const name = product.translations[0]?.name ?? product.slug;

                const stockLabel =
                  product.stock === 0
                    ? "Rupture"
                    : product.stock <= 5
                      ? "Faible"
                      : "Disponible";

                return (
                  <tr key={product.id} className="hover:bg-brand-cream/20">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-brand-brown">{name}</p>
                    </td>

                    <td className="px-6 py-5 text-sm text-brand-brown/70">
                      {Number(product.price).toFixed(2)} DT
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold text-brand-brown">
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
                        {stockLabel}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/products/${product.id}/edit?returnTo=/admin/inventory`}
                        className="text-sm font-semibold text-brand-brown transition hover:text-brand-orange"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm text-brand-brown/50"
                  >
                    Aucun produit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
