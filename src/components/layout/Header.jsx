import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  LuSearch, LuMapPin, LuFlame, LuMenu, LuX,
  LuUser, LuPlus, LuHouse, LuUsers, LuTag,
  LuDollarSign, LuMail, LuBadgeCheck, LuTrendingUp,
  LuLogOut, LuLayoutDashboard, LuChevronDown,
  LuHeart, LuBell,
} from "react-icons/lu";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import LogoutModal from "../ui/LogoutModal";
import HeroSwiper from "./HeroSwiper";
import CategorySection from "./CategorySection";

/* ── Syne font ── */
if (!document.getElementById("syne-font")) {
  const l = document.createElement("link");
  l.id = "syne-font";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap";
  document.head.appendChild(l);
}

const NAV = [
  { to: "/",           label: "Bosh sahifa",  Icon: LuHouse },
  { to: "/bloggers",   label: "Blogerlar",    Icon: LuUsers },
  { to: "/categories", label: "Kategoriyalar",Icon: LuTag },
  { to: "/ads",         label: "Reklamalar",   Icon: LuDollarSign },
  { to: "/contact",    label: "Bog'lanish",   Icon: LuMail },
];

/* ─────────────── LOGO ─────────────── */
function Logo() {
  return (
    <NavLink
      to="/"
      style={{
        textDecoration: "none", flexShrink: 0,
        display: "flex", alignItems: "center", gap: 9,
      }}
    >
      {/* Icon mark */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff4b2b"/>
            <stop offset="100%" stopColor="#c0392b"/>
          </linearGradient>
          <linearGradient id="shineGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="36" height="36" rx="10" fill="url(#logoGrad)"/>
        {/* Shine overlay */}
        <rect width="36" height="18" rx="10" fill="url(#shineGrad)"/>
        {/* Signal arcs */}
        <path d="M9 22 C9 14 27 14 27 22" stroke="white" strokeWidth="2" fill="none"
          strokeLinecap="round" opacity="0.35"/>
        <path d="M12 22 C12 16.5 24 16.5 24 22" stroke="white" strokeWidth="2" fill="none"
          strokeLinecap="round" opacity="0.6"/>
        <path d="M15 22 C15 19 21 19 21 22" stroke="white" strokeWidth="2" fill="none"
          strokeLinecap="round" opacity="0.9"/>
        {/* Center dot */}
        <circle cx="18" cy="24" r="2.2" fill="white"/>
        {/* AD label */}
        <text x="18" y="11" textAnchor="middle" fill="white"
          style={{ fontSize: 7, fontWeight: 800, fontFamily: "sans-serif", letterSpacing: "0.5px" }}>
          AD
        </text>
      </svg>

      {/* Wordmark */}
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 21,
        letterSpacing: "-0.6px",
        lineHeight: 1,
      }}>
        <span style={{ color: "#e74c3c" }}>ad</span>
        <span style={{ color: "#111827" }}>blo</span>
        <span style={{
          color: "#e74c3c",
          textShadow: "0 0 12px rgba(231,76,60,0.3)",
        }}>gg</span>
        <span style={{ color: "#111827" }}>er</span>
      </span>
    </NavLink>
  );
}

