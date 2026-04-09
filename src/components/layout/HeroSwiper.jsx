import { useState, useEffect, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

const SYNE = { fontFamily: "'Syne', sans-serif" };
const INTER = { fontFamily: "'Inter', sans-serif" };

const slides = [
  {
    badge: "🥇 O'zbekiston #1",
    title: ["Eng yirik", "Bloger Marketplace"],
    desc: "500+ tasdiqlangan bloger bir platformada. Toping, solishtiring va reklama bering — tez va oson.",
    btn1: "Blogerlarni ko'rish →",
    btn2: "Reklama berish",
    stats: [
      { num: "500+", label: "Bloger", sub: "Tasdiqlangan" },
      { num: "12M+", label: "Auditoriya", sub: "Faol foydalanuvchi" },
      { num: "3x", label: "O'rtacha ROI", sub: "Kafolatlangan" },
    ],
    bg: "linear-gradient(135deg, #c0392b 0%, #e74c3c 40%, #a93226 100%)",
    blob1: "#ff6b6b", blob2: "#ff9999",
    numColor: "#ffd700", spanColor: "#ffd700", btnColor: "#c0392b",
  },
  {
    badge: "✦ Premium xizmat",
    title: ["Brendingizni", "Kuchaytiring"],
    desc: "AI yordamida eng mos blogerlarni toping. Kampaniyangizni boshqaring va natijalarni real vaqtda kuzating.",
    btn1: "Bepul boshlash →",
    btn2: "Demo ko'rish",
    stats: [
      { num: "98%", label: "Mamnuniyat", sub: "Mijozlar reytingi" },
      { num: "48h", label: "Tezlik", sub: "Kampaniya ishlashi" },
      { num: "200+", label: "Brendlar", sub: "Ishonch bildirgan" },
    ],
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    blob1: "#4fc3f7", blob2: "#7c4dff",
    numColor: "#4fc3f7", spanColor: "#4fc3f7", btnColor: "#16213e",
  },
  {
    badge: "※ Yangi imkoniyat",
    title: ["Bloger bo'lib", "Daromad Oling"],
    desc: "O'z auditoriyangizni monetizatsiya qiling. Brendlar bilan to'g'ridan-to'g'ri ishlang va daromadingizni oshiring.",
    btn1: "Ro'yxatdan o'tish →",
    btn2: "Ko'proq bilish",
    stats: [
      { num: "5M+", label: "To'lovlar", sub: "Blogerlarga berilgan" },
      { num: "30%", label: "O'sish", sub: "Oylik daromad" },
      { num: "0%", label: "Komissiya", sub: "1 oy bepul" },
    ],
    bg: "linear-gradient(135deg, #f39c12 0%, #e67e22 50%, #d35400 100%)",
    blob1: "#fff176", blob2: "#ffcc02",
    numColor: "#ffffff", spanColor: "#ffffff", btnColor: "#d35400",
  },
];

const DURATION = 4500;

export default function HeroSwiper() {
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const progRef = useRef(null);
  const touchStartX = useRef(0);

  const goTo = (n) => { setCur(n); setProgress(0); };
  const next = () => goTo((cur + 1) % slides.length);
  const prev = () => goTo((cur - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const step = 100 / (DURATION / 100);
    let val = 0;
    progRef.current = setInterval(() => {
      val += step;
      setProgress(Math.min(val, 100));
      if (val >= 100) {
        clearInterval(progRef.current);
        setCur((c) => (c + 1) % slides.length);
        setProgress(0);
      }
    }, 100);
    return () => clearInterval(progRef.current);
  }, [cur, paused]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
  };

  // Inline responsive styles
  const getSlideStyle = () => {
    const w = window.innerWidth;
    if (w < 480) return {
      flexDirection: "column", padding: "28px 16px 72px", gap: "16px", minHeight: "640px", alignItems: "flex-start",
    };
    if (w < 768) return {
      flexDirection: "column", padding: "32px 24px 68px", gap: "20px", minHeight: "560px", alignItems: "flex-start",
    };
    return {
      flexDirection: "row", padding: "48px 56px", gap: "40px", minHeight: "420px", alignItems: "center",
    };
  };

  const [slideStyle, setSlideStyle] = useState(getSlideStyle());

  useEffect(() => {
    const handleResize = () => setSlideStyle(getSlideStyle());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = slideStyle.flexDirection === "column";

  return (
    <div style={{ width: "100%", overflow: "hidden", borderRadius: "20px", ...INTER }}>
      <div
        style={{ position: "relative", width: "100%", overflow: "hidden" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides wrapper */}
        <div
          style={{
            display: "flex",
            transition: "transform 0.7s cubic-bezier(0.77,0,0.175,1)",
            transform: `translateX(-${cur * 100}%)`,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              style={{
                minWidth: "100%",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                background: slide.bg,
                ...slideStyle,
              }}
            >
              {/* Blob 1 */}
              <div style={{
                position: "absolute", borderRadius: "50%", opacity: 0.18,
                pointerEvents: "none", background: slide.blob1,
                width: isMobile ? "200px" : "320px",
                height: isMobile ? "200px" : "320px",
                right: "-60px", top: "-60px",
              }} />
              {/* Blob 2 */}
              <div style={{
                position: "absolute", borderRadius: "50%", opacity: 0.15,
                pointerEvents: "none", background: slide.blob2,
                width: isMobile ? "140px" : "200px",
                height: isMobile ? "140px" : "200px",
                right: isMobile ? "60px" : "120px", bottom: "-80px",
              }} />

              {/* Left content */}
              <div style={{ position: "relative", zIndex: 2, flex: 1, width: "100%" }}>
                {/* Badge */}
                <span style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff", borderRadius: "20px",
                  fontSize: "11px", fontWeight: 600,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  padding: "5px 14px", marginBottom: "18px",
                }}>
                  {slide.badge}
                </span>

                {/* Title */}
                <h1 style={{
                  ...SYNE, fontWeight: 800, color: "#fff",
                  lineHeight: 1.1, marginBottom: "14px",
                  fontSize: isMobile ? (window.innerWidth < 480 ? "24px" : "28px") : "38px",
                }}>
                  {slide.title[0]}<br />
                  <span style={{ color: slide.spanColor }}>{slide.title[1]}</span>
                </h1>

                {/* Description */}
                <p style={{
                  fontSize: isMobile ? "13px" : "14px",
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.65,
                  maxWidth: isMobile ? "100%" : "360px",
                  marginBottom: "28px",
                }}>
                  {slide.desc}
                </p>

                {/* Buttons */}
                <div style={{
                  display: "flex",
                  gap: "12px",
                  flexDirection: isMobile && window.innerWidth < 480 ? "column" : "row",
                  flexWrap: "wrap",
                }}>
                  <button
                    style={{
                      background: "#fff", color: slide.btnColor,
                      fontSize: "13px", fontWeight: 700,
                      padding: "12px 24px", borderRadius: "10px",
                      border: "none", cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      width: isMobile && window.innerWidth < 480 ? "100%" : "auto",
                    }}
                    onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)"; }}
                    onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)"; }}
                  >
                    {slide.btn1}
                  </button>
                  <button
                    style={{
                      background: "transparent", color: "#fff",
                      fontSize: "13px", fontWeight: 600,
                      padding: "12px 24px", borderRadius: "10px",
                      border: "2px solid rgba(255,255,255,0.5)", cursor: "pointer",
                      transition: "all 0.2s",
                      width: isMobile && window.innerWidth < 480 ? "100%" : "auto",
                    }}
                    onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.12)"; e.target.style.borderColor = "#fff"; }}
                    onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(255,255,255,0.5)"; }}
                  >
                    {slide.btn2}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div style={{
                position: "relative", zIndex: 2,
                display: "flex", flexDirection: "column",
                gap: "14px",
                width: isMobile ? "100%" : "auto",
                minWidth: isMobile ? "unset" : "220px",
              }}>
                {slide.stats.map((s, j) => (
                  <div
                    key={j}
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.22)",
                      borderRadius: "14px",
                      padding: isMobile ? "12px 16px" : "14px 20px",
                      display: "flex", alignItems: "center",
                      gap: "14px",
                      transition: "transform 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateX(-4px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >
                    <span style={{
                      ...SYNE, fontWeight: 800,
                      fontSize: isMobile ? "22px" : "26px",
                      lineHeight: 1, color: slide.numColor,
                      minWidth: isMobile ? "52px" : "60px",
                    }}>
                      {s.num}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{
                        fontSize: "10px", color: "rgba(255,255,255,0.65)",
                        fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase",
                      }}>
                        {s.label}
                      </span>
                      <span style={{
                        fontSize: "12px", color: "rgba(255,255,255,0.9)",
                        fontWeight: 500, marginTop: "2px",
                      }}>
                        {s.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: "3px", background: "rgba(255,255,255,0.6)",
          transition: "width 0.1s linear", zIndex: 10,
          width: `${progress}%`,
        }} />

        {/* Pagination */}
        <div style={{
          position: "absolute", bottom: "20px",
          left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "8px", zIndex: 10,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                height: "8px", borderRadius: "4px", border: "none",
                cursor: "pointer", transition: "all 0.35s",
                width: i === cur ? "28px" : "8px",
                background: i === cur ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>

        {/* Nav buttons — faqat desktop */}
        {!isMobile && (
          <>
            <button onClick={prev} style={{
              position: "absolute", left: "16px", top: "50%",
              transform: "translateY(-50%)", zIndex: 10,
              width: "44px", height: "44px", borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: "22px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >‹</button>
            <button onClick={next} style={{
              position: "absolute", right: "16px", top: "50%",
              transform: "translateY(-50%)", zIndex: 10,
              width: "44px", height: "44px", borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: "22px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >›</button>
          </>
        )}
      </div>
    </div>
  );
}
