import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "../../components/ui/toast";
import { adminFaqsService } from "../../services/adminService";
import {
  LuLoader, LuPlus, LuPencil, LuTrash2, LuX, LuCheck,
  LuSearch, LuRefreshCw, LuTriangleAlert, LuChevronDown,
  LuMessageCircle, LuBookOpen, LuUser, LuBriefcase,
  LuCreditCard, LuSettings, LuToggleLeft, LuToggleRight,
  LuFilter, LuHash,
} from "react-icons/lu";

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

/* ── Category config ───────────────────────────────────────────── */
const CATS = [
  { value: "all",       label: "Barchasi",        icon: LuBookOpen,      color: T.textMuted, bg: "#F8FAFC",    border: T.border    },
  { value: "general",   label: "Umumiy",           icon: LuMessageCircle, color: T.textMuted, bg: "#F8FAFC",    border: T.border    },
  { value: "blogger",   label: "Blogger",          icon: LuUser,          color: T.red,       bg: T.redLight,   border: T.redBorder },
  { value: "business",  label: "Reklam beruvchi",  icon: LuBriefcase,     color: T.warn,      bg: T.warnBg,     border: T.warnBd    },
  { value: "payment",   label: "To'lov",           icon: LuCreditCard,    color: T.success,   bg: T.successBg,  border: T.successBd },
  { value: "technical", label: "Texnik",           icon: LuSettings,      color: T.info,      bg: T.infoBg,     border: T.infoBd    },
];

const CAT_MAP  = Object.fromEntries(CATS.filter(c => c.value !== "all").map(c => [c.value, c]));
const BLANK    = { question: "", answer: "", category: "general", order: 0, isActive: true };

/* ── Helpers ───────────────────────────────────────────────────── */
const inp = (extra = {}) => ({
  width: "100%", padding: "10px 13px", fontSize: 13.5,
  border: `1.5px solid ${T.border}`, borderRadius: 10, outline: "none",
  background: T.surfaceUp, color: T.text, boxSizing: "border-box",
  fontFamily: "inherit", ...extra,
});

