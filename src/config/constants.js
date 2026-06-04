export const APP_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || "https://adblogger-uz.onrender.com/api/v1",
  SITE_NAME: "adblogger",
  TITLE_SUFFIX: " | adblogger",
};

export const ROUTE_PATHS = {
  // Asosiy
  HOME:           "/",
  BLOGGERS:       "/blogerlar",
  BLOGGER_DETAIL: "/blogerlar/:id",
  CATEGORIES:     "/kategoriyalar",
  PRICING:        "/narxlar",
  CONTACT:        "/aloqa",

  // E'lon
  ADS:            "/elonlar",
  AD_DETAIL:      "/elonlar/:id",
  ELON_BERISH:    "/elon-berish",

  // Blog
  BLOGS:          "/blog",
  BLOG_DETAIL:    "/blog/:id",

  // Kompaniya
  ABOUT:          "/haqida",
  CAREER:         "/martaba",
  BLOGER_BOLISH:  "/blogger-bolish",

  // Huquqiy
  PRIVACY:        "/maxfiylik",
  TERMS:          "/shartlar",
  COOKIES:        "/kukilar",
  FAQ:            "/faq",

  // Auth & foydalanuvchi
  LOGIN:            "/kirish",
  REGISTER:         "/royxatdan-otish",
  PROFILE:          "/profil",
  WISHLIST:         "/sevimlilar",
  NOTIFICATIONS:    "/bildirishnomalar",
  MY_APPLICATIONS:  "/mening-zayavkalarim",

  // Admin
  ADMIN:                "/admin",
  ADMIN_LOGIN:          "/admin/login",
  ADMIN_DASHBOARD:      "/admin/dashboard",
  ADMIN_USERS:          "/admin/users",
  ADMIN_BLOGGERS:       "/admin/bloggers",
  ADMIN_ADS:            "/admin/ads",
  ADMIN_BLOGS:          "/admin/blogs",
  ADMIN_CATEGORIES:     "/admin/categories",
  ADMIN_CAREER:         "/admin/career",
  ADMIN_CONTACT:        "/admin/contact",
  ADMIN_FAQ:            "/admin/faq",
  ADMIN_SETTINGS:       "/admin/settings",
  ADMIN_APPLICATIONS:   "/admin/applications",
};
