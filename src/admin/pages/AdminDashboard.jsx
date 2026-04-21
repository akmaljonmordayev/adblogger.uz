import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiActivity,
  FiBell,
  FiSearch,
  FiArrowUpRight,
  FiArrowDownRight,
  FiAlertCircle,
  FiRefreshCw,
  FiTarget,
  FiMapPin,
  FiMessageSquare,
  FiUserPlus,
  FiAward,
  FiChevronRight,
  FiCheckCircle,
  FiZap,
  FiHeart,
  FiYoutube,
  FiInstagram,
  FiLayers,
} from "react-icons/fi";
import { BsStarFill, BsStarHalf, BsStar, BsTiktok } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";

const C = {
  crimson: "#D32F2F", 
  crimsonMid: "#E53935", 
  crimsonBr: "#F44336", 
  rose: "#FFEBEE", 
  bg: "#F3F4F6", 
  surface: "#FFFFFF", 
  surfaceUp: "#F9FAFB", 
  border: "#E5E7EB", 
  borderUp: "#D1D5DB", 
  text: "#111827", 
  textMuted: "#4B5563", 
  textDim: "#9CA3AF", 
};

const SALES_DATA = {
  week: [
    { day: "Mon", revenue: 12400, bookings: 8 },
    { day: "Tue", revenue: 18900, bookings: 14 },
    { day: "Wed", revenue: 9800, bookings: 6 },
    { day: "Thu", revenue: 24600, bookings: 19 },
    { day: "Fri", revenue: 31200, bookings: 27 },
    { day: "Sat", revenue: 28700, bookings: 23 },
    { day: "Sun", revenue: 16500, bookings: 12 },
  ],
  month: [
    { day: "W1", revenue: 98000, bookings: 78 },
    { day: "W2", revenue: 124000, bookings: 99 },
    { day: "W3", revenue: 107000, bookings: 88 },
    { day: "W4", revenue: 156000, bookings: 131 },
  ],
  year: [
    { day: "Jan", revenue: 340000, bookings: 280 },
    { day: "Feb", revenue: 290000, bookings: 230 },
    { day: "Mar", revenue: 420000, bookings: 345 },
    { day: "Apr", revenue: 510000, bookings: 418 },
    { day: "May", revenue: 380000, bookings: 310 },
    { day: "Jun", revenue: 620000, bookings: 508 },
    { day: "Jul", revenue: 710000, bookings: 582 },
    { day: "Aug", revenue: 580000, bookings: 476 },
    { day: "Sep", revenue: 790000, bookings: 647 },
    { day: "Oct", revenue: 640000, bookings: 524 },
    { day: "Nov", revenue: 870000, bookings: 712 },
    { day: "Dec", revenue: 950000, bookings: 778 },
  ],
};

const BOOKINGS = [
  {
    id: "#BK-4821",
    brand: "Nike Global",
    blogger: "Alex Rivers",
    platform: "instagram",
    reach: "2.4M",
    amount: 4800,
    status: "active",
    date: "Apr 18",
  },
  {
    id: "#BK-4820",
    brand: "Tesla Motors",
    blogger: "Emma Chen",
    platform: "youtube",
    reach: "8.1M",
    amount: 12400,
    status: "pending",
    date: "Apr 18",
  },
  {
    id: "#BK-4819",
    brand: "Spotify",
    blogger: "Jay Monroe",
    platform: "tiktok",
    reach: "5.6M",
    amount: 3200,
    status: "completed",
    date: "Apr 17",
  },
  {
    id: "#BK-4818",
    brand: "Gucci Beauty",
    blogger: "Sofia Lara",
    platform: "instagram",
    reach: "1.9M",
    amount: 6700,
    status: "active",
    date: "Apr 17",
  },
  {
    id: "#BK-4817",
    brand: "Red Bull",
    blogger: "Mike Dash",
    platform: "youtube",
    reach: "12.3M",
    amount: 18900,
    status: "completed",
    date: "Apr 16",
  },
  {
    id: "#BK-4816",
    brand: "Zara Digital",
    blogger: "Luna Voss",
    platform: "tiktok",
    reach: "3.8M",
    amount: 2900,
    status: "cancelled",
    date: "Apr 16",
  },
];

