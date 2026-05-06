import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/constants";

/* ── Fonts (once) ── */
if (!document.getElementById("hero-fonts")) {
  const l = document.createElement("link");
  l.id = "hero-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

const SYNE  = { fontFamily: "'Syne', sans-serif" };
const INTER = { fontFamily: "'Inter', sans-serif" };
const DURATION = 5500; // ms per slide

const slides = [
  {
    badge: "O'ZBEKISTON #1",
    badgeIcon: "🥇",
    title: ["Eng yirik", "Bloger Marketplace"],
    desc: "500+ tasdiqlangan bloger bir platformada. Toping, solishtiring va reklama bering — tez va oson.",
    btn1: "Blogerlarni ko'rish",  btn1Route: ROUTE_PATHS.BLOGGERS,
    btn2: "Reklama berish",       btn2Route: ROUTE_PATHS.ELON_BERISH,
    trust: "Ro'yxatdan o'tish bepul · Kredit karta shart emas",
    stats: [
      { num: "500+", icon: "👤", label: "Tasdiqlangan Bloger" },
      { num: "12M+", icon: "👁️", label: "Faol Auditoriya" },
      { num: "3×",   icon: "📈", label: "O'rtacha ROI" },
    ],
    gradient: "linear-gradient(135deg,#6b1212 0%,#c01f1f 50%,#7f1d1d 100%)",
    accent: "#fbbf24",
    glowL: "rgba(185,28,28,0.55)",
    glowR: "rgba(220,38,38,0.35)",
    btnColor: "#1a0a00",
  },
  {
    badge: "PREMIUM XIZMAT",
    badgeIcon: "✦",
    title: ["Brendingizni", "Kuchaytiring"],
    desc: "AI yordamida eng mos blogerlarni toping. Kampaniyangizni boshqaring va natijalarni real vaqtda kuzating.",
    btn1: "Bepul boshlash",  btn1Route: ROUTE_PATHS.REGISTER,
    btn2: "Demo ko'rish",   btn2Route: ROUTE_PATHS.BLOGGERS,
    trust: "2 daqiqada sozlab oling · Texnik bilim kerak emas",
    stats: [
      { num: "98%",  icon: "⭐", label: "Mijozlar Mamnuniyati" },
      { num: "48h",  icon: "⚡", label: "Kampaniya Tezligi" },
      { num: "200+", icon: "🏢", label: "Ishonch Bildirgan Brend" },
    ],
    gradient: "linear-gradient(135deg,#070e1e 0%,#0c2347 55%,#081829 100%)",
    accent: "#38bdf8",
    glowL: "rgba(14,116,144,0.5)",
    glowR: "rgba(56,189,248,0.25)",
    btnColor: "#001322",
  },
  {
    badge: "YANGI IMKONIYAT",
    badgeIcon: "🚀",
    title: ["Bloger bo'lib", "Daromad Oling"],
    desc: "O'z auditoriyangizni monetizatsiya qiling. Brendlar bilan to'g'ridan-to'g'ri ishlang va daromadingizni oshiring.",
    btn1: "Ro'yxatdan o'tish", btn1Route: ROUTE_PATHS.REGISTER,
    btn2: "Ko'proq bilish",    btn2Route: ROUTE_PATHS.BLOGER_BOLISH,
    trust: "1 oy komissiyasiz · Istalgan vaqt bekor qilish",
    stats: [
      { num: "5M+", icon: "💰", label: "Blogerlarga To'lovlar" },
      { num: "30%", icon: "🔥", label: "Oylik Daromad O'sishi" },
      { num: "0%",  icon: "🎁", label: "Komissiya (1 oy)" },
    ],
    gradient: "linear-gradient(135deg,#5c2d00 0%,#b45309 50%,#78350f 100%)",
    accent: "#fde68a",
    glowL: "rgba(180,83,9,0.55)",
    glowR: "rgba(251,191,36,0.3)",
    btnColor: "#1a0e00",
  },
];

export default function HeroSwiper() {
  const navigate = useNavigate();
  const [cur, setCur]     = useState(0);
  const [prev, setPrev]   = useState(null);   // previous slide index during transition
  const [going, setGoing] = useState(false);  // transition in progress
  const [paused, setPaused] = useState(false);
  const [progKey, setProgKey] = useState(0);  // increment → CSS animation restarts

  const timerRef  = useRef(null);
  const touchX    = useRef(0);
  const touchY    = useRef(0);

  /* ── advance to slide n ── */
  const goTo = useCallback((n) => {
    if (going) return;
    setPrev(cur);
    setGoing(true);
    setCur(n);
    setProgKey(k => k + 1);
    setTimeout(() => { setPrev(null); setGoing(false); }, 620);
  }, [cur, going]);

  const next = useCallback(() => goTo((cur + 1) % slides.length), [cur, goTo]);
  const prev_ = useCallback(() => goTo((cur - 1 + slides.length) % slides.length), [cur, goTo]);

  /* ── auto-advance via setTimeout (not setInterval) ── */
  const scheduleNext = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCur(c => {
        const n = (c + 1) % slides.length;
        setPrev(c);
        setGoing(true);
        setProgKey(k => k + 1);
        setTimeout(() => { setPrev(null); setGoing(false); }, 620);
        return n;
      });
    }, DURATION);
  }, []);

  useEffect(() => {
    if (paused) { clearTimeout(timerRef.current); return; }
    scheduleNext();
    return () => clearTimeout(timerRef.current);
  }, [cur, paused, scheduleNext]);

  /* ── touch ── */
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(dx) < Math.abs(dy) * 1.2) return; // mostly vertical scroll — ignore
    if (dx < -44) next();
    else if (dx > 44) prev_();
  };

  const s = slides[cur];

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...INTER }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ════ SLIDES (absolute, layered) ════ */}
      {slides.map((sl, i) => {
        const isActive = i === cur;
        const isPrev   = i === prev;
        if (!isActive && !isPrev) return null; // unmount other slides entirely

        return (
          <SlidePanel
            key={i}
            sl={sl}
            isActive={isActive}
            navigate={navigate}
          />
        );
      })}

      {/* ════ CSS progress bar (no JS state updates) ════ */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 20, background: "rgba(255,255,255,0.08)" }}>
        <div
          key={progKey}
          style={{
            height: "100%",
            background: s.accent,
            boxShadow: `0 0 8px ${s.accent}cc`,
            animation: paused ? "none" : `hsProgress ${DURATION}ms linear forwards`,
            width: paused ? "0%" : undefined,
          }}
        />
      </div>

      {/* ════ CONTROLS ════ */}
      <Controls
        cur={cur}
        slides={slides}
        s={s}
        goTo={goTo}
        onPrev={prev_}
        onNext={next}
      />

      {/* ════ CSS animations ════ */}
      <style>{`
        @keyframes hsProgress {
          from { width: 0% }
          to   { width: 100% }
        }
        @keyframes hsIn {
          from { opacity: 0; transform: translateY(14px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes hsOut {
          from { opacity: 1; transform: translateY(0)     scale(1); }
          to   { opacity: 0; transform: translateY(-10px) scale(0.99); }
        }
        @keyframes hsFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────── SlidePanel ────────────────── */
function SlidePanel({ sl, isActive, navigate }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0,
        background: sl.gradient,
        animation: isActive ? "hsFadeIn 0.55s cubic-bezier(0.4,0,0.2,1) forwards" : "hsOut 0.55s cubic-bezier(0.4,0,0.2,1) forwards",
        zIndex: isActive ? 2 : 1,
        overflow: "hidden",
      }}
    >
      {/* ── Dot grid ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px,transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* ── Glow blobs (no blur on mobile for perf) ── */}
      <div style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: "60vw", height: "60vw", maxWidth: 520, maxHeight: 520,
        left: "-18%", bottom: "-25%",
        background: sl.glowL, filter: "blur(72px)", opacity: 0.75,
        willChange: "opacity",
      }} />
      <div style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: "40vw", height: "40vw", maxWidth: 360, maxHeight: 360,
        right: "-8%", top: "-10%",
        background: sl.glowR, filter: "blur(56px)", opacity: 0.6,
        willChange: "opacity",
      }} />

      {/* ── Decorative rings (desktop only) ── */}
      <div className="hero-ring" style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: 560, height: 560,
        right: -100, top: "50%", transform: "translateY(-50%)",
        border: "1px solid rgba(255,255,255,0.055)",
      }} />
      <div className="hero-ring" style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        width: 360, height: 360,
        right: -20, top: "50%", transform: "translateY(-50%)",
        border: "1px solid rgba(255,255,255,0.075)",
      }} />

      {/* ── Content ── */}
      <div className="hero-inner" style={{
        position: "relative", zIndex: 2, height: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 72px 48px", gap: 48,
        animation: isActive ? "hsIn 0.6s cubic-bezier(0.34,1.2,0.64,1) 0.05s both" : "none",
      }}>
        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: 540 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.1)",
            border: `1px solid ${sl.accent}50`,
            borderRadius: 100, padding: "4px 14px 4px 9px",
            marginBottom: 22,
          }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{sl.badgeIcon}</span>
            <span style={{ ...SYNE, fontSize: 9.5, fontWeight: 700, letterSpacing: "2.2px", color: sl.accent, textTransform: "uppercase" }}>
              {sl.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            ...SYNE, fontWeight: 900, color: "#fff",
            fontSize: "clamp(28px,4vw,52px)",
            lineHeight: 1.05, letterSpacing: "-0.5px",
            margin: "0 0 16px",
          }}>
            {sl.title[0]}<br />
            <span style={{ color: sl.accent, textShadow: `0 0 44px ${sl.accent}55` }}>
              {sl.title[1]}
            </span>
          </h1>

          {/* Description */}
          <p style={{
            color: "rgba(255,255,255,0.62)",
            fontSize: "clamp(13px,1.5vw,15.5px)", lineHeight: 1.72,
            margin: "0 0 28px", maxWidth: 440,
          }}>
            {sl.desc}
          </p>

          {/* Buttons */}
          <div className="hero-btns" style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <HeroBtn primary accent={sl.accent} btnColor={sl.btnColor} onClick={() => navigate(sl.btn1Route)}>
              {sl.btn1} <span style={{ fontSize: 16 }}>→</span>
            </HeroBtn>
            <HeroBtn onClick={() => navigate(sl.btn2Route)}>
              {sl.btn2}
            </HeroBtn>
          </div>

          {/* Trust */}
          <p className="hero-trust" style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: sl.accent }}>✓</span> {sl.trust}
          </p>
        </div>

        {/* RIGHT — Stat cards */}
        <div className="hero-stats" style={{ display: "flex", flexDirection: "column", gap: 10, width: 224, flexShrink: 0 }}>
          {sl.stats.map((st, j) => (
            <div key={j} style={{
              background: "rgba(255,255,255,0.065)",
              border: "1px solid rgba(255,255,255,0.11)",
              borderRadius: 18, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 14,
              transition: "border-color 0.2s, background 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${sl.accent}45`;
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateX(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.11)";
                e.currentTarget.style.background = "rgba(255,255,255,0.065)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{st.icon}</span>
              <div>
                <div style={{ ...SYNE, fontWeight: 900, color: sl.accent, fontSize: "clamp(18px,2.5vw,26px)", lineHeight: 1, textShadow: `0 0 18px ${sl.accent}44` }}>
                  {st.num}
                </div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginTop: 3, fontWeight: 500, lineHeight: 1.2 }}>
                  {st.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────── Button ────────────────── */
function HeroBtn({ children, primary, accent, btnColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        background: primary ? accent : "rgba(255,255,255,0.09)",
        color: primary ? btnColor : "#fff",
        fontWeight: primary ? 700 : 600,
        fontSize: 14, padding: "13px 26px",
        borderRadius: 11, border: primary ? "none" : "1px solid rgba(255,255,255,0.22)",
        cursor: "pointer",
        boxShadow: primary ? `0 4px 24px ${accent}44` : "none",
        transition: "transform 0.2s, box-shadow 0.2s, background 0.2s, border-color 0.2s",
        letterSpacing: "0.1px", whiteSpace: "nowrap",
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        if (primary) {
          e.currentTarget.style.boxShadow = `0 10px 32px ${accent}66`;
        } else {
          e.currentTarget.style.background = "rgba(255,255,255,0.16)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.42)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        if (primary) {
          e.currentTarget.style.boxShadow = `0 4px 24px ${accent}44`;
        } else {
          e.currentTarget.style.background = "rgba(255,255,255,0.09)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
        }
      }}
    >
      {children}
    </button>
  );
}

/* ────────────────── Controls ────────────────── */
function Controls({ cur, slides, s, goTo, onPrev, onNext }) {
  return (
    <div className="hero-ctrl" style={{
      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
      height: 48,
      padding: "0 72px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Counter */}
      <span style={{ ...SYNE, fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>
        <span style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>
          {String(cur + 1).padStart(2, "0")}
        </span>
        {" / "}{String(slides.length).padStart(2, "0")}
      </span>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {slides.map((sl, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            height: 4, borderRadius: 2, border: "none", cursor: "pointer",
            transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            width: i === cur ? 34 : 14,
            background: i === cur ? s.accent : "rgba(255,255,255,0.25)",
            boxShadow: i === cur ? `0 0 8px ${s.accent}` : "none",
            padding: 0,
          }} />
        ))}
      </div>

      {/* Arrow buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        {[{ fn: onPrev, ch: "‹" }, { fn: onNext, ch: "›" }].map(({ fn, ch }) => (
          <button key={ch} onClick={fn} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#fff", fontSize: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", lineHeight: 1,
            fontFamily: "sans-serif",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = s.accent + "28";
              e.currentTarget.style.borderColor = s.accent + "80";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            }}
          >{ch}</button>
        ))}
      </div>
    </div>
  );
}
