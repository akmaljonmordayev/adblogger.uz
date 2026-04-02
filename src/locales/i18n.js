import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  uz: {
    translation: {
      "Welcome to AdBloger": "AdBloger'ga xush kelibsiz",
      "Ads": "E'lonlar",
      "Blog": "Blog",
      "Login": "Kirish",
      "Register": "Ro'yxatdan o'tish",
      "Profile": "Profil",
    },
  },
  ru: {
    translation: {
      "Welcome to AdBloger": "Добро пожаловать в AdBloger",
      "Ads": "Объявления",
      "Blog": "Блог",
      "Login": "Войти",
      "Register": "Регистрация",
      "Profile": "Профиль",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "uz",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
