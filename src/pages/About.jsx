import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Keyslar", "Xizmatlar", "Jamoa", "Aloqa"];

const SERVICES = [
  { num: "01", title: "SEO & Google Ads", metric: "93%", metricLabel: "1-sahifa erishish darajasi", desc: "Google'da birinchi o'rinda ko'rinish — eng ko'p sotiladigan joy. Har bir klik aniq niyatli xaridor." },
  { num: "02", title: "Social Media Ads", metric: "×4.2", metricLabel: "o'rtacha ROI", desc: "Instagram va Facebook'da faqat sotib oladigan auditoriyaga ko'rsatamiz. Isrof yo'q." },
  { num: "03", title: "Video Production", metric: "81%", metricLabel: "video orqali konversiya", desc: "Ko'z tortuvchi kreativ video — brend haqiqiy ko'rinish oladi va sotuv o'sadi." },
];

const WHY = [
  { n: "01", h: "Data-driven strategiya", b: "Har bir qarorimiz raqamlar asosida qabul qilinadi. Tasodif emas — aniq hisob-kitob." },
  { n: "02", h: "Kreativ portlash", b: "Chiroyli va sotuvchi kontent bir vaqtda. Biz auditoriya ongiga ta'sir qiluvchi vizuallar yaratamiz." },
  { n: "03", h: "To'liq shaffoflik", b: "Har bir sarflangan so'm qayerga ketayotgani va qancha daromad keltirayotgani real-time ko'rinadi." },
];

const CASES = [
  { tag: "E-commerce", title: "Sotuvlarni 250% ga oshirish", body: "Noldan boshlab agressiv targeting va SMM strategiyasi orqali rekord ko'rsatkichlarga erishdik.", year: "2024" },
  { tag: "Branding", title: "Minimalist Brend Identikasi", body: "Yangi startap uchun xalqaro darajadagi brending va vizual kontent. Investorlar ishonchini qozondik.", year: "2023" },
];

