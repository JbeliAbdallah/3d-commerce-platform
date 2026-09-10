"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
] as const;

const activeStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "COMPLETED",
] as const;

export async function updateOrderStatusAction(
  orderId: string,
  formData: FormData,
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const newStatus = String(formData.get("status"));

  if (
    !allowedStatuses.includes(newStatus as (typeof allowedStatuses)[number])
  ) {
    throw new Error("Statut invalide.");
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Commande introuvable.");
    }

    if (order.status === newStatus) {
      return;
    }

    const wasCancelled = order.status === "CANCELLED";
    const willBeCancelled = newStatus === "CANCELLED";

    // Active → Annulée : restore stock
    if (!wasCancelled && willBeCancelled) {
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    // Annulée → Active : reserve stock again
    if (
      wasCancelled &&
      activeStatuses.includes(newStatus as (typeof activeStatuses)[number])
    ) {
      for (const item of order.items) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count !== 1) {
          throw new Error(`Stock insuffisant pour le produit de la commande.`);
        }
      }
    }

    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus as (typeof allowedStatuses)[number],
      },
    });
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/inventory");

  redirect(`/admin/orders/${orderId}?success=status-updated`);
}
