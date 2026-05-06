import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SEO, { breadcrumbSchema } from "../components/SEO";
import {
  LuTag, LuSearch, LuUsers, LuArrowRight,
  LuTrendingUp, LuX, LuSparkles, LuFlame,
  LuLayoutGrid,
} from "react-icons/lu";
import { ROUTE_PATHS } from "../config/constants";
import api from "../services/api";

/* ── Fonts ── */
if (!document.getElementById("cat-fonts")) {
  const l = document.createElement("link");
  l.id = "cat-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Inter:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(l);
}

/* ── Skeleton ── */
function Sk({ w = "100%", h = 18, r = 8, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: "linear-gradient(90deg,#f1f5f9 25%,#e8eef4 50%,#f1f5f9 75%)",
      backgroundSize: "200% 100%", animation: "sk 1.5s infinite",
    }} />
  );
}

/* ── Fallback icon map (if no emoji in DB) ── */
const FALLBACK_EMOJIS = {
  texnologiya: "💻", technology: "💻",
  lifestyle: "✨", moda: "👗", fashion: "👗",
  "go'zallik": "💄", beauty: "💄",
  ovqat: "🍴", food: "🍴",
  sport: "⚽", fitness: "🏋️",
  sayohat: "✈️", travel: "✈️",
  biznes: "💼", business: "💼",
  gaming: "🎮", "o'yinlar": "🎮",
  "ta'lim": "📚", education: "📚",
  musiqa: "🎵", music: "🎵",
  fotografiya: "📸",
  san_at: "🎨",
};

function getEmoji(cat) {
  if (cat.icon && cat.icon.length <= 4) return cat.icon;
  const key = (cat.slug || cat.name || "").toLowerCase();
  return FALLBACK_EMOJIS[key] || "📌";
}

/* ── Pastel bg from hex color ── */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBloggers, setTotalBloggers] = useState(0);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      const data = res.data.data || [];
      setCategories(data);
      setTotalBloggers(data.reduce((s, c) => s + (c.bloggerCount || 0), 0));
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = categories.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
      <SEO
        title="Kategoriyalar — Blogger Reklama Yo'nalishlari"
        description="Moda, oziq-ovqat, sport, texnologiya, go'zallik va 20+ kategoriyada bloggerni toping. ADBlogger platformasida yo'nalishingizga mos influencerni tanlang."
        canonical="/categories"
        schema={breadcrumbSchema([
          { name: "Bosh sahifa", path: "/" },
          { name: "Kategoriyalar", path: "/categories" },
        ])}
      />

      {/* ══════ HERO ══════ */}
      <section style={{
        background: "linear-gradient(150deg,#060b18 0%,#0d1528 40%,#0a1020 100%)",
        padding: "80px 32px 72px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* bg grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.028) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        {/* glow blobs */}
        <div style={{ position: "absolute", top: -200, left: -200, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(220,38,38,0.13) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -200, right: -200, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(220,38,38,0.12)", color: "#fca5a5",
            border: "1px solid rgba(220,38,38,0.25)",
            fontSize: 10.5, fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", padding: "5px 16px",
            borderRadius: 100, marginBottom: 24,
          }}>
            <LuTag size={11} /> Kategoriyalar
          </div>

          <h1 style={{
            fontFamily: "'Syne', 'Inter', sans-serif",
            fontSize: "clamp(30px,5vw,54px)", fontWeight: 900,
            color: "#fff", lineHeight: 1.06, margin: "0 0 18px",
            letterSpacing: "-1.5px",
          }}>
            O'z nishingizni toping{" "}
            <span style={{
              background: "linear-gradient(90deg,#f87171,#fb923c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>va murojaat qiling</span>
          </h1>

          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: "0 0 48px" }}>
            {loading ? "..." : `${totalBloggers}+`} bloger{" "}
            {loading ? "..." : `${categories.length}`} ta yo'nalishda sizning
            reklama kampaniyangizni olib borishga tayyor.
          </p>

          {/* Stats chips */}
          <div style={{
            display: "inline-flex", alignItems: "stretch",
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 18, overflow: "hidden",
          }}>
            {[
              { Icon: LuUsers,      value: loading ? "..." : `${totalBloggers}+`, label: "Bloger",       color: "#f87171" },
              { Icon: LuTag,        value: loading ? "..." : `${categories.length}`, label: "Kategoriya", color: "#60a5fa" },
              { Icon: LuTrendingUp, value: "4+",                                   label: "Platforma",   color: "#4ade80" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "18px 28px",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              }}>
                <s.Icon size={14} style={{ color: s.color }} />
                <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>{s.value}</span>
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SEARCH ══════ */}
      <section style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "24px 32px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: "#f8fafc", border: "1.5px solid #e2e8f0",
            borderRadius: 14, overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.08)";
              e.currentTarget.style.background = "#fff";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              e.currentTarget.style.background = "#f8fafc";
            }}
          >
            <LuSearch size={15} style={{ marginLeft: 16, color: "#9ca3af", flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kategoriya qidirish..."
              style={{
                flex: 1, border: "none", background: "transparent",
                padding: "13px 12px", fontSize: 14,
                color: "#0f172a", outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0 14px", color: "#9ca3af",
                  display: "flex", alignItems: "center",
                }}
              >
                <LuX size={14} />
              </button>
            )}
          </div>
          {search && (
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, textAlign: "center" }}>
              {filtered.length} ta kategoriya topildi
            </p>
          )}
        </div>
      </section>

      {/* ══════ GRID ══════ */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(220,38,38,0.08)", color: "#dc2626",
              border: "1px solid rgba(220,38,38,0.15)",
              fontSize: 10.5, fontWeight: 700, letterSpacing: "1.8px",
              textTransform: "uppercase", padding: "5px 14px",
              borderRadius: 100, marginBottom: 10,
            }}>
              <LuFlame size={11} /> Barcha yo'nalishlar
            </div>
            <h2 style={{
              fontFamily: "'Syne','Inter',sans-serif",
              fontSize: "clamp(22px,3vw,32px)", fontWeight: 900,
              color: "#0f172a", margin: 0, letterSpacing: "-0.5px",
            }}>
              {loading ? "Yuklanmoqda..." : `${filtered.length} ta kategoriya`}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13 }}>
            <LuLayoutGrid size={15} /> Grid ko'rinish
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1.5px solid #f1f5f9", padding: "28px 24px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)" }} />
                  <Sk w={70} h={24} r={12} />
                </div>
                <Sk h={16} w="60%" r={8} mb={10} />
                <Sk h={13} r={6} mb={6} />
                <Sk h={13} w="80%" r={6} mb={20} />
                <Sk h={36} r={10} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: "#f1f5f9", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 32,
            }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
              Kategoriya topilmadi
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              "<strong>{search}</strong>" bo'yicha natija yo'q
            </p>
          </div>
        ) : (
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {filtered.map((cat) => {
              const isHov = hovered === cat._id;
              const emoji = getEmoji(cat);
              const color = cat.color || "#6366f1";
              const { r, g, b } = hexToRgb(color);
              return (
                <button
                  key={cat._id}
                  onClick={() => navigate(`${ROUTE_PATHS.BLOGGERS}?category=${encodeURIComponent(cat.slug || cat.name)}`)}
                  onMouseEnter={() => setHovered(cat._id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: "#fff",
                    border: isHov ? `1.5px solid ${color}55` : "1.5px solid #f1f5f9",
                    borderRadius: 24,
                    padding: "28px 24px 22px",
                    textAlign: "left",
                    cursor: "pointer",
                    boxShadow: isHov
                      ? `0 20px 50px rgba(${r},${g},${b},0.15)`
                      : "0 2px 14px rgba(0,0,0,0.04)",
                    transform: isHov ? "translateY(-6px)" : "translateY(0)",
                    transition: "transform 0.28s cubic-bezier(.34,1.56,.64,1), box-shadow 0.28s, border-color 0.2s",
                    outline: "none",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Featured badge */}
                  {cat.isFeatured && (
                    <div style={{
                      position: "absolute", top: 0, right: 24,
                      background: `linear-gradient(135deg,${color},${color}bb)`,
                      color: "#fff", fontSize: 9, fontWeight: 800,
                      letterSpacing: "1px", padding: "4px 12px",
                      borderRadius: "0 0 10px 10px",
                    }}>
                      <LuSparkles size={8} style={{ display: "inline", marginRight: 3 }} />
                      MASHHUR
                    </div>
                  )}

                  {/* Top row: icon + badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                    {/* Icon box */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                      border: `1.5px solid ${color}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, flexShrink: 0,
                      boxShadow: isHov ? `0 6px 18px rgba(${r},${g},${b},0.2)` : "none",
                      transition: "box-shadow 0.2s",
                    }}>
                      {emoji}
                    </div>

                    {/* Count badge */}
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "5px 12px", borderRadius: 20,
                      background: `rgba(${r},${g},${b},0.08)`,
                      color: color,
                      border: `1px solid rgba(${r},${g},${b},0.15)`,
                    }}>
                      {cat.bloggerCount || 0} bloger
                    </span>
                  </div>

                  {/* Name */}
                  <div style={{
                    fontSize: 16, fontWeight: 800,
                    color: "#0f172a", marginBottom: 8,
                    fontFamily: "'Syne','Inter',sans-serif",
                  }}>
                    {cat.name}
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: 13, color: "#64748b",
                    lineHeight: 1.6, marginBottom: 20,
                    minHeight: 40,
                  }}>
                    {cat.description || "Ushbu kategoriyada blogerlar mavjud"}
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: `1px solid ${color}18`, paddingTop: 16 }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 11.5, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                          <LuUsers size={11} /> {cat.bloggerCount || 0}
                        </span>
                        {cat.adCount > 0 && (
                          <span style={{ fontSize: 11.5, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                            <LuTag size={11} /> {cat.adCount} e'lon
                          </span>
                        )}
                      </div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: 12.5, fontWeight: 700,
                        color: isHov ? color : "#94a3b8",
                        transition: "color 0.2s",
                      }}>
                        Ko'rish
                        <LuArrowRight
                          size={13}
                          strokeWidth={2.5}
                          style={{
                            transform: isHov ? "translateX(4px)" : "translateX(0)",
                            transition: "transform 0.2s",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state when no categories at all */}
        {!loading && categories.length === 0 && !search && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
              Kategoriyalar mavjud emas
            </h3>
            <p style={{ fontSize: 14, color: "#64748b" }}>
              Hozircha hech qanday kategoriya qo'shilmagan
            </p>
          </div>
        )}
      </section>

      {/* ══════ CTA ══════ */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg,#7f1d1d 0%,#dc2626 50%,#b91c1c 100%)",
          borderRadius: 32, padding: "56px 52px",
          position: "relative", overflow: "hidden", textAlign: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: 100,
              padding: "6px 18px", fontSize: 10.5, fontWeight: 700,
              letterSpacing: "2px", color: "#fbbf24", textTransform: "uppercase", marginBottom: 20,
            }}>
              <LuSparkles size={11} /> Bloger toping
            </div>
            <h2 style={{
              fontFamily: "'Syne','Inter',sans-serif",
              fontWeight: 900, fontSize: "clamp(24px,3.5vw,40px)",
              color: "#fff", margin: "0 0 14px", lineHeight: 1.08,
            }}>
              Brendingizga mos bloger<br />
              <span style={{ background: "linear-gradient(90deg,#fbbf24,#fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                hoziroq topilsin!
              </span>
            </h2>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.55)", margin: "0 auto 36px", maxWidth: 420, lineHeight: 1.8 }}>
              Kategoriya tanlang va sizning auditoriyangizga mos influencer bilan bog'laning.
            </p>
            <button
              onClick={() => navigate(ROUTE_PATHS.BLOGGERS)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#fbbf24", color: "#78350f",
                fontWeight: 800, fontSize: 15,
                padding: "15px 38px", borderRadius: 14,
                border: "none", cursor: "pointer",
                boxShadow: "0 6px 28px rgba(251,191,36,0.4)",
                transition: "all .25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(251,191,36,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(251,191,36,0.4)"; }}
            >
              Barcha blogerlar <LuArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes sk { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @media(max-width:768px){
          .cat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
