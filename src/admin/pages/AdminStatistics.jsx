import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminStatisticsService } from "../../services/adminService";
import { CATEGORY_LABEL } from "../../config/categories";
import {
  PiChartBarDuotone, PiChartPieDuotone, PiChartLineUpDuotone,
  PiRssDuotone, PiBriefcaseDuotone,
  PiMegaphoneSimpleDuotone, PiArticleDuotone, PiCalendarDotsDuotone,
  PiEnvelopeDuotone, PiStarDuotone, PiArrowsClockwiseDuotone,
} from "react-icons/pi";

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

/* ─ Line Chart SVG ─ */
function LineChartSVG({ data = [], dataKey = "count", color = "#dc2626", height = 200 }) {
  const [tooltip, setTooltip] = useState(null);
  if (!data.length) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: T.dim, fontSize: 12 }}>Ma'lumot yo'q</div>;

  const W = 700, H = height, padL = 36, padR = 16, padT = 12, padB = 32;
  const vals = data.map(d => d[dataKey]);
  const max = Math.max(...vals, 1);
  const step = (W - padL - padR) / (data.length - 1 || 1);

  const toX = i => padL + i * step;
  const toY = v => padT + (H - padT - padB) * (1 - v / max);

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d[dataKey]), d }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${points[points.length - 1].x},${H - padB} L${padL},${H - padB} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(max * t));

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Y grid */}
        {yTicks.map((tick, i) => {
          const y = toY(tick);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize={9} fill={T.dim}>{tick}</text>
            </g>
          );
        })}
        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - padB + 16} textAnchor="middle" fontSize={9} fill={T.dim}>{d.month}</text>
        ))}
        {/* Area */}
        <path d={areaD} fill="url(#lineGrad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* Dots + hover targets */}
        {points.map((p, i) => (
          <g key={i}
            onMouseEnter={() => setTooltip({ x: p.x, y: p.y, label: p.d.month, value: p.d[dataKey] })}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
            <circle cx={p.x} cy={p.y} r={4} fill={color} stroke="#fff" strokeWidth={2} />
          </g>
        ))}
      </svg>
      {tooltip && (
        <div style={{ position: "absolute", left: `${(tooltip.x / W) * 100}%`, top: tooltip.y - 44, transform: "translateX(-50%)", background: "#1e293b", color: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10 }}>
          {tooltip.label}: <b>{tooltip.value}</b>
        </div>
      )}
    </div>
  );
}

/* ─ Bar Chart SVG ─ */
function BarChartSVG({ data = [], dataKey = "count", height = 200 }) {
  const [tooltip, setTooltip] = useState(null);
  if (!data.length) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: T.dim, fontSize: 12 }}>Ma'lumot yo'q</div>;

  const W = 700, H = height, padL = 36, padR = 16, padT = 12, padB = 32;
  const vals = data.map(d => d[dataKey] ?? d.value ?? d.count ?? 0);
  const max = Math.max(...vals, 1);
  const barW = Math.min(40, ((W - padL - padR) / data.length) * 0.6);
  const gap = (W - padL - padR) / data.length;

  const toY = v => padT + (H - padT - padB) * (1 - v / max);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(max * t));

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
        {yTicks.map((tick, i) => {
          const y = toY(tick);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize={9} fill={T.dim}>{tick}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const v = vals[i];
          const x = padL + i * gap + gap / 2 - barW / 2;
          const y = toY(v);
          const bH = H - padB - y;
          const color = d.fill ?? PALETTE[i % PALETTE.length];
          return (
            <g key={i}
              onMouseEnter={() => setTooltip({ x: padL + i * gap + gap / 2, y, label: d.name ?? d.month, value: v })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "pointer" }}>
              <rect x={x} y={y} width={barW} height={Math.max(bH, 0)} fill={color} rx={4} ry={4} />
              <text x={padL + i * gap + gap / 2} y={H - padB + 16} textAnchor="middle" fontSize={9} fill={T.dim}>{d.name ?? d.month}</text>
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div style={{ position: "absolute", left: `${(tooltip.x / W) * 100}%`, top: tooltip.y - 44, transform: "translateX(-50%)", background: "#1e293b", color: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10 }}>
          {tooltip.label}: <b>{tooltip.value}</b>
        </div>
      )}
    </div>
  );
}

