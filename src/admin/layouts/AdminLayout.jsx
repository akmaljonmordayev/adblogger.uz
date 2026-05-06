import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { useAuthStore } from "../../store/useAuthStore";
import { ROUTE_PATHS } from "../../config/constants";

const AdminLayout = () => {
  const { token, user } = useAuthStore();
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);

  if (!token || user?.role !== "admin") {
    return <Navigate to={ROUTE_PATHS.ADMIN_LOGIN} replace />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f4f6fb", overflow: "hidden" }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
            zIndex: 40, backdropFilter: "blur(2px)",
          }}
        />
      )}

      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed(v => !v)}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <AdminTopbar
          collapsed={collapsed}
          onToggle={() => setCollapsed(v => !v)}
          onMobileOpen={() => setMobileOpen(true)}
        />
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-sidebar-mobile  { display: flex !important; }
          .admin-topbar-desktop-toggle { display: none !important; }
          .admin-topbar-mobile-toggle  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-mobile  { display: none !important; }
          .admin-topbar-mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
