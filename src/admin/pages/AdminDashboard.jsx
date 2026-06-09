import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "../../services/adminService";
import { CATEGORY_LABEL } from "../../config/categories";
import { motion } from "framer-motion";
import {
  FiUsers, FiCalendar, FiStar, FiActivity,
  FiArrowUpRight, FiArrowDownRight,
  FiAlertCircle, FiRefreshCw, FiMessageSquare, FiUserPlus,
  FiAward, FiChevronRight, FiCheckCircle, FiInstagram,
  FiYoutube, FiLayers, FiClock,
} from "react-icons/fi";
import { BsTiktok } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";

// ─── Design tokens ──────────────────────────────────────────────────────────
const T = {
  red:       "#C62828",
  redMid:    "#D32F2F",
  redBr:     "#E53935",
  redLight:  "#FFEBEE",
  redGlow:   "#E5393540",
  bg:        "#F1F5F9",
  surface:   "#FFFFFF",
  surfaceUp: "#F8FAFC",
  border:    "#E2E8F0",
  borderUp:  "#CBD5E1",
  text:      "#0F172A",
  textMuted: "#475569",
  textDim:   "#94A3B8",
  success:   "#16A34A",
  successBg: "#F0FDF4",
  successBd: "#BBF7D0",
  warn:      "#D97706",
  warnBg:    "#FFFBEB",
  warnBd:    "#FDE68A",
  sky:       "#0284C7",
  skyBg:     "#F0F9FF",
  skyBd:     "#BAE6FD",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M"
  : n >= 1_000   ? (n / 1_000).toFixed(1) + "K"
  : String(n ?? 0);

const timeSince = (d) => {
  if (!d) return "-";
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1)    return "hozir";
  if (m < 60)   return `${m}d oldin`;
  if (m < 1440) return `${Math.floor(m / 60)}s oldin`;
  return `${Math.floor(m / 1440)}k oldin`;
};

const MONTHS = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
const PLATFORM = {
  instagram: { icon: FiInstagram, color: "#E1306C", bg: "#FDF2F8" },
  youtube:   { icon: FiYoutube,   color: "#FF0000", bg: "#FEF2F2" },
  tiktok:    { icon: BsTiktok,    color: "#010101", bg: "#F8FAFC" },
  telegram:  { icon: FiMessageSquare, color: "#0088CC", bg: "#F0F9FF" },
};
const getPlatform = (key) => PLATFORM[key] ?? PLATFORM.instagram;

