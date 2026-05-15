import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LuSearch, LuEye, LuTrash2, LuCheck, LuX, LuLoader,
  LuChevronLeft, LuChevronRight, LuRefreshCw,
  LuCircleCheck, LuCircleX, LuClock3, LuBookOpen,
  LuTriangleAlert, LuUserRound, LuBriefcase,
} from "react-icons/lu";
import { toast } from "../../components/ui/toast";
import { adminAdsService } from "../../services/adminService";

/* ── Constants ─────────────────────────────────────────────────── */
const STATUS_TABS = [
  { value: "",          label: "Barchasi",     Icon: LuBookOpen,    color: "#374151" },
  { value: "pending",   label: "Kutilmoqda",   Icon: LuClock3,      color: "#d97706" },
  { value: "approved",  label: "Tasdiqlangan", Icon: LuCircleCheck, color: "#16a34a" },
  { value: "active",    label: "Faol",         Icon: LuCircleCheck, color: "#2563eb" },
  { value: "rejected",  label: "Rad etilgan",  Icon: LuCircleX,     color: "#dc2626" },
  { value: "completed", label: "Yakunlangan",  Icon: LuCircleCheck, color: "#6b7280" },
];

const STATUS_META = {
  pending:   { bg: "#fef9c3", c: "#854d0e", bd: "#fde68a", t: "Kutilmoqda",   icon: "⏳" },
  approved:  { bg: "#dcfce7", c: "#166534", bd: "#86efac", t: "Tasdiqlangan", icon: "✅" },
  active:    { bg: "#dbeafe", c: "#1e40af", bd: "#93c5fd", t: "Faol",         icon: "🔵" },
  rejected:  { bg: "#fee2e2", c: "#991b1b", bd: "#fca5a5", t: "Rad etilgan",  icon: "❌" },
  completed: { bg: "#f1f5f9", c: "#475569", bd: "#cbd5e1", t: "Yakunlangan",  icon: "🏁" },
};

const PER_PAGE = 10;

/* ── Helpers ───────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
}
function fmtMoney(n) {
  if (!n) return "—";
  return Number(n).toLocaleString("uz-UZ") + " so'm";
}
function getInitials(u) {
  if (!u) return "?";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "?";
}

/* ── StatusBadge ────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const x = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      background: x.bg, color: x.c, border: `1px solid ${x.bd}`,
      fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {x.icon} {x.t}
    </span>
  );
}

/* ── TypeBadge ──────────────────────────────────────────────────── */
function TypeBadge({ type }) {
  const isBlogger = type === "blogger";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700,
      background: isBlogger ? "#eef2ff" : "#fff7ed",
      color: isBlogger ? "#4f46e5" : "#ea580c",
    }}>
      {isBlogger ? <LuUserRound size={11} /> : <LuBriefcase size={11} />}
      {isBlogger ? "Blogger" : "Biznes"}
    </span>
  );
}

