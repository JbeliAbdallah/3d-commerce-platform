import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
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
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-cream px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              Notre catalogue
            </p>

            <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.04em] text-brand-brown sm:text-6xl">
              Découvrez nos produits.
            </h1>

            <p className="mt-6 text-lg leading-8 text-brand-brown/60">
              Découvrez notre sélection de créations 3D et trouvez le produit
              qui vous correspond.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => {
                const translation = product.translations[0];
                const categoryTranslation = product.category?.translations[0];
                const image = product.images[0];

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-surface">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.alt ?? translation?.name ?? product.slug}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm font-bold text-brand-brown/30">
                            Aucune image
                          </span>
                        </div>
                      )}

                      {categoryTranslation ? (
                        <span className="absolute left-5 top-5 rounded-full bg-brand-cream/90 px-3 py-1.5 text-xs font-bold text-brand-brown backdrop-blur-sm">
                          {categoryTranslation.name}
                        </span>
                      ) : null}

                      <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-brand-brown text-brand-cream shadow-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-extrabold text-brand-brown">
                          {translation?.name ?? product.slug}
                        </h2>

                        {translation?.shortDesc ? (
                          <p className="mt-1 text-sm text-brand-brown/50">
                            {translation.shortDesc}
                          </p>
                        ) : null}
                      </div>

                      <p className="whitespace-nowrap text-sm font-extrabold text-brand-orange">
                        {Number(product.price).toFixed(2)} DT
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-14 rounded-[2rem] bg-brand-surface p-12 text-center">
              <p className="text-lg font-bold text-brand-brown">
                Aucun produit disponible
              </p>

              <p className="mt-2 text-sm text-brand-brown/50">
                Revenez bientôt pour découvrir nos créations.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
