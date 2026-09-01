import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/categories/CategoryForm";
import { prisma } from "@/lib/db/prisma";
import { updateCategoryAction } from "./actions";

type EditCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      translations: {
        where: {
          language: "fr",
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const translation = category.translations[0];

  const action = updateCategoryAction.bind(null, category.id);

  return (
    <div>
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown/55 transition-colors hover:text-brand-orange"
      >
        <ArrowLeft size={16} />
        Retour aux catégories
      </Link>

      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
          Catalogue
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-brown">
          Modifier la catégorie
        </h1>

        <p className="mt-2 text-sm text-brand-brown/55">
          Modifiez les informations de votre catégorie.
        </p>
      </div>

      <div className="mt-8">
        <CategoryForm
          action={action}
          mode="edit"
          defaultValues={{
            slug: category.slug,
            name: translation?.name ?? "",
            description: translation?.description ?? "",
            sortOrder: category.sortOrder,
            isActive: category.isActive,
          }}
        />
      </div>
    </div>
  );
}
