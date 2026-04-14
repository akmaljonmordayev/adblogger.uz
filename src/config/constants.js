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
};
