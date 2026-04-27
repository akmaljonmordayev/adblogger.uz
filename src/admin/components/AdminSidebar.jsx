import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";
import {
  MdDashboard,
  MdPeople,
  MdCampaign,
  MdArticle,
  MdCategory,
  MdAttachMoney,
  MdWork,
  MdMail,
  MdQuestionAnswer,
  MdSettings,
  MdRssFeed,
  MdLogout,
} from "react-icons/md";
import LogoutModal from "../../components/ui/LogoutModal";

const navItems = [
  { label: "Dashboard",    path: ROUTE_PATHS.ADMIN_DASHBOARD,   icon: <MdDashboard size={20} /> },
  { label: "Foydalanuvchilar", path: ROUTE_PATHS.ADMIN_USERS,   icon: <MdPeople size={20} /> },
  { label: "Blogerlar",    path: ROUTE_PATHS.ADMIN_BLOGGERS,    icon: <MdRssFeed size={20} /> },
  { label: "E'lonlar",     path: ROUTE_PATHS.ADMIN_ADS,         icon: <MdCampaign size={20} /> },
  { label: "Blog",         path: ROUTE_PATHS.ADMIN_BLOGS,       icon: <MdArticle size={20} /> },
  { label: "Kategoriyalar",path: ROUTE_PATHS.ADMIN_CATEGORIES,  icon: <MdCategory size={20} /> },
  { label: "Karyera",      path: ROUTE_PATHS.ADMIN_CAREER,      icon: <MdWork size={20} /> },
  { label: "Xabarlar",     path: ROUTE_PATHS.ADMIN_CONTACT,     icon: <MdMail size={20} /> },
  { label: "FAQ",          path: ROUTE_PATHS.ADMIN_FAQ, 
            icon: <MdQuestionAnswer size={20} /> },
  { label: "Sozlamalar",   path: ROUTE_PATHS.ADMIN_SETTINGS,    icon: <MdSettings size={20} /> },
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

      <aside className="w-64 h-full bg-[#1a1f2e] text-white flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="text-xl font-bold text-white">ad<span className="text-blue-400">blogger</span></span>
          <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-1">
          <NavLink
            to={ROUTE_PATHS.HOME}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-white/5"
          >
            ← Saytga qaytish
          </NavLink>
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-2 rounded-lg hover:bg-red-500/10 w-full text-left"
          >
            <MdLogout size={15} />
            Chiqish
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
