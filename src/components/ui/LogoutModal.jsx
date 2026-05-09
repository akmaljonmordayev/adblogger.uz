import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

/* ── single particle ───────────────────────────────────────────── */
function Particle({ color, size, angle, speed, life }) {
  return (
    <div style={{
      position: "absolute",
      left: "50%", top: "50%",
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      pointerEvents: "none",
      animation: `lm-fly ${life}ms ease-out forwards`,
      "--dx": `${Math.cos(angle) * speed}px`,
      "--dy": `${Math.sin(angle) * speed}px`,
    }} />
  );
}

/* ── modal ─────────────────────────────────────────────────────── */
export default function LogoutModal({ isOpen, onClose, redirectTo = "/" }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("idle"); // idle | shake | wave | exit
  const [sparks, setSparks] = useState([]);

  useEffect(() => { if (isOpen) setPhase("idle"); }, [isOpen]);

  useEffect(() => {
    if (!isOpen || phase !== "idle") return;
    const fn = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, phase, onClose]);

  if (!isOpen && phase === "idle") return null;

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "U";

  const shoot = (n, colors, minSpeed, maxSpeed) => {
    const pts = Array.from({ length: n }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      color: colors[i % colors.length],
      size: Math.random() * 7 + 3,
      angle: (i / n) * Math.PI * 2 + Math.random() * 0.4,
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      life: 600 + Math.random() * 500,
    }));
    setSparks(pts);
    setTimeout(() => setSparks([]), 1200);
  };

  const handleConfirm = () => {
    if (phase !== "idle") return;
    // 1. shake + red sparks
    setPhase("shake");
    shoot(26, ["#dc2626","#ef4444","#fca5a5","#fff","#f97316"], 70, 130);

    setTimeout(() => {
      // 2. goodbye wave + colorful confetti
      setPhase("wave");
      shoot(34, ["#fbbf24","#fff","#a78bfa","#34d399","#60a5fa","#f9a8d4"], 90, 170);

      setTimeout(() => {
        // 3. fly-out
        setPhase("exit");

        setTimeout(() => {
          logout();
          navigate(redirectTo, { replace: true });
          onClose();
          setPhase("idle");
        }, 1000);
      }, 950);
    }, 520);
  };

  const roleLabel =
    user?.role === "blogger"  ? "Blogger"
    : user?.role === "business" ? "Biznes"
    : user?.role === "admin"    ? "Admin"
    : "Foydalanuvchi";

  const isWave = phase === "wave";
  const isExit = phase === "exit";
  const busy   = phase !== "idle";

  /* card animation */
  const cardAnim =
    phase === "shake" ? "lm-shake .52s ease"
    : isWave          ? "lm-wave .95s cubic-bezier(.34,1.4,.64,1) forwards"
    : isExit          ? "lm-exit 1s cubic-bezier(.4,0,.6,1) forwards"
    :                   "lm-in .5s cubic-bezier(.34,1.56,.64,1) forwards";

  /* overlay animation */
  const overlayAnim =
    isExit ? "lm-overlay-out 1s ease forwards"
    : isWave ? "lm-overlay-wave .95s ease forwards"
    : "lm-overlay-in .3s ease forwards";

  return (
    <>
      <style>{`
        @keyframes lm-fly {
          0%   { opacity:1; transform:translate(-50%,-50%) translate(0,0) scale(1); }
          100% { opacity:0; transform:translate(-50%,-50%) translate(var(--dx),var(--dy)) scale(0); }
        }
        @keyframes lm-overlay-in {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes lm-overlay-wave {
          0%   { background:rgba(2,6,23,.78); }
          50%  { background:rgba(60,8,8,.88); }
          100% { background:rgba(10,3,3,.92); }
        }
        @keyframes lm-overlay-out {
          0%   { opacity:1; background:rgba(10,3,3,.92); }
          25%  { background:rgba(100,8,8,.6); }
          100% { opacity:0; background:rgba(2,6,23,0); }
        }
        @keyframes lm-in {
          0%   { opacity:0; transform:translateY(56px) scale(.9); }
          65%  { transform:translateY(-8px) scale(1.02); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes lm-shake {
          0%,100% { transform:translateX(0) rotate(0); }
          14%     { transform:translateX(-9px) rotate(-1.2deg); }
          30%     { transform:translateX(9px) rotate(1.2deg); }
          46%     { transform:translateX(-7px) rotate(-.8deg); }
          62%     { transform:translateX(7px) rotate(.8deg); }
          78%     { transform:translateX(-3px); }
          90%     { transform:translateX(3px); }
        }
        @keyframes lm-wave {
          0%   { transform:scale(1) translateY(0); }
          20%  { transform:scale(1.04) translateY(-12px); }
          50%  { transform:scale(1.02) translateY(-8px); }
          75%  { transform:scale(1.04) translateY(-13px); }
          100% { transform:scale(1.03) translateY(-10px); }
        }
        @keyframes lm-exit {
          0%   { opacity:1; transform:translateY(-10px) scale(1.03) rotate(0deg);   filter:blur(0px); }
          20%  {            transform:translateY(-22px) scale(1.06) rotate(-1deg);  filter:blur(0px); }
          48%  { opacity:.9; transform:translateY(5px)  scale(.87)  rotate(1.5deg); filter:blur(3px); }
          74%  { opacity:.4; transform:translateY(30px) scale(.62)  rotate(-2deg);  filter:blur(8px); }
          100% { opacity:0; transform:translateY(70px) scale(.38)  rotate(4deg);   filter:blur(16px); }
        }
        @keyframes lm-avatar-bounce {
          0%   { transform:scale(.5) rotate(-10deg); opacity:0; }
          60%  { transform:scale(1.15) rotate(4deg); }
          80%  { transform:scale(.95) rotate(-2deg); }
          100% { transform:scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes lm-avatar-wave {
          0%   { transform:scale(1) rotate(0deg); }
          20%  { transform:scale(1.12) rotate(-8deg); }
          45%  { transform:scale(1.08) rotate(8deg); }
          65%  { transform:scale(1.14) rotate(-5deg); }
          85%  { transform:scale(1.1) rotate(5deg); }
          100% { transform:scale(1.12) rotate(-3deg); }
        }
        @keyframes lm-pulse {
          0%,100% { box-shadow:0 0 0 0 rgba(220,38,38,.5); }
          50%     { box-shadow:0 0 0 12px rgba(220,38,38,0); }
        }
        @keyframes lm-ring {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes lm-ring-wave {
          0%   { transform:rotate(0deg); opacity:1; border-top-color:#fbbf24; }
          100% { transform:rotate(600deg); opacity:.5; border-top-color:#fbbf24; }
        }
        @keyframes lm-slide {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lm-goodbye-pop {
          0%   { opacity:0; transform:scale(1.28) translateY(-4px); }
          60%  { transform:scale(.97) translateY(2px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes lm-progress {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes lm-flash {
          0%,100% { opacity:0; }
          40%     { opacity:1; }
        }
        @keyframes lm-spin-out {
          to { transform:rotate(360deg) scale(0); opacity:0; }
        }
        .lm-confirm-btn {
          transition: transform .15s, box-shadow .15s, background .15s;
        }
        .lm-confirm-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 28px rgba(220,38,38,.5);
        }
        .lm-confirm-btn:active:not(:disabled) { transform:scale(.97); }
        .lm-cancel-btn { transition:all .15s; }
        .lm-cancel-btn:hover:not(:disabled) {
          background:rgba(255,255,255,.08) !important;
          border-color:rgba(255,255,255,.3) !important;
          transform:translateY(-1px);
        }
      `}</style>

      {/* Overlay */}
      <div
        onClick={!busy ? onClose : undefined}
        style={{
          position:"fixed", inset:0, zIndex:9999,
          background:"rgba(2,6,23,.78)",
          backdropFilter:"blur(14px)",
          WebkitBackdropFilter:"blur(14px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          animation: overlayAnim,
        }}
      >
        {/* red flash on exit */}
        {isExit && (
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            background:"rgba(150,15,15,.2)",
            animation:"lm-flash .4s ease forwards",
          }}/>
        )}

        {/* Card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position:"relative",
            width:380, maxWidth:"calc(100vw - 32px)",
            background: isWave || isExit
              ? "linear-gradient(145deg,#120707,#1a0d0d,#1e293b)"
              : "linear-gradient(145deg,#0f172a,#1e293b)",
            border: isWave || isExit
              ? "1px solid rgba(220,38,38,.3)"
              : "1px solid rgba(255,255,255,.1)",
            borderRadius:24,
            padding:"36px 32px 32px",
            boxShadow: isWave || isExit
              ? "0 32px 80px rgba(0,0,0,.7),0 0 40px rgba(220,38,38,.12) inset"
              : "0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.05) inset",
            animation: cardAnim,
            overflow:"visible",
            transition:"background .5s, border .5s, box-shadow .5s",
          }}
        >
          {/* corner glow */}
          <div style={{
            position:"absolute", top:-40, right:-40,
            width: isWave ? 180 : 120,
            height: isWave ? 180 : 120,
            borderRadius:"50%",
            background: isWave
              ? "radial-gradient(circle,rgba(220,38,38,.4),transparent 70%)"
              : "radial-gradient(circle,rgba(220,38,38,.22),transparent 70%)",
            filter:"blur(20px)", pointerEvents:"none",
            transition:"all .5s",
          }}/>

          {/* sparks */}
          <div style={{ position:"absolute", inset:0, overflow:"hidden", borderRadius:24, pointerEvents:"none" }}>
            {sparks.map(s => <Particle key={s.id} {...s} />)}
          </div>

          {/* Avatar */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
            <div style={{ position:"relative", marginBottom:16 }}>
              {(isWave || isExit) && (
                <>
                  {/* outer ring */}
                  <div style={{
                    position:"absolute", inset:-8, borderRadius:"50%",
                    border:"2.5px solid transparent",
                    borderTopColor: isWave ? "#fbbf24" : "#dc2626",
                    animation: isWave ? "lm-ring-wave .95s ease forwards" : "lm-ring .5s linear infinite",
                    pointerEvents:"none",
                  }}/>
                  {/* inner ring (wave only) */}
                  {isWave && (
                    <div style={{
                      position:"absolute", inset:-16, borderRadius:"50%",
                      border:"1.5px solid rgba(251,191,36,.2)",
                      borderTopColor:"rgba(251,191,36,.3)",
                      animation:"lm-ring 1.3s linear infinite reverse",
                      pointerEvents:"none",
                    }}/>
                  )}
                </>
              )}
              <div style={{
                width:76, height:76, borderRadius:"50%",
                background: user?.avatar ? "transparent" : "linear-gradient(135deg,#dc2626,#b91c1c)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, fontWeight:800, color:"#fff",
                border: isWave ? "3px solid rgba(251,191,36,.5)" : "3px solid rgba(220,38,38,.4)",
                overflow:"hidden",
                animation: isWave
                  ? "lm-avatar-wave .95s ease forwards"
                  : "lm-avatar-bounce .6s cubic-bezier(.34,1.56,.64,1) .1s both, lm-pulse 2s ease-in-out .7s infinite",
                boxShadow: isWave ? "0 0 22px rgba(251,191,36,.3)" : undefined,
                transition:"border .4s, box-shadow .4s",
              }}>
                {user?.avatar
                  ? <img src={user.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : initials}
              </div>
            </div>

            <div style={{ animation:"lm-slide .4s ease .25s both", textAlign:"center" }}>
              <p style={{ margin:0, fontSize:18, fontWeight:800, color:"#f8fafc" }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ margin:"4px 0 0", fontSize:12, color:"#64748b", fontFamily:"monospace" }}>
                {user?.email}
              </p>
              <span style={{
                display:"inline-block", marginTop:8,
                background: isWave ? "rgba(251,191,36,.12)" : "rgba(220,38,38,.15)",
                color: isWave ? "#fcd34d" : "#fca5a5",
                fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
                border:`1px solid ${isWave ? "rgba(251,191,36,.25)" : "rgba(220,38,38,.2)"}`,
                transition:"all .4s",
              }}>
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Message */}
          <div style={{ textAlign:"center", marginBottom:24, minHeight:58, animation:"lm-slide .4s ease .35s both" }}>
            {isWave ? (
              <div key="goodbye" style={{ animation:"lm-goodbye-pop .4s cubic-bezier(.34,1.56,.64,1) forwards" }}>
                <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:"#fcd34d", letterSpacing:"-.3px" }}>
                  Xayr! 👋
                </h2>
                <p style={{ margin:0, fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>
                  Sessiya xavfsiz tarzda yopilmoqda...
                </p>
              </div>
            ) : (
              <div key="confirm">
                <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800, color:"#f8fafc", letterSpacing:"-.3px" }}>
                  Chiqmoqdamisiz?
                </h2>
                <p style={{ margin:0, fontSize:13, color:"#64748b", lineHeight:1.6 }}>
                  Sessiyangiz tugatiladi.{" "}
                  <span style={{ color:"#94a3b8" }}>Qayta kirish uchun parol kerak.</span>
                </p>
              </div>
            )}
          </div>

          {/* Progress bar — only in wave phase */}
          <div style={{
            height: isWave ? 5 : 1,
            background: isWave ? "rgba(255,255,255,.06)" : "linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)",
            borderRadius:99,
            marginBottom:24,
            overflow:"hidden",
            transition:"height .35s",
          }}>
            {isWave && (
              <div style={{
                height:"100%", width:"100%",
                background:"linear-gradient(90deg,#dc2626,#ef4444,#fbbf24)",
                borderRadius:99,
                transformOrigin:"left",
                animation:"lm-progress .95s linear forwards",
              }}/>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, animation:"lm-slide .4s ease .45s both" }}>
            <button
              className="lm-confirm-btn"
              onClick={handleConfirm}
              disabled={busy}
              style={{
                width:"100%", padding:"13px",
                background: isExit
                  ? "linear-gradient(135deg,#450a0a,#7f1d1d)"
                  : isWave
                    ? "linear-gradient(135deg,#7f1d1d,#991b1b)"
                    : "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: isWave ? "#fca5a5" : "#fff",
                fontSize:14, fontWeight:700,
                border: isWave ? "1px solid rgba(220,38,38,.3)" : "none",
                borderRadius:12,
                cursor: busy ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:"0 4px 20px rgba(220,38,38,.35)",
                opacity: isExit ? 0.45 : 1,
                transition:"background .45s, color .4s, opacity .4s",
                letterSpacing:".2px",
              }}
            >
              {isExit ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation:"lm-spin-out .8s ease forwards" }}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Chiqildi...
                </>
              ) : isWave ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation:"lm-ring .6s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Chiqilmoqda...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Ha, chiqish
                </>
              )}
            </button>

            <button
              className="lm-cancel-btn"
              onClick={onClose}
              disabled={busy}
              style={{
                width:"100%", padding:"12px",
                background:"transparent",
                color: busy ? "#475569" : "#94a3b8",
                fontSize:13, fontWeight:600,
                border:"1px solid rgba(255,255,255,.1)", borderRadius:12,
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.4 : 1,
                transition:"opacity .4s, color .4s",
              }}
            >
              Bekor qilish
            </button>
          </div>

          {/* Hint */}
          <p style={{
            textAlign:"center", marginTop:16, marginBottom:0,
            fontSize:11,
            color: isWave ? "rgba(220,38,38,.25)" : "#334155",
            animation:"lm-slide .4s ease .55s both",
            transition:"color .5s",
          }}>
            {isWave ? "Sessiya xavfsiz yopilmoqda..." : "ESC tugmasi bilan ham yopishingiz mumkin"}
          </p>
        </div>
      </div>
    </>
  );
}
