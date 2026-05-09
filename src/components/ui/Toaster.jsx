import { useState, useEffect, useRef, useCallback } from "react";
import { _subscribe } from "./toast";

/* ── config per type ──────────────────────────────────────────── */
const CFG = {
  success: {
    accent: "#22c55e",
    bg:     "rgba(15,25,18,0.97)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  error: {
    accent: "#ef4444",
    bg:     "rgba(22,10,10,0.97)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
  },
  warning: {
    accent: "#f59e0b",
    bg:     "rgba(22,18,8,0.97)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  info: {
    accent: "#60a5fa",
    bg:     "rgba(8,15,28,0.97)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>
      </svg>
    ),
  },
};

/* ── single toast item ────────────────────────────────────────── */
function ToastItem({ item, onRemove }) {
  const [out, setOut] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timerRef  = useRef(null);
  const startRef  = useRef(null);
  const remainRef = useRef(item.duration);
  const cfg = CFG[item.type] ?? CFG.info;

  const dismiss = useCallback(() => {
    setOut(true);
    setTimeout(() => onRemove(item.id), 380);
  }, [item.id, onRemove]);

  const startTimer = useCallback(() => {
    startRef.current = Date.now();
    timerRef.current = setTimeout(dismiss, remainRef.current);
  }, [dismiss]);

  const pauseTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    remainRef.current = Math.max(0, remainRef.current - (Date.now() - startRef.current));
  }, []);

  const resumeTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, [startTimer]);

  const onMouseEnter = () => { setHovered(true);  pauseTimer(); };
  const onMouseLeave = () => { setHovered(false); resumeTimer(); };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex",
        alignItems: "stretch",
        width: 340,
        maxWidth: "calc(100vw - 32px)",
        borderRadius: 14,
        overflow: "hidden",
        background: cfg.bg,
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: `0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 24px ${cfg.accent}18`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        animation: out
          ? "t-out .38s cubic-bezier(.4,0,.6,1) forwards"
          : "t-in .42s cubic-bezier(.34,1.4,.64,1) forwards",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {/* left accent bar */}
      <div style={{
        width: 4, flexShrink: 0,
        background: `linear-gradient(180deg, ${cfg.accent}, ${cfg.accent}88)`,
      }}/>

      {/* body */}
      <div style={{ flex: 1, padding: "13px 14px 0 14px", minWidth: 0 }}>
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          {/* icon circle */}
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: `${cfg.accent}18`,
            border: `1px solid ${cfg.accent}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {cfg.icon}
          </div>
          {/* message */}
          <span style={{
            fontSize: 13.5, fontWeight: 600, color: "#f1f5f9",
            lineHeight: 1.45, flex: 1,
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {item.message}
          </span>
          {/* close */}
          <button
            onClick={dismiss}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#475569", padding: "2px 4px", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "color .15s, background .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#475569"; e.currentTarget.style.background = "none"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* progress bar track */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden", margin: "0 -14px", marginRight: "-14px" }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(90deg, ${cfg.accent}99, ${cfg.accent})`,
            borderRadius: 99,
            transformOrigin: "left",
            animation: hovered ? "none" : `t-progress ${item.duration}ms linear 0ms forwards`,
          }}/>
        </div>
      </div>
    </div>
  );
}

/* ── container ────────────────────────────────────────────────── */
export default function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return _subscribe(item => {
      setItems(prev => {
        const next = [...prev, item];
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });
    });
  }, []);

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  if (!items.length) return (
    <style>{`
      @keyframes t-in {
        from { opacity:0; transform:translateX(110%) scale(.94); }
        to   { opacity:1; transform:translateX(0) scale(1); }
      }
      @keyframes t-out {
        from { opacity:1; transform:translateX(0) scale(1); max-height:200px; margin-bottom:10px; }
        to   { opacity:0; transform:translateX(110%) scale(.94); max-height:0; margin-bottom:0; }
      }
      @keyframes t-progress {
        from { transform:scaleX(1); }
        to   { transform:scaleX(0); }
      }
    `}</style>
  );

  return (
    <>
      <style>{`
        @keyframes t-in {
          from { opacity:0; transform:translateX(110%) scale(.94); }
          to   { opacity:1; transform:translateX(0) scale(1); }
        }
        @keyframes t-out {
          from { opacity:1; transform:translateX(0) scale(1); max-height:200px; margin-bottom:10px; }
          to   { opacity:0; transform:translateX(110%) scale(.94); max-height:0; margin-bottom:0; }
        }
        @keyframes t-progress {
          from { transform:scaleX(1); }
          to   { transform:scaleX(0); }
        }
      `}</style>
      <div style={{
        position: "fixed",
        top: 20, right: 20,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}>
        {items.map(item => (
          <div key={item.id} style={{ pointerEvents: "all" }}>
            <ToastItem item={item} onRemove={remove} />
          </div>
        ))}
      </div>
    </>
  );
}
