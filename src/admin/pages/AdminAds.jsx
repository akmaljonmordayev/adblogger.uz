import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LuSearch, LuEye, LuTrash2, LuCheck, LuX, LuLoader,
  LuChevronLeft, LuChevronRight, LuRefreshCw,
  LuCircleCheck, LuCircleX, LuClock3, LuBookOpen,
  LuTriangleAlert, LuUserRound, LuBriefcase,
  LuTrendingUp, LuFilter, LuCalendar, LuDollarSign,
  LuMapPin, LuPhone, LuMail, LuUsers, LuStar,
  LuChevronDown, LuArrowUpRight,
} from "react-icons/lu";
import { FiInstagram, FiYoutube, FiMessageSquare } from "react-icons/fi";
import { BsTiktok } from "react-icons/bs";
import { toast } from "../../components/ui/toast";
import { adminAdsService } from "../../services/adminService";

/* ── Design Tokens ─────────────────────────────────────────────── */
const T = {
  red:       "#C62828",
  redMid:    "#E53935",
  redLight:  "#FFEBEE",
  redBorder: "#FFCDD2",
  bg:        "#F1F5F9",
  surface:   "#FFFFFF",
  surfaceUp: "#F8FAFC",
  border:    "#E2E8F0",
  text:      "#0F172A",
  textMuted: "#475569",
  textDim:   "#94A3B8",
  success:   "#16A34A",
  successBg: "#F0FDF4",
  successBd: "#BBF7D0",
  warn:      "#D97706",
  warnBg:    "#FFFBEB",
  warnBd:    "#FDE68A",
  info:      "#0284C7",
  infoBg:    "#F0F9FF",
  infoBd:    "#BAE6FD",
  purple:    "#7C3AED",
  purpleBg:  "#F5F3FF",
  purpleBd:  "#DDD6FE",
};

/* ── Constants ─────────────────────────────────────────────────── */
const STATUS_TABS = [
  { value: "",          label: "Barchasi",     icon: LuBookOpen,    color: T.textMuted },
  { value: "pending",   label: "Kutilmoqda",   icon: LuClock3,      color: T.warn },
  { value: "approved",  label: "Tasdiqlangan", icon: LuCircleCheck, color: T.success },
  { value: "active",    label: "Faol",         icon: LuCircleCheck, color: T.info },
  { value: "rejected",  label: "Rad etilgan",  icon: LuCircleX,     color: T.red },
  { value: "completed", label: "Yakunlangan",  icon: LuCircleCheck, color: T.textMuted },
];

const STATUS_META = {
  pending:   { bg: T.warnBg,   c: "#92400E", bd: T.warnBd,    label: "Kutilmoqda",   dot: "#F59E0B" },
  approved:  { bg: T.successBg,c: "#14532D", bd: T.successBd, label: "Tasdiqlangan", dot: "#22C55E" },
  active:    { bg: T.infoBg,   c: "#075985", bd: T.infoBd,    label: "Faol",         dot: "#38BDF8" },
  rejected:  { bg: T.redLight, c: "#7F1D1D", bd: T.redBorder, label: "Rad etilgan",  dot: "#EF4444" },
  completed: { bg: "#F8FAFC",  c: "#334155", bd: "#CBD5E1",   label: "Yakunlangan",  dot: "#94A3B8" },
};

const PLATFORM_META = {
  instagram: { icon: FiInstagram,      color: "#E1306C", bg: "#FDF2F8", label: "Instagram" },
  youtube:   { icon: FiYoutube,        color: "#FF0000", bg: "#FEF2F2", label: "YouTube"   },
  tiktok:    { icon: BsTiktok,         color: "#010101", bg: "#F8FAFC", label: "TikTok"    },
  telegram:  { icon: FiMessageSquare,  color: "#0088CC", bg: "#F0F9FF", label: "Telegram"  },
};

const PER_PAGE = 10;

/* ── Helpers ───────────────────────────────────────────────────── */
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
};
const fmtMoney = (n) => {
  if (!n) return null;
  return Number(n).toLocaleString("uz-UZ") + " so'm";
};
const getInitials = (u) => {
  if (!u) return "?";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "?";
};
const avaColor = (u) => {
  const colors = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
  const code = ((u?.email || u?.firstName || "?").charCodeAt(0)) % colors.length;
  return colors[code];
};

/* ── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ user, size = 36 }) {
  const color = avaColor(user);
  if (user?.avatar) return (
    <img src={user.avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: color + "22", border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800, color,
    }}>{getInitials(user)}</div>
  );
}

/* ── StatusBadge ────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const x = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      background: x.bg, color: x.c, border: `1px solid ${x.bd}`,
      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99,
      display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: x.dot, flexShrink: 0 }} />
      {x.label}
    </span>
  );
}

/* ── TypeBadge ──────────────────────────────────────────────────── */
function TypeBadge({ type }) {
  const isBlogger = type === "blogger";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: isBlogger ? T.purpleBg : "#FFF7ED",
      color: isBlogger ? T.purple : "#EA580C",
      border: `1px solid ${isBlogger ? T.purpleBd : "#FED7AA"}`,
    }}>
      {isBlogger ? <LuUserRound size={11} /> : <LuBriefcase size={11} />}
      {isBlogger ? "Blogger" : "Biznes"}
    </span>
  );
}

/* ── PlatformChip ───────────────────────────────────────────────── */
function PlatformChip({ platform }) {
  const m = PLATFORM_META[platform?.toLowerCase()];
  if (!m) return <span style={{ fontSize: 10, color: T.textDim }}>{platform}</span>;
  const Icon = m.icon;
  return (
    <span title={m.label} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 22, height: 22, borderRadius: 6,
      background: m.bg, color: m.color,
    }}>
      <Icon size={12} />
    </span>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg, border, delta }) {
  return (
    <div style={{
      background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`,
      padding: "20px 22px", display: "flex", alignItems: "flex-start",
      justifyContent: "space-between", gap: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.textDim, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 800, color: T.text, margin: 0, lineHeight: 1 }}>{value ?? 0}</p>
        {delta != null && (
          <p style={{ fontSize: 11, color: delta >= 0 ? T.success : T.red, margin: "6px 0 0", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
            <LuArrowUpRight size={11} />
            {Math.abs(delta)}% bu oy
          </p>
        )}
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: 12, background: bg,
        border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  );
}

/* ── DetailModal ────────────────────────────────────────────────── */
function DetailModal({ ad, onClose, onApprove, onReject, actionLoading }) {
  if (!ad) return null;
  const isBlogger = ad.type === "blogger";
  const authorName = ad.user
    ? `${ad.user.firstName || ""} ${ad.user.lastName || ""}`.trim()
    : ad.companyName || "—";
  const isActing = actionLoading[ad._id];

  const Field = ({ label, value, full }) => !value ? null : (
    <div style={{ gridColumn: full ? "1 / -1" : "auto", marginBottom: 0 }}>
      <p style={{ fontSize: 10.5, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 3px" }}>{label}</p>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: T.text, margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 660, maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.25)", border: `1px solid ${T.border}` }}>

        {/* Header */}
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: T.surface, zIndex: 2, borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TypeBadge type={ad.type} />
            <StatusBadge status={ad.status} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {ad.status !== "approved" && ad.status !== "active" && (
              <button
                onClick={() => onApprove(ad._id)}
                disabled={isActing}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: `linear-gradient(135deg,${T.success},#15803D)`, color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: isActing ? "not-allowed" : "pointer", opacity: isActing ? 0.7 : 1 }}
              >
                {isActing ? <LuLoader size={13} className="spin" /> : <LuCheck size={13} />} Tasdiqlash
              </button>
            )}
            {ad.status !== "rejected" && (
              <button
                onClick={() => onReject(ad._id)}
                disabled={isActing}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: T.redLight, color: T.red, border: `1.5px solid ${T.redBorder}`, borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: isActing ? "not-allowed" : "pointer" }}
              >
                <LuX size={13} /> Rad etish
              </button>
            )}
            <button onClick={onClose} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
              <LuX size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "26px" }}>

          {/* Author card */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "16px 18px", background: T.surfaceUp, borderRadius: 14, border: `1px solid ${T.border}` }}>
            <Avatar user={ad.user} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: T.text, margin: "0 0 2px" }}>{authorName}</p>
              <p style={{ fontSize: 12, color: T.textDim, margin: 0 }}>{ad.user?.email || "—"}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: T.textDim, textTransform: "uppercase", margin: "0 0 2px" }}>Sana</p>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, margin: 0 }}>{fmtDate(ad.createdAt)}</p>
            </div>
          </div>

          {/* Fields grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: 20, padding: "20px", background: T.surfaceUp, borderRadius: 14, border: `1px solid ${T.border}` }}>
            {isBlogger ? (
              <>
                <Field label="Sarlavha"    value={ad.title} full />
                <Field label="Obunachilar" value={ad.followersRange} />
                <Field label="Joylashuv"   value={ad.location} />
                <Field label="Post narxi"  value={fmtMoney(ad.pricing?.post)} />
                <Field label="Story narxi" value={fmtMoney(ad.pricing?.story)} />
                <Field label="Video narxi" value={fmtMoney(ad.pricing?.video)} />
                <Field label="Xizmatlar"   value={(ad.services || []).join(", ")} />
                <Field label="Niche"       value={(ad.niche || []).join(", ")} />
              </>
            ) : (
              <>
                <Field label="Kompaniya"     value={ad.companyName} />
                <Field label="Mahsulot"      value={ad.productName} />
                <Field label="Budjet"        value={ad.budget?.range} />
                <Field label="Kampaniya"     value={ad.campaignDuration} />
                <Field label="Maqsadli"      value={ad.targetAudience} />
                <Field label="Joylashuv"     value={ad.location} />
                <Field label="Biznes turi"   value={ad.businessType} />
                <Field label="Kampaniya maqsadi" value={ad.campaignGoal} full />
              </>
            )}
          </div>

          {/* Platforms */}
          {((isBlogger ? ad.platforms : ad.targetPlatforms) || []).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 10px" }}>Platformalar</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(isBlogger ? ad.platforms : ad.targetPlatforms).map(p => {
                  const m = PLATFORM_META[p?.toLowerCase()];
                  if (!m) return <span key={p} style={{ fontSize: 12, padding: "5px 12px", background: T.surfaceUp, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textMuted, fontWeight: 600 }}>{p}</span>;
                  const Icon = m.icon;
                  return (
                    <span key={p} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: m.bg, border: `1px solid ${m.color}33`, borderRadius: 10, fontSize: 12, fontWeight: 700, color: m.color }}>
                      <Icon size={13} /> {m.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {(ad.description || ad.productDescription || ad.requirements) && (
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 8px" }}>Tavsif</p>
              <p style={{ fontSize: 13.5, color: T.textMuted, lineHeight: 1.7, background: T.surfaceUp, padding: "14px 16px", borderRadius: 12, border: `1px solid ${T.border}`, margin: 0 }}>
                {ad.description || ad.productDescription || ad.requirements}
              </p>
            </div>
          )}

          {/* Contact */}
          {(ad.phone || ad.email) && (
            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {ad.phone && (
                <a href={`tel:${ad.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: T.surfaceUp, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: T.textMuted, textDecoration: "none" }}>
                  <LuPhone size={13} /> {ad.phone}
                </a>
              )}
              {ad.email && (
                <a href={`mailto:${ad.email}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: T.surfaceUp, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: T.textMuted, textDecoration: "none" }}>
                  <LuMail size={13} /> {ad.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── DeleteConfirm ──────────────────────────────────────────────── */
function DeleteConfirm({ adTitle, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 22, padding: "36px 32px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,.2)", border: `1px solid ${T.border}` }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.redLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: `1.5px solid ${T.redBorder}` }}>
          <LuTriangleAlert size={26} style={{ color: T.red }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>O'chirishni tasdiqlang</h3>
        <p style={{ fontSize: 13.5, color: T.textMuted, margin: "0 0 8px", lineHeight: 1.6 }}>
          Bu e'lonni o'chirsangiz, qaytarib bo'lmaydi.
        </p>
        {adTitle && (
          <p style={{ fontSize: 13, color: T.text, fontWeight: 700, background: T.surfaceUp, padding: "8px 16px", borderRadius: 10, border: `1px solid ${T.border}`, margin: "0 0 24px" }}>
            "{adTitle}"
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>
            Bekor qilish
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.redMid},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminAds() {
  const [ads,        setAds]        = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts,     setCounts]     = useState({ all: 0, pending: 0, approved: 0, active: 0, rejected: 0, completed: 0 });

  const [statusTab,   setStatusTab]   = useState("");
  const [typeFilter,  setTypeFilter]  = useState("");
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page,        setPage]        = useState(1);

  const [viewAd,        setViewAd]        = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null); // { id, title }
  const [actionLoading, setActionLoading] = useState({});

  const debRef = useRef(null);

  /* ── Fetch ── */
  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PER_PAGE, sort: "-createdAt" };
      if (statusTab)  params.status = statusTab;
      if (typeFilter) params.type   = typeFilter;
      if (search)     params.search = search;

      const res = await adminAdsService.getAll(params);
      setAds(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / PER_PAGE) || 1);
      if (res.counts) setCounts(res.counts);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusTab, typeFilter, search]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  /* ── Search debounce ── */
  const handleSearchInput = (val) => {
    setSearchInput(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => { setSearch(val); setPage(1); }, 400);
  };

  /* ── Change status ── */
  const changeStatus = async (id, status) => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try {
      await adminAdsService.changeStatus(id, status);
      setAds(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      setCounts(p => {
        const old = ads.find(a => a._id === id)?.status || "pending";
        return { ...p, [old]: Math.max(0, (p[old] || 0) - 1), [status]: (p[status] || 0) + 1 };
      });
      const msgs = { approved: "Tasdiqlandi", rejected: "Rad etildi", active: "Faollashtirildi" };
      toast.success(msgs[status] || "Status yangilandi");
      if (viewAd?._id === id) setViewAd(prev => ({ ...prev, status }));
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setActionLoading(p => ({ ...p, [id]: false }));
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    const id = deleteTarget?.id;
    try {
      await adminAdsService.remove(id);
      setAds(prev => prev.filter(a => a._id !== id));
      setTotal(p => p - 1);
      toast.success("E'lon o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handlePage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", padding: "28px 32px", background: T.bg, minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuBriefcase size={18} style={{ color: T.red }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>E'lonlar boshqaruvi</h1>
          </div>
          <p style={{ fontSize: 13, color: T.textDim, margin: 0 }}>Barcha e'lonlar, tasdiqlash va moderatsiya</p>
        </div>
        <button
          onClick={fetchAds}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          <LuRefreshCw size={14} /> Yangilash
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Jami"         value={counts.all}       icon={LuBookOpen}    color={T.textMuted} bg="#F8FAFC"      border={T.border}    />
        <StatCard label="Kutilmoqda"   value={counts.pending}   icon={LuClock3}      color={T.warn}      bg={T.warnBg}     border={T.warnBd}    />
        <StatCard label="Tasdiqlangan" value={counts.approved}  icon={LuCircleCheck} color={T.success}   bg={T.successBg}  border={T.successBd} />
        <StatCard label="Faol"         value={counts.active}    icon={LuTrendingUp}  color={T.info}      bg={T.infoBg}     border={T.infoBd}    />
        <StatCard label="Rad etilgan"  value={counts.rejected}  icon={LuCircleX}     color={T.red}       bg={T.redLight}   border={T.redBorder} />
      </div>

      {/* ── Status Tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {STATUS_TABS.map(t => {
          const active = statusTab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => { setStatusTab(t.value); setPage(1); }}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 15px",
                border: active ? `1.5px solid ${t.color}44` : `1.5px solid ${T.border}`,
                borderRadius: 10,
                background: active ? t.color + "12" : T.surface,
                color: active ? t.color : T.textMuted,
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
              }}
            >
              <t.icon size={13} />
              {t.label}
              <span style={{
                background: active ? t.color + "20" : T.surfaceUp,
                color: active ? t.color : T.textDim,
                padding: "1px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
              }}>
                {t.value === "" ? counts.all : counts[t.value] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ background: T.surface, borderRadius: 14, border: `1.5px solid ${T.border}`, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <LuSearch size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <input
            type="text"
            value={searchInput}
            onChange={e => handleSearchInput(e.target.value)}
            placeholder="E'lon, kompaniya yoki muallif qidirish..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: T.text, background: T.surfaceUp }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <LuFilter size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            style={{ padding: "9px 30px 9px 32px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.textMuted, outline: "none", background: T.surfaceUp, appearance: "none", cursor: "pointer", fontWeight: 600 }}
          >
            <option value="">Barcha tur</option>
            <option value="blogger">Blogger</option>
            <option value="business">Biznes</option>
          </select>
          <LuChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: T.textDim, fontWeight: 600, background: T.surfaceUp, padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}` }}>
          {total} ta natija
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>

        {/* Table Head */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "44px minmax(180px,2.5fr) minmax(140px,1.5fr) 100px 90px 120px 120px",
          padding: "11px 20px", background: T.surfaceUp,
          borderBottom: `1px solid ${T.border}`,
        }}>
          {["#", "E'lon", "Muallif", "Tur", "Sana", "Status", "Amallar"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 20px", gap: 14 }}>
            <LuLoader size={32} className="spin" style={{ color: T.red }} />
            <p style={{ color: T.textDim, fontSize: 13.5, margin: 0, fontWeight: 600 }}>Yuklanmoqda...</p>
          </div>
        ) : ads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
            <p style={{ color: T.textMuted, fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>E'lon topilmadi</p>
            <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Filtr yoki qidiruv shartlarini o'zgartiring</p>
          </div>
        ) : (
          ads.map((ad, idx) => {
            const authorName = ad.user
              ? `${ad.user.firstName || ""} ${ad.user.lastName || ""}`.trim()
              : ad.companyName || "—";
            const isActing = actionLoading[ad._id];
            const title = ad.title || ad.productName || ad.companyName || "—";
            const platforms = ad.type === "blogger" ? (ad.platforms || []) : (ad.targetPlatforms || []);
            const priceInfo = ad.type === "blogger"
              ? fmtMoney(ad.pricing?.post)
              : ad.budget?.range;

            return (
              <div
                key={ad._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px minmax(180px,2.5fr) minmax(140px,1.5fr) 100px 90px 120px 120px",
                  padding: "14px 20px",
                  borderBottom: idx < ads.length - 1 ? `1px solid ${T.border}` : "none",
                  alignItems: "center",
                  transition: "background .12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceUp}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Number */}
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.textDim, textAlign: "center" }}>
                  {(page - 1) * PER_PAGE + idx + 1}
                </div>

                {/* Title */}
                <div style={{ minWidth: 0, paddingRight: 12 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", marginBottom: 4 }}>
                    {title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {priceInfo && (
                      <span style={{ fontSize: 11, color: T.textDim, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                        <LuDollarSign size={10} /> {priceInfo}
                      </span>
                    )}
                    {platforms.slice(0, 3).map(p => <PlatformChip key={p} platform={p} />)}
                    {platforms.length > 3 && <span style={{ fontSize: 10, color: T.textDim }}>+{platforms.length - 3}</span>}
                  </div>
                </div>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <Avatar user={ad.user} size={30} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {authorName}
                    </div>
                    {ad.user?.email && (
                      <div style={{ fontSize: 10.5, color: T.textDim, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{ad.user.email}</div>
                    )}
                  </div>
                </div>

                {/* Type */}
                <TypeBadge type={ad.type} />

                {/* Date */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <LuCalendar size={11} style={{ color: T.textDim, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: T.textDim, whiteSpace: "nowrap" }}>{fmtDate(ad.createdAt)}</span>
                </div>

                {/* Status */}
                <StatusBadge status={ad.status || "pending"} />

                {/* Actions */}
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <button
                    onClick={() => setViewAd(ad)}
                    title="Ko'rish"
                    style={{ width: 32, height: 32, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, transition: "all .12s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.infoBg; e.currentTarget.style.borderColor = T.infoBd; e.currentTarget.style.color = T.info; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                  >
                    <LuEye size={14} />
                  </button>

                  {ad.status !== "approved" && ad.status !== "active" && (
                    <button
                      onClick={() => changeStatus(ad._id, "approved")}
                      disabled={isActing}
                      title="Tasdiqlash"
                      style={{ width: 32, height: 32, border: `1.5px solid ${T.successBd}`, borderRadius: 8, background: T.successBg, cursor: isActing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.success }}
                    >
                      {isActing ? <LuLoader size={12} className="spin" /> : <LuCheck size={14} />}
                    </button>
                  )}

                  {ad.status !== "rejected" && (
                    <button
                      onClick={() => changeStatus(ad._id, "rejected")}
                      disabled={isActing}
                      title="Rad etish"
                      style={{ width: 32, height: 32, border: `1.5px solid ${T.redBorder}`, borderRadius: 8, background: T.redLight, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.red }}
                    >
                      <LuX size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteTarget({ id: ad._id, title })}
                    title="O'chirish"
                    style={{ width: 32, height: 32, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, transition: "all .12s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = T.redBorder; e.currentTarget.style.color = T.red; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
                  >
                    <LuTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12.5, color: T.textDim, margin: 0 }}>
            Sahifa <strong style={{ color: T.textMuted }}>{page}</strong> / {totalPages} · Jami <strong style={{ color: T.textMuted }}>{total}</strong> ta
          </p>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}
            >
              <LuChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === "..." ? (
                <span key={`d${i}`} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: 13 }}>…</span>
              ) : (
                <button key={p} onClick={() => handlePage(p)} style={{
                  width: 36, height: 36, borderRadius: 10, fontSize: 13, fontWeight: 700,
                  border: page === p ? `1.5px solid ${T.redMid}` : `1.5px solid ${T.border}`,
                  background: page === p ? T.red : T.surface,
                  color: page === p ? "#fff" : T.textMuted,
                  cursor: "pointer",
                }}>{p}</button>
              ))}

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface, cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}
            >
              <LuChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {viewAd && (
        <DetailModal
          ad={viewAd}
          onClose={() => setViewAd(null)}
          onApprove={id => changeStatus(id, "approved")}
          onReject={id => changeStatus(id, "rejected")}
          actionLoading={actionLoading}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          adTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
