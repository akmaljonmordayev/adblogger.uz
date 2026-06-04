import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";
import { useAuthStore } from "../../store/useAuthStore";
import {
  LuBell, LuLogOut, LuShield, LuMenu, LuChevronRight,
  LuPanelLeftOpen, LuPanelLeftClose,
} from "react-icons/lu";

const PAGE_META = {
  [ROUTE_PATHS.ADMIN_DASHBOARD]:  { title: "Dashboard",        sub: "Umumiy ko'rsatkichlar" },
  [ROUTE_PATHS.ADMIN_USERS]:      { title: "Foydalanuvchilar", sub: "Hisob boshqaruvi" },
  [ROUTE_PATHS.ADMIN_BLOGGERS]:   { title: "Blogerlar",        sub: "Blogger ro'yxati" },
  [ROUTE_PATHS.ADMIN_ADS]:        { title: "E'lonlar",         sub: "Reklama boshqaruvi" },
  [ROUTE_PATHS.ADMIN_BLOGS]:      { title: "Blog",             sub: "Maqolalar boshqaruvi" },
  [ROUTE_PATHS.ADMIN_CATEGORIES]: { title: "Kategoriyalar",    sub: "Kontent turkumlari" },
[ROUTE_PATHS.ADMIN_CONTACT]:    { title: "Xabarlar",         sub: "Kiruvchi xabarlar" },
  [ROUTE_PATHS.ADMIN_FAQ]:        { title: "FAQ",              sub: "Ko'p so'raladigan savollar" },
  [ROUTE_PATHS.ADMIN_SETTINGS]:   { title: "Sozlamalar",       sub: "Tizim sozlamalari" },
};

function getInitials(user) {
  if (!user) return "AD";
  const fn = user.firstName || user.name || "";
  const ln = user.lastName || "";
  return `${fn[0] || ""}${ln[0] || ""}`.toUpperCase() || "AD";
}

const GRAD_MAP = ["135deg,#ef4444,#b91c1c", "135deg,#2563eb,#1d4ed8", "135deg,#7c3aed,#6d28d9"];
function getGrad(email = "") { return GRAD_MAP[email.charCodeAt(0) % GRAD_MAP.length]; }

/* ══════════════════════════════════════════════════════════════════ */
const AdminTopbar = ({ collapsed, onToggle, onMobileOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showNotif, setShowNotif] = useState(false);

  const meta = PAGE_META[pathname] ?? { title: "Admin", sub: "Boshqaruv paneli" };

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.ADMIN_LOGIN, { replace: true });
  };

  const initials = getInitials(user);
  const grad     = getGrad(user?.email || "");
  const fullName = user ? `${user.firstName || user.name || ""} ${user.lastName || ""}`.trim() : "Admin";

  return (
    <header style={{
      height: 58,
      background: "#ffffff",
      borderBottom: "1px solid #e8ecf4",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      flexShrink: 0,
      boxShadow: "0 1px 0 #e8ecf4, 0 2px 8px rgba(0,0,0,0.03)",
      gap: 14,
      zIndex: 30,
      position: "relative",
    }}>

      {/* ── Mobile hamburger ── */}
      <button
        className="admin-topbar-mobile-toggle"
        onClick={onMobileOpen}
        style={{
          display: "none",
          width: 36, height: 36, borderRadius: 10,
          border: "1px solid #e8ecf4", background: "#fff",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}
      >
        <LuMenu size={18} color="#374151" />
      </button>

      {/* ── Desktop sidebar toggle ── */}
      <button
        className="admin-topbar-desktop-toggle"
        onClick={onToggle}
        title={collapsed ? "Kengaytirish" : "Yig'ish"}
        style={{
          width: 34, height: 34, borderRadius: 9,
          border: "1px solid #e8ecf4", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0, transition: "all .2s",
          color: "#64748b",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#64748b"; }}
      >
        {collapsed ? <LuPanelLeftOpen size={16} /> : <LuPanelLeftClose size={16} />}
      </button>

      {/* ── Divider ── */}
      <div style={{ width: 1, height: 24, background: "#e8ecf4", flexShrink: 0 }} />

      {/* ── Page title ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 1 }}>
          <Link
            to={ROUTE_PATHS.ADMIN_DASHBOARD}
            style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 500, textDecoration: "none" }}
          >
            Admin
          </Link>
          <LuChevronRight size={10} color="#cbd5e1" />
          <span style={{ fontSize: 10.5, color: "#64748b", fontWeight: 600 }}>{meta.title}</span>
        </div>
        <h1 style={{
          margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a",
          lineHeight: 1, letterSpacing: "-0.3px",
        }}>
          {meta.title}
        </h1>
      </div>

      {/* ── Right actions ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotif(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: "1px solid #e8ecf4", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all .2s", color: "#64748b",
              position: "relative",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#d1d5db"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e8ecf4"; }}
          >
            <LuBell size={16} />
            {/* badge */}
            <span style={{
              position: "absolute", top: 7, right: 7,
              width: 7, height: 7, borderRadius: "50%",
              background: "#ef4444", border: "1.5px solid #fff",
            }} />
          </button>

          {/* Dropdown */}
          {showNotif && (
            <>
              <div
                onClick={() => setShowNotif(false)}
                style={{ position: "fixed", inset: 0, zIndex: 90 }}
              />
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "#fff", border: "1px solid #e8ecf4",
                borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                width: 280, zIndex: 100, overflow: "hidden",
              }}>
                <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>Bildirishnomalar</div>
                </div>
                <div style={{ padding: "12px 16px", textAlign: "center", color: "#94a3b8", fontSize: 12.5 }}>
                  Hozircha yangi bildirishnoma yo'q
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "#e8ecf4" }} />

        {/* User card */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          {/* Avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: user?.avatar ? `url(${user.avatar}) center/cover` : `linear-gradient(${grad})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}>
            {!user?.avatar && initials}
          </div>

          <div className="topbar-user-info" style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
              {fullName || "Admin"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
              <LuShield size={9} color="#ef4444" />
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Administrator</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "#e8ecf4" }} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Chiqish"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 12px", height: 34, borderRadius: 9,
            border: "1px solid #fee2e2", background: "#fef2f2",
            fontSize: 12, fontWeight: 600, color: "#ef4444",
            cursor: "pointer", transition: "all .2s", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fecaca"; e.currentTarget.style.borderColor = "#fca5a5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fee2e2"; }}
        >
          <LuLogOut size={13} />
          <span className="topbar-logout-label">Chiqish</span>
        </button>
      </div>

      <style>{`
        @media(max-width:640px) {
          .topbar-user-info { display: none !important; }
          .topbar-logout-label { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default AdminTopbar;
