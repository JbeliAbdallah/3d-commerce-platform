import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { createProductAction } from "./actions";
import { prisma } from "@/lib/db/prisma";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.translations[0]?.name ?? category.slug,
  }));

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown/55 transition-colors hover:text-brand-orange"
      >
        <ArrowLeft size={16} />
        Retour aux produits
      </Link>

      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
          Catalogue
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-brown">
          Ajouter un produit
        </h1>

        <p className="mt-2 text-sm text-brand-brown/55">
          Créez un nouveau produit dans votre catalogue.
        </p>
      </div>

      <div className="mt-8">
        <ProductForm
          categories={categoryOptions}
          action={createProductAction}
        />
      </div>
    </div>
  );
}
