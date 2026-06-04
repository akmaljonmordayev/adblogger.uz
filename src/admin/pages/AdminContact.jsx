import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LuMail, LuMessageSquare, LuCircleCheck, LuTrash2,
  LuSearch, LuRefreshCw, LuSend, LuX, LuInbox,
  LuPhone, LuTriangleAlert, LuLoader, LuReply,
  LuStickyNote, LuCalendar, LuEye, LuFilter,
} from "react-icons/lu";
import api from "../../services/api";
import { toast } from "../../components/ui/toast";

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

/* ── Status / Role config ──────────────────────────────────────────── */
const STATUS = {
  new:       { label:"Yangi",     dot:T.red,     bg:T.redLight,  border:T.redBorder, color:T.red     },
  read:      { label:"Ko'rildi",  dot:T.textDim, bg:T.surfaceUp, border:T.border,    color:T.textDim },
  responded: { label:"Javob b.",  dot:T.success, bg:T.successBg, border:T.successBd, color:T.success },
};

const FILTERS = [
  { value:"all",       label:"Barchasi", color:T.purple, bg:T.purpleBg, border:T.purpleBd },
  { value:"new",       label:"Yangi",    color:T.red,    bg:T.redLight, border:T.redBorder },
  { value:"read",      label:"Ko'rildi", color:T.textDim,bg:T.surfaceUp,border:T.border    },
  { value:"responded", label:"Javob b.", color:T.success,bg:T.successBg,border:T.successBd },
];

const ROLE_META = {
  blogger:  { label:"Blogger", color:T.red,    bg:T.redLight, border:T.redBorder },
  business: { label:"Biznes",  color:T.warn,   bg:T.warnBg,   border:T.warnBd   },
  user:     { label:"User",    color:T.info,   bg:T.infoBg,   border:T.infoBd   },
};

/* ── Helpers ───────────────────────────────────────────────────────── */
const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";

const avaColor = (name = "") => {
  const colors = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
};

const fmtShort = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso);
  const h = Math.floor(diff / 3_600_000);
  if (h < 1)  return "hozirgina";
  if (h < 24) return `${h}s oldin`;
  const d = Math.floor(diff / 86_400_000);
  if (d < 7)  return `${d}k oldin`;
  return new Date(iso).toLocaleDateString("uz-UZ", { day:"2-digit", month:"short" });
};

const fmtFull = (iso) =>
  iso ? new Date(iso).toLocaleString("uz-UZ", {
    day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit",
  }) : "—";

/* ── Avatar ────────────────────────────────────────────────────────── */
function Avatar({ name, size = 38 }) {
  const c = avaColor(name);
  return (
    <div style={{
      width:size, height:size, borderRadius:size * 0.28, flexShrink:0,
      background:`${c}1a`, border:`1.5px solid ${c}33`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size * 0.32, fontWeight:800, color:c, letterSpacing:"-0.5px",
    }}>
      {getInitials(name)}
    </div>
  );
}

/* ── StatusBadge ───────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"2px 9px", borderRadius:99, fontSize:11, fontWeight:700,
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot }} />
      {s.label}
    </span>
  );
}

/* ── RoleBadge ─────────────────────────────────────────────────────── */
function RoleBadge({ role }) {
  const r = ROLE_META[role];
  if (!r) return null;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      padding:"2px 8px", borderRadius:99, fontSize:10.5, fontWeight:700,
      background:r.bg, color:r.color, border:`1px solid ${r.border}`,
    }}>
      {r.label}
    </span>
  );
}

