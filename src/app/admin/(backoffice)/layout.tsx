import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getCurrentUser } from "@/lib/auth/session";

export default async function BackofficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <AdminSidebar />

      <div className="min-h-screen lg:pl-72">
        <header className="flex h-20 items-center justify-end border-b border-brand-brown/10 px-6 lg:px-8">
          <div className="text-right">
            <p className="text-sm font-bold text-brand-brown">{user.name}</p>
            <p className="text-xs text-brand-brown/45">{user.email}</p>
          </div>
        </header>

        <main className="px-5 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
