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
  ADMIN_LOGIN:          "/admin/kirish",
  ADMIN_DASHBOARD:      "/admin/boshqaruv",
  ADMIN_USERS:          "/admin/foydalanuvchilar",
  ADMIN_BLOGGERS:       "/admin/blogerlar",
  ADMIN_ADS:            "/admin/elonlar",
  ADMIN_BLOGS:          "/admin/bloglar",
  ADMIN_CATEGORIES:     "/admin/kategoriyalar",
  ADMIN_CAREER:         "/admin/martaba",
  ADMIN_CONTACT:        "/admin/aloqa",
  ADMIN_FAQ:            "/admin/faq",
  ADMIN_SETTINGS:       "/admin/sozlamalar",
  ADMIN_APPLICATIONS:   "/admin/zayavkalar",
};
