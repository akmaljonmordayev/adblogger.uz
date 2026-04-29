import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";
import {
  PiSquaresFourDuotone,
  PiUsersDuotone,
  PiRssDuotone,
  PiMegaphoneSimpleDuotone,
  PiArticleDuotone,
  PiTagDuotone,
  PiBriefcaseDuotone,
  PiEnvelopeOpenDuotone,
  PiSealQuestionDuotone,
  PiGearSixDuotone,
  PiSignOutDuotone,
  PiArrowLeftDuotone,
} from "react-icons/pi";
import LogoutModal from "../../components/ui/LogoutModal";

const navItems = [
  { label: "Dashboard",        path: ROUTE_PATHS.ADMIN_DASHBOARD,  Icon: PiSquaresFourDuotone       },
  { label: "Foydalanuvchilar", path: ROUTE_PATHS.ADMIN_USERS,      Icon: PiUsersDuotone             },
  { label: "Blogerlar",        path: ROUTE_PATHS.ADMIN_BLOGGERS,   Icon: PiRssDuotone               },
  { label: "E'lonlar",         path: ROUTE_PATHS.ADMIN_ADS,        Icon: PiMegaphoneSimpleDuotone   },
  { label: "Blog",             path: ROUTE_PATHS.ADMIN_BLOGS,      Icon: PiArticleDuotone           },
  { label: "Kategoriyalar",    path: ROUTE_PATHS.ADMIN_CATEGORIES, Icon: PiTagDuotone               },
  { label: "Karyera",          path: ROUTE_PATHS.ADMIN_CAREER,     Icon: PiBriefcaseDuotone         },
  { label: "Xabarlar",         path: ROUTE_PATHS.ADMIN_CONTACT,    Icon: PiEnvelopeOpenDuotone      },
  { label: "FAQ",              path: ROUTE_PATHS.ADMIN_FAQ,        Icon: PiSealQuestionDuotone      },
  { label: "Sozlamalar",       path: ROUTE_PATHS.ADMIN_SETTINGS,   Icon: PiGearSixDuotone           },
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
          {navItems.map(({ label, path, Icon }) => (
            <NavLink
              key={path}
              to={path}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150"
              style={({ isActive }) =>
                isActive
                  ? { background: "#c0392b", color: "#fff" }
                  : { color: "rgba(255,255,255,0.42)" }
              }
              onMouseEnter={(e) => {
                if (!e.currentTarget.getAttribute("aria-current"))
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute("aria-current"))
                  e.currentTarget.style.background = "";
              }}
            >
              <Icon size={18} />
              {label}
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
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = ""}
          >
            <PiArrowLeftDuotone size={15} />
            Saytga qaytish
          </NavLink>
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg transition-colors w-full text-left"
            style={{ color: "#e74c3c" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(231,76,60,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = ""}
          >
            <PiSignOutDuotone size={15} />
            Chiqish
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
