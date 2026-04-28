import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";
import {
  MdDashboard, MdPeople, MdCampaign, MdArticle,
  MdCategory, MdWork, MdMail, MdQuestionAnswer,
  MdSettings, MdRssFeed, MdLogout,
} from "react-icons/md";
import LogoutModal from "../../components/ui/LogoutModal";

const navItems = [
  { label: "Dashboard",        path: ROUTE_PATHS.ADMIN_DASHBOARD,  icon: <MdDashboard size={17} /> },
  { label: "Foydalanuvchilar", path: ROUTE_PATHS.ADMIN_USERS,      icon: <MdPeople size={17} /> },
  { label: "Blogerlar",        path: ROUTE_PATHS.ADMIN_BLOGGERS,   icon: <MdRssFeed size={17} /> },
  { label: "E'lonlar",         path: ROUTE_PATHS.ADMIN_ADS,        icon: <MdCampaign size={17} /> },
  { label: "Blog",             path: ROUTE_PATHS.ADMIN_BLOGS,      icon: <MdArticle size={17} /> },
  { label: "Kategoriyalar",    path: ROUTE_PATHS.ADMIN_CATEGORIES, icon: <MdCategory size={17} /> },
  { label: "Karyera",          path: ROUTE_PATHS.ADMIN_CAREER,     icon: <MdWork size={17} /> },
  { label: "Xabarlar",         path: ROUTE_PATHS.ADMIN_CONTACT,    icon: <MdMail size={17} /> },
  { label: "FAQ",              path: ROUTE_PATHS.ADMIN_FAQ,        icon: <MdQuestionAnswer size={17} /> },
  { label: "Sozlamalar",       path: ROUTE_PATHS.ADMIN_SETTINGS,   icon: <MdSettings size={17} /> },
];

const AdminSidebar = () => {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        redirectTo={ROUTE_PATHS.ADMIN_LOGIN || "/admin/login"}
      />

      <aside
        className="w-52 h-full flex flex-col"
        style={{ background: "#1c0808" }}
      >
        {/* Logo */}
        <div
          className="h-14 flex items-center gap-2 px-4 flex-shrink-0"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white font-black text-xs flex-shrink-0"
            style={{ background: "#c0392b" }}
          >
            A
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            ad<span style={{ color: "#f1948a" }}>blogger</span>
          </span>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(192,57,43,0.25)",
              border: "0.5px solid rgba(192,57,43,0.45)",
              color: "#f1948a",
            }}
          >
            Admin
          </span>
        </div>

        {/* Section label */}
        <p
          className="px-4 pt-4 pb-2 text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          Boshqaruv
        </p>

        {/* Nav */}
        <nav className="flex-1 px-2 overflow-y-auto space-y-px pb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive ? "" : ""
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "#c0392b", color: "#fff" }
                  : { color: "rgba(255,255,255,0.42)" }
              }
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active"))
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute("aria-current"))
                  e.currentTarget.style.background = "";
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div
          className="p-2 flex flex-col gap-px"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <NavLink
            to={ROUTE_PATHS.HOME}
            className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.32)" }}
          >
            ← Saytga qaytish
          </NavLink>
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg transition-colors w-full text-left"
            style={{ color: "#e74c3c" }}
          >
            <MdLogout size={13} />
            Chiqish
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;