/* ── DetailModal ────────────────────────────────────────────────── */
function DetailModal({ ad, onClose, onApprove, onReject }) {
  if (!ad) return null;
  const isBlogger = ad.type === "blogger";
  const authorName = ad.user
    ? `${ad.user.firstName || ""} ${ad.user.lastName || ""}`.trim()
    : ad.companyName || "—";

  const Row = ({ label, value }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 600 }}>{value || "—"}</div>
    </div>
  );

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: "#fff", borderRadius: 22, width: "100%", maxWidth: 640, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,.22)" }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TypeBadge type={ad.type} />
            <StatusBadge status={ad.status} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {ad.status !== "approved" && ad.status !== "active" && (
              <button onClick={() => onApprove(ad._id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                <LuCheck size={13} /> Tasdiqlash
              </button>
            )}
            {ad.status !== "rejected" && (
              <button onClick={() => onReject(ad._id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                <LuX size={13} /> Rad etish
              </button>
            )}
            <button onClick={onClose} style={{ width: 32, height: 32, border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuX size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 26px" }}>
          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, padding: "14px", background: "#f8fafc", borderRadius: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: ad.user?.avatar ? `url(${ad.user.avatar}) center/cover` : "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {!ad.user?.avatar && getInitials(ad.user)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{authorName}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{ad.user?.email || ""} · {fmtDate(ad.createdAt)}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {isBlogger ? (
              <>
                <Row label="Sarlavha"       value={ad.title} />
                <Row label="Platforma"      value={(ad.platforms || []).join(", ")} />
                <Row label="Obunachilar"    value={ad.followersRange} />
                <Row label="Xizmatlar"      value={(ad.services || []).join(", ")} />
                <Row label="Post narxi"     value={fmtMoney(ad.pricing?.post)} />
                <Row label="Story narxi"    value={fmtMoney(ad.pricing?.story)} />
                <Row label="Video narxi"    value={fmtMoney(ad.pricing?.video || ad.pricing?.reel)} />
              </>
            ) : (
              <>
                <Row label="Kompaniya"      value={ad.companyName} />
                <Row label="Mahsulot"       value={ad.productName} />
                <Row label="Budjet"         value={fmtMoney(ad.budget)} />
                <Row label="Muddat"         value={ad.duration} />
                <Row label="Maqsadli"       value={ad.targetAudience} />
                <Row label="Joylashuv"      value={ad.location} />
              </>
            )}
          </div>

          {ad.description && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Tavsif</div>
              <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, background: "#f8fafc", padding: "12px 14px", borderRadius: 10, margin: 0 }}>{ad.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── DeleteConfirm ──────────────────────────────────────────────── */
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 380, width: "100%", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <LuTriangleAlert size={26} style={{ color: "#dc2626" }} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>O'chirishni tasdiqlang</h3>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
          Bu e'lonni o'chirsangiz, qaytarib bo'lmaydi.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            Bekor
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
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

  const [viewAd,   setViewAd]   = useState(null);
  const [deleteId, setDeleteId] = useState(null);
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
      toast.success(status === "approved" ? "Tasdiqlandi ✅" : status === "active" ? "Faollashtirildi 🔵" : "Rad etildi ❌");
      if (viewAd?._id === id) setViewAd(prev => ({ ...prev, status }));
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setActionLoading(p => ({ ...p, [id]: false }));
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      await adminAdsService.remove(deleteId);
      setAds(prev => prev.filter(a => a._id !== deleteId));
      setTotal(p => p - 1);
      toast.success("E'lon o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDeleteId(null);
    }
  };

  const handlePage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", padding: "28px 32px", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>E'lonlar boshqaruvi</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Barcha e'lonlar, tasdiqlash va boshqarish</p>
        </div>
        <button onClick={fetchAds} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <LuRefreshCw size={14} /> Yangilash
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {STATUS_TABS.map(t => (
          <button key={t.value} onClick={() => { setStatusTab(t.value); setPage(1); }} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
            border: statusTab === t.value ? `1.5px solid ${t.color}` : "1.5px solid #e2e8f0",
            borderRadius: 10, background: statusTab === t.value ? t.color + "12" : "#fff",
            color: statusTab === t.value ? t.color : "#374151",
            fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s",
          }}>
            <t.Icon size={14} />
            {t.label}
            <span style={{
              background: statusTab === t.value ? t.color + "20" : "#f1f5f9",
              color: statusTab === t.value ? t.color : "#64748b",
              padding: "1px 7px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            }}>
              {t.value === "" ? counts.all : counts[t.value] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #f1f5f9", padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <LuSearch size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text" value={searchInput}
            onChange={e => handleSearchInput(e.target.value)}
            placeholder="Qidirish..."
            style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box", color: "#374151" }}
          />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#374151", outline: "none", background: "#fff" }}>
          <option value="">Barchasi</option>
          <option value="blogger">Blogger</option>
          <option value="business">Biznes</option>
        </select>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{total} ta natija</span>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #f1f5f9", overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 110px", padding: "12px 18px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
          {["E'lon", "Muallif", "Tur", "Sana", "Status", "Amallar"].map(h => (
            <span key={h} style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" }}>
            <LuLoader size={28} className="ads-spin" style={{ color: "#dc2626" }} />
          </div>
        ) : ads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>E'lon topilmadi</p>
          </div>
        ) : (
          ads.map((ad, idx) => {
            const authorName = ad.user
              ? `${ad.user.firstName || ""} ${ad.user.lastName || ""}`.trim()
              : ad.companyName || "—";
            const isActing = actionLoading[ad._id];
            const title = ad.title || ad.productName || ad.companyName || "—";

            return (
              <div key={ad._id}
                style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 110px", padding: "14px 18px", borderBottom: idx < ads.length - 1 ? "1px solid #f8fafc" : "none", alignItems: "center", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Title */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                    {title}
                  </div>
                  {ad.budget && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Budjet: {fmtMoney(ad.budget)}</div>
                  )}
                  {ad.pricing?.post && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Post: {fmtMoney(ad.pricing.post)}</div>
                  )}
                </div>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: ad.user?.avatar ? `url(${ad.user.avatar}) center/cover` : "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>
                    {!ad.user?.avatar && getInitials(ad.user)}
                  </div>
                  <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {authorName}
                  </span>
                </div>

                {/* Type */}
                <TypeBadge type={ad.type} />

                {/* Date */}
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{fmtDate(ad.createdAt)}</span>

                {/* Status */}
                <StatusBadge status={ad.status || "pending"} />

                {/* Actions */}
                <div style={{ display: "flex", gap: 5 }}>
                  {/* View */}
                  <button onClick={() => setViewAd(ad)} title="Ko'rish"
                    style={{ width: 30, height: 30, border: "1.5px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                    <LuEye size={13} />
                  </button>
                  {/* Approve */}
                  {ad.status !== "approved" && ad.status !== "active" && (
                    <button onClick={() => changeStatus(ad._id, "approved")} title="Tasdiqlash"
                      disabled={isActing}
                      style={{ width: 30, height: 30, border: "1.5px solid #bbf7d0", borderRadius: 7, background: "#f0fdf4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a" }}>
                      {isActing ? <LuLoader size={11} className="ads-spin" /> : <LuCheck size={13} />}
                    </button>
                  )}
                  {/* Reject */}
                  {ad.status !== "rejected" && (
                    <button onClick={() => changeStatus(ad._id, "rejected")} title="Rad etish"
                      disabled={isActing}
                      style={{ width: 30, height: 30, border: "1.5px solid #fecaca", borderRadius: 7, background: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
                      <LuX size={13} />
                    </button>
                  )}
                  {/* Delete */}
                  <button onClick={() => setDeleteId(ad._id)} title="O'chirish"
                    style={{ width: 30, height: 30, border: "1.5px solid #fecaca", borderRadius: 7, background: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
                    <LuTrash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 24 }}>
          <button onClick={() => handlePage(page - 1)} disabled={page === 1}
            style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LuChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push("..."); acc.push(p); return acc; }, [])
            .map((p, i) => p === "..." ? (
              <span key={`d${i}`} style={{ padding: "0 4px", color: "#94a3b8" }}>…</span>
            ) : (
              <button key={p} onClick={() => handlePage(p)} style={{
                width: 34, height: 34, borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: page === p ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
                background: page === p ? "#dc2626" : "#fff",
                color: page === p ? "#fff" : "#374151", cursor: "pointer",
              }}>{p}</button>
            ))}
          <button onClick={() => handlePage(page + 1)} disabled={page === totalPages}
            style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LuChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Modals */}
      {viewAd && (
        <DetailModal
          ad={viewAd}
          onClose={() => setViewAd(null)}
          onApprove={id => changeStatus(id, "approved")}
          onReject={id => changeStatus(id, "rejected")}
        />
      )}
      {deleteId && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <style>{`
        @keyframes ads-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ads-spin { animation: ads-spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
