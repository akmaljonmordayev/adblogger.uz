import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LuArrowRight, LuStar, LuZap, LuShield, LuTrendingUp,
  LuUsers, LuAward, LuCircleCheck, LuInstagram, LuYoutube,
  LuMessageCircle, LuPlay, LuQuote, LuSend, LuRocket,
  LuTarget, LuHandshake, LuSparkles, LuGlobe, LuFlame,
  LuEye, LuCrown, LuBadgeCheck, LuActivity, LuBuilding2,
  LuDollarSign, LuClock,
} from "react-icons/lu";
import { ROUTE_PATHS } from "../config/constants";
import api from "../services/api";

/* ── Fonts ── */
if (!document.getElementById("home-fonts")) {
  const l = document.createElement("link");
  l.id = "home-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

const S = { fontFamily: "'Syne', sans-serif" };

/* ── Animated counter ── */
function Counter({ end, suffix = "", duration = 2200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
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
    }, { threshold: 0.4 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Section label ── */
function Label({ children, color = "#dc2626", bg = "#fef2f2", border = "#fecaca", Icon = LuSparkles }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: bg, color, border: `1px solid ${border}`,
      fontSize: 10, fontWeight: 700, letterSpacing: "2.5px",
      textTransform: "uppercase", padding: "5px 14px",
      borderRadius: 100, marginBottom: 18,
    }}>
      <Icon size={11} strokeWidth={2.5} />{children}
    </div>
  );
}

