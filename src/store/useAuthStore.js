import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      // ── Setters ──────────────────────────────────────────────────────────
      setUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem("token", token);
        set({ token });
      },

      // ── Register ─────────────────────────────────────────────────────────
      register: async ({ firstName, lastName, email, phone, password, role }) => {
        const res = await api.post("/auth/register", {
          firstName,
          lastName,
          email,
          phone,
          password,
          role,
        });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        set({ token, user });
        return user;
      },

      // ── Login ─────────────────────────────────────────────────────────────
      login: async ({ email, password }) => {
        const res = await api.post("/auth/login", { email, password });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        set({ token, user });
        return user;
      },

      // ── Admin Login ───────────────────────────────────────────────────────
      adminLogin: async ({ email, password }) => {
        const res = await api.post("/auth/admin-login", { email, password });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        set({ token, user });
        return user;
      },

      // ── Logout ────────────────────────────────────────────────────────────
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },

      // ── Fetch current user ────────────────────────────────────────────────
      fetchMe: async () => {
        try {
          const res = await api.get("/auth/me");
          set({ user: res.data.data });
        } catch {
          get().logout();
        }
      },

      // ── Helpers ───────────────────────────────────────────────────────────
      isLoggedIn: () => !!get().token,
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
