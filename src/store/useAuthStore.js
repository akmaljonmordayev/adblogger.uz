import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem("token", token);
        set({ token });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
