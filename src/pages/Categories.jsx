import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SEO, { breadcrumbSchema } from "../components/SEO";
import {
  LuTag, LuSearch, LuUsers, LuArrowRight,
  LuTrendingUp, LuX, LuSparkles, LuFlame,
  LuChevronRight,
} from "react-icons/lu";
import { ROUTE_PATHS } from "../config/constants";
import { CATEGORY_LABEL, CATEGORY_EMOJI as CAT_EMOJI_MAP } from "../config/categories";
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
      background: "linear-gradient(90deg,rgba(220,38,38,0.06) 25%,rgba(220,38,38,0.12) 50%,rgba(220,38,38,0.06) 75%)",
      backgroundSize: "200% 100%", animation: "sk 1.5s infinite",
    }} />
  );
}

function getUzName(cat) {
  return CATEGORY_LABEL[cat.name] ?? cat.name;
}

function getEmoji(cat) {
  if (cat.icon && cat.icon.length <= 4) return cat.icon;
  return CAT_EMOJI_MAP[cat.name] || "📌";
}

/* ── Bar width % ── */
function barWidth(count, max) {
  if (!max) return 0;
  return Math.max(4, Math.round((count / max) * 100));
}

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBloggers, setTotalBloggers] = useState(0);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, blogRes] = await Promise.all([
        api.get("/categories"),
        api.get("/bloggers"),
      ]);
      const cats = catRes.data.data || [];
      const bloggers = blogRes.data.data || [];

      /* Har bir kategoriya uchun blogger soni (barcha kategoriyalarini hisobga olib) */
      const countMap = {};
      bloggers.forEach(b => {
        (b.categories || []).forEach(catName => {
          if (catName) countMap[catName] = (countMap[catName] || 0) + 1;
        });
      });

      const enriched = cats.map(cat => ({
        ...cat,
        bloggerCount: countMap[cat.name] || 0,
      }));

      setCategories(enriched);
      setTotalBloggers(bloggers.length);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = categories.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    getUzName(c).toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const maxCount = Math.max(...categories.map(c => c.bloggerCount || 0), 1);
  const topCategories = [...categories]
    .sort((a, b) => (b.bloggerCount || 0) - (a.bloggerCount || 0))
    .slice(0, 6);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fafafa", minHeight: "100vh" }}>
      <SEO
        title="Kategoriyalar — O'z bloggeringizni toping"
        description="Moda, oziq-ovqat, sport, texnologiya, go'zallik va 20+ kategoriyada bloggerni toping. ADBlogger platformasida yo'nalishingizga mos influencerni tanlang."
        canonical="/kategoriyalar"
        schema={breadcrumbSchema([
          { name: "Bosh sahifa", path: "/" },
          { name: "Kategoriyalar", path: "/kategoriyalar" },
        ])}
      />

      {/* ══════ HERO ══════ */}
      <section style={{
        background: "linear-gradient(145deg,#1a0000 0%,#7f1d1d 35%,#dc2626 70%,#b91c1c 100%)",
        padding: "90px 32px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
        {/* glow blobs */}
        <div style={{ position: "absolute", top: -180, right: -100, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -160, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,0,0,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            fontSize: 10.5, fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", padding: "6px 18px",
            borderRadius: 100, marginBottom: 28, color: "#fecaca",
          }}>
            <LuFlame size={12} /> Kategoriyalar
          </div>

          <h1 style={{
            fontFamily: "'Syne','Inter',sans-serif",
            fontSize: "clamp(32px,5.5vw,60px)", fontWeight: 900,
            color: "#fff", lineHeight: 1.05, margin: "0 0 20px",
            letterSpacing: "-2px",
          }}>
            O'z bloggeringizni{" "}
            <span style={{
              background: "linear-gradient(90deg,#fbbf24,#fde68a,#fbbf24)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundSize: "200%", animation: "shimmer 3s linear infinite",
            }}>
              toping
            </span>
          </h1>

          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.65)",
            lineHeight: 1.9, margin: "0 0 50px", maxWidth: 500, marginLeft: "auto", marginRight: "auto",
          }}>
            {loading ? "..." : `${totalBloggers}+`} bloger{" "}
            {loading ? "..." : `${categories.length}`} ta yo'nalishda —
            brendingizga mos influencerni bir zumda toping.
          </p>

          {/* Stats row */}
          <div style={{
            display: "inline-flex", alignItems: "stretch",
            background: "rgba(0,0,0,0.25)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20, overflow: "hidden",
          }}>
            {[
              { Icon: LuUsers,      value: loading ? "—" : `${totalBloggers}+`,        label: "Bloger",       color: "#fbbf24" },
              { Icon: LuTag,        value: loading ? "—" : `${categories.length}`,     label: "Kategoriya",   color: "#86efac" },
              { Icon: LuTrendingUp, value: "4+",                                        label: "Platforma",    color: "#93c5fd" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "20px 32px",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <s.Icon size={15} style={{ color: s.color }} />
                <span style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.5px" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SEARCH BAR ══════ */}
      <section style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "22px 32px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: "#fef2f2", border: "1.5px solid #fecaca",
            borderRadius: 14, overflow: "hidden",
            boxShadow: "0 2px 12px rgba(220,38,38,0.06)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "#dc2626";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.12)";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "#fecaca";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(220,38,38,0.06)";
            }}
          >
            <LuSearch size={15} style={{ marginLeft: 16, color: "#dc2626", flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kategoriya qidirish..."
              style={{
                flex: 1, border: "none", background: "transparent",
                padding: "14px 12px", fontSize: 14,
                color: "#111827", outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "0 16px", color: "#dc2626",
                  display: "flex", alignItems: "center",
                }}
              >
                <LuX size={14} />
              </button>
            )}
          </div>
          {search && (
            <p style={{ fontSize: 12, color: "#dc2626", marginTop: 8, textAlign: "center", fontWeight: 600 }}>
              {filtered.length} ta kategoriya topildi
            </p>
          )}
        </div>
      </section>

      {/* ══════ STATISTICS PANEL ══════ */}
      {!loading && categories.length > 0 && !search && (
        <section style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "36px 32px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <LuTrendingUp size={16} style={{ color: "#fff" }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>Kategoriya statistikasi</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Har bir yo'nalishda nechta blogger bor</div>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 14,
            }}>
              {topCategories.map((cat, i) => {
                const emoji = getEmoji(cat);
                const pct = barWidth(cat.bloggerCount, maxCount);
                const isTop = i === 0;
                return (
                  <button
                    key={cat._id}
                    onClick={() => navigate(`${ROUTE_PATHS.BLOGGERS}?category=${encodeURIComponent(getUzName(cat))}`)}
                    style={{
                      background: isTop ? "linear-gradient(135deg,#fef2f2,#fff5f5)" : "#fafafa",
                      border: isTop ? "1.5px solid #fecaca" : "1.5px solid #f3f4f6",
                      borderRadius: 14, padding: "14px 16px",
                      textAlign: "left", cursor: "pointer",
                      transition: "all 0.2s", outline: "none",
                      width: "100%",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#fca5a5";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,38,38,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = isTop ? "#fecaca" : "#f3f4f6";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{emoji}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{getUzName(cat)}</span>
                        {isTop && (
                          <span style={{
                            fontSize: 9, fontWeight: 800, letterSpacing: "1px",
                            background: "#dc2626", color: "#fff",
                            padding: "2px 8px", borderRadius: 6, textTransform: "uppercase",
                          }}>TOP</span>
                        )}
                      </div>
                      <span style={{
                        fontSize: 13, fontWeight: 800,
                        color: isTop ? "#dc2626" : "#374151",
                      }}>
                        {cat.bloggerCount}
                      </span>
                    </div>
                    {/* bar */}
                    <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`,
                        background: isTop
                          ? "linear-gradient(90deg,#dc2626,#f87171)"
                          : "linear-gradient(90deg,#6b7280,#9ca3af)",
                        borderRadius: 99,
                        transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                      {cat.bloggerCount} ta blogger
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════ CATEGORY GRID ══════ */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#fef2f2", color: "#dc2626",
              border: "1px solid #fecaca",
              fontSize: 10.5, fontWeight: 700, letterSpacing: "1.8px",
              textTransform: "uppercase", padding: "5px 14px",
              borderRadius: 100, marginBottom: 10,
            }}>
              <LuFlame size={11} /> Barcha yo'nalishlar
            </div>
            <h2 style={{
              fontFamily: "'Syne','Inter',sans-serif",
              fontSize: "clamp(22px,3vw,30px)", fontWeight: 900,
              color: "#111827", margin: 0, letterSpacing: "-0.5px",
            }}>
              {loading ? "Yuklanmoqda..." : `${filtered.length} ta kategoriya`}
            </h2>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 24, overflow: "hidden",
                border: "1.5px solid #fee2e2", padding: "28px 24px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#fef2f2,#fee2e2)" }} />
                  <Sk w={70} h={24} r={12} />
                </div>
                <Sk h={16} w="60%" r={8} mb={10} />
                <Sk h={13} r={6} mb={6} />
                <Sk h={13} w="80%" r={6} mb={20} />
                <Sk h={36} r={10} />
              </div>
            ))}
          </div>

        ) : filtered.length === 0 && search ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: "#fef2f2", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 32,
            }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
              Kategoriya topilmadi
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
              "<strong>{search}</strong>" bo'yicha natija yo'q
            </p>
          </div>

        ) : !loading && categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
              Kategoriyalar mavjud emas
            </h3>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              Hozircha hech qanday kategoriya qo'shilmagan
            </p>
          </div>

        ) : (
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {filtered.map((cat) => {
              const isHov = hovered === cat._id;
              const emoji = getEmoji(cat);
              const count = cat.bloggerCount || 0;
              const pct = barWidth(count, maxCount);

              return (
                <button
                  key={cat._id}
                  onClick={() => navigate(`${ROUTE_PATHS.BLOGGERS}?category=${encodeURIComponent(getUzName(cat))}`)}
                  onMouseEnter={() => setHovered(cat._id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: "#fff",
                    border: isHov ? "1.5px solid #fca5a5" : "1.5px solid #f3f4f6",
                    borderRadius: 24,
                    padding: "26px 22px 20px",
                    textAlign: "left",
                    cursor: "pointer",
                    boxShadow: isHov
                      ? "0 20px 50px rgba(220,38,38,0.12)"
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
                      position: "absolute", top: 0, right: 22,
                      background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                      color: "#fff", fontSize: 9, fontWeight: 800,
                      letterSpacing: "1px", padding: "4px 12px",
                      borderRadius: "0 0 10px 10px",
                    }}>
                      <LuSparkles size={8} style={{ display: "inline", marginRight: 3 }} />
                      MASHHUR
                    </div>
                  )}

                  {/* Red accent top bar */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: isHov ? "linear-gradient(90deg,#dc2626,#f87171)" : "transparent",
                    transition: "background 0.3s",
                  }} />

                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 15,
                      background: isHov ? "linear-gradient(135deg,#fef2f2,#fee2e2)" : "linear-gradient(135deg,#f9fafb,#f3f4f6)",
                      border: isHov ? "1.5px solid #fecaca" : "1.5px solid #e5e7eb",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                      boxShadow: isHov ? "0 4px 16px rgba(220,38,38,0.15)" : "none",
                      transition: "all 0.25s",
                    }}>
                      {emoji}
                    </div>

                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "5px 12px", borderRadius: 20,
                      background: isHov ? "#fef2f2" : "#f3f4f6",
                      color: isHov ? "#dc2626" : "#6b7280",
                      border: isHov ? "1px solid #fecaca" : "1px solid transparent",
                      transition: "all 0.2s",
                    }}>
                      {count} bloger
                    </span>
                  </div>

                  {/* Name */}
                  <div style={{
                    fontSize: 16, fontWeight: 800,
                    color: "#111827", marginBottom: 6,
                    fontFamily: "'Syne','Inter',sans-serif",
                  }}>
                    {getUzName(cat)}
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: 12.5, color: "#6b7280",
                    lineHeight: 1.65, marginBottom: 18,
                    minHeight: 38,
                  }}>
                    {cat.description || "Ushbu kategoriyada blogerlar mavjud"}
                  </div>

                  {/* Mini bar chart */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ height: 5, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: isHov ? `${pct}%` : `${Math.max(pct - 8, 4)}%`,
                        background: "linear-gradient(90deg,#dc2626,#f87171)",
                        borderRadius: 99,
                        transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
                      }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 4 }}>
                      {pct}% — jami bloggerlardan
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                          <LuUsers size={11} /> {count} ta
                        </span>
                        {cat.adCount > 0 && (
                          <span style={{ fontSize: 11.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                            <LuTag size={11} /> {cat.adCount} e'lon
                          </span>
                        )}
                      </div>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: 12.5, fontWeight: 700,
                        color: isHov ? "#dc2626" : "#9ca3af",
                        transition: "color 0.2s",
                      }}>
                        Ko'rish
                        <LuChevronRight
                          size={14}
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
      </section>

      {/* ══════ CTA ══════ */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(145deg,#1a0000 0%,#7f1d1d 40%,#dc2626 80%,#b91c1c 100%)",
          borderRadius: 28, padding: "56px 48px",
          position: "relative", overflow: "hidden", textAlign: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

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
              fontWeight: 900, fontSize: "clamp(24px,3.5vw,42px)",
              color: "#fff", margin: "0 0 14px", lineHeight: 1.08,
            }}>
              O'z bloggeringizni<br />
              <span style={{
                background: "linear-gradient(90deg,#fbbf24,#fde68a)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                hoziroq toping!
              </span>
            </h2>

            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 auto 36px", maxWidth: 420, lineHeight: 1.8 }}>
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
                boxShadow: "0 6px 28px rgba(251,191,36,0.35)",
                transition: "all .25s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 14px 40px rgba(251,191,36,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(251,191,36,0.35)";
              }}
            >
              Barcha blogerlar <LuArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes sk {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        @keyframes shimmer {
          0%   { background-position: 0%   50% }
          100% { background-position: 200% 50% }
        }
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
