import { useState, useRef, useEffect, useCallback } from "react";
import {
  LuSlidersHorizontal, LuRotateCcw, LuCheck, LuChevronDown,
  LuSearch, LuX, LuArrowRight,
} from "react-icons/lu";

/* ── Scrollbar style ── */
const SidebarStyles = () => (
  <style>{`
    .fs-scroll::-webkit-scrollbar { width: 3px; }
    .fs-scroll::-webkit-scrollbar-track { background: transparent; }
    .fs-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
    .fs-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    @keyframes fs-in {
      from { opacity: 0; transform: translateY(-6px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .fs-in { animation: fs-in 0.18s ease-out; }
  `}</style>
);

const CATEGORIES = [
  { id: "Texnologiya", emoji: "💻" },
  { id: "Lifestyle",   emoji: "🌿" },
  { id: "Go'zallik",  emoji: "✨" },
  { id: "Ovqat",      emoji: "🍕" },
  { id: "Sport",      emoji: "🏆" },
  { id: "Gaming",     emoji: "🎮" },
  { id: "Sayohat",    emoji: "✈️" },
  { id: "Ta'lim",     emoji: "📚" },
];

const PLATFORMS = [
  { id: "YouTube",   emoji: "▶️" },
  { id: "Instagram", emoji: "📸" },
  { id: "Telegram",  emoji: "📩" },
  { id: "TikTok",    emoji: "🎵" },
];

const SUBSCRIBER_RANGES = [
  "10K - 50K",
  "50K - 200K",
  "200K - 500K",
  "500K+",
];

/* ── Section label ── */
const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 800, letterSpacing: "0.9px",
    color: "#94a3b8", textTransform: "uppercase",
    marginBottom: 10,
  }}>
    {children}
  </div>
);

