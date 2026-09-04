import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db/prisma";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
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
      },
    },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const translation = product.translations[0];
  const categoryTranslation = product.category?.translations[0];
  const mainImage = product.images[0];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-cream px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-brown/55 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft size={16} />
            Retour aux produits
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Images */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-brand-surface">
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt ?? translation?.name ?? product.slug}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm font-bold text-brand-brown/30">
                      Aucune image
                    </span>
                  </div>
                )}
              </div>

              {product.images.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-xl bg-brand-surface"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Information */}
            <div className="flex flex-col justify-center">
              {categoryTranslation ? (
                <Link
                  href={`/categories/${product.category?.slug}`}
                  className="w-fit text-sm font-bold uppercase tracking-[0.2em] text-brand-orange transition-colors hover:text-brand-brown"
                >
                  {categoryTranslation.name}
                </Link>
              ) : null}

              <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-brand-brown sm:text-5xl">
                {translation?.name ?? product.slug}
              </h1>

              <p className="mt-5 text-2xl font-extrabold text-brand-orange">
                {Number(product.price).toFixed(2)} DT
              </p>

              {translation?.description ? (
                <div className="mt-8 border-t border-brand-brown/10 pt-8">
                  <p className="whitespace-pre-line text-base leading-8 text-brand-brown/65">
                    {translation.description}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 rounded-2xl bg-brand-surface p-5">
                <p className="text-sm font-bold text-brand-brown">
                  Disponibilité
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    product.stock > 0 ? "text-brand-teal" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `En stock (${product.stock})`
                    : "Rupture de stock"}
                </p>
              </div>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-brand-brown px-7 py-4 text-sm font-bold text-brand-cream transition-all hover:-translate-y-1 hover:bg-brand-orange hover:shadow-lg"
              >
                <MessageCircle size={19} />
                Commander via WhatsApp
              </a>

              <p className="mt-4 text-xs leading-5 text-brand-brown/45">
                Contactez-nous pour confirmer la disponibilité et les détails de
                votre commande.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
