import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminStatisticsService } from "../../services/adminService";
import { CATEGORY_LABEL } from "../../config/categories";
import {
  PiChartBarDuotone, PiChartPieDuotone, PiChartLineUpDuotone,
  PiUsersDuotone, PiRssDuotone, PiBriefcaseDuotone,
  PiMegaphoneSimpleDuotone, PiArticleDuotone, PiCalendarDotsDuotone,
  PiEnvelopeDuotone, PiStarDuotone, PiArrowsClockwiseDuotone,
} from "react-icons/pi";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ─ tokens ─ */
const T = {
  bg: "#f4f6fb",
  surface: "#ffffff",
  border: "#e5e7eb",
  text: "#0f172a",
  muted: "#6b7280",
  dim: "#9ca3af",
  red: "#dc2626",
};

const PALETTE = [
  "#dc2626","#2563eb","#16a34a","#7c3aed","#d97706",
  "#0891b2","#db2777","#ea580c","#84cc16","#0d9488",
];

const MONTHS_SHORT = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];

const fmt = (n) => n >= 1_000_000 ? (n/1_000_000).toFixed(1)+"M" : n >= 1_000 ? (n/1_000).toFixed(1)+"K" : String(n ?? 0);

/* ─ Stat card ─ */
function StatCard({ icon: Icon, label, value, sub, color = "#dc2626", loading }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} style={{ color }} />
      </div>
      {loading ? (
        <div style={{ height: 28, background: "#e5e7eb", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
      ) : (
        <>
          <div style={{ fontSize: 28, fontWeight: 900, color: T.text, lineHeight: 1 }}>{fmt(value ?? 0)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: T.dim, marginTop: -4 }}>{sub}</div>}
        </>
      )}
    </div>
  );
}

/* ─ Section header ─ */
function Section({ icon: Icon, title, sub, children }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} style={{ color: T.red }} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      <div style={{ padding: "20px 22px" }}>{children}</div>
    </div>
  );
}

