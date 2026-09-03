import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db/prisma";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
      products: {
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
          images: {
            orderBy: {
              sortOrder: "asc",
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  const translation = category.translations[0];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-cream px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-brown/55 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft size={16} />
            Toutes les catégories
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              Catégorie
            </p>

            <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.04em] text-brand-brown sm:text-6xl">
              {translation?.name ?? category.slug}
            </h1>

            {translation?.description ? (
              <p className="mt-6 text-lg leading-8 text-brand-brown/60">
                {translation.description}
              </p>
            ) : null}
          </div>

          {category.products.length > 0 ? (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {category.products.map((product) => {
                const productTranslation = product.translations[0];
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
                          alt={
                            image.alt ??
                            productTranslation?.name ??
                            product.slug
                          }
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-brand-brown/30">
                          <span className="text-sm font-bold">
                            Aucune image
                          </span>
                        </div>
                      )}

                      <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream/90 text-brand-brown shadow-sm backdrop-blur-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-extrabold text-brand-brown">
                          {productTranslation?.name ?? product.slug}
                        </h2>

                        {productTranslation?.shortDesc ? (
                          <p className="mt-1 text-sm text-brand-brown/50">
                            {productTranslation.shortDesc}
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
              <p className="font-semibold text-brand-brown/60">
                Aucun produit disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
