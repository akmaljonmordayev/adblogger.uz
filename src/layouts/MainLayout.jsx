import { Outlet, Link, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer";

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
      <main className="flex-grow container mx-auto px-6 py-6 animate-fade-in">
        <Outlet />
      </main>
      
      {/* Professional Footer */}
      <Footer/>
    </div>
  );
};

export default MainLayout;
