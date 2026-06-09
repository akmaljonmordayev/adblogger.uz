import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout    from "../layouts/MainLayout";
import { ROUTE_PATHS } from "../config/constants";
import PageLoader    from "../components/ui/PageLoader";

// Pages — lazy loaded
const Home          = lazy(() => import("../pages/Home"));
const Bloggers      = lazy(() => import("../pages/Bloggers"));
const BloggerDetail = lazy(() => import("../pages/BloggerDetail"));
const Categories    = lazy(() => import("../pages/Categories"));
const Pricing       = lazy(() => import("../pages/Pricing"));
const Contact       = lazy(() => import("../pages/Contact"));

const Ads           = lazy(() => import("../pages/Ads"));
const AdDetail      = lazy(() => import("../pages/AdDetail"));
const ElonBerish    = lazy(() => import("../pages/ElonBerish"));

const Blogs         = lazy(() => import("../pages/Blogs"));
const BlogDetail    = lazy(() => import("../pages/BlogDetail"));

const About         = lazy(() => import("../pages/About"));
const BlogerBolish  = lazy(() => import("../pages/BlogerBolish"));

const Privacy       = lazy(() => import("../pages/Privacy"));
const Terms         = lazy(() => import("../pages/Terms"));
const Cookies       = lazy(() => import("../pages/Cookies"));
const FAQ           = lazy(() => import("../pages/FAQ"));

const Auth          = lazy(() => import("../pages/Auth"));
const Profile       = lazy(() => import("../pages/Profile"));
const Wishlist      = lazy(() => import("../pages/Wishlist"));
const Notifications    = lazy(() => import("../pages/Notifications"));
const MyApplications  = lazy(() => import("../pages/MyApplications"));
const CompleteProfile = lazy(() => import("../pages/CompleteProfile"));

const NotFound      = lazy(() => import("../pages/NotFound"));

// Admin auth
const AdminLogin    = lazy(() => import("../auth/AdminLogin"));
const PendingApproval = lazy(() => import("../auth/PendingApproval"));

// Admin
const AdminLayout      = lazy(() => import("../admin/layouts/AdminLayout"));
const AdminDashboard   = lazy(() => import("../admin/pages/AdminDashboard"));
const AdminUsers       = lazy(() => import("../admin/pages/AdminUsers"));
const AdminBloggers    = lazy(() => import("../admin/pages/AdminBloggers"));
const AdminAds         = lazy(() => import("../admin/pages/AdminAds"));
const AdminBlogs       = lazy(() => import("../admin/pages/AdminBlogs"));
const AdminCategories  = lazy(() => import("../admin/pages/AdminCategories"));
const AdminContact     = lazy(() => import("../admin/pages/AdminContact"));
const AdminFAQ         = lazy(() => import("../admin/pages/AdminFAQ"));
const AdminSettings    = lazy(() => import("../admin/pages/AdminSettings"));
const AdminApplications  = lazy(() => import("../admin/pages/AdminApplications"));
const AdminBusinessmen   = lazy(() => import("../admin/pages/AdminBusinessmen"));

const wrap = (el) => <Suspense fallback={<PageLoader />}>{el}</Suspense>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: ROUTE_PATHS.HOME,           element: wrap(<Home />) },

      // Blogerlar
      { path: ROUTE_PATHS.BLOGGERS,       element: wrap(<Bloggers />) },
      { path: ROUTE_PATHS.BLOGGER_DETAIL, element: wrap(<BloggerDetail />) },

      // Katalog
      { path: ROUTE_PATHS.CATEGORIES,     element: wrap(<Categories />) },
      { path: ROUTE_PATHS.PRICING,        element: wrap(<Pricing />) },
      { path: ROUTE_PATHS.CONTACT,        element: wrap(<Contact />) },

      // E'lonlar
      { path: ROUTE_PATHS.ADS,            element: wrap(<Ads />) },
      { path: ROUTE_PATHS.AD_DETAIL,      element: wrap(<AdDetail />) },
      { path: ROUTE_PATHS.ELON_BERISH,    element: wrap(<ElonBerish />) },

      // Blog
      { path: ROUTE_PATHS.BLOGS,          element: wrap(<Blogs />) },
      { path: ROUTE_PATHS.BLOG_DETAIL,    element: wrap(<BlogDetail />) },

      // Kompaniya
      { path: ROUTE_PATHS.ABOUT,          element: wrap(<About />) },
      { path: ROUTE_PATHS.BLOGER_BOLISH,  element: wrap(<BlogerBolish />) },

      // Huquqiy
      { path: ROUTE_PATHS.PRIVACY,        element: wrap(<Privacy />) },
      { path: ROUTE_PATHS.TERMS,          element: wrap(<Terms />) },
      { path: ROUTE_PATHS.COOKIES,        element: wrap(<Cookies />) },
      { path: ROUTE_PATHS.FAQ,            element: wrap(<FAQ />) },

      // Auth & foydalanuvchi
      { path: ROUTE_PATHS.LOGIN,          element: wrap(<Auth />) },
      { path: ROUTE_PATHS.REGISTER,       element: wrap(<Auth />) },
      { path: ROUTE_PATHS.PROFILE,        element: wrap(<Profile />) },
      { path: ROUTE_PATHS.WISHLIST,         element: wrap(<Wishlist />) },
      { path: ROUTE_PATHS.NOTIFICATIONS,   element: wrap(<Notifications />) },
      { path: ROUTE_PATHS.MY_APPLICATIONS, element: wrap(<MyApplications />) },
    ],
  },
  {
    path: "/admin",
    element: wrap(<AdminLayout />),
    children: [
      { index: true,                                    element: wrap(<AdminDashboard />) },
      { path: ROUTE_PATHS.ADMIN_DASHBOARD,              element: wrap(<AdminDashboard />) },
      { path: ROUTE_PATHS.ADMIN_USERS,                  element: wrap(<AdminUsers />) },
      { path: ROUTE_PATHS.ADMIN_BLOGGERS,               element: wrap(<AdminBloggers />) },
      { path: ROUTE_PATHS.ADMIN_ADS,                    element: wrap(<AdminAds />) },
      { path: ROUTE_PATHS.ADMIN_BLOGS,                  element: wrap(<AdminBlogs />) },
      { path: ROUTE_PATHS.ADMIN_CATEGORIES,             element: wrap(<AdminCategories />) },
      { path: ROUTE_PATHS.ADMIN_CONTACT,                element: wrap(<AdminContact />) },
      { path: ROUTE_PATHS.ADMIN_FAQ,                    element: wrap(<AdminFAQ />) },
      { path: ROUTE_PATHS.ADMIN_SETTINGS,               element: wrap(<AdminSettings />) },
      { path: ROUTE_PATHS.ADMIN_APPLICATIONS,           element: wrap(<AdminApplications />) },
      { path: ROUTE_PATHS.ADMIN_BUSINESSMEN,            element: wrap(<AdminBusinessmen />) },
    ],
  },
  {
    path: ROUTE_PATHS.ADMIN_LOGIN,
    element: wrap(<AdminLogin />),
  },
  {
    path: "/tasdiqlash-kutilmoqda",
    element: wrap(<PendingApproval />),
  },
  {
    path: "/profil-toldirish",
    element: wrap(<CompleteProfile />),
  },
  {
    path: "*",
    element: wrap(<NotFound />),
  },
]);