const TOP_BLOGGERS = [
  {
    name: "Alex Rivers",
    handle: "@alexrivers",
    platform: "instagram",
    followers: "2.4M",
    er: "8.2%",
    booked: 34,
    revenue: 142000,
    rating: 4.9,
    avatar: "AR",
    cat: "Lifestyle",
  },
  {
    name: "Emma Chen",
    handle: "@emmachen",
    platform: "youtube",
    followers: "8.1M",
    er: "6.8%",
    booked: 28,
    revenue: 318000,
    rating: 4.8,
    avatar: "EC",
    cat: "Tech",
  },
  {
    name: "Jay Monroe",
    handle: "@jaymonroe",
    platform: "tiktok",
    followers: "5.6M",
    er: "12.4%",
    booked: 51,
    revenue: 98000,
    rating: 4.9,
    avatar: "JM",
    cat: "Music",
  },
  {
    name: "Sofia Lara",
    handle: "@sofialara",
    platform: "instagram",
    followers: "1.9M",
    er: "9.1%",
    booked: 22,
    revenue: 87000,
    rating: 4.7,
    avatar: "SL",
    cat: "Beauty",
  },
  {
    name: "Mike Dash",
    handle: "@mikedash",
    platform: "youtube",
    followers: "12.3M",
    er: "5.4%",
    booked: 18,
    revenue: 412000,
    rating: 4.8,
    avatar: "MD",
    cat: "Sport",
  },
];

const TEAM = [
  {
    id: 1,
    name: "James Carter",
    role: "Sales Manager",
    dept: "Sales",
    status: "online",
    deals: 48,
    rating: 4.9,
    avatar: "JC",
    tasks: 12,
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    role: "Account Manager",
    dept: "Accounts",
    status: "online",
    deals: 31,
    rating: 4.8,
    avatar: "SM",
    tasks: 8,
  },
  {
    id: 3,
    name: "Daniel Park",
    role: "Analytics Lead",
    dept: "Analytics",
    status: "away",
    deals: 0,
    rating: 4.7,
    avatar: "DP",
    tasks: 5,
  },
  {
    id: 4,
    name: "Olivia Stone",
    role: "Sales Rep",
    dept: "Sales",
    status: "online",
    deals: 27,
    rating: 4.6,
    avatar: "OS",
    tasks: 9,
  },
  {
    id: 5,
    name: "Chris Nguyen",
    role: "Logistics",
    dept: "Ops",
    status: "offline",
    deals: 0,
    rating: 4.5,
    avatar: "CN",
    tasks: 3,
  },
];

const CATEGORIES = [
  { name: "Lifestyle", share: 28, color: "#A82020" },
  { name: "Tech", share: 20, color: "#8B1515" },
  { name: "Beauty", share: 18, color: "#7B0000" },
  { name: "Sport", share: 15, color: "#6A0000" },
  { name: "Music", share: 10, color: "#5A0000" },
  { name: "Other", share: 9, color: "#4A0000" },
];

const FUNNEL = [
  { label: "Website Visits", value: 48320, pct: 100 },
  { label: "Viewed Bloggers", value: 21840, pct: 45.2 },
  { label: "Started Booking", value: 6930, pct: 14.3 },
  { label: "Completed Booking", value: 2840, pct: 5.9 },
];

const ACTIVITY = [
  {
    icon: FiCalendar,
    text: "New booking #BK-4821 from Nike Global · $4,800",
    time: "2m",
  },
  {
    icon: FiUserPlus,
    text: "Alex Rivers joined as verified blogger",
    time: "8m",
  },
  {
    icon: FiMessageSquare,
    text: "Support ticket from Gucci Beauty campaign",
    time: "15m",
  },
  {
    icon: FiCheckCircle,
    text: "Campaign #BK-4819 completed successfully",
    time: "31m",
  },
  { icon: FiStar, text: "New ★★★★★ review for Jay Monroe", time: "1h" },
  {
    icon: FiAlertCircle,
    text: "Emma Chen's analytics report is ready",
    time: "2h",
  },
  { icon: FiZap, text: "Red Bull campaign hit 12M impressions", time: "3h" },
];

const GOALS = [
  { label: "Monthly Revenue", current: 142000, target: 250000, unit: "$" },
  { label: "New Brands", current: 38, target: 60, unit: "" },
  { label: "Active Campaigns", current: 89, target: 120, unit: "" },
  { label: "Blogger NPS Score", current: 87, target: 95, unit: "" },
];

const NEW_BRANDS = [
  {
    name: "Adidas Digital",
    industry: "Fashion",
    budget: "$8,500/mo",
    avatar: "AD",
    joined: "Today, 14:32",
  },
  {
    name: "Notion HQ",
    industry: "SaaS",
    budget: "$3,200/mo",
    avatar: "NH",
    joined: "Today, 11:05",
  },
  {
    name: "Dyson Beauty",
    industry: "Beauty",
    budget: "$6,100/mo",
    avatar: "DB",
    joined: "Yesterday",
  },
  {
    name: "Rivian Motors",
    industry: "Automotive",
    budget: "$14,000/mo",
    avatar: "RM",
    joined: "Yesterday",
  },
];

