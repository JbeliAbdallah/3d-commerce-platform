"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderFormData } from "@/lib/validations/order";

type OrderFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  maxQuantity: number;
};

export default function OrderForm({ action, maxQuantity }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      quantity: 1,
      customerNotes: "",
    },
  });

  const onSubmit = (data: OrderFormData) => {
    const formData = new FormData();

    formData.set("customerName", data.customerName);
    formData.set("phone", data.phone);
    formData.set("email", data.email ?? "");
    formData.set("address", data.address ?? "");
    formData.set("city", data.city ?? "");
    formData.set("quantity", String(data.quantity));
    formData.set("customerNotes", data.customerNotes ?? "");

    return action(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[2rem] bg-brand-surface p-6 sm:p-8"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
          Vos informations
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-brand-brown">
          Où pouvons-nous vous contacter ?
        </h2>
      </div>

      <div className="mt-8 space-y-5">
        <Field
          label="Nom complet *"
          error={errors.customerName?.message}
          {...register("customerName")}
          placeholder="Votre nom et prénom"
        />

        <Field
          label="Téléphone *"
          error={errors.phone?.message}
          {...register("phone")}
          placeholder="20 000 000"
          type="tel"
        />

        <Field
          label="E-mail"
          error={errors.email?.message}
          {...register("email")}
          placeholder="vous@example.com"
          type="email"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Ville"
            error={errors.city?.message}
            {...register("city")}
            placeholder="Tunis"
          />

          <Field
            label="Quantité *"
            error={errors.quantity?.message}
            {...register("quantity", { valueAsNumber: true })}
            type="number"
            min="1"
            max={maxQuantity}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-brand-brown">
            Adresse
          </label>

          <textarea
            rows={3}
            {...register("address")}
            placeholder="Votre adresse de livraison..."
            className="w-full resize-y rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />

          {errors.address?.message ? (
            <p className="mt-1.5 text-xs font-semibold text-red-600">
              {errors.address.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-brand-brown">
            Remarque
          </label>

          <textarea
            rows={4}
            {...register("customerNotes")}
            placeholder="Une précision concernant votre commande..."
            className="w-full resize-y rounded-xl border border-brand-brown/15 bg-brand-cream px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />

          {errors.customerNotes?.message ? (
            <p className="mt-1.5 text-xs font-semibold text-red-600">
              {errors.customerNotes.message}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || maxQuantity === 0}
        className="mt-8 w-full rounded-full bg-brand-brown px-7 py-4 text-sm font-bold text-brand-cream transition-all hover:-translate-y-0.5 hover:bg-brand-orange hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Envoi de la commande..." : "Confirmer la commande"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-brand-brown/45">
        Aucun paiement en ligne. Nous vous contacterons pour confirmer votre
        commande.
      </p>
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

      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
