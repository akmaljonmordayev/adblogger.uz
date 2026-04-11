import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const CSS = `
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(-2deg) }
    50%      { transform: translateY(-18px) rotate(2deg) }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(80px) rotate(0deg) }
    to   { transform: rotate(360deg) translateX(80px) rotate(-360deg) }
  }
  @keyframes orbit2 {
    from { transform: rotate(180deg) translateX(110px) rotate(-180deg) }
    to   { transform: rotate(540deg) translateX(110px) rotate(-540deg) }
  }
  @keyframes pulse-soft {
    0%,100% { transform: scale(1); opacity:.5 }
    50%      { transform: scale(1.08); opacity:.8 }
  }
  @keyframes slide-up {
    from { opacity:0; transform:translateY(24px) }
    to   { opacity:1; transform:translateY(0) }
  }
  @keyframes count-ring {
    from { stroke-dashoffset: 138 }
    to   { stroke-dashoffset: 0 }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center }
    100% { background-position: 200% center }
  }
  @keyframes bounce-in {
    0%   { transform: scale(.6); opacity:0 }
    60%  { transform: scale(1.08) }
    80%  { transform: scale(.96) }
    100% { transform: scale(1); opacity:1 }
  }
  @keyframes twinkle {
    0%,100% { opacity:.2; transform:scale(1) }
    50%      { opacity:.8; transform:scale(1.3) }
  }

  .nf-astronaut { animation: float 4s ease-in-out infinite }
  .nf-orbit1    { animation: orbit  8s linear infinite }
  .nf-orbit2    { animation: orbit2 12s linear infinite }
  .nf-glow      { animation: pulse-soft 3s ease-in-out infinite }
  .nf-s1 { animation: slide-up .6s cubic-bezier(.16,1,.3,1) both }
  .nf-s2 { animation: slide-up .6s cubic-bezier(.16,1,.3,1) .12s both }
  .nf-s3 { animation: slide-up .6s cubic-bezier(.16,1,.3,1) .24s both }
  .nf-s4 { animation: slide-up .6s cubic-bezier(.16,1,.3,1) .36s both }
  .nf-s5 { animation: slide-up .6s cubic-bezier(.16,1,.3,1) .48s both }
  .nf-bounce { animation: bounce-in .7s cubic-bezier(.34,1.56,.64,1) .1s both }

  .nf-shimmer {
    background: linear-gradient(90deg,#dc2626 0%,#f97316 30%,#dc2626 60%,#b91c1c 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .nf-btn-primary {
    background: linear-gradient(135deg,#dc2626,#b91c1c);
    color:#fff; border:none; cursor:pointer;
    transition: transform .2s, box-shadow .2s;
  }
  .nf-btn-primary:hover {
    transform:translateY(-2px);
    box-shadow:0 8px 28px rgba(220,38,38,.4);
  }
  .nf-btn-secondary {
    background:#fff; color:#374151;
    border:1.5px solid #e5e7eb; cursor:pointer;
    transition: border-color .2s, background .2s, transform .2s;
  }
  .nf-btn-secondary:hover {
    border-color:#dc2626; color:#dc2626;
    background:#fef2f2; transform:translateY(-2px);
  }
  .nf-chip {
    transition: background .18s, border-color .18s, color .18s, transform .18s;
  }
  .nf-chip:hover {
    background:#fef2f2!important;
    border-color:#fecaca!important;
    color:#dc2626!important;
    transform:translateY(-2px);
  }
  .nf-star { animation: twinkle var(--d,2s) ease-in-out var(--delay,0s) infinite }
`;

const LINKS = [
  { to: "/",           emoji: "🏠", label: "Bosh sahifa" },
  { to: "/bloggers",   emoji: "👥", label: "Blogerlar" },
  { to: "/pricing",    emoji: "💎", label: "Narxlar" },
  { to: "/contact",    emoji: "📩", label: "Bog'lanish" },
  { to: "/post-ad",    emoji: "✏️", label: "E'lon berish" },
  { to: "/about",      emoji: "ℹ️", label: "Biz haqimizda" },
];

