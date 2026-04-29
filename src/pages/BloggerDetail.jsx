import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LuArrowLeft, LuUsers, LuTrendingUp, LuStar, LuMapPin,
  LuCheck, LuMessageCircle, LuInfo, LuLayoutDashboard,
  LuImage, LuVideo, LuX, LuHeart, LuLoader, LuGlobe,
  LuBadgeCheck, LuCalendar, LuChartColumn, LuMic,
  LuLink, LuExternalLink, LuPlay, LuBriefcase,
} from "react-icons/lu";
import { FaInstagram, FaYoutube, FaTelegram, FaTiktok } from "react-icons/fa";
import { toast } from "../components/ui/toast";
import api from "../services/api";

/* ─── helpers ────────────────────────────────────────────── */
const PLATFORM_DISPLAY = {
  youtube: "YouTube", instagram: "Instagram",
  telegram: "Telegram", tiktok: "TikTok",
};

const CATEGORY_LABELS = {
  Tech: "Texnologiya", Lifestyle: "Lifestyle", Beauty: "Go'zallik",
  Food: "Ovqat", Sports: "Sport", Travel: "Sayohat",
  Education: "Ta'lim", Business: "Biznes", Gaming: "Gaming",
  Music: "Musiqa", Other: "Boshqa",
};

const CATEGORY_GRADIENTS = {
  Tech:      "linear-gradient(135deg, #024da1 0%, #012b64 100%)",
  Lifestyle: "linear-gradient(135deg, #8c0d3a 0%, #46041d 100%)",
  Beauty:    "linear-gradient(135deg, #5b137d 0%, #2f0745 100%)",
  Food:      "linear-gradient(135deg, #a13602 0%, #4b1700 100%)",
  Sports:    "linear-gradient(135deg, #1a4d7c 0%, #0b2a3e 100%)",
  Travel:    "linear-gradient(135deg, #1b5e20 0%, #002d12 100%)",
  Education: "linear-gradient(135deg, #4a148c 0%, #1a0d47 100%)",
  Gaming:    "linear-gradient(135deg, #9c27b0 0%, #2d003f 100%)",
  Music:     "linear-gradient(135deg, #2c2c2c 0%, #0a0a0a 100%)",
  Business:  "linear-gradient(135deg, #b45309 0%, #431407 100%)",
  Other:     "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
};

function fmtNum(n) {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return String(n);
}
function fmtPrice(n) {
  if (!n) return "0";
  return Number(n).toLocaleString("uz-UZ");
}
function stars(rating) {
  return Array.from({ length: 5 }, (_, i) => (
    <LuStar
      key={i} size={13}
      style={{ color: i < Math.round(rating) ? "#f59e0b" : "#d1d5db", fill: i < Math.round(rating) ? "#f59e0b" : "none" }}
    />
  ));
}