/* ── Tag toggle chip ── */
function Chip({ label, emoji, checked, onClick, wide = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 12px",
        width: wide ? "100%" : "calc(50% - 4px)",
        borderRadius: 10,
        border: checked ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
        background: checked ? "#fef2f2" : "#fff",
        cursor: "pointer", textAlign: "left",
        transition: "border-color 0.15s, background 0.15s",
        outline: "none",
        marginBottom: wide ? 6 : 0,
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
      <span style={{
        fontSize: 12.5, fontWeight: checked ? 700 : 500,
        color: checked ? "#dc2626" : "#374151",
        flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        transition: "color 0.15s",
      }}>
        {label}
      </span>
      {checked && (
        <span style={{
          width: 16, height: 16, borderRadius: "50%",
          background: "#dc2626",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <LuCheck size={9} color="#fff" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

/* ── Price slider ── */
const PRICE_MIN = 0;
const PRICE_MAX = 20_000_000;
const BARS = [3, 5, 8, 13, 18, 24, 30, 38, 42, 44, 40, 35, 28, 20, 14, 9, 6, 4, 3, 2];

function PriceSlider({ minVal, maxVal, onChange }) {
  const trackRef = useRef(null);
  const dragging = useRef(null);
  const toP = (v) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const valFromE = useCallback((e) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return 0;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.min(1, Math.max(0, (cx - r.left) / r.width));
    return Math.round((PRICE_MIN + ratio * (PRICE_MAX - PRICE_MIN)) / 100_000) * 100_000;
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return;
      const v = valFromE(e);
      if (dragging.current === "min") onChange({ min: Math.min(v, maxVal - 100_000), max: maxVal });
      else onChange({ min: minVal, max: Math.max(v, minVal + 100_000) });
    };
    const up = () => { dragging.current = null; };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [minVal, maxVal, valFromE, onChange]);

  const minP = toP(minVal), maxP = toP(maxVal);
  const fmt = (v) => (v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v);

  return (
    <div style={{ userSelect: "none" }}>
      {/* Histogram */}
      <div
        ref={trackRef}
        style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 40, marginBottom: 4 }}
      >
        {BARS.map((h, i) => {
          const pct = (i / BARS.length) * 100;
          const active = pct >= minP && pct <= maxP;
          return (
            <div key={i} style={{
              flex: 1, borderRadius: 3,
              height: `${(h / 44) * 100}%`,
              background: active ? "#dc2626" : "#e2e8f0",
              transition: "background 0.15s",
            }} />
          );
        })}
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: 4, background: "#e2e8f0", borderRadius: 99, margin: "10px 8px 0" }}>
        <div style={{
          position: "absolute", height: "100%", background: "#dc2626", borderRadius: 99,
          left: `${minP}%`, width: `${maxP - minP}%`,
        }} />
        {/* Min handle */}
        <button
          onMouseDown={(e) => { e.preventDefault(); dragging.current = "min"; }}
          onTouchStart={(e) => { e.preventDefault(); dragging.current = "min"; }}
          style={{
            position: "absolute", top: "50%",
            transform: "translate(-50%, -50%)",
            left: `${minP}%`,
            width: 18, height: 18, borderRadius: "50%",
            background: "#fff", border: "2px solid #dc2626",
            boxShadow: "0 2px 6px rgba(220,38,38,0.3)",
            cursor: "grab", zIndex: 2, outline: "none",
          }}
        />
        {/* Max handle */}
        <button
          onMouseDown={(e) => { e.preventDefault(); dragging.current = "max"; }}
          onTouchStart={(e) => { e.preventDefault(); dragging.current = "max"; }}
          style={{
            position: "absolute", top: "50%",
            transform: "translate(-50%, -50%)",
            left: `${maxP}%`,
            width: 18, height: 18, borderRadius: "50%",
            background: "#fff", border: "2px solid #dc2626",
            boxShadow: "0 2px 6px rgba(220,38,38,0.3)",
            cursor: "grab", zIndex: 2, outline: "none",
          }}
        />
      </div>

      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        {[
          { val: minVal, label: fmt(minVal) },
          { val: maxVal, label: fmt(maxVal) },
        ].map(({ label }, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: 700, color: "#64748b",
            background: "#f8fafc", border: "1px solid #e2e8f0",
            padding: "2px 8px", borderRadius: 6,
          }}>
            {label} so'm
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── User dropdown ── */
function UserSelector({ users = [], selectedUser, onSelect }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const filtered = users.filter((u) => u.name?.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "10px 12px", borderRadius: 10,
          border: open ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
          background: "#fff", cursor: "pointer",
          outline: "none", transition: "border-color 0.15s",
          boxShadow: open ? "0 0 0 3px rgba(220,38,38,0.08)" : "none",
        }}
      >
        {selectedUser ? (
          <>
            <span style={{ fontSize: 20 }}>{selectedUser.avatar || "👤"}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0f172a", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedUser.name}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", padding: 2 }}
            >
              <LuX size={13} />
            </button>
          </>
        ) : (
          <>
            <span style={{ flex: 1, fontSize: 13, color: "#94a3b8", textAlign: "left" }}>
              Bloger tanlang...
            </span>
            <LuChevronDown
              size={14}
              style={{
                color: "#94a3b8",
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </>
        )}
      </button>

      {open && (
        <div className="fs-in" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12,
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          zIndex: 100, overflow: "hidden",
        }}>
          {/* Search */}
          <div style={{ padding: 10, borderBottom: "1px solid #f1f5f9" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#f8fafc", borderRadius: 8, padding: "7px 10px",
            }}>
              <LuSearch size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Qidirish..."
                autoFocus
                style={{
                  border: "none", background: "transparent",
                  fontSize: 13, color: "#0f172a", outline: "none", flex: 1,
                }}
              />
            </div>
          </div>
          {/* List */}
          <div className="fs-scroll" style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
                Topilmadi
              </div>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { onSelect(u); setOpen(false); setQ(""); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", border: "none", background: "transparent",
                    cursor: "pointer", borderBottom: "1px solid #f8fafc",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 18 }}>{u.avatar || "👤"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {u.platform} · {u.followers}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function FilterSidebar({ onApplyFilter, usersList = [] }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    category: [],
    platform: [],
    subscribers: [],
    status: [],
    price: { min: PRICE_MIN, max: PRICE_MAX },
  });
  const [applied, setApplied] = useState(false);

  const toggle = (type, value) => {
    setApplied(false);
    setFilters((p) => {
      const has = p[type].includes(value);
      return { ...p, [type]: has ? p[type].filter((v) => v !== value) : [...p[type], value] };
    });
  };

  const reset = () => {
    setFilters({ category: [], platform: [], subscribers: [], status: [], price: { min: PRICE_MIN, max: PRICE_MAX } });
    setSelectedUser(null);
    setApplied(false);
  };

  const apply = () => {
    onApplyFilter(filters, selectedUser);
    setApplied(true);
  };

  const activeCount =
    filters.category.length +
    filters.platform.length +
    filters.subscribers.length +
    filters.status.length +
    (selectedUser ? 1 : 0) +
    (filters.price.min > PRICE_MIN || filters.price.max < PRICE_MAX ? 1 : 0);

  return (
    <div style={{ width: "100%", fontFamily: "'Inter', sans-serif" }}>
      <SidebarStyles />

      <div style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{
          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
          padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: "18px 18px 0 0",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <LuSlidersHorizontal size={16} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                Filtrlar
              </div>
              {activeCount > 0 && (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                  {activeCount} ta aktiv filtr
                </div>
              )}
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={reset}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 8, padding: "5px 10px",
                color: "#fff", fontSize: 11, fontWeight: 600,
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              <LuRotateCcw size={11} />
              Tozalash
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div>
          <div style={{ padding: "18px 18px 8px" }}>

            {/* Bloger qidirish */}
            <div style={{ marginBottom: 20 }}>
              <SectionLabel>Bloger qidirish</SectionLabel>
              <UserSelector users={usersList} selectedUser={selectedUser} onSelect={setSelectedUser} />
            </div>

            {/* Kategoriya */}
            <div style={{ marginBottom: 20 }}>
              <SectionLabel>Kategoriya</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {CATEGORIES.map((c) => (
                  <Chip
                    key={c.id}
                    label={c.id}
                    emoji={c.emoji}
                    checked={filters.category.includes(c.id)}
                    onClick={() => toggle("category", c.id)}
                  />
                ))}
              </div>
            </div>

            {/* Platforma */}
            <div style={{ marginBottom: 20 }}>
              <SectionLabel>Platforma</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {PLATFORMS.map((p) => (
                  <Chip
                    key={p.id}
                    label={p.id}
                    emoji={p.emoji}
                    checked={filters.platform.includes(p.id)}
                    onClick={() => toggle("platform", p.id)}
                  />
                ))}
              </div>
            </div>

            {/* Narx */}
            <div style={{ marginBottom: 20 }}>
              <SectionLabel>Narx oralig'i (so'm)</SectionLabel>
              <PriceSlider
                minVal={filters.price.min}
                maxVal={filters.price.max}
                onChange={({ min, max }) => {
                  setApplied(false);
                  setFilters((p) => ({ ...p, price: { min, max } }));
                }}
              />
            </div>

            {/* Obunachi oralig'i */}
            <div style={{ marginBottom: 20 }}>
              <SectionLabel>Obunachi soni</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SUBSCRIBER_RANGES.map((r) => (
                  <Chip
                    key={r}
                    label={r}
                    emoji=""
                    checked={filters.subscribers.includes(r)}
                    onClick={() => toggle("subscribers", r)}
                  />
                ))}
              </div>
            </div>

            {/* Holat */}
            <div style={{ marginBottom: 8 }}>
              <SectionLabel>Holat</SectionLabel>
              {["Tasdiqlangan", "Barchasi"].map((s) => {
                const checked = filters.status.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle("status", s)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "9px 12px",
                      marginBottom: 6, borderRadius: 10,
                      border: checked ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
                      background: checked ? "#fef2f2" : "#fff",
                      cursor: "pointer", outline: "none",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                      border: checked ? "none" : "1.5px solid #d1d5db",
                      background: checked ? "#dc2626" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.15s",
                    }}>
                      {checked && <LuCheck size={10} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: checked ? 700 : 500,
                      color: checked ? "#dc2626" : "#374151",
                    }}>
                      {s}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* ── Footer (sticky bottom so apply is always visible) ── */}
        <div style={{
          padding: "14px 18px",
          borderTop: "1px solid #f1f5f9",
          background: "#fff",
          borderRadius: "0 0 18px 18px",
          position: "sticky", bottom: 0, zIndex: 5,
        }}>
          {applied && (
            <div style={{
              marginBottom: 10, padding: "8px 12px",
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 8, fontSize: 12, fontWeight: 600,
              color: "#16a34a", textAlign: "center",
            }}>
              ✓ Filtrlar qo'llanildi
            </div>
          )}
          <button
            onClick={apply}
            style={{
              width: "100%", padding: "13px",
              borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: "0 4px 16px rgba(220,38,38,0.3)",
              transition: "opacity 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
          >
            Natijalarni ko'rsatish
            <LuArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}
