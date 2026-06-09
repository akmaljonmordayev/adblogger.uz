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
PiEnvelopeOpenDuotone,
  PiSealQuestionDuotone,
  PiGearSixDuotone,
  PiSignOutDuotone,
  PiArrowLeftDuotone,
  PiCaretLeftDuotone,
  PiCaretRightDuotone,
  PiClipboardTextDuotone,
  PiBriefcaseDuotone,
} from "react-icons/pi";
import LogoutModal from "../../components/ui/LogoutModal";

/* ── palette ── */
const C = {
  bg:        "#0d0f18",
  bgHover:   "rgba(255,255,255,0.05)",
  border:    "rgba(255,255,255,0.07)",
  textMuted: "rgba(255,255,255,0.38)",
  textDim:   "rgba(255,255,255,0.58)",
  textOn:    "#ffffff",
  accent:    "#ef4444",
  accentBg:  "rgba(239,68,68,0.14)",
  accentBorder: "rgba(239,68,68,0.3)",
};

const NAV_GROUPS = [
  {
    label: "Boshqaruv",
    items: [
      { label: "Dashboard",        path: ROUTE_PATHS.ADMIN_DASHBOARD,  Icon: PiSquaresFourDuotone     },
      { label: "Arizalar",         path: ROUTE_PATHS.ADMIN_APPLICATIONS, Icon: PiClipboardTextDuotone   },
      { label: "Blogerlar",        path: ROUTE_PATHS.ADMIN_BLOGGERS,      Icon: PiRssDuotone             },
      { label: "Biznesmenlar",     path: ROUTE_PATHS.ADMIN_BUSINESSMEN,   Icon: PiBriefcaseDuotone       },
    ],
  },
  {
    label: "Kontent",
    items: [
      { label: "E'lonlar",         path: ROUTE_PATHS.ADMIN_ADS,        Icon: PiMegaphoneSimpleDuotone },
      { label: "Blog",             path: ROUTE_PATHS.ADMIN_BLOGS,      Icon: PiArticleDuotone         },
      { label: "Kategoriyalar",    path: ROUTE_PATHS.ADMIN_CATEGORIES, Icon: PiTagDuotone             },
    ],
  },
  {
    label: "Boshqa",
    items: [
      { label: "Xabarlar",         path: ROUTE_PATHS.ADMIN_CONTACT,    Icon: PiEnvelopeOpenDuotone    },
      { label: "FAQ",              path: ROUTE_PATHS.ADMIN_FAQ,        Icon: PiSealQuestionDuotone    },
      { label: "Sozlamalar",       path: ROUTE_PATHS.ADMIN_SETTINGS,   Icon: PiGearSixDuotone         },
    ],
  },
];

