import { createBrowserRouter } from "react-router-dom";
import MainLayout    from "../layouts/MainLayout";
import { ROUTE_PATHS } from "../config/constants";

// Pages
import Home          from "../pages/Home";
import Bloggers      from "../pages/Bloggers";
import BloggerDetail from "../pages/BloggerDetail";
import Categories    from "../pages/Categories";
import Pricing       from "../pages/Pricing";
import Contact       from "../pages/Contact";

import Ads           from "../pages/Ads";
import AdDetail      from "../pages/AdDetail";
import ElonBerish    from "../pages/ElonBerish";

import Blogs         from "../pages/Blogs";
import BlogDetail    from "../pages/BlogDetail";

import About         from "../pages/About";
import Career        from "../pages/Career";
import BlogerBolish  from "../pages/BlogerBolish";


import Privacy       from "../pages/Privacy";
import Terms         from "../pages/Terms";
import Cookies       from "../pages/Cookies";
import FAQ           from "../pages/FAQ";

import Auth          from "../pages/Auth";
import Profile       from "../pages/Profile";

import NotFound      from "../pages/NotFound";

// Admin
import AdminLayout      from "../admin/layouts/AdminLayout";
import AdminDashboard   from "../admin/pages/AdminDashboard";
import AdminUsers       from "../admin/pages/AdminUsers";
import AdminBloggers    from "../admin/pages/AdminBloggers";
import AdminAds         from "../admin/pages/AdminAds";
import AdminBlogs       from "../admin/pages/AdminBlogs";
import AdminCategories  from "../admin/pages/AdminCategories";
import AdminPricing     from "../admin/pages/AdminPricing";
import AdminCareer      from "../admin/pages/AdminCareer";
import AdminContact     from "../admin/pages/AdminContact";
import AdminFAQ         from "../admin/pages/AdminFAQ";
import AdminSettings    from "../admin/pages/AdminSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: ROUTE_PATHS.HOME,           element: <Home /> },

      // Blogerlar
      { path: ROUTE_PATHS.BLOGGERS,       element: <Bloggers /> },
      { path: ROUTE_PATHS.BLOGGER_DETAIL, element: <BloggerDetail /> },

      // Katalog
      { path: ROUTE_PATHS.CATEGORIES,     element: <Categories /> },
      { path: ROUTE_PATHS.PRICING,        element: <Pricing /> },
      { path: ROUTE_PATHS.CONTACT,        element: <Contact /> },

      // E'lonlar
      { path: ROUTE_PATHS.ADS,            element: <Ads /> },
      { path: ROUTE_PATHS.AD_DETAIL,      element: <AdDetail /> },
      { path: ROUTE_PATHS.ELON_BERISH,    element: <ElonBerish /> },

      // Blog
      { path: ROUTE_PATHS.BLOGS,          element: <Blogs /> },
      { path: ROUTE_PATHS.BLOG_DETAIL,    element: <BlogDetail /> },

      // Kompaniya
      { path: ROUTE_PATHS.ABOUT,          element: <About /> },
      { path: ROUTE_PATHS.CAREER,         element: <Career /> },
      { path: ROUTE_PATHS.BLOGER_BOLISH,  element: <BlogerBolish /> },

      // Huquqiy
      { path: ROUTE_PATHS.PRIVACY,        element: <Privacy /> },
      { path: ROUTE_PATHS.TERMS,          element: <Terms /> },
      { path: ROUTE_PATHS.COOKIES,        element: <Cookies /> },
      { path: ROUTE_PATHS.FAQ,            element: <FAQ /> },

      // Auth
      { path: ROUTE_PATHS.LOGIN,          element: <Auth /> },
      { path: ROUTE_PATHS.REGISTER,       element: <Auth /> },
      { path: ROUTE_PATHS.PROFILE,        element: <Profile /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true,                                    element: <AdminDashboard /> },
      { path: ROUTE_PATHS.ADMIN_DASHBOARD,              element: <AdminDashboard /> },
      { path: ROUTE_PATHS.ADMIN_USERS,                  element: <AdminUsers /> },
      { path: ROUTE_PATHS.ADMIN_BLOGGERS,               element: <AdminBloggers /> },
      { path: ROUTE_PATHS.ADMIN_ADS,                    element: <AdminAds /> },
      { path: ROUTE_PATHS.ADMIN_BLOGS,                  element: <AdminBlogs /> },
      { path: ROUTE_PATHS.ADMIN_CATEGORIES,             element: <AdminCategories /> },
      { path: ROUTE_PATHS.ADMIN_PRICING,                element: <AdminPricing /> },
      { path: ROUTE_PATHS.ADMIN_CAREER,                 element: <AdminCareer /> },
      { path: ROUTE_PATHS.ADMIN_CONTACT,                element: <AdminContact /> },
      { path: ROUTE_PATHS.ADMIN_FAQ,                    element: <AdminFAQ /> },
      { path: ROUTE_PATHS.ADMIN_SETTINGS,               element: <AdminSettings /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
