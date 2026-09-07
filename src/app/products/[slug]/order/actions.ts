"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { orderSchema } from "@/lib/validations/order";

export async function createOrderAction(
  productId: string,
  slug: string,
  formData: FormData,
) {
  const result = orderSchema.safeParse({
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email") || "",
    address: formData.get("address") || "",
    city: formData.get("city") || "",
    quantity: Number(formData.get("quantity")),
    customerNotes: formData.get("customerNotes") || "",
  });

  if (!result.success) {
    throw new Error("Données de commande invalides.");
  }

  const data = result.data;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      price: true,
      stock: true,
      status: true,
    },
  });

  if (!product || product.status !== "ACTIVE") {
    throw new Error("Produit indisponible.");
  }

  if (product.stock < data.quantity) {
    throw new Error("Stock insuffisant pour cette quantité.");
  }

  const total = product.price.mul(data.quantity);

  const order = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.updateMany({
      where: {
        id: product.id,
        status: "ACTIVE",
        stock: {
          gte: data.quantity,
        },
      },
      data: {
        stock: {
          decrement: data.quantity,
        },
      },
    });

    if (updatedProduct.count !== 1) {
      throw new Error("Stock insuffisant pour cette quantité.");
    }

    const existingCustomer = await tx.customer.findFirst({
      where: {
        phone: data.phone,
      },
    });

    const customer =
      existingCustomer ??
      (await tx.customer.create({
        data: {
          name: data.customerName,
          phone: data.phone,
          email: data.email || null,
          address: data.address || null,
          city: data.city || null,
        },
      }));

    return tx.order.create({
      data: {
        customerId: customer.id,
        status: "PENDING",
        total,
        customerNotes: data.customerNotes || null,
        whatsappContact: false,

        items: {
          create: {
            productId: product.id,
            quantity: data.quantity,
            unitPrice: product.price,
          },
        },
      },
    });
  });

  redirect(`/products/${slug}/order/success?order=${order.id}`);
}