const AD_STATUS = {
  pending:   { label: "Kutilmoqda", cls: "text-amber-700 bg-amber-50 border-amber-200" },
  approved:  { label: "Tasdiqlangan", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  active:    { label: "Faol", cls: "text-blue-700 bg-blue-50 border-blue-200" },
  rejected:  { label: "Rad etilgan", cls: "text-red-700 bg-red-50 border-red-200" },
  completed: { label: "Yakunlangan", cls: "text-slate-600 bg-slate-50 border-slate-200" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function Avatar({ name = "?", size = 36, idx = 0 }) {
  const GRADS = [
    ["#C62828","#E53935"], ["#1565C0","#1976D2"], ["#2E7D32","#388E3C"],
    ["#6A1B9A","#8E24AA"], ["#E65100","#F57C00"], ["#00695C","#00897B"],
  ];
  const [a, b] = GRADS[idx % GRADS.length];
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size / 3,
        background: `linear-gradient(135deg,${a},${b})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.32, fontWeight: 800, color: "#fff",
        flexShrink: 0, boxShadow: `0 2px 8px ${a}44`,
      }}
    >
      {initials}
    </div>
  );
}

function Badge({ status }) {
  const cfg = AD_STATUS[status] ?? AD_STATUS.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  );
}

// ─── Chart ───────────────────────────────────────────────────────────────────
function RegistrationChart({ data, loading }) {
  const [hovered, setHovered] = useState(null);
  if (loading) return <div className="flex items-end gap-1.5 h-36 pt-4">{Array(12).fill(0).map((_, i) => <Skeleton key={i} className="flex-1 h-full" />)}</div>;
  if (!data?.length) return (
    <div className="flex items-center justify-center h-36 text-sm" style={{ color: T.textDim }}>
      Ma'lumot mavjud emas
    </div>
  );

  const maxVal = Math.max(...data.map(d => d.count), 1);
  const total  = data.reduce((s, d) => s + d.count, 0);
  const H = 140;

  return (
    <div className="relative">
      {hovered !== null && (
        <div
          className="absolute z-10 px-2.5 py-1.5 rounded-lg text-xs font-semibold pointer-events-none shadow-lg"
          style={{
            background: T.text, color: "#fff",
            top: 0, left: `${(hovered / data.length) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {MONTHS[data[hovered]._id - 1]}: {data[hovered].count} ta
        </div>
      )}
      <svg width="100%" height={H} viewBox={`0 0 ${data.length * 36} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.redBr} />
            <stop offset="100%" stopColor={T.red} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="barHov" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor={T.redBr} />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const bh = Math.max(4, (d.count / maxVal) * (H - 28));
          const x  = i * 36 + 4;
          const y  = H - bh - 18;
          return (
            <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <rect x={x} y={0} width={28} height={H - 18} rx={4} fill="transparent" />
              <motion.rect
                x={x} width={28} rx={4}
                fill={hovered === i ? "url(#barHov)" : "url(#barGrad)"}
                opacity={hovered === null ? 0.85 : hovered === i ? 1 : 0.4}
                initial={{ y: H - 18, height: 0 }}
                animate={{ y, height: bh }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <text x={x + 14} y={H - 4} textAnchor="middle" fontSize="8" fontWeight="700"
                fill={hovered === i ? T.redBr : T.textDim} fontFamily="system-ui">
                {MONTHS[d._id - 1]}
              </text>
              {d.count > 0 && (
                <text x={x + 14} y={y - 3} textAnchor="middle" fontSize="8" fontWeight="800"
                  fill={T.redBr} fontFamily="system-ui">
                  {d.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px]" style={{ color: T.textDim }}>Jami: <b style={{ color: T.text }}>{total} ta</b> foydalanuvchi</span>
        <span className="text-[10px]" style={{ color: T.textDim }}>{new Date().getFullYear()} yil</span>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, trend, trendUp, color, loading, delay = 0, onClick }) {
  const colors = {
    red:  { icon: T.redBr,  iconBg: T.redLight,  trend: trendUp ? T.success : T.redBr },
    blue: { icon: "#2563EB", iconBg: "#EFF6FF",   trend: trendUp ? T.success : "#DC2626" },
    green:{ icon: "#16A34A", iconBg: "#F0FDF4",   trend: trendUp ? T.success : "#DC2626" },
    amber:{ icon: "#D97706", iconBg: "#FFFBEB",   trend: trendUp ? T.success : "#DC2626" },
    sky:  { icon: "#0284C7", iconBg: "#F0F9FF",   trend: trendUp ? T.success : "#DC2626" },
    violet:{icon: "#7C3AED", iconBg: "#F5F3FF",   trend: trendUp ? T.success : "#DC2626" },
  };
  const c = colors[color] ?? colors.red;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: T.surface, border: `1px solid ${T.border}`, transition: "box-shadow .2s, transform .2s", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px #00000012"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.iconBg }}>
          <Icon style={{ color: c.icon, fontSize: 18 }} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ color: c.trend, background: trendUp ? T.successBg : "#FEF2F2" }}>
            {trendUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
            {trend}
          </span>
        )}
      </div>
      <div>
        {loading
          ? <><Skeleton className="h-7 w-20 mb-1" /><Skeleton className="h-3 w-16" /></>
          : <>
              <p className="text-2xl font-black leading-none tabular-nums" style={{ color: T.text }}>{fmt(value)}</p>
              <p className="text-[11px] font-semibold mt-1.5 uppercase tracking-wider" style={{ color: T.textMuted }}>{label}</p>
              {sub && <p className="text-[10px] mt-0.5" style={{ color: T.textDim }}>{sub}</p>}
            </>
        }
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [clock, setClock] = useState(new Date());

  const { data: apiStats, isLoading: loading, refetch: fetchStats } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminDashboardService.getStats,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  const s = apiStats?.stats ?? {};

  // ── Derived data ──────────────────────────────────────────────────────────
  const regData = (() => {
    const regs = apiStats?.monthlyRegistrations;
    if (!regs?.length) return [];
    const map = {};
    regs.forEach(m => { map[m._id] = m.count; });
    return Array.from({ length: 12 }, (_, i) => ({ _id: i + 1, count: map[i + 1] ?? 0 }));
  })();

  const liveActivity = (() => {
    if (!apiStats) return [];
    return [
      ...(apiStats.recentUsers ?? []).map(u => ({
        icon: FiUserPlus, color: T.success, bg: T.successBg,
        text: `${u.firstName} ${u.lastName}`,
        sub:  `${u.role} sifatida ro'yxatdan o'tdi`,
        time: timeSince(u.createdAt),
        _ts:  new Date(u.createdAt).getTime(),
        href: "/admin/users",
      })),
      ...(apiStats.recentAds ?? []).map(a => ({
        icon: FiLayers, color: T.sky, bg: T.skyBg,
        text: a.companyName || a.title || "E'lon",
        sub:  `Yangi ${a.type === "business" ? "biznes" : "blogger"} e'loni — ${AD_STATUS[a.status]?.label ?? ""}`,
        time: timeSince(a.createdAt),
        _ts:  new Date(a.createdAt).getTime(),
        href: "/admin/ads",
      })),
    ].sort((a, b) => b._ts - a._ts).slice(0, 8);
  })();

  const recentAdsRows = (apiStats?.recentAds ?? []).map((a, i) => ({
    id:       `#${(a._id ?? "").toString().slice(-5).toUpperCase()}`,
    brand:    a.companyName || a.title || "-",
    user:     a.user ? `${a.user.firstName} ${a.user.lastName}` : "-",
    platform: a.platforms?.[0] ?? a.targetPlatforms?.[0] ?? "instagram",
    type:     a.type === "business" ? "Biznes" : "Blogger",
    status:   a.status ?? "pending",
    date:     new Date(a.createdAt).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" }),
  }));

  const topBloggersRows = (apiStats?.topBloggers ?? []).map((b) => ({
    name:      b.user ? `${b.user.firstName} ${b.user.lastName}` : "-",
    handle:    `@${b.handle ?? "blogger"}`,
    platform:  b.platforms?.[0] ?? "instagram",
    followers: fmt(b.followers ?? 0),
    er:        `${(b.engagementRate ?? 0).toFixed(1)}%`,
    campaigns: b.stats?.totalCampaigns ?? 0,
    rating:    b.rating ?? 0,
    cat:       b.categories?.[0] ?? "Other",
  }));

  const nicheTotalCount = (apiStats?.categoryBreakdown ?? []).reduce((sum, c) => sum + c.count, 0);
  const nicheRows = (apiStats?.categoryBreakdown ?? []).map((c, i) => ({
    name:  CATEGORY_LABEL[c._id] ?? c._id,
    count: c.count,
    pct:   nicheTotalCount ? Math.round((c.count / nicheTotalCount) * 100) : 0,
    color: ["#C62828","#1565C0","#2E7D32","#6A1B9A","#E65100","#00695C"][i] ?? T.red,
  }));

  const newBusinessRows = (apiStats?.recentBusinesses ?? []).map((b) => ({
    name:    `${b.firstName} ${b.lastName}`,
    email:   b.email,
    joined:  timeSince(b.createdAt),
  }));

  const hour = clock.getHours();
  const greeting = hour < 12 ? "Xayrli tong" : hour < 18 ? "Xayrli kun" : "Xayrli kech";

  const STATS_CFG = [
    { icon: FiUsers,        label: "Foydalanuvchilar", value: s.totalUsers,         sub: `${s.pendingApplications ?? 0} ta kutilmoqda`, color: "red",    trendUp: true,  href: "/admin/users"        },
    { icon: FiActivity,     label: "Bloggerlar",        value: s.totalBloggers,      sub: "Faol blogerlar",                              color: "blue",   trendUp: true,  href: "/admin/bloggers"     },
    { icon: FiLayers,       label: "E'lonlar",           value: s.totalAds,           sub: `${s.pendingAds ?? 0} ta ko'rib chiqilmoqda`,  color: "sky",    trendUp: true,  href: "/admin/ads"          },
    { icon: FiCalendar,     label: "Kampaniyalar",       value: s.totalCampaigns,     sub: `${s.completedCampaigns ?? 0} ta yakunlangan`, color: "green",  trendUp: true,  href: "/admin/ads"          },
    { icon: FiStar,         label: "Blog postlar",       value: s.totalBlogs,         sub: "Nashr etilgan",                               color: "violet", trendUp: true,  href: "/admin/blogs"        },
    { icon: FiAlertCircle,  label: "Kutilayotgan e'lon", value: s.pendingAds,         sub: "Ko'rib chiqish kerak",                         color: "amber",  trendUp: false, href: "/admin/ads"          },
    { icon: FiMessageSquare,label: "Yangi xabarlar",    value: s.newContacts,        sub: "Javob berilmagan",                            color: "sky",    trendUp: false, href: "/admin/contact"      },
    { icon: FiCheckCircle,  label: "Yakunlangan",        value: s.completedCampaigns, sub: "Muvaffaqiyatli kampaniyalar",                 color: "green",  trendUp: true,  href: "/admin/ads"          },
  ];

  // Completion rate
  const completionRate = s.totalCampaigns
    ? Math.round(((s.completedCampaigns ?? 0) / s.totalCampaigns) * 100)
    : 0;
  const approvalRate = (s.totalUsers ?? 0) + (s.pendingApplications ?? 0) > 0
    ? Math.round(((s.totalUsers ?? 0) / ((s.totalUsers ?? 0) + (s.pendingApplications ?? 0))) * 100)
    : 0;

  return (
    <div className="min-h-screen" style={{ background: T.bg, fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

        {/* Greeting Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="rounded-2xl px-6 py-5 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg,${T.red}18,${T.surface})`, border: `1px solid ${T.redBr}22` }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: T.redBr }}>
              {clock.toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <h2 className="text-xl font-black" style={{ color: T.text }}>{greeting}, Admin 👋</h2>
            <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>
              Platformada{" "}
              <span onClick={() => navigate("/admin/users")} className="font-bold cursor-pointer hover:underline" style={{ color: T.redBr }}>{s.totalUsers ?? "..."}</span> foydalanuvchi,{" "}
              <span onClick={() => navigate("/admin/ads")} className="font-bold cursor-pointer hover:underline" style={{ color: T.redBr }}>{s.pendingAds ?? "..."}</span> e'lon ko'rib chiqilmoqda
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <p className="text-4xl font-black tabular-nums" style={{ color: T.text }}>
              {clock.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <button onClick={() => fetchStats()} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
              borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface,
              color: T.textMuted, cursor: "pointer", fontSize: 11, fontWeight: 600,
            }}>
              <FiRefreshCw size={11} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
              Yangilash
            </button>
          </div>
        </motion.div>

        {/* ── 8 Stat Cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS_CFG.map((cfg, i) => (
            <StatCard key={cfg.label} {...cfg} loading={loading} delay={i * 0.05} onClick={() => navigate(cfg.href)} />
          ))}
        </div>

        {/* ── Chart + Quick Stats Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Registration Chart */}
          <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color: T.text }}>Ro'yxatga olish statistikasi</h3>
                <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>Oylik yangi foydalanuvchilar ({new Date().getFullYear()})</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
                style={{ background: T.redLight, color: T.redBr }}>
                <HiOutlineSparkles />
                Real ma'lumot
              </div>
            </div>
            <RegistrationChart data={regData} loading={loading} />
          </div>

          {/* Quick Numbers */}
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <h3 className="text-base font-bold" style={{ color: T.text }}>Tezkor ko'rsatkichlar</h3>

            {[
              {
                label: "Tasdiqlash darajasi",
                value: loading ? null : `${approvalRate}%`,
                sub: `${s.totalUsers ?? 0} / ${(s.totalUsers ?? 0) + (s.pendingApplications ?? 0)} ariza`,
                pct: approvalRate,
                color: T.success,
                href: "/admin/applications",
              },
              {
                label: "Kampaniya yakunlash",
                value: loading ? null : `${completionRate}%`,
                sub: `${s.completedCampaigns ?? 0} / ${s.totalCampaigns ?? 0} kampaniya`,
                pct: completionRate,
                color: T.sky,
                href: "/admin/ads",
              },
              {
                label: "Kutilayotgan arizalar",
                value: loading ? null : String(s.pendingApplications ?? 0),
                sub: "Ko'rib chiqilishi kerak",
                pct: null,
                color: T.warn,
                urgent: (s.pendingApplications ?? 0) > 0,
                href: "/admin/applications",
              },
              {
                label: "Javob berilmagan xabarlar",
                value: loading ? null : String(s.newContacts ?? 0),
                sub: "Yangi murojaat",
                pct: null,
                color: T.redBr,
                urgent: (s.newContacts ?? 0) > 0,
                href: "/admin/contact",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1.5" onClick={() => navigate(item.href)}
                style={{ cursor: "pointer", padding: "6px 8px", borderRadius: 10, margin: "-6px -8px" }}
                onMouseEnter={e => e.currentTarget.style.background = T.bg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: T.textMuted }}>{item.label}</span>
                  {loading
                    ? <Skeleton className="h-4 w-10" />
                    : <span className="text-sm font-black" style={{ color: item.urgent ? item.color : T.text }}>
                        {item.value}
                      </span>
                  }
                </div>
                {item.pct !== null && (
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bg }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full" style={{ background: item.color }} />
                  </div>
                )}
                <p className="text-[10px]" style={{ color: T.textDim }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Ads + Activity Feed ──────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Recent Ads Table */}
          <div className="xl:col-span-2 rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: T.border }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: T.text }}>So'nggi E'lonlar</h3>
                <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>Oxirgi qo'shilgan e'lonlar</p>
              </div>
              <button onClick={() => navigate("/admin/ads")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: T.redBr, background: "none", border: "none", cursor: "pointer" }}>
                Barchasi <FiChevronRight />
              </button>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : recentAdsRows.length === 0 ? (
              <div className="py-16 text-center text-sm" style={{ color: T.textDim }}>E'lonlar mavjud emas</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
                      {["ID","Kompaniya / Sarlavha","Foydalanuvchi","Platforma","Tur","Status","Sana"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                          style={{ color: T.textDim }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentAdsRows.map((row, i) => {
                      const plt = getPlatform(row.platform);
                      const PIcon = plt.icon;
                      return (
                        <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                          onClick={() => navigate("/admin/ads")}
                          className="border-b cursor-pointer" style={{ borderColor: T.border }}
                          onMouseEnter={e => e.currentTarget.style.background = T.bg}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td className="px-4 py-3 text-xs font-black" style={{ color: T.redBr }}>{row.id}</td>
                          <td className="px-4 py-3 text-xs font-semibold max-w-[140px] truncate" style={{ color: T.text }}>{row.brand}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={row.user} size={26} idx={i} />
                              <span className="text-xs font-medium truncate max-w-[90px]" style={{ color: T.textMuted }}>{row.user}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: plt.bg, color: plt.color }}>
                              <PIcon className="text-[9px]" />
                              {row.platform}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: T.textMuted }}>{row.type}</td>
                          <td className="px-4 py-3"><Badge status={row.status} /></td>
                          <td className="px-4 py-3 text-xs" style={{ color: T.textDim }}>{row.date}</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Live Activity Feed */}
          <div className="rounded-2xl p-5 flex flex-col" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold" style={{ color: T.text }}>Jonli faoliyat</h3>
                <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>Real vaqt yangilanishlari</p>
              </div>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 rounded-full" style={{ background: T.success }} />
            </div>

            {loading ? (
              <div className="space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : liveActivity.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm" style={{ color: T.textDim }}>
                Faoliyat yo'q
              </div>
            ) : (
              <div className="flex-1 space-y-1 overflow-y-auto max-h-80">
                {liveActivity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => navigate(a.href)}
                      className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer"
                      onMouseEnter={e => e.currentTarget.style.background = T.bg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: a.bg }}>
                        <Icon style={{ color: a.color }} className="text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{a.text}</p>
                        <p className="text-[10px] mt-0.5 truncate" style={{ color: T.textMuted }}>{a.sub}</p>
                        <p className="text-[9px] mt-0.5 flex items-center gap-1" style={{ color: T.textDim }}>
                          <FiClock className="text-[8px]" /> {a.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom Row: Top Bloggers + Niche + New Businesses ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Top Bloggers */}
          <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: T.border }}>
              <h3 className="text-sm font-bold" style={{ color: T.text }}>Top Bloggerlar</h3>
              <button onClick={() => navigate("/admin/bloggers")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: T.redBr, background: "none", border: "none", cursor: "pointer" }}>
                Barchasi <FiChevronRight />
              </button>
            </div>
            {loading ? (
              <div className="p-4 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : topBloggersRows.length === 0 ? (
              <div className="py-12 text-center text-xs" style={{ color: T.textDim }}>Ma'lumot yuklanmoqda...</div>
            ) : (
              <div className="divide-y" style={{ borderColor: T.border }}>
                {topBloggersRows.map((b, i) => {
                  const plt = getPlatform(b.platform);
                  const PIcon = plt.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => navigate("/admin/bloggers")}
                      className="flex items-center gap-3 px-5 py-3.5 cursor-pointer"
                      onMouseEnter={e => e.currentTarget.style.background = T.bg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <span className="text-sm font-black w-5 text-center shrink-0" style={{ color: T.textDim }}>
                        {["🥇","🥈","🥉"][i] ?? i + 1}
                      </span>
                      <Avatar name={b.name} size={34} idx={i + 1} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: T.text }}>{b.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px]" style={{ color: T.textDim }}>{b.handle}</span>
                          <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: plt.bg, color: plt.color }}>
                            <PIcon className="text-[7px]" /> {b.platform}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black" style={{ color: T.text }}>{b.followers}</p>
                        <p className="text-[9px] mt-0.5" style={{ color: "#16A34A" }}>{b.er} ER</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Niche Breakdown */}
          <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: T.text }}>Kategoriya taqsimoti</h3>
                <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>Blogger niches</p>
              </div>
              <button onClick={() => navigate("/admin/categories")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: T.redBr, background: "none", border: "none", cursor: "pointer" }}>
                Barchasi <FiChevronRight />
              </button>
            </div>
            {loading ? (
              <div className="space-y-4">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : nicheRows.length === 0 ? (
              <div className="py-12 text-center text-xs" style={{ color: T.textDim }}>Ma'lumot yuklanmoqda...</div>
            ) : (
              <div className="space-y-4">
                {nicheRows.map((cat, i) => (
                  <motion.div key={cat.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                        <span className="text-xs font-semibold" style={{ color: T.text }}>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: T.textDim }}>{cat.count} ta</span>
                        <span className="text-xs font-black" style={{ color: cat.color }}>{cat.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: T.bg }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: cat.color, opacity: 0.85 }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* New Businesses */}
          <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold" style={{ color: T.text }}>Yangi Bizneslar</h3>
                <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>So'nggi qo'shilganlar</p>
              </div>
              <button onClick={() => navigate("/admin/users")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: T.redBr, background: "none", border: "none", cursor: "pointer" }}>
                Barchasi <FiChevronRight />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : newBusinessRows.length === 0 ? (
              <div className="py-12 text-center text-xs" style={{ color: T.textDim }}>Ma'lumot yuklanmoqda...</div>
            ) : (
              <div className="space-y-2">
                {newBusinessRows.map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => navigate("/admin/users")}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <Avatar name={b.name} size={36} idx={i + 2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{b.name}</p>
                      <p className="text-[10px] truncate" style={{ color: T.textDim }}>{b.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] shrink-0" style={{ color: T.textDim }}>
                      <FiClock className="text-[8px]" />
                      {b.joined}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pending Applications Alert */}
            {!loading && (s.pendingApplications ?? 0) > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                onClick={() => navigate("/admin/applications")}
                className="mt-4 flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                style={{ background: T.warnBg, border: `1px solid ${T.warnBd}` }}>
                <FiAlertCircle style={{ color: T.warn, flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: T.warn }}>
                    {s.pendingApplications} ta ariza kutmoqda
                  </p>
                  <p className="text-[10px]" style={{ color: T.textMuted }}>Ko'rib chiqish talab etiladi</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