/* ── CatBadge ───────────────────────────────────────────────────── */
function CatBadge({ category }) {
  const c = CAT_MAP[category] || CAT_MAP.general;
  const Icon = c.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      <Icon size={10} /> {c.label}
    </span>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg, border }) {
  return (
    <div style={{ background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`, padding: "18px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
      <div>
        <p style={{ fontSize: 11.5, fontWeight: 600, color: T.textDim, margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 800, color: T.text, margin: 0, lineHeight: 1 }}>{value ?? 0}</p>
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} style={{ color }} />
      </div>
    </div>
  );
}

/* ── FormModal (create & edit) ──────────────────────────────────── */
function FormModal({ initial, onClose, onSubmit, saving }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState({
    question: initial?.question  || "",
    answer:   initial?.answer    || "",
    category: initial?.category  || "general",
    order:    initial?.order     ?? 0,
    isActive: initial?.isActive  ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Savol va javob bo'sh bo'lmasin!");
      return;
    }
    onSubmit(form);
  };

  const selCat = CAT_MAP[form.category] || CAT_MAP.general;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 580, maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.25)", border: `1px solid ${T.border}` }}>

        {/* Header */}
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: T.surface, zIndex: 1, borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isEdit ? <LuPencil size={15} style={{ color: T.red }} /> : <LuPlus size={16} style={{ color: T.red }} />}
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>
              {isEdit ? "FAQ ni tahrirlash" : "Yangi FAQ qo'shish"}
            </span>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
            <LuX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "26px" }}>

          {/* Category picker */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 8 }}>Kategoriya</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATS.filter(c => c.value !== "all").map(c => {
                const active = form.category === c.value;
                const Icon = c.icon;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, category: c.value }))}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 13px", borderRadius: 10, cursor: "pointer",
                      border: `1.5px solid ${active ? c.color + "55" : T.border}`,
                      background: active ? c.bg : T.surfaceUp,
                      color: active ? c.color : T.textMuted,
                      fontSize: 12.5, fontWeight: 700, transition: "all .12s",
                    }}
                  >
                    <Icon size={12} /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Savol *</label>
            <input
              style={inp()}
              value={form.question}
              onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
              placeholder="Savol matnini kiriting..."
              required
              autoFocus={!isEdit}
            />
          </div>

          {/* Answer */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Javob *</label>
            <textarea
              style={{ ...inp(), resize: "vertical", minHeight: 120 }}
              value={form.answer}
              onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
              placeholder="Javob matnini kiriting..."
              required
            />
          </div>

          {/* Order + isActive */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Tartib raqami</label>
              <input
                type="number"
                style={inp()}
                value={form.order}
                onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                min={0}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Holat</label>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                style={{
                  width: "100%", padding: "10px 13px", borderRadius: 10, cursor: "pointer",
                  border: `1.5px solid ${form.isActive ? T.successBd : T.border}`,
                  background: form.isActive ? T.successBg : T.surfaceUp,
                  color: form.isActive ? T.success : T.textMuted,
                  fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 7,
                }}
              >
                {form.isActive
                  ? <><LuToggleRight size={18} /> Faol</>
                  : <><LuToggleLeft size={18} /> Nofaol</>}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>
              Bekor qilish
            </button>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {saving ? <LuLoader size={14} className="spin" /> : <LuCheck size={14} />}
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── DeleteConfirm ──────────────────────────────────────────────── */
function DeleteConfirm({ faq, onConfirm, onCancel, saving }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 22, padding: "36px 32px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,.2)", border: `1px solid ${T.border}` }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: T.redLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: `1.5px solid ${T.redBorder}` }}>
          <LuTriangleAlert size={24} style={{ color: T.red }} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>O'chirishni tasdiqlang</h3>
        <p style={{ fontSize: 13.5, color: T.textMuted, margin: "0 0 10px", lineHeight: 1.6 }}>Bu FAQ ni o'chirsangiz, qaytarib bo'lmaydi.</p>
        {faq && (
          <p style={{ fontSize: 13, color: T.text, fontWeight: 600, background: T.surfaceUp, padding: "10px 14px", borderRadius: 10, border: `1px solid ${T.border}`, margin: "0 0 22px", lineHeight: 1.5, textAlign: "left" }}>
            "{faq.question}"
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>
            Bekor
          </button>
          <button onClick={onConfirm} disabled={saving} style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.redMid},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ Row ────────────────────────────────────────────────────── */
function FaqRow({ faq, idx, onEdit, onDelete, deleting }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: T.surface, borderRadius: 14, border: `1.5px solid ${T.border}`,
        overflow: "hidden", transition: "box-shadow .15s",
        boxShadow: open ? "0 4px 16px rgba(0,0,0,.07)" : "0 1px 3px rgba(0,0,0,.04)",
      }}
    >
      {/* Row header */}
      <div
        style={{ display: "grid", gridTemplateColumns: "36px 1fr auto auto auto", alignItems: "center", gap: 10, padding: "14px 18px", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}
      >
        {/* index */}
        <span style={{ fontSize: 12, fontWeight: 700, color: T.textDim, textAlign: "center", background: T.surfaceUp, border: `1px solid ${T.border}`, borderRadius: 7, padding: "3px 0", minWidth: 28 }}>
          {idx + 1}
        </span>

        {/* question */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <CatBadge category={faq.category} />
            {!faq.isActive && (
              <span style={{ fontSize: 10, fontWeight: 700, color: T.textDim, background: T.surfaceUp, border: `1px solid ${T.border}`, padding: "2px 7px", borderRadius: 99 }}>
                Nofaol
              </span>
            )}
          </div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: T.text, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
            {faq.question}
          </p>
        </div>

        {/* order badge */}
        <span style={{ fontSize: 11, fontWeight: 700, color: T.textDim, background: T.surfaceUp, border: `1px solid ${T.border}`, padding: "3px 8px", borderRadius: 7, whiteSpace: "nowrap" }}>
          #{faq.order ?? 0}
        </span>

        {/* actions */}
        <div style={{ display: "flex", gap: 5 }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onEdit(faq)}
            title="Tahrirlash"
            style={{ width: 30, height: 30, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, transition: "all .12s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.purpleBg; e.currentTarget.style.borderColor = T.purpleBd; e.currentTarget.style.color = T.purple; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
          >
            <LuPencil size={12} />
          </button>
          <button
            onClick={() => onDelete(faq)}
            disabled={deleting}
            title="O'chirish"
            style={{ width: 30, height: 30, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, transition: "all .12s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = T.redBorder; e.currentTarget.style.color = T.red; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
          >
            <LuTrash2 size={12} />
          </button>
        </div>

        {/* chevron */}
        <div style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <LuChevronDown size={14} />
        </div>
      </div>

      {/* Answer panel */}
      {open && (
        <div style={{ padding: "14px 18px 16px", borderTop: `1px solid ${T.border}`, background: T.surfaceUp }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>Javob</p>
          <p style={{ fontSize: 13.5, color: T.textMuted, lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminFAQ() {
  const [faqs,       setFaqs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("all");
  const [search,     setSearch]     = useState("");
  const [searchInp,  setSearchInp]  = useState("");

  const [showForm,     setShowForm]     = useState(false);
  const [editingFaq,   setEditingFaq]   = useState(null);
  const [deletingFaq,  setDeletingFaq]  = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [delSaving,    setDelSaving]    = useState(false);

  const debRef = useRef(null);

  /* ── Fetch ── */
  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFaqsService.getAll();
      setFaqs(res.data || []);
    } catch {
      toast.error("FAQ larni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  /* ── Search debounce ── */
  const handleSearch = (val) => {
    setSearchInp(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setSearch(val), 300);
  };

  /* ── Create ── */
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await adminFaqsService.create(form);
      toast.success("Yangi FAQ qo'shildi");
      setShowForm(false);
      fetchFaqs();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  /* ── Update ── */
  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await adminFaqsService.update(editingFaq._id, form);
      toast.success("FAQ yangilandi");
      setEditingFaq(null);
      fetchFaqs();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    setDelSaving(true);
    try {
      await adminFaqsService.remove(deletingFaq._id);
      toast.success("FAQ o'chirildi");
      setDeletingFaq(null);
      fetchFaqs();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setDelSaving(false);
    }
  };

  /* ── Derived ── */
  const counts = {
    all: faqs.length,
    ...Object.fromEntries(
      CATS.filter(c => c.value !== "all").map(c => [c.value, faqs.filter(f => f.category === c.value).length])
    ),
  };
  const activeCount = faqs.filter(f => f.isActive).length;

  const filtered = faqs
    .filter(f => activeTab === "all" || f.category === activeTab)
    .filter(f => !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase()));

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", padding: "28px 32px", background: T.bg, minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuMessageCircle size={18} style={{ color: T.red }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>FAQ boshqaruvi</h1>
          </div>
          <p style={{ fontSize: 13, color: T.textDim, margin: 0 }}>Ko'p so'raladigan savollar va javoblar</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", borderRadius: 12, background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(198,40,40,.3)" }}
          >
            <LuPlus size={15} /> Yangi FAQ
          </button>
          <button
            onClick={fetchFaqs}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <LuRefreshCw size={14} /> Yangilash
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Jami FAQ"      value={faqs.length}    icon={LuBookOpen}      color={T.textMuted} bg="#F8FAFC"      border={T.border}    />
        <StatCard label="Faol"          value={activeCount}    icon={LuToggleRight}   color={T.success}   bg={T.successBg}  border={T.successBd} />
        <StatCard label="Blogger"       value={counts.blogger}  icon={LuUser}          color={T.red}       bg={T.redLight}   border={T.redBorder} />
        <StatCard label="Reklam"        value={counts.business} icon={LuBriefcase}     color={T.warn}      bg={T.warnBg}     border={T.warnBd}    />
        <StatCard label="Texnik"        value={counts.technical}icon={LuSettings}      color={T.info}      bg={T.infoBg}     border={T.infoBd}    />
      </div>

      {/* ── Category Tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {CATS.map(c => {
          const active = activeTab === c.value;
          const Icon = c.icon;
          return (
            <button
              key={c.value}
              onClick={() => setActiveTab(c.value)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 15px",
                border: active ? `1.5px solid ${c.color}44` : `1.5px solid ${T.border}`,
                borderRadius: 10,
                background: active ? c.bg : T.surface,
                color: active ? c.color : T.textMuted,
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
              }}
            >
              <Icon size={13} />
              {c.label}
              <span style={{
                background: active ? c.color + "20" : T.surfaceUp,
                color: active ? c.color : T.textDim,
                padding: "1px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
              }}>
                {c.value === "all" ? counts.all : counts[c.value] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search bar ── */}
      <div style={{ background: T.surface, borderRadius: 14, border: `1.5px solid ${T.border}`, padding: "13px 18px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <LuSearch size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <input
            type="text"
            value={searchInp}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Savol yoki javob bo'yicha qidirish..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: T.text, background: T.surfaceUp }}
          />
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: T.textDim, fontWeight: 600, background: T.surfaceUp, padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}` }}>
          {filtered.length} ta savol
        </div>
      </div>

      {/* ── FAQ List ── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 20px", gap: 14 }}>
          <LuLoader size={32} className="spin" style={{ color: T.red }} />
          <p style={{ color: T.textDim, fontSize: 13.5, margin: 0, fontWeight: 600 }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "72px 20px", background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}` }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>❓</div>
          <p style={{ color: T.textMuted, fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>FAQ topilmadi</p>
          <p style={{ color: T.textDim, fontSize: 13, margin: "0 0 20px" }}>
            {search ? "Qidiruv shartlarini o'zgartiring" : "Yangi FAQ qo'shing"}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
            >
              <LuPlus size={14} /> Yangi FAQ qo'shish
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((faq, idx) => (
            <FaqRow
              key={faq._id}
              faq={faq}
              idx={idx}
              onEdit={f => setEditingFaq(f)}
              onDelete={f => setDeletingFaq(f)}
              deleting={delSaving}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {showForm && (
        <FormModal
          initial={null}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          saving={saving}
        />
      )}

      {editingFaq && (
        <FormModal
          initial={editingFaq}
          onClose={() => setEditingFaq(null)}
          onSubmit={handleUpdate}
          saving={saving}
        />
      )}

      {deletingFaq && (
        <DeleteConfirm
          faq={deletingFaq}
          onConfirm={handleDelete}
          onCancel={() => setDeletingFaq(null)}
          saving={delSaving}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
