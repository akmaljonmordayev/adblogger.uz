import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LuInstagram, LuYoutube, LuMessageCircle, LuSearch,
  LuPhone, LuSend, LuBookOpen,
  LuUsers, LuBuilding2, LuMapPin, LuStar, LuBadgeCheck,
  LuTrendingUp, LuEye, LuFilter, LuPlus,
} from "react-icons/lu";

/* ── Font ── */
if (!document.getElementById("ads-fonts")) {
  const l = document.createElement("link");
  l.id = "ads-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

/* ── Mock data ── */
const ADS = [
  /* BLOGERLAR */
  {
    id: 1, type: "blogger",
    name: "Malika Yusupova",
    handle: "@malika_lifestyle",
    title: "Instagram Post & Story reklama",
    desc: "Fashion, beauty va lifestyle yo'nalishida 180K+ auditoriyaga brendingizni taqdim etaman. Yuqori engagement guaranteed.",
    platforms: ["instagram"],
    followers: "180K",
    category: "Fashion & Lifestyle",
    price: "500 000",
    priceUnit: "so'm / post",
    location: "Toshkent",
    rating: 4.9,
    reviews: 47,
    verified: true,
    tags: ["Post", "Story", "Reel"],
    color: "#e1306c",
    initial: "MY",
    bg: "#fdf2f8",
  },
  {
    id: 2, type: "blogger",
    name: "Sardor Toshmatov",
    handle: "@sardor_tech",
    title: "YouTube video va shorts reklama",
    desc: "Texnologiya va gadjetlar mavzusida 320K YouTube auditoriyasiga mahsulot sharhini taqdim etaman. Organik va ishonchli kontent.",
    platforms: ["youtube"],
    followers: "320K",
    category: "Texnologiya",
    price: "1 200 000",
    priceUnit: "so'm / video",
    location: "Toshkent",
    rating: 4.8,
    reviews: 83,
    verified: true,
    tags: ["Video sharh", "Shorts", "Unboxing"],
    color: "#ff0000",
    initial: "ST",
    bg: "#fff5f5",
  },
  {
    id: 3, type: "blogger",
    name: "Zulfiya Rahimova",
    handle: "@zulfiya_food",
    title: "Telegram kanal & Instagram ovqat reklama",
    desc: "Ovqat va restoran yo'nalishida 95K Telegram + 70K Instagram auditoriyam bor. Chegirmalar va yangi mahsulotlar uchun ideal.",
    platforms: ["telegram", "instagram"],
    followers: "165K",
    category: "Ovqat & Restoran",
    price: "350 000",
    priceUnit: "so'm / post",
    location: "Samarqand",
    rating: 4.7,
    reviews: 31,
    verified: true,
    tags: ["Post", "Story", "Chegirma"],
    color: "#0088cc",
    initial: "ZR",
    bg: "#f0f9ff",
  },
  {
    id: 4, type: "blogger",
    name: "Bobur Xasanov",
    handle: "@bobur_fitness",
    title: "Sport va fitness mahsulotlar reklama",
    desc: "Fitness va sog'lom turmush tarzi yo'nalishida 240K auditoriya. Sport jihozlari, ozuqaviy takviyalar va sport kiyimlari uchun.",
    platforms: ["instagram", "youtube"],
    followers: "240K",
    category: "Sport & Fitness",
    price: "800 000",
    priceUnit: "so'm / paket",
    location: "Toshkent",
    rating: 4.9,
    reviews: 62,
    verified: true,
    tags: ["Post", "Reel", "Video"],
    color: "#2563eb",
    initial: "BX",
    bg: "#eff6ff",
  },

  /* BIZNESMENLAR */
  {
    id: 5, type: "business",
    name: "Shirin Zavodi",
    handle: "shirinzavod.uz",
    title: "Konfet va shirinliklar uchun bloger kerak",
    desc: "O'zbekistonning yetakchi konfet zavodlaridan biri. Yangi mahsulot liniyamizni reklama qilish uchun food blogger yoki lifestyle blogger izlaymiz.",
    platforms: ["instagram", "telegram"],
    budget: "2 000 000 – 5 000 000",
    budgetUnit: "so'm / kampaniya",
    category: "Oziq-ovqat ishlab chiqarish",
    duration: "1 oy",
    location: "Toshkent",
    rating: 4.6,
    reviews: 18,
    verified: true,
    tags: ["Food blogger", "Lifestyle", "Story"],
    color: "#d97706",
    initial: "SZ",
    bg: "#fffbeb",
    target: "18–35 yosh, oilali ayollar",
  },
  {
    id: 6, type: "business",
    name: "TechStore Uzbekistan",
    handle: "techstore.uz",
    title: "Yangi smartfonlar uchun tech blogger kerak",
    desc: "Samsung, Apple va Xiaomi rasmiy distribyutori. Yangi model smartfonlar va aksessuarlar uchun unboxing va sharh videolari kerak.",
    platforms: ["youtube", "instagram"],
    budget: "3 000 000 – 8 000 000",
    budgetUnit: "so'm / kampaniya",
    category: "Elektr va texnologiya",
    duration: "2 hafta",
    location: "Toshkent",
    rating: 4.8,
    reviews: 34,
    verified: true,
    tags: ["Tech blogger", "Unboxing", "Video sharh"],
    color: "#7c3aed",
    initial: "TS",
    bg: "#f5f3ff",
    target: "18–45 yosh, erkaklar",
  },
  {
    id: 7, type: "business",
    name: "Gulzor Beauty Salon",
    handle: "@gulzor_beauty",
    title: "Go'zallik saloni reklama uchun blogger",
    desc: "Poytaxtning eng mashhur go'zallik salonlaridan biri. Yangi xizmatlar (sugaring, microblading, nail art) uchun beauty blogger kerak.",
    platforms: ["instagram"],
    budget: "800 000 – 2 000 000",
    budgetUnit: "so'm / kampaniya",
    category: "Go'zallik va sog'liq",
    duration: "2 hafta",
    location: "Toshkent",
    rating: 4.7,
    reviews: 22,
    verified: false,
    tags: ["Beauty blogger", "Post", "Story", "Reels"],
    color: "#e1306c",
    initial: "GB",
    bg: "#fdf2f8",
    target: "20–40 yosh, ayollar",
  },
  {
    id: 8, type: "business",
    name: "Green Garden Resort",
    handle: "greengarden.uz",
    title: "Dam olish maskani reklama kampaniyasi",
    desc: "Toshkent yaqinidagi zamonaviy resort va mehmonxona. Yozgi chegirma paketlarini reklama qilish uchun travel va lifestyle blogger kerak.",
    platforms: ["instagram", "youtube", "telegram"],
    budget: "4 000 000 – 10 000 000",
    budgetUnit: "so'm / kampaniya",
    category: "Turizm va dam olish",
    duration: "1 oy",
    location: "Toshkent viloyati",
    rating: 4.5,
    reviews: 11,
    verified: true,
    tags: ["Travel blogger", "Lifestyle", "Video"],
    color: "#16a34a",
    initial: "GG",
    bg: "#f0fdf4",
    target: "25–50 yosh, oilalar",
  },
];

const PLATFORM_ICONS = {
  instagram: { Icon: LuInstagram, color: "#e1306c", label: "Instagram" },
  youtube:   { Icon: LuYoutube,   color: "#ff0000", label: "YouTube" },
  telegram:  { Icon: LuMessageCircle, color: "#0088cc", label: "Telegram" },
};

/* ── Contact modal ── */
function ContactModal({ ad, onClose }) {
  if (!ad) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px",
        maxWidth: 400, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: ad.bg, color: ad.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800,
          }}>
            {ad.initial}
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#111827" }}>
              {ad.name}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{ad.handle}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
          Bog'lanish uchun quyidagi kanallardan birini tanlang:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="tel:+998901234567" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderRadius: 12,
            background: "#fef2f2", color: "#dc2626",
            textDecoration: "none", fontSize: 14, fontWeight: 600,
            border: "1px solid #fecaca",
          }}>
            <LuPhone size={17} /> +998 90 123 45 67
          </a>
          <a href="#" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderRadius: 12,
            background: "#f0f9ff", color: "#0088cc",
            textDecoration: "none", fontSize: 14, fontWeight: 600,
            border: "1px solid #bfdbfe",
          }}>
            <LuMessageCircle size={17} /> Telegram orqali yozish
          </a>
        </div>
        <button onClick={onClose} style={{
          marginTop: 16, width: "100%", padding: "10px",
          background: "none", border: "1.5px solid #e5e7eb",
          borderRadius: 12, fontSize: 13, color: "#9ca3af",
          cursor: "pointer", fontFamily: "inherit",
        }}>
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

  const inp = {
    width: "100%", padding: "11px 14px", fontSize: 14,
    border: "1.5px solid #e5e7eb", borderRadius: 10,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  if (!ad) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px",
        maxWidth: 440, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={e => e.stopPropagation()}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#dcfce7", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: 28,
            }}>✓</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
              Zayavka yuborildi!
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
              {ad.name} siz bilan tez orada bog'lanadi.
            </p>
            <button onClick={onClose} style={{
              padding: "11px 28px", borderRadius: 12,
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 700, fontFamily: "inherit",
            }}>Yopish</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 6 }}>
              Zayavka yozish
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              <strong style={{ color: "#111827" }}>{ad.name}</strong> ga zayavka yuborish
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp} placeholder="Ismingiz *"
                value={form.name} onChange={e => set("name", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
              <input style={inp} placeholder="Telefon raqamingiz *" type="tel"
                value={form.phone} onChange={e => set("phone", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
              <textarea style={{ ...inp, resize: "vertical" }} rows={3}
                placeholder="Reklama haqida qisqacha (brendingiz, mahsulot, talablar...)"
                value={form.message} onChange={e => set("message", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
              <button
                onClick={() => { if (form.name && form.phone) setSent(true); }}
                style={{
                  padding: "13px", borderRadius: 12,
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 700, fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
                }}
              >
                <LuSend size={15} /> Yuborish
              </button>
              <button onClick={onClose} style={{
                padding: "10px", background: "none",
                border: "1.5px solid #e5e7eb", borderRadius: 12,
                fontSize: 13, color: "#9ca3af", cursor: "pointer", fontFamily: "inherit",
              }}>
                Bekor qilish
              </button>
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

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #f3f4f6",
      borderRadius: 18,
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
      display: "flex", flexDirection: "column",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = ad.color + "30";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#f3f4f6";
      }}
    >
      {/* Top color strip */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${ad.color}, ${ad.color}88)`,
      }} />

      <div style={{ padding: "20px 20px 16px", flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: ad.bg, color: ad.color, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800,
          }}>
            {ad.initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14, fontWeight: 800, color: "#111827",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {ad.name}
              </span>
              {ad.verified && (
                <LuBadgeCheck size={15} style={{ color: "#2563eb", flexShrink: 0 }} />
              )}
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{ad.handle}</div>
          </div>
          {/* Type badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 100,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
            flexShrink: 0,
            background: isBlogger ? "#fef2f2" : "#eff6ff",
            color: isBlogger ? "#dc2626" : "#2563eb",
            border: `1px solid ${isBlogger ? "#fecaca" : "#bfdbfe"}`,
          }}>
            {isBlogger ? <LuUsers size={10} /> : <LuBuilding2 size={10} />}
            {isBlogger ? "Bloger" : "Biznes"}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 15, fontWeight: 800, color: "#111827",
          marginBottom: 8, lineHeight: 1.3,
        }}>
          {ad.title}
        </h3>

        {/* Desc */}
        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, marginBottom: 14,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {ad.desc}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {ad.tags.map(tag => (
            <span key={tag} style={{
              padding: "3px 10px", borderRadius: 100,
              background: "#f9fafb", border: "1px solid #e5e7eb",
              fontSize: 11, fontWeight: 600, color: "#374151",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12,
          marginBottom: 14, paddingTop: 12,
          borderTop: "1px solid #f3f4f6",
        }}>
          {isBlogger && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
              <LuEye size={13} style={{ color: "#9ca3af" }} />
              <strong style={{ color: "#111827" }}>{ad.followers}</strong> auditoriya
            </div>
          )}
          {!isBlogger && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
              <LuTrendingUp size={13} style={{ color: "#9ca3af" }} />
              Maqsad: <strong style={{ color: "#111827" }}>{ad.target}</strong>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
            <LuMapPin size={13} style={{ color: "#9ca3af" }} />
            {ad.location}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280" }}>
            <LuStar size={12} style={{ color: "#f59e0b" }} />
            <strong style={{ color: "#111827" }}>{ad.rating}</strong>
            <span style={{ color: "#9ca3af" }}>({ad.reviews})</span>
          </div>
        </div>

        {/* Platforms */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {ad.platforms.map(p => {
            const { Icon, color, label } = PLATFORM_ICONS[p];
            return (
              <div key={p} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 100,
                background: "#f9fafb", border: "1px solid #e5e7eb",
                fontSize: 11, fontWeight: 500, color: "#374151",
              }}>
                <Icon size={12} style={{ color }} />
                {label}
              </div>
            );
          })}
        </div>

        {/* Price */}
        <div style={{
          padding: "10px 14px", borderRadius: 12,
          background: ad.bg, border: `1px solid ${ad.color}20`,
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 16, fontWeight: 800, color: ad.color,
          }}>
            {isBlogger ? ad.price : ad.budget} <span style={{ fontSize: 11 }}>so'm</span>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
            {isBlogger ? ad.priceUnit : ad.budgetUnit}
            {!isBlogger && <span> · Davomiyligi: {ad.duration}</span>}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        padding: "0 16px 16px",
        display: "flex", gap: 8,
      }}>
        <button
          onClick={() => onContact(ad)}
          style={{
            flex: 1, padding: "10px 8px", borderRadius: 10,
            background: "#f9fafb", border: "1.5px solid #e5e7eb",
            fontSize: 12, fontWeight: 600, color: "#374151",
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          <LuPhone size={13} /> Bog'lanish
        </button>
        <button
          onClick={() => onZayavka(ad)}
          style={{
            flex: 1, padding: "10px 8px", borderRadius: 10,
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            border: "none", color: "#fff",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            boxShadow: "0 3px 10px rgba(220,38,38,0.3)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <LuSend size={13} /> Zayavka
        </button>
        <Link
          to={`/ads/${ad.id}`}
          style={{
            padding: "10px 12px", borderRadius: 10,
            background: "#f9fafb", border: "1.5px solid #e5e7eb",
            fontSize: 12, color: "#6b7280",
            textDecoration: "none",
            display: "flex", alignItems: "center", gap: 4,
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#dc2626";
            e.currentTarget.style.borderColor = "#fecaca";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "#6b7280";
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
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
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [contactAd, setContactAd] = useState(null);
  const [zayavkaAd, setZayavkaAd] = useState(null);

  const filtered = ADS.filter(ad => {
    const matchType = filter === "all" || ad.type === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || ad.title.toLowerCase().includes(q)
      || ad.name.toLowerCase().includes(q)
      || ad.category.toLowerCase().includes(q)
      || ad.desc.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const tabs = [
    { key: "all",      label: "Hammasi",    Icon: LuFilter,    count: ADS.length },
    { key: "blogger",  label: "Blogerlar",  Icon: LuUsers,     count: ADS.filter(a => a.type === "blogger").length },
    { key: "business", label: "Biznesmenlar", Icon: LuBuilding2, count: ADS.filter(a => a.type === "business").length },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(135deg, #fff 0%, #fef2f2 60%, #fff 100%)",
        borderRadius: 20, padding: "48px 40px 40px",
        marginBottom: 24, border: "1px solid #fecaca",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "#fef2f2", color: "#dc2626",
              border: "1px solid #fecaca",
              fontSize: 10, fontWeight: 700, letterSpacing: "2px",
              textTransform: "uppercase", padding: "5px 14px",
              borderRadius: 100, marginBottom: 16,
            }}>
              <LuTrendingUp size={11} /> Reklamalar
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(26px, 4vw, 42px)",
              fontWeight: 800, color: "#111827",
              letterSpacing: "-0.5px", marginBottom: 10,
            }}>
              Bloger va biznesmenlar reklamalari
            </h1>
            <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6, maxWidth: 500 }}>
              Blogerlar xizmatlarini, biznesmenlar esa reklamaga bloger izlash e'lonlarini joylashtirgan.
            </p>
          </div>
          <Link to="/post-ad" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg,#dc2626,#b91c1c)",
            color: "#fff", textDecoration: "none",
            padding: "13px 24px", borderRadius: 12,
            fontSize: 14, fontWeight: 700, flexShrink: 0,
            boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
          }}>
            <LuPlus size={16} strokeWidth={2.5} /> E'lon berish
          </Link>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div style={{
        background: "#fff", borderRadius: 16,
        border: "1px solid #f3f4f6", padding: "16px 20px",
        marginBottom: 20,
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
      }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map(({ key, label, Icon, count }) => (
            <button key={key}
              onClick={() => setFilter(key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 10,
                border: "1.5px solid",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit",
                background: filter === key ? "#fef2f2" : "#f9fafb",
                borderColor: filter === key ? "#fecaca" : "#e5e7eb",
                color: filter === key ? "#dc2626" : "#374151",
                transition: "all 0.15s",
              }}
            >
              <Icon size={14} />
              {label}
              <span style={{
                padding: "1px 7px", borderRadius: 100,
                background: filter === key ? "#dc2626" : "#e5e7eb",
                color: filter === key ? "#fff" : "#6b7280",
                fontSize: 11, fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          flex: 1, minWidth: 200,
          display: "flex", alignItems: "center", gap: 8,
          background: "#f9fafb", border: "1.5px solid #e5e7eb",
          borderRadius: 10, padding: "0 12px",
        }}
          onFocus={e => e.currentTarget.style.borderColor = "#fca5a5"}
          onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
        >
          <LuSearch size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Qidirish: bloger, kategoriya, xizmat..."
            style={{
              flex: 1, border: "none", background: "transparent",
              padding: "10px 0", fontSize: 13, outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* ── GRID ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <LuSearch size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 15 }}>Hech narsa topilmadi</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 18,
        }}>
          {filtered.map(ad => (
            <AdCard key={ad.id} ad={ad} onContact={setContactAd} onZayavka={setZayavkaAd} />
          ))}
        </div>
      )}

      {/* Modals */}
      <ContactModal ad={contactAd} onClose={() => setContactAd(null)} />
      <ZayavkaModal ad={zayavkaAd} onClose={() => setZayavkaAd(null)} />
    </div>
  );
}
