import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";
import { useAuthStore } from "../../store/useAuthStore";
import { MdNotifications } from "react-icons/md";
import { LuLogOut, LuShield } from "react-icons/lu";

const pageTitles = {
  [ROUTE_PATHS.ADMIN_DASHBOARD]:  "Dashboard",
  [ROUTE_PATHS.ADMIN_USERS]:      "Foydalanuvchilar",
  [ROUTE_PATHS.ADMIN_BLOGGERS]:   "Blogerlar",
  [ROUTE_PATHS.ADMIN_ADS]:        "E'lonlar",
  [ROUTE_PATHS.ADMIN_BLOGS]:      "Blog",
  [ROUTE_PATHS.ADMIN_CATEGORIES]: "Kategoriyalar",
  [ROUTE_PATHS.ADMIN_PRICING]:    "Narxlar",
  [ROUTE_PATHS.ADMIN_CAREER]:     "Karyera",
  [ROUTE_PATHS.ADMIN_CONTACT]:    "Xabarlar",
  [ROUTE_PATHS.ADMIN_FAQ]:        "FAQ",
  [ROUTE_PATHS.ADMIN_SETTINGS]:   "Sozlamalar",
};

const AdminTopbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const title = pageTitles[pathname] ?? "Admin";

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.ADMIN_LOGIN, { replace: true });
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-5 flex-shrink-0"
      style={{
        background: "#8b1a1a",
        borderBottom: "0.5px solid rgba(0,0,0,0.2)",
      }}
    >
      {/* Left: title */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-0.5 h-5 rounded-full"
          style={{ background: "#f1948a" }}
        />
        <h1 className="text-sm font-bold text-white tracking-tight">{title}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <MdNotifications size={18} style={{ color: "rgba(255,255,255,0.75)" }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#f39c12", border: "1.5px solid #8b1a1a" }}
          />
        </button>

        {/* Divider */}
        <div
          className="w-px h-6 mx-1"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />

        {/* User info */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "#c0392b",
              border: "1.5px solid rgba(255,255,255,0.2)",
            }}
          >
            <LuShield size={13} strokeWidth={2} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-tight">
              {user?.name ?? "Admin"}
            </p>
            <p
              className="text-[10px] leading-tight"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {user?.email ?? "admin@adblogger.uz"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-px h-6 mx-1"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <LuLogOut size={13} strokeWidth={2} />
          <span className="hidden sm:inline">Chiqish</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;