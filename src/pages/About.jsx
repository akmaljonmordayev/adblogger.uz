import { useEffect, useRef, useState } from "react";
import SEO, { breadcrumbSchema } from "../components/SEO";
import { Link } from "react-router-dom";
import {
  LuTarget, LuZap, LuShield, LuUsers, LuTrendingUp,
  LuAward, LuStar, LuArrowRight, LuSparkles, LuRocket,
  LuHandshake, LuEye, LuBuilding2, LuHeart, LuGlobe,
  LuCircleCheck, LuInstagram, LuYoutube, LuMessageCircle,
} from "react-icons/lu";

/* ── Syne font (same as Header) ── */
if (!document.getElementById("about-fonts")) {
  const l = document.createElement("link");
  l.id = "about-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

/* ── Animated counter ── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true;
          let v = 0;
          const step = end / (duration / 16);
          const t = setInterval(() => {
            v += step;
            if (v >= end) { setVal(end); clearInterval(t); }
            else setVal(Math.floor(v));
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Fade-in on scroll ── */
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); ob.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ${delay}s cubic-bezier(.22,1,.36,1), transform 0.7s ${delay}s cubic-bezier(.22,1,.36,1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Data ── */
const STATS = [
  { end: 500,  suffix: "+",  label: "Tasdiqlangan bloger",  Icon: LuUsers,     color: "#dc2626", bg: "#fef2f2" },
  { end: 12,   suffix: "M+", label: "Faol auditoriya",      Icon: LuEye,       color: "#2563eb", bg: "#eff6ff" },
  { end: 200,  suffix: "+",  label: "Ishonchli brend",      Icon: LuBuilding2, color: "#7c3aed", bg: "#f5f3ff" },
  { end: 98,   suffix: "%",  label: "Mijoz mamnuniyati",    Icon: LuStar,      color: "#d97706", bg: "#fffbeb" },
];

const VALUES = [
  {
    Icon: LuTarget, color: "#dc2626", bg: "#fef2f2",
    title: "Aniqlik",
    desc: "Har bir qarorimiz ma'lumotlar asosida qabul qilinadi. Taxmin emas — aniq strategiya.",
  },
  {
    Icon: LuZap, color: "#2563eb", bg: "#eff6ff",
    title: "Tezlik",
    desc: "Bozor o'zgaradi — biz ham. Mijozlarimiz doim raqobatchilardan bir qadam oldinda bo'ladi.",
  },
  {
    Icon: LuShield, color: "#7c3aed", bg: "#f5f3ff",
    title: "Ishonch",
    desc: "To'liq shaffoflik va ochiqlik. Har bir so'm qayerga sarflanayotgani aniq ko'rinadi.",
  },
  {
    Icon: LuHeart, color: "#d97706", bg: "#fffbeb",
    title: "G'amxo'rlik",
    desc: "Siz uchun nafaqat ish qilamiz — sizning o'sishingiz uchun mas'uliyat olamiz.",
  },
];

const TEAM = [
  { name: "Asilbek Raximov", role: "CEO & Asoschisi", initial: "AR", color: "#dc2626", bg: "#fef2f2", exp: "8+ yil tajriba" },
  { name: "Nilufar Yusupova", role: "Marketing Director", initial: "NY", color: "#2563eb", bg: "#eff6ff", exp: "6+ yil tajriba" },
  { name: "Bobur Xasanov",   role: "Head of Technology", initial: "BX", color: "#7c3aed", bg: "#f5f3ff", exp: "7+ yil tajriba" },
  { name: "Zulfiya Karimova", role: "Content Strategist", initial: "ZK", color: "#d97706", bg: "#fffbeb", exp: "5+ yil tajriba" },
];

const MILESTONES = [
  { year: "2021", title: "Kompaniya tashkil etildi", desc: "Toshkentda 3 kishi bilan boshlangan startup." },
  { year: "2022", title: "100+ bloger", desc: "Platformamizga 100 dan ortiq bloger qo'shildi." },
  { year: "2023", title: "1 mln+ auditoriya", desc: "Platforma orqali 1 million auditoriyaga yetib borildi." },
  { year: "2024", title: "500+ bloger, 200+ brend", desc: "O'zbekistonning yetakchi influencer platformasiga aylandik." },
];

export default function About() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#111827" }}>
      <SEO
        title="Biz Haqimizda — ADBlogger Jamoasi va Missiya"
        description="ADBlogger — O'zbekistonning eng yirik blogger va reklama ekotizimi. Bizning missiyamiz, qadriyatlarimiz va jamoamiz haqida batafsil ma'lumot."
        canonical="/about"
        schema={breadcrumbSchema([{ name: "Bosh sahifa", path: "/" }, { name: "Biz haqimizda", path: "/about" }])}
      />

      {/* ══ HERO ══ */}
      <section style={{
        background: "linear-gradient(135deg, #fff 0%, #fef2f2 50%, #fff 100%)",
        borderRadius: 20,
        padding: "72px 48px 80px",
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
        border: "1px solid #fecaca",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 680 }}>
          {/* Label */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#fef2f2", color: "#dc2626",
            border: "1px solid #fecaca",
            fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", padding: "5px 14px",
            borderRadius: 100, marginBottom: 24,
          }}>
            <LuSparkles size={11} strokeWidth={2.5} />
            Biz haqimizda
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-1px",
            color: "#111827",
            marginBottom: 24,
          }}>
            O'zbekistondagi{" "}
            <span style={{
              color: "#dc2626",
              position: "relative",
              display: "inline-block",
            }}>
              #1 influencer
              <svg
                viewBox="0 0 200 12"
                style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 8 }}
                preserveAspectRatio="none"
              >
                <path d="M2 8 Q50 2 100 7 Q150 12 198 5" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </span>{" "}
            platformasi
          </h1>

          <p style={{
            fontSize: 17, lineHeight: 1.75, color: "#6b7280",
            marginBottom: 36, maxWidth: 560,
          }}>
            2021-yildan beri brendlar va blogerlarni bir-biriga bog'lab, o'zbek raqamli marketingini yangi bosqichga olib chiqamiz. Biz shunchaki platforma emas — sizning o'sishingiz uchun mas'ul strategik hamkorligingiz.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link
              to="/bloggers"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#fff", textDecoration: "none",
                padding: "13px 26px", borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(220,38,38,0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,38,38,0.35)";
              }}
            >
              Blogerlarni ko'rish <LuArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", color: "#374151",
                textDecoration: "none",
                padding: "13px 26px", borderRadius: 12,
                fontSize: 14, fontWeight: 600,
                border: "1.5px solid #e5e7eb",
                transition: "border-color 0.18s, color 0.18s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#dc2626";
                e.currentTarget.style.color = "#dc2626";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
              }}
            >
              Bog'lanish
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <FadeIn>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16, marginBottom: 32,
        }}>
          {STATS.map(({ end, suffix, label, Icon, color, bg }) => (
            <div key={label} style={{
              background: "#fff",
              border: "1px solid #f3f4f6",
              borderRadius: 16,
              padding: "28px 24px",
              display: "flex", alignItems: "center", gap: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: bg, color,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 30, fontWeight: 800,
                  color: "#111827", lineHeight: 1,
                }}>
                  <Counter end={end} suffix={suffix} />
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginTop: 4 }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ══ MISSION ══ */}
      <FadeIn delay={0.1}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 20, marginBottom: 32,
        }}
          className="about-grid-2"
        >
          {/* Mission */}
          <div style={{
            background: "#111827", borderRadius: 20,
            padding: "44px 40px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 180, height: 180, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "rgba(220,38,38,0.15)", color: "#ef4444",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
            }}>
              <LuRocket size={22} />
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 24, fontWeight: 800,
              color: "#fff", marginBottom: 14, lineHeight: 1.2,
            }}>
              Bizning missiyamiz
            </h2>
            <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.75 }}>
              O'zbekiston brendlarini to'g'ri auditoriyaga yetkazadigan eng ishonchli va qulay influencer marketing platformasini yaratish. Har bir hamkorlik o'lchab bo'ladigan natija berishi kerak.
            </p>
          </div>

          {/* Vision */}
          <div style={{
            background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            borderRadius: 20,
            padding: "44px 40px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", bottom: -40, right: -40,
              width: 180, height: 180, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }} />
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "rgba(255,255,255,0.15)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
            }}>
              <LuGlobe size={22} />
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 24, fontWeight: 800,
              color: "#fff", marginBottom: 14, lineHeight: 1.2,
            }}>
              Bizning vizyon
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.75 }}>
              2026 yilga kelib Markaziy Osiyodagi yetakchi influencer ekotizimiga aylanish. Blogerlar, brendlar va auditoriya uchun yangi standartlar yaratish.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ══ VALUES ══ */}
      <FadeIn delay={0.1}>
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1px solid #f3f4f6",
          padding: "48px 40px", marginBottom: 32,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "#fef2f2", color: "#dc2626",
              border: "1px solid #fecaca",
              fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", padding: "5px 14px",
              borderRadius: 100, marginBottom: 16,
            }}>
              <LuAward size={11} strokeWidth={2.5} />
              Qadriyatlarimiz
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800, color: "#111827",
              letterSpacing: "-0.5px",
            }}>
              Biz nima asosida ishlaymiz
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}>
            {VALUES.map(({ Icon, color, bg, title, desc }) => (
              <div key={title} style={{
                padding: "28px 24px",
                borderRadius: 16,
                border: "1.5px solid #f3f4f6",
                transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color + "40";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#f3f4f6";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: bg, color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 17, fontWeight: 800,
                  color: "#111827", marginBottom: 8,
                }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ══ TIMELINE ══ */}
      <FadeIn delay={0.1}>
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1px solid #f3f4f6",
          padding: "48px 40px", marginBottom: 32,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "#eff6ff", color: "#2563eb",
              border: "1px solid #bfdbfe",
              fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", padding: "5px 14px",
              borderRadius: 100, marginBottom: 16,
            }}>
              <LuTrendingUp size={11} strokeWidth={2.5} />
              Tariximiz
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800, color: "#111827",
              letterSpacing: "-0.5px",
            }}>
              O'sish yo'limiz
            </h2>
          </div>

          <div style={{ position: "relative" }}>
            {/* Line */}
            <div style={{
              position: "absolute", left: 23, top: 0, bottom: 0,
              width: 2, background: "linear-gradient(180deg, #dc2626 0%, #fecaca 100%)",
              borderRadius: 2,
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {MILESTONES.map(({ year, title, desc }, i) => (
                <div key={year} style={{
                  display: "flex", gap: 24,
                  paddingBottom: i < MILESTONES.length - 1 ? 36 : 0,
                  position: "relative",
                }}>
                  {/* Dot */}
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    borderRadius: "50%",
                    background: i === MILESTONES.length - 1
                      ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                      : "#fff",
                    border: i === MILESTONES.length - 1
                      ? "none"
                      : "2px solid #fecaca",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: i === MILESTONES.length - 1
                      ? "0 4px 12px rgba(220,38,38,0.35)"
                      : "none",
                    zIndex: 1, position: "relative",
                  }}>
                    <LuCircleCheck
                      size={20}
                      style={{ color: i === MILESTONES.length - 1 ? "#fff" : "#dc2626" }}
                    />
                  </div>

                  <div style={{ paddingTop: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: "#dc2626", letterSpacing: "1.5px",
                      textTransform: "uppercase",
                    }}>
                      {year}
                    </span>
                    <h4 style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 17, fontWeight: 800,
                      color: "#111827", marginTop: 2, marginBottom: 6,
                    }}>
                      {title}
                    </h4>
                    <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ══ TEAM ══ */}
      <FadeIn delay={0.1}>
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1px solid #f3f4f6",
          padding: "48px 40px", marginBottom: 32,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "#f5f3ff", color: "#7c3aed",
              border: "1px solid #ddd6fe",
              fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", padding: "5px 14px",
              borderRadius: 100, marginBottom: 16,
            }}>
              <LuUsers size={11} strokeWidth={2.5} />
              Jamoa
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800, color: "#111827",
              letterSpacing: "-0.5px",
            }}>
              Bizning mutaxassislar
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}>
            {TEAM.map(({ name, role, initial, color, bg, exp }) => (
              <div key={name} style={{
                padding: "28px 20px",
                borderRadius: 16,
                border: "1.5px solid #f3f4f6",
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = color + "30";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#f3f4f6";
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: bg, color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 22, fontWeight: 800,
                  border: `2px solid ${color}25`,
                }}>
                  {initial}
                </div>
                <h4 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 15, fontWeight: 800,
                  color: "#111827", marginBottom: 4,
                }}>
                  {name}
                </h4>
                <p style={{ fontSize: 12.5, color: "#dc2626", fontWeight: 600, marginBottom: 8 }}>
                  {role}
                </p>
                <span style={{
                  display: "inline-block",
                  background: bg, color,
                  fontSize: 11, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 100,
                }}>
                  {exp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ══ PLATFORMS ══ */}
      <FadeIn delay={0.1}>
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1px solid #f3f4f6",
          padding: "40px",
          marginBottom: 32,
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}>
          <p style={{
            textAlign: "center",
            fontSize: 12, fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: "#9ca3af", marginBottom: 24,
          }}>
            Qo'llab-quvvatlanadigan platformalar
          </p>
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: 32, flexWrap: "wrap",
          }}>
            {[
              { Icon: LuInstagram, label: "Instagram", color: "#e1306c" },
              { Icon: LuYoutube,   label: "YouTube",   color: "#ff0000" },
              { Icon: LuMessageCircle, label: "Telegram", color: "#0088cc" },
            ].map(({ Icon, label, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 24px", borderRadius: 12,
                border: "1.5px solid #f3f4f6",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color + "50";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#f3f4f6";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <Icon size={22} style={{ color }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ══ CTA ══ */}
      <FadeIn delay={0.1}>
        <div style={{
          background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          borderRadius: 20,
          padding: "56px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, left: "50%",
            transform: "translateX(-50%)",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(220,38,38,0.15)", color: "#ef4444",
            border: "1px solid rgba(220,38,38,0.25)",
            fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", padding: "5px 14px",
            borderRadius: 100, marginBottom: 24,
          }}>
            <LuHandshake size={11} strokeWidth={2.5} />
            Hamkorlik
          </div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800, color: "#fff",
            letterSpacing: "-0.5px", marginBottom: 16,
            position: "relative",
          }}>
            Bizning hamkorga aylaning
          </h2>

          <p style={{
            fontSize: 16, color: "#9ca3af", lineHeight: 1.75,
            marginBottom: 36, maxWidth: 480, margin: "0 auto 36px",
          }}>
            Bloger yoki brend bo'lishingizdan qat'iy nazar, biz siz uchun eng yaxshi natijani ta'minlaymiz.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/bloger-bolish"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#fff", textDecoration: "none",
                padding: "14px 28px", borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(220,38,38,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(220,38,38,0.4)";
              }}
            >
              Bloger bo'lish <LuArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.08)", color: "#fff",
                textDecoration: "none",
                padding: "14px 28px", borderRadius: 12,
                fontSize: 14, fontWeight: 600,
                border: "1.5px solid rgba(255,255,255,0.15)",
                transition: "background 0.18s, border-color 0.18s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Bog'lanish
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
