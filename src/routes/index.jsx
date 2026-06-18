import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout    from "../layouts/MainLayout";
import { ROUTE_PATHS } from "../config/constants";
import PageLoader    from "../components/ui/PageLoader";
import ChunkErrorPage from "../pages/ChunkErrorPage";

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
const ProfilePendingApproval = lazy(() => import("../auth/ProfilePendingApproval"));

// Admin
const AdminLayout      = lazy(() => import("../admin/layouts/AdminLayout"));
const AdminDashboard   = lazy(() => import("../admin/pages/AdminDashboard"));
const AdminStatistics  = lazy(() => import("../admin/pages/AdminStatistics"));
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
const AdminComments      = lazy(() => import("../admin/pages/AdminComments"));

const wrap = (el) => <Suspense fallback={<PageLoader />}>{el}</Suspense>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ChunkErrorPage />,
    children: [
      { path: ROUTE_PATHS.HOME,           element: wrap(<Home />),           errorElement: <ChunkErrorPage /> },

      // Blogerlar
      { path: ROUTE_PATHS.BLOGGERS,       element: wrap(<Bloggers />),       errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.BLOGGER_DETAIL, element: wrap(<BloggerDetail />),  errorElement: <ChunkErrorPage /> },

      // Katalog
      { path: ROUTE_PATHS.CATEGORIES,     element: wrap(<Categories />),     errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.PRICING,        element: wrap(<Pricing />),        errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.CONTACT,        element: wrap(<Contact />),        errorElement: <ChunkErrorPage /> },

      // E'lonlar
      { path: ROUTE_PATHS.ADS,            element: wrap(<Ads />),            errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.AD_DETAIL,      element: wrap(<AdDetail />),       errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ELON_BERISH,    element: wrap(<ElonBerish />),     errorElement: <ChunkErrorPage /> },

      // Blog
      { path: ROUTE_PATHS.BLOGS,          element: wrap(<Blogs />),          errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.BLOG_DETAIL,    element: wrap(<BlogDetail />),     errorElement: <ChunkErrorPage /> },

      // Kompaniya
      { path: ROUTE_PATHS.ABOUT,          element: wrap(<About />),          errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.BLOGER_BOLISH,  element: wrap(<BlogerBolish />),   errorElement: <ChunkErrorPage /> },

      // Huquqiy
      { path: ROUTE_PATHS.PRIVACY,        element: wrap(<Privacy />),        errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.TERMS,          element: wrap(<Terms />),          errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.COOKIES,        element: wrap(<Cookies />),        errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.FAQ,            element: wrap(<FAQ />),            errorElement: <ChunkErrorPage /> },

      // Auth & foydalanuvchi
      { path: ROUTE_PATHS.LOGIN,          element: wrap(<Auth />),           errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.REGISTER,       element: wrap(<Auth />),           errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.PROFILE,        element: wrap(<Profile />),        errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.WISHLIST,         element: wrap(<Wishlist />),       errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.NOTIFICATIONS,   element: wrap(<Notifications />),  errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.MY_APPLICATIONS, element: wrap(<MyApplications />), errorElement: <ChunkErrorPage /> },
    ],
  },
  {
    path: "/admin",
    element: wrap(<AdminLayout />),
    errorElement: <ChunkErrorPage />,
    children: [
      { index: true,                         element: wrap(<AdminDashboard />),    errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_DASHBOARD,   element: wrap(<AdminDashboard />),    errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_USERS,       element: wrap(<AdminUsers />),        errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_BLOGGERS,    element: wrap(<AdminBloggers />),     errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_ADS,         element: wrap(<AdminAds />),          errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_BLOGS,       element: wrap(<AdminBlogs />),        errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_CATEGORIES,  element: wrap(<AdminCategories />),   errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_CONTACT,     element: wrap(<AdminContact />),      errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_FAQ,         element: wrap(<AdminFAQ />),          errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_SETTINGS,    element: wrap(<AdminSettings />),     errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_APPLICATIONS,element: wrap(<AdminApplications />), errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_BUSINESSMEN, element: wrap(<AdminBusinessmen />),  errorElement: <ChunkErrorPage /> },
      { path: "/admin/statistics",           element: wrap(<AdminStatistics />),   errorElement: <ChunkErrorPage /> },
      { path: ROUTE_PATHS.ADMIN_COMMENTS,    element: wrap(<AdminComments />),     errorElement: <ChunkErrorPage /> },
    ],
  },
  {
    path: ROUTE_PATHS.ADMIN_LOGIN,
    element: wrap(<AdminLogin />),
    errorElement: <ChunkErrorPage />,
  },
  {
    path: "/tasdiqlash-kutilmoqda",
    element: wrap(<PendingApproval />),
    errorElement: <ChunkErrorPage />,
  },
  {
    path: "/profil-toldirish",
    element: wrap(<CompleteProfile />),
    errorElement: <ChunkErrorPage />,
  },
  {
    path: "/profil-tasdiqlash-kutilmoqda",
    element: wrap(<ProfilePendingApproval />),
    errorElement: <ChunkErrorPage />,
  },
  {
    path: "*",
    element: wrap(<NotFound />),
    errorElement: <ChunkErrorPage />,
  },
]);
