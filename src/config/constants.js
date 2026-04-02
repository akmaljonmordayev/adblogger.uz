export const APP_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || "https://api.adbloger.uz",
  SITE_NAME: "AdBloger",
  TITLE_SUFFIX: " | AdBloger",
};

export const ROUTE_PATHS = {
  HOME: "/",
  ADS: "/ads",
  AD_DETAILS: "/ads/:id",
  BLOG: "/blog",
  BLOG_DETAILS: "/blog/:id",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PROFILE: "/profile",
};
