import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

const products = [
  {
    name: "Lampe Lune 3D",
    category: "Éclairage",
    price: "89 DT",
    accent: "bg-brand-peach",
    shape: "rounded-full",
  },
  {
    name: "Support Design 3D",
    category: "Accessoires",
    price: "35 DT",
    accent: "bg-brand-orange",
    shape: "rounded-[2rem]",
  },
  {
    name: "Figurine Personnalisée",
    category: "Personnalisés",
    price: "À partir de 60 DT",
    accent: "bg-brand-teal",
    shape: "rounded-[2rem]",
  },
  {
    name: "Objet Décoratif 3D",
    category: "Décoration 3D",
    price: "45 DT",
    accent: "bg-brand-brown",
    shape: "rounded-[3rem]",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              Sélection
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-brand-brown sm:text-5xl">
              Nos produits phares.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-brand-brown/60">
              Découvrez quelques-unes de nos créations et trouvez celle qui vous
              correspond.
            </p>
          </div>

          <Link
            href="/products"
            className="flex w-fit items-center gap-2 text-sm font-bold text-brand-brown underline decoration-brand-orange decoration-2 underline-offset-4 transition-colors hover:text-brand-orange"
          >
            Voir tous les produits
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="group">
              {/* Product visual */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-surface">
                <div
                  className={`absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${product.accent} ${product.shape}`}
                />

                <div className="absolute left-6 top-6 rounded-full bg-brand-cream/80 px-3 py-1.5 text-xs font-bold text-brand-brown backdrop-blur-sm">
                  {product.category}
                </div>

                <button
                  type="button"
                  aria-label={`Ajouter ${product.name}`}
                  className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-brand-brown text-brand-cream shadow-lg transition-transform hover:scale-105"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>

              {/* Product information */}
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-brand-brown">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-brand-brown/50">
                    {product.category}
                  </p>
                </div>

                <p className="whitespace-nowrap text-sm font-extrabold text-brand-orange">
                  {product.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
