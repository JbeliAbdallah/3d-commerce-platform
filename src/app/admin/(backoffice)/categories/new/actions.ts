"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validations/category";
import { getCurrentUser } from "@/lib/auth/session";

export async function createCategoryAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const result = categorySchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    sortOrder: Number(formData.get("sortOrder")),
    isActive: formData.get("isActive") === "true",
  });

  if (!result.success) {
    throw new Error("Données de la catégorie invalides.");
  }

  const data = result.data;

  const existingCategory = await prisma.category.findUnique({
    where: {
      slug: data.slug,
    },
    select: {
      id: true,
    },
  });

  if (existingCategory) {
    throw new Error("Ce slug est déjà utilisé.");
  }

  const category = await prisma.category.create({
    data: {
      slug: data.slug,
      sortOrder: data.sortOrder,
      isActive: data.isActive,

      translations: {
        create: {
          language: "fr",
          name: data.name,
          description: data.description || null,
        },
      },
    },
  });

  redirect(`/admin/categories/${category.id}/edit`);
}
