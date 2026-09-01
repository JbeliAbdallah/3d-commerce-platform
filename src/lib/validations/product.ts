import { z } from "zod";

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Le slug doit contenir au moins 2 caractères.")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.",
    ),

  price: z.number().finite().min(0, "Le prix ne peut pas être négatif."),

  stock: z
    .number()
    .int("Le stock doit être un nombre entier.")
    .min(0, "Le stock ne peut pas être négatif."),

  categoryId: z.string().optional(),

  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),

  featured: z.boolean(),

  translations: z.object({
    fr: z.object({
      name: z
        .string()
        .trim()
        .min(1, "Le nom du produit est obligatoire.")
        .max(200),

      shortDesc: z.string().trim().max(500),

      description: z.string().trim().max(5000),
    }),
  }),
});

export type ProductFormData = z.infer<typeof productSchema>;
