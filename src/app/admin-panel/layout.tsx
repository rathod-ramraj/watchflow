import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { AdminTopbar, AdminNav } from "@/components/admin/topbar";

export const metadata: Metadata = {
  title: "Admin Panel · Cinex",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: "var(--bg)" }}>
      <AdminTopbar user={user} />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {user && <AdminNav />}
        {children}
      </div>
    </div>
  );
}
