import { useState, useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { useAuthStore } from "../../store/useAuthStore";
import { ROUTE_PATHS } from "../../config/constants";
import { useAdminSocket } from "../../hooks/useSocket";
import { toast } from "../../components/ui/toast";
import {
  soundNewApplication,
  soundNewUser,
  soundNewAd,
  soundNewContact,
} from "../../utils/adminNotifySound";

const AdminLayout = () => {
  const { token, user } = useAuthStore();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Unlock AudioContext on first user interaction (browser requirement)
  const unlocked = useRef(false);
  useEffect(() => {
    const unlock = () => { if (!unlocked.current) { unlocked.current = true; } };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useAdminSocket({
    // Yangi ro'yxatdan o'tish arizasi
    new_application: (data) => {
      soundNewApplication();
      toast.warning(
        `📋 Yangi ariza: ${data.firstName ?? ""} ${data.lastName ?? ""} (${data.email ?? ""})`,
        { duration: 7000 }
      );
    },
    // Yangi foydalanuvchi
    new_user: (data) => {
      soundNewUser();
      toast.success(
        `👤 Yangi foydalanuvchi: ${data.firstName ?? ""} ${data.lastName ?? ""}`,
        { duration: 6000 }
      );
    },
    // Yangi e'lon
    new_ad: (data) => {
      soundNewAd();
      toast.info(
        `📢 Yangi e'lon: ${data.title ?? data.companyName ?? "E'lon qo'shildi"}`,
        { duration: 6000 }
      );
    },
    // Yangi xabar (contact)
    new_contact: (data) => {
      soundNewContact();
      toast.info(
        `✉️ Yangi xabar: ${data.name ?? "Mehmon"} — ${data.subject ?? "Murojaat"}`,
        { duration: 6000 }
      );
    },
  });

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
