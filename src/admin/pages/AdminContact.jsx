import { useState, useEffect, useCallback, useRef } from "react";
import {
  LuMail, LuMessageSquare, LuCircleCheck, LuTrash2,
  LuSearch, LuRefreshCw, LuSend, LuX, LuInbox,
  LuClock, LuEye, LuPhone, LuUser, LuBriefcase,
  LuTriangleAlert, LuLoader, LuReply,
  LuStickyNote, LuCalendar,
} from "react-icons/lu";
import api from "../../services/api";
import { toast } from "../../components/ui/toast";

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

/* ── Status config ─────────────────────────────────────────────── */
const STATUS = {
  new:       { label: "Yangi",      dot: T.red,     bg: T.redLight,   border: T.redBorder, color: T.red     },
  read:      { label: "Ko'rildi",   dot: T.textDim, bg: T.surfaceUp,  border: T.border,    color: T.textDim },
  responded: { label: "Javob b.",   dot: T.success, bg: T.successBg,  border: T.successBd, color: T.success },
};

const STATUS_TABS = [
  { value: "all",       label: "Barchasi"  },
  { value: "new",       label: "Yangi"     },
  { value: "read",      label: "Ko'rildi"  },
  { value: "responded", label: "Javob b." },
];

const ROLE_META = {
  blogger:  { label: "Blogger",   color: T.red,    bg: T.redLight,  border: T.redBorder },
  business: { label: "Biznes",    color: T.warn,   bg: T.warnBg,    border: T.warnBd    },
  other:    { label: "Boshqa",    color: T.textDim,bg: T.surfaceUp, border: T.border     },
};

/* ── Helpers ───────────────────────────────────────────────────── */
const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";

const avaColor = (name = "") => {
  const colors = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const fmtShort = (iso) => {
  const diff = Date.now() - new Date(iso);
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "hozirgina";
  if (h < 24) return `${h}s oldin`;
  const d = Math.floor(diff / 86_400_000);
  if (d < 7) return `${d}k oldin`;
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
};

const fmtFull = (iso) =>
  new Date(iso).toLocaleString("uz-UZ", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

/* ── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ name, size = 38 }) {
  const color = avaColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: color + "22", border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 800, color,
    }}>
      {getInitials(name)}
    </div>
  );
}

/* ── StatusBadge ────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ── RoleBadge ──────────────────────────────────────────────────── */
function RoleBadge({ role }) {
  const r = ROLE_META[role] || ROLE_META.other;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 99, fontSize: 10.5, fontWeight: 700,
      background: r.bg, color: r.color, border: `1px solid ${r.border}`,
    }}>
      {r.label}
    </span>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg, border, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? bg : T.surface,
        borderRadius: 14, border: `1.5px solid ${active ? color + "44" : T.border}`,
        padding: "16px 18px", display: "flex", alignItems: "center",
        gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,.04)",
        cursor: onClick ? "pointer" : "default",
        transition: "all .15s",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, lineHeight: 1 }}>{value ?? 0}</p>
        <p style={{ fontSize: 11.5, fontWeight: 600, color: T.textDim, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</p>
      </div>
    </div>
  );
}