/* ── Reply Modal ───────────────────────────────────────────────────── */
function ReplyModal({ contact, onClose, onReplied }) {
  const [text, setText]       = useState("");
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
      style={{
        position:"fixed", inset:0,
        background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)",
        zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      }}
    >
      <div style={{
        background:T.surface, borderRadius:20, width:"100%", maxWidth:520,
        boxShadow:"0 24px 80px rgba(0,0,0,.22)", border:`1px solid ${T.border}`,
        overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{
          padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:T.surfaceUp,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:32, height:32, borderRadius:9, flexShrink:0,
              background:T.redLight, border:`1px solid ${T.redBorder}`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <LuReply size={14} style={{ color:T.red }} />
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:800, color:T.text, margin:0 }}>Javob yozish</p>
              <p style={{ fontSize:11.5, color:T.textDim, margin:0 }}>{contact.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:30, height:30, border:`1px solid ${T.border}`, borderRadius:8,
            background:T.surface, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", color:T.textMuted,
          }}>
            <LuX size={14} />
          </button>
        </div>

        <div style={{ padding:"20px 22px 22px" }}>
          {/* Original */}
          <div style={{
            padding:"10px 13px", borderRadius:10,
            background:T.surfaceUp, border:`1px solid ${T.border}`, marginBottom:16,
          }}>
            <p style={{ fontSize:10, fontWeight:700, color:T.textDim, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 5px" }}>
              Asl xabar — {contact.name}
            </p>
            <p style={{
              fontSize:12.5, color:T.textMuted, lineHeight:1.6, margin:0,
              display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
            }}>
              {contact.message}
            </p>
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            placeholder="Javob yozing..."
            autoFocus
            style={{
              width:"100%", padding:"11px 13px",
              border:`1.5px solid ${T.border}`, borderRadius:10,
              fontSize:13, outline:"none", resize:"vertical",
              fontFamily:"inherit", color:T.text, background:T.surfaceUp,
              boxSizing:"border-box", marginBottom:6, lineHeight:1.65,
            }}
            onFocus={e => e.target.style.borderColor = T.red}
            onBlur={e  => e.target.style.borderColor = T.border}
          />
          <p style={{ fontSize:11, color:T.textDim, margin:"0 0 16px" }}>
            {contact.userId
              ? "Foydalanuvchiga bildirishnoma + email orqali yuboriladi"
              : "Faqat email orqali yuboriladi"}
          </p>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onClose} style={{
              flex:1, padding:"10px", border:`1.5px solid ${T.border}`, borderRadius:10,
              background:T.surface, fontSize:13, fontWeight:600, cursor:"pointer", color:T.textMuted,
            }}>
              Bekor
            </button>
            <button
              onClick={send}
              disabled={!text.trim() || loading}
              style={{
                flex:2, padding:"10px",
                background:`linear-gradient(135deg,${T.red},#B91C1C)`,
                color:"#fff", border:"none", borderRadius:10,
                fontSize:13, fontWeight:700,
                cursor:(!text.trim() || loading) ? "not-allowed" : "pointer",
                opacity:(!text.trim() || loading) ? 0.65 : 1,
                display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              }}
            >
              {loading
                ? <LuLoader size={13} style={{ animation:"spin .8s linear infinite" }} />
                : <LuSend size={13} />
              }
              {loading ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm ────────────────────────────────────────────────── */
function DeleteConfirm({ contact, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div style={{
        background:T.surface, borderRadius:18, padding:"30px 26px",
        maxWidth:380, width:"100%", textAlign:"center",
        boxShadow:"0 24px 64px rgba(0,0,0,.2)", border:`1px solid ${T.border}`,
      }}>
        <div style={{
          width:52, height:52, borderRadius:"50%", background:T.redLight,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 14px", border:`1.5px solid ${T.redBorder}`,
        }}>
          <LuTriangleAlert size={22} style={{ color:T.red }} />
        </div>
        <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 8px" }}>
          O'chirishni tasdiqlang
        </h3>
        {contact && (
          <p style={{ fontSize:13, color:T.textMuted, margin:"0 0 20px", lineHeight:1.6 }}>
            <strong style={{ color:T.text }}>{contact.name}</strong> xabarini o'chirasizmi?
            Bu amalni qaytarib bo'lmaydi.
          </p>
        )}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{
            flex:1, padding:"10px", border:`1.5px solid ${T.border}`, borderRadius:10,
            background:T.surface, fontSize:13, fontWeight:600, cursor:"pointer", color:T.textMuted,
          }}>
            Bekor
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex:1, padding:"10px",
            background:`linear-gradient(135deg,${T.redMid},#B91C1C)`,
            color:"#fff", border:"none", borderRadius:10,
            fontSize:13, fontWeight:700,
            cursor:loading ? "not-allowed" : "pointer", opacity:loading ? 0.7 : 1,
          }}>
            {loading ? "..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function AdminContact() {
  const queryClient = useQueryClient();
  const [search,       setSearch]       = useState("");
  const [searchInp,    setSearchInp]    = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected,     setSelected]     = useState(null);
  const [replyTarget,  setReplyTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [delLoading,   setDelLoading]   = useState(false);
  const debRef = useRef(null);

  /* ── Fetch ── */
  const { data: contacts = [], isLoading: loading, refetch: fetchContacts } = useQuery({
    queryKey: ["admin-contacts", statusFilter],
    queryFn: async () => {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await api.get(`/admin/contacts${params}`);
      return res.data.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  /* ── Debounced search ── */
  const handleSearch = (val) => {
    setSearchInp(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setSearch(val), 300);
  };

  /* ── Open (marks as read) ── */
  const openContact = async (c) => {
    setSelected(c);
    if (c.status === "new") {
      try {
        const res = await api.get(`/admin/contacts/${c._id}`);
        const updated = res.data.data;
        queryClient.setQueryData(["admin-contacts", statusFilter], prev =>
          prev?.map(x => x._id === c._id ? updated : x)
        );
        setSelected(updated);
      } catch { /* ignore */ }
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await api.delete(`/admin/contacts/${deleteTarget._id}`);
      if (selected?._id === deleteTarget._id) setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Xabar o'chirildi");
      setDeleteTarget(null);
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDelLoading(false);
    }
  };

  /* ── Derived ── */
  const stats = {
    all:       contacts.length,
    new:       contacts.filter(c => c.status === "new").length,
    read:      contacts.filter(c => c.status === "read").length,
    responded: contacts.filter(c => c.status === "responded").length,
  };

  const filtered = contacts.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.subject?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q)
    );
  });

  /* ══════════ RENDER ══════════ */
  return (
    <>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        .clist::-webkit-scrollbar { width:5px }
        .clist::-webkit-scrollbar-track { background:transparent }
        .clist::-webkit-scrollbar-thumb { background:#E2E8F0; border-radius:99px }
        .clist::-webkit-scrollbar-thumb:hover { background:#CBD5E1 }
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
              Xabarlar
            </h1>
            <p style={{ fontSize:12.5, color:T.textDim, margin:0 }}>
              Foydalanuvchilardan kelgan murojaatlar
            </p>
          </div>
          <button
            onClick={fetchContacts}
            disabled={loading}
            style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"9px 16px", border:`1.5px solid ${T.border}`,
              borderRadius:10, background:T.surface, color:T.textMuted,
              fontSize:12.5, fontWeight:600, cursor:"pointer", opacity:loading ? 0.6 : 1,
            }}
          >
            <LuRefreshCw size={13} style={loading ? { animation:"spin .8s linear infinite" } : {}} />
            Yangilash
          </button>
        </div>

        {/* ─── Filter Pills ─── */}
        <div style={{ display:"flex", gap:10, flexShrink:0, flexWrap:"wrap" }}>
          {FILTERS.map(f => {
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"8px 16px", borderRadius:99,
                  border:`1.5px solid ${active ? f.color + "44" : T.border}`,
                  background:active ? f.bg : T.surface,
                  color:active ? f.color : T.textMuted,
                  fontSize:12.5, fontWeight:700, cursor:"pointer",
                  transition:"all .14s",
                }}
              >
                <span style={{
                  minWidth:20, height:20, borderRadius:99, display:"flex",
                  alignItems:"center", justifyContent:"center",
                  background:active ? f.color + "22" : T.surfaceUp,
                  fontSize:11, fontWeight:800, color:active ? f.color : T.textDim,
                  padding:"0 5px",
                }}>
                  {stats[f.value]}
                </span>
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ─── Body: List + Detail ─── */}
        <div style={{ flex:1, display:"flex", gap:14, minHeight:0, overflow:"hidden" }}>

          {/* ══ LEFT: Message List ══ */}
          <div style={{
            width:340, flexShrink:0,
            background:T.surface, borderRadius:16, border:`1px solid ${T.border}`,
            display:"flex", flexDirection:"column", overflow:"hidden",
            boxShadow:"0 1px 4px rgba(0,0,0,.04)",
          }}>
            {/* Search */}
            <div style={{ padding:"12px 14px", borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
              <div style={{ position:"relative" }}>
                <LuSearch size={13} style={{
                  position:"absolute", left:11, top:"50%", transform:"translateY(-50%)",
                  color:T.textDim, pointerEvents:"none",
                }} />
                <input
                  value={searchInp}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Qidirish..."
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
                      background:"none", border:"none", cursor:"pointer", color:T.textDim,
                      display:"flex", padding:2,
                    }}
                  >
                    <LuX size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Count row */}
            <div style={{
              padding:"8px 14px", borderBottom:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0,
            }}>
              <span style={{ fontSize:11.5, color:T.textDim, fontWeight:600 }}>
                {filtered.length} xabar
              </span>
              {stats.new > 0 && (
                <span style={{
                  fontSize:11, fontWeight:700, color:T.red,
                  background:T.redLight, padding:"2px 8px", borderRadius:99,
                  border:`1px solid ${T.redBorder}`,
                }}>
                  {stats.new} yangi
                </span>
              )}
            </div>

            {/* List */}
            <div className="clist" style={{ flex:1, overflowY:"auto" }}>
              {loading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} style={{
                    margin:"8px 10px", height:68, borderRadius:10,
                    background:T.border, animation:"pulse 1.5s ease-in-out infinite",
                    animationDelay:`${i * 0.1}s`,
                  }} />
                ))
              ) : filtered.length === 0 ? (
                <div style={{
                  padding:"48px 20px", textAlign:"center",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:10,
                }}>
                  <LuInbox size={32} style={{ color:T.textDim, opacity:0.5 }} />
                  <div>
                    <p style={{ fontSize:13.5, fontWeight:700, color:T.textMuted, margin:"0 0 3px" }}>
                      Xabar topilmadi
                    </p>
                    <p style={{ fontSize:12, color:T.textDim, margin:0 }}>
                      {search ? "Qidiruvni o'zgartiring" : "Hali xabar yo'q"}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ padding:"6px 8px", display:"flex", flexDirection:"column", gap:2 }}>
                  {filtered.map(c => {
                    const isActive = selected?._id === c._id;
                    const isNew    = c.status === "new";
                    return (
                      <div
                        key={c._id}
                        onClick={() => openContact(c)}
                        style={{
                          padding:"10px 12px", borderRadius:10, cursor:"pointer",
                          border:`1.5px solid ${isActive ? T.red + "55" : "transparent"}`,
                          background:isActive ? T.redLight : "transparent",
                          transition:"all .12s", position:"relative",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.surfaceUp; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                          <Avatar name={c.name} size={34} />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:2 }}>
                              <span style={{
                                fontSize:13, fontWeight:isNew ? 800 : 600, color:T.text,
                                overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", maxWidth:"68%",
                              }}>
                                {c.name}
                              </span>
                              <span style={{ fontSize:10.5, color:T.textDim, flexShrink:0 }}>
                                {fmtShort(c.createdAt)}
                              </span>
                            </div>
                            <p style={{
                              fontSize:12, color:isNew ? T.textMuted : T.textDim,
                              fontWeight:isNew ? 600 : 400,
                              margin:"0 0 5px", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
                            }}>
                              {c.subject || c.message?.slice(0, 50)}
                            </p>
                            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                              <StatusBadge status={c.status} />
                              {c.role && ROLE_META[c.role] && <RoleBadge role={c.role} />}
                            </div>
                          </div>
                        </div>
                        {isNew && (
                          <span style={{
                            position:"absolute", top:10, right:10,
                            width:7, height:7, borderRadius:"50%", background:T.red,
                            border:`2px solid ${isActive ? T.redLight : T.surface}`,
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT: Detail ══ */}
          <div style={{
            flex:1, minWidth:0,
            background:T.surface, borderRadius:16, border:`1px solid ${T.border}`,
            display:"flex", flexDirection:"column", overflow:"hidden",
            boxShadow:"0 1px 4px rgba(0,0,0,.04)",
          }}>
            {!selected ? (
              /* Empty state */
              <div style={{
                flex:1, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", gap:14,
              }}>
                <div style={{
                  width:64, height:64, borderRadius:18,
                  background:T.surfaceUp, border:`1.5px solid ${T.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <LuMessageSquare size={28} style={{ color:T.textDim }} />
                </div>
                <div style={{ textAlign:"center" }}>
                  <p style={{ fontSize:15, fontWeight:700, color:T.textMuted, margin:"0 0 5px" }}>
                    Xabar tanlanmagan
                  </p>
                  <p style={{ fontSize:12.5, color:T.textDim, margin:0 }}>
                    Chap paneldan xabarni bosing
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Detail Header */}
                <div style={{
                  padding:"18px 22px", borderBottom:`1px solid ${T.border}`,
                  flexShrink:0, background:T.surfaceUp,
                }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                    <div style={{ display:"flex", gap:14, alignItems:"center", minWidth:0 }}>
                      <Avatar name={selected.name} size={44} />
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontSize:16, fontWeight:800, color:T.text, margin:"0 0 4px" }}>
                          {selected.name}
                        </p>
                        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:T.textDim }}>
                            <LuMail size={11} /> {selected.email}
                          </span>
                          {selected.phone && (
                            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:T.textDim }}>
                              <LuPhone size={11} /> {selected.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:7, alignItems:"center", flexShrink:0 }}>
                      {selected.role && ROLE_META[selected.role] && <RoleBadge role={selected.role} />}
                      <StatusBadge status={selected.status} />
                    </div>
                  </div>
                </div>

                {/* Detail Body */}
                <div className="clist" style={{ flex:1, overflowY:"auto", padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>

                  {/* Subject + date */}
                  <div>
                    <p style={{ fontSize:17, fontWeight:800, color:T.text, margin:"0 0 6px", lineHeight:1.3 }}>
                      {selected.subject}
                    </p>
                    <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:T.textDim }}>
                      <LuCalendar size={11} /> {fmtFull(selected.createdAt)}
                    </span>
                  </div>

                  {/* Message */}
                  <div style={{
                    padding:"16px 18px", background:T.surfaceUp,
                    border:`1px solid ${T.border}`, borderRadius:12,
                  }}>
                    <p style={{
                      fontSize:10, fontWeight:700, color:T.textDim,
                      textTransform:"uppercase", letterSpacing:"0.6px", margin:"0 0 10px",
                    }}>
                      Xabar
                    </p>
                    <p style={{ fontSize:13.5, color:T.textMuted, lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>
                      {selected.message}
                    </p>
                  </div>

                  {/* Existing reply */}
                  {selected.reply && (
                    <div style={{
                      padding:"14px 16px",
                      background:T.successBg, border:`1px solid ${T.successBd}`, borderRadius:12,
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        <LuCircleCheck size={13} style={{ color:T.success }} />
                        <span style={{
                          fontSize:10.5, fontWeight:700, color:T.success,
                          textTransform:"uppercase", letterSpacing:"0.4px",
                        }}>
                          Yuborilgan javob
                        </span>
                        {selected.repliedAt && (
                          <span style={{ fontSize:10.5, color:T.success, marginLeft:"auto", opacity:0.7 }}>
                            {fmtFull(selected.repliedAt)}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize:13, color:"#14532D", lineHeight:1.75, margin:0, whiteSpace:"pre-wrap" }}>
                        {selected.reply}
                      </p>
                    </div>
                  )}

                  {/* Admin note */}
                  {selected.adminNote && (
                    <div style={{
                      padding:"12px 14px",
                      background:T.warnBg, border:`1px solid ${T.warnBd}`, borderRadius:12,
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                        <LuStickyNote size={12} style={{ color:T.warn }} />
                        <span style={{ fontSize:10.5, fontWeight:700, color:T.warn, textTransform:"uppercase", letterSpacing:"0.4px" }}>
                          Admin eslatma
                        </span>
                      </div>
                      <p style={{ fontSize:13, color:"#78350F", margin:0 }}>
                        {selected.adminNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div style={{
                  padding:"14px 22px", borderTop:`1px solid ${T.border}`,
                  flexShrink:0, display:"flex", gap:10, background:T.surfaceUp,
                }}>
                  <button
                    onClick={() => setReplyTarget(selected)}
                    style={{
                      display:"flex", alignItems:"center", gap:7,
                      padding:"9px 20px",
                      background:`linear-gradient(135deg,${T.red},#B91C1C)`,
                      color:"#fff", border:"none", borderRadius:10,
                      fontSize:13, fontWeight:700, cursor:"pointer",
                      boxShadow:`0 2px 8px ${T.red}44`,
                    }}
                  >
                    <LuSend size={13} />
                    {selected.reply ? "Yana javob" : "Javob yozish"}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(selected)}
                    style={{
                      display:"flex", alignItems:"center", gap:7,
                      padding:"9px 16px",
                      border:`1.5px solid ${T.border}`, borderRadius:10,
                      background:T.surface, color:T.textMuted,
                      fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .12s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = T.redLight;
                      e.currentTarget.style.borderColor = T.redBorder;
                      e.currentTarget.style.color = T.red;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = T.surface;
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.color = T.textMuted;
                    }}
                  >
                    <LuTrash2 size={13} /> O'chirish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {replyTarget && (
        <ReplyModal
          contact={replyTarget}
          onClose={() => setReplyTarget(null)}
          onReplied={() => queryClient.invalidateQueries({ queryKey: ["admin-contacts"] })}
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
    </>
  );
}
