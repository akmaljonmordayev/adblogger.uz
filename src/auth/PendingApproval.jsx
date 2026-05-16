import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSocket } from "../hooks/useSocket";

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

  // Animated dots for waiting indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // WebSocket — listen for admin decision
  useSocket(pendingUserId ? `user_${pendingUserId}` : null, {
    application_approved: ({ token, user }) => {
      loginFromApproval({ token, user });
      setStatus(STATUS.APPROVED);
      setTimeout(() => navigate("/"), 2500);
    },
    application_rejected: ({ reason }) => {
      setRejectionReason(reason || "");
      setStatus(STATUS.REJECTED);
    },
  });

  // If no pendingUserId, redirect to register
  useEffect(() => {
    if (!pendingUserId) {
      navigate("/login");
    }
  }, [pendingUserId, navigate]);

  const handleGoBack = () => {
    clearPending();
    navigate("/login");
  };

  if (status === STATUS.APPROVED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tabriklaymiz!</h2>
          <p className="text-gray-600 mb-2">Arizangiz <span className="text-green-600 font-semibold">tasdiqlandi</span>.</p>
          <p className="text-gray-500 text-sm">Platformaga kirish amalga oshirilmoqda{dots}</p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full animate-[progress_2.5s_linear_forwards]" style={{ width: "100%", animation: "progress 2.5s linear forwards" }} />
          </div>
        </div>
      </div>
    );
  }

  if (status === STATUS.REJECTED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
          {/* Rejected icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ariza rad etildi</h2>
          <p className="text-gray-600 mb-4">
            Afsuski, arizangiz <span className="text-red-600 font-semibold">rad etildi</span>.
          </p>
          {rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-red-500 font-semibold uppercase tracking-wide mb-1">Sabab:</p>
              <p className="text-red-800 text-sm">{rejectionReason}</p>
            </div>
          )}
          <p className="text-gray-500 text-sm mb-8">
            Murojaat uchun biz bilan bog'laning yoki boshqa email bilan qayta ro'yxatdan o'ting.
          </p>
          <button
            onClick={handleGoBack}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition duration-200"
          >
            Kirish sahifasiga qaytish
          </button>
        </div>
      </div>
    );
  }

  // STATUS.WAITING
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-red-600">Blog</span>
            <span className="text-yellow-500">Hub</span>
          </h1>
        </div>

        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Arizangiz ko'rib chiqilmoqda{dots}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Ro'yxatdan o'tish arizangiz admin tomonidan ko'rib chiqilmoqda.
          <br />
          Ariza tasdiqlangach, siz avtomatik tizimga kiritilasiz.
        </p>

        {/* Steps */}
        <div className="space-y-3 text-left mb-8">
          {[
            { done: true,  label: "Ariza yuborildi" },
            { done: false, label: "Admin ko'rib chiqmoqda", active: true },
            { done: false, label: "Akkaunt faollashtiriladi" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                step.done
                  ? "bg-green-500 text-white"
                  : step.active
                  ? "bg-blue-600 text-white animate-pulse"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {step.done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-sm ${step.done ? "text-gray-700 line-through" : step.active ? "text-blue-700 font-semibold" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-xs leading-relaxed">
            Ushbu sahifani yoping, bu ID saqlanadi. Admin qaror qabul qilganida siz bildirishnoma olasiz.
          </p>
        </div>

        <button
          onClick={handleGoBack}
          className="text-gray-400 hover:text-gray-600 text-sm transition underline underline-offset-2"
        >
          ← Kirish sahifasiga qaytish
        </button>
      </div>
    </div>
  );
}