/* ── Skeleton loader ── */
function Skeleton({ w = "100%", h = 20, r = 8, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}

/* ── Helpers ── */
const CATEGORY_LABELS = {
  technology: "Texnologiya", beauty: "Go'zallik", travel: "Sayohat",
  food: "Ovqat", fashion: "Moda", fitness: "Sport",
  entertainment: "Ko'ngilochar", education: "Ta'lim",
  business: "Biznes", gaming: "O'yinlar", lifestyle: "Lifestyle", other: "Boshqa",
};
const PLATFORM_LABELS = { instagram: "Instagram", youtube: "YouTube", telegram: "Telegram", tiktok: "TikTok" };
const PLATFORM_COLORS = { instagram: "#e1306c", youtube: "#ff0000", telegram: "#2aabee", tiktok: "#111827" };
const CAT_GRADS = {
  technology: "135deg,#1e3a5f,#2563eb", beauty: "135deg,#831843,#ec4899",
  travel: "135deg,#064e3b,#10b981",     food: "135deg,#78350f,#f59e0b",
  fashion: "135deg,#4c1d95,#7c3aed",    fitness: "135deg,#052e16,#16a34a",
  entertainment: "135deg,#1a1a2e,#7c3aed", education: "135deg,#0c4a6e,#0891b2",
  default: "135deg,#7f1d1d,#dc2626",
};
const BLOG_COLORS = {
  marketing:  { tc: "#dc2626", bg: "#fef2f2", grad: "135deg,#7f1d1d,#dc2626" },
  blogerlar:  { tc: "#2563eb", bg: "#eff6ff", grad: "135deg,#1e3a5f,#3b82f6" },
  bloggerlar: { tc: "#2563eb", bg: "#eff6ff", grad: "135deg,#1e3a5f,#3b82f6" },
  biznes:     { tc: "#7c3aed", bg: "#f5f3ff", grad: "135deg,#4c1d95,#7c3aed" },
  texnologiya:{ tc: "#0891b2", bg: "#ecfeff", grad: "135deg,#0c4a6e,#0891b2" },
  default:    { tc: "#16a34a", bg: "#f0fdf4", grad: "135deg,#052e16,#16a34a" },
};

function fmtFollowers(n) {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K`;
  return String(n);
}
function fmtPrice(n) {
  if (!n) return null;
  return Number(n).toLocaleString("uz-UZ");
}
function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "AD";
}
function mapBlogger(b) {
  const name   = `${b.user?.firstName || ""} ${b.user?.lastName || ""}`.trim();
  const cat    = b.categories?.[0] || "default";
  const plat   = b.platforms?.[0] || "instagram";
  const prices = Object.values(b.pricing || {}).filter(v => v > 0).sort((a, c) => a - c);
  return {
    id:       b._id,
    name,
    handle:   b.handle ? `@${b.handle}` : `@${name.toLowerCase().replace(/\s+/g, "_")}`,
    cat:      CATEGORY_LABELS[cat] || cat,
    platform: PLATFORM_LABELS[plat] || plat,
    followers: fmtFollowers(b.followers),
    eng:      b.engagementRate ? `${Number(b.engagementRate).toFixed(1)}%` : "—",
    price:    prices[0] ? fmtPrice(prices[0]) : null,
    g:        CAT_GRADS[cat] || CAT_GRADS.default,
    init:     getInitials(name),
    pc:       PLATFORM_COLORS[plat] || "#111827",
    avatar:   b.user?.avatar,
  };
}
function mapBlog(p) {
  const key    = p.category?.toLowerCase() || "default";
  const colors = BLOG_COLORS[key] || BLOG_COLORS.default;
  const date   = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })
    : "";
  return {
    id:    p._id,
    tag:   p.category || "Blog",
    ...colors,
    title: p.title,
    desc:  p.excerpt || (p.content || "").slice(0, 120),
    date,
    read:  "5 min",
    cover: p.coverImage || null,
  };
}

/* ─────────────── STATIC DATA ─────────────── */
const STATS = [
  { end: 500,  suffix: "+",  label: "Tasdiqlangan\nBloger",  icon: <LuUsers size={22}/>,     color: "#dc2626", bg: "#fef2f2" },
  { end: 12,   suffix: "M+", label: "Faol\nAuditoriya",      icon: <LuEye size={22}/>,        color: "#2563eb", bg: "#eff6ff" },
  { end: 200,  suffix: "+",  label: "Ishonchli\nBrend",      icon: <LuBuilding2 size={22}/>,  color: "#7c3aed", bg: "#f5f3ff" },
  { end: 98,   suffix: "%",  label: "Mamnuniyat\nDarajasi",  icon: <LuStar size={22}/>,       color: "#d97706", bg: "#fffbeb" },
];
const STEPS = [
  { n: "01", Icon: LuTarget,    color: "#dc2626", bg: "#fef2f2", title: "Bloger tanlang",    desc: "500+ tasdiqlangan bloger ichidan o'z brendingizga mos influencerni kategoriya va auditoriya bo'yicha filtrlang." },
  { n: "02", Icon: LuHandshake, color: "#2563eb", bg: "#eff6ff", title: "Kelishuv tuzing",   desc: "Bloger bilan to'g'ridan-to'g'ri muloqot qiling. Shartlarni muvofiqlashtiring va xavfsiz shartnoma imzolang." },
  { n: "03", Icon: LuRocket,    color: "#16a34a", bg: "#f0fdf4", title: "Natija oling",      desc: "Kampaniyangiz ishga tushadi. Real vaqtda statistikani kuzating va ROI ni o'lchang." },
];
const PLATFORMS = [
  { label: "Instagram", Icon: LuInstagram,     color: "#e1306c", bg: "#fdf2f8", count: "180+", desc: "Blogerlar" },
  { label: "YouTube",   Icon: LuYoutube,       color: "#ff0000", bg: "#fff5f5", count: "95+",  desc: "Blogerlar" },
  { label: "Telegram",  Icon: LuMessageCircle, color: "#2aabee", bg: "#f0f9ff", count: "140+", desc: "Kanallar"  },
  { label: "TikTok",    Icon: LuPlay,          color: "#111827", bg: "#f9fafb", count: "85+",  desc: "Blogerlar" },
];
const TESTIMONIALS = [
  { text: "adblogger orqali 3 oyda brendimiz kanalining obunachilari 40%ga oshdi. Platforma juda qulay va blogerlar sifatli!", name: "Akbar Mirzayev",   role: "Marketing Director · TechUz",        init: "AM", color: "#dc2626", stars: 5 },
  { text: "Bloger sifatida ro'yxatdan o'tganimdan keyin bir oyda 3 ta brend bilan shartnoma tuzdim. Daromadim ikki hissa oshdi!", name: "Nilufar Qodirov",  role: "Lifestyle Blogger · 250K followers", init: "NQ", color: "#2563eb", stars: 5 },
  { text: "Real vaqtda kampaniya statistikasini kuzatib borish — bu bizni eng ko'p quvontirgan narsa. ROI 3× bo'ldi!", name: "Sherzod Tursunov", role: "CEO · FoodChain Uz",                  init: "ST", color: "#7c3aed", stars: 5 },
];
const FEATURES = [
  { Icon: LuZap,       color: "#d97706", bg: "#fffbeb", border: "#fde68a", title: "Tezkor joylash",    desc: "2 daqiqada e'lon bering. Hech qanday texnik bilim kerak emas." },
  { Icon: LuShield,    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", title: "100% Xavfsiz",      desc: "Barcha to'lovlar himoyalangan. Blogerlar moderatsiyadan o'tgan." },
  { Icon: LuActivity,  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", title: "Real Statistika",   desc: "Kampaniyangiz natijalarini real vaqtda kuzating." },
  { Icon: LuCrown,     color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", title: "Premium Blogerlar", desc: "Faqat tasdiqlangan va sifatli blogerlar platformada." },
  { Icon: LuDollarSign,color: "#dc2626", bg: "#fef2f2", border: "#fecaca", title: "Qulay Narxlar",     desc: "Har qanday byudjetga mos tarif rejalari mavjud." },
  { Icon: LuGlobe,     color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", title: "Keng Auditoriya",   desc: "O'zbekiston bo'ylab 12M+ faol foydalanuvchiga yeting." },
];

/* ═══════════════════════════════════════════════════ */
export default function Home() {
  const [activeT, setActiveT] = useState(0);
  const [hoveredBlogger, setHoveredBlogger] = useState(null);
  const [hoveredBlog, setHoveredBlog] = useState(null);

  /* ── API state ── */
  const [bloggers, setBloggers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [bloggersLoading, setBloggersLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  /* ── Testimonials auto-rotate ── */
  useEffect(() => {
    const t = setInterval(() => setActiveT(v => (v + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  /* ── Fetch top bloggers ── */
  const fetchBloggers = useCallback(async () => {
    try {
      const res = await api.get("/bloggers", {
        params: { limit: 4, isVerified: true, sort: "-rating" },
      });
      const data = (res.data.data || []).map(mapBlogger);
      setBloggers(data);
    } catch {
      setBloggers([]);
    } finally {
      setBloggersLoading(false);
    }
  }, []);

  /* ── Fetch latest blog posts ── */
  const fetchBlogs = useCallback(async () => {
    try {
      const res = await api.get("/blogs", {
        params: { limit: 3, isPublished: true, sort: "-createdAt" },
      });
      const data = (res.data.data || []).map(mapBlog);
      setBlogs(data);
    } catch {
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBloggers();
    fetchBlogs();
  }, [fetchBloggers, fetchBlogs]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8fafc", overflowX: "hidden" }}>
      <SEO
        canonical="/"
        description="O'zbekistonning eng yirik blogger va reklama platformasi. 500+ tasdiqlangan blogger. Biznes va bloggerlarni birlashtiradi. Reklama joylashtiring yoki daromad oling!"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "ADBlogger — O'zbekiston Blogger va Reklama Platformasi",
          "url": "https://adblogger.uz/",
          "description": "O'zbekistonning eng yirik blogger va reklama platformasi",
          "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://adblogger.uz/" }] }
        }}
      />

      {/* ══════════════════════════
          STATS BAR
      ══════════════════════════ */}
      <section style={{ background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div className="hp-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "24px 16px",
                borderRight: i < 3 ? "1px solid #f1f5f9" : "none",
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                  background: s.bg, color: s.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{s.icon}</div>
                <div>
                  <div style={{ ...S, fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>
                    <Counter end={s.end} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 3, fontWeight: 500, lineHeight: 1.4, whiteSpace: "pre-line" }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          FEATURES GRID
      ══════════════════════════ */}
      <section style={{ padding: "88px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Label Icon={LuZap} color="#d97706" bg="#fffbeb" border="#fde68a">Platforma imkoniyatlari</Label>
          <h2 style={{ ...S, fontWeight: 800, fontSize: "clamp(28px,4vw,42px)", color: "#0f172a", margin: "0 0 14px", lineHeight: 1.12 }}>
            Nima uchun bizni{" "}
            <span style={{ background: "linear-gradient(90deg,#dc2626,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>tanlashadi?</span>
          </h2>
          <p style={{ fontSize: 15.5, color: "#64748b", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            O'zbekistoning yetakchi influencer marketplace platformasi — tez, xavfsiz va samarali.
          </p>
        </div>
        <div className="hp-feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 22, padding: "32px 28px",
              border: `1px solid ${f.border}22`,
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              transition: "transform .28s, box-shadow .28s, border-color .28s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 48px ${f.color}18`; e.currentTarget.style.borderColor = f.border; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = `${f.border}22`; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <f.Icon size={24} strokeWidth={1.8} />
              </div>
              <h3 style={{ ...S, fontWeight: 700, fontSize: 17, color: "#0f172a", margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════
          HOW IT WORKS
      ══════════════════════════ */}
      <section style={{ background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "88px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label Icon={LuClock} color="#2563eb" bg="#eff6ff" border="#bfdbfe">Qanday ishlaydi?</Label>
            <h2 style={{ ...S, fontWeight: 800, fontSize: "clamp(28px,4vw,42px)", color: "#0f172a", margin: "0 0 14px", lineHeight: 1.12 }}>
              3 qadamda{" "}<span style={{ color: "#2563eb" }}>kampaniyangizni</span> ishga tushiring
            </h2>
            <p style={{ fontSize: 15.5, color: "#64748b", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Hech qanday texnik bilim talab etilmaydi. Tizimdan foydalanish juda sodda.
            </p>
          </div>
          <div className="hp-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, position: "relative" }}>
            <div className="hp-connector" style={{ position: "absolute", top: 60, left: "calc(16.67% + 16px)", right: "calc(16.67% + 16px)", height: 1, background: "linear-gradient(90deg, #fecaca 0%, #bfdbfe 50%, #bbf7d0 100%)", zIndex: 0 }} />
            {STEPS.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 24, padding: "38px 32px", border: "1.5px solid #f1f5f9", boxShadow: "0 4px 24px rgba(0,0,0,0.05)", position: "relative", zIndex: 1, transition: "transform .28s, box-shadow .28s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = `0 24px 56px ${s.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ position: "absolute", top: -1, right: 24, background: s.color, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "1.5px", padding: "4px 12px", borderRadius: "0 0 10px 10px", ...S }}>QADAM {s.n}</div>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                  <s.Icon size={28} strokeWidth={1.7} />
                </div>
                <h3 style={{ ...S, fontWeight: 800, fontSize: 19, color: "#0f172a", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          TOP BLOGGERS (real API)
      ══════════════════════════ */}
      <section style={{ padding: "88px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, gap: 16, flexWrap: "wrap" }}>
          <div>
            <Label Icon={LuFlame} color="#dc2626" bg="#fef2f2" border="#fecaca">Top Blogerlar</Label>
            <h2 style={{ ...S, fontWeight: 800, fontSize: "clamp(26px,3.5vw,38px)", color: "#0f172a", margin: 0, lineHeight: 1.15 }}>
              Eng ta'sirchan<br /><span style={{ color: "#dc2626" }}>influencerlar</span>
            </h2>
          </div>
          <Link to={ROUTE_PATHS.BLOGGERS} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, fontSize: 13.5, background: "linear-gradient(135deg,#dc2626,#b91c1c)", textDecoration: "none", padding: "11px 22px", borderRadius: 12, boxShadow: "0 4px 18px rgba(220,38,38,0.3)", transition: "transform .2s, box-shadow .2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(220,38,38,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(220,38,38,0.3)"; }}
          >
            Barchasini ko'rish <LuArrowRight size={15} />
          </Link>
        </div>

        <div className="hp-bloggers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {bloggersLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 22, overflow: "hidden", border: "1px solid #f1f5f9" }}>
                  <div style={{ height: 86, background: "#f1f5f9" }} />
                  <div style={{ padding: "8px 18px 18px" }}>
                    <Skeleton h={14} r={7} mb={10} />
                    <Skeleton w="60%" h={12} r={6} mb={12} />
                    <Skeleton h={60} r={11} mb={12} />
                    <Skeleton h={36} r={10} />
                  </div>
                </div>
              ))
            : bloggers.length > 0
              ? bloggers.map((b, i) => (
                  <div key={b.id || i}
                    onMouseEnter={() => setHoveredBlogger(i)}
                    onMouseLeave={() => setHoveredBlogger(null)}
                    style={{ background: "#fff", borderRadius: 22, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: hoveredBlogger === i ? "0 24px 56px rgba(0,0,0,0.13)" : "0 4px 20px rgba(0,0,0,0.06)", transform: hoveredBlogger === i ? "translateY(-8px)" : "none", transition: "transform .3s, box-shadow .3s", cursor: "pointer" }}
                  >
                    {/* Card top strip */}
                    <div style={{ height: 86, background: `linear-gradient(${b.g})`, position: "relative" }}>
                      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                      <div style={{ position: "absolute", top: 10, right: 10, background: b.pc, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 7, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>{b.platform}</div>
                      <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 4 }}>
                        <LuBadgeCheck size={10} /> Tasdiqlangan
                      </div>
                    </div>

                    {/* Avatar */}
                    <div style={{ padding: "0 18px", marginTop: -24, position: "relative", zIndex: 1 }}>
                      {b.avatar
                        ? <img src={b.avatar} alt={b.name} style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }} />
                        : <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(${b.g})`, border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, boxShadow: "0 4px 14px rgba(0,0,0,0.18)", ...S }}>{b.init}</div>
                      }
                    </div>

                    {/* Info */}
                    <div style={{ padding: "10px 18px 0" }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a" }}>{b.name}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}>{b.handle}</div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 9, background: "#f8fafc", color: "#475569", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 7, border: "1px solid #f1f5f9" }}>
                        <LuSparkles size={10} />{b.cat}
                      </span>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "14px 18px" }}>
                      {[
                        { label: "Followers",  val: b.followers, color: "#dc2626" },
                        { label: "Engagement", val: b.eng,       color: "#374151" },
                      ].map((st, j) => (
                        <div key={j} style={{ background: "#f8fafc", borderRadius: 11, padding: "9px 11px", border: "1px solid #f1f5f9" }}>
                          <div style={{ fontWeight: 800, fontSize: 15, color: st.color }}>{st.val}</div>
                          <div style={{ fontSize: 9.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginTop: 1 }}>{st.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "12px 18px 16px", borderTop: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 9.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>Narx / post</div>
                        {b.price
                          ? <div style={{ ...S, fontWeight: 800, fontSize: 16, color: "#0f172a", marginTop: 2 }}>{b.price} <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>so'm</span></div>
                          : <div style={{ ...S, fontWeight: 600, fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Kelishiladi</div>
                        }
                      </div>
                      <Link to={`/bloggers/${b.id}`} style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 10, textDecoration: "none", boxShadow: "0 3px 12px rgba(220,38,38,0.25)", transition: "box-shadow .2s, transform .2s" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 22px rgba(220,38,38,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 3px 12px rgba(220,38,38,0.25)"; e.currentTarget.style.transform = "none"; }}
                      >Ko'rish</Link>
                    </div>
                  </div>
                ))
              : /* Empty state */
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                  <LuUsers size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p style={{ margin: 0 }}>Blogerlar topilmadi</p>
                </div>
          }
        </div>
      </section>

      {/* ══════════════════════════
          PLATFORMS
      ══════════════════════════ */}
      <section style={{ background: "#fff", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Label Icon={LuGlobe} color="#0891b2" bg="#ecfeff" border="#a5f3fc">Platformalar</Label>
            <h2 style={{ ...S, fontWeight: 800, fontSize: "clamp(26px,3.5vw,38px)", color: "#0f172a", margin: "0 0 12px", lineHeight: 1.15 }}>
              Barcha platformalarda{" "}<span style={{ color: "#0891b2" }}>blogerlar bor</span>
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", maxWidth: 420, margin: "0 auto" }}>
              Instagram, YouTube, Telegram va TikTokdagi influencerlar bilan ishlang.
            </p>
          </div>
          <div className="hp-platforms-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {PLATFORMS.map((p, i) => (
              <div key={i} style={{ background: p.bg, borderRadius: 22, padding: "34px 24px", border: `1.5px solid ${p.color}22`, textAlign: "center", transition: "transform .28s, box-shadow .28s, border-color .28s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) scale(1.01)"; e.currentTarget.style.boxShadow = `0 20px 48px ${p.color}20`; e.currentTarget.style.borderColor = `${p.color}55`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${p.color}22`; }}
              >
                <div style={{ width: 60, height: 60, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 4px 16px ${p.color}18`, color: p.color }}>
                  <p.Icon size={28} />
                </div>
                <div style={{ ...S, fontWeight: 800, fontSize: 17, color: "#0f172a", marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: p.color, margin: "6px 0 2px" }}>{p.count}</div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          TESTIMONIALS
      ══════════════════════════ */}
      <section style={{ background: "linear-gradient(145deg, #0f172a 0%, #1a1f35 50%, #0f172a 100%)", padding: "96px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {[{ top: "-120px", left: "-120px", color: "rgba(220,38,38,0.12)" }, { bottom: "-80px", right: "-80px", color: "rgba(124,58,237,0.1)" }].map((g, i) => (
          <div key={i} style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: g.color, filter: "blur(90px)", pointerEvents: "none", top: g.top, left: g.left, bottom: g.bottom, right: g.right }} />
        ))}
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", padding: "5px 14px", borderRadius: 100, marginBottom: 18 }}>
              <LuStar size={11} strokeWidth={2.5} /> Mijozlar fikrlari
            </div>
            <h2 style={{ ...S, fontWeight: 800, fontSize: "clamp(26px,3.5vw,38px)", color: "#fff", margin: 0, lineHeight: 1.15 }}>
              Ular allaqachon{" "}
              <span style={{ background: "linear-gradient(90deg,#fbbf24,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ishonch bildirgan</span>
            </h2>
          </div>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ display: i === activeT ? "block" : "none", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", borderRadius: 28, padding: "44px 48px", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", animation: "fadeIn .4s ease" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${t.color}22`, color: t.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <LuQuote size={22} />
              </div>
              <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(255,255,255,0.88)", lineHeight: 1.75, margin: "0 0 32px", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0, ...S }}>{t.init}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                  {Array.from({ length: t.stars }).map((_, j) => <LuStar key={j} size={14} fill="#fbbf24" color="#fbbf24" />)}
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
            {TESTIMONIALS.map((t, i) => (
              <button key={i} onClick={() => setActiveT(i)} style={{ height: 4, borderRadius: 2, border: "none", cursor: "pointer", transition: "all .3s", width: i === activeT ? 36 : 14, background: i === activeT ? t.color : "rgba(255,255,255,0.2)", boxShadow: i === activeT ? `0 0 12px ${t.color}80` : "none" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          BLOG PREVIEW (real API)
      ══════════════════════════ */}
      <section style={{ padding: "88px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, gap: 16, flexWrap: "wrap" }}>
          <div>
            <Label Icon={LuTrendingUp} color="#16a34a" bg="#f0fdf4" border="#bbf7d0">Blog</Label>
            <h2 style={{ ...S, fontWeight: 800, fontSize: "clamp(26px,3.5vw,38px)", color: "#0f172a", margin: 0, lineHeight: 1.15 }}>
              Eng so'nggi{" "}<span style={{ color: "#16a34a" }}>maqolalar</span>
            </h2>
          </div>
          <Link to={ROUTE_PATHS.BLOGS} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#16a34a", fontWeight: 700, fontSize: 13.5, textDecoration: "none", padding: "11px 22px", borderRadius: 12, border: "1.5px solid #bbf7d0", background: "#f0fdf4", transition: "all .2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#16a34a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a"; e.currentTarget.style.borderColor = "#bbf7d0"; }}
          >
            Barchasini o'qish <LuArrowRight size={15} />
          </Link>
        </div>

        <div className="hp-blogs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {blogsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 22, overflow: "hidden", border: "1px solid #f1f5f9" }}>
                  <div style={{ height: 148, background: "#f1f5f9" }} />
                  <div style={{ padding: "22px" }}>
                    <Skeleton w="40%" h={12} r={6} mb={10} />
                    <Skeleton h={16} r={8} mb={8} />
                    <Skeleton h={13} r={6} mb={4} />
                    <Skeleton w="70%" h={13} r={6} />
                  </div>
                </div>
              ))
            : blogs.length > 0
              ? blogs.map((b, i) => (
                  <Link key={b.id || i} to={`/blogs/${b.id}`}
                    onMouseEnter={() => setHoveredBlog(i)}
                    onMouseLeave={() => setHoveredBlog(null)}
                    style={{ textDecoration: "none", display: "block", background: "#fff", borderRadius: 22, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: hoveredBlog === i ? "0 24px 56px rgba(0,0,0,0.1)" : "0 4px 20px rgba(0,0,0,0.05)", transform: hoveredBlog === i ? "translateY(-8px)" : "none", transition: "transform .3s, box-shadow .3s" }}
                  >
                    {/* Cover */}
                    <div style={{ height: 148, background: b.cover ? `url(${b.cover}) center/cover` : `linear-gradient(${b.grad})`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {!b.cover && (
                        <>
                          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                          <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", position: "relative", zIndex: 1 }}>
                            <LuTrendingUp size={26} strokeWidth={1.8} />
                          </div>
                        </>
                      )}
                      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}>
                        <LuClock size={9} />{b.read}
                      </div>
                    </div>
                    {/* Body */}
                    <div style={{ padding: "22px 22px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ background: b.bg, color: b.tc, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 7, border: `1px solid ${b.tc}25` }}>{b.tag}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{b.date}</span>
                      </div>
                      <h3 style={{ ...S, fontWeight: 700, fontSize: 15.5, color: "#0f172a", margin: "0 0 9px", lineHeight: 1.4 }}>{b.title}</h3>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: "0 0 16px" }}>{b.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: b.tc, fontWeight: 700 }}>
                        O'qishni davom ettirish <LuArrowRight size={13} />
                      </div>
                    </div>
                  </Link>
                ))
              : /* Empty fallback */
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                  <LuTrendingUp size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p style={{ margin: 0 }}>Maqolalar topilmadi</p>
                </div>
          }
        </div>
      </section>

      {/* ══════════════════════════
          TRUST STRIP
      ══════════════════════════ */}
      <section style={{ background: "#fff", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "28px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[
            { Icon: LuShield,     color: "#16a34a", label: "SSL Himoyalangan"         },
            { Icon: LuBadgeCheck, color: "#2563eb", label: "Tasdiqlangan Blogerlar"   },
            { Icon: LuAward,      color: "#d97706", label: "Premium Sifat"            },
            { Icon: LuTrendingUp, color: "#7c3aed", label: "O'lchanadigan Natija"     },
            { Icon: LuUsers,      color: "#dc2626", label: "24/7 Qo'llab-quvvatlash" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#374151" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: t.color + "12", color: t.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <t.Icon size={15} strokeWidth={2} />
              </div>
              {t.label}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════
          CTA BANNER
      ══════════════════════════ */}
      <section style={{ padding: "88px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 55%, #991b1b 100%)", borderRadius: 32, padding: "72px 64px", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          {[{ size: 600, right: "-160px", top: "50%", mt: "-300px" }, { size: 380, right: "-40px", top: "50%", mt: "-190px" }].map((r, i) => (
            <div key={i} style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", width: r.size, height: r.size, right: r.right, top: r.top, marginTop: r.mt, border: "1px solid rgba(255,255,255,0.07)" }} />
          ))}
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", left: "-200px", bottom: "-250px", background: "rgba(0,0,0,0.2)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", color: "#fbbf24", textTransform: "uppercase", marginBottom: 24 }}>
              <LuRocket size={11} /> Hoziroq boshlang
            </div>
            <h2 style={{ ...S, fontWeight: 800, fontSize: "clamp(28px,4.5vw,48px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.1 }}>
              Brendingiz uchun eng yaxshi<br />
              <span style={{ background: "linear-gradient(90deg,#fbbf24,#fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>bloger topishga tayyormisiz?</span>
            </h2>
            <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
              500+ tasdiqlangan bloger sizni kutmoqda. Bepul ro'yxatdan o'ting va birinchi kampaniyangizni boshlang.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to={ROUTE_PATHS.BLOGGERS} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fbbf24", color: "#78350f", fontWeight: 800, fontSize: 15.5, padding: "15px 36px", borderRadius: 14, textDecoration: "none", boxShadow: "0 4px 28px rgba(251,191,36,0.4)", transition: "transform .2s, box-shadow .2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(251,191,36,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 28px rgba(251,191,36,0.4)"; }}
              >Blogerlarni ko'rish <LuArrowRight size={17} /></Link>
              <Link to={ROUTE_PATHS.BLOGER_BOLISH} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", color: "#fff", fontWeight: 700, fontSize: 15.5, padding: "15px 36px", borderRadius: 14, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.25)", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              >Bloger bo'lish <LuSend size={16} /></Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
              {["Ro'yxatdan o'tish bepul", "Kredit karta shart emas", "Istalgan vaqt bekor qilish"].map((txt, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>
                  <LuCircleCheck size={13} style={{ color: "#86efac" }} />{txt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Responsive + animations ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @media (max-width: 1024px) {
          .hp-bloggers-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hp-feat-grid     { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .hp-stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .hp-steps-grid    { grid-template-columns: 1fr !important; }
          .hp-feat-grid     { grid-template-columns: 1fr !important; }
          .hp-bloggers-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hp-platforms-grid{ grid-template-columns: repeat(2,1fr) !important; }
          .hp-blogs-grid    { grid-template-columns: 1fr !important; }
          .hp-connector     { display: none !important; }
        }
        @media (max-width: 500px) {
          .hp-bloggers-grid { grid-template-columns: 1fr !important; }
          .hp-stats-grid    { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
