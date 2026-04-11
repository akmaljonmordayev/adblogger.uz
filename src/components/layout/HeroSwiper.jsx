import { useState, useEffect, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

const SYNE = { fontFamily: "'Syne', sans-serif" };
const INTER = { fontFamily: "'Inter', sans-serif" };

const slides = [
  {
    badge: "O'ZBEKISTON #1",
    badgeIcon: "🥇",
    title: ["Eng yirik", "Bloger Marketplace"],
    desc: "500+ tasdiqlangan bloger bir platformada. Toping, solishtiring va reklama bering — tez va oson.",
    btn1: "Blogerlarni ko'rish",
    btn2: "Reklama berish",
    trust: "Ro'yxatdan o'tish bepul · Kredit karta shart emas",
    stats: [
      { num: "500+", icon: "👤", label: "Tasdiqlangan Bloger" },
      { num: "12M+", icon: "👁️", label: "Faol Auditoriya" },
      { num: "3×",   icon: "📈", label: "O'rtacha ROI" },
    ],
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 45%, #991b1b 100%)",
    accent: "#fbbf24",
    glow: "rgba(220,38,38,0.45)",
    btnColor: "#1a0a00",
  },
  {
    badge: "PREMIUM XIZMAT",
    badgeIcon: "✦",
    title: ["Brendingizni", "Kuchaytiring"],
    desc: "AI yordamida eng mos blogerlarni toping. Kampaniyangizni boshqaring va natijalarni real vaqtda kuzating.",
    btn1: "Bepul boshlash",
    btn2: "Demo ko'rish",
    trust: "2 daqiqada sozlab oling · Texnik bilim kerak emas",
    stats: [
      { num: "98%",  icon: "⭐", label: "Mijozlar Mamnuniyati" },
      { num: "48h",  icon: "⚡", label: "Kampaniya Tezligi" },
      { num: "200+", icon: "🏢", label: "Ishonch Bildirgan Brend" },
    ],
    gradient: "linear-gradient(135deg, #0b1120 0%, #0f2d52 55%, #0c1f3a 100%)",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.3)",
    btnColor: "#001322",
  },
  {
    badge: "YANGI IMKONIYAT",
    badgeIcon: "🚀",
    title: ["Bloger bo'lib", "Daromad Oling"],
    desc: "O'z auditoriyangizni monetizatsiya qiling. Brendlar bilan to'g'ridan-to'g'ri ishlang va daromadingizni oshiring.",
    btn1: "Ro'yxatdan o'tish",
    btn2: "Ko'proq bilish",
    trust: "1 oy komissiyasiz · Istalgan vaqt bekor qilish",
    stats: [
      { num: "5M+", icon: "💰", label: "Blogerlarga To'lovlar" },
      { num: "30%", icon: "🔥", label: "Oylik Daromad O'sishi" },
      { num: "0%",  icon: "🎁", label: "Komissiya (1 oy)" },
    ],
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #92400e 100%)",
    accent: "#fef08a",
    glow: "rgba(217,119,6,0.45)",
    btnColor: "#1a0e00",
  },
];

const DURATION = 5000;

