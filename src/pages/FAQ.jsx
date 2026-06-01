import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import { faqService } from "../services/dataService";

/* ─── Category config ─────────────────────────────────────── */
const CATS = [
  { key: "all",       label: "Barchasi",        emoji: "✦"  },
  { key: "general",   label: "Umumiy",          emoji: "💡" },
  { key: "blogger",   label: "Blogger",         emoji: "🎯" },
  { key: "business",  label: "Reklam beruvchi", emoji: "🏢" },
  { key: "payment",   label: "To'lov",          emoji: "💳" },
  { key: "technical", label: "Texnik",          emoji: "⚙️" },
];

const CAT_STYLE = {
  general:   { bg: "linear-gradient(135deg,#f8fafc,#f1f5f9)", accent: "#64748b", pill: "#e2e8f0", pillText: "#475569" },
  blogger:   { bg: "linear-gradient(135deg,#fff1f2,#ffe4e6)", accent: "#e11d48", pill: "#fecdd3", pillText: "#be123c" },
  business:  { bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", accent: "#d97706", pill: "#fde68a", pillText: "#b45309" },
  payment:   { bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", accent: "#16a34a", pill: "#bbf7d0", pillText: "#15803d" },
  technical: { bg: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", accent: "#0284c7", pill: "#bae6fd", pillText: "#0369a1" },
};

/* ─── Skeleton ────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-3">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="animate-pulse rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)", border: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-4 p-5">
            <div className="w-10 h-10 rounded-xl bg-slate-200/80 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200/80 rounded-lg" style={{ width: `${55 + i * 7}%` }} />
              <div className="h-3 bg-slate-100 rounded-lg w-24" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-200/60 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── AccordionItem ───────────────────────────────────────── */
function AccordionItem({ faq, index, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const catKey  = faq.category || "general";
  const catCfg  = CAT_STYLE[catKey] || CAT_STYLE.general;
  const catLabel = CATS.find(c => c.key === catKey)?.label || catKey;
  const catEmoji = CATS.find(c => c.key === catKey)?.emoji || "💡";

  useEffect(() => {
    if (contentRef.current) setHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: isOpen ? catCfg.bg : "#ffffff",
        border: `1.5px solid ${isOpen ? catCfg.accent + "33" : "#e8ecf0"}`,
        borderRadius: 20,
        boxShadow: isOpen
          ? `0 8px 32px ${catCfg.accent}18, 0 2px 8px rgba(0,0,0,0.04)`
          : "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      {/* Left accent stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: isOpen ? `linear-gradient(180deg,${catCfg.accent},${catCfg.accent}88)` : "transparent",
        borderRadius: "4px 0 0 4px",
        transition: "all 0.3s ease",
      }} />

      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 text-left"
        style={{ padding: "18px 20px 18px 24px", WebkitTapHighlightColor: "transparent" }}
      >
        {/* Number badge */}
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? catCfg.accent : "#f1f5f9",
          transition: "all 0.3s ease",
          boxShadow: isOpen ? `0 4px 12px ${catCfg.accent}40` : "none",
        }}>
          <span style={{
            fontSize: 13, fontWeight: 900, lineHeight: 1,
            color: isOpen ? "#fff" : "#94a3b8",
            fontVariantNumeric: "tabular-nums",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Question */}
        <div className="flex-1 min-w-0">
          <p style={{
            fontSize: 15, fontWeight: 700, lineHeight: 1.5, margin: 0,
            color: isOpen ? "#0f172a" : "#1e293b",
            transition: "color 0.2s ease",
          }}>
            {faq.question}
          </p>
          {!isOpen && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              marginTop: 4, fontSize: 11, fontWeight: 600,
              color: catCfg.accent, opacity: 0.7,
            }}>
              {catEmoji} {catLabel}
            </span>
          )}
        </div>

        {/* Toggle icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? catCfg.accent + "15" : "#f8fafc",
          border: `1.5px solid ${isOpen ? catCfg.accent + "30" : "#e2e8f0"}`,
          transition: "all 0.3s ease",
        }}>
          <svg
            style={{
              width: 16, height: 16,
              color: isOpen ? catCfg.accent : "#94a3b8",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease, color 0.3s ease",
            }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div style={{ height, overflow: "hidden", transition: "height 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
        <div ref={contentRef} style={{ padding: "0 20px 22px 84px" }}>
          {/* Category pill */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 12px", borderRadius: 99, marginBottom: 12,
            background: catCfg.pill, color: catCfg.pillText,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.3px",
          }}>
            {catEmoji} {catLabel}
          </span>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg,${catCfg.accent}20,transparent)`, marginBottom: 14 }} />

          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8, margin: 0 }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN ────────────────────────────────────────────────── */
export default function FAQ() {
  const [faqs,      setFaqs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [openIdx,   setOpenIdx]   = useState(null);
  const [search,    setSearch]    = useState("");

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await faqService.getAll();
      setFaqs(res.data || []);
    } catch {
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const filtered = faqs.filter(f => {
    const matchCat = activeCat === "all" || f.category === activeCat;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const counts = {
    all: faqs.length,
    ...Object.fromEntries(
      CATS.filter(c => c.key !== "all").map(c => [c.key, faqs.filter(f => f.category === c.key).length])
    ),
  };

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px" }}>
      <SEO
        title="Ko'p So'raladigan Savollar — FAQ"
        description="ADBlogger platformasi haqida eng ko'p beriladigan savollar va ularga to'liq javoblar."
        canonical="/faq"
      />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
          borderRadius: 28, overflow: "hidden", marginBottom: 36,
          position: "relative", padding: "48px 40px",
        }}
      >
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Glow blobs */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(220,38,38,0.25),transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)", filter: "blur(30px)" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", boxShadow: "0 0 12px #dc2626" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              Yordam markazi
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Ko'p so'raladigan
              <br />
              <span style={{ background: "linear-gradient(135deg,#f43f5e,#fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                savollar
              </span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.7, maxWidth: 420 }}>
              Platformamiz haqida tez-tez beriladigan savollar va ularga aniq, batafsil javoblar.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 480 }}>
            <svg
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "rgba(255,255,255,0.35)", pointerEvents: "none" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setOpenIdx(null); }}
              placeholder="Savol yoki kalit so'z qidiring..."
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 14, padding: "14px 44px 14px 48px",
                fontSize: 14, color: "#fff", outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s ease",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(220,38,38,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg style={{ width: 14, height: 14, color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { v: loading ? "—" : String(faqs.length), l: "savol" },
              { v: String(CATS.length - 1), l: "bo'lim" },
              { v: "24h", l: "ichida javob" },
            ].map(({ v, l }) => (
              <div key={l} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>{v}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══ CATEGORY TABS ═════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}
      >
        {CATS.map(cat => {
          const active = activeCat === cat.key;
          const cnt = counts[cat.key] ?? 0;
          return (
            <button
              key={cat.key}
              onClick={() => { setActiveCat(cat.key); setOpenIdx(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 12, cursor: "pointer",
                border: `1.5px solid ${active ? "#dc2626" : "#e2e8f0"}`,
                background: active ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "#fff",
                color: active ? "#fff" : "#64748b",
                fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0,
                boxShadow: active ? "0 4px 16px rgba(220,38,38,0.3)" : "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 14 }}>{cat.emoji}</span>
              {cat.label}
              <span style={{
                background: active ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                color: active ? "#fff" : "#94a3b8",
                padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 800,
              }}>
                {cnt}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ══ FAQ LIST ══════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Skeleton />
          </motion.div>
        ) : filtered.length > 0 ? (
          <motion.div
            key={activeCat + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}
          >
            {/* Results count */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                {filtered.length} ta savol topildi
              </span>
              {openIdx !== null && (
                <button
                  onClick={() => setOpenIdx(null)}
                  style={{ fontSize: 12, color: "#dc2626", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Hammasini yopish
                </button>
              )}
            </div>

            {filtered.map((faq, i) => (
              <AccordionItem
                key={faq._id || i}
                faq={faq}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "72px 20px 80px", background: "#fff", borderRadius: 24, border: "1.5px solid #e8ecf0", marginBottom: 40 }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Hech narsa topilmadi</p>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 24px" }}>
              {search ? `"${search}" bo'yicha savol yo'q` : "Bu kategoriyada savollar mavjud emas"}
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCat("all"); }}
              style={{
                padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff",
                fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(220,38,38,0.3)",
              }}
            >
              Filterni tozalash
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ BOTTOM CTA ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          background: "#fff", border: "1.5px solid #e8ecf0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        }}
      >
        {/* Top gradient strip */}
        <div style={{ height: 4, background: "linear-gradient(90deg,#dc2626,#f97316,#dc2626)" }} />

        <div style={{ padding: "32px 36px", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          {/* Icon + text */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1, minWidth: 220 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#fee2e2,#fecaca)", border: "1.5px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg style={{ width: 24, height: 24, color: "#dc2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                Savolingiz javobsiz qoldimi?
              </h3>
              <p style={{ fontSize: 13.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Bizning mutaxassis jamoa{" "}
                <span style={{ color: "#dc2626", fontWeight: 700 }}>24 soat ichida</span>{" "}
                sizga javob beradi.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
            <a
              href="mailto:hello@adbloger.uz"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 20px", borderRadius: 12, textDecoration: "none",
                background: "#f8fafc", border: "1.5px solid #e2e8f0",
                color: "#374151", fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
            <Link
              to="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 22px", borderRadius: 12, textDecoration: "none",
                background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(220,38,38,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,38,38,0.35)"; }}
            >
              Bog'lanish
              <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
