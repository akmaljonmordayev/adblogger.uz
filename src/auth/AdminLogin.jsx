import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LuEye, LuEyeOff, LuShield, LuArrowLeft, LuCircleAlert } from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import { ROUTE_PATHS } from "../config/constants";

// Demo credentials (replace with real API call)
const ADMIN_CREDENTIALS = { email: "admin@adblogger.uz", password: "admin123" };

const S = {
  input: {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #e2e8f0", borderRadius: 11,
    fontSize: 14, color: "#0f172a", outline: "none",
    background: "#fff", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color .2s, box-shadow .2s",
  },
  label: {
    fontSize: 12.5, fontWeight: 600, color: "#64748b",
    display: "block", marginBottom: 6, textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email va parol to'ldirilishi shart.");
      return;
    }

    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setUser({ name: "Admin", email: email.trim(), role: "admin" });
      setToken("admin-token-" + Date.now());
      navigate(ROUTE_PATHS.ADMIN_DASHBOARD, { replace: true });
    } else {
      setError("Email yoki parol noto'g'ri.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px", fontFamily: "'Inter', sans-serif",
      position: "relative", overflow: "hidden",
    }}>

      {/* Background decoration */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", left: "-8%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        width: "100%", maxWidth: 400,
        overflow: "hidden",
        position: "relative", zIndex: 1,
      }}>

        {/* Card top accent */}
        <div style={{
          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
          padding: "28px 32px",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 12,
        }}>
          {/* Shield icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}>
            <LuShield size={26} color="#fff" strokeWidth={1.8} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
              Admin Panel
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              adblogger.uz boshqaruv paneli
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "28px 32px 32px" }}>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            }}>
              <LuCircleAlert size={15} style={{ color: "#dc2626", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#b91c1c", fontWeight: 500 }}>
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Email */}
            <div>
              <label style={S.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@adblogger.uz"
                autoComplete="username"
                style={S.input}
                onFocus={e => {
                  e.target.style.borderColor = "#dc2626";
                  e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.08)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={S.label}>Parol</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ ...S.input, paddingRight: 44 }}
                  onFocus={e => {
                    e.target.style.borderColor = "#dc2626";
                    e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.08)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#94a3b8", display: "flex", alignItems: "center", padding: 2,
                  }}
                >
                  {showPass ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading
                  ? "#f1f5f9"
                  : "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: loading ? "#94a3b8" : "#fff",
                fontSize: 14, fontWeight: 700,
                border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 18px rgba(220,38,38,0.28)",
                transition: "transform .18s, box-shadow .18s, background .2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit", marginTop: 4,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(220,38,38,0.35)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 18px rgba(220,38,38,0.28)";
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <LuShield size={15} strokeWidth={2.5} />
                  Kirish
                </>
              )}
            </button>

          </form>

          {/* Hint */}
          <div style={{
            marginTop: 20, padding: "10px 14px",
            background: "#f8fafc", borderRadius: 10,
            border: "1px solid #f1f5f9",
          }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
              Demo kirish ma'lumotlari:
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
              📧 admin@adblogger.uz &nbsp;·&nbsp; 🔑 admin123
            </div>
          </div>

          {/* Back link */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12.5, color: "#94a3b8", textDecoration: "none",
                transition: "color .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#dc2626"}
              onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
            >
              <LuArrowLeft size={13} /> Asosiy saytga qaytish
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
