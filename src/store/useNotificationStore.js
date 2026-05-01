import { create } from "zustand";
import api from "../services/api";

// ─── iPhone-like tri-tone sound (Web Audio API) ───────────────────────────────
export function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // iOS tri-tone: C6 → E6 → G6
    const notes = [1047, 1319, 1568];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const t0 = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.22, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);

      osc.start(t0);
      osc.stop(t0 + 0.25);
    });
  } catch {
    // Web Audio API not available
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useNotificationStore = create((set, get) => ({
  unreadCount: 0,
  initialized: false,

  fetch: async () => {
    try {
      const res = await api.get("/notifications");
      const newCount = res.data.unreadCount ?? 0;
      const prev     = get().unreadCount;
      const wasInit  = get().initialized;

      // Play sound only when new notifications arrive (not on first load)
      if (wasInit && newCount > prev) {
        playNotificationSound();
      }

      set({ unreadCount: newCount, initialized: true });
    } catch {
      // not logged in or network error — silently ignore
    }
  },

  // Call after marking one as read
  decrement: () =>
    set(s => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),

  // Call after mark-all-read
  clearAll: () => set({ unreadCount: 0 }),

  // Reset on logout
  reset: () => set({ unreadCount: 0, initialized: false }),
}));
