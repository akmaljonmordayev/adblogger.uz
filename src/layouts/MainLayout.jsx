import { Outlet, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header/>
      <main className={isHome ? "flex-grow animate-fade-in" : "flex-grow container mx-auto px-6 py-6 animate-fade-in"}>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default MainLayout;
