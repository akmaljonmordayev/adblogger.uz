import axios from "axios";
import { toast } from "../components/ui/toast";

// Axios instance yaratish
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.adbloger.uz/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Tokenni yuborish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xatoliklarni boshqarish
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "Kutilmagan xatolik yuz berdi";
    
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error.response?.status >= 500) {
      toast.error("Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
