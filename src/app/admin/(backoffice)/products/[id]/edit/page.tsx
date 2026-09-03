import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { prisma } from "@/lib/db/prisma";
import { updateProductAction } from "./actions";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id,
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
    }),

    prisma.category.findMany({
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
    }),
  ]);

  if (!product) {
    notFound();
  }

  const translation = product.translations[0];

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.translations[0]?.name ?? category.slug,
  }));

  const action = updateProductAction.bind(null, product.id);

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
          Modifier le produit
        </h1>

        <p className="mt-2 text-sm text-brand-brown/55">
          Modifiez les informations de votre produit.
        </p>
      </div>

      <div className="mt-8">
        <ProductForm
          categories={categoryOptions}
          action={action}
          mode="edit"
          defaultValues={{
            slug: product.slug,
            price: Number(product.price),
            stock: product.stock,
            categoryId: product.categoryId ?? "",
            status: product.status,
            featured: product.featured,
            imageUrl: product.images[0]?.url,
            translations: {
              fr: {
                name: translation?.name ?? "",
                shortDesc: translation?.shortDesc ?? "",
                description: translation?.description ?? "",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
