"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/validations/product";

type Category = {
  id: string;
  name: string;
};

type ProductFormProps = {
  categories: Category[];
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: ProductFormData;
};

export default function ProductForm({
  categories,
  action,
  defaultValues,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? {
      slug: "",
      price: 0,
      stock: 0,
      categoryId: "",
      status: "DRAFT",
      featured: false,
      translations: {
        fr: {
          name: "",
          shortDesc: "",
          description: "",
        },
      },
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();

    formData.set("slug", data.slug);
    formData.set("price", String(data.price));
    formData.set("stock", String(data.stock));
    formData.set("categoryId", data.categoryId ?? "");
    formData.set("status", data.status);
    formData.set("featured", String(data.featured));

    formData.set("frName", data.translations.fr.name);
    formData.set("frShortDesc", data.translations.fr.shortDesc);
    formData.set("frDescription", data.translations.fr.description);

    return action(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="rounded-[1.5rem] border border-brand-brown/10 bg-brand-surface p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Informations
          </p>

          <h2 className="mt-2 text-xl font-extrabold text-brand-brown">
            Produit
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            label="Slug"
            error={errors.slug?.message}
            {...register("slug")}
            placeholder="lampe-lune-3d"
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-brand-brown">
              Catégorie
            </label>

            <select
              {...register("categoryId")}
              className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            >
              <option value="">Sans catégorie</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="Prix (DT)"
            type="number"
            step="0.01"
            min="0"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />

          <Field
            label="Stock"
            type="number"
            min="0"
            error={errors.stock?.message}
            {...register("stock", { valueAsNumber: true })}
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-brand-brown">
              Statut
            </label>

            <select
              {...register("status")}
              className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="ACTIVE">Actif</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>

          <label className="flex items-center gap-3 self-end rounded-xl border border-brand-brown/10 bg-brand-cream px-4 py-3">
            <input
              type="checkbox"
              {...register("featured")}
              className="h-4 w-4 accent-brand-orange"
            />

            <span className="text-sm font-bold text-brand-brown">
              Produit mis en avant
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-brand-brown/10 bg-brand-surface p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Contenu
          </p>

          <h2 className="mt-2 text-xl font-extrabold text-brand-brown">
            Informations du produit
          </h2>

          <p className="mt-2 text-sm text-brand-brown/50">
            Ces informations seront affichées sur le site en français.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <Field
            label="Nom du produit *"
            error={errors.translations?.fr?.name?.message}
            {...register("translations.fr.name")}
            placeholder="Lampe Lune 3D"
          />

          <Field
            label="Description courte"
            error={errors.translations?.fr?.shortDesc?.message}
            {...register("translations.fr.shortDesc")}
            placeholder="Une lampe décorative imprimée en 3D."
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-brand-brown">
              Description complète
            </label>

            <textarea
              rows={6}
              {...register("translations.fr.description")}
              placeholder="Décrivez le produit, ses caractéristiques et ses particularités..."
              className="w-full resize-y rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />

            {errors.translations?.fr?.description?.message && (
              <p className="mt-1.5 text-xs font-semibold text-red-600">
                {errors.translations.fr.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-brand-brown/10 bg-brand-surface p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Médias
          </p>

          <h2 className="mt-2 text-xl font-extrabold text-brand-brown">
            Images du produit
          </h2>

          <p className="mt-2 text-sm text-brand-brown/50">
            L&apos;upload Cloudinary sera connecté ici lorsque le compte du
            client sera disponible.
          </p>
        </div>

        <div className="mt-6 flex min-h-32 items-center justify-center rounded-xl border-2 border-dashed border-brand-brown/10 bg-brand-cream">
          <p className="text-sm font-semibold text-brand-brown/40">
            Upload d&apos;images — bientôt disponible
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-brand-brown px-7 py-3.5 text-sm font-bold text-brand-cream transition-all hover:-translate-y-0.5 hover:bg-brand-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

function Field({ label, error, ...props }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-brand-brown">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
      />

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
}
