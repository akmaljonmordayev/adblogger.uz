import { useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";
import { MdNotifications, MdPerson } from "react-icons/md";

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
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <MdNotifications size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <MdPerson size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
