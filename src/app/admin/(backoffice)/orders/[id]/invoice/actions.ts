"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function createInvoiceAction(orderId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      invoice: {
        select: {
          id: true,
          invoiceNo: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Commande introuvable.");
  }

  // If an invoice already exists, reuse it.
  if (order.invoice) {
    redirect(`/admin/orders/${orderId}/invoice`);
  }

  const year = new Date().getFullYear();

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNo: {
        startsWith: `INV-${year}-`,
      },
    },
    orderBy: {
      invoiceNo: "desc",
    },
    select: {
      invoiceNo: true,
    },
  });

  let nextNumber = 1;

  if (lastInvoice) {
    const lastNumber = Number(lastInvoice.invoiceNo.split("-").pop());

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  const invoiceNo = `INV-${year}-${String(nextNumber).padStart(4, "0")}`;

  await prisma.invoice.create({
    data: {
      orderId: order.id,
      invoiceNo,
      status: "ISSUED",
      issuedAt: new Date(),
    },
  });

  redirect(`/admin/orders/${orderId}/invoice`);
}
