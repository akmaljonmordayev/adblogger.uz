import { useEffect, useState } from "react";

const LETTERS = ["a", "d", "b", "l", "o", "g", "g", "e", "r"];
const BRAND   = "oklch(0.6 0.25 260)";
const BRAND2  = "#dc2626";

export default function PageLoader() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles.overlay}>
      {/* Ambient blobs */}
      <div style={{ ...styles.blob, top: "15%", left: "20%",  background: "oklch(0.6 0.25 260 / 0.12)", animationDelay: "0s"   }} />
      <div style={{ ...styles.blob, top: "55%", right: "18%", background: "rgba(220,38,38,0.09)",        animationDelay: "1.4s" }} />
      <div style={{ ...styles.blob, bottom:"10%", left: "40%", background: "oklch(0.6 0.25 260 / 0.08)", animationDelay: "0.7s" }} />

      <div style={styles.card}>
        {/* Logo dot */}
        <div style={styles.dotWrap}>
          <div style={styles.dotRing} />
          <div style={styles.dotRing2} />
          <div style={styles.dotCore} />
        </div>

        {/* Animated letters */}
        <div style={styles.wordRow}>
          {LETTERS.map((ch, i) => {
            const active = (tick % LETTERS.length) === i;
            return (
              <span
                key={i}
                style={{
                  ...styles.letter,
                  color:     active ? BRAND  : "#1e293b",
                  transform: active ? "translateY(-6px) scale(1.18)" : "translateY(0) scale(1)",
                  textShadow: active ? `0 0 18px ${BRAND}` : "none",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* Tagline */}
        <p style={styles.tagline}>Yuklanmoqda...</p>

        {/* Progress bar */}
        <div style={styles.trackWrap}>
          <div style={styles.track}>
            <div style={styles.fill} />
          </div>

          {/* Dots */}
          <div style={styles.dotsRow}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  animationDelay: `${i * 0.25}s`,
                  background: i === 0 ? BRAND : i === 1 ? BRAND2 : BRAND,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

/* ── inline styles ────────────────────────────────── */
const styles = {
  overlay: {
    position:       "fixed",
    inset:          0,
    zIndex:         9999,
    background:     "oklch(0.98 0.005 260)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    overflow:       "hidden",
  },
  blob: {
    position:     "absolute",
    width:        320,
    height:       320,
    borderRadius: "50%",
    filter:       "blur(72px)",
    animation:    "blobPulse 4s ease-in-out infinite",
  },
  card: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            20,
    padding:        "40px 48px",
    background:     "rgba(255,255,255,0.7)",
    backdropFilter: "blur(24px)",
    borderRadius:   28,
    border:         "1.5px solid rgba(255,255,255,0.9)",
    boxShadow:      "0 20px 60px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    minWidth:       280,
  },
  dotWrap: {
    position: "relative",
    width:    52,
    height:   52,
    display:  "flex",
    alignItems:     "center",
    justifyContent: "center",
  },
  dotRing: {
    position:     "absolute",
    inset:        0,
    borderRadius: "50%",
    border:       "2.5px solid oklch(0.6 0.25 260 / 0.25)",
    animation:    "ringPing 1.6s ease-out infinite",
  },
  dotRing2: {
    position:     "absolute",
    inset:        6,
    borderRadius: "50%",
    border:       "2px solid oklch(0.6 0.25 260 / 0.18)",
    animation:    "ringPing 1.6s ease-out 0.4s infinite",
  },
  dotCore: {
    width:        22,
    height:       22,
    borderRadius: "50%",
    background:   "linear-gradient(135deg, oklch(0.6 0.25 260), #dc2626)",
    boxShadow:    "0 4px 16px oklch(0.6 0.25 260 / 0.4)",
    animation:    "corePulse 1.6s ease-in-out infinite",
  },
  wordRow: {
    display: "flex",
    gap:     1,
  },
  letter: {
    fontFamily:    "'Outfit', sans-serif",
    fontSize:      28,
    fontWeight:    800,
    letterSpacing: 1,
    transition:    "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), color 0.2s, text-shadow 0.2s",
    userSelect:    "none",
  },
  tagline: {
    margin:     0,
    fontSize:   13,
    color:      "#94a3b8",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 500,
    letterSpacing: 0.5,
    animation:  "fadeUpIn 0.6s ease both",
  },
  trackWrap: {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           10,
    width:         "100%",
  },
  track: {
    width:        "100%",
    height:       4,
    borderRadius: 99,
    background:   "oklch(0.6 0.25 260 / 0.12)",
    overflow:     "hidden",
  },
  fill: {
    height:     "100%",
    borderRadius: 99,
    background: "linear-gradient(90deg, oklch(0.6 0.25 260), #dc2626, oklch(0.6 0.25 260))",
    backgroundSize: "200% 100%",
    animation:  "barSlide 1.8s linear infinite",
  },
  dotsRow: {
    display: "flex",
    gap:     8,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: "50%",
    animation:    "dotBounce 0.9s ease-in-out infinite",
  },
};

/* ── keyframes ─────────────────────────────────────── */
const css = `
@keyframes blobPulse {
  0%,100% { transform: scale(1);    opacity: 1; }
  50%      { transform: scale(1.15); opacity: 0.7; }
}
@keyframes ringPing {
  0%   { transform: scale(0.6); opacity: 0.9; }
  80%  { transform: scale(1.6); opacity: 0;   }
  100% { transform: scale(1.6); opacity: 0;   }
}
@keyframes corePulse {
  0%,100% { transform: scale(1);    box-shadow: 0 4px 16px oklch(0.6 0.25 260 / 0.4); }
  50%      { transform: scale(1.12); box-shadow: 0 6px 24px oklch(0.6 0.25 260 / 0.6); }
}
@keyframes barSlide {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@keyframes dotBounce {
  0%,80%,100% { transform: translateY(0);   opacity: 0.4; }
  40%          { transform: translateY(-7px); opacity: 1;   }
}
@keyframes fadeUpIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