const STARS = [
  { cx: 60,  cy: 40,  r: 2.5, d: "2.1s", delay: "0s" },
  { cx: 300, cy: 20,  r: 2,   d: "3s",   delay: ".4s" },
  { cx: 480, cy: 55,  r: 3,   d: "2.5s", delay: ".8s" },
  { cx: 150, cy: 70,  r: 2,   d: "1.8s", delay: ".2s" },
  { cx: 400, cy: 80,  r: 2.5, d: "2.8s", delay: ".6s" },
  { cx: 560, cy: 30,  r: 2,   d: "2.2s", delay: "1s" },
  { cx: 80,  cy: 100, r: 1.5, d: "3.2s", delay: ".3s" },
  { cx: 520, cy: 90,  r: 3,   d: "2.4s", delay: ".9s" },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(p => {
        if (p <= 1) { clearInterval(t); navigate("/"); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const progress = ((10 - count) / 10) * 138;

  return (
    <>
      <style>{CSS}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff5f5 0%, #fff 40%, #fef9f0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px", fontFamily: "'Inter', sans-serif",
        position: "relative", overflow: "hidden",
      }}>

        {/* Background blobs */}
        <div style={{
          position: "fixed", top: "-10%", right: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,38,38,.08) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", bottom: "5%", left: "-8%",
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,.07) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", top: "40%", left: "15%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,38,38,.04) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none",
        }} />

        {/* Main layout */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          maxWidth: 580, width: "100%", textAlign: "center",
          position: "relative", zIndex: 1,
        }}>

          {/* ── Illustration ── */}
          <div className="nf-bounce" style={{ marginBottom: 8, position: "relative", width: 280, height: 260 }}>

            {/* Outer glow ring */}
            <div className="nf-glow" style={{
              position: "absolute", inset: "10px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,38,38,.08) 0%, transparent 65%)",
            }} />

            {/* SVG scene */}
            <svg viewBox="0 0 280 260" fill="none" style={{ width: "100%", height: "100%" }}>
              <defs>
                <radialGradient id="gBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff1f1"/>
                  <stop offset="100%" stopColor="#fff5f0"/>
                </radialGradient>
                <radialGradient id="gPlanet" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#ff6b6b"/>
                  <stop offset="100%" stopColor="#dc2626"/>
                </radialGradient>
                <radialGradient id="gMoon" cx="35%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#fcd34d"/>
                  <stop offset="100%" stopColor="#f59e0b"/>
                </radialGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#dc2626" floodOpacity=".18"/>
                </filter>
              </defs>

              {/* Stars */}
              {STARS.map((s, i) => (
                <circle
                  key={i} cx={s.cx} cy={s.cy} r={s.r}
                  fill="#dc2626" opacity=".3"
                  className="nf-star"
                  style={{ "--d": s.d, "--delay": s.delay }}
                />
              ))}

              {/* Planet */}
              <circle cx="200" cy="190" r="52" fill="url(#gPlanet)" opacity=".9"/>
              {/* Planet ring */}
              <ellipse cx="200" cy="190" rx="72" ry="14" stroke="#dc2626" strokeWidth="3"
                strokeOpacity=".3" fill="none"/>
              {/* Planet craters */}
              <circle cx="188" cy="178" r="8" fill="rgba(0,0,0,.08)"/>
              <circle cx="212" cy="198" r="5" fill="rgba(0,0,0,.07)"/>
              <circle cx="195" cy="205" r="6" fill="rgba(0,0,0,.06)"/>

              {/* Moon orbiting */}
              <g className="nf-orbit1" style={{ transformOrigin: "200px 190px" }}>
                <circle cx="200" cy="190" r="12" fill="url(#gMoon)" filter="url(#shadow)"/>
                <circle cx="196" cy="186" r="3" fill="rgba(0,0,0,.08)"/>
              </g>

              {/* Small dot orbiting */}
              <g className="nf-orbit2" style={{ transformOrigin: "200px 190px" }}>
                <circle cx="200" cy="190" r="6" fill="#fca5a5" opacity=".8"/>
              </g>

              {/* Astronaut */}
              <g className="nf-astronaut" style={{ transformOrigin: "105px 120px" }} filter="url(#shadow)">
                {/* Body */}
                <rect x="82" y="112" width="46" height="48" rx="14" fill="#fff" stroke="#e5e7eb" strokeWidth="2"/>
                {/* Chest logo */}
                <rect x="96" y="126" width="18" height="12" rx="4" fill="#fef2f2" stroke="#fecaca" strokeWidth="1.5"/>
                <text x="105" y="135.5" textAnchor="middle" fontSize="6" fill="#dc2626" fontWeight="800">AD</text>
                {/* Helmet */}
                <circle cx="105" cy="104" r="22" fill="#fff" stroke="#e5e7eb" strokeWidth="2"/>
                {/* Visor */}
                <ellipse cx="105" cy="103" rx="13" ry="13" fill="url(#gBg)" stroke="#fca5a5" strokeWidth="1.5"/>
                {/* Reflection */}
                <ellipse cx="100" cy="97" rx="5" ry="3" fill="white" opacity=".6" transform="rotate(-20,100,97)"/>
                {/* Face (smile) */}
                <circle cx="101" cy="103" r="2" fill="#dc2626" opacity=".6"/>
                <circle cx="109" cy="103" r="2" fill="#dc2626" opacity=".6"/>
                <path d="M 100 109 Q 105 113 110 109" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".6"/>
                {/* Arms */}
                <rect x="59" y="116" width="26" height="14" rx="7" fill="#fff" stroke="#e5e7eb" strokeWidth="2" transform="rotate(20,72,123)"/>
                <rect x="125" y="112" width="26" height="14" rx="7" fill="#fff" stroke="#e5e7eb" strokeWidth="2" transform="rotate(-15,138,119)"/>
                {/* Legs */}
                <rect x="85" y="155" width="16" height="22" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="2"/>
                <rect x="109" y="155" width="16" height="22" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="2"/>
                {/* Boots */}
                <rect x="83" y="172" width="20" height="10" rx="5" fill="#fca5a5"/>
                <rect x="107" y="172" width="20" height="10" rx="5" fill="#fca5a5"/>
                {/* Backpack */}
                <rect x="128" y="118" width="12" height="20" rx="5" fill="#fee2e2" stroke="#fecaca" strokeWidth="1.5"/>
                {/* Antenna */}
                <line x1="105" y1="82" x2="105" y2="70" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="105" cy="68" r="4" fill="#dc2626"/>
                <circle cx="105" cy="68" r="2" fill="#fff"/>
              </g>

              {/* Floating question mark */}
              <g className="nf-orbit1" style={{ transformOrigin: "105px 120px", animationDuration: "6s" }}>
                <rect x="64" y="55" width="24" height="24" rx="8" fill="#fef2f2" stroke="#fecaca" strokeWidth="1.5"/>
                <text x="76" y="72" textAnchor="middle" fontSize="14" fill="#dc2626" fontWeight="800">?</text>
              </g>
            </svg>
          </div>

          {/* ── 404 ── */}
          <div className="nf-s1" style={{ marginBottom: 10 }}>
            <span
              className="nf-shimmer"
              style={{
                fontSize: "clamp(72px,14vw,110px)",
                fontWeight: 800, lineHeight: 1,
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-4px",
              }}
            >404</span>
          </div>

          {/* ── Title ── */}
          <div className="nf-s2" style={{ marginBottom: 12 }}>
            <h1 style={{
              fontSize: "clamp(20px,4vw,28px)", fontWeight: 800,
              color: "#0f172a", margin: 0, letterSpacing: "-0.5px",
            }}>
              Sahifa topilmadi
            </h1>
          </div>

          {/* ── Description ── */}
          <div className="nf-s3">
            <p style={{
              fontSize: 15, color: "#64748b", lineHeight: 1.75,
              maxWidth: 380, margin: "0 auto 28px",
            }}>
              Astronavtimiz bu sahifani koinotda qidirib topmadi.
              Sahifa ko'chirilgan yoki hali yaratilmagan bo'lishi mumkin.
            </p>
          </div>

          {/* ── Countdown ring + text ── */}
          <div className="nf-s3" style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ position: "relative", width: 48, height: 48 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="24" cy="24" r="22" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
                <circle cx="24" cy="24" r="22" fill="none"
                  stroke="#dc2626" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="138"
                  strokeDashoffset={138 - progress}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <span style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 800, color: "#dc2626",
                fontFamily: "'Syne', sans-serif",
              }}>{count}</span>
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              soniyada bosh sahifaga<br />avtomatik o'tiladi
            </span>
          </div>

          {/* ── Buttons ── */}
          <div className="nf-s4" style={{
            display: "flex", gap: 10, justifyContent: "center",
            flexWrap: "wrap", marginBottom: 36,
          }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <button className="nf-btn-primary" style={{
                padding: "13px 28px", borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 7,
                boxShadow: "0 4px 18px rgba(220,38,38,.3)",
              }}>
                ← Bosh sahifaga qaytish
              </button>
            </Link>

            <Link to="/bloggers" style={{ textDecoration: "none" }}>
              <button className="nf-btn-secondary" style={{
                padding: "13px 24px", borderRadius: 12,
                fontSize: 14, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 7,
              }}>
                👥 Blogerlarni ko'rish
              </button>
            </Link>
          </div>

          {/* ── Quick links ── */}
          <div className="nf-s5" style={{
            width: "100%",
            padding: "20px 0 0",
            borderTop: "1px solid #f1f5f9",
          }}>
            <p style={{ fontSize: 12, color: "#cbd5e1", letterSpacing: "1px", marginBottom: 14 }}>
              TEZKOR HAVOLALAR
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {LINKS.map(({ to, emoji, label }) => (
                <Link key={to} to={to} style={{ textDecoration: "none" }}>
                  <span
                    className="nf-chip"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 12.5, fontWeight: 500, color: "#64748b",
                      background: "#fff", border: "1.5px solid #e2e8f0",
                      padding: "6px 14px", borderRadius: 20,
                    }}
                  >
                    {emoji} {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Footer note ── */}
          <div style={{ marginTop: 32, fontSize: 12, color: "#cbd5e1" }}>
            <span style={{ color: "#dc2626", fontWeight: 700 }}>ad</span>
            <span style={{ color: "#94a3b8", fontWeight: 700 }}>blogger</span>
            {" "}· © 2025
          </div>

        </div>
      </div>
    </>
  );
}