/* ─────────────── MAIN HEADER ─────────────── */
export default function Header() {
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef    = useRef(null);
  const userMenuRef = useRef(null);

  const { user, token } = useAuthStore();
  const { unreadCount, fetch: fetchNotifs, reset: resetNotifs } = useNotificationStore();
  const [showLogout, setShowLogout] = useState(false);

  // Poll notifications every 30s while logged in
  useEffect(() => {
    if (!token) { resetNotifs(); return; }
    fetchNotifs();
    const id = setInterval(fetchNotifs, 30_000);
    return () => clearInterval(id);
  }, [token, fetchNotifs, resetNotifs]);

  const handleLogout = () => {
    setUserMenuOpen(false);
    setOpen(false);
    setShowLogout(true);
  };

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const lastScrollY = useRef(0);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const fn = () => {
      const cur = window.scrollY;
      if (cur < 8) {
        setHidden(false);
        setScrolled(false);
      } else {
        setScrolled(true);
        if (cur > lastScrollY.current + 4) {
          setHidden(true);   // aşağı scroll → yashir
          setOpen(false);
        } else if (cur < lastScrollY.current - 4) {
          setHidden(false);  // yuqori scroll → ko'rsat
        }
      }
      lastScrollY.current = cur;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={isHome ? "hero-full-height flex flex-col" : "flex flex-col"}>
      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        redirectTo="/"
      />

      {/* ══════════════ STICKY HEADER ══════════════ */}
      <header
        ref={menuRef}
        style={{
          position: "sticky", top: 0, zIndex: 1000,
          background: "#fff",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.09)"
            : "0 1px 0 #e5e7eb",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s",
        }}
      >

        {/* ── TOP BAR ── */}
        <div style={{
          background: "linear-gradient(90deg, #b91c1c 0%, #dc2626 40%, #ef4444 75%, #dc2626 100%)",
          position: "relative",
        }}>
          {/* Subtle dot pattern */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }} />

          <div style={{
            maxWidth: 1280, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 20px", position: "relative", zIndex: 1,
          }}>

            {/* Left stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <span style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, color: "rgba(255,255,255,0.92)", fontWeight: 500,
                paddingRight: 14,
                borderRight: "1px solid rgba(255,255,255,0.2)",
              }}>
                <LuMapPin size={12} style={{ flexShrink: 0 }} />
                Toshkent, O'zbekiston
              </span>

              <span style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, color: "rgba(255,255,255,0.88)", fontWeight: 500,
                padding: "0 14px",
                borderRight: "1px solid rgba(255,255,255,0.2)",
              }}
                className="hidden-sm"
              >
                {/* Live badge */}
                <span style={{
                  background: "#fff", color: "#dc2626",
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.8px",
                  padding: "1px 5px", borderRadius: 4,
                  lineHeight: "14px",
                }}>LIVE</span>
                <LuFlame size={12} />
                500+ tasdiqlangan bloger
              </span>

              <span style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, color: "rgba(255,255,255,0.80)", fontWeight: 500,
                paddingLeft: 14,
              }}
                className="hidden-md"
              >
                <LuTrendingUp size={12} />
                12M+ faol auditoriya
              </span>
            </div>

            {/* Right auth */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {user && (
                <>
                  <NavLink to="/wishlist" title="Saqlanganlar" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 8,
                    color: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    textDecoration: "none", transition: "background 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >
                    <LuHeart size={14} />
                  </NavLink>
                  <NavLink to="/notifications" title="Bildirishnomalar" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 8,
                    color: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    textDecoration: "none", transition: "background 0.2s",
                    position: "relative",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >
                    <LuBell size={14} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: "absolute",
                        top: unreadCount > 9 ? 2 : 3,
                        right: unreadCount > 9 ? 2 : 3,
                        minWidth: unreadCount > 9 ? 16 : 13,
                        height: unreadCount > 9 ? 16 : 13,
                        borderRadius: 99,
                        background: "#f87171",
                        border: "1.5px solid rgba(185,28,28,0.6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 8, fontWeight: 800, color: "#fff",
                        lineHeight: 1,
                      }}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </NavLink>
                </>
              )}
              {user ? (
                /* ── Logged in ── */
                <div ref={userMenuRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: 8, padding: "4px 10px 4px 6px",
                      cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600,
                    }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "#dc2626", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#fff",
                      overflow: "hidden",
                    }}>
                      {user.avatar
                        ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (user.firstName?.[0] || "U").toUpperCase()
                      }
                    </div>
                    {user.firstName}
                    <LuChevronDown size={12} />
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 8px)", right: 0,
                      background: "#fff", borderRadius: 12, minWidth: 190,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
                      border: "1px solid #f1f5f9", zIndex: 9999,
                    }}>
                      <div style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{user.email}</div>
                      </div>
                      {[
                        user.role === "admin"
                          ? { to: "/admin", icon: <LuLayoutDashboard size={13} />, label: "Admin panel" }
                          : { to: "/profile", icon: <LuUser size={13} />, label: "Profilim" },
                      ].map(item => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 14px", textDecoration: "none",
                            color: "#374151", fontSize: 13, fontWeight: 500,
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {item.icon} {item.label}
                        </NavLink>
                      ))}
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 8,
                          padding: "10px 14px", border: "none", background: "none",
                          cursor: "pointer", color: "#dc2626", fontSize: 13, fontWeight: 600,
                          borderTop: "1px solid #fef2f2",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <LuLogOut size={13} /> Chiqish
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Not logged in ── */
                <>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 11, color: "rgba(255,255,255,0.7)",
                  }} className="hidden-sm">
                    <LuBadgeCheck size={12} />
                    Ishonchli platforma
                  </span>
                  <div style={{
                    width: 1, height: 14, background: "rgba(255,255,255,0.25)",
                    margin: "0 4px",
                  }} className="hidden-sm" />
                  <NavLink
                    to="/login"
                    style={{
                      color: "#fff", textDecoration: "none",
                      padding: "4px 12px", borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.3)",
                      fontSize: 12, fontWeight: 500,
                      display: "flex", alignItems: "center", gap: 4,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <LuUser size={11} /> Kirish
                  </NavLink>
                  <NavLink
                    to="/register"
                    style={{
                      color: "#dc2626", background: "#fff", textDecoration: "none",
                      padding: "4px 14px", borderRadius: 6,
                      fontSize: 12, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 4,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                      transition: "transform 0.15s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >
                    ✦ Bloger bo'lish
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── MAIN NAV ── */}
        <nav style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px", height: 66, gap: 16,
        }}>
          <Logo />

          {/* SEARCH */}
          <div
            className="search-bar"
            style={{
              flex: 1, maxWidth: 440,
              display: "flex", alignItems: "center",
              background: "#f3f4f6",
              borderRadius: 12,
              border: "1.5px solid transparent",
              overflow: "hidden",
              transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.08)";
              e.currentTarget.style.background = "#fff";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "#f3f4f6";
            }}
          >
            <LuSearch size={15} style={{ marginLeft: 13, color: "#9ca3af", flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Bloger, kategoriya, platforma..."
              style={{
                flex: 1, border: "none", background: "transparent",
                padding: "11px 8px", fontSize: 13.5,
                color: "#111827", outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0 6px", color: "#9ca3af",
                  display: "flex", alignItems: "center",
                }}
              >
                <LuX size={13} />
              </button>
            )}
            <button style={{
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              border: "none", cursor: "pointer",
              padding: "0 18px", height: "100%", minHeight: 44,
              color: "#fff", display: "flex", alignItems: "center", gap: 5,
              fontSize: 13, fontWeight: 600, flexShrink: 0,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <LuSearch size={14} />
              <span className="hidden-sm">Qidirish</span>
            </button>
          </div>

          {/* DESKTOP NAV */}
          <ul
            className="desktop-nav"
            style={{
              display: "flex", alignItems: "center",
              gap: 2, listStyle: "none", margin: 0, padding: 0, flexShrink: 0,
            }}
          >
            {NAV.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  style={({ isActive }) => ({
                    textDecoration: "none", fontSize: 13.5, fontWeight: 600,
                    padding: "7px 11px", borderRadius: 9,
                    color: isActive ? "#dc2626" : "#374151",
                    background: isActive ? "#fef2f2" : "transparent",
                    display: "block", whiteSpace: "nowrap",
                    transition: "color 0.15s, background 0.15s",
                  })}
                  onMouseEnter={e => {
                    if (!e.currentTarget.style.background.includes("fef2f2")) {
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.background = "#fff5f5";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!e.currentTarget.style.background.includes("fef2f2")) {
                      e.currentTarget.style.color = "#374151";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {label}
                </NavLink>
              </li>
            ))}

            <li style={{ marginLeft: 6 }}>
              <NavLink
                to="/post-ad"
                style={{
                  textDecoration: "none",
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", fontSize: 13, fontWeight: 700,
                  padding: "9px 18px", borderRadius: 10,
                  display: "flex", alignItems: "center", gap: 5,
                  boxShadow: "0 3px 14px rgba(220,38,38,0.35)",
                  transition: "transform 0.18s, box-shadow 0.18s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(220,38,38,0.45)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 3px 14px rgba(220,38,38,0.35)";
                }}
              >
                <LuPlus size={14} strokeWidth={2.5} />
                E'lon berish
              </NavLink>
            </li>
          </ul>

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(v => !v)}
            className="hamburger"
            style={{
              display: "none", background: open ? "#fef2f2" : "none",
              border: "none", cursor: "pointer",
              padding: 7, borderRadius: 9,
              color: open ? "#dc2626" : "#374151",
              transition: "background 0.15s, color 0.15s",
            }}
            aria-label="Menu"
          >
            {open ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </nav>

        {/* ── MOBILE DRAWER ── */}
        <div
          className="mobile-drawer"
          style={{
            overflow: "hidden",
            maxHeight: open ? "540px" : "0",
            transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1)",
            borderTop: open ? "1px solid #f3f4f6" : "none",
          }}
        >
          <div style={{
            padding: "16px 18px 20px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>

            {/* Mobile search */}
            <div style={{
              display: "flex", alignItems: "center",
              background: "#f3f4f6", borderRadius: 11,
              border: "1.5px solid #e5e7eb", overflow: "hidden",
            }}>
              <LuSearch size={14} style={{ marginLeft: 12, color: "#9ca3af", flexShrink: 0 }} />
              <input
                placeholder="Qidirish..."
                style={{
                  flex: 1, border: "none", background: "transparent",
                  padding: "12px 8px", fontSize: 14, outline: "none",
                }}
              />
              <button style={{
                background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                border: "none", cursor: "pointer",
                padding: "0 14px", height: 46,
                color: "#fff", display: "flex", alignItems: "center",
              }}>
                <LuSearch size={14} />
              </button>
            </div>

            {/* Mobile nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "11px 14px", borderRadius: 10, fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#dc2626" : "#374151",
                    background: isActive ? "#fef2f2" : "transparent",
                    transition: "background 0.15s",
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span style={{
                        width: 32, height: 32,
                        background: isActive ? "#fecaca" : "#f3f4f6",
                        borderRadius: 8,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "background 0.15s",
                      }}>
                        <Icon size={15} style={{ color: isActive ? "#dc2626" : "#6b7280" }} />
                      </span>
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile auth */}
            <div style={{
              display: "flex", gap: 10,
              paddingTop: 6,
              borderTop: "1px solid #f3f4f6",
            }}>
              {user ? (
                <>
                  <NavLink
                    to={user.role === "admin" ? "/admin" : "/profile"}
                    onClick={() => setOpen(false)}
                    style={{
                      flex: 1, textDecoration: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6, padding: "12px", borderRadius: 11, fontSize: 14,
                      fontWeight: 600, color: "#374151",
                      border: "1.5px solid #e5e7eb", background: "#fff",
                    }}
                  >
                    <LuUser size={15} />
                    {user.firstName}
                  </NavLink>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    style={{
                      flex: 1, border: "1.5px solid #fee2e2",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6, padding: "12px", borderRadius: 11, fontSize: 14,
                      fontWeight: 600, color: "#dc2626", background: "#fef2f2",
                      cursor: "pointer",
                    }}
                  >
                    <LuLogOut size={15} /> Chiqish
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    style={{
                      flex: 1, textDecoration: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6, padding: "12px", borderRadius: 11, fontSize: 14,
                      fontWeight: 600, color: "#374151",
                      border: "1.5px solid #e5e7eb", background: "#fff",
                    }}
                  >
                    <LuUser size={15} /> Kirish
                  </NavLink>
                  <NavLink
                    to="/post-ad"
                    onClick={() => setOpen(false)}
                    style={{
                      flex: 1, textDecoration: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6, padding: "12px", borderRadius: 11, fontSize: 14,
                      fontWeight: 700, color: "#fff",
                      background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                      boxShadow: "0 3px 12px rgba(220,38,38,0.3)",
                    }}
                  >
                    <LuPlus size={15} strokeWidth={2.5} /> E'lon berish
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>

      </header>

      {isHome && <CategorySection />}
      {isHome && (
        <div className="flex-1 min-h-0 flex flex-col">
          <HeroSwiper />
        </div>
      )}

    </div>
  );
}

