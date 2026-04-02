import { Outlet, Link, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";
import Header from "../components/layout/Header"

const MainLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Bosh sahifa", path: ROUTE_PATHS.HOME },
    { name: "E'lonlar", path: ROUTE_PATHS.ADS },
    { name: "Blog", path: ROUTE_PATHS.BLOG },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Premium Header */}
    <Header/>
      
      {/* Dynamic Content */}
      <main className="flex-grow container mx-auto px-6 py-12 animate-fade-in">
        <Outlet />
      </main>
      
      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="text-xl font-black text-gray-900 mb-4">ADBLOGER</div>
            <p className="text-gray-500 text-sm max-w-xs">E'lonlar va blog postlar uchun zamonaviy platforma.</p>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AdBloger. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">Telegram</a>
            <a href="#" className="text-gray-400 hover:text-pink-600 transition">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
