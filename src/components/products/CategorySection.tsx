import Link from "next/link";
import { Box, Gift, Heart, Lamp, Shapes, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Décoration 3D",
    description: "Des pièces originales pour votre intérieur.",
    icon: Shapes,
    className: "bg-brand-orange text-white",
  },
  {
    name: "Figurines",
    description: "Des créations qui donnent vie à vos idées.",
    icon: Box,
    className: "bg-brand-brown text-brand-cream",
  },
  {
    name: "Cadeaux",
    description: "Des idées uniques pour faire plaisir.",
    icon: Gift,
    className: "bg-brand-peach text-brand-brown",
  },
  {
    name: "Accessoires",
    description: "Des objets pratiques avec du caractère.",
    icon: Sparkles,
    className: "bg-brand-teal text-white",
  },
  {
    name: "Personnalisés",
    description: "Votre idée, notre création.",
    icon: Heart,
    className: "bg-brand-cream text-brand-brown border border-brand-brown/10",
  },
  {
    name: "Éclairage",
    description: "Des créations lumineuses et originales.",
    icon: Lamp,
    className: "bg-brand-gray text-brand-brown",
  },
];

export default function CategorySection() {
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
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href="/categories"
                className={`group relative min-h-56 overflow-hidden rounded-[2rem] p-7 transition-transform duration-300 hover:-translate-y-1 ${category.className}`}
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-white/15 p-3">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <span className="text-2xl opacity-60 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight">
                      {category.name}
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 opacity-75">
                      {category.description}
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
