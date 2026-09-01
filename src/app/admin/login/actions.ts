"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    redirect("/admin/login?error=invalid");
  }

  const validPassword = await verifyPassword(password, user.passwordHash);

  if (!validPassword) {
    redirect("/admin/login?error=invalid");
  }

  await createSession(user.id);

  redirect("/admin/dashboard");
}
