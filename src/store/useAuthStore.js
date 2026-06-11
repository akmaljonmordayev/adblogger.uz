import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      // Pending state — stored so user can reconnect to pending screen
      pendingUserId: null,
      pendingEmail: null,

      // ── Setters ──────────────────────────────────────────────────────────
      setUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem("token", token);
        set({ token });
      },

      // Called when socket emits 'application_approved' with token+user
      loginFromApproval: ({ token, user }) => {
        localStorage.setItem("token", token);
        set({ token, user, pendingUserId: null, pendingEmail: null });
      },

      // ── OTP Login ────────────────────────────────────────────────────────
      loginWithOtp: async ({ email, otp }, axiosConfig = {}) => {
        const res = await api.post("/auth/verify-login-otp", { email, otp }, axiosConfig);
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        set({ token, user, pendingUserId: null, pendingEmail: null });
        return user;
      },

      // Set pending after OTP registration verification
      setPendingFromOtp: ({ userId, email }) => {
        set({ pendingUserId: userId, pendingEmail: email });
      },

      // ── Register ─────────────────────────────────────────────────────────
      register: async ({ firstName, lastName, email, phone, password, role, platforms, followers, categories }, axiosConfig = {}) => {
        const res = await api.post("/auth/register", {
          firstName, lastName, email, phone, password, role, platforms, followers, categories,
        }, axiosConfig);
        const { status, userId } = res.data;
        if (status === "pending") {
          set({ pendingUserId: userId, pendingEmail: email });
        }
        return res.data;
      },

      // ── Login (password-based, kept for backward compatibility) ───────────
      login: async ({ email, password }, axiosConfig = {}) => {
        const res = await api.post("/auth/login", { email, password }, axiosConfig);
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        set({ token, user, pendingUserId: null, pendingEmail: null });
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
        set({ user: null, token: null, pendingUserId: null, pendingEmail: null });
      },

      clearPending: () => {
        set({ pendingUserId: null, pendingEmail: null });
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
      isPending: () => !!get().pendingUserId,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        pendingUserId: state.pendingUserId,
        pendingEmail: state.pendingEmail,
      }),
    }
  )
);
