import { Outlet, Link, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";

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
      <nav className="sticky top-0 z-50 glass border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            ADBLOGER
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`font-semibold text-sm transition-colors duration-200 ${
                  location.pathname === item.path ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to={ROUTE_PATHS.LOGIN} className="px-6 py-2.5 rounded-full font-bold text-sm bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition transform active:translate-y-0">
              Kirish
            </Link>
          </div>
        </div>
      </nav>
      
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
