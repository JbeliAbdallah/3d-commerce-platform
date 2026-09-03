"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { productSchema } from "@/lib/validations/product";
import { getCurrentUser } from "@/lib/auth/session";

export async function updateProductAction(
  productId: string,
  formData: FormData,
) {
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
    imageUrl: formData.get("imageUrl") || undefined,

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

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

  if (!existingProduct) {
    throw new Error("Produit introuvable.");
  }

  const slugOwner = await prisma.product.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id: productId,
      },
    },
    select: {
      id: true,
    },
  });

  if (slugOwner) {
    throw new Error("Ce slug est déjà utilisé par un autre produit.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        slug: data.slug,
        price: data.price,
        stock: data.stock,
        status: data.status,
        featured: data.featured,
        categoryId: data.categoryId || null,
      },
    });

    await tx.productTranslation.upsert({
      where: {
        productId_language: {
          productId,
          language: "fr",
        },
      },
      update: {
        name: data.translations.fr.name,
        shortDesc: data.translations.fr.shortDesc || null,
        description: data.translations.fr.description || null,
      },
      create: {
        productId,
        language: "fr",
        name: data.translations.fr.name,
        shortDesc: data.translations.fr.shortDesc || null,
        description: data.translations.fr.description || null,
      },
    });

    if (data.imageUrl) {
      if (existingProduct.images[0]) {
        await tx.productImage.update({
          where: {
            id: existingProduct.images[0].id,
          },
          data: {
            url: data.imageUrl,
          },
        });
      } else {
        await tx.productImage.create({
          data: {
            productId,
            url: data.imageUrl,
            sortOrder: 0,
          },
        });
      }
    }
  });

  redirect("/admin/products");
}
