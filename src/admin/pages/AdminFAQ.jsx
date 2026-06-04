import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../components/ui/toast";
import { adminFaqsService } from "../../services/adminService";
import {
  LuLoader, LuPlus, LuPencil, LuTrash2, LuX, LuCheck,
  LuSearch, LuRefreshCw, LuTriangleAlert, LuChevronDown,
  LuMessageCircle, LuBookOpen, LuUser, LuBriefcase,
  LuCreditCard, LuSettings, LuToggleLeft, LuToggleRight,
} from "react-icons/lu";

/* ── Tokens ────────────────────────────────────────────────────────── */
const T = {
  red:"#C62828", redMid:"#E53935", redLight:"#FFEBEE", redBorder:"#FFCDD2",
  bg:"#F1F5F9", surface:"#FFFFFF", surfaceUp:"#F8FAFC", border:"#E2E8F0",
  text:"#0F172A", textMuted:"#475569", textDim:"#94A3B8",
  success:"#16A34A", successBg:"#F0FDF4", successBd:"#BBF7D0",
  warn:"#D97706", warnBg:"#FFFBEB", warnBd:"#FDE68A",
  info:"#0284C7", infoBg:"#F0F9FF", infoBd:"#BAE6FD",
  purple:"#7C3AED", purpleBg:"#F5F3FF", purpleBd:"#DDD6FE",
};

/* ── Categories ────────────────────────────────────────────────────── */
const CATS = [
  { value:"all",       label:"Barchasi",       icon:LuBookOpen,      color:T.purple,  bg:T.purpleBg,  border:T.purpleBd  },
  { value:"general",   label:"Umumiy",          icon:LuMessageCircle, color:T.textMuted,bg:T.surfaceUp,border:T.border    },
  { value:"blogger",   label:"Blogger",         icon:LuUser,          color:T.red,     bg:T.redLight,  border:T.redBorder },
  { value:"business",  label:"Reklam beruvchi", icon:LuBriefcase,     color:T.warn,    bg:T.warnBg,    border:T.warnBd    },
  { value:"payment",   label:"To'lov",          icon:LuCreditCard,    color:T.success, bg:T.successBg, border:T.successBd },
  { value:"technical", label:"Texnik",          icon:LuSettings,      color:T.info,    bg:T.infoBg,    border:T.infoBd    },
];
const CAT_MAP = Object.fromEntries(CATS.map(c => [c.value, c]));
const BLANK   = { question:"", answer:"", category:"general", order:0, isActive:true };

/* ── CatBadge ──────────────────────────────────────────────────────── */
function CatBadge({ category }) {
  const c = CAT_MAP[category] || CAT_MAP.general;
  const Icon = c.icon;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"2px 9px", borderRadius:99, fontSize:10.5, fontWeight:700,
      background:c.bg, color:c.color, border:`1px solid ${c.border}`,
      whiteSpace:"nowrap",
    }}>
      <Icon size={9} />{c.label}
    </span>
  );
}

