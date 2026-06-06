import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSocket } from "../hooks/useSocket";
import api from "../services/api";

const STATUS = {
  WAITING: "waiting",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export default function PendingApproval() {
  const navigate = useNavigate();
  const { pendingUserId, loginFromApproval, clearPending } = useAuthStore();
  const [status, setStatus] = useState(STATUS.WAITING);
  const [rejectionReason, setRejectionReason] = useState("");
  const [dots, setDots] = useState(".");

  // On mount — check current status (admin might have approved while user was away)
  useEffect(() => {
    if (!pendingUserId) return;

    const checkStatus = async () => {
      try {
        const res = await api.get(`/auth/check-status/${pendingUserId}`);
        const { applicationStatus, rejectionReason: reason } = res.data;
        if (applicationStatus === "approved") {
          setStatus(STATUS.APPROVED);
        } else if (applicationStatus === "rejected") {
          setRejectionReason(reason || "");
          setStatus(STATUS.REJECTED);
        }
      } catch {
        // Network error — stay in waiting
      }
    };

    checkStatus();
  }, [pendingUserId]);

  // Animated dots
  useEffect(() => {
    if (status !== STATUS.WAITING) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(interval);
  }, [status]);

  // WebSocket — listen for admin's real-time decision
  useSocket(pendingUserId ? `user_${pendingUserId}` : null, {
    application_approved: ({ token, user }) => {
      // Auto-login instantly via token from socket
      loginFromApproval({ token, user });
      setStatus(STATUS.APPROVED);
      // Redirect to profile completion (step 2)
      setTimeout(() => navigate("/profil-toldirish"), 2000);
    },
    application_rejected: ({ reason }) => {
      setRejectionReason(reason || "");
      setStatus(STATUS.REJECTED);
    },
  });

  // Redirect if no pendingUserId in store
  useEffect(() => {
    if (!pendingUserId) {
      navigate("/kirish");
    }
  }, [pendingUserId, navigate]);

  const handleGoBack = () => {
    clearPending();
    navigate("/kirish");
  };

  // ── APPROVED screen ──────────────────────────────────────────────────────
  if (status === STATUS.APPROVED) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#dcfce7" }}>
            <svg className="w-10 h-10" style={{ color: "#16a34a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#111827" }}>Tabriklaymiz!</h2>
          <p className="mb-2" style={{ color: "#4b5563" }}>
            Arizangiz <span style={{ color: "#16a34a", fontWeight: 700 }}>tasdiqlandi</span>!
          </p>
          <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
            Profil to'ldirish sahifasiga o'tilmoqda{dots}
          </p>
          {/* Progress bar */}
          <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: "#e5e7eb" }}>
            <div style={{
              height: "100%", background: "#22c55e", borderRadius: 99,
              animation: "fill 2.8s linear forwards",
            }} />
          </div>
        </div>
        <style>{`@keyframes fill { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    );
  }

  // ── REJECTED screen ──────────────────────────────────────────────────────
  if (status === STATUS.REJECTED) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)" }}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#fee2e2" }}>
            <svg className="w-10 h-10" style={{ color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#111827" }}>Ariza rad etildi</h2>
          <p className="mb-5" style={{ color: "#4b5563" }}>
            Afsuski, arizangiz <span style={{ color: "#dc2626", fontWeight: 700 }}>rad etildi</span>.
          </p>
          {rejectionReason && (
            <div className="text-left mb-6 p-4 rounded-xl" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#ef4444" }}>Sabab:</p>
              <p className="text-sm" style={{ color: "#7f1d1d" }}>{rejectionReason}</p>
            </div>
          )}
          <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
            Murojaat uchun biz bilan bog'laning yoki boshqa email bilan qayta ro'yxatdan o'ting.
          </p>
          <button onClick={handleGoBack}
            className="w-full py-3 rounded-xl font-bold text-white transition"
            style={{ background: "#dc2626" }}
            onMouseEnter={e => e.target.style.background = "#b91c1c"}
            onMouseLeave={e => e.target.style.background = "#dc2626"}
          >
            Kirish sahifasiga qaytish
          </button>
        </div>
      </div>
    );
  }

  // ── WAITING screen ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Top accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6)" }} />

        <div className="p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              <span style={{ color: "#dc2626" }}>Blog</span>
              <span style={{ color: "#f59e0b" }}>Hub</span>
            </h1>
          </div>

          {/* Frozen account badge */}
          <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
            style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" style={{ color: "#d97706" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#92400e" }}>Akkauntingiz vaqtincha muzlatilgan</p>
              <p className="text-xs mt-0.5" style={{ color: "#b45309" }}>
                Admin tasdiqlashini kuting — so'ng avtomatik faollashadi
              </p>
            </div>
          </div>

          {/* Spinner */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-full"
                style={{ border: "4px solid #dbeafe" }} />
              <div className="absolute inset-0 rounded-full"
                style={{ border: "4px solid transparent", borderTopColor: "#3b82f6", animation: "spin 1s linear infinite" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8" style={{ color: "#3b82f6" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold text-center" style={{ color: "#111827" }}>
              Arizangiz ko'rib chiqilmoqda{dots}
            </h2>
            <p className="text-sm text-center mt-2 leading-relaxed" style={{ color: "#6b7280" }}>
              Admin tasdiqlagan zahoti siz avtomatik tizimga kirarsiz
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-7">
            {[
              { done: true,   label: "Ariza muvaffaqiyatli yuborildi",  sub: "Ro'yxatdan o'tish tasdiqlandi" },
              { done: false,  label: "Admin ko'rib chiqmoqda",          sub: "Bir oz vaqt ketishi mumkin", active: true },
              { done: false,  label: "Akkaunt faollashtiriladi",        sub: "Tizimga avtomatik kirasiz" },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{
                    background: step.done ? "#22c55e" : step.active ? "#3b82f6" : "#e5e7eb",
                    color: step.done || step.active ? "#fff" : "#9ca3af",
                    animation: step.active ? "pulse 2s infinite" : "none",
                  }}>
                  {step.done ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold"
                    style={{ color: step.done ? "#6b7280" : step.active ? "#1d4ed8" : "#9ca3af",
                             textDecoration: step.done ? "line-through" : "none" }}>
                    {step.label}
                  </p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Live connection indicator */}
          <div className="flex items-center gap-2 p-3 rounded-xl mb-6"
            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: "#22c55e", boxShadow: "0 0 0 4px #dcfce7", animation: "pulse 2s infinite" }} />
            <span className="text-xs font-semibold" style={{ color: "#166534" }}>
              Admin qaroriga real-vaqt ulanish faol
            </span>
          </div>

          <button onClick={handleGoBack}
            className="w-full text-sm transition underline underline-offset-2 py-1"
            style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.target.style.color = "#6b7280"}
            onMouseLeave={e => e.target.style.color = "#9ca3af"}
          >
            ← Kirish sahifasiga qaytish
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: .5 } }
      `}</style>
    </div>
  );
}
