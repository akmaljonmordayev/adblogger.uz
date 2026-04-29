import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LuInstagram, LuYoutube, LuMessageCircle, LuSearch,
  LuPhone, LuSend, LuBookOpen,
  LuUsers, LuBuilding2, LuMapPin, LuStar, LuBadgeCheck,
  LuTrendingUp, LuEye, LuFilter, LuPlus, LuLoader,
} from "react-icons/lu";
import api from "../services/api";

/* ── Font ── */
if (!document.getElementById("ads-fonts")) {
  const l = document.createElement("link");
  l.id = "ads-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

/* ── Platform icon map ── */
const PLATFORM_ICONS = {
  instagram: { Icon: LuInstagram, color: "#e1306c", label: "Instagram" },
  youtube:   { Icon: LuYoutube,   color: "#ff0000", label: "YouTube" },
  telegram:  { Icon: LuMessageCircle, color: "#0088cc", label: "Telegram" },
  tiktok:    { Icon: LuUsers,     color: "#010101", label: "TikTok" },
};

/* ── Niche colors ── */
const NICHE_COLOR = {
  Tech: "#2563eb", Lifestyle: "#e1306c", Beauty: "#9333ea",
  Food: "#d97706", Sports: "#16a34a", Travel: "#0891b2",
  Education: "#7c3aed", Gaming: "#dc2626", Music: "#374151",
  Business: "#b45309", Other: "#64748b",
};
const NICHE_BG = {
  Tech: "#eff6ff", Lifestyle: "#fdf2f8", Beauty: "#faf5ff",
  Food: "#fffbeb", Sports: "#f0fdf4", Travel: "#ecfeff",
  Education: "#f5f3ff", Gaming: "#fef2f2", Music: "#f8fafc",
  Business: "#fef3c7", Other: "#f8fafc",
};
const BIZ_COLOR = {
  Manufacturing: "#d97706", Retail: "#2563eb", Restaurant: "#dc2626",
  Beauty: "#e1306c", RealEstate: "#16a34a", Education: "#7c3aed",
  Tech: "#2563eb", Tourism: "#0891b2", Finance: "#374151", Other: "#64748b",
};
const BIZ_BG = {
  Manufacturing: "#fffbeb", Retail: "#eff6ff", Restaurant: "#fef2f2",
  Beauty: "#fdf2f8", RealEstate: "#f0fdf4", Education: "#f5f3ff",
  Tech: "#eff6ff", Tourism: "#ecfeff", Finance: "#f8fafc", Other: "#f8fafc",
};

/* ── Format followers ── */
function fmtFollowers(n) {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}
function fmtPrice(n) {
  if (!n) return "0";
  return Number(n).toLocaleString("uz-UZ");
}
function initials(str) {
  if (!str) return "?";
  return str.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

/* ── Budget range label ── */
const BUDGET_LABELS = {
  "500K-1M": "500 000 – 1 000 000",
  "1M-3M":   "1 000 000 – 3 000 000",
  "3M-5M":   "3 000 000 – 5 000 000",
  "5M-10M":  "5 000 000 – 10 000 000",
  "10M+":    "10 000 000+",
  "Negotiable": "Kelishiladi",
};

/* ── Map API ad → card props ── */
function mapAd(ad) {
  if (ad.type === "blogger") {
    const fullName = ad.user
      ? `${ad.user.firstName || ""} ${ad.user.lastName || ""}`.trim()
      : "Bloger";
    const niche    = ad.niche?.[0] || "Other";
    const plat     = ad.platforms?.[0] || "instagram";
    const color    = NICHE_COLOR[niche] || PLATFORM_ICONS[plat]?.color || "#dc2626";
    const bg       = NICHE_BG[niche] || "#fef2f2";
    const minPrice = ad.pricing
      ? Math.min(...Object.values(ad.pricing).filter(Boolean))
      : 0;

    return {
      _id: ad._id,
      type: "blogger",
      name: fullName,
      handle: ad.portfolio ? `@${ad.portfolio.split("/").pop()}` : `@${fullName.toLowerCase().replace(/\s/g, "_")}`,
      title: ad.title || "Bloger e'loni",
      desc: ad.description || "",
      platforms: ad.platforms || [],
      followers: ad.followersRange || "—",
      category: niche,
      price: fmtPrice(minPrice),
      priceUnit: "so'm / post",
      location: ad.location || "—",
      phone: ad.phone,
      tags: ad.services || [],
      color,
      bg,
      initial: ad.user?.avatar ? null : initials(fullName),
      avatar: ad.user?.avatar || null,
      views: ad.views,
    };
  }

  /* business */
  const bizType = ad.businessType || "Other";
  const color   = BIZ_COLOR[bizType] || "#64748b";
  const bg      = BIZ_BG[bizType]   || "#f8fafc";
  const name    = ad.companyName || "Biznes";

  return {
    _id: ad._id,
    type: "business",
    name,
    handle: ad.contactPerson || "",
    title: ad.productName || "Biznes e'loni",
    desc: ad.productDescription || "",
    platforms: ad.targetPlatforms || [],
    budget: BUDGET_LABELS[ad.budget?.range] || ad.budget?.range || "—",
    budgetUnit: "so'm / kampaniya",
    category: bizType,
    duration: ad.campaignDuration || "—",
    location: ad.location || "—",
    phone: ad.phone,
    tags: ad.bloggerTypesNeeded || [],
    target: ad.targetAudience || "—",
    color,
    bg,
    initial: initials(name),
    avatar: null,
    views: ad.views,
  };
}

/* ── Contact modal ── */
function ContactModal({ ad, onClose }) {
  if (!ad) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: ad.bg, color: ad.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, overflow: "hidden" }}>
            {ad.avatar ? <img src={ad.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : ad.initial}
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#111827" }}>{ad.name}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{ad.handle}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>Bog'lanish uchun quyidagi kanallardan birini tanlang:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ad.phone && (
            <a href={`tel:${ad.phone}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: "#fef2f2", color: "#dc2626", textDecoration: "none", fontSize: 14, fontWeight: 600, border: "1px solid #fecaca" }}>
              <LuPhone size={17} /> {ad.phone}
            </a>
          )}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: "#f0f9ff", color: "#0088cc", textDecoration: "none", fontSize: 14, fontWeight: 600, border: "1px solid #bfdbfe" }}>
            <LuMessageCircle size={17} /> Telegram orqali yozish
          </a>
        </div>
        <button onClick={onClose} style={{ marginTop: 16, width: "100%", padding: "10px", background: "none", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}>
          Yopish
        </button>
      </div>
    </div>
  );
}

/* ── Zayavka modal ── */
function ZayavkaModal({ ad, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = { width: "100%", padding: "11px 14px", fontSize: 14, border: "1.5px solid #e5e7eb", borderRadius: 10, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" };

  if (!ad) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>✓</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Zayavka yuborildi!</div>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>{ad.name} siz bilan tez orada bog'lanadi.</p>
            <button onClick={onClose} style={{ padding: "11px 28px", borderRadius: 12, background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>Yopish</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Zayavka yozish</div>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}><strong style={{ color: "#111827" }}>{ad.name}</strong> ga zayavka yuborish</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp} placeholder="Ismingiz *" value={form.name} onChange={e => set("name", e.target.value)} onFocus={e => e.target.style.borderColor = "#dc2626"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              <input style={inp} placeholder="Telefon raqamingiz *" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} onFocus={e => e.target.style.borderColor = "#dc2626"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              <textarea style={{ ...inp, resize: "vertical" }} rows={3} placeholder="Reklama haqida qisqacha (brendingiz, mahsulot, talablar...)" value={form.message} onChange={e => set("message", e.target.value)} onFocus={e => e.target.style.borderColor = "#dc2626"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              <button onClick={() => { if (form.name && form.phone) setSent(true); }} style={{ padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px rgba(220,38,38,0.35)" }}>
                <LuSend size={15} /> Yuborish
              </button>
              <button onClick={onClose} style={{ padding: "10px", background: "none", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}>Bekor qilish</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Ad card ── */
function AdCard({ ad, onContact, onZayavka }) {
  const isBlogger = ad.type === "blogger";
  const platList  = isBlogger ? ad.platforms : ad.platforms;

  return (
    <div style={{ background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 18, overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s", display: "flex", flexDirection: "column" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = ad.color + "30"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#f3f4f6"; }}
    >
      {/* color strip */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${ad.color}, ${ad.color}88)` }} />

      <div style={{ padding: "20px 20px 16px", flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: ad.bg, color: ad.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, overflow: "hidden" }}>
            {ad.avatar
              ? <img src={ad.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : ad.initial
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {ad.name}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.handle}</div>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", flexShrink: 0, background: isBlogger ? "#fef2f2" : "#eff6ff", color: isBlogger ? "#dc2626" : "#2563eb", border: `1px solid ${isBlogger ? "#fecaca" : "#bfdbfe"}` }}>
            {isBlogger ? <LuUsers size={10} /> : <LuBuilding2 size={10} />}
            {isBlogger ? "Bloger" : "Biznes"}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 8, lineHeight: 1.3 }}>
          {ad.title}
        </h3>

        {/* Desc */}
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {ad.desc || "Ma'lumot kiritilmagan"}
        </p>

        {/* Tags */}
        {ad.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {ad.tags.slice(0, 4).map(tag => (
              <span key={tag} style={{ padding: "3px 10px", borderRadius: 100, background: "#f9fafb", border: "1px solid #e5e7eb", fontSize: 11, fontWeight: 600, color: "#374151" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
          {isBlogger && ad.followers !== "—" && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
              <LuEye size={13} style={{ color: "#9ca3af" }} />
              <strong style={{ color: "#111827" }}>{ad.followers}</strong> obunachilar
            </div>
          )}
          {!isBlogger && ad.target && ad.target !== "—" && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280", maxWidth: "100%" }}>
              <LuTrendingUp size={13} style={{ color: "#9ca3af", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <strong style={{ color: "#111827" }}>{ad.target}</strong>
              </span>
            </div>
          )}
          {ad.location && ad.location !== "—" && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
              <LuMapPin size={13} style={{ color: "#9ca3af" }} />
              {ad.location}
            </div>
          )}
        </div>

        {/* Platforms */}
        {platList?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {platList.map(p => {
              const meta = PLATFORM_ICONS[p];
              if (!meta) return null;
              const { Icon, color, label } = meta;
              return (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 100, background: "#f9fafb", border: "1px solid #e5e7eb", fontSize: 11, fontWeight: 500, color: "#374151" }}>
                  <Icon size={12} style={{ color }} />
                  {label}
                </div>
              );
            })}
          </div>
        )}

        {/* Price / Budget */}
        <div style={{ padding: "10px 14px", borderRadius: 12, background: ad.bg, border: `1px solid ${ad.color}20` }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: ad.color }}>
            {isBlogger ? ad.price : ad.budget}
            {isBlogger && <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>so'm</span>}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
            {isBlogger ? ad.priceUnit : `${ad.budgetUnit}${ad.duration && ad.duration !== "—" ? ` · ${ad.duration}` : ""}`}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
        <button onClick={() => onContact(ad)} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, background: "#f9fafb", border: "1.5px solid #e5e7eb", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "background 0.15s, border-color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#d1d5db"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
        >
          <LuPhone size={13} /> Bog'lanish
        </button>
        <button onClick={() => onZayavka(ad)} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, background: "linear-gradient(135deg, #dc2626, #b91c1c)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, boxShadow: "0 3px 10px rgba(220,38,38,0.3)", transition: "opacity 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <LuSend size={13} /> Zayavka
        </button>
        <Link to={`/ads/${ad._id}`} style={{ padding: "10px 12px", borderRadius: 10, background: "#f9fafb", border: "1.5px solid #e5e7eb", fontSize: 12, color: "#6b7280", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "color 0.15s, border-color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fecaca"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
          title="Batafsil o'qish"
        >
          <LuBookOpen size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
export default function Ads() {
  const [ads, setAds]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [contactAd, setContactAd] = useState(null);
  const [zayavkaAd, setZayavkaAd] = useState(null);

  /* fetch */
  useEffect(() => {
    setLoading(true);
    api.get("/ads")
      .then(res => setAds((res.data.data || []).map(mapAd)))
      .catch(err => setError(err.message || "Xatolik"))
      .finally(() => setLoading(false));
  }, []);

  /* filter + search */
  const filtered = ads.filter(ad => {
    const matchType = filter === "all" || ad.type === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || ad.title.toLowerCase().includes(q)
      || ad.name.toLowerCase().includes(q)
      || ad.desc.toLowerCase().includes(q)
      || ad.category?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const counts = {
    all:      ads.length,
    blogger:  ads.filter(a => a.type === "blogger").length,
    business: ads.filter(a => a.type === "business").length,
  };

  const tabs = [
    { key: "all",      label: "Hammasi",      Icon: LuFilter,    count: counts.all },
    { key: "blogger",  label: "Blogerlar",    Icon: LuUsers,     count: counts.blogger },
    { key: "business", label: "Biznesmenlar", Icon: LuBuilding2, count: counts.business },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg, #fff 0%, #fef2f2 60%, #fff 100%)", borderRadius: 20, padding: "48px 40px 40px", marginBottom: 24, border: "1px solid #fecaca", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "5px 14px", borderRadius: 100, marginBottom: 16 }}>
              <LuTrendingUp size={11} /> Reklamalar
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", marginBottom: 10 }}>
              Bloger va biznesmenlar reklamalari
            </h1>
            <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6, maxWidth: 500 }}>
              Blogerlar xizmatlarini, biznesmenlar esa reklamaga bloger izlash e'lonlarini joylashtirgan.
            </p>
          </div>
          <Link to="/post-ad" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", textDecoration: "none", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, flexShrink: 0, boxShadow: "0 4px 16px rgba(220,38,38,0.35)" }}>
            <LuPlus size={16} strokeWidth={2.5} /> E'lon berish
          </Link>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map(({ key, label, Icon, count }) => (
            <button key={key} onClick={() => setFilter(key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: filter === key ? "#fef2f2" : "#f9fafb", borderColor: filter === key ? "#fecaca" : "#e5e7eb", color: filter === key ? "#dc2626" : "#374151", transition: "all 0.15s" }}>
              <Icon size={14} />
              {label}
              <span style={{ padding: "1px 7px", borderRadius: 100, background: filter === key ? "#dc2626" : "#e5e7eb", color: filter === key ? "#fff" : "#6b7280", fontSize: 11, fontWeight: 700 }}>
                {count}
              </span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "0 12px" }}>
          <LuSearch size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish: bloger, kategoriya, xizmat..." style={{ flex: 1, border: "none", background: "transparent", padding: "10px 0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
          <LuLoader size={32} style={{ color: "#dc2626", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* ── ERROR ── */}
      {error && !loading && (
        <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#dc2626", fontWeight: 600 }}>Xatolik: {error}</div>
        </div>
      )}

      {/* ── GRID ── */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
            <LuSearch size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15 }}>Hech narsa topilmadi</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {filtered.map(ad => (
              <AdCard key={ad._id} ad={ad} onContact={setContactAd} onZayavka={setZayavkaAd} />
            ))}
          </div>
        )
      )}

      <ContactModal ad={contactAd} onClose={() => setContactAd(null)} />
      <ZayavkaModal ad={zayavkaAd} onClose={() => setZayavkaAd(null)} />
    </div>
  );
}