/* ── FormModal ─────────────────────────────────────────────────────── */
function FormModal({ initial, onClose, onSubmit, saving }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState({
    question: initial?.question || "",
    answer:   initial?.answer   || "",
    category: initial?.category || "general",
    order:    initial?.order    ?? 0,
    isActive: initial?.isActive ?? true,
  });

  const ok = form.question.trim() && form.answer.trim();

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0,
        background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)",
        zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      }}
    >
      <div style={{
        background:T.surface, borderRadius:20, width:"100%", maxWidth:560,
        maxHeight:"92vh", overflow:"auto",
        boxShadow:"0 24px 80px rgba(0,0,0,.22)", border:`1px solid ${T.border}`,
      }}>
        {/* Header */}
        <div style={{
          padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:T.surfaceUp, position:"sticky", top:0, zIndex:1,
          borderRadius:"20px 20px 0 0",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:32, height:32, borderRadius:9, flexShrink:0,
              background:T.redLight, border:`1px solid ${T.redBorder}`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {isEdit ? <LuPencil size={14} style={{ color:T.red }} /> : <LuPlus size={15} style={{ color:T.red }} />}
            </div>
            <span style={{ fontSize:15, fontWeight:800, color:T.text }}>
              {isEdit ? "FAQ tahrirlash" : "Yangi FAQ"}
            </span>
          </div>
          <button onClick={onClose} style={{
            width:30, height:30, border:`1px solid ${T.border}`, borderRadius:8,
            background:T.surface, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", color:T.textMuted,
          }}>
            <LuX size={13} />
          </button>
        </div>

        <div style={{ padding:"22px" }}>
          {/* Category */}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11.5, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:8 }}>
              Kategoriya
            </label>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {CATS.filter(c => c.value !== "all").map(c => {
                const active = form.category === c.value;
                const Icon = c.icon;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, category:c.value }))}
                    style={{
                      display:"flex", alignItems:"center", gap:5,
                      padding:"6px 12px", borderRadius:8, cursor:"pointer",
                      border:`1.5px solid ${active ? c.color + "55" : T.border}`,
                      background:active ? c.bg : T.surfaceUp,
                      color:active ? c.color : T.textMuted,
                      fontSize:12, fontWeight:700, transition:"all .12s",
                    }}
                  >
                    <Icon size={11} />{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11.5, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>
              Savol *
            </label>
            <input
              value={form.question}
              onChange={e => setForm(p => ({ ...p, question:e.target.value }))}
              placeholder="Savol matnini kiriting..."
              autoFocus={!isEdit}
              style={{
                width:"100%", padding:"10px 12px",
                border:`1.5px solid ${T.border}`, borderRadius:10,
                fontSize:13.5, outline:"none", color:T.text,
                background:T.surfaceUp, fontFamily:"inherit", boxSizing:"border-box",
              }}
              onFocus={e  => e.target.style.borderColor = T.red + "88"}
              onBlur={e   => e.target.style.borderColor = T.border}
            />
          </div>

          {/* Answer */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11.5, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>
              Javob *
            </label>
            <textarea
              value={form.answer}
              onChange={e => setForm(p => ({ ...p, answer:e.target.value }))}
              placeholder="Javob matnini kiriting..."
              rows={5}
              style={{
                width:"100%", padding:"10px 12px",
                border:`1.5px solid ${T.border}`, borderRadius:10,
                fontSize:13.5, outline:"none", resize:"vertical", minHeight:110,
                color:T.text, background:T.surfaceUp,
                fontFamily:"inherit", boxSizing:"border-box", lineHeight:1.65,
              }}
              onFocus={e  => e.target.style.borderColor = T.red + "88"}
              onBlur={e   => e.target.style.borderColor = T.border}
            />
          </div>

          {/* Order + Active */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
            <div>
              <label style={{ fontSize:11.5, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>
                Tartib #
              </label>
              <input
                type="number" min={0}
                value={form.order}
                onChange={e => setForm(p => ({ ...p, order:Number(e.target.value) }))}
                style={{
                  width:"100%", padding:"10px 12px",
                  border:`1.5px solid ${T.border}`, borderRadius:10,
                  fontSize:13, outline:"none", color:T.text,
                  background:T.surfaceUp, fontFamily:"inherit", boxSizing:"border-box",
                }}
                onFocus={e  => e.target.style.borderColor = T.red + "88"}
                onBlur={e   => e.target.style.borderColor = T.border}
              />
            </div>
            <div>
              <label style={{ fontSize:11.5, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>
                Holat
              </label>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, isActive:!p.isActive }))}
                style={{
                  width:"100%", padding:"10px 12px", borderRadius:10, cursor:"pointer",
                  border:`1.5px solid ${form.isActive ? T.successBd : T.border}`,
                  background:form.isActive ? T.successBg : T.surfaceUp,
                  color:form.isActive ? T.success : T.textMuted,
                  fontSize:13, fontWeight:700,
                  display:"flex", alignItems:"center", gap:7, justifyContent:"center",
                }}
              >
                {form.isActive
                  ? <><LuToggleRight size={17} /> Faol</>
                  : <><LuToggleLeft  size={17} /> Nofaol</>
                }
              </button>
            </div>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onClose} style={{
              flex:1, padding:"10px", border:`1.5px solid ${T.border}`,
              borderRadius:10, background:T.surface, fontSize:13,
              fontWeight:600, cursor:"pointer", color:T.textMuted,
            }}>
              Bekor
            </button>
            <button
              onClick={() => ok && onSubmit(form)}
              disabled={!ok || saving}
              style={{
                flex:2, padding:"10px",
                background:`linear-gradient(135deg,${T.red},#B91C1C)`,
                color:"#fff", border:"none", borderRadius:10,
                fontSize:13, fontWeight:700,
                cursor:(!ok || saving) ? "not-allowed" : "pointer",
                opacity:(!ok || saving) ? 0.65 : 1,
                display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              }}
            >
              {saving
                ? <LuLoader size={13} style={{ animation:"spin .8s linear infinite" }} />
                : <LuCheck size={13} />
              }
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── DeleteConfirm ─────────────────────────────────────────────────── */
function DeleteConfirm({ faq, onConfirm, onCancel, saving }) {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div style={{
        background:T.surface, borderRadius:18, padding:"28px 24px",
        maxWidth:380, width:"100%", textAlign:"center",
        boxShadow:"0 24px 64px rgba(0,0,0,.2)", border:`1px solid ${T.border}`,
      }}>
        <div style={{
          width:50, height:50, borderRadius:"50%", background:T.redLight,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 14px", border:`1.5px solid ${T.redBorder}`,
        }}>
          <LuTriangleAlert size={22} style={{ color:T.red }} />
        </div>
        <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 8px" }}>
          O'chirishni tasdiqlang
        </h3>
        {faq && (
          <p style={{
            fontSize:12.5, color:T.text, fontWeight:600,
            background:T.surfaceUp, padding:"10px 13px", borderRadius:9,
            border:`1px solid ${T.border}`, margin:"0 0 18px",
            lineHeight:1.5, textAlign:"left",
          }}>
            "{faq.question}"
          </p>
        )}
        <p style={{ fontSize:12.5, color:T.textMuted, margin:"0 0 18px" }}>
          Bu amalni qaytarib bo'lmaydi.
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{
            flex:1, padding:"10px", border:`1.5px solid ${T.border}`,
            borderRadius:10, background:T.surface,
            fontSize:13, fontWeight:600, cursor:"pointer", color:T.textMuted,
          }}>
            Bekor
          </button>
          <button onClick={onConfirm} disabled={saving} style={{
            flex:1, padding:"10px",
            background:`linear-gradient(135deg,${T.redMid},#B91C1C)`,
            color:"#fff", border:"none", borderRadius:10,
            fontSize:13, fontWeight:700,
            cursor:saving ? "not-allowed" : "pointer", opacity:saving ? 0.7 : 1,
          }}>
            {saving ? "..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ Accordion Row ─────────────────────────────────────────────── */
function FaqRow({ faq, idx, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderRadius:12, border:`1.5px solid ${open ? T.red + "33" : T.border}`,
      background:T.surface, overflow:"hidden",
      boxShadow:open ? `0 4px 20px rgba(0,0,0,.06)` : "0 1px 3px rgba(0,0,0,.03)",
      transition:"border-color .15s, box-shadow .15s",
    }}>
      {/* Question row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display:"flex", alignItems:"center", gap:10,
          padding:"13px 16px", cursor:"pointer",
          userSelect:"none",
        }}
      >
        {/* Number */}
        <span style={{
          width:26, height:26, borderRadius:7, flexShrink:0,
          background:T.surfaceUp, border:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:11, fontWeight:800, color:T.textDim,
        }}>
          {idx + 1}
        </span>

        {/* Text */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
            <CatBadge category={faq.category} />
            {!faq.isActive && (
              <span style={{
                fontSize:10, fontWeight:700, color:T.textDim,
                background:T.surfaceUp, border:`1px solid ${T.border}`,
                padding:"1px 7px", borderRadius:99,
              }}>
                Nofaol
              </span>
            )}
          </div>
          <p style={{
            fontSize:13.5, fontWeight:700, color:T.text, margin:0,
            overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
          }}>
            {faq.question}
          </p>
        </div>

        {/* Actions (stop propagation) */}
        <div style={{ display:"flex", gap:5, flexShrink:0 }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onEdit(faq)}
            title="Tahrirlash"
            style={{
              width:28, height:28, borderRadius:7, flexShrink:0,
              border:`1px solid ${T.border}`, background:T.surfaceUp,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
              color:T.textDim, transition:"all .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.purpleBg; e.currentTarget.style.borderColor = T.purpleBd; e.currentTarget.style.color = T.purple; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.surfaceUp; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
          >
            <LuPencil size={11} />
          </button>
          <button
            onClick={() => onDelete(faq)}
            title="O'chirish"
            style={{
              width:28, height:28, borderRadius:7, flexShrink:0,
              border:`1px solid ${T.border}`, background:T.surfaceUp,
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
              color:T.textDim, transition:"all .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = T.redBorder; e.currentTarget.style.color = T.red; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.surfaceUp; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
          >
            <LuTrash2 size={11} />
          </button>
        </div>

        {/* Chevron */}
        <LuChevronDown
          size={15}
          style={{
            color:T.textDim, flexShrink:0,
            transition:"transform .2s",
            transform:open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {/* Answer */}
      {open && (
        <div style={{
          padding:"14px 16px 16px",
          borderTop:`1px solid ${T.border}`,
          background:T.surfaceUp,
        }}>
          <p style={{
            fontSize:10, fontWeight:700, color:T.textDim,
            textTransform:"uppercase", letterSpacing:"0.6px", margin:"0 0 8px",
          }}>
            Javob
          </p>
          <p style={{
            fontSize:13.5, color:T.textMuted, lineHeight:1.8,
            margin:0, whiteSpace:"pre-wrap",
          }}>
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function AdminFAQ() {
  const queryClient = useQueryClient();
  const [activeTab,   setActiveTab]   = useState("all");
  const [search,      setSearch]      = useState("");
  const [searchInp,   setSearchInp]   = useState("");
  const [showForm,    setShowForm]    = useState(false);
  const [editingFaq,  setEditingFaq]  = useState(null);
  const [deletingFaq, setDeletingFaq] = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [delSaving,   setDelSaving]   = useState(false);
  const debRef = useRef(null);

  /* ── Fetch ── */
  const { data: faqsData, isLoading: loading, refetch: fetchFaqs } = useQuery({
    queryKey:["admin-faqs"],
    queryFn: () => adminFaqsService.getAll(),
    staleTime: 10 * 60 * 1000,
  });
  const faqs = faqsData?.data || [];

  const handleSearch = (val) => {
    setSearchInp(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setSearch(val), 300);
  };

  /* ── Mutations ── */
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await adminFaqsService.create(form);
      toast.success("Yangi FAQ qo'shildi");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey:["admin-faqs"] });
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await adminFaqsService.update(editingFaq._id, form);
      toast.success("FAQ yangilandi");
      setEditingFaq(null);
      queryClient.invalidateQueries({ queryKey:["admin-faqs"] });
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDelSaving(true);
    try {
      await adminFaqsService.remove(deletingFaq._id);
      toast.success("FAQ o'chirildi");
      setDeletingFaq(null);
      queryClient.invalidateQueries({ queryKey:["admin-faqs"] });
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setDelSaving(false); }
  };

  /* ── Counts ── */
  const counts = {
    all: faqs.length,
    ...Object.fromEntries(
      CATS.filter(c => c.value !== "all")
        .map(c => [c.value, faqs.filter(f => f.category === c.value).length])
    ),
  };
  const activeCount = faqs.filter(f => f.isActive).length;

  const filtered = faqs
    .filter(f => activeTab === "all" || f.category === activeTab)
    .filter(f => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return f.question?.toLowerCase().includes(q) || f.answer?.toLowerCase().includes(q);
    });

  /* ════════ RENDER ════════ */
  return (
    <>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        .flist::-webkit-scrollbar { width:5px }
        .flist::-webkit-scrollbar-track { background:transparent }
        .flist::-webkit-scrollbar-thumb { background:#E2E8F0; border-radius:99px }
        .flist::-webkit-scrollbar-thumb:hover { background:#CBD5E1 }
      `}</style>

      <div style={{
        fontFamily:"'Manrope',sans-serif",
        display:"flex", flexDirection:"column", gap:18,
        height:"calc(100vh - 130px)", overflow:"hidden",
      }}>

        {/* ─── Header ─── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:T.text, margin:"0 0 3px", letterSpacing:"-0.3px" }}>
              FAQ
            </h1>
            <p style={{ fontSize:12.5, color:T.textDim, margin:0 }}>Ko'p so'raladigan savollar va javoblar</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button
              onClick={fetchFaqs}
              disabled={loading}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"9px 14px", border:`1.5px solid ${T.border}`,
                borderRadius:10, background:T.surface, color:T.textMuted,
                fontSize:12.5, fontWeight:600, cursor:"pointer", opacity:loading ? 0.6 : 1,
              }}
            >
              <LuRefreshCw size={13} style={loading ? { animation:"spin .8s linear infinite" } : {}} />
              Yangilash
            </button>
            <button
              onClick={() => setShowForm(true)}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"9px 16px", border:"none", borderRadius:10,
                background:`linear-gradient(135deg,${T.red},#B91C1C)`,
                color:"#fff", fontSize:12.5, fontWeight:700, cursor:"pointer",
                boxShadow:`0 3px 10px ${T.red}44`,
              }}
            >
              <LuPlus size={14} /> Yangi FAQ
            </button>
          </div>
        </div>

        {/* ─── Body: Sidebar + List ─── */}
        <div style={{ flex:1, display:"flex", gap:14, minHeight:0, overflow:"hidden" }}>

          {/* ══ LEFT: Category Sidebar ══ */}
          <div style={{
            width:220, flexShrink:0,
            background:T.surface, borderRadius:16, border:`1px solid ${T.border}`,
            display:"flex", flexDirection:"column", overflow:"hidden",
            boxShadow:"0 1px 4px rgba(0,0,0,.04)",
          }}>
            {/* Stats mini */}
            <div style={{
              padding:"16px 16px 12px",
              borderBottom:`1px solid ${T.border}`,
              flexShrink:0,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ textAlign:"center", flex:1 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:T.text, lineHeight:1 }}>
                    {faqs.length}
                  </div>
                  <div style={{ fontSize:10.5, color:T.textDim, fontWeight:600, marginTop:2 }}>Jami</div>
                </div>
                <div style={{ width:1, background:T.border }} />
                <div style={{ textAlign:"center", flex:1 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:T.success, lineHeight:1 }}>
                    {activeCount}
                  </div>
                  <div style={{ fontSize:10.5, color:T.textDim, fontWeight:600, marginTop:2 }}>Faol</div>
                </div>
              </div>
            </div>

            {/* Category list */}
            <div className="flist" style={{ flex:1, overflowY:"auto", padding:"8px" }}>
              <p style={{
                fontSize:10, fontWeight:700, color:T.textDim,
                textTransform:"uppercase", letterSpacing:"0.6px",
                padding:"6px 8px 4px", margin:0,
              }}>
                Kategoriyalar
              </p>
              {CATS.map(c => {
                const active = activeTab === c.value;
                const Icon   = c.icon;
                const count  = c.value === "all" ? counts.all : (counts[c.value] || 0);
                return (
                  <button
                    key={c.value}
                    onClick={() => setActiveTab(c.value)}
                    style={{
                      display:"flex", alignItems:"center", width:"100%",
                      padding:"9px 10px", borderRadius:9, gap:9, marginBottom:2,
                      border:`1.5px solid ${active ? c.color + "44" : "transparent"}`,
                      background:active ? c.bg : "transparent",
                      color:active ? c.color : T.textMuted,
                      fontSize:12.5, fontWeight:active ? 700 : 500,
                      cursor:"pointer", transition:"all .12s", textAlign:"left",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.surfaceUp; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width:28, height:28, borderRadius:7, flexShrink:0,
                      background:active ? c.color + "1a" : T.surfaceUp,
                      border:`1px solid ${active ? c.color + "33" : T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <Icon size={13} color={active ? c.color : T.textDim} />
                    </div>
                    <span style={{ flex:1 }}>{c.label}</span>
                    <span style={{
                      minWidth:20, height:20, borderRadius:6, padding:"0 5px",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      background:active ? c.color + "22" : T.surfaceUp,
                      border:`1px solid ${active ? c.color + "33" : T.border}`,
                      fontSize:11, fontWeight:800, color:active ? c.color : T.textDim,
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══ RIGHT: FAQ List ══ */}
          <div style={{
            flex:1, minWidth:0,
            background:T.surface, borderRadius:16, border:`1px solid ${T.border}`,
            display:"flex", flexDirection:"column", overflow:"hidden",
            boxShadow:"0 1px 4px rgba(0,0,0,.04)",
          }}>
            {/* Search + count */}
            <div style={{
              padding:"12px 16px", borderBottom:`1px solid ${T.border}`,
              display:"flex", gap:10, alignItems:"center", flexShrink:0,
            }}>
              <div style={{ position:"relative", flex:1 }}>
                <LuSearch size={13} style={{
                  position:"absolute", left:11, top:"50%", transform:"translateY(-50%)",
                  color:T.textDim, pointerEvents:"none",
                }} />
                <input
                  value={searchInp}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Savol yoki javob bo'yicha qidirish..."
                  style={{
                    width:"100%", padding:"8px 11px 8px 32px",
                    border:`1.5px solid ${T.border}`, borderRadius:9,
                    fontSize:12.5, outline:"none", boxSizing:"border-box",
                    color:T.text, background:T.surfaceUp, fontFamily:"inherit",
                  }}
                  onFocus={e  => e.target.style.borderColor = T.red + "88"}
                  onBlur={e   => e.target.style.borderColor = T.border}
                />
                {searchInp && (
                  <button
                    onClick={() => { setSearchInp(""); setSearch(""); }}
                    style={{
                      position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                      background:"none", border:"none", cursor:"pointer", color:T.textDim, display:"flex",
                    }}
                  >
                    <LuX size={12} />
                  </button>
                )}
              </div>
              <span style={{
                fontSize:11.5, color:T.textDim, fontWeight:600, flexShrink:0,
                background:T.surfaceUp, padding:"5px 11px", borderRadius:8,
                border:`1px solid ${T.border}`,
              }}>
                {filtered.length} ta
              </span>
            </div>

            {/* List */}
            <div className="flist" style={{ flex:1, overflowY:"auto", padding:"10px" }}>
              {loading ? (
                Array.from({ length:6 }).map((_, i) => (
                  <div key={i} style={{
                    height:58, borderRadius:10, marginBottom:6,
                    background:T.border, animation:"pulse 1.5s ease-in-out infinite",
                    animationDelay:`${i * 0.1}s`,
                  }} />
                ))
              ) : filtered.length === 0 ? (
                <div style={{
                  padding:"60px 20px", textAlign:"center",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:12,
                }}>
                  <div style={{
                    width:56, height:56, borderRadius:16,
                    background:T.surfaceUp, border:`1.5px solid ${T.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <LuMessageCircle size={24} style={{ color:T.textDim }} />
                  </div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:T.textMuted, margin:"0 0 4px" }}>
                      FAQ topilmadi
                    </p>
                    <p style={{ fontSize:12.5, color:T.textDim, margin:"0 0 16px" }}>
                      {search ? "Qidiruv shartlarini o'zgartiring" : "Yangi FAQ qo'shing"}
                    </p>
                    {!search && (
                      <button
                        onClick={() => setShowForm(true)}
                        style={{
                          display:"inline-flex", alignItems:"center", gap:6,
                          padding:"9px 18px", borderRadius:10, border:"none",
                          background:`linear-gradient(135deg,${T.red},#B91C1C)`,
                          color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
                        }}
                      >
                        <LuPlus size={13} /> Yangi FAQ qo'shish
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {filtered.map((faq, idx) => (
                    <FaqRow
                      key={faq._id}
                      faq={faq}
                      idx={idx}
                      onEdit={setEditingFaq}
                      onDelete={setDeletingFaq}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}