/* ── nav item ── */
function NavItem({ label, path, Icon, collapsed }) {
  return (
    <NavLink
      to={path}
      title={collapsed ? label : ""}
      style={{ textDecoration: "none", display: "block", position: "relative" }}
    >
      {({ isActive }) => (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: collapsed ? 0 : 11,
          padding: collapsed ? "10px 0" : "9px 12px",
          borderRadius: 10,
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "background .15s, color .15s",
          cursor: "pointer",
          position: "relative",
          background: isActive ? C.accentBg : "transparent",
          border: isActive ? `1px solid ${C.accentBorder}` : "1px solid transparent",
        }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.bgHover; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        >
          {/* active indicator */}
          {isActive && (
            <div style={{
              position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
              width: 3, height: 20, borderRadius: "0 3px 3px 0",
              background: C.accent,
            }} />
          )}

          <Icon
            size={19}
            style={{
              color: isActive ? C.accent : C.textDim,
              flexShrink: 0,
              transition: "color .15s",
            }}
          />

          {!collapsed && (
            <span style={{
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? C.textOn : C.textDim,
              transition: "color .15s",
              whiteSpace: "nowrap",
              overflow: "hidden",
              opacity: collapsed ? 0 : 1,
            }}>
              {label}
            </span>
          )}

          {/* tooltip for collapsed */}
          {collapsed && (
            <span className="sidebar-tooltip">{label}</span>
          )}
        </div>
      )}
    </NavLink>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
const AdminSidebar = ({ collapsed, mobileOpen, onToggle, onMobileClose }) => {
  const [showLogout, setShowLogout] = useState(false);
  const W = collapsed ? 68 : 240;

  const sidebarContent = (isMobile = false) => (
    <aside style={{
      width: isMobile ? 240 : W,
      minWidth: isMobile ? 240 : W,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: C.bg,
      transition: isMobile ? "none" : "width 0.22s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
      position: "relative",
      zIndex: 50,
    }}>

      {/* ── Logo row ── */}
      <div style={{
        height: 58,
        display: "flex",
        alignItems: "center",
        padding: collapsed && !isMobile ? "0 12px" : "0 16px",
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
        gap: 10,
        justifyContent: collapsed && !isMobile ? "center" : "flex-start",
      }}>
        {/* Logo icon */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg,#ef4444,#b91c1c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 900, color: "#fff",
          boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
        }}>
          A
        </div>

        {(!collapsed || isMobile) && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1 }}>
              ad<span style={{ color: "#ef4444" }}>blogger</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: C.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 2 }}>
              Admin panel
            </div>
          </div>
        )}

        {/* Desktop toggle */}
        {!isMobile && (
          <button
            onClick={onToggle}
            style={{
              width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.border}`,
              background: "rgba(255,255,255,0.06)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.textDim, flexShrink: 0, transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = C.textDim; }}
          >
            {collapsed
              ? <PiCaretRightDuotone size={13} />
              : <PiCaretLeftDuotone  size={13} />
            }
          </button>
        )}

        {/* Mobile close */}
        {isMobile && (
          <button
            onClick={onMobileClose}
            style={{
              width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`,
              background: "rgba(255,255,255,0.06)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.textDim, flexShrink: 0,
            }}
          >
            <PiCaretLeftDuotone size={14} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px 8px", scrollbarWidth: "none" }}>
        {NAV_GROUPS.map(({ label, items }) => (
          <div key={label} style={{ marginBottom: 6 }}>
            {/* Section label */}
            {(!collapsed || isMobile) && (
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
                color: C.textMuted, padding: "10px 12px 4px", margin: 0,
              }}>
                {label}
              </p>
            )}
            {(collapsed && !isMobile) && (
              <div style={{ height: 1, background: C.border, margin: "8px 10px 6px" }} />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {items.map(item => (
                <NavItem
                  key={item.path}
                  {...item}
                  collapsed={collapsed && !isMobile}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom actions ── */}
      <div style={{ padding: "8px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <NavLink
          to={ROUTE_PATHS.HOME}
          title={collapsed && !isMobile ? "Saytga qaytish" : ""}
          style={{ textDecoration: "none", display: "block" }}
        >
          <div
            style={{
              display: "flex", alignItems: "center",
              gap: collapsed && !isMobile ? 0 : 10,
              padding: collapsed && !isMobile ? "9px 0" : "9px 12px",
              borderRadius: 10, cursor: "pointer",
              justifyContent: collapsed && !isMobile ? "center" : "flex-start",
              transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.bgHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <PiArrowLeftDuotone size={17} style={{ color: C.textDim, flexShrink: 0 }} />
            {(!collapsed || isMobile) && (
              <span style={{ fontSize: 12.5, fontWeight: 500, color: C.textDim, whiteSpace: "nowrap" }}>
                Saytga qaytish
              </span>
            )}
          </div>
        </NavLink>

        <button
          onClick={() => setShowLogout(true)}
          title={collapsed && !isMobile ? "Chiqish" : ""}
          style={{
            display: "flex", alignItems: "center",
            gap: collapsed && !isMobile ? 0 : 10,
            padding: collapsed && !isMobile ? "9px 0" : "9px 12px",
            borderRadius: 10, cursor: "pointer", width: "100%", border: "none",
            background: "transparent",
            justifyContent: collapsed && !isMobile ? "center" : "flex-start",
            transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <PiSignOutDuotone size={17} style={{ color: "#ef4444", flexShrink: 0 }} />
          {(!collapsed || isMobile) && (
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#ef4444", whiteSpace: "nowrap" }}>
              Chiqish
            </span>
          )}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        redirectTo={ROUTE_PATHS.ADMIN_LOGIN || "/admin/login"}
      />

      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop" style={{ display: "flex", height: "100%" }}>
        {sidebarContent(false)}
      </div>

      {/* Mobile drawer */}
      <div
        className="admin-sidebar-mobile"
        style={{
          display: "none",
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {sidebarContent(true)}
      </div>

      <style>{`
        nav::-webkit-scrollbar { display: none; }

        /* tooltip */
        .sidebar-tooltip {
          position: absolute;
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e2030;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity .15s;
          z-index: 999;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .sidebar-tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #1e2030;
        }
        a:hover .sidebar-tooltip,
        button:hover .sidebar-tooltip {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
