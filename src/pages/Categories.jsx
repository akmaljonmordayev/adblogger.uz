import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuTag, LuLaptop, LuSparkles, LuSmile,
  LuUtensils, LuDumbbell, LuPlane, LuBriefcase,
  LuGamepad2, LuBook, LuMusic, LuSearch,
  LuUsers, LuArrowRight, LuTrendingUp, LuX,
} from "react-icons/lu";
import { ROUTE_PATHS } from "../config/constants";

const CATEGORIES = [
  {
    id: "tech",
    label: "Texnologiya",
    Icon: LuLaptop,
    count: 87,
    color: "#2563eb",
    bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    description: "Gadjetlar, dasturlash, IT sohalari",
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    Icon: LuSparkles,
    count: 120,
    color: "#9333ea",
    bg: "linear-gradient(135deg, #a855f7, #7e22ce)",
    description: "Hayot tarzi, motivatsiya, shaxsiy rivojlanish",
  },
  {
    id: "beauty",
    label: "Go'zallik",
    Icon: LuSmile,
    count: 64,
    color: "#db2777",
    bg: "linear-gradient(135deg, #ec4899, #be185d)",
    description: "Makiyaj, parvarish, moda va stil",
  },
  {
    id: "food",
    label: "Ovqat",
    Icon: LuUtensils,
    count: 45,
    color: "#d97706",
    bg: "linear-gradient(135deg, #f59e0b, #b45309)",
    description: "Reseptlar, restoran sharhlar, taomlar",
  },
  {
    id: "sport",
    label: "Sport",
    Icon: LuDumbbell,
    count: 52,
    color: "#16a34a",
    bg: "linear-gradient(135deg, #22c55e, #15803d)",
    description: "Fitnes, jamoaviy sport, sog'lom turmush",
  },
  {
    id: "travel",
    label: "Sayohat",
    Icon: LuPlane,
    count: 38,
    color: "#0284c7",
    bg: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    description: "Dunyoni kashf qiling, sayohat maslahatlar",
  },
  {
    id: "business",
    label: "Biznes",
    Icon: LuBriefcase,
    count: 71,
    color: "#92400e",
    bg: "linear-gradient(135deg, #f97316, #9a3412)",
    description: "Tadbirkorlik, investitsiya, moliyaviy maslahat",
  },
  {
    id: "gaming",
    label: "Gaming",
    Icon: LuGamepad2,
    count: 33,
    color: "#6d28d9",
    bg: "linear-gradient(135deg, #8b5cf6, #5b21b6)",
    description: "Video o'yinlar, e-sport, stream",
  },
  {
    id: "education",
    label: "Ta'lim",
    Icon: LuBook,
    count: 58,
    color: "#0f766e",
    bg: "linear-gradient(135deg, #14b8a6, #0f766e)",
    description: "Kurslar, darslar, bilim va ko'nikmalar",
  },
  {
    id: "music",
    label: "Musiqa",
    Icon: LuMusic,
    count: 29,
    color: "#be123c",
    bg: "linear-gradient(135deg, #f43f5e, #9f1239)",
    description: "Qo'shiqchilar, musiqa janrlari, konsertlar",
  },
];

const totalBloggers = CATEGORIES.reduce((s, c) => s + c.count, 0);

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const filtered = CATEGORIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "44px 20px 40px", maxWidth: 600, margin: "0 auto" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#fef2f2", color: "#dc2626",
          fontSize: 11, fontWeight: 700, letterSpacing: "1px",
          padding: "5px 14px", borderRadius: 20, marginBottom: 20,
        }}>
          <LuTag size={11} /> KATEGORIYALAR
        </span>

        <h1 style={{
          fontSize: 36, fontWeight: 800, color: "#0f172a",
          lineHeight: 1.15, margin: "0 0 14px",
        }}>
          O'z nishingizni<br />
          <span style={{ color: "#dc2626" }}>toping va murojaat qiling</span>
        </h1>

        <p style={{ fontSize: 15.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 32px" }}>
          {totalBloggers}+ bloger {CATEGORIES.length} ta yo'nalishda sizning
          reklama kampaniyangizni olib borishga tayyor.
        </p>

        {/* Stats */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 0,
          background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          {[
            { Icon: LuUsers,      value: `${totalBloggers}+`, label: "Bloger",        color: "#dc2626" },
            { Icon: LuTag,        value: `${CATEGORIES.length}`,   label: "Kategoriya",  color: "#2563eb" },
            { Icon: LuTrendingUp, value: "4+",               label: "Platforma",    color: "#16a34a" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "14px 24px",
              borderRight: i < 2 ? "1.5px solid #e2e8f0" : "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <s.Icon size={14} style={{ color: s.color }} />
              <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ maxWidth: 480, margin: "0 auto 40px", padding: "0 20px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
          onFocus={e => {
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.08)";
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
          }}
        >
          <LuSearch size={15} style={{ marginLeft: 14, color: "#9ca3af", flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kategoriya qidirish..."
            style={{
              flex: 1, border: "none", background: "transparent",
              padding: "12px 10px", fontSize: 14,
              color: "#0f172a", outline: "none",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0 8px", color: "#9ca3af",
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

      {/* ── Grid ── */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 60px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 14, color: "#64748b" }}>
              "<strong style={{ color: "#0f172a" }}>{search}</strong>" bo'yicha kategoriya topilmadi
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}>
            {filtered.map((cat) => {
              const { Icon } = cat;
              const isHov = hovered === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(ROUTE_PATHS.BLOGGERS, { state: { category: cat.label } })}
                  onMouseEnter={() => setHovered(cat.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: "#fff",
                    border: isHov ? `1.5px solid ${cat.color}55` : "1.5px solid #e2e8f0",
                    borderRadius: 20,
                    padding: "24px 24px 20px",
                    textAlign: "left",
                    cursor: "pointer",
                    boxShadow: isHov
                      ? `0 8px 30px ${cat.color}18`
                      : "0 2px 12px rgba(0,0,0,0.05)",
                    transform: isHov ? "translateY(-2px)" : "translateY(0)",
                    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                    outline: "none",
                    width: "100%",
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    {/* Icon */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: cat.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 4px 14px ${cat.color}30`,
                      flexShrink: 0,
                    }}>
                      <Icon size={21} color="#fff" strokeWidth={1.8} />
                    </div>

                    {/* Count badge */}
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "4px 10px", borderRadius: 20,
                      background: `${cat.color}12`,
                      color: cat.color,
                    }}>
                      {cat.count} bloger
                    </span>
                  </div>

                  {/* Name */}
                  <div style={{
                    fontSize: 16, fontWeight: 800,
                    color: "#0f172a", marginBottom: 6,
                  }}>
                    {cat.label}
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: 13, color: "#64748b",
                    lineHeight: 1.55, marginBottom: 18,
                  }}>
                    {cat.description}
                  </div>

                  {/* CTA */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 13, fontWeight: 700,
                    color: isHov ? cat.color : "#94a3b8",
                    transition: "color 0.2s",
                  }}>
                    Blogerlarni ko'rish
                    <LuArrowRight
                      size={13}
                      strokeWidth={2.5}
                      style={{
                        transform: isHov ? "translateX(3px)" : "translateX(0)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
