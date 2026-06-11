import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSocket } from "../hooks/useSocket";
import api from "../services/api";

const STATUS = {
  WAITING: "waiting",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export default function ProfilePendingApproval() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [status, setStatus] = useState(STATUS.WAITING);
  const [rejectionReason, setRejectionReason] = useState("");
  const [dots, setDots] = useState(".");

  const userId = user?._id;

  // On mount — poll status in case admin approved while user was away
  useEffect(() => {
    if (!userId) return;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/auth/check-status/${userId}`);
        const { profileStatus, profileRejectionReason: reason, onboardingStep } = res.data;
        if (onboardingStep === 4 || profileStatus === "approved") {
          setStatus(STATUS.APPROVED);
        } else if (profileStatus === "rejected") {
          setRejectionReason(reason || "");
          setStatus(STATUS.REJECTED);
        }
      } catch {
        // Network error — stay in waiting
      }
    };

    checkStatus();

    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Animated dots
  useEffect(() => {
    if (status !== STATUS.WAITING) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(interval);
  }, [status]);

  // WebSocket — listen for admin's real-time decision on profile
  useSocket(userId ? `user_${userId}` : null, {
    profile_approved: () => {
      setStatus(STATUS.APPROVED);
      // Refresh user data then navigate home after delay
      setTimeout(async () => {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data.data);
        } catch { /* ignore */ }
        navigate("/");
      }, 2000);
    },
    profile_rejected: ({ reason }) => {
      setRejectionReason(reason || "");
      setStatus(STATUS.REJECTED);
    },
  });

  // If no user logged in, redirect
  useEffect(() => {
    if (!userId) {
      navigate("/kirish");
    }
  }, [userId, navigate]);

  const handleGoResubmit = () => {
    navigate("/profil-toldirish");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // ── APPROVED screen ──────────────────────────────────────────────────────
  if (status === STATUS.APPROVED) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,.1)", padding: "48px 40px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" style={{ width: 36, height: 36 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "0 0 12px" }}>Tabriklaymiz! 🎉</h2>
          <p style={{ color: "#4b5563", fontSize: 15, marginBottom: 8 }}>
            Profilingiz <strong style={{ color: "#16a34a" }}>tasdiqlandi</strong>!
          </p>
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24 }}>
            Bosh sahifaga o'tilmoqda{dots}
          </p>
          <div style={{ height: 4, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#22c55e", borderRadius: 99, animation: "fill 2s linear forwards" }} />
          </div>
        </div>
        <style>{`@keyframes fill { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    );
  }

  // ── REJECTED screen ──────────────────────────────────────────────────────
  if (status === STATUS.REJECTED) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "linear-gradient(135deg,#fff1f2,#ffe4e6)", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,.1)", padding: "48px 40px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" style={{ width: 36, height: 36 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>Profil rad etildi</h2>
          <p style={{ color: "#4b5563", fontSize: 15, marginBottom: 20 }}>
            Afsuski, profilingiz <strong style={{ color: "#dc2626" }}>rad etildi</strong>.
          </p>

          {rejectionReason && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 18px", marginBottom: 20, textAlign: "left" }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sabab:</p>
              <p style={{ margin: 0, fontSize: 14, color: "#7f1d1d" }}>{rejectionReason}</p>
            </div>
          )}

          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>
            Ma'lumotlaringizni to'g'rilab, profilingizni qayta yuborishingiz mumkin.
          </p>

          <button
            onClick={handleGoResubmit}
            style={{
              width: "100%", padding: "13px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff",
              fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
              marginBottom: 10, boxShadow: "0 4px 14px rgba(198,40,40,0.3)",
            }}
          >
            Profilni qayta to'ldirish →
          </button>
          <button
            onClick={handleGoHome}
            style={{ width: "100%", padding: "11px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  // ── WAITING screen ───────────────────────────────────────────────────────
  const steps = [
    { label: "Ariza tasdiqlandi", sub: "Email tasdiqlash va ariza muvaffaqiyatli o'tdi", done: true },
    { label: "Profil to'ldirildi", sub: "Profil ma'lumotlaringiz yuborildi", done: true },
    { label: "Profil ko'rib chiqilmoqda", sub: "Admin profilingizni ko'rib chiqmoqda", done: false, active: true },
    { label: "Akkaunt faollashadi", sub: "Tizimdan to'liq foydalana olasiz", done: false },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "linear-gradient(135deg,#f8fafc,#eff6ff)", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 24, boxShadow: "0 12px 50px rgba(0,0,0,.08)", overflow: "hidden" }}>

        {/* Top accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg,#dc2626,#7c3aed,#2563eb)" }} />

        <div style={{ padding: "36px 36px 32px" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#C62828,#E53935)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 18, height: 18 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#111827" }}>
                Ad<span style={{ color: "#dc2626" }}>Bloger</span>
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, marginBottom: 24, background: "#fffbeb", border: "1px solid #fde68a" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ width: 20, height: 20, flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#92400e" }}>Profil ko'rib chiqilmoqda</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#b45309" }}>Admin tasdiqlashini kuting — so'ng avtomatik faollashadi</p>
            </div>
          </div>

          {/* Spinner */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <div style={{ position: "relative", width: 72, height: 72, marginBottom: 16 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid #dbeafe" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid transparent", borderTopColor: "#7c3aed", animation: "spin 1s linear infinite" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" style={{ width: 30, height: 30 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827", textAlign: "center" }}>
              Profilingiz ko'rib chiqilmoqda{dots}
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280", textAlign: "center" }}>
              Admin tasdiqlagan zahoti siz avtomatik bildirilasiz
            </p>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 24 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: i < steps.length - 1 ? 14 : 0 }}>
                <div style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, marginTop: 2,
                  background: step.done ? "#22c55e" : step.active ? "#7c3aed" : "#e5e7eb",
                  color: step.done || step.active ? "#fff" : "#9ca3af",
                  animation: step.active ? "pulse 2s infinite" : "none",
                }}>
                  {step.done ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: 13, height: 13 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <div>
                  <p style={{
                    margin: 0, fontSize: 13, fontWeight: 700,
                    color: step.done ? "#6b7280" : step.active ? "#5b21b6" : "#9ca3af",
                    textDecoration: step.done ? "line-through" : "none",
                  }}>
                    {step.label}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Live connection indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: "#f5f3ff", border: "1px solid #ddd6fe", marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 0 4px #ede9fe", animation: "pulse 2s infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5b21b6" }}>
              Real-vaqt ulanish faol — admin qaroriga kutilmoqda
            </span>
          </div>

          <button
            onClick={handleGoHome}
            style={{ width: "100%", textAlign: "center", background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: "4px 0", textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            ← Bosh sahifaga qaytish
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: .45 } }
      `}</style>
    </div>
  );
}
