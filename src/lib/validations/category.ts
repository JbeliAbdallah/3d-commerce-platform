import { z } from "zod";

export const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Le slug doit contenir au moins 2 caractères.")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.",
    ),

  name: z
    .string()
    .trim()
    .min(1, "Le nom de la catégorie est obligatoire.")
    .max(200),

  description: z.string().trim().max(1000).optional(),

  sortOrder: z
    .number()
    .int("L'ordre doit être un nombre entier.")
    .min(0, "L'ordre ne peut pas être négatif."),

  isActive: z.boolean(),

  imageUrl: z
    .union([z.string().url("URL d'image invalide."), z.literal("")])
    .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