/* ── Reply Modal ────────────────────────────────────────────────── */
function ReplyModal({ contact, onClose, onReplied }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.patch(`/admin/contacts/${contact._id}/reply`, { reply: text.trim() });
      toast.success("Javob yuborildi");
      onReplied();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 540, boxShadow: "0 32px 80px rgba(0,0,0,.25)", border: `1px solid ${T.border}` }}>

        {/* Header */}
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuReply size={15} style={{ color: T.red }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: T.text, margin: 0 }}>Javob yozish</p>
              <p style={{ fontSize: 12, color: T.textDim, margin: 0 }}>{contact.name} — {contact.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
            <LuX size={15} />
          </button>
        </div>

        <div style={{ padding: "22px 26px 26px" }}>
          {/* Original message */}
          <div style={{ padding: "12px 14px", borderRadius: 12, background: T.surfaceUp, border: `1px solid ${T.border}`, marginBottom: 18 }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>Asl xabar</p>
            <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {contact.message}
            </p>
          </div>

          {/* Reply input */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Javobingiz</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={5}
              placeholder="Javob yozing..."
              autoFocus
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${T.border}`, borderRadius: 12, fontSize: 13.5, outline: "none", resize: "vertical", fontFamily: "inherit", color: T.text, background: T.surfaceUp, boxSizing: "border-box" }}
            />
            <p style={{ fontSize: 11.5, color: T.textDim, margin: "5px 0 0" }}>
              {contact.userId
                ? "Bildirishnoma sifatida foydalanuvchiga va email orqali yuboriladi"
                : "Faqat email orqali yuboriladi"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>
              Bekor qilish
            </button>
            <button
              onClick={send}
              disabled={!text.trim() || loading}
              style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: (!text.trim() || loading) ? "not-allowed" : "pointer", opacity: (!text.trim() || loading) ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
            >
              {loading ? <LuLoader size={14} className="spin" /> : <LuSend size={14} />}
              {loading ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm ─────────────────────────────────────────────── */
function DeleteConfirm({ contact, onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 22, padding: "34px 30px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,.2)", border: `1px solid ${T.border}` }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.redLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: `1.5px solid ${T.redBorder}` }}>
          <LuTriangleAlert size={24} style={{ color: T.red }} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>O'chirishni tasdiqlang</h3>
        {contact && (
          <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 22px", lineHeight: 1.6 }}>
            <strong style={{ color: T.text }}>{contact.name}</strong> xabarini o'chirasizmi?
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>Bekor</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.redMid},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminContact() {
  const [contacts,     setContacts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [searchInp,    setSearchInp]    = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected,     setSelected]     = useState(null);
  const [replyTarget,  setReplyTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [delLoading,   setDelLoading]   = useState(false);

  const debRef = useRef(null);

  /* ── Fetch ── */
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await api.get(`/admin/contacts${params}`);
      setContacts(res.data.data || []);
    } catch {
      toast.error("Xabarlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  /* ── Search debounce ── */
  const handleSearch = (val) => {
    setSearchInp(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setSearch(val), 300);
  };

  /* ── Open contact (marks as read) ── */
  const openContact = async (c) => {
    setSelected(c);
    if (c.status === "new") {
      try {
        const res = await api.get(`/admin/contacts/${c._id}`);
        const updated = res.data.data;
        setContacts(prev => prev.map(x => x._id === c._id ? updated : x));
        setSelected(updated);
      } catch { /* ignore */ }
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await api.delete(`/admin/contacts/${deleteTarget._id}`);
      setContacts(prev => prev.filter(c => c._id !== deleteTarget._id));
      if (selected?._id === deleteTarget._id) setSelected(null);
      toast.success("O'chirildi");
      setDeleteTarget(null);
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDelLoading(false);
    }
  };

  /* ── Derived ── */
  const stats = {
    total:     contacts.length,
    new:       contacts.filter(c => c.status === "new").length,
    read:      contacts.filter(c => c.status === "read").length,
    responded: contacts.filter(c => c.status === "responded").length,
  };

  const filtered = contacts.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q)
    );
  });

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", padding: "28px 32px", background: T.bg, minHeight: "100vh", display: "flex", flexDirection: "column", gap: 22 }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuInbox size={18} style={{ color: T.red }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>Xabarlar boshqaruvi</h1>
          </div>
          <p style={{ fontSize: 13, color: T.textDim, margin: 0 }}>Foydalanuvchilardan kelgan xabarlar va javoblar</p>
        </div>
        <button
          onClick={fetchContacts}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        >
          <LuRefreshCw size={14} className={loading ? "spin" : ""} /> Yangilash
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
        <StatCard label="Jami"      value={stats.total}     icon={LuInbox}        color={T.purple}  bg={T.purpleBg}   border={T.purpleBd}  active={statusFilter==="all"}       onClick={() => setStatusFilter("all")}       />
        <StatCard label="Yangi"     value={stats.new}       icon={LuMail}         color={T.red}     bg={T.redLight}   border={T.redBorder} active={statusFilter==="new"}       onClick={() => setStatusFilter("new")}       />
        <StatCard label="Ko'rildi"  value={stats.read}      icon={LuEye}          color={T.textDim} bg={T.surfaceUp}  border={T.border}    active={statusFilter==="read"}      onClick={() => setStatusFilter("read")}      />
        <StatCard label="Javob b."  value={stats.responded} icon={LuCircleCheck}  color={T.success} bg={T.successBg}  border={T.successBd} active={statusFilter==="responded"} onClick={() => setStatusFilter("responded")} />
      </div>

      {/* ── Search + filter bar ── */}
      <div style={{ background: T.surface, borderRadius: 14, border: `1.5px solid ${T.border}`, padding: "13px 18px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <LuSearch size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <input
            type="text"
            value={searchInp}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Ism, email yoki mavzu bo'yicha qidirish..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: T.text, background: T.surfaceUp }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {STATUS_TABS.map(s => {
            const st = STATUS[s.value] || {};
            const active = statusFilter === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                style={{
                  padding: "7px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                  border: active ? `1.5px solid ${(st.color || T.purple) + "55"}` : `1.5px solid ${T.border}`,
                  background: active ? (st.bg || T.purpleBg) : T.surface,
                  color: active ? (st.color || T.purple) : T.textMuted,
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: T.textDim, fontWeight: 600, background: T.surfaceUp, padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}` }}>
          {filtered.length} ta xabar
        </div>
      </div>

      {/* ── Main content: list + detail ── */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16, flex: 1, minHeight: 0 }}>

        {/* ── Contact List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", maxHeight: "calc(100vh - 340px)" }}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 78, borderRadius: 12, background: T.border, opacity: 0.5, animation: "pulse 1.5s ease-in-out infinite" }} />
            ))
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "52px 20px", background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}` }}>
              <LuInbox size={36} style={{ color: T.textDim, marginBottom: 12, opacity: 0.5 }} />
              <p style={{ color: T.textMuted, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Xabar topilmadi</p>
              <p style={{ color: T.textDim, fontSize: 12.5, margin: 0 }}>
                {search ? "Qidiruvni o'zgartiring" : "Hech qanday xabar yo'q"}
              </p>
            </div>
          ) : filtered.map(c => {
            const isActive = selected?._id === c._id;
            const isNew = c.status === "new";
            return (
              <div
                key={c._id}
                onClick={() => openContact(c)}
                style={{
                  padding: "13px 16px", borderRadius: 13, cursor: "pointer",
                  border: `1.5px solid ${isActive ? T.red + "55" : T.border}`,
                  background: isActive ? T.redLight : T.surface,
                  transition: "all .14s",
                  position: "relative",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = T.redBorder; e.currentTarget.style.background = T.surfaceUp; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; } }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Avatar name={c.name} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <p style={{ fontSize: 13.5, fontWeight: isNew ? 800 : 600, color: T.text, margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "65%" }}>
                        {c.name}
                      </p>
                      <span style={{ fontSize: 11, color: T.textDim, flexShrink: 0 }}>{fmtShort(c.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: 12.5, fontWeight: isNew ? 700 : 500, color: isNew ? T.textMuted : T.textDim, margin: "0 0 6px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {c.subject}
                    </p>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <StatusBadge status={c.status} />
                      {c.role && c.role !== "other" && <RoleBadge role={c.role} />}
                    </div>
                  </div>
                </div>

                {/* New indicator dot */}
                {isNew && (
                  <span style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", background: T.red, border: `2px solid ${isActive ? T.redLight : T.surface}` }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Detail Panel ── */}
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 340px)" }}>
          {!selected ? (
            <div style={{ height: "100%", minHeight: 300, background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.surfaceUp, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LuMessageSquare size={26} style={{ color: T.textDim }} />
              </div>
              <p style={{ color: T.textMuted, fontSize: 14, fontWeight: 600, margin: 0 }}>Xabarni tanlang</p>
              <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Chap tomondan xabarni bosing</p>
            </div>
          ) : (
            <div style={{ background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`, overflow: "hidden" }}>

              {/* Detail header */}
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Avatar name={selected.name} size={46} />
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: "0 0 3px" }}>{selected.name}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.textDim }}>
                        <LuMail size={11} /> {selected.email}
                      </span>
                      {selected.phone && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.textDim }}>
                          <LuPhone size={11} /> {selected.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  {selected.role && <RoleBadge role={selected.role} />}
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              {/* Subject + date */}
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.border}`, background: T.surfaceUp }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: T.text, margin: "0 0 5px" }}>{selected.subject}</p>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: T.textDim }}>
                  <LuCalendar size={11} /> {fmtFull(selected.createdAt)}
                </span>
              </div>

              {/* Message */}
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px" }}>Xabar</p>
                <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", padding: "14px 16px", background: T.surfaceUp, borderRadius: 12, border: `1px solid ${T.border}` }}>
                  {selected.message}
                </p>
              </div>

              {/* Existing reply */}
              {selected.reply && (
                <div style={{ margin: "0 24px 20px", padding: "14px 16px", background: T.successBg, border: `1px solid ${T.successBd}`, borderRadius: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <LuCircleCheck size={13} style={{ color: T.success }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.4px" }}>Javob yuborildi</span>
                    {selected.repliedAt && (
                      <span style={{ fontSize: 11, color: T.success, marginLeft: "auto", opacity: 0.7 }}>{fmtFull(selected.repliedAt)}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13.5, color: "#14532D", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{selected.reply}</p>
                </div>
              )}

              {/* Admin note */}
              {selected.adminNote && (
                <div style={{ margin: "0 24px 20px", padding: "12px 14px", background: T.warnBg, border: `1px solid ${T.warnBd}`, borderRadius: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <LuStickyNote size={12} style={{ color: T.warn }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.warn, textTransform: "uppercase", letterSpacing: "0.4px" }}>Admin eslatma</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#78350F", margin: 0 }}>{selected.adminNote}</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ padding: "0 24px 22px", display: "flex", gap: 10 }}>
                <button
                  onClick={() => setReplyTarget(selected)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
                >
                  <LuSend size={14} /> {selected.reply ? "Yana javob" : "Javob yozish"}
                </button>
                <button
                  onClick={() => setDeleteTarget(selected)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13.5, fontWeight: 600, cursor: "pointer", transition: "all .12s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = T.redBorder; e.currentTarget.style.color = T.red; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                >
                  <LuTrash2 size={14} /> O'chirish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {replyTarget && (
        <ReplyModal
          contact={replyTarget}
          onClose={() => setReplyTarget(null)}
          onReplied={fetchContacts}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          contact={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={delLoading}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes pulse { 0%,100% { opacity:.5 } 50% { opacity:1 } }
      `}</style>
    </div>
  );
}
