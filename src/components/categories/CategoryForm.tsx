"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategoryFormData,
} from "@/lib/validations/category";

type CategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: CategoryFormData;
};

export default function CategoryForm({
  action,
  defaultValues,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? {
      slug: "",
      name: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    const formData = new FormData();

    formData.set("slug", data.slug);
    formData.set("name", data.name);
    formData.set("description", data.description ?? "");
    formData.set("sortOrder", String(data.sortOrder));
    formData.set("isActive", String(data.isActive));

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
            Catégorie
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          <Field
            label="Nom de la catégorie *"
            error={errors.name?.message}
            {...register("name")}
            placeholder="Lampes"
          />

          <Field
            label="Slug *"
            error={errors.slug?.message}
            {...register("slug")}
            placeholder="lampes"
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-brand-brown">
              Description
            </label>

            <textarea
              rows={5}
              {...register("description")}
              placeholder="Décrivez cette catégorie..."
              className="w-full resize-y rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />

            {errors.description?.message && (
              <p className="mt-1.5 text-xs font-semibold text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Ordre d'affichage"
              type="number"
              min="0"
              error={errors.sortOrder?.message}
              {...register("sortOrder", { valueAsNumber: true })}
            />

            <label className="flex items-center gap-3 self-end rounded-xl border border-brand-brown/10 bg-brand-cream px-4 py-3">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 accent-brand-orange"
              />

              <span className="text-sm font-bold text-brand-brown">
                Catégorie active
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-brand-brown/10 bg-brand-surface p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Médias
          </p>

          <h2 className="mt-2 text-xl font-extrabold text-brand-brown">
            Image de catégorie
          </h2>

          <p className="mt-2 text-sm text-brand-brown/50">
            L&apos;upload Cloudinary sera connecté lorsque le compte du client
            sera disponible.
          </p>
        </div>

        <div className="mt-6 flex min-h-32 items-center justify-center rounded-xl border-2 border-dashed border-brand-brown/10 bg-brand-cream">
          <p className="text-sm font-semibold text-brand-brown/40">
            Upload d&apos;image — bientôt disponible
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-brand-brown px-7 py-3.5 text-sm font-bold text-brand-cream transition-all hover:-translate-y-0.5 hover:bg-brand-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : "Créer la catégorie"}
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
