import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/categories/CategoryForm";
import { createCategoryAction } from "./actions";

export default function NewCategoryPage() {
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
          Ajouter une catégorie
        </h1>

        <p className="mt-2 text-sm text-brand-brown/55">
          Créez une nouvelle catégorie pour organiser vos produits.
        </p>
      </div>

      <div className="mt-8">
        <CategoryForm action={createCategoryAction} />
      </div>
    </div>
  );
}
