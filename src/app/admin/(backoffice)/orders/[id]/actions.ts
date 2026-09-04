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

export async function updateOrderStatusAction(
  orderId: string,
  formData: FormData,
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const status = String(formData.get("status"));

  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    throw new Error("Statut invalide.");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as (typeof allowedStatuses)[number],
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  redirect(`/admin/orders/${orderId}`);
}