/* ─ Horizontal Bar (CSS) ─ */
function HBarChart({ data = [] }) {
  if (!data.length) return <div style={{ color: T.dim, fontSize: 12, textAlign: "center", padding: 20 }}>Ma'lumot yo'q</div>;
  const max = Math.max(...data.map(d => d.count ?? d.value ?? 0), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d, i) => {
        const v = d.count ?? d.value ?? 0;
        const pct = (v / max) * 100;
        const color = d.fill ?? PALETTE[i % PALETTE.length];
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
              <span style={{ color: T.text, fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
              <span style={{ color: T.muted, fontWeight: 700 }}>{v}</span>
            </div>
            <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─ Donut Chart SVG ─ */
function DonutChart({ data = [], height = 200 }) {
  const [hovered, setHovered] = useState(null);
  if (!data.length) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: T.dim, fontSize: 12 }}>Ma'lumot yo'q</div>;

  const total = data.reduce((s, d) => s + (d.value ?? 0), 0) || 1;
  const cx = 100, cy = 100, R = 80, r = 50;
  let angle = -Math.PI / 2;

  const slices = data.map((d) => {
    const frac = (d.value ?? 0) / total;
    const a1 = angle, a2 = angle + frac * 2 * Math.PI;
    angle = a2;
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    const ix1 = cx + r * Math.cos(a1), iy1 = cy + r * Math.sin(a1);
    const ix2 = cx + r * Math.cos(a2), iy2 = cy + r * Math.sin(a2);
    const large = frac > 0.5 ? 1 : 0;
    const path = `M${ix1},${iy1} L${x1},${y1} A${R},${R},0,${large},1,${x2},${y2} L${ix2},${iy2} A${r},${r},0,${large},0,${ix1},${iy1} Z`;
    return { ...d, path, frac, midA: (a1 + a2) / 2 };
  });

  const active = hovered !== null ? data[hovered] : null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <svg viewBox="0 0 200 200" style={{ width: height, height, flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.fill ?? PALETTE[i % PALETTE.length]}
            stroke="#fff"
            strokeWidth={2}
            opacity={hovered === null || hovered === i ? 1 : 0.5}
            style={{ cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={14} fontWeight={900} fill={T.text}>
          {active ? fmt(active.value) : fmt(total)}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill={T.muted}>
          {active ? active.name : "Jami"}
        </text>
      </svg>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 100 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", opacity: hovered === null || hovered === i ? 1 : 0.5 }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.fill ?? PALETTE[i % PALETTE.length], flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: T.muted, flex: 1 }}>{s.name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{s.value}</span>
            <span style={{ fontSize: 10, color: T.dim }}>({(s.frac * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    { icon: PiRssDuotone,             label: "Bloggerlar",   value: o.totalBloggers,    sub: "Faol bloggerlar",   color: "#7c3aed" },
    { icon: PiBriefcaseDuotone,       label: "Biznesmenlar", value: o.totalBusinessmen, sub: "Tasdiqlangan",      color: "#dc2626" },
    { icon: PiMegaphoneSimpleDuotone, label: "E'lonlar",      value: o.totalAds,         sub: "Jami e'lonlar",     color: "#2563eb" },
    { icon: PiArticleDuotone,         label: "Blog postlar", value: o.totalBlogs,       sub: "Nashr etilgan",     color: "#16a34a" },
    { icon: PiCalendarDotsDuotone,    label: "Kampaniyalar", value: o.totalCampaigns,   sub: "Jami kampaniyalar", color: "#d97706" },
    { icon: PiEnvelopeDuotone,        label: "Xabarlar",     value: o.totalContacts,    sub: "Jami murojaatlar",  color: "#0891b2" },
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
            <LineChartSVG data={monthlyRegs} dataKey="count" color="#dc2626" height={220} />
          </Section>
          <Section icon={PiChartPieDuotone} title="Foydalanuvchi turlari" sub="Blogger va biznesmenlar nisbati">
            <DonutChart data={roleData} height={180} />
          </Section>
        </div>

        {/* Row 2: Platform Bar + Category HBar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <Section icon={PiChartBarDuotone} title="Platforma taqsimoti" sub="Bloggerlarda eng ko'p ishlatiladigan platformalar">
            <BarChartSVG data={platformData} dataKey="value" height={200} />
          </Section>
          <Section icon={PiChartBarDuotone} title="Kategoriya taqsimoti" sub="Bloggerlar bo'yicha kategoriyalar">
            <HBarChart data={categoryData} />
          </Section>
        </div>

        {/* Row 3: Monthly Ads Bar + Ad Status Pie */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
          <Section icon={PiChartBarDuotone} title="Oylik e'lonlar" sub="Oxirgi 12 oy davomida e'lonlar soni">
            <BarChartSVG data={monthlyAds} dataKey="count" height={200} />
          </Section>
          <Section icon={PiChartPieDuotone} title="E'lon holatlari" sub="Statuslar bo'yicha taqsimot">
            <DonutChart data={adStatusData} height={180} />
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
        @media (max-width: 1200px) {
          .stats-grid-6 { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-grid-6 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