const REGIONS = [
  { city: "United States", bookings: 842, share: 34 },
  { city: "United Kingdom", bookings: 421, share: 17 },
  { city: "Germany", bookings: 318, share: 13 },
  { city: "France", bookings: 247, share: 10 },
  { city: "UAE", bookings: 198, share: 8 },
  { city: "Other", bookings: 445, share: 18 },
];

const CALENDAR_TASKS = [
  { time: "09:00", title: "Weekly Sales Standup", participants: 9 },
  { time: "11:30", title: "Nike Global Campaign Review", participants: 4 },
  { time: "14:00", title: "Blogger Partnership Call", participants: 6 },
  { time: "16:30", title: "Q2 KPI Analysis & Reporting", participants: 14 },
];

const fmt = (n) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + "M"
    : n >= 1_000
      ? (n / 1_000).toFixed(1) + "K"
      : n;

const fmtUSD = (n) => "$" + new Intl.NumberFormat("en-US").format(n);

const PLATFORM_CFG = {
  instagram: { icon: FiInstagram, color: "#E1306C", bg: "#1A0812" },
  youtube: { icon: FiYoutube, color: "#FF4444", bg: "#1A0808" },
  tiktok: { icon: BsTiktok, color: "#69C9D0", bg: "#08181A" },
};

const ORDER_STATUS = {
  active: {
    label: "Active",
    cls: "text-emerald-400 bg-emerald-950 border-emerald-900",
  },
  pending: {
    label: "Pending",
    cls: "text-amber-400  bg-amber-950  border-amber-900",
  },
  completed: {
    label: "Done",
    cls: "text-sky-400    bg-sky-950    border-sky-900",
  },
  cancelled: {
    label: "Cancelled",
    cls: "text-red-400    bg-red-950    border-red-900",
  },
};

const TEAM_STATUS = {
  online: { dot: "bg-emerald-500", label: "Online" },
  away: { dot: "bg-amber-500", label: "Away" },
  offline: { dot: "bg-neutral-600", label: "Offline" },
};

const AVA = [
  ["#7B0000", "#A82020"],
  ["#8B1515", "#B83030"],
  ["#6A0000", "#921212"],
  ["#921212", "#C03030"],
  ["#5A0000", "#7B0000"],
  ["#A82020", "#CC4040"],
];
const getAva = (i) => AVA[i % AVA.length];

function Ava({ text, idx, size = "w-9 h-9", fs = "text-xs" }) {
  const [a, b] = getAva(idx);
  return (
    <div
      className={`${size} ${fs} rounded-full flex items-center justify-center font-black text-white shrink-0`}
      style={{
        background: `linear-gradient(135deg,${a},${b})`,
        boxShadow: `0 2px 10px ${a}60`,
      }}
    >
      {text}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.floor(rating) ? (
          <BsStarFill key={i} className="text-amber-500 text-[9px]" />
        ) : i - 0.5 === rating ? (
          <BsStarHalf key={i} className="text-amber-500 text-[9px]" />
        ) : (
          <BsStar key={i} className="text-[9px]" style={{ color: C.textDim }} />
        ),
      )}
    </span>
  );
}

