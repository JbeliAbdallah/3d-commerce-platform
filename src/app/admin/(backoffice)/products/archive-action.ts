"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function archiveProductAction(productId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!product) {
    throw new Error("Produit introuvable.");
  }

  if (product.status === "ARCHIVED") {
    return;
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      status: "ARCHIVED",
      featured: false,
    },
  });

  redirect("/admin/products");
}