export default function HeroSwiper() {
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const progRef = useRef(null);
  const touchStartX = useRef(0);
  const [w, setW] = useState(window.innerWidth);

  const goTo = (n) => { setCur(n); setProgress(0); };
  const next = () => goTo((cur + 1) % slides.length);
  const prev = () => goTo((cur - 1 + slides.length) % slides.length);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    let val = 0;
    const step = 100 / (DURATION / 50);
    progRef.current = setInterval(() => {
      val += step;
      setProgress(Math.min(val, 100));
      if (val >= 100) {
        clearInterval(progRef.current);
        setCur((c) => (c + 1) % slides.length);
        setProgress(0);
      }
    }, 50);
    return () => clearInterval(progRef.current);
  }, [cur, paused]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
  };

  const isMobile = w < 768;
  const isSmall  = w < 480;
  const slide    = slides[cur];

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", ...INTER }}>
      <div
        style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ─── Slides track ─────────────────────────────────── */}
        <div style={{
          display: "flex", height: "100%",
          transition: "transform 0.75s cubic-bezier(0.77,0,0.175,1)",
          transform: `translateX(-${cur * 100}%)`,
        }}>
          {slides.map((s, i) => (
            <div key={i} style={{
              minWidth: "100%", height: "100%",
              position: "relative", overflow: "hidden",
              background: s.gradient,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              padding: isSmall
                ? "28px 18px 80px"
                : isMobile
                ? "32px 28px 80px"
                : "0 72px",
              gap: isMobile ? "20px" : "48px",
              boxSizing: "border-box",
            }}>

              {/* ── Decorations ── */}
              {/* Dot-grid overlay */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }} />

              {/* Big ring right */}
              <div style={{
                position: "absolute", borderRadius: "50%", pointerEvents: "none",
                width: isMobile ? "340px" : "600px",
                height: isMobile ? "340px" : "600px",
                right: isMobile ? "-120px" : "-100px",
                top: "50%", transform: "translateY(-50%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }} />
              {/* Inner ring */}
              <div style={{
                position: "absolute", borderRadius: "50%", pointerEvents: "none",
                width: isMobile ? "200px" : "380px",
                height: isMobile ? "200px" : "380px",
                right: isMobile ? "-60px" : "-20px",
                top: "50%", transform: "translateY(-50%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }} />

              {/* Glow blob bottom-left */}
              <div style={{
                position: "absolute", borderRadius: "50%", pointerEvents: "none",
                width: "500px", height: "500px",
                left: "-120px", bottom: "-200px",
                background: s.glow, filter: "blur(80px)", opacity: 0.7,
              }} />
              {/* Glow blob top-right */}
              <div style={{
                position: "absolute", borderRadius: "50%", pointerEvents: "none",
                width: "300px", height: "300px",
                right: "-60px", top: "-60px",
                background: s.glow, filter: "blur(60px)", opacity: 0.5,
              }} />

              {/* ── LEFT — Main content ── */}
              <div style={{
                position: "relative", zIndex: 2,
                flex: isMobile ? "unset" : 1,
                maxWidth: isMobile ? "100%" : "540px",
                width: "100%",
              }}>
                {/* Badge pill */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  background: "rgba(255,255,255,0.1)",
                  border: `1px solid ${s.accent}55`,
                  borderRadius: "100px",
                  padding: "5px 16px 5px 10px",
                  marginBottom: isMobile ? "16px" : "24px",
                }}>
                  <span style={{ fontSize: "15px", lineHeight: 1 }}>{s.badgeIcon}</span>
                  <span style={{
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "2px", color: s.accent,
                    textTransform: "uppercase",
                  }}>{s.badge}</span>
                </div>

                {/* Headline */}
                <h1 style={{
                  ...SYNE, fontWeight: 800, color: "#fff", margin: "0 0 16px",
                  lineHeight: 1.06, letterSpacing: "-0.5px",
                  fontSize: isSmall ? "28px" : isMobile ? "34px" : "52px",
                }}>
                  {s.title[0]}<br />
                  <span style={{
                    color: s.accent,
                    textShadow: `0 0 40px ${s.accent}66`,
                  }}>{s.title[1]}</span>
                </h1>

                {/* Description */}
                <p style={{
                  color: "rgba(255,255,255,0.68)",
                  fontSize: isSmall ? "13px" : isMobile ? "14px" : "15.5px",
                  lineHeight: 1.75, margin: "0 0 28px",
                  maxWidth: "420px",
                }}>{s.desc}</p>

                {/* Buttons */}
                <div style={{
                  display: "flex", gap: "12px", flexWrap: "wrap",
                  flexDirection: isSmall ? "column" : "row",
                  marginBottom: "18px",
                }}>
                  <button
                    style={{
                      background: s.accent, color: s.btnColor,
                      fontSize: "13px", fontWeight: 700,
                      padding: isSmall ? "12px 20px" : "13px 30px",
                      borderRadius: "10px", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "6px",
                      boxShadow: `0 4px 28px ${s.accent}55`,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      width: isSmall ? "100%" : "auto",
                      letterSpacing: "0.2px",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 10px 36px ${s.accent}77`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = `0 4px 28px ${s.accent}55`;
                    }}
                  >
                    {s.btn1}
                    <span style={{ fontSize: "15px" }}>→</span>
                  </button>

                  <button
                    style={{
                      background: "rgba(255,255,255,0.09)",
                      backdropFilter: "blur(10px)",
                      color: "#fff",
                      fontSize: "13px", fontWeight: 600,
                      padding: isSmall ? "12px 20px" : "13px 30px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.22)",
                      cursor: "pointer", transition: "all 0.2s",
                      width: isSmall ? "100%" : "auto",
                      letterSpacing: "0.2px",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                    }}
                  >
                    {s.btn2}
                  </button>
                </div>

                {/* Trust line */}
                <p style={{
                  fontSize: "11px", color: "rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", gap: "5px",
                  margin: 0,
                }}>
                  <span style={{ color: s.accent, fontSize: "12px" }}>✓</span>
                  {s.trust}
                </p>
              </div>

              {/* ── RIGHT — Stat cards ── */}
              <div style={{
                position: "relative", zIndex: 2,
                display: "flex",
                flexDirection: isMobile ? "row" : "column",
                gap: isMobile ? "8px" : "10px",
                width: isMobile ? "100%" : "250px",
                flexShrink: 0,
              }}>
                {s.stats.map((st, j) => (
                  <div key={j}
                    style={{
                      flex: isMobile ? 1 : "unset",
                      background: "rgba(255,255,255,0.07)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,0.13)",
                      borderRadius: "16px",
                      padding: isMobile
                        ? (isSmall ? "10px 6px" : "12px 10px")
                        : "16px 20px",
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: "center",
                      gap: isMobile ? "4px" : "14px",
                      transition: "transform 0.22s, border-color 0.22s, background 0.22s",
                      cursor: "default",
                      textAlign: isMobile ? "center" : "left",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = isMobile ? "translateY(-4px)" : "translateX(-5px)";
                      e.currentTarget.style.borderColor = `${s.accent}55`;
                      e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      fontSize: isSmall ? "18px" : isMobile ? "22px" : "26px",
                      lineHeight: 1, flexShrink: 0,
                    }}>{st.icon}</div>

                    {/* Text */}
                    <div>
                      <div style={{
                        ...SYNE, fontWeight: 800, color: s.accent,
                        fontSize: isSmall ? "18px" : isMobile ? "22px" : "26px",
                        lineHeight: 1,
                        textShadow: `0 0 20px ${s.accent}55`,
                      }}>{st.num}</div>
                      <div style={{
                        fontSize: isSmall ? "9px" : "11px",
                        color: "rgba(255,255,255,0.55)",
                        marginTop: "4px", lineHeight: 1.3, fontWeight: 500,
                      }}>{st.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Progress bar ────────────────────────────────── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: "2px", zIndex: 10,
          background: slide.accent,
          boxShadow: `0 0 10px ${slide.accent}`,
          transition: "width 0.05s linear",
          width: `${progress}%`,
        }} />

        {/* ─── Bottom controls ─────────────────────────────── */}
        <div style={{
          position: "absolute", bottom: "18px", left: 0, right: 0, zIndex: 10,
          padding: isSmall ? "0 18px" : isMobile ? "0 28px" : "0 72px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Slide counter */}
          <span style={{
            ...SYNE, fontSize: "12px", color: "rgba(255,255,255,0.4)",
            letterSpacing: "1px", fontWeight: 600,
          }}>
            <span style={{ color: "#fff", fontSize: "15px", fontWeight: 800 }}>
              {String(cur + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(slides.length).padStart(2, "0")}
          </span>

          {/* Dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                height: "4px", borderRadius: "2px", border: "none",
                cursor: "pointer", transition: "all 0.35s",
                width: i === cur ? "32px" : "14px",
                background: i === cur ? slide.accent : "rgba(255,255,255,0.28)",
                boxShadow: i === cur ? `0 0 8px ${slide.accent}` : "none",
              }} />
            ))}
          </div>

          {/* Arrow buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[{ fn: prev, icon: "‹" }, { fn: next, icon: "›" }].map(({ fn, icon }) => (
              <button key={icon} onClick={fn} style={{
                width: "36px", height: "36px", borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.1)",
                outline: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", fontSize: "22px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(6px)", transition: "all 0.2s",
                lineHeight: 1,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = slide.accent + "33";
                  e.currentTarget.style.outlineColor = slide.accent + "88";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.outlineColor = "rgba(255,255,255,0.2)";
                }}
              >{icon}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
