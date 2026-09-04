import { z } from "zod";

export const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100),

  phone: z
    .string()
    .trim()
    .min(8, "Le numéro de téléphone est invalide.")
    .max(30),

  email: z
    .string()
    .trim()
    .email("Adresse e-mail invalide.")
    .optional()
    .or(z.literal("")),

  address: z.string().trim().max(300).optional().or(z.literal("")),

  city: z.string().trim().max(100).optional().or(z.literal("")),

  quantity: z
    .number()
    .int("La quantité doit être un nombre entier.")
    .min(1, "La quantité doit être au moins 1."),

  customerNotes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type OrderFormData = z.infer<typeof orderSchema>;
