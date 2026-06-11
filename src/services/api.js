import axios from "axios";
import { toast } from "../components/ui/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://adblogger-uz.onrender.com/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Token yuborish + retry metadata
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config._retryCount === undefined) {
      config._retryCount = 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Retry + xatoliklarni boshqarish
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Network xatosi yoki server ulanishni yopdi — retry
    const isNetworkError = !error.response && (
      error.code === "ERR_NETWORK" ||
      error.code === "ERR_CONNECTION_CLOSED" ||
      error.message === "Network Error" ||
      error.code === "ECONNABORTED"
    );

    const MAX_RETRIES = 3;

    if (isNetworkError && config && config._retryCount < MAX_RETRIES) {
      config._retryCount += 1;
      // Har retry oldidan biroz kutish (eksponentsial: 1s, 2s, 4s)
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      await new Promise((res) => setTimeout(res, delay));
      return api(config);
    }

    // 401 — login sahifasiga (faqat auth bo'lmagan so'rovlar uchun)
    if (error.response?.status === 401) {
      const url = config?.url || "";
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/verify-login-otp") || url.includes("/auth/admin-login");
      if (!isAuthEndpoint) {
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("token");
        window.location.href = "/kirish";
      }
      return Promise.reject(error);
    }

    // Foydalanuvchiga xabar
    if (!config?._skipToast) {
      if (isNetworkError) {
        toast.error("Internet ulanishi yo'q yoki server javob bermayapti. Iltimos, qayta urinib ko'ring.");
      } else if (error.response?.status >= 500) {
        toast.error("Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
      } else if (error.response?.status !== 401) {
        const message = error.response?.data?.message || "Kutilmagan xatolik yuz berdi";
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