function PlatBadge({ platform }) {
  const cfg = PLATFORM_CFG[platform];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}33`,
      }}
    >
      <Icon className="text-[9px]" />
      {platform}
    </span>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue));
  const H = 120,
    bw = 22,
    gap = 5;
  const W = data.length * (bw + gap);
  return (
    <div className="w-full overflow-hidden">
      <svg
        width="100%"
        height={H + 22}
        viewBox={`0 0 ${W} ${H + 22}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.crimsonBr} />
            <stop offset="100%" stopColor={C.crimson} stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C84040" />
            <stop offset="100%" stopColor={C.crimsonBr} />
          </linearGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {data.map((d, i) => {
          const bh = Math.max(5, (d.revenue / max) * (H - 10));
          const isLast = i === data.length - 1;
          const x = i * (bw + gap);
          return (
            <g key={i}>
              <motion.rect
                x={x}
                y={H - bh}
                width={bw}
                height={bh}
                rx={3}
                fill={isLast ? "url(#bg2)" : "url(#bg1)"}
                opacity={isLast ? 1 : 0.4 + (i / data.length) * 0.45}
                filter={isLast ? "url(#glow2)" : undefined}
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: i * 0.04,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <text
                x={x + bw / 2}
                y={H + 16}
                textAnchor="middle"
                fontSize="8"
                fill={C.textDim}
                fontFamily="system-ui"
                fontWeight="700"
              >
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, up, delay, spark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${C.crimsonBr}55`;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.transition = "all .2s";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle,${C.crimsonBr},transparent)`,
        }}
      />
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg,${C.crimson},${C.crimsonBr})`,
            boxShadow: `0 4px 16px ${C.crimson}66`,
          }}
        >
          <Icon className="text-white text-base" />
        </div>
        <span
          className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full border ${
            up
              ? "text-emerald-400 bg-emerald-950 border-emerald-900"
              : "text-red-400 bg-red-950 border-red-900"
          }`}
        >
          {up ? (
            <FiArrowUpRight className="text-[9px]" />
          ) : (
            <FiArrowDownRight className="text-[9px]" />
          )}
          {sub}
        </span>
      </div>
      <div>
        <p
          className="text-[26px] font-black leading-none tracking-tight"
          style={{ color: C.text }}
        >
          {value}
        </p>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mt-1"
          style={{ color: C.textMuted }}
        >
          {label}
        </p>
      </div>
      {spark && (
        <div className="flex items-end gap-[2px] h-7">
          {spark.map((v, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: delay + i * 0.04, duration: 0.35 }}
              className="flex-1 rounded-[2px]"
              style={{
                height: `${v}%`,
                background: `linear-gradient(to top,${C.crimson},${C.crimsonBr})`,
                opacity: 0.2 + i * 0.1,
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SectionHead({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(to right,${C.crimsonBr},${C.crimson}44,transparent)`,
        }}
      />
      <span
        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.22em] shrink-0"
        style={{ color: C.crimsonBr }}
      >
        <HiOutlineSparkles className="text-xs" />
        {label}
        <HiOutlineSparkles className="text-xs" />
      </span>
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(to left,${C.crimsonBr},${C.crimson}44,transparent)`,
        }}
      />
    </div>
  );
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("week");
  const [notif, setNotif] = useState(false);
  const [clock, setClock] = useState(new Date());
  const nRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const h = (e) => {
      if (nRef.current && !nRef.current.contains(e.target)) setNotif(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const chartData = SALES_DATA[period];
  const totalRev = chartData.reduce((s, d) => s + d.revenue, 0);
  const totalBook = chartData.reduce((s, d) => s + d.bookings, 0);

  const card = { background: C.surface, border: `1px solid ${C.border}` };
  const card2 = { background: C.surfaceUp, border: `1px solid ${C.borderUp}` };

  const STATS = [
    {
      icon: FiDollarSign,
      label: "Total Revenue",
      value: fmtUSD(totalRev),
      sub: "+18%",
      up: true,
      spark: [28, 42, 33, 62, 48, 78, 58],
    },
    {
      icon: FiCalendar,
      label: "Bookings",
      value: totalBook,
      sub: "+12%",
      up: true,
      spark: [38, 52, 40, 68, 55, 82, 65],
    },
    {
      icon: FiUsers,
      label: "Active Bloggers",
      value: "1,284",
      sub: "+47",
      up: true,
      spark: [52, 56, 58, 60, 63, 66, 70],
    },
    {
      icon: FiLayers,
      label: "Brand Clients",
      value: "342",
      sub: "+23",
      up: true,
      spark: [18, 32, 28, 52, 42, 68, 52],
    },
    {
      icon: FiHeart,
      label: "Impressions",
      value: "84.2M",
      sub: "+31%",
      up: true,
      spark: [32, 48, 40, 68, 55, 78, 72],
    },
    {
      icon: FiStar,
      label: "Avg Rating",
      value: "4.8",
      sub: "+0.2",
      up: true,
      spark: [68, 70, 69, 72, 71, 74, 76],
    },
    {
      icon: FiActivity,
      label: "Conversion",
      value: "5.9%",
      sub: "+1.1%",
      up: true,
      spark: [36, 38, 39, 42, 41, 45, 48],
    },
    {
      icon: FiMessageSquare,
      label: "Open Tickets",
      value: "17",
      sub: "-5",
      up: false,
      spark: [52, 58, 42, 68, 48, 38, 36],
    },
  ];

  const greeting =
    clock.getHours() < 12
      ? "Morning"
      : clock.getHours() < 18
        ? "Afternoon"
        : "Evening";

  return (
    <div
      className="min-h-screen"
      style={{ background: C.bg, fontFamily: "'DM Sans',system-ui,sans-serif" }}
    >
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{ background: `${C.surface}DD`, borderColor: C.border }}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg,${C.crimson},${C.crimsonBr})`,
                boxShadow: `0 4px 20px ${C.crimson}77`,
              }}
            >
              <FiZap className="text-white text-base" />
            </div>
            <div>
              <h1
                className="text-[15px] font-black tracking-tight leading-none"
                style={{ color: C.text }}
              >
                Ad<span style={{ color: C.crimsonBr }}>Bloger</span>
              </h1>
              <p
                className="text-[10px] font-semibold mt-0.5"
                style={{ color: C.textMuted }}
              >
                Admin Panel
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                style={{ color: C.textDim }}
              />
              <input
                type="text"
                placeholder="Search bloggers, brands, campaigns..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                }}
                onFocus={(e) => (e.target.style.borderColor = C.crimsonBr)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full"
              style={{
                color: "#4ade80",
                background: "#03160a",
                border: "1px solid #14532d",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Systems Normal
            </motion.span>

            <button
              className="p-2.5 rounded-xl transition-all"
              style={{
                border: `1px solid ${C.border}`,
                background: C.surfaceUp,
                color: C.textMuted,
              }}
            >
              <FiRefreshCw className="text-sm" />
            </button>

            <div className="relative" ref={nRef}>
              <button
                onClick={() => setNotif((p) => !p)}
                className="relative p-2.5 rounded-xl transition-all"
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.surfaceUp,
                  color: C.textMuted,
                }}
              >
                <FiBell className="text-sm" />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                  style={{ background: C.crimsonBr, borderColor: C.surface }}
                />
              </button>
              <AnimatePresence>
                {notif && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl z-50 overflow-hidden"
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.borderUp}`,
                      boxShadow: "0 20px 60px #00000090",
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b flex items-center justify-between"
                      style={{ borderColor: C.border }}
                    >
                      <span
                        className="text-sm font-black"
                        style={{ color: C.text }}
                      >
                        Notifications
                      </span>
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{
                          color: C.crimsonBr,
                          background: `${C.crimson}25`,
                          border: `1px solid ${C.crimson}44`,
                        }}
                      >
                        7 new
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {ACTIVITY.slice(0, 5).map((a, i) => {
                        const Icon = a.icon;
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-3 px-4 py-3 border-b last:border-0 cursor-pointer"
                            style={{ borderColor: C.border }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = C.surfaceUp)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                              style={{
                                background: `${C.crimson}25`,
                                border: `1px solid ${C.crimson}40`,
                              }}
                            >
                              <Icon
                                style={{ color: C.crimsonBr }}
                                className="text-sm"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-semibold leading-snug"
                                style={{ color: C.text }}
                              >
                                {a.text}
                              </p>
                              <p
                                className="text-[10px] mt-0.5"
                                style={{ color: C.textDim }}
                              >
                                {a.time} ago
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className="px-4 py-3 border-t text-center"
                      style={{ borderColor: C.border }}
                    >
                      <button
                        className="text-xs font-bold"
                        style={{ color: C.crimsonBr }}
                      >
                        View all →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Ava text="AD" idx={0} />
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-7 space-y-7">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: `linear-gradient(135deg,${C.crimson}25,${C.surface})`,
            border: `1px solid ${C.crimsonBr}30`,
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 right-0 w-80 h-full opacity-8"
              style={{
                background: `radial-gradient(ellipse at top right,${C.crimsonBr},transparent)`,
              }}
            />
            <div
              className="absolute bottom-0 left-40 w-40 h-full opacity-5"
              style={{
                background: `radial-gradient(ellipse at bottom,${C.crimsonBr},transparent)`,
              }}
            />
          </div>
          <div className="flex items-center justify-between relative">
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[.2em] mb-1.5"
                style={{ color: C.crimsonBr }}
              >
                {clock.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h2
                className="text-2xl font-black tracking-tight"
                style={{ color: C.text }}
              >
                Good {greeting}, Admin 👋
              </h2>
              <p
                className="text-sm mt-1 font-medium"
                style={{ color: C.textMuted }}
              >
                AdBloger platform ·{" "}
                <span style={{ color: C.crimsonBr }}>{totalBook}</span> new
                bookings this period
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <p
                className="text-5xl font-black tabular-nums leading-none"
                style={{ color: C.text }}
              >
                {clock.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p
                className="text-xs font-semibold mt-1"
                style={{ color: C.textDim }}
              >
                live clock
              </p>
            </div>
          </div>
        </motion.div>

        <section>
          <SectionHead label="Key Metrics" />
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.06} spark={s.spark} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl p-6" style={card}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="text-base font-black tracking-tight"
                  style={{ color: C.text }}
                >
                  Revenue Overview
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Booking revenue & campaign volume
                </p>
              </div>
              <div
                className="flex items-center gap-1 p-1 rounded-xl"
                style={{ background: C.bg, border: `1px solid ${C.border}` }}
              >
                {[
                  ["week", "7D"],
                  ["month", "30D"],
                  ["year", "1Y"],
                ].map(([p, l]) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all"
                    style={{
                      background: period === p ? C.crimson : "transparent",
                      color: period === p ? "#fff" : C.textMuted,
                      boxShadow:
                        period === p ? `0 2px 12px ${C.crimson}55` : "none",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-8 mb-5">
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: C.textDim }}
                >
                  Revenue
                </p>
                <p
                  className="text-2xl font-black leading-none mt-1"
                  style={{ color: C.text }}
                >
                  {fmtUSD(totalRev)}
                </p>
              </div>
              <div className="w-px h-10" style={{ background: C.border }} />
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: C.textDim }}
                >
                  Bookings
                </p>
                <p
                  className="text-2xl font-black leading-none mt-1"
                  style={{ color: C.text }}
                >
                  {totalBook}
                </p>
              </div>
              <div
                className="ml-auto flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
                style={{
                  color: "#4ade80",
                  background: "#03160a",
                  border: "1px solid #14532d",
                }}
              >
                <FiArrowUpRight className="text-xs" />
                +18% vs last period
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={period}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BarChart data={chartData} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rounded-2xl p-5 flex flex-col" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black" style={{ color: C.text }}>
                  Live Activity
                </h2>
                <p
                  className="text-xs font-medium mt-0.5"
                  style={{ color: C.textMuted }}
                >
                  Real-time platform feed
                </p>
              </div>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 rounded-full"
                style={{ background: C.crimsonBr }}
              />
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto max-h-64 pr-1">
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.surfaceUp)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `${C.crimson}22`,
                        border: `1px solid ${C.crimson}35`,
                      }}
                    >
                      <Icon
                        style={{ color: C.crimsonBr }}
                        className="text-xs"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] font-semibold leading-snug"
                        style={{ color: C.text }}
                      >
                        {a.text}
                      </p>
                      <p
                        className="text-[10px] mt-0.5"
                        style={{ color: C.textDim }}
                      >
                        {a.time} ago
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div
            className="xl:col-span-2 rounded-2xl overflow-hidden"
            style={card}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: C.border }}
            >
              <div>
                <h2 className="text-base font-black" style={{ color: C.text }}>
                  Recent Bookings
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Latest influencer campaigns
                </p>
              </div>
              <button
                className="flex items-center gap-1 text-xs font-bold"
                style={{ color: C.crimsonBr }}
              >
                View All <FiChevronRight className="text-xs" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: C.bg,
                    }}
                  >
                    {[
                      "ID",
                      "Brand",
                      "Blogger",
                      "Platform",
                      "Reach",
                      "Amount",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest"
                        style={{ color: C.textDim }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BOOKINGS.map((b, i) => {
                    const st = ORDER_STATUS[b.status];
                    return (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="border-b cursor-pointer"
                        style={{ borderColor: C.border }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = C.surfaceUp)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          className="px-4 py-3 text-xs font-black"
                          style={{ color: C.crimsonBr }}
                        >
                          {b.id}
                        </td>
                        <td
                          className="px-4 py-3 text-xs font-bold"
                          style={{ color: C.text }}
                        >
                          {b.brand}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Ava
                              text={b.blogger
                                .split(" ")
                                .map((w) => w[0])
                                .join("")}
                              idx={i}
                              size="w-6 h-6"
                              fs="text-[9px]"
                            />
                            <span
                              className="text-xs font-semibold"
                              style={{ color: C.text }}
                            >
                              {b.blogger}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PlatBadge platform={b.platform} />
                        </td>
                        <td
                          className="px-4 py-3 text-xs font-bold"
                          style={{ color: C.textMuted }}
                        >
                          {b.reach}
                        </td>
                        <td
                          className="px-4 py-3 text-xs font-black"
                          style={{ color: C.text }}
                        >
                          {fmtUSD(b.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-[10px]"
                          style={{ color: C.textDim }}
                        >
                          {b.date}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-black" style={{ color: C.text }}>
                  Monthly Goals
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Progress tracking
                </p>
              </div>
              <FiTarget style={{ color: C.crimsonBr }} className="text-lg" />
            </div>
            <div className="space-y-5">
              {GOALS.map((g, i) => {
                const pct = Math.round((g.current / g.target) * 100);
                const d = (v) =>
                  g.unit === "$" ? fmtUSD(v) : v.toLocaleString();
                return (
                  <motion.div
                    key={g.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.09 }}
                  >
                    <div className="flex justify-between mb-1.5">
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: C.text }}
                      >
                        {g.label}
                      </span>
                      <span
                        className="text-[11px] font-black"
                        style={{ color: C.crimsonBr }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: C.bg }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          delay: 0.3 + i * 0.1,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right,${C.crimson},${C.crimsonBr})`,
                          boxShadow: `0 0 8px ${C.crimson}60`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px]" style={{ color: C.textDim }}>
                        {d(g.current)}
                      </span>
                      <span className="text-[9px]" style={{ color: C.textDim }}>
                        of {d(g.target)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div
            className="xl:col-span-3 rounded-2xl overflow-hidden"
            style={card}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: C.border }}
            >
              <div>
                <h2 className="text-base font-black" style={{ color: C.text }}>
                  Top Bloggers
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Highest-performing influencers
                </p>
              </div>
              <FiAward style={{ color: C.crimsonBr }} className="text-lg" />
            </div>
            <div>
              {TOP_BLOGGERS.map((b, i) => (
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 px-6 py-4 border-b cursor-pointer"
                  style={{ borderColor: C.border }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.surfaceUp)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="text-sm font-black w-6 text-center shrink-0"
                    style={{ color: C.textDim }}
                  >
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  </div>
                  <Ava text={b.avatar} idx={i} size="w-10 h-10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-sm font-black"
                        style={{ color: C.text }}
                      >
                        {b.name}
                      </p>
                      <PlatBadge platform={b.platform} />
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          color: C.crimsonBr,
                          background: `${C.crimson}22`,
                        }}
                      >
                        {b.cat}
                      </span>
                    </div>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: C.textMuted }}
                    >
                      {b.handle}
                    </p>
                  </div>
                  <div className="text-center shrink-0">
                    <p
                      className="text-[9px] font-semibold"
                      style={{ color: C.textDim }}
                    >
                      Followers
                    </p>
                    <p className="text-sm font-black" style={{ color: C.text }}>
                      {b.followers}
                    </p>
                  </div>
                  <div className="text-center shrink-0">
                    <p
                      className="text-[9px] font-semibold"
                      style={{ color: C.textDim }}
                    >
                      ER
                    </p>
                    <p
                      className="text-sm font-black"
                      style={{ color: "#4ade80" }}
                    >
                      {b.er}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-[9px] font-semibold"
                      style={{ color: C.textDim }}
                    >
                      Revenue
                    </p>
                    <p className="text-sm font-black" style={{ color: C.text }}>
                      {fmt(b.revenue)}
                    </p>
                    <Stars rating={b.rating} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            className="xl:col-span-2 rounded-2xl overflow-hidden"
            style={card}
          >
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: C.border }}
            >
              <div>
                <h2 className="text-base font-black" style={{ color: C.text }}>
                  Team Members
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {TEAM.filter((e) => e.status === "online").length} online of{" "}
                  {TEAM.length}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span
                  className="text-[10px] font-bold"
                  style={{ color: C.textMuted }}
                >
                  {TEAM.filter((e) => e.status === "online").length}/
                  {TEAM.length}
                </span>
              </div>
            </div>
            <div>
              {TEAM.map((e, i) => {
                const st = TEAM_STATUS[e.status];
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 px-5 py-3.5 border-b cursor-pointer"
                    style={{ borderColor: C.border }}
                    onMouseEnter={(ev) =>
                      (ev.currentTarget.style.background = C.surfaceUp)
                    }
                    onMouseLeave={(ev) =>
                      (ev.currentTarget.style.background = "transparent")
                    }
                  >
                    <div className="relative shrink-0">
                      <Ava
                        text={e.avatar}
                        idx={e.id}
                        size="w-9 h-9"
                        fs="text-xs"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${st.dot}`}
                        style={{ borderColor: C.surface }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-bold truncate"
                        style={{ color: C.text }}
                      >
                        {e.name}
                      </p>
                      <p
                        className="text-[10px] truncate"
                        style={{ color: C.textMuted }}
                      >
                        {e.role} · {e.dept}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Stars rating={e.rating} />
                      <p
                        className="text-[9px] mt-0.5"
                        style={{ color: C.textDim }}
                      >
                        {e.tasks} tasks
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-1 rounded-full border ${
                        e.status === "online"
                          ? "text-emerald-400 bg-emerald-950 border-emerald-900"
                          : e.status === "away"
                            ? "text-amber-400  bg-amber-950  border-amber-900"
                            : "text-neutral-500 bg-neutral-900 border-neutral-800"
                      }`}
                    >
                      {st.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black" style={{ color: C.text }}>
                  Booking Funnel
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Conversion stages
                </p>
              </div>
              <FiTrendingUp style={{ color: C.crimsonBr }} />
            </div>
            <div className="space-y-3.5">
              {FUNNEL.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: C.textMuted }}
                    >
                      {f.label}
                    </span>
                    <span
                      className="text-[10px] font-black"
                      style={{ color: C.text }}
                    >
                      {fmt(f.value)}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: C.bg }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.pct}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.7 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(to right,${C.crimson},${C.crimsonBr})`,
                        opacity: 1 - i * 0.15,
                      }}
                    />
                  </div>
                  <p
                    className="text-[9px] text-right mt-0.5"
                    style={{ color: C.textDim }}
                  >
                    {f.pct}%
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black" style={{ color: C.text }}>
                  Top Regions
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Booking distribution
                </p>
              </div>
              <FiMapPin style={{ color: C.crimsonBr }} />
            </div>
            <div className="space-y-3">
              {REGIONS.map((r, i) => (
                <motion.div
                  key={r.city}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-2"
                >
                  <span
                    className="w-4 text-[9px] font-black text-center shrink-0"
                    style={{ color: C.textDim }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: C.text }}
                      >
                        {r.city}
                      </span>
                      <span
                        className="text-[10px] font-black ml-1 shrink-0"
                        style={{ color: C.crimsonBr }}
                      >
                        {r.share}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: C.bg }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.share}%` }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right,${C.crimson},${C.crimsonBr})`,
                          opacity: 1 - i * 0.08,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-[9px] shrink-0"
                    style={{ color: C.textDim }}
                  >
                    {fmt(r.bookings)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black" style={{ color: C.text }}>
                  Niche Breakdown
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  By blogger category
                </p>
              </div>
              <FiLayers style={{ color: C.crimsonBr }} />
            </div>
            <div className="space-y-3">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="text-[11px] font-semibold flex-1"
                    style={{ color: C.text }}
                  >
                    {cat.name}
                  </span>
                  <div className="flex-1 max-w-[80px]">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: C.bg }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.share}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: cat.color }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-black shrink-0"
                    style={{ color: C.textMuted }}
                  >
                    {cat.share}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black" style={{ color: C.text }}>
                  New Brands
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  Recently joined clients
                </p>
              </div>
              <FiUserPlus style={{ color: C.crimsonBr }} />
            </div>
            <div className="space-y-2.5">
              {NEW_BRANDS.map((b, i) => (
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.surfaceUp)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Ava
                    text={b.avatar}
                    idx={i + 2}
                    size="w-9 h-9"
                    fs="text-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold truncate"
                      style={{ color: C.text }}
                    >
                      {b.name}
                    </p>
                    <p className="text-[9px]" style={{ color: C.textMuted }}>
                      {b.industry}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-[10px] font-black"
                      style={{ color: C.crimsonBr }}
                    >
                      {b.budget}
                    </p>
                    <p className="text-[9px]" style={{ color: C.textDim }}>
                      {b.joined}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5" style={card}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black" style={{ color: C.text }}>
                Today's Schedule
              </h2>
              <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                {clock.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <FiCalendar style={{ color: C.crimsonBr }} className="text-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CALENDAR_TASKS.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer"
                style={{ background: C.bg, border: `1px solid ${C.border}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${C.crimsonBr}55`;
                  e.currentTarget.style.background = C.surfaceUp;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.bg;
                }}
              >
                <div className="shrink-0">
                  <p
                    className="text-xs font-black"
                    style={{ color: C.crimsonBr }}
                  >
                    {task.time}
                  </p>
                  <div
                    className="w-px h-8 mx-auto mt-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(to bottom,${C.crimson}88,transparent)`,
                    }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-bold leading-snug"
                    style={{ color: C.text }}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <FiUsers
                      className="text-[9px]"
                      style={{ color: C.textDim }}
                    />
                    <span className="text-[9px]" style={{ color: C.textDim }}>
                      {task.participants} participants
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
