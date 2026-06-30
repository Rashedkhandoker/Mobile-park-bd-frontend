"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/context/adminAuthContext";
import AdminSidebar from "./AdminSidebar";

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7fafc" }}>
        <div style={{ color: "#718096", fontSize: "0.9rem" }}>Loading...</div>
      </div>
    );
  }

  if (isLoginPage) {
    return children;
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7fafc" }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: 240, minHeight: "100vh", display: "flex", flexDirection: "column" }} className="admin-main-content">
        {children}
      </div>
      <style>{`@media (max-width: 991px) { .admin-main-content { margin-left: 0 !important; } }`}</style>
    </div>
  );
}

export default function AdminShell({ children }) {
  return (
    <AdminAuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AdminAuthProvider>
  );
}