/* ─── Loading ────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <LuLoader size={36} style={{ color: "#dc2626", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function BloggerDetail() {
  const { id } = useParams();

  const [blogger, setBlogger]         = useState(null);
  const [reviews, setReviews]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeTab, setActiveTab]     = useState("pricing");
  const [inWishlist, setInWishlist]   = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen]     = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get(`/bloggers/${id}`),
      api.get(`/bloggers/${id}/reviews`),
    ])
      .then(([bRes, rRes]) => {
        setBlogger(bRes.data.data);
        setReviews(rRes.data.data || []);
      })
      .catch(err => setError(err.response?.data?.message || err.message || "Xatolik"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("adb_wishlist") || "[]");
    setInWishlist(stored.some(w => w._id === id));
  }, [id]);

  const toggleWishlist = () => {
    const stored = JSON.parse(localStorage.getItem("adb_wishlist") || "[]");
    if (inWishlist) {
      localStorage.setItem("adb_wishlist", JSON.stringify(stored.filter(w => w._id !== id)));
      setInWishlist(false);
      toast.success("Saqlanganlardan o'chirildi");
    } else {
      const item = {
        _id: id, itemType: "blogger",
        name: `${blogger?.user?.firstName} ${blogger?.user?.lastName}`,
        handle: blogger?.handle,
        platforms: blogger?.platforms || [],
        rating: blogger?.rating,
        avatar: blogger?.user?.avatar || "",
        location: blogger?.location,
        link: `/bloggers/${id}`,
        savedAt: new Date().toLocaleDateString("uz-UZ"),
      };
      localStorage.setItem("adb_wishlist", JSON.stringify([...stored, item]));
      setInWishlist(true);
      toast.success("Saqlanganlariga qo'shildi ❤️");
    }
  };

  if (loading) return <Spinner />;
  if (error) return (
    <div style={{ maxWidth: 520, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>😕</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Blogger topilmadi</div>
      <div style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>{error}</div>
      <Link to="/bloggers" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#dc2626", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
        <LuArrowLeft size={16} /> Blogerlar ro'yxatiga qaytish
      </Link>
    </div>
  );
  if (!blogger) return null;

  const cat      = blogger.categories?.[0] || "Other";
  const plat     = blogger.platforms?.[0]  || "youtube";
  const gradient = CATEGORY_GRADIENTS[cat] ?? CATEGORY_GRADIENTS.Other;
  const fullName = `${blogger.user?.firstName || ""} ${blogger.user?.lastName || ""}`.trim();

  const serviceIcons = { Post: LuImage, Story: LuImage, Reel: LuVideo, Video: LuVideo, Live: LuMic, Unboxing: LuLayoutDashboard };
  const packages = Object.entries(blogger.pricing || {})
    .filter(([, v]) => v > 0)
    .map(([key, price]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      price: fmtPrice(price),
      rawPrice: price,
      Icon: serviceIcons[key.charAt(0).toUpperCase() + key.slice(1)] || LuImage,
      desc: {
        post: "Asosiy lenta postasi (doimiy)",
        story: "24-soatlik story (swipe-up link bilan)",
        reel: "Qisqa video / Reels formati",
        video: "To'liq integratsiya video",
        live: "Jonli efir reklamasi",
        unboxing: "Mahsulotni ochish ko'rsatmasi",
      }[key] || key,
    }));

  const minPrice = packages.length
    ? Math.min(...packages.map(p => p.rawPrice))
    : 0;

  const tabs = [
    { key: "pricing",  label: "Tariflar" },
    { key: "audience", label: "Auditoriya" },
    { key: "media",    label: "Media" },
    { key: "reviews",  label: `Sharhlar (${reviews.length})` },
  ];

  return (
    <>
      <style>{`
        .bd-layout { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }
        .bd-right  { position: sticky; top: 24px; }
        .bd-stats  { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
        .bd-tabs   { background:#fff; border-radius:16px; border:1.5px solid #e2e8f0; padding:4px; display:flex; gap:4px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .bd-tabs::-webkit-scrollbar { display:none; }
        .bd-tab-btn { flex-shrink:0; }
        .bd-card-pad { padding: 0 28px 28px; }

        @media (max-width: 900px) {
          .bd-layout { grid-template-columns: 1fr; }
          .bd-right  { position: static; }
        }
        @media (max-width: 600px) {
          .bd-stats    { grid-template-columns: repeat(2,1fr) !important; gap: 8px !important; }
          .bd-card-pad { padding: 0 16px 20px !important; }
          .bd-banner   { height: 90px !important; }
          .bd-avatar   { width: 68px !important; height: 68px !important; margin-top: -34px !important; border-radius: 16px !important; font-size: 22px !important; }
          .bd-2col     { grid-template-columns: 1fr !important; }
          .bd-pkg      { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .bd-pkg-price { text-align: left !important; margin-left: 0 !important; }
        }
        @media (max-width: 400px) {
          .bd-stats    { grid-template-columns: repeat(2,1fr) !important; gap: 6px !important; }
          .bd-stat     { padding: 10px 4px !important; }
          .bd-stat-val { font-size: 15px !important; }
          .bd-stat-lbl { font-size: 9px !important; }
          .bd-name     { font-size: 18px !important; }
          .bd-tabs     { gap: 2px !important; padding: 3px !important; }
          .bd-tab-btn  { padding: 8px 10px !important; font-size: 12px !important; }
          .bd-card-pad { padding: 0 12px 16px !important; }
        }

        .bd-tab-btn:hover { color: #dc2626 !important; }
        .bd-pkg:hover  { border-color: #fecaca !important; background: #fffafa !important; }
        .bd-stat:hover { border-color: #fecaca !important; }
        .bd-order-btn:hover  { background: #b91c1c !important; }
        .bd-heart-btn:hover  { border-color: rgba(220,38,38,0.5) !important; }
      `}</style>

      <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1120, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* Back */}
        <Link to="/bloggers" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          <LuArrowLeft size={15} /> Blogerlar ro'yxatiga qaytish
        </Link>

        <div className="bd-layout">

          {/* ══════ LEFT ══════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Profile hero card */}
            <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>

              {/* Gradient banner */}
              <div className="bd-banner" style={{ height: 120, background: gradient, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.12)" }} />
                {/* Platform badge */}
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                  padding: "4px 12px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.3)",
                }}>
                  {PLATFORM_DISPLAY[plat] ?? plat}
                </div>
              </div>

              <div className="bd-card-pad" style={{ padding: "0 28px 28px" }}>
                {/* Avatar row */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -40, marginBottom: 16 }}>
                  <div className="bd-avatar" style={{
                    width: 80, height: 80, borderRadius: 20,
                    background: gradient, border: "4px solid #fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 800, color: "#fff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    overflow: "hidden", flexShrink: 0,
                  }}>
                    {blogger.user?.avatar
                      ? <img src={blogger.user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : fullName.charAt(0).toUpperCase()
                    }
                  </div>

                  {/* Rating pill */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: "6px 12px" }}>
                    <LuStar size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#92400e" }}>{blogger.rating?.toFixed(1) || "—"}</span>
                    <span style={{ fontSize: 11, color: "#a16207" }}>({blogger.reviewCount || reviews.length})</span>
                  </div>
                </div>

                {/* Name & info */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                    <h1 className="bd-name" style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 }}>{fullName}</h1>
                    {blogger.isVerified && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                        <LuCheck size={11} /> Tasdiqlangan
                      </span>
                    )}
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 12px" }}>@{blogger.handle}</p>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "#fef2f2", color: "#dc2626", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #fecaca" }}>
                      {CATEGORY_LABELS[cat] ?? cat}
                    </span>
                    {blogger.location && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f8fafc", color: "#64748b", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                        <LuMapPin size={12} /> {blogger.location}
                      </span>
                    )}
                    {blogger.language?.length > 0 && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f8fafc", color: "#64748b", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                        <LuGlobe size={12} /> {blogger.language.join(", ").toUpperCase()}
                      </span>
                    )}
                  </div>

                  {blogger.bio && (
                    <p style={{ marginTop: 14, fontSize: 13.5, color: "#475569", lineHeight: 1.7, margin: "14px 0 0" }}>
                      {blogger.bio}
                    </p>
                  )}
                </div>

                {/* Stats strip */}
                <div className="bd-stats">
                  {[
                    { Icon: LuUsers,      label: "Obunachilar",  value: fmtNum(blogger.followers) },
                    { Icon: LuTrendingUp, label: "Engagement",   value: `${blogger.engagementRate}%` },
                    { Icon: LuStar,       label: "Reyting",      value: blogger.rating?.toFixed(1) || "—" },
                    { Icon: LuCheck,      label: "Kampaniyalar", value: `${blogger.stats?.completedCampaigns || 0}+` },
                  ].map(s => (
                    <div key={s.label} className="bd-stat" style={{ textAlign: "center", background: "#f8fafc", borderRadius: 14, padding: "14px 8px", border: "1.5px solid #f1f5f9", transition: "border-color 0.2s" }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                        <div style={{ background: "#fef2f2", color: "#dc2626", padding: 7, borderRadius: 10, display: "flex" }}>
                          <s.Icon size={14} />
                        </div>
                      </div>
                      <div className="bd-stat-val" style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
                      <div className="bd-stat-lbl" style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bd-tabs">
              {tabs.map(t => (
                <button
                  key={t.key}
                  className="bd-tab-btn"
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    flex: 1, padding: "10px 14px", border: "none", borderRadius: 12, cursor: "pointer",
                    fontSize: 13, fontWeight: 700, transition: "all 0.2s", whiteSpace: "nowrap",
                    background: activeTab === t.key ? "#fef2f2" : "transparent",
                    color: activeTab === t.key ? "#dc2626" : "#64748b",
                    boxShadow: activeTab === t.key ? "0 2px 8px rgba(220,38,38,0.12)" : "none",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Tariflar ── */}
            {activeTab === "pricing" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {packages.length === 0 && (
                  <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    Narxlar kiritilmagan
                  </div>
                )}
                {packages.map(pkg => (
                  <div key={pkg.name} className="bd-pkg" style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 18px", border: "1.5px solid #e2e8f0", borderRadius: 16,
                    background: "#fff", transition: "all 0.2s", cursor: "default",
                  }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ background: "#fef2f2", color: "#dc2626", padding: 10, borderRadius: 12, display: "flex", flexShrink: 0 }}>
                        <pkg.Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{pkg.name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{pkg.desc}</div>
                      </div>
                    </div>
                    <div className="bd-pkg-price" style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontWeight: 900, fontSize: 16, color: "#0f172a" }}>
                        {pkg.price}
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", marginLeft: 3 }}>so'm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Auditoriya ── */}
            {activeTab === "audience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* 2-column stats */}
                <div className="bd-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { Icon: LuUsers,       label: "Obunachilar soni", value: fmtNum(blogger.followers) },
                    { Icon: LuTrendingUp,  label: "Engagement Rate",  value: `${blogger.engagementRate}%` },
                    { Icon: LuCalendar,    label: "Yosh guruhi",      value: blogger.audienceAge || "—" },
                    { Icon: LuChartColumn, label: "Followers oralig'i", value: blogger.followersRange || "—" },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div style={{ background: "#fef2f2", color: "#dc2626", padding: 7, borderRadius: 10, display: "flex" }}>
                          <item.Icon size={14} />
                        </div>
                        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{item.label}</span>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a" }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Jins taqsimoti */}
                {blogger.audienceGender && (
                  <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Jins taqsimoti</div>
                    {(() => {
                      const text = blogger.audienceGender;
                      const erkakMatch = text.match(/(\d+)%\s*erkak/i);
                      const ayolMatch  = text.match(/(\d+)%\s*ayol/i);
                      const erkak = erkakMatch ? parseInt(erkakMatch[1]) : 50;
                      const ayol  = ayolMatch  ? parseInt(ayolMatch[1])  : 50;
                      return (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                            <span style={{ fontSize: 13, color: "#3b82f6", fontWeight: 700 }}>👨 Erkak — {erkak}%</span>
                            <span style={{ fontSize: 13, color: "#ec4899", fontWeight: 700 }}>👩 Ayol — {ayol}%</span>
                          </div>
                          <div style={{ background: "#f1f5f9", borderRadius: 99, height: 10, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${erkak}%`, background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 99, transition: "width 0.8s" }} />
                          </div>
                          <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>{text}</div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Joylashuv & til */}
                {(blogger.location || blogger.language?.length > 0) && (
                  <div className="bd-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {blogger.location && (
                      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <LuMapPin size={14} style={{ color: "#dc2626" }} />
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Joylashuv</span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{blogger.location}</div>
                      </div>
                    )}
                    {blogger.language?.length > 0 && (
                      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <LuGlobe size={14} style={{ color: "#dc2626" }} />
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Tili</span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{blogger.language.map(l => l.toUpperCase()).join(", ")}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Platformalar */}
                <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Platformalar</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {(blogger.platforms || []).map(p => (
                      <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "8px 16px" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{PLATFORM_DISPLAY[p] ?? p}</span>
                        {blogger.socialLinks?.[p] && (
                          <a href={blogger.socialLinks[p]} target="_blank" rel="noreferrer" style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>↗</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Xizmatlar */}
                {blogger.services?.length > 0 && (
                  <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Taklif etiladigan xizmatlar</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {blogger.services.map(s => (
                        <span key={s} style={{ background: "#fef2f2", color: "#dc2626", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #fecaca" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Media ── */}
            {activeTab === "media" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Social links */}
                {(() => {
                  const SOCIALS = [
                    {
                      key: "instagram", label: "Instagram",
                      Icon: FaInstagram,
                      color: "#e1306c", bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                      textColor: "#fff",
                    },
                    {
                      key: "youtube", label: "YouTube",
                      Icon: FaYoutube,
                      color: "#ff0000", bg: "#ff0000",
                      textColor: "#fff",
                    },
                    {
                      key: "telegram", label: "Telegram",
                      Icon: FaTelegram,
                      color: "#2aabee", bg: "#2aabee",
                      textColor: "#fff",
                    },
                    {
                      key: "tiktok", label: "TikTok",
                      Icon: FaTiktok,
                      color: "#010101", bg: "#010101",
                      textColor: "#fff",
                    },
                  ];
                  const active = SOCIALS.filter(s => blogger.socialLinks?.[s.key]);
                  if (!active.length) return null;
                  return (
                    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Ijtimoiy tarmoqlar</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {active.map(s => (
                          <a
                            key={s.key}
                            href={blogger.socialLinks[s.key]}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <div style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "14px 18px", borderRadius: 14,
                              border: "1.5px solid #e2e8f0", background: "#f8fafc",
                              transition: "all 0.2s", cursor: "pointer",
                            }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.background = "#fffafa"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <s.Icon size={20} color={s.textColor} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{s.label}</div>
                                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {blogger.socialLinks[s.key]}
                                  </div>
                                </div>
                              </div>
                              <LuExternalLink size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Portfolio */}
                {blogger.portfolio && (
                  <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <LuBriefcase size={15} style={{ color: "#dc2626" }} /> Portfolio
                    </div>
                    <a
                      href={blogger.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px", borderRadius: 14,
                        border: "1.5px solid #fecaca", background: "#fef2f2",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ background: "#dc2626", padding: 10, borderRadius: 11, display: "flex" }}>
                            <LuLink size={16} color="#fff" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#dc2626" }}>Portfolio saytiga o'tish</div>
                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {blogger.portfolio}
                            </div>
                          </div>
                        </div>
                        <LuExternalLink size={16} style={{ color: "#dc2626", flexShrink: 0 }} />
                      </div>
                    </a>
                  </div>
                )}

                {/* Website */}
                {blogger.website && (
                  <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <LuGlobe size={15} style={{ color: "#dc2626" }} /> Veb-sayt
                    </div>
                    <a href={blogger.website} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px", borderRadius: 14,
                        border: "1.5px solid #e2e8f0", background: "#f8fafc",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ background: "#0f172a", padding: 10, borderRadius: 11, display: "flex" }}>
                            <LuGlobe size={16} color="#fff" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>Rasmiy veb-sayt</div>
                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {blogger.website}
                            </div>
                          </div>
                        </div>
                        <LuExternalLink size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                      </div>
                    </a>
                  </div>
                )}

                {/* YouTube embed preview */}
                {(() => {
                  const ytUrl = blogger.socialLinks?.youtube;
                  if (!ytUrl) return null;
                  const match = ytUrl.match(/(?:channel\/|@)([\w-]+)/);
                  return (
                    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <LuPlay size={15} style={{ color: "#dc2626" }} /> YouTube kanali
                      </div>
                      <div style={{ background: "#000", borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <div style={{ textAlign: "center", color: "#fff" }}>
                          <FaYoutube size={48} color="#ff0000" style={{ marginBottom: 12 }} />
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                            {match ? `@${match[1]}` : "YouTube kanal"}
                          </div>
                          <a
                            href={ytUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ff0000", color: "#fff", padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: "none" }}
                          >
                            <LuExternalLink size={13} /> Kanalni ko'rish
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Empty state */}
                {!blogger.portfolio && !blogger.website &&
                  !Object.values(blogger.socialLinks || {}).some(Boolean) && (
                    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "56px 20px", textAlign: "center" }}>
                      <LuLink size={40} style={{ color: "#e2e8f0", marginBottom: 14 }} />
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Media ma'lumotlari yo'q</div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>Bu bloger hali ijtimoiy tarmoq yoki portfolio qo'shmagan</div>
                    </div>
                  )}
              </div>
            )}

            {/* ── Sharhlar ── */}
            {activeTab === "reviews" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reviews.length === 0 ? (
                  <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "56px 20px", textAlign: "center" }}>
                    <LuMessageCircle size={40} style={{ color: "#e2e8f0", marginBottom: 14 }} />
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Hali sharhlar yo'q</div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>Bu bloger uchun hali biror sharh qoldirilmagan</div>
                  </div>
                ) : (
                  <>
                    {/* Rating summary */}
                    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "22px 24px", display: "flex", alignItems: "center", gap: 28 }}>
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: 52, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{blogger.rating?.toFixed(1) || "0.0"}</div>
                        <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 8 }}>{stars(blogger.rating || 0)}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>{blogger.reviewCount || reviews.length} ta sharh</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map(r => {
                          const cnt = reviews.filter(rv => Math.round(rv.rating) === r).length;
                          const pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
                          return (
                            <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                              <span style={{ fontSize: 11, color: "#64748b", width: 8, textAlign: "right" }}>{r}</span>
                              <LuStar size={11} style={{ color: "#f59e0b", fill: "#f59e0b", flexShrink: 0 }} />
                              <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 99, height: 7, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #f59e0b, #fbbf24)", borderRadius: 99, transition: "width 0.8s" }} />
                              </div>
                              <span style={{ fontSize: 11, color: "#94a3b8", width: 18, textAlign: "right" }}>{cnt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review cards */}
                    {reviews.map(rv => (
                      <div key={rv._id} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: 800, color: "#fff", overflow: "hidden",
                          }}>
                            {rv.reviewer?.avatar
                              ? <img src={rv.reviewer.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : (rv.reviewer?.firstName?.[0] || "?").toUpperCase()
                            }
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 2 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                                  {rv.reviewer?.firstName} {rv.reviewer?.lastName}
                                </span>
                                {rv.isVerified && (
                                  <span style={{ color: "#16a34a", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                                    <LuBadgeCheck size={13} /> Tasdiqlangan
                                  </span>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: 2 }}>{stars(rv.rating)}</div>
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
                              {new Date(rv.createdAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })}
                            </div>
                            {rv.comment && (
                              <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: 0 }}>{rv.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* ══════ RIGHT (sticky sidebar) ══════ */}
          <div className="bd-right">

            {/* Action card */}
            <div style={{ background: "#0f172a", borderRadius: 24, padding: 24, color: "#fff", marginBottom: 16 }}>

              {/* Mini profile */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, overflow: "hidden", flexShrink: 0 }}>
                  {blogger.user?.avatar
                    ? <img src={blogger.user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : fullName.charAt(0)
                  }
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>@{blogger.handle}</div>
                </div>
              </div>

              {/* Price */}
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Boshlang'ich narx</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>
                  {fmtPrice(minPrice)}
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b", marginLeft: 5 }}>so'mdan</span>
                </div>
              </div>

              {/* Buttons */}
              <button
                className="bd-order-btn"
                onClick={() => setIsOrderOpen(true)}
                style={{ width: "100%", padding: "14px 0", background: "#dc2626", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10, transition: "background 0.2s" }}
              >
                Buyurtma berish
              </button>
              <button
                onClick={() => setIsMsgOpen(true)}
                style={{ width: "100%", padding: "14px 0", background: "rgba(255,255,255,0.07)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
              >
                <LuMessageCircle size={15} /> Xabar yuborish
              </button>
              <button
                className="bd-heart-btn"
                onClick={toggleWishlist}
                style={{
                  width: "100%", padding: "12px 0",
                  background: inWishlist ? "rgba(220,38,38,0.18)" : "rgba(255,255,255,0.05)",
                  color: inWishlist ? "#f87171" : "rgba(255,255,255,0.65)",
                  border: `1.5px solid ${inWishlist ? "rgba(220,38,38,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 14, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  fontSize: 13, transition: "all 0.2s",
                }}
              >
                <LuHeart size={14} style={{ fill: inWishlist ? "#f87171" : "none" }} />
                {inWishlist ? "Saqlanganlardan o'chirish" : "Saqlanganlariga qo'shish"}
              </button>

              {/* Safety note */}
              <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 12, fontSize: 11.5, color: "#64748b", display: "flex", gap: 8, lineHeight: 1.55 }}>
                <LuInfo size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                To'lov xavfsizligi kafolatlanadi. Mablag' bloger ishini tugatgandan so'ng o'tkazib beriladi.
              </div>
            </div>

            {/* Stats card */}
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Kampaniya statistikasi</div>
              {[
                { label: "Jami kampaniyalar",      value: blogger.stats?.totalCampaigns || 0 },
                { label: "Yakunlangan",             value: blogger.stats?.completedCampaigns || 0 },
                { label: "Muvaffaqiyat darajasi",   value: blogger.stats?.totalCampaigns
                    ? `${Math.round((blogger.stats.completedCampaigns / blogger.stats.totalCampaigns) * 100)}%`
                    : "—" },
              ].map((s, i, arr) => (
                <div key={s.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #f1f5f9" : "none",
                }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isOrderOpen && <OrderModal onClose={() => setIsOrderOpen(false)} bloggerName={fullName} packages={packages} />}
      {isMsgOpen  && <MessageModal onClose={() => setIsMsgOpen(false)} bloggerName={fullName} />}
    </>
  );
}

/* ─── Order Modal ────────────────────────────────────────── */
function OrderModal({ onClose, bloggerName, packages }) {
  const [selectedPkg, setSelectedPkg] = useState(packages[0]?.name || "");

  return (
    <div style={ov}>
      <div style={mc}>
        <div style={mh}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>Reklama buyurtmasi</h3>
          <button onClick={onClose} style={cb}><LuX size={20} /></button>
        </div>
        <p style={{ margin: "6px 0 20px", fontSize: 13, color: "#64748b" }}>{bloggerName} uchun buyurtma</p>
        <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Loyiha / Brend nomi</label>
            <input type="text" placeholder="Masalan: 'Poytaxt' o'quv markazi" style={inp} />
          </div>
          <div>
            <label style={lbl}>Reklama formati</label>
            <select value={selectedPkg} onChange={e => setSelectedPkg(e.target.value)} style={inp}>
              {packages.map(p => (
                <option key={p.name} value={p.name}>{p.name} — {p.price} so'm</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Maqsad va havola</label>
            <textarea placeholder="Reklama haqida qisqacha ma'lumot va linklar..." style={{ ...inp, height: 90, resize: "none" }} />
          </div>
          <button type="button" onClick={() => { toast.success("Buyurtma yuborildi!"); onClose(); }} style={pbtn}>
            So'rovni yuborish
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Message Modal ──────────────────────────────────────── */
function MessageModal({ onClose, bloggerName }) {
  return (
    <div style={ov}>
      <div style={mc}>
        <div style={mh}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{bloggerName}ga xabar</h3>
          <button onClick={onClose} style={cb}><LuX size={20} /></button>
        </div>
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 13.5, color: "#64748b", marginBottom: 16, lineHeight: 1.6 }}>
            Savollaringiz bo'lsa to'g'ridan-to'g'ri blogerga yozishingiz mumkin.
          </p>
          <textarea placeholder="Xabaringizni yozing..." style={{ ...inp, height: 140, resize: "none" }} />
          <button type="button" onClick={() => { toast.success("Xabar yuborildi!"); onClose(); }} style={{ ...pbtn, marginTop: 16 }}>
            Xabarni jo'natish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared modal styles ────────────────────────────────── */
const ov   = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(4px)" };
const mc   = { background: "#fff", width: "100%", maxWidth: 500, borderRadius: 24, padding: "28px 32px", boxShadow: "0 24px 48px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" };
const mh   = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const cb   = { border: "none", background: "#f8fafc", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" };
const lbl  = { display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" };
const inp  = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#0f172a" };
const pbtn = { width: "100%", padding: 15, background: "#dc2626", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer" };