/* ─ Custom Tooltip ─ */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", color: "#fff", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
      {label && <div style={{ marginBottom: 4, color: "#94a3b8" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

/* ─ Main ─ */
export default function AdminStatistics() {
  const { data: raw, isLoading: loading, refetch } = useQuery({
    queryKey: ["admin-statistics"],
    queryFn: adminStatisticsService.getStats,
    staleTime: 5 * 60 * 1000,
  });

  /* Monthly registrations — last 12 months */
  const monthlyRegs = useMemo(() => {
    if (!raw?.monthlyRegs) return [];
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = raw.monthlyRegs.find(r => r._id.year === year && r._id.month === month);
      return { month: MONTHS_SHORT[month - 1], count: found?.count ?? 0 };
    });
  }, [raw]);

  /* Monthly ads — last 12 months */
  const monthlyAds = useMemo(() => {
    if (!raw?.monthlyAdsDist) return [];
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const found = raw.monthlyAdsDist.find(r => r._id.year === year && r._id.month === month);
      return { month: MONTHS_SHORT[month - 1], count: found?.count ?? 0 };
    });
  }, [raw]);

  /* Platform distribution */
  const platformData = useMemo(() =>
    (raw?.platformDist ?? []).map((p, i) => ({
      name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
      value: p.count,
      fill: PALETTE[i] ?? "#6b7280",
    })), [raw]);

  /* Category distribution */
  const categoryData = useMemo(() =>
    (raw?.categoryDist ?? []).map((c, i) => ({
      name: CATEGORY_LABEL?.[c._id] ?? c._id,
      count: c.count,
      fill: PALETTE[i] ?? "#6b7280",
    })), [raw]);

  /* User role pie */
  const roleData = useMemo(() =>
    (raw?.userRoleDist ?? []).map((r, i) => ({
      name: r._id === "blogger" ? "Bloggerlar" : r._id === "business" ? "Biznesmenlar" : r._id,
      value: r.count,
      fill: PALETTE[i] ?? "#6b7280",
    })), [raw]);

  /* Ad status pie */
  const adStatusData = useMemo(() => {
    const STATUS_LABEL = { pending: "Kutilmoqda", approved: "Tasdiqlangan", active: "Faol", rejected: "Rad etilgan", completed: "Yakunlangan" };
    const STATUS_COLOR = { pending: "#d97706", approved: "#16a34a", active: "#2563eb", rejected: "#dc2626", completed: "#6b7280" };
    return (raw?.adStatusDist ?? []).map(a => ({
      name: STATUS_LABEL[a._id] ?? a._id,
      value: a.count,
      fill: STATUS_COLOR[a._id] ?? "#94a3b8",
    }));
  }, [raw]);

  /* Top bloggers */
  const topBloggers = useMemo(() =>
    (raw?.topBloggers ?? []).map((b, i) => ({
      rank: i + 1,
      name: b.user ? `${b.user.firstName} ${b.user.lastName}` : "—",
      handle: b.handle ? `@${b.handle}` : "—",
      platform: b.platforms?.[0] ?? "—",
      followers: b.followers ?? 0,
      er: b.engagementRate ?? 0,
      rating: b.rating ?? 0,
      category: CATEGORY_LABEL?.[b.categories?.[0]] ?? b.categories?.[0] ?? "—",
    })), [raw]);

  const o = raw?.overview ?? {};

  const STAT_CARDS = [
    { icon: PiRssDuotone,              label: "Bloggerlar",    value: o.totalBloggers,    sub: "Faol bloggerlar",     color: "#7c3aed" },
    { icon: PiBriefcaseDuotone,        label: "Biznesmenlar",  value: o.totalBusinessmen, sub: "Tasdiqlangan",        color: "#dc2626" },
    { icon: PiMegaphoneSimpleDuotone,  label: "E'lonlar",       value: o.totalAds,         sub: `${o.totalAds ?? 0} jami`, color: "#2563eb" },
    { icon: PiArticleDuotone,          label: "Blog postlar",  value: o.totalBlogs,       sub: "Nashr etilgan",       color: "#16a34a" },
    { icon: PiCalendarDotsDuotone,     label: "Kampaniyalar",  value: o.totalCampaigns,   sub: "Jami kampaniyalar",   color: "#d97706" },
    { icon: PiEnvelopeDuotone,         label: "Xabarlar",      value: o.totalContacts,    sub: "Jami murojaatlar",    color: "#0891b2" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter',system-ui,sans-serif", padding: "28px 32px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text }}>Statistika</div>
            <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>Platformaning batafsil tahlili va ko'rsatkichlari</div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, color: T.muted, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
          >
            <PiArrowsClockwiseDuotone size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            Yangilash
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 24 }}>
          {STAT_CARDS.map(c => <StatCard key={c.label} {...c} loading={loading} />)}
        </div>

        {/* Row 1: Monthly Registrations + User Role Pie */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>

          <Section icon={PiChartLineUpDuotone} title="Oylik ro'yxatdan o'tishlar" sub="Oxirgi 12 oy davomida yangi foydalanuvchilar">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyRegs} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.dim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.dim }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="count" name="Foydalanuvchilar" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4, fill: "#dc2626" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          <Section icon={PiChartPieDuotone} title="Foydalanuvchi turlari" sub="Blogger va biznesmenlar nisbati">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" outerRadius={85} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {roleData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Section>
        </div>

        {/* Row 2: Platform Bar + Category Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          <Section icon={PiChartBarDuotone} title="Platforma taqsimoti" sub="Bloggerlarda eng ko'p ishlatiladigan platformalar">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={platformData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.dim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.dim }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Bloggerlar" radius={[6, 6, 0, 0]}>
                  {platformData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section icon={PiChartBarDuotone} title="Kategoriya taqsimoti" sub="Bloggerlar bo'yicha kategoriyalar">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 8, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: T.dim }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: T.dim }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Blogger" radius={[0, 6, 6, 0]}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </div>

        {/* Row 3: Monthly Ads + Ad Status Pie */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>

          <Section icon={PiChartLineUpDuotone} title="Oylik e'lonlar" sub="Oxirgi 12 oy davomida e'lonlar soni">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyAds} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.dim }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.dim }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="E'lonlar" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section icon={PiChartPieDuotone} title="E'lon holatlari" sub="Statuslar bo'yicha taqsimot">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={adStatusData} cx="50%" cy="45%" outerRadius={75} dataKey="value" nameKey="name">
                  {adStatusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </Section>
        </div>

        {/* Top Bloggers Table */}
        <Section icon={PiStarDuotone} title="Top 10 Blogger" sub="Eng ko'p obunachiga ega bloggerlar">
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: T.dim }}>Yuklanmoqda...</div>
          ) : topBloggers.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: T.dim }}>Ma'lumot yo'q</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: T.bg }}>
                    {["#","Ism","Handle","Platforma","Obunachilar","ER%","Reyting","Kategoriya"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 800, color: T.dim, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topBloggers.map((b) => (
                    <tr key={b.rank} style={{ borderBottom: `1px solid #f9fafb` }}
                      onMouseEnter={e => e.currentTarget.style.background = T.bg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "11px 14px", fontWeight: 800, color: T.red }}>
                        {b.rank <= 3 ? ["🥇","🥈","🥉"][b.rank - 1] : b.rank}
                      </td>
                      <td style={{ padding: "11px 14px", fontWeight: 700, color: T.text }}>{b.name}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{b.handle}</span>
                      </td>
                      <td style={{ padding: "11px 14px", color: T.muted, textTransform: "capitalize" }}>{b.platform}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 800, color: T.text }}>{fmt(b.followers)}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>{b.er.toFixed(1)}%</span>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <PiStarDuotone size={12} style={{ color: "#f59e0b" }} />
                          <span style={{ fontWeight: 700, color: T.text }}>{b.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", color: T.muted, fontSize: 12 }}>{b.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
        @media (max-width: 1024px) {
          .stats-grid-6 { grid-template-columns: repeat(3, 1fr) !important; }
          .stats-grid-2-1, .stats-grid-1-1 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid-6 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
