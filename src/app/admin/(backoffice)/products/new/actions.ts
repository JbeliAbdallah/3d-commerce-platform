"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { productSchema } from "@/lib/validations/product";
import { getCurrentUser } from "@/lib/auth/session";

export async function createProductAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const result = productSchema.safeParse({
    slug: formData.get("slug"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status"),
    featured: formData.get("featured") === "true",

    translations: {
      fr: {
        name: formData.get("frName"),
        shortDesc: formData.get("frShortDesc"),
        description: formData.get("frDescription"),
      },
    },
  });

  if (!result.success) {
    throw new Error("Données du produit invalides.");
  }

  const data = result.data;

  const product = await prisma.product.create({
    data: {
      slug: data.slug,
      price: data.price,
      stock: data.stock,
      status: data.status,
      featured: data.featured,
      categoryId: data.categoryId || null,

      translations: {
        create: {
          language: "fr",
          name: data.translations.fr.name,
          shortDesc: data.translations.fr.shortDesc || null,
          description: data.translations.fr.description || null,
        },
      },
    },
  });

  redirect(`/admin/products/${product.id}/edit`);
}
