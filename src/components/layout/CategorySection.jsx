import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuLayoutGrid, LuLaptop, LuSparkles, LuSmile,
  LuUtensils, LuDumbbell, LuPlane, LuBriefcase,
  LuGamepad2, LuBook, LuMusic, LuChevronLeft, LuChevronRight,
} from "react-icons/lu";

const CATEGORIES = [
  { id: "all",       label: "Barchasi",     Icon: LuLayoutGrid, count: 500,  color: "#dc2626" },
  { id: "tech",      label: "Texnologiya",  Icon: LuLaptop,     count: 87,   color: "#2563eb" },
  { id: "lifestyle", label: "Lifestyle",    Icon: LuSparkles,   count: 120,  color: "#9333ea" },
  { id: "beauty",    label: "Go'zallik",    Icon: LuSmile,      count: 64,   color: "#ec4899" },
  { id: "food",      label: "Ovqat",        Icon: LuUtensils,   count: 45,   color: "#f59e0b" },
  { id: "sport",     label: "Sport",        Icon: LuDumbbell,   count: 52,   color: "#16a34a" },
  { id: "travel",    label: "Sayohat",      Icon: LuPlane,      count: 38,   color: "#0891b2" },
  { id: "business",  label: "Biznes",       Icon: LuBriefcase,  count: 71,   color: "#b45309" },
  { id: "gaming",    label: "Gaming",       Icon: LuGamepad2,   count: 33,   color: "#7c3aed" },
  { id: "education", label: "Ta'lim",       Icon: LuBook,       count: 58,   color: "#0f766e" },
  { id: "music",     label: "Musiqa",       Icon: LuMusic,      count: 29,   color: "#be123c" },
];

export default function CategorySection() {
  const [active, setActive]         = useState("all");
  const [canLeft, setCanLeft]       = useState(false);
  const [canRight, setCanRight]     = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const slide = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const handleClick = (id, label) => {
    setActive(id);
    const el = scrollRef.current;
    const btn = el?.querySelector(`[data-id="${id}"]`);
    if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

    if (id === "all") {
      navigate("/bloggers");
    } else {
      navigate(`/bloggers?category=${encodeURIComponent(label)}`);
    }
  };

  const activeItem = CATEGORIES.find(c => c.id === active);

  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #f1f5f9",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      position: "relative",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>

        {/* ── Left fade + arrow ── */}
        {canLeft && (
          <>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: 72, zIndex: 2, pointerEvents: "none",
              background: "linear-gradient(to right, #fff 40%, transparent)",
            }} />
            <button
              onClick={() => slide(-1)}
              style={{
                position: "absolute", left: 6, top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3, width: 30, height: 30,
                borderRadius: "50%", border: "1px solid #e5e7eb",
                background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                color: "#374151",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              <LuChevronLeft size={15} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* ── Right fade + arrow ── */}
        {canRight && (
          <>
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              width: 72, zIndex: 2, pointerEvents: "none",
              background: "linear-gradient(to left, #fff 40%, transparent)",
            }} />
            <button
              onClick={() => slide(1)}
              style={{
                position: "absolute", right: 6, top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3, width: 30, height: 30,
                borderRadius: "50%", border: "1px solid #e5e7eb",
                background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                color: "#374151",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              <LuChevronRight size={15} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* ── Scrollable row ── */}
        <div
          ref={scrollRef}
          style={{
            overflowX: "auto", overflowY: "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "0 16px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center",
            gap: 2, whiteSpace: "nowrap",
            padding: "6px 0",
          }}>
            {CATEGORIES.map(({ id, label, Icon, count, color }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  data-id={id}
                  onClick={() => handleClick(id, label)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "7px 14px",
                    borderRadius: 10,
                    border: isActive
                      ? `1.5px solid ${color}33`
                      : "1.5px solid transparent",
                    background: isActive ? `${color}0f` : "transparent",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.18s, border-color 0.18s, transform 0.15s",
                    transform: isActive ? "scale(1.0)" : "scale(1)",
                    outline: "none",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  {/* Icon wrapper */}
                  <span style={{
                    width: 26, height: 26,
                    borderRadius: 7,
                    background: isActive ? `${color}20` : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.18s",
                  }}>
                    <Icon
                      size={13}
                      style={{
                        color: isActive ? color : "#64748b",
                        transition: "color 0.18s",
                      }}
                      strokeWidth={2.2}
                    />
                  </span>

                  {/* Label */}
                  <span style={{
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? color : "#374151",
                    transition: "color 0.18s, font-weight 0.1s",
                  }}>
                    {label}
                  </span>

                  {/* Count badge */}
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 20,
                    background: isActive ? `${color}20` : "#f1f5f9",
                    color: isActive ? color : "#94a3b8",
                    transition: "background 0.18s, color 0.18s",
                    minWidth: 22, textAlign: "center",
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active indicator bar ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 2, overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${activeItem?.color ?? "#dc2626"}66, transparent)`,
            transition: "background 0.3s",
          }} />
        </div>

      </div>

      {/* hide scrollbar for webkit */}
      <style>{`
        div[style*="overflowX: auto"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
