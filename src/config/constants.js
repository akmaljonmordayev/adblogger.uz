export const APP_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || "https://api.adbloger.uz",
  SITE_NAME: "adblogger",
  TITLE_SUFFIX: " | adblogger",
};

export const ROUTE_PATHS = {
  // Asosiy
  HOME:           "/",
  BLOGGERS:       "/bloggers",
  BLOGGER_DETAIL: "/bloggers/:id",
  CATEGORIES:     "/categories",
  PRICING:        "/pricing",
  CONTACT:        "/contact",

  // E'lon
  ADS:            "/ads",
  AD_DETAIL:      "/ads/:id",
  ELON_BERISH:    "/post-ad",

  // Blog
  BLOGS:          "/blog",
  BLOG_DETAIL:    "/blog/:id",

  // Kompaniya
  ABOUT:          "/about",
  CAREER:         "/career",
  BLOGER_BOLISH:  "/become-blogger",

  // Huquqiy
  PRIVACY:        "/privacy",
  TERMS:          "/terms",
  COOKIES:        "/cookies",
  FAQ:            "/faq",

  // Auth & foydalanuvchi
  LOGIN:          "/login",
  REGISTER:       "/register",
  PROFILE:        "/profile",

  // Admin
  ADMIN:                "/admin",
  ADMIN_DASHBOARD:      "/admin/dashboard",
  ADMIN_USERS:          "/admin/users",
  ADMIN_BLOGGERS:       "/admin/bloggers",
  ADMIN_ADS:            "/admin/ads",
  ADMIN_BLOGS:          "/admin/blogs",
  ADMIN_CATEGORIES:     "/admin/categories",
  ADMIN_PRICING:        "/admin/pricing",
  ADMIN_CAREER:         "/admin/career",
  ADMIN_CONTACT:        "/admin/contact",
  ADMIN_FAQ:            "/admin/faq",
  ADMIN_SETTINGS:       "/admin/settings",
};