export default function Adbloger() {
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      background: "#F9F7F4",
      color: "#1a1a1a",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F9F7F4; }
        ::selection { background: #C8001A; color: #fff; }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .hero-word { display: inline-block; animation: fadeUp 0.8s cubic-bezier(.22,1,.36,1) both; }
        .hero-word:nth-child(1) { animation-delay: 0.1s; }
        .hero-word:nth-child(2) { animation-delay: 0.22s; }
        .hero-word:nth-child(3) { animation-delay: 0.34s; }
        .hero-word:nth-child(4) { animation-delay: 0.46s; }
        .hero-word:nth-child(5) { animation-delay: 0.58s; }
        .hero-sub { animation: fadeUp 0.8s 0.65s cubic-bezier(.22,1,.36,1) both; }
        .hero-cta { animation: fadeUp 0.8s 0.8s cubic-bezier(.22,1,.36,1) both; }
        .divider-line {
          height: 1px; background: #D8D3CC;
          transform-origin: left;
          animation: lineGrow 1s 0.3s cubic-bezier(.22,1,.36,1) both;
        }
        .svc-tab {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 16px 0; color: #aaa;
          border-bottom: 2px solid transparent;
          transition: color .25s, border-color .25s;
          margin-right: 40px;
        }
        .svc-tab.on { color: #1a1a1a; border-bottom-color: #C8001A; }
        .svc-tab:hover { color: #1a1a1a; }
        .case-card {
          cursor: pointer; overflow: hidden;
          border: 1px solid #E5E0D8;
          transition: box-shadow .35s, transform .35s;
          background: #fff;
        }
        .case-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.1); transform: translateY(-4px); }
        .why-card {
          padding: 40px 36px;
          border: 1px solid #E5E0D8;
          background: #fff;
          transition: background .25s, border-color .25s;
        }
        .why-card:hover { background: #1a1a1a; border-color: #1a1a1a; }
        .why-card:hover .why-h { color: #fff !important; }
        .why-card:hover .why-n { color: rgba(255,255,255,0.15) !important; }
        .why-card:hover .why-p { color: #888 !important; }
        .inp {
          width: 100%; padding: 16px 18px;
          border: 1px solid #D8D3CC;
          background: #F9F7F4; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          outline: none; transition: border-color .2s;
        }
        .inp:focus { border-color: #1a1a1a; }
        .inp::placeholder { color: #bbb; }
        .btn-main {
          background: #1a1a1a; color: #fff; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 18px 40px; transition: background .2s;
          width: 100%;
        }
        .btn-main:hover { background: #C8001A; }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: 0.06em;
          color: #555; text-decoration: none; cursor: pointer;
          transition: color .2s;
        }
        .nav-link:hover { color: #1a1a1a; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 56px", height: 68,
        background: scrolled ? "rgba(249,247,244,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E5E0D8" : "1px solid transparent",
        transition: "all .4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#C8001A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 12, height: 12, background: "#fff" }} />
          </div>
          <span className="sans" style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.06em", color: "#1a1a1a" }}>
            ADBLOGER
          </span>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          {NAV_LINKS.map(l => <span key={l} className="nav-link">{l}</span>)}
        </div>
        <a href="#cta" className="sans" style={{
          fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "#C8001A", textDecoration: "none",
          borderBottom: "1.5px solid #C8001A", paddingBottom: 2,
        }}>
          Boshlash →
        </a>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: "100vh", display: "grid",
        gridTemplateColumns: "1fr 420px",
        borderBottom: "1px solid #E5E0D8",
      }}>
        {/* Left */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "140px 64px 80px 56px",
          borderRight: "1px solid #E5E0D8",
        }}>
          <p className="sans hero-sub" style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase",
            color: "#C8001A", marginBottom: 36,
          }}>
            Performance & Creative Agency — Toshkent
          </p>

          <h1 className="serif" style={{
            fontSize: "clamp(52px,6.5vw,88px)", fontWeight: 900, lineHeight: 1,
            letterSpacing: "-0.02em", marginBottom: 48, color: "#1a1a1a",
          }}>
            <span className="hero-word" style={{ display: "block" }}>Sizning</span>
            <span className="hero-word" style={{ display: "block", color: "#C8001A", fontStyle: "italic" }}>o'singiz —</span>
            <span className="hero-word" style={{ display: "block" }}>bizning</span>
            <span className="hero-word" style={{ display: "block", fontStyle: "italic" }}>missiyamiz.</span>
          </h1>

          <div className="divider-line" style={{ marginBottom: 40, width: "60%" }} />

          <p className="sans hero-sub" style={{
            fontSize: 16, lineHeight: 1.75, color: "#666",
            maxWidth: 480, marginBottom: 52,
          }}>
            2024-yilda raqamli marketing bozori{" "}
            <strong style={{ color: "#1a1a1a", fontWeight: 600 }}>$667 mlrd</strong>
            {" "}ga yetdi. Biz sizga ushbu ulkan bozordan munosib ulushingizni olishga yordam beramiz.
          </p>

          <div className="hero-cta" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="#cta" className="sans" style={{
              background: "#1a1a1a", color: "#fff",
              fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "16px 36px", textDecoration: "none", display: "inline-block",
              transition: "background .2s",
            }}
              onMouseEnter={e => e.target.style.background = "#C8001A"}
              onMouseLeave={e => e.target.style.background = "#1a1a1a"}
            >
              Strategiyani olish
            </a>
            <a href="#cases" className="sans" style={{
              fontSize: 13, color: "#aaa", fontWeight: 500, textDecoration: "none",
              borderBottom: "1px solid #D8D3CC", paddingBottom: 2,
            }}>
              Keyslarni ko'rish ↓
            </a>
          </div>
        </div>

        {/* Right: stat panel */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "#fff" }}>
          {[
            { val: "$667", unit: "mlrd", label: "Global bozor hajmi" },
            { val: "93%", unit: "", label: "Google 1-sahifa erishish" },
            { val: "×4.2", unit: "", label: "O'rtacha ROI ko'rsatkich" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "48px 44px",
              borderBottom: i < 2 ? "1px solid #E5E0D8" : "none",
            }}>
              <div className="serif" style={{
                fontSize: 56, fontWeight: 900, color: "#1a1a1a",
                lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8,
              }}>
                {s.val}
                {s.unit && <span style={{ fontSize: 28, color: "#C8001A", marginLeft: 4 }}>{s.unit}</span>}
              </div>
              <div className="sans" style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "#aaa",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid #E5E0D8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
            <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: "#1a1a1a" }}>Xizmatlarimiz</h2>
            <p className="sans" style={{ fontSize: 13, color: "#aaa", fontWeight: 400 }}>Natijaga yo'naltirilgan yondashuv</p>
          </div>
          <div style={{ borderTop: "1px solid #E5E0D8", marginBottom: 48 }} />

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E5E0D8", marginBottom: 60 }}>
            {SERVICES.map((s, i) => (
              <button key={i} className={`svc-tab${active === i ? " on" : ""}`} onClick={() => setActive(i)}>
                <span style={{ color: "#D8D3CC", marginRight: 8 }}>{s.num}</span>{s.title}
              </button>
            ))}
          </div>

          {/* Panel */}
          {SERVICES.map((s, i) => i === active && (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
              <div>
                <div className="serif" style={{
                  fontSize: "clamp(80px,12vw,120px)", fontWeight: 900,
                  color: "#F0EDE8", lineHeight: 1, letterSpacing: "-0.05em",
                  marginBottom: -16, userSelect: "none",
                }}>
                  {s.metric}
                </div>
                <p className="sans" style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "#C8001A", marginBottom: 16,
                }}>
                  {s.metricLabel}
                </p>
                <p className="sans" style={{ fontSize: 16, lineHeight: 1.75, color: "#555" }}>{s.desc}</p>
                <div style={{ marginTop: 36, display: "flex", gap: 4, alignItems: "center" }}>
                  <a href="#cta" className="sans" style={{
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "#1a1a1a", textDecoration: "none",
                    borderBottom: "1.5px solid #1a1a1a", paddingBottom: 3,
                  }}>Batafsil</a>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E5E0D8", padding: "44px 40px" }}>
                <p className="sans" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: 28 }}>Nimalar kiradi</p>
                {["Auditoriya tahlili", "A/B testing", "Haftalik hisobot", "Dedicated manager", "ROI kafolati"].map((f, fi) => (
                  <div key={fi} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 0",
                    borderBottom: fi < 4 ? "1px solid #F0EDE8" : "none",
                  }}>
                    <div style={{ width: 20, height: 20, border: "1.5px solid #C8001A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: 6, height: 6, background: "#C8001A", borderRadius: "50%" }} />
                    </div>
                    <span className="sans" style={{ fontSize: 14, color: "#333", fontWeight: 400 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CASES ── */}
      <section id="cases" style={{ padding: "100px 56px", background: "#fff", borderBottom: "1px solid #E5E0D8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
            <div>
              <p className="sans" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8001A", marginBottom: 10 }}>Portfolio</p>
              <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: "#1a1a1a" }}>Muvaffaqiyatli Keyslar</h2>
            </div>
            <a href="#" className="sans" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", textDecoration: "none", borderBottom: "1px solid #D8D3CC", paddingBottom: 2 }}>
              Hammasini ko'rish →
            </a>
          </div>
          <div style={{ borderTop: "1px solid #E5E0D8", marginBottom: 60 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {CASES.map((c, i) => (
              <div key={i} className="case-card">
                {/* image placeholder */}
                <div style={{
                  height: 280, background: i === 0 ? "#F5F0E8" : "#1a1a1a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div style={{
                    width: 120, height: 120,
                    border: `2px solid ${i === 0 ? "#D8D3CC" : "#333"}`,
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span className="serif" style={{ fontSize: 32, fontWeight: 900, color: i === 0 ? "#ccc" : "#333" }}>
                      {i + 1 < 10 ? "0" + (i + 1) : i + 1}
                    </span>
                  </div>
                  <span className="sans" style={{
                    position: "absolute", top: 20, left: 20,
                    background: "#C8001A", color: "#fff",
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                    padding: "5px 12px",
                  }}>{c.tag}</span>
                  <span className="sans" style={{
                    position: "absolute", bottom: 20, right: 20,
                    fontSize: 11, fontWeight: 500, color: i === 0 ? "#bbb" : "#444",
                    letterSpacing: "0.1em",
                  }}>{c.year}</span>
                </div>
                <div style={{ padding: "32px 32px 36px" }}>
                  <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.25 }}>{c.title}</h3>
                  <p className="sans" style={{ fontSize: 14, color: "#777", lineHeight: 1.7 }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid #E5E0D8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 100, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 100 }}>
              <p className="sans" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C8001A", marginBottom: 16 }}>Ustunligimiz</p>
              <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, color: "#1a1a1a", lineHeight: 1.1, marginBottom: 32 }}>
                Nima uchun<br />
                <span style={{ fontStyle: "italic", color: "#C8001A" }}>Adbloger?</span>
              </h2>
              <p className="sans" style={{ fontSize: 14, color: "#888", lineHeight: 1.75 }}>
                "Biz shunchaki agentlik emas — biz mijozlarimizning o'sishi uchun mas'ul bo'lgan strategik hamkormiz."
              </p>
              <p className="sans" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#C8001A", marginTop: 16, textTransform: "uppercase" }}>— Adbloger CEO</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {WHY.map((w, i) => (
                <div key={i} className="why-card">
                  <div className="why-n serif" style={{ fontSize: 64, fontWeight: 900, color: "#F0EDE8", lineHeight: 1, marginBottom: 20, letterSpacing: "-0.04em", transition: "color .25s" }}>{w.n}</div>
                  <h4 className="why-h sans" style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a", marginBottom: 10, transition: "color .25s" }}>{w.h}</h4>
                  <p className="why-p sans" style={{ fontSize: 14, color: "#777", lineHeight: 1.7, transition: "color .25s" }}>{w.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" style={{ padding: "100px 56px", background: "#1a1a1a" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p className="sans" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C8001A", marginBottom: 20 }}>Boshlang</p>
          <h2 className="serif" style={{
            fontSize: "clamp(32px,5vw,60px)", fontWeight: 900,
            color: "#fff", marginBottom: 16, lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}>
            O'sishni bugun<br />
            <span style={{ fontStyle: "italic", color: "#C8001A" }}>boshlang.</span>
          </h2>
          <p className="sans" style={{ fontSize: 15, color: "#666", marginBottom: 56, lineHeight: 1.75 }}>
            Ma'lumot qoldiring, biz sizga 15 daqiqada "Killer-Strategy" taklif qilamiz.
          </p>

          {sent ? (
            <div style={{ padding: "48px", background: "#0f0f0f", borderLeft: "3px solid #C8001A", textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 48, color: "#C8001A", marginBottom: 12 }}>✓</div>
              <p className="sans" style={{ color: "#888", fontSize: 15 }}>Arizangiz qabul qilindi! 15 daqiqa ichida bog'lanamiz.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input className="inp" type="text" placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)} />
                <input className="inp" type="tel" placeholder="+998 __ ___ __ __" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <button className="btn-main" onClick={() => { if (name && phone) setSent(true); }}>
                Strategiyani Olish →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "28px 56px", background: "#111",
        borderTop: "1px solid #222",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, background: "#C8001A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, background: "#fff" }} />
          </div>
          <span className="sans" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444" }}>Adbloger Agency</span>
        </div>
        <span className="sans" style={{ fontSize: 11, color: "#ffffff", letterSpacing: "0.08em" }}>© 2024 — Barcha huquqlar himoyalangan</span>
      </footer>
    </div>
  );
}
