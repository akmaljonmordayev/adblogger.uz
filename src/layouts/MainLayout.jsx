import { useEffect } from "react";
import { Outlet, useLocation, useNavigation, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer";
import PageLoader from "../components/ui/PageLoader";
import { useAuthStore } from "../store/useAuthStore";

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const isHome = pathname === "/";
  const isLoading = navigation.state === "loading";
  const hideFooter = pathname === ROUTE_PATHS.MY_APPLICATIONS;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Guard: if logged in but onboarding not complete, redirect to profile completion
  if (user && user.onboardingStep === 2 && pathname !== "/profil-toldirish") {
    return <Navigate to="/profil-toldirish" replace />;
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header/>
      <main className={isHome ? "flex-grow animate-fade-in" : "flex-grow container mx-auto px-6 py-6 animate-fade-in"}>
        <Outlet />
      </main>
      {!hideFooter && <Footer/>}
    </div>
  );
};

export default MainLayout;
