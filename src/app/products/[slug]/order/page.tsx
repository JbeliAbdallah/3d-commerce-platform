import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db/prisma";
import OrderForm from "@/components/orders/OrderForm";
import { createOrderAction } from "./actions";
import Image from "next/image";

type OrderPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
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
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const translation = product.translations[0];
  const image = product.images[0];

  const action = createOrderAction.bind(null, product.id, product.slug);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-cream px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-brown/55 transition-colors hover:text-brand-orange"
          >
            <ArrowLeft size={16} />
            Retour au produit
          </Link>

          <div className="mt-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              Commander
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-brand-brown sm:text-5xl">
              Finaliser votre commande
            </h1>

            <p className="mt-4 text-base leading-7 text-brand-brown/60">
              Renseignez vos informations et nous vous contacterons pour
              confirmer votre commande.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] bg-brand-surface p-6">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.alt ?? translation?.name ?? product.slug}
                  width={800}
                  height={800}
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              ) : null}

              <div className="mt-6">
                <h2 className="text-xl font-extrabold text-brand-brown">
                  {translation?.name ?? product.slug}
                </h2>

                <p className="mt-2 text-lg font-extrabold text-brand-orange">
                  {Number(product.price).toFixed(2)} DT
                </p>
              </div>
            </div>

            <OrderForm action={action} maxQuantity={product.stock} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
