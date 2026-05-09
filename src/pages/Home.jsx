import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LuArrowRight, LuStar, LuZap, LuShield, LuTrendingUp,
  LuUsers, LuAward, LuCircleCheck, LuInstagram, LuYoutube,
  LuMessageCircle, LuPlay, LuQuote, LuSend, LuRocket,
  LuTarget, LuHandshake, LuSparkles, LuGlobe, LuFlame,
  LuEye, LuHeart, LuCrown, LuBadgeCheck, LuActivity, LuBuilding2,
  LuDollarSign, LuClock, LuChevronRight, LuMoveRight,
} from "react-icons/lu";
import { ROUTE_PATHS } from "../config/constants";
import api from "../services/api";

/* ── Fonts ── */
if (!document.getElementById("home-fonts")) {
  const l = document.createElement("link");
  l.id = "home-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Inter:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(l);
}
const S = { fontFamily: "'Syne', sans-serif" };

/* ── Animated counter ── */
function Counter({ end, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        let v = 0, step = end / (duration / 16);
        const t = setInterval(() => {
          v += step;
          if (v >= end) { setVal(end); clearInterval(t); }
          else setVal(Math.floor(v));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Stacked avatars ── */
function AvatarStack({ bloggers, max = 4 }) {
  const shown = bloggers.slice(0, max);
  const extra = bloggers.length - max;
  const GRADS = [
    "135deg,#dc2626,#f97316","135deg,#2563eb,#0891b2",
    "135deg,#7c3aed,#ec4899","135deg,#16a34a,#0891b2",
    "135deg,#d97706,#dc2626","135deg,#0891b2,#2563eb",
  ];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((b, i) => {
        const name = `${b.user?.firstName || ""}${b.user?.lastName || ""}`.trim();
        const init = (name[0] || "B").toUpperCase();
        return (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "2.5px solid rgba(255,255,255,0.15)",
            marginLeft: i === 0 ? 0 : -10,
            background: b.user?.avatar ? "transparent" : `linear-gradient(${GRADS[i % GRADS.length]})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 800,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            flexShrink: 0, overflow: "hidden",
            zIndex: max - i,
          }}>
            {b.user?.avatar
              ? <img src={b.user.avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : init
            }
          </div>
        );
      })}
      {extra > 0 && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "2.5px solid rgba(255,255,255,0.15)",
          marginLeft: -10, background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: 700,
          flexShrink: 0,
        }}>+{extra}</div>
      )}
    </div>
  );
}

/* ── Section pill ── */
function Pill({ children, color, bg, border, Icon }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: bg, color, border: `1px solid ${border}`,
      fontSize: 10.5, fontWeight: 700, letterSpacing: "1.8px",
      textTransform: "uppercase", padding: "5px 14px",
      borderRadius: 100, marginBottom: 18,
    }}>
      {Icon && <Icon size={11} strokeWidth={2.5} />}{children}
    </span>
  );
}

/* ── Skeleton ── */
function Sk({ w = "100%", h = 18, r = 8, mb = 0 }) {
  return <div style={{ width: w, height: h, borderRadius: r, marginBottom: mb, background: "linear-gradient(90deg,#f1f5f9 25%,#e8eef4 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "sk 1.5s infinite" }} />;
}

/* ── Helpers ── */
const CAT_LABELS = { technology:"Texnologiya", beauty:"Go'zallik", travel:"Sayohat", food:"Ovqat", fashion:"Moda", fitness:"Sport", entertainment:"Ko'ngilochar", education:"Ta'lim", business:"Biznes", gaming:"O'yinlar", lifestyle:"Lifestyle", other:"Boshqa" };
const PLAT_LABELS = { instagram:"Instagram", youtube:"YouTube", telegram:"Telegram", tiktok:"TikTok" };
const PLAT_COLORS = { instagram:"#e1306c", youtube:"#ff0000", telegram:"#2aabee", tiktok:"#111827" };
const CAT_GRADS = {
  technology:"135deg,#1e3a5f,#2563eb", beauty:"135deg,#831843,#ec4899",
  travel:"135deg,#064e3b,#10b981",     food:"135deg,#78350f,#f59e0b",
  fashion:"135deg,#4c1d95,#8b5cf6",    fitness:"135deg,#052e16,#16a34a",
  entertainment:"135deg,#1a1a2e,#7c3aed", education:"135deg,#0c4a6e,#0891b2",
  default:"135deg,#7f1d1d,#dc2626",
};
const BLOG_COLORS = {
  marketing:{ tc:"#dc2626", bg:"#fef2f2", grad:"135deg,#7f1d1d,#dc2626" },
  blogerlar:{ tc:"#2563eb", bg:"#eff6ff", grad:"135deg,#1e3a5f,#3b82f6" },
  bloggerlar:{ tc:"#2563eb", bg:"#eff6ff", grad:"135deg,#1e3a5f,#3b82f6" },
  biznes:{ tc:"#7c3aed", bg:"#f5f3ff", grad:"135deg,#4c1d95,#7c3aed" },
  texnologiya:{ tc:"#0891b2", bg:"#ecfeff", grad:"135deg,#0c4a6e,#0891b2" },
  default:{ tc:"#16a34a", bg:"#f0fdf4", grad:"135deg,#052e16,#16a34a" },
};

function fmtFollowers(n) {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.floor(n/1_000)}K`;
  return String(n);
}
function fmtPrice(n) { return n ? Number(n).toLocaleString("uz-UZ") : null; }
function getInit(name="") { return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()||"AD"; }

function mapBlogger(b) {
  const name = `${b.user?.firstName||""} ${b.user?.lastName||""}`.trim();
  const cat  = b.categories?.[0]||"default";
  const plat = b.platforms?.[0]||"instagram";
  const prices = Object.values(b.pricing||{}).filter(v=>v>0).sort((a,c)=>a-c);
  return {
    id: b._id, name,
    handle: b.handle ? `@${b.handle}` : `@${name.toLowerCase().replace(/\s+/g,"_")}`,
    cat: CAT_LABELS[cat]||cat,
    platform: PLAT_LABELS[plat]||plat,
    followers: fmtFollowers(b.followers),
    eng: b.engagementRate ? `${Number(b.engagementRate).toFixed(1)}%` : "—",
    price: prices[0] ? fmtPrice(prices[0]) : null,
    g: CAT_GRADS[cat]||CAT_GRADS.default,
    init: getInit(name),
    pc: PLAT_COLORS[plat]||"#111827",
    avatar: b.user?.avatar,
  };
}
function mapBlog(p) {
  const key = p.category?.toLowerCase()||"default";
  const colors = BLOG_COLORS[key]||BLOG_COLORS.default;
  const date = p.createdAt ? new Date(p.createdAt).toLocaleDateString("uz-UZ",{day:"numeric",month:"short",year:"numeric"}) : "";
  return { id:p.slug||p._id, tag:p.category||"Blog", ...colors, title:p.title, desc:p.excerpt||(p.content||"").slice(0,120), date, read:`${p.readTime||5} min`, cover:p.coverImage||null, views:p.views||0, likesCount:p.likesCount||0 };
}

/* ─── Static data ─── */
const STATS = [
  { end:26,  suffix:"+",  label:"Tasdiqlangan\nBloger",  Icon:LuUsers,    color:"#dc2626", bg:"rgba(220,38,38,0.08)"   },
  { end:12,  suffix:"M+", label:"Faol\nAuditoriya",      Icon:LuEye,      color:"#2563eb", bg:"rgba(37,99,235,0.08)"   },
  { end:200, suffix:"+",  label:"Ishonchli\nBrend",      Icon:LuBuilding2,color:"#7c3aed", bg:"rgba(124,58,237,0.08)"  },
  { end:98,  suffix:"%",  label:"Mamnuniyat\nDarajasi",  Icon:LuStar,     color:"#d97706", bg:"rgba(217,119,6,0.08)"   },
];
const PLATFORM_CFG = [
  { key:"instagram", label:"Instagram",  Icon:LuInstagram,    grad:"160deg,#833ab4 0%,#fd1d1d 50%,#fcb045 100%", glow:"rgba(253,29,29,0.35)" },
  { key:"youtube",   label:"YouTube",    Icon:LuYoutube,      grad:"160deg,#1a1a1a 0%,#cc0000 60%,#ff0000 100%", glow:"rgba(255,0,0,0.35)"   },
  { key:"telegram",  label:"Telegram",   Icon:LuMessageCircle,grad:"160deg,#1c92d2 0%,#f2fcfe 100%",             glow:"rgba(44,171,238,0.35)" },
  { key:"tiktok",    label:"TikTok",     Icon:LuPlay,         grad:"160deg,#010101 0%,#2d2d2d 60%,#69C9D0 100%",glow:"rgba(105,201,208,0.3)" },
];
const FEATURES = [
  { Icon:LuZap,        color:"#f59e0b", grad:"135deg,#f59e0b,#d97706", title:"Tezkor joylash",    desc:"2 daqiqada e'lon bering. Hech qanday texnik bilim kerak emas." },
  { Icon:LuShield,     color:"#10b981", grad:"135deg,#10b981,#059669", title:"100% Xavfsiz",      desc:"Barcha to'lovlar himoyalangan. Blogerlar moderatsiyadan o'tgan." },
  { Icon:LuActivity,   color:"#3b82f6", grad:"135deg,#3b82f6,#2563eb", title:"Real Statistika",   desc:"Kampaniyangiz natijalarini real vaqtda kuzating." },
  { Icon:LuCrown,      color:"#8b5cf6", grad:"135deg,#8b5cf6,#7c3aed", title:"Premium Blogerlar", desc:"Faqat tasdiqlangan va sifatli blogerlar platformada." },
  { Icon:LuDollarSign, color:"#ef4444", grad:"135deg,#ef4444,#dc2626", title:"Qulay Narxlar",     desc:"Har qanday byudjetga mos tarif rejalari mavjud." },
  { Icon:LuGlobe,      color:"#06b6d4", grad:"135deg,#06b6d4,#0891b2", title:"Keng Auditoriya",   desc:"O'zbekiston bo'ylab 12M+ faol foydalanuvchiga yeting." },
];
const STEPS = [
  { n:"01", Icon:LuTarget,    color:"#ef4444", grad:"135deg,#ef4444,#dc2626", title:"Bloger tanlang",  desc:"Tasdiqlangan blogerlar ichidan brendingizga mos influencerni kategoriya va auditoriya bo'yicha filtrlang." },
  { n:"02", Icon:LuHandshake, color:"#3b82f6", grad:"135deg,#3b82f6,#2563eb", title:"Kelishuv tuzing", desc:"Bloger bilan to'g'ridan-to'g'ri muloqot qiling. Shartlarni muvofiqlashtiring va xavfsiz shartnoma imzolang." },
  { n:"03", Icon:LuRocket,    color:"#10b981", grad:"135deg,#10b981,#059669", title:"Natija oling",    desc:"Kampaniyangiz ishga tushadi. Real vaqtda statistikani kuzating va ROI ni o'lchang." },
];
const TESTIMONIALS = [
  { text:"adblogger orqali 3 oyda brendimiz kanalining obunachilari 40%ga oshdi. Platforma juda qulay va blogerlar sifatli!", name:"Akbar Mirzayev",   role:"Marketing Director · TechUz",        init:"AM", color:"#ef4444", stars:5 },
  { text:"Bloger sifatida ro'yxatdan o'tganimdan keyin bir oyda 3 ta brend bilan shartnoma tuzdim. Daromadim ikki hissa oshdi!", name:"Nilufar Qodirov",  role:"Lifestyle Blogger · 250K followers", init:"NQ", color:"#3b82f6", stars:5 },
  { text:"Real vaqtda kampaniya statistikasini kuzatib borish — bu bizni eng ko'p quvontirgan narsa. ROI 3× bo'ldi!", name:"Sherzod Tursunov", role:"CEO · FoodChain Uz",                  init:"ST", color:"#8b5cf6", stars:5 },
];

/* ════════════════════════════════ COMPONENT ════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();
  const [activeT, setActiveT] = useState(0);
  const [hBlogger, setHBlogger] = useState(null);
  const [hBlog, setHBlog]       = useState(null);
  const [hFeat, setHFeat]       = useState(null);
  const [hPlat, setHPlat]       = useState(null);
  const [hStep, setHStep]       = useState(null);

  const [bloggers, setBloggers]         = useState([]);
  const [blogs, setBlogs]               = useState([]);
  const [allBloggers, setAllBloggers]   = useState([]);
  const [platformMap, setPlatformMap]   = useState({});
  const [bloggersLoading, setBloggersLoading] = useState(true);
  const [blogsLoading, setBlogsLoading]       = useState(true);
  const [platLoading, setPlatLoading]         = useState(true);

  /* rotate testimonials */
  useEffect(() => {
    const t = setInterval(() => setActiveT(v => (v+1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* fetch all bloggers for platform grouping */
  const fetchAll = useCallback(async () => {
    try {
      const res = await api.get("/bloggers", { params: { limit: 50 } });
      const data = res.data.data || [];
      setAllBloggers(data);
      const map = {};
      data.forEach(b => {
        (b.platforms || []).forEach(p => {
          if (!map[p]) map[p] = [];
          map[p].push(b);
        });
      });
      setPlatformMap(map);
    } catch { /* keep empty */ }
    finally { setPlatLoading(false); }
  }, []);

  /* fetch top 4 bloggers for cards */
  const fetchBloggers = useCallback(async () => {
    try {
      const res = await api.get("/bloggers", { params: { limit: 4, sort: "-followers" } });
      setBloggers((res.data.data || []).map(mapBlogger));
    } catch { setBloggers([]); }
    finally { setBloggersLoading(false); }
  }, []);

  /* fetch latest blogs */
  const fetchBlogs = useCallback(async () => {
    try {
      const res = await api.get("/blogs", { params: { limit: 3, sort: "-createdAt" } });
      setBlogs((res.data.data || []).map(mapBlog));
    } catch { setBlogs([]); }
    finally { setBlogsLoading(false); }
  }, []);

  useEffect(() => {
    fetchAll();
    fetchBloggers();
    fetchBlogs();
  }, [fetchAll, fetchBloggers, fetchBlogs]);

  /* platform card click */
  const goToPlatform = (key) => navigate(`/bloggers?platforms=${key}`);

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:"#f9fafb", overflowX:"hidden" }}>
      <SEO
        canonical="/"
        description="O'zbekistonning eng yirik blogger va reklama platformasi. 500+ tasdiqlangan blogger. Reklama joylashtiring yoki daromad oling!"
        schema={{ "@context":"https://schema.org","@type":"WebPage","name":"ADBlogger","url":"https://adblogger.uz/" }}
      />

      {/* ══════ STATS BAR ══════ */}
      <section style={{ background:"#fff", borderBottom:"1px solid #f1f5f9" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 32px" }}>
          <div className="hp-stats" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:16,
                padding:"26px 20px",
                borderRight: i<3 ? "1px solid #f1f5f9" : "none",
              }}>
                <div style={{ width:48, height:48, borderRadius:14, flexShrink:0, background:s.bg, color:s.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <s.Icon size={21} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ ...S, fontWeight:900, fontSize:28, color:s.color, lineHeight:1 }}>
                    <Counter end={s.end} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:3, fontWeight:500, whiteSpace:"pre-line", lineHeight:1.4 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PLATFORMS — real API ══════ */}
      <section style={{
        background:"linear-gradient(150deg,#060b18 0%,#0d1528 40%,#0a1020 100%)",
        padding:"96px 32px", position:"relative", overflow:"hidden",
      }}>
        {/* bg noise grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.028) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />
        {/* glow blobs */}
        <div style={{ position:"absolute", top:-280, left:-220, width:640, height:640, borderRadius:"50%", background:"radial-gradient(circle,rgba(220,38,38,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-300, right:-220, width:640, height:640, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.75)", border:"1px solid rgba(255,255,255,0.1)", fontSize:10.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", padding:"5px 15px", borderRadius:100, marginBottom:20 }}>
              <LuGlobe size={11} /> Platformalar
            </div>
            <h2 style={{ ...S, fontWeight:900, fontSize:"clamp(30px,4.5vw,52px)", color:"#fff", margin:"0 0 14px", lineHeight:1.05, letterSpacing:"-1px" }}>
              Barcha platformalarda{" "}
              <span style={{ background:"linear-gradient(90deg,#38bdf8,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>blogerlar bor</span>
            </h2>
            <p style={{ fontSize:16.5, color:"rgba(255,255,255,0.45)", maxWidth:440, margin:"0 auto", lineHeight:1.8 }}>
              Instagram, YouTube, Telegram va TikTok — hamma joyda sizning auditoriyangiz bor.
            </p>
          </div>

          <div className="hp-platforms" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {PLATFORM_CFG.map((p, i) => {
              const list = platformMap[p.key] || [];
              const count = list.length;
              const isH   = hPlat === i;
              return (
                <div key={p.key}
                  onClick={() => goToPlatform(p.key)}
                  onMouseEnter={() => setHPlat(i)}
                  onMouseLeave={() => setHPlat(null)}
                  style={{
                    borderRadius:28, overflow:"hidden",
                    cursor:"pointer", position:"relative",
                    transform: isH ? "translateY(-12px) scale(1.025)" : "none",
                    transition:"all .4s cubic-bezier(.34,1.56,.64,1)",
                    boxShadow: isH ? `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), 0 0 60px ${p.glow}` : "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                >
                  {/* card body */}
                  <div style={{ background:`linear-gradient(${p.grad})`, padding:"36px 28px 32px", position:"relative", overflow:"hidden" }}>
                    {/* subtle pattern */}
                    <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize:"20px 20px" }} />
                    {/* glow circle */}
                    <div style={{ position:"absolute", bottom:-60, right:-60, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />

                    <div style={{ position:"relative", zIndex:1 }}>
                      {/* stacked avatars */}
                      <div style={{ marginBottom:22, minHeight:36 }}>
                        {platLoading
                          ? <div style={{ height:32, width:100, borderRadius:16, background:"rgba(255,255,255,0.12)", animation:"sk 1.5s infinite" }} />
                          : count > 0
                            ? <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <AvatarStack bloggers={list} max={4} />
                                <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)", fontWeight:600 }}>va boshqalar</span>
                              </div>
                            : <div style={{ height:32 }} />
                        }
                      </div>

                      {/* icon */}
                      <div style={{ width:56, height:56, borderRadius:18, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.22)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", marginBottom:18, boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
                        <p.Icon size={28} strokeWidth={1.6} />
                      </div>

                      {/* name */}
                      <div style={{ ...S, fontWeight:800, fontSize:19, color:"rgba(255,255,255,0.95)", marginBottom:16, letterSpacing:"-0.3px" }}>{p.label}</div>

                      {/* big count */}
                      <div style={{ ...S, fontWeight:900, fontSize:56, color:"#fff", lineHeight:1, letterSpacing:"-2px" }}>
                        {platLoading
                          ? <div style={{ height:56, width:80, borderRadius:12, background:"rgba(255,255,255,0.15)", animation:"sk 1.5s infinite" }} />
                          : <Counter end={count} duration={1600} />
                        }
                      </div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", fontWeight:500, marginTop:6 }}>ta bloger</div>
                    </div>
                  </div>

                  {/* footer */}
                  <div style={{
                    background: isH ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                    backdropFilter:"blur(20px)",
                    padding:"15px 28px",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    borderTop:"1px solid rgba(255,255,255,0.07)",
                    transition:"background .3s",
                  }}>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Ko'rish</span>
                    <div style={{ width:30, height:30, borderRadius:9, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.65)", transform: isH ? "translateX(5px)" : "none", transition:"transform .4s cubic-bezier(.34,1.56,.64,1)" }}>
                      <LuArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign:"center", marginTop:52 }}>
            <Link to={ROUTE_PATHS.BLOGGERS} style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.75)", fontWeight:600, fontSize:14, textDecoration:"none", padding:"12px 28px", borderRadius:12, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", transition:"all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.13)"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}
            >
              Barcha {allBloggers.length || 26} ta blogerlarni ko'rish <LuArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section style={{ padding:"96px 32px", maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <Pill Icon={LuZap} color="#d97706" bg="rgba(217,119,6,0.08)" border="rgba(217,119,6,0.18)">Imkoniyatlar</Pill>
          <h2 style={{ ...S, fontWeight:900, fontSize:"clamp(28px,4vw,46px)", color:"#0f172a", margin:"0 0 14px", lineHeight:1.07, letterSpacing:"-1px" }}>
            Nima uchun bizni{" "}
            <span style={{ background:"linear-gradient(90deg,#dc2626,#7c3aed)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>tanlashadi?</span>
          </h2>
          <p style={{ fontSize:16.5, color:"#64748b", maxWidth:480, margin:"0 auto", lineHeight:1.8 }}>
            O'zbekistoning yetakchi influencer marketplace platformasi — tez, xavfsiz va samarali.
          </p>
        </div>
        <div className="hp-feats" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              onMouseEnter={() => setHFeat(i)}
              onMouseLeave={() => setHFeat(null)}
              style={{
                background: hFeat===i ? "#fff" : "#fff",
                borderRadius:24, padding:"36px 32px",
                border: hFeat===i ? `1.5px solid ${f.color}28` : "1.5px solid #f1f5f9",
                boxShadow: hFeat===i ? `0 24px 60px ${f.color}14` : "0 2px 14px rgba(0,0,0,0.04)",
                transform: hFeat===i ? "translateY(-8px)" : "none",
                transition:"all .35s cubic-bezier(.34,1.56,.64,1)",
              }}
            >
              <div style={{ width:54, height:54, borderRadius:16, background:`linear-gradient(${f.grad})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:22, boxShadow:`0 8px 22px ${f.color}30` }}>
                <f.Icon size={24} strokeWidth={1.8} />
              </div>
              <h3 style={{ ...S, fontWeight:800, fontSize:18, color:"#0f172a", margin:"0 0 10px" }}>{f.title}</h3>
              <p style={{ fontSize:14, color:"#64748b", lineHeight:1.75, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section style={{ background:"#fff", borderTop:"1px solid #f1f5f9", padding:"96px 32px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <Pill Icon={LuClock} color="#2563eb" bg="rgba(37,99,235,0.08)" border="rgba(37,99,235,0.18)">Qanday ishlaydi?</Pill>
            <h2 style={{ ...S, fontWeight:900, fontSize:"clamp(28px,4vw,46px)", color:"#0f172a", margin:"0 0 14px", lineHeight:1.07, letterSpacing:"-1px" }}>
              <span style={{ color:"#2563eb" }}>3 qadam</span> — kampaniyangiz tayyor
            </h2>
            <p style={{ fontSize:16.5, color:"#64748b", maxWidth:440, margin:"0 auto", lineHeight:1.8 }}>Hech qanday texnik bilim talab etilmaydi.</p>
          </div>
          <div className="hp-steps" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, position:"relative" }}>
            <div className="hp-conn" style={{ position:"absolute", top:55, left:"calc(16.67% + 28px)", right:"calc(16.67% + 28px)", height:2, borderRadius:2, background:"linear-gradient(90deg,#fca5a5,#93c5fd,#86efac)", zIndex:0 }} />
            {STEPS.map((s, i) => (
              <div key={i}
                onMouseEnter={() => setHStep(i)}
                onMouseLeave={() => setHStep(null)}
                style={{
                  background:"#f9fafb", borderRadius:28, padding:"44px 36px",
                  border: hStep===i ? `1.5px solid ${s.color}25` : "1.5px solid #f1f5f9",
                  boxShadow: hStep===i ? `0 28px 64px ${s.color}15` : "0 4px 20px rgba(0,0,0,0.04)",
                  transform: hStep===i ? "translateY(-10px)" : "none",
                  transition:"all .35s cubic-bezier(.34,1.56,.64,1)",
                  position:"relative", zIndex:1,
                }}
              >
                <div style={{ position:"absolute", top:-1, right:28, background:`linear-gradient(${s.grad})`, color:"#fff", fontSize:9.5, fontWeight:800, letterSpacing:"1.5px", padding:"5px 14px", borderRadius:"0 0 12px 12px", ...S }}>QADAM {s.n}</div>
                <div style={{ width:64, height:64, borderRadius:20, background:`linear-gradient(${s.grad})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, boxShadow:`0 10px 28px ${s.color}30` }}>
                  <s.Icon size={28} strokeWidth={1.7} />
                </div>
                <h3 style={{ ...S, fontWeight:800, fontSize:20, color:"#0f172a", margin:"0 0 12px" }}>{s.title}</h3>
                <p style={{ fontSize:14, color:"#64748b", lineHeight:1.8, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TOP BLOGGERS ══════ */}
      <section style={{ padding:"96px 32px", maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:52, gap:16, flexWrap:"wrap" }}>
          <div>
            <Pill Icon={LuFlame} color="#dc2626" bg="rgba(220,38,38,0.08)" border="rgba(220,38,38,0.18)">Top Blogerlar</Pill>
            <h2 style={{ ...S, fontWeight:900, fontSize:"clamp(26px,3.5vw,42px)", color:"#0f172a", margin:0, lineHeight:1.1, letterSpacing:"-0.8px" }}>
              Eng ta'sirchan{" "}
              <span style={{ background:"linear-gradient(90deg,#dc2626,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>influencerlar</span>
            </h2>
          </div>
          <Link to={ROUTE_PATHS.BLOGGERS} style={{ display:"inline-flex", alignItems:"center", gap:8, color:"#fff", fontWeight:700, fontSize:14, background:"linear-gradient(135deg,#dc2626,#b91c1c)", textDecoration:"none", padding:"12px 24px", borderRadius:14, boxShadow:"0 4px 20px rgba(220,38,38,0.3)", transition:"all .25s", whiteSpace:"nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(220,38,38,0.42)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 20px rgba(220,38,38,0.3)"; }}
          >
            Barchasini ko'rish <LuArrowRight size={15} />
          </Link>
        </div>

        <div className="hp-bloggers" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:22 }}>
          {bloggersLoading
            ? Array.from({length:4}).map((_,i) => (
                <div key={i} style={{ background:"#fff", borderRadius:24, overflow:"hidden", border:"1px solid #f1f5f9" }}>
                  <div style={{ height:96, background:"linear-gradient(135deg,#f1f5f9,#e2e8f0)" }} />
                  <div style={{ padding:"10px 20px 20px" }}>
                    <Sk h={14} r={7} mb={10} />
                    <Sk w="60%" h={12} r={6} mb={14} />
                    <Sk h={64} r={12} mb={14} />
                    <Sk h={40} r={12} />
                  </div>
                </div>
              ))
            : bloggers.length > 0
              ? bloggers.map((b, i) => (
                  <div key={b.id||i}
                    onMouseEnter={() => setHBlogger(i)}
                    onMouseLeave={() => setHBlogger(null)}
                    style={{
                      background:"#fff", borderRadius:24, overflow:"hidden",
                      border: hBlogger===i ? `1.5px solid ${b.pc}30` : "1.5px solid #f1f5f9",
                      boxShadow: hBlogger===i ? "0 28px 64px rgba(0,0,0,0.13)" : "0 4px 20px rgba(0,0,0,0.06)",
                      transform: hBlogger===i ? "translateY(-10px)" : "none",
                      transition:"all .38s cubic-bezier(.34,1.56,.64,1)",
                      cursor:"pointer",
                    }}
                  >
                    <div style={{ height:96, background:`linear-gradient(${b.g})`, position:"relative" }}>
                      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize:"16px 16px" }} />
                      <div style={{ position:"absolute", top:12, right:12, background:b.pc, color:"#fff", fontSize:9.5, fontWeight:700, padding:"3px 10px", borderRadius:8 }}>{b.platform}</div>
                      <div style={{ position:"absolute", top:12, left:12, background:"rgba(255,255,255,0.14)", backdropFilter:"blur(8px)", color:"#fff", fontSize:9.5, fontWeight:600, padding:"3px 9px", borderRadius:8, border:"1px solid rgba(255,255,255,0.22)", display:"flex", alignItems:"center", gap:4 }}>
                        <LuBadgeCheck size={10} /> Tasdiqlangan
                      </div>
                    </div>
                    <div style={{ padding:"0 20px", marginTop:-26, position:"relative", zIndex:1 }}>
                      {b.avatar
                        ? <img src={b.avatar} alt={b.name} style={{ width:54, height:54, borderRadius:"50%", objectFit:"cover", border:"3px solid #fff", boxShadow:"0 6px 18px rgba(0,0,0,0.2)" }} />
                        : <div style={{ width:54, height:54, borderRadius:"50%", background:`linear-gradient(${b.g})`, border:"3px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:16, boxShadow:"0 6px 18px rgba(0,0,0,0.18)", ...S }}>{b.init}</div>
                      }
                    </div>
                    <div style={{ padding:"10px 20px 0" }}>
                      <div style={{ fontWeight:700, fontSize:15, color:"#0f172a" }}>{b.name}</div>
                      <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:2 }}>{b.handle}</div>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:10, background:"#f8fafc", color:"#475569", fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:8, border:"1px solid #f1f5f9" }}>
                        <LuSparkles size={10}/>{b.cat}
                      </span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, padding:"14px 20px" }}>
                      {[{label:"Followers",val:b.followers,color:"#dc2626"},{label:"Engagement",val:b.eng,color:"#374151"}].map((st,j) => (
                        <div key={j} style={{ background:"#f9fafb", borderRadius:12, padding:"10px 12px", border:"1px solid #f1f5f9" }}>
                          <div style={{ fontWeight:800, fontSize:16, color:st.color }}>{st.val}</div>
                          <div style={{ fontSize:9.5, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.7px", fontWeight:600, marginTop:2 }}>{st.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding:"12px 20px 18px", borderTop:"1px solid #f8fafc", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontSize:9.5, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.7px", fontWeight:600 }}>Narx / post</div>
                        {b.price
                          ? <div style={{ ...S, fontWeight:800, fontSize:16, color:"#0f172a", marginTop:2 }}>{b.price} <span style={{ fontSize:10, color:"#94a3b8", fontWeight:500 }}>so'm</span></div>
                          : <div style={{ ...S, fontWeight:600, fontSize:13, color:"#94a3b8", marginTop:2 }}>Kelishiladi</div>
                        }
                      </div>
                      <Link to={`/bloggers/${b.id}`} style={{ background:`linear-gradient(135deg,#dc2626,#b91c1c)`, color:"#fff", fontSize:13, fontWeight:700, padding:"9px 18px", borderRadius:12, textDecoration:"none", boxShadow:"0 4px 14px rgba(220,38,38,0.3)", transition:"all .2s" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 24px rgba(220,38,38,0.45)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow="0 4px 14px rgba(220,38,38,0.3)"; e.currentTarget.style.transform="none"; }}
                      >Ko'rish</Link>
                    </div>
                  </div>
                ))
              : <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"64px 20px", color:"#94a3b8" }}>
                  <LuUsers size={42} style={{ marginBottom:14, opacity:0.25 }} />
                  <p style={{ margin:0 }}>Blogerlar topilmadi</p>
                </div>
          }
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section style={{ background:"linear-gradient(145deg,#060b18 0%,#0d1528 40%,#0a1020 100%)", padding:"100px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-220, left:-220, width:640, height:640, borderRadius:"50%", background:"radial-gradient(circle,rgba(220,38,38,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-220, right:-220, width:640, height:640, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:820, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(251,191,36,0.07)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.18)", fontSize:10.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", padding:"5px 15px", borderRadius:100, marginBottom:20 }}>
              <LuStar size={11} /> Mijozlar fikrlari
            </div>
            <h2 style={{ ...S, fontWeight:900, fontSize:"clamp(26px,3.5vw,42px)", color:"#fff", margin:0, lineHeight:1.1, letterSpacing:"-0.8px" }}>
              Ular allaqachon{" "}
              <span style={{ background:"linear-gradient(90deg,#fbbf24,#fde68a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ishonch bildirgan</span>
            </h2>
          </div>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ display:i===activeT ? "block" : "none", background:"rgba(255,255,255,0.04)", backdropFilter:"blur(28px)", borderRadius:32, padding:"48px 52px", border:"1px solid rgba(255,255,255,0.07)", boxShadow:"0 24px 80px rgba(0,0,0,0.4)", animation:"fi .4s ease" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${t.color}18`, color:t.color, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28, border:`1px solid ${t.color}22` }}>
                <LuQuote size={22} />
              </div>
              <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"rgba(255,255,255,0.84)", lineHeight:1.85, margin:"0 0 36px", fontStyle:"italic" }}>"{t.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <div style={{ width:50, height:50, borderRadius:"50%", background:`linear-gradient(135deg,${t.color},${t.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15, flexShrink:0, ...S }}>{t.init}</div>
                <div>
                  <div style={{ fontWeight:700, color:"#fff", fontSize:15.5 }}>{t.name}</div>
                  <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.38)", marginTop:3 }}>{t.role}</div>
                </div>
                <div style={{ marginLeft:"auto", display:"flex", gap:3 }}>
                  {Array.from({length:t.stars}).map((_,j) => <LuStar key={j} size={15} fill="#fbbf24" color="#fbbf24" />)}
                </div>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:32 }}>
            {TESTIMONIALS.map((t, i) => (
              <button key={i} onClick={() => setActiveT(i)} style={{ height:5, borderRadius:3, border:"none", cursor:"pointer", transition:"all .35s", width:i===activeT ? 42 : 14, background:i===activeT ? t.color : "rgba(255,255,255,0.16)", boxShadow:i===activeT ? `0 0 14px ${t.color}70` : "none", padding:0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ BLOG ══════ */}
      <section style={{ padding:"96px 32px", maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:52, gap:16, flexWrap:"wrap" }}>
          <div>
            <Pill Icon={LuTrendingUp} color="#16a34a" bg="rgba(22,163,74,0.08)" border="rgba(22,163,74,0.18)">Blog</Pill>
            <h2 style={{ ...S, fontWeight:900, fontSize:"clamp(26px,3.5vw,42px)", color:"#0f172a", margin:0, lineHeight:1.1, letterSpacing:"-0.8px" }}>
              Eng so'nggi{" "}<span style={{ color:"#16a34a" }}>maqolalar</span>
            </h2>
          </div>
          <Link to={ROUTE_PATHS.BLOGS} style={{ display:"inline-flex", alignItems:"center", gap:8, color:"#16a34a", fontWeight:700, fontSize:14, textDecoration:"none", padding:"12px 24px", borderRadius:14, border:"1.5px solid rgba(22,163,74,0.22)", background:"rgba(22,163,74,0.06)", transition:"all .25s", whiteSpace:"nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background="#16a34a"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#16a34a"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(22,163,74,0.06)"; e.currentTarget.style.color="#16a34a"; e.currentTarget.style.borderColor="rgba(22,163,74,0.22)"; }}
          >
            Barchasini o'qish <LuArrowRight size={15} />
          </Link>
        </div>
        <div className="hp-blogs" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {blogsLoading
            ? Array.from({length:3}).map((_,i) => (
                <div key={i} style={{ background:"#fff", borderRadius:24, overflow:"hidden", border:"1px solid #f1f5f9" }}>
                  <div style={{ height:160, background:"linear-gradient(135deg,#f1f5f9,#e2e8f0)" }} />
                  <div style={{ padding:"24px" }}>
                    <Sk w="40%" h={12} r={6} mb={12} />
                    <Sk h={18} r={8} mb={10} />
                    <Sk h={14} r={6} mb={6} />
                    <Sk w="70%" h={14} r={6} />
                  </div>
                </div>
              ))
            : blogs.length > 0
              ? blogs.map((b, i) => (
                  <Link key={b.id||i} to={`/blog/${b.id}`}
                    onMouseEnter={() => setHBlog(i)}
                    onMouseLeave={() => setHBlog(null)}
                    style={{ textDecoration:"none", display:"block", background:"#fff", borderRadius:24, overflow:"hidden", border:hBlog===i ? `1.5px solid ${b.tc}25` : "1.5px solid #f1f5f9", boxShadow:hBlog===i ? "0 28px 64px rgba(0,0,0,0.1)" : "0 4px 20px rgba(0,0,0,0.05)", transform:hBlog===i ? "translateY(-10px)" : "none", transition:"all .38s cubic-bezier(.34,1.56,.64,1)" }}
                  >
                    <div style={{ height:160, background:b.cover ? `url(${b.cover}) center/cover` : `linear-gradient(${b.grad})`, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {!b.cover && (
                        <>
                          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />
                          <div style={{ width:56, height:56, borderRadius:18, background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", position:"relative", zIndex:1 }}>
                            <LuTrendingUp size={26} strokeWidth={1.8} />
                          </div>
                        </>
                      )}
                      <div style={{ position:"absolute", top:14, right:14, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(10px)", color:"#fff", fontSize:10.5, fontWeight:600, padding:"4px 10px", borderRadius:8, display:"flex", alignItems:"center", gap:4 }}>
                        <LuClock size={9}/>{b.read}
                      </div>
                    </div>
                    <div style={{ padding:"24px 24px 26px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                        <span style={{ background:b.bg, color:b.tc, fontSize:10.5, fontWeight:700, padding:"4px 11px", borderRadius:8, border:`1px solid ${b.tc}18` }}>{b.tag}</span>
                        <span style={{ fontSize:11.5, color:"#94a3b8" }}>{b.date}</span>
                      </div>
                      <h3 style={{ ...S, fontWeight:800, fontSize:16.5, color:"#0f172a", margin:"0 0 10px", lineHeight:1.4 }}>{b.title}</h3>
                      <p style={{ fontSize:13.5, color:"#64748b", lineHeight:1.75, margin:"0 0 18px" }}>{b.desc}</p>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:12, color:"#94a3b8" }}>
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}><LuEye size={12}/>{b.views >= 1000 ? `${(b.views/1000).toFixed(1)}K` : b.views}</span>
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}><LuHeart size={12}/>{b.likesCount}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:b.tc, fontWeight:700 }}>O'qish <LuArrowRight size={14}/></div>
                      </div>
                    </div>
                  </Link>
                ))
              : <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"64px 20px", color:"#94a3b8" }}>
                  <LuTrendingUp size={42} style={{ marginBottom:14, opacity:0.25 }} />
                  <p style={{ margin:0 }}>Maqolalar topilmadi</p>
                </div>
          }
        </div>
      </section>

      {/* ══════ TRUST BAR ══════ */}
      <section style={{ background:"#fff", borderTop:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9", padding:"22px 32px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:36, flexWrap:"wrap" }}>
          {[
            {Icon:LuShield,color:"#16a34a",label:"SSL Himoyalangan"},
            {Icon:LuBadgeCheck,color:"#2563eb",label:"Tasdiqlangan Blogerlar"},
            {Icon:LuAward,color:"#d97706",label:"Premium Sifat"},
            {Icon:LuTrendingUp,color:"#7c3aed",label:"O'lchanadigan Natija"},
            {Icon:LuUsers,color:"#dc2626",label:"24/7 Qo'llab-quvvatlash"},
          ].map((t,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:9, fontSize:13.5, fontWeight:600, color:"#374151" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:t.color+"10", color:t.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <t.Icon size={15} strokeWidth={2}/>
              </div>{t.label}
            </div>
          ))}
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section style={{ padding:"96px 32px", maxWidth:1280, margin:"0 auto" }}>
        <div style={{ background:"linear-gradient(135deg,#7f1d1d 0%,#dc2626 50%,#b91c1c 100%)", borderRadius:36, padding:"80px 72px", position:"relative", overflow:"hidden", textAlign:"center" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"50%", right:-180, marginTop:-320, width:640, height:640, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.05)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"50%", right:-80, marginTop:-220, width:440, height:440, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.07)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", left:-160, bottom:-220, width:480, height:480, borderRadius:"50%", background:"rgba(0,0,0,0.18)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:100, padding:"6px 18px", fontSize:10.5, fontWeight:700, letterSpacing:"2px", color:"#fbbf24", textTransform:"uppercase", marginBottom:28 }}>
              <LuRocket size={11}/> Hoziroq boshlang
            </div>
            <h2 style={{ ...S, fontWeight:900, fontSize:"clamp(28px,4.5vw,54px)", color:"#fff", margin:"0 0 20px", lineHeight:1.06, letterSpacing:"-1.5px" }}>
              Brendingiz uchun eng yaxshi<br/>
              <span style={{ background:"linear-gradient(90deg,#fbbf24,#fde68a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>bloger topishga tayyormisiz?</span>
            </h2>
            <p style={{ fontSize:17.5, color:"rgba(255,255,255,0.6)", maxWidth:480, margin:"0 auto 48px", lineHeight:1.8 }}>
              {allBloggers.length || 26}+ tasdiqlangan bloger sizni kutmoqda. Bepul ro'yxatdan o'ting va birinchi kampaniyangizni boshlang.
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <Link to={ROUTE_PATHS.BLOGGERS} style={{ display:"inline-flex", alignItems:"center", gap:10, background:"#fbbf24", color:"#78350f", fontWeight:800, fontSize:16, padding:"17px 42px", borderRadius:16, textDecoration:"none", boxShadow:"0 6px 32px rgba(251,191,36,0.4)", transition:"all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 16px 44px rgba(251,191,36,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 6px 32px rgba(251,191,36,0.4)"; }}
              >Blogerlarni ko'rish <LuArrowRight size={18}/></Link>
              <Link to={ROUTE_PATHS.BLOGER_BOLISH} style={{ display:"inline-flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(14px)", color:"#fff", fontWeight:700, fontSize:16, padding:"17px 42px", borderRadius:16, textDecoration:"none", border:"1.5px solid rgba(255,255,255,0.2)", transition:"all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.38)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"; }}
              >Bloger bo'lish <LuSend size={16}/></Link>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:28, marginTop:32, flexWrap:"wrap" }}>
              {["Ro'yxatdan o'tish bepul","Kredit karta shart emas","Istalgan vaqt bekor qilish"].map((txt,i) => (
                <span key={i} style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"rgba(255,255,255,0.48)" }}>
                  <LuCircleCheck size={14} style={{ color:"#86efac", flexShrink:0 }}/>{txt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes sk { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fi { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @media(max-width:1024px){
          .hp-bloggers{grid-template-columns:repeat(2,1fr)!important}
          .hp-feats{grid-template-columns:repeat(2,1fr)!important}
          .hp-platforms{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:768px){
          .hp-stats{grid-template-columns:repeat(2,1fr)!important}
          .hp-steps{grid-template-columns:1fr!important}
          .hp-feats{grid-template-columns:1fr!important}
          .hp-bloggers{grid-template-columns:repeat(2,1fr)!important}
          .hp-blogs{grid-template-columns:1fr!important}
          .hp-conn{display:none!important}
        }
        @media(max-width:540px){
          .hp-bloggers{grid-template-columns:1fr!important}
          .hp-platforms{grid-template-columns:1fr 1fr!important}
          .hp-stats{grid-template-columns:1fr 1fr!important}
        }
      `}</style>
    </div>
  );
}
