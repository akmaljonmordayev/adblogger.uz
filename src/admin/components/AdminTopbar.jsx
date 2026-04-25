import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";
import { useAuthStore } from "../../store/useAuthStore";
import { MdNotifications } from "react-icons/md";
import { LuLogOut, LuShield } from "react-icons/lu";

const pageTitles = {
  [ROUTE_PATHS.ADMIN_DASHBOARD]:   "Dashboard",
  [ROUTE_PATHS.ADMIN_USERS]:       "Foydalanuvchilar",
  [ROUTE_PATHS.ADMIN_BLOGGERS]:    "Blogerlar",
  [ROUTE_PATHS.ADMIN_ADS]:         "E'lonlar",
  [ROUTE_PATHS.ADMIN_BLOGS]:       "Blog",
  [ROUTE_PATHS.ADMIN_CATEGORIES]:  "Kategoriyalar",
  [ROUTE_PATHS.ADMIN_PRICING]:     "Narxlar",
  [ROUTE_PATHS.ADMIN_CAREER]:      "Karyera",
  [ROUTE_PATHS.ADMIN_CONTACT]:     "Xabarlar",
  [ROUTE_PATHS.ADMIN_FAQ]:         "FAQ",
  [ROUTE_PATHS.ADMIN_SETTINGS]:    "Sozlamalar",
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <MdNotifications size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
            <LuShield size={15} strokeWidth={2} />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name ?? "Admin"}
            </div>
            <div className="text-[11px] text-gray-400 leading-tight">
              {user?.email ?? ""}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Chiqish"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LuLogOut size={15} strokeWidth={2} />
          <span className="hidden sm:inline">Chiqish</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
