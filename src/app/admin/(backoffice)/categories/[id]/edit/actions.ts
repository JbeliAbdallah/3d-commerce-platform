"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validations/category";
import { getCurrentUser } from "@/lib/auth/session";

export async function updateCategoryAction(
  categoryId: string,
  formData: FormData,
) {
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
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!existingCategory) {
    throw new Error("Catégorie introuvable.");
  }

  const slugOwner = await prisma.category.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id: categoryId,
      },
    },
    select: {
      id: true,
    },
  });

  if (slugOwner) {
    throw new Error("Ce slug est déjà utilisé par une autre catégorie.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.category.update({
      where: {
        id: categoryId,
      },
      data: {
        slug: data.slug,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });

    await tx.categoryTranslation.upsert({
      where: {
        categoryId_language: {
          categoryId,
          language: "fr",
        },
      },
      update: {
        name: data.name,
        description: data.description || null,
      },
      create: {
        categoryId,
        language: "fr",
        name: data.name,
        description: data.description || null,
      },
    });
  });

  redirect("/admin/categories");
}
