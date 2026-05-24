import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  LuBriefcase, LuPlus, LuPencil, LuTrash2, LuToggleLeft, LuToggleRight,
  LuUsers, LuSearch, LuX, LuChevronRight, LuMapPin, LuClock,
  LuRefreshCw, LuCircleCheck, LuLoader,
} from "react-icons/lu";
import { adminCareersService } from "../../services/adminService";
import { toast } from "../../components/ui/toast";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  red:"#C62828", redMid:"#E53935", redLight:"#FFEBEE", redBorder:"#FFCDD2",
  bg:"#F1F5F9", surface:"#FFFFFF", surfaceUp:"#F8FAFC", border:"#E2E8F0",
  text:"#0F172A", textMuted:"#475569", textDim:"#94A3B8",
  success:"#16A34A", successBg:"#F0FDF4", successBd:"#BBF7D0",
  warn:"#D97706", warnBg:"#FFFBEB", warnBd:"#FDE68A",
  info:"#0284C7", infoBg:"#F0F9FF", infoBd:"#BAE6FD",
  indigo:"#4F46E5", indigoBg:"#EEF2FF", indigoBd:"#C7D2FE",
};

/* ── Status config ──────────────────────────────────────────────────────────── */
const ST = {
  new:       { label:"Yangi",              bg:T.indigoBg,  tc:"#3730A3",  dot:"#6366F1",  bd:T.indigoBd },
  reviewing: { label:"Ko'rib chiqilmoqda", bg:T.warnBg,    tc:"#92400E",  dot:T.warn,     bd:T.warnBd   },
  accepted:  { label:"Qabul qilindi",      bg:T.successBg, tc:"#14532D",  dot:T.success,  bd:T.successBd},
  rejected:  { label:"Rad etildi",         bg:T.redLight,  tc:T.red,      dot:T.redMid,   bd:T.redBorder},
};

/* ── Job type labels ────────────────────────────────────────────────────────── */
const TYPE_LABEL = {
  "full-time": "To'liq stavka",
  "part-time": "Yarim stavka",
  remote:      "Masofaviy",
  contract:    "Shartnoma",
};
const TYPE_COLORS = {
  "full-time": { bg:"#F0FDF4", tc:"#166534", bd:"#BBF7D0" },
  "part-time": { bg:"#FFFBEB", tc:"#92400E", bd:"#FDE68A" },
  remote:      { bg:"#F0F9FF", tc:"#075985", bd:"#BAE6FD" },
  contract:    { bg:"#F5F3FF", tc:"#5B21B6", bd:"#DDD6FE" },
};

/* ── Avatar ─────────────────────────────────────────────────────────────────── */
const PALETTE = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
const ini = n => (n||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const avaColor = n => PALETTE[(n||"A").charCodeAt(0) % PALETTE.length];
function Ava({ name, size=40, fz=13 }) {
  const col = avaColor(name);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:col+"1C", border:`2px solid ${col}44`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:fz, fontWeight:800, color:col,
    }}>{ini(name)}</div>
  );
}

/* ── StatusPill ─────────────────────────────────────────────────────────────── */
function StatusPill({ status }) {
  const c = ST[status] || ST.new;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:c.bg, color:c.tc, border:`1px solid ${c.bd}`,
      padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap",
    }}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {c.label}
    </span>
  );
}

/* ── Portal modal wrapper ────────────────────────────────────────────────────── */
function Modal({ onClose, maxWidth=540, children }) {
  useEffect(() => {
    const esc = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, zIndex:99999,
        background:"rgba(15,23,42,0.52)", backdropFilter:"blur(4px)",
        WebkitBackdropFilter:"blur(4px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:24,
      }}
    >
      <div style={{
        background:T.surface, borderRadius:20, width:"100%",
        maxWidth, maxHeight:"90vh", display:"flex", flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.24)", overflow:"hidden",
      }}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function MHead({ title, sub, onClose }) {
  return (
    <div style={{
      padding:"20px 24px 16px", borderBottom:`1px solid ${T.border}`,
      display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexShrink:0,
    }}>
      <div>
        <div style={{fontSize:17, fontWeight:800, color:T.text, marginBottom:sub?3:0}}>{title}</div>
        {sub && <div style={{fontSize:12, color:T.textDim}}>{sub}</div>}
      </div>
      <button onClick={onClose} style={{
        width:32, height:32, borderRadius:10, border:`1.5px solid ${T.border}`,
        background:T.surfaceUp, cursor:"pointer", display:"flex",
        alignItems:"center", justifyContent:"center", color:T.textDim, flexShrink:0,
      }}><LuX size={14}/></button>
    </div>
  );
}

/* ── Field helper ────────────────────────────────────────────────────────────── */
const inputStyle = (focused) => ({
  width:"100%", padding:"10px 12px", borderRadius:10, outline:"none",
  border:`1.5px solid ${focused ? T.indigo : T.border}`,
  boxShadow: focused ? `0 0 0 3px ${T.indigo}18` : "none",
  fontSize:13, color:T.text, background:T.surface, fontFamily:"inherit",
  transition:"all 0.15s",
});
function Field({ label, children }) {
  return (
    <div>
      <label style={{display:"block", fontSize:11, fontWeight:700, color:T.textMuted,
        textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5}}>{label}</label>
      {children}
    </div>
  );
}
function Input({ label, ...props }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label}>
      <input {...props} style={inputStyle(f)} onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
    </Field>
  );
}
function Textarea({ label, rows=3, ...props }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label}>
      <textarea {...props} rows={rows} style={{...inputStyle(f), resize:"vertical"}}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
    </Field>
  );
}
function Select({ label, options, ...props }) {
  const [f, setF] = useState(false);
  return (
    <Field label={label}>
      <select {...props} style={{...inputStyle(f), appearance:"none", cursor:"pointer"}}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

/* ── Vacancy form modal ────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  title:"", department:"", location:"Toshkent, O'zbekiston",
  type:"full-time", description:"", requirements:[], benefits:[],
  salaryMin:"", salaryMax:"", currency:"USD", deadline:"", isActive:true,
};

function VacancyFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ? {
    ...EMPTY_FORM,
    ...initial,
    salaryMin: initial.salaryRange?.min ?? "",
    salaryMax: initial.salaryRange?.max ?? "",
    currency:  initial.salaryRange?.currency ?? "USD",
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [reqInput,  setReqInput]  = useState("");
  const [benInput,  setBenInput]  = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addItem = (key, input, setInput) => {
    const val = input.trim();
    if (!val) return;
    setForm(p => ({ ...p, [key]: [...p[key], val] }));
    setInput("");
  };
  const removeItem = (key, idx) =>
    setForm(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.department.trim() || !form.description.trim()) {
      toast.error("Majburiy maydonlarni to'ldiring");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title, department: form.department,
        location: form.location, type: form.type,
        description: form.description,
        requirements: form.requirements, benefits: form.benefits,
        salaryRange: {
          min: form.salaryMin ? Number(form.salaryMin) : undefined,
          max: form.salaryMax ? Number(form.salaryMax) : undefined,
          currency: form.currency,
        },
        deadline: form.deadline || undefined,
        isActive: form.isActive,
      };
      await onSave(payload);
      onClose();
    } catch {
      // error toasted upstream
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} maxWidth={620}>
      <MHead
        title={initial ? "Vakansiyani tahrirlash" : "Yangi vakansiya"}
        sub="Ish o'rinlari ma'lumotlarini kiriting"
        onClose={onClose}
      />
      <div style={{overflowY:"auto", flex:1, padding:"20px 24px 28px", display:"flex", flexDirection:"column", gap:14}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
          <Input label="Lavozim *" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Frontend Developer"/>
          <Input label="Bo'lim *" value={form.department} onChange={e=>set("department",e.target.value)} placeholder="IT bo'limi"/>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
          <Input label="Manzil" value={form.location} onChange={e=>set("location",e.target.value)}/>
          <Select label="Ish turi" value={form.type} onChange={e=>set("type",e.target.value)} options={[
            {value:"full-time",label:"To'liq stavka"},
            {value:"part-time",label:"Yarim stavka"},
            {value:"remote",label:"Masofaviy"},
            {value:"contract",label:"Shartnoma"},
          ]}/>
        </div>
        <Textarea label="Tavsif *" rows={4} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Vakansiya haqida batafsil..."/>

        {/* Requirements */}
        <Field label="Talablar">
          <div style={{display:"flex", gap:8, marginBottom:8}}>
            <input value={reqInput} onChange={e=>setReqInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"){e.preventDefault();addItem("requirements",reqInput,setReqInput);}}}
              placeholder="Talabni kiriting va Enter bosing"
              style={{...inputStyle(false), flex:1}}/>
            <button onClick={()=>addItem("requirements",reqInput,setReqInput)} style={{
              padding:"10px 14px", borderRadius:10, border:"none", background:T.indigo,
              color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
            }}>+</button>
          </div>
          <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
            {form.requirements.map((r,i)=>(
              <span key={i} style={{
                display:"inline-flex", alignItems:"center", gap:5,
                background:T.indigoBg, color:"#3730A3", border:`1px solid ${T.indigoBd}`,
                padding:"4px 10px", borderRadius:8, fontSize:12,
              }}>
                {r}
                <button onClick={()=>removeItem("requirements",i)} style={{
                  background:"none", border:"none", cursor:"pointer", color:"#9CA3AF",
                  padding:0, display:"flex", fontFamily:"inherit",
                }}><LuX size={10}/></button>
              </span>
            ))}
          </div>
        </Field>

        {/* Benefits */}
        <Field label="Imtiyozlar">
          <div style={{display:"flex", gap:8, marginBottom:8}}>
            <input value={benInput} onChange={e=>setBenInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"){e.preventDefault();addItem("benefits",benInput,setBenInput);}}}
              placeholder="Imtiyozni kiriting va Enter bosing"
              style={{...inputStyle(false), flex:1}}/>
            <button onClick={()=>addItem("benefits",benInput,setBenInput)} style={{
              padding:"10px 14px", borderRadius:10, border:"none", background:T.success,
              color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
            }}>+</button>
          </div>
          <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
            {form.benefits.map((b,i)=>(
              <span key={i} style={{
                display:"inline-flex", alignItems:"center", gap:5,
                background:T.successBg, color:"#14532D", border:`1px solid ${T.successBd}`,
                padding:"4px 10px", borderRadius:8, fontSize:12,
              }}>
                {b}
                <button onClick={()=>removeItem("benefits",i)} style={{
                  background:"none", border:"none", cursor:"pointer", color:"#9CA3AF",
                  padding:0, display:"flex", fontFamily:"inherit",
                }}><LuX size={10}/></button>
              </span>
            ))}
          </div>
        </Field>

        {/* Salary */}
        <Field label="Maosh (ixtiyoriy)">
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 80px", gap:8}}>
            <input type="number" value={form.salaryMin} onChange={e=>set("salaryMin",e.target.value)}
              placeholder="Min" style={inputStyle(false)}/>
            <input type="number" value={form.salaryMax} onChange={e=>set("salaryMax",e.target.value)}
              placeholder="Max" style={inputStyle(false)}/>
            <select value={form.currency} onChange={e=>set("currency",e.target.value)} style={{...inputStyle(false), appearance:"none"}}>
              <option>USD</option><option>UZS</option>
            </select>
          </div>
        </Field>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, alignItems:"start"}}>
          <Input label="Muddati (ixtiyoriy)" type="date" value={form.deadline}
            onChange={e=>set("deadline",e.target.value)}/>
          <Field label="Holat">
            <button onClick={()=>set("isActive",!form.isActive)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
              borderRadius:10, border:`1.5px solid ${form.isActive ? T.successBd : T.border}`,
              background: form.isActive ? T.successBg : T.surfaceUp,
              color: form.isActive ? T.success : T.textDim,
              cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit", width:"100%",
            }}>
              {form.isActive
                ? <><LuToggleRight size={18}/> Faol</>
                : <><LuToggleLeft size={18}/> Nofaol</>}
            </button>
          </Field>
        </div>
      </div>
      <div style={{
        padding:"16px 24px", borderTop:`1px solid ${T.border}`,
        display:"flex", justifyContent:"flex-end", gap:10, flexShrink:0,
      }}>
        <button onClick={onClose} style={{
          padding:"10px 20px", borderRadius:10, border:`1.5px solid ${T.border}`,
          background:T.surfaceUp, color:T.textMuted, cursor:"pointer",
          fontSize:13, fontWeight:600, fontFamily:"inherit",
        }}>Bekor qilish</button>
        <button onClick={handleSave} disabled={saving} style={{
          padding:"10px 20px", borderRadius:10, border:"none",
          background: saving ? "#818CF8" : T.indigo, color:"#fff",
          cursor: saving ? "not-allowed" : "pointer",
          fontSize:13, fontWeight:700, fontFamily:"inherit",
          display:"flex", alignItems:"center", gap:7,
        }}>
          {saving && <LuLoader size={13} style={{animation:"spin 1s linear infinite"}}/>}
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>
    </Modal>
  );
}

/* ── Delete confirm ──────────────────────────────────────────────────────────── */
function DeleteConfirm({ title, sub, onClose, onConfirm, loading }) {
  return (
    <Modal onClose={onClose} maxWidth={400}>
      <div style={{padding:"28px 24px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:16, textAlign:"center"}}>
        <div style={{
          width:52, height:52, borderRadius:16, background:T.redLight,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <LuTrash2 size={22} color={T.redMid}/>
        </div>
        <div>
          <div style={{fontSize:17, fontWeight:800, color:T.text, marginBottom:6}}>{title}</div>
          <div style={{fontSize:13, color:T.textMuted}}>{sub}</div>
        </div>
        <div style={{display:"flex", gap:10, width:"100%"}}>
          <button onClick={onClose} style={{
            flex:1, padding:"11px", borderRadius:10, border:`1.5px solid ${T.border}`,
            background:T.surfaceUp, color:T.textMuted, cursor:"pointer",
            fontSize:13, fontWeight:600, fontFamily:"inherit",
          }}>Bekor</button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex:1, padding:"11px", borderRadius:10, border:"none",
            background: loading ? "#EF9A9A" : T.redMid, color:"#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize:13, fontWeight:700, fontFamily:"inherit",
          }}>{loading ? "O'chirilmoqda..." : "O'chirish"}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Vacancy card ────────────────────────────────────────────────────────────── */
function VacCard({ vac, onView, onEdit, onDelete, onToggle }) {
  const [h, setH] = useState(false);
  const tc = TYPE_COLORS[vac.type] || TYPE_COLORS["full-time"];

  return (
    <div
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        background: h ? "#FAFBFF" : T.surface,
        border:`1.5px solid ${h ? T.indigoBd : T.border}`,
        borderRadius:16, padding:"18px 20px",
        transition:"all 0.18s", boxShadow: h ? "0 6px 24px rgba(79,70,229,0.09)" : "0 1px 3px rgba(0,0,0,0.04)",
        opacity: vac.isActive ? 1 : 0.6,
      }}
    >
      <div style={{display:"flex", alignItems:"flex-start", gap:14}}>
        {/* icon */}
        <div style={{
          width:46, height:46, borderRadius:13, flexShrink:0,
          background: T.indigoBg, display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <LuBriefcase size={20} color={T.indigo}/>
        </div>

        {/* info */}
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4}}>
            <span style={{fontSize:15, fontWeight:800, color:T.text}}>{vac.title}</span>
            {vac.appNewCount > 0 && (
              <span style={{
                background:T.indigoBg, color:"#3730A3", border:`1px solid ${T.indigoBd}`,
                fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99,
              }}>{vac.appNewCount} yangi</span>
            )}
            {!vac.isActive && (
              <span style={{
                background:T.bg, color:T.textDim, border:`1px solid ${T.border}`,
                fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99,
              }}>Nofaol</span>
            )}
          </div>
          <div style={{display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:10}}>
            <span style={{fontSize:12, color:T.textDim, display:"flex", alignItems:"center", gap:4}}>
              <LuUsers size={11}/> {vac.department}
            </span>
            <span style={{fontSize:12, color:T.textDim, display:"flex", alignItems:"center", gap:4}}>
              <LuMapPin size={11}/> {vac.location}
            </span>
            <span style={{
              fontSize:11, padding:"2px 9px", borderRadius:6,
              background:tc.bg, color:tc.tc, border:`1px solid ${tc.bd}`, fontWeight:600,
            }}>{TYPE_LABEL[vac.type]}</span>
          </div>
          {vac.requirements?.length > 0 && (
            <div style={{display:"flex", flexWrap:"wrap", gap:5}}>
              {vac.requirements.slice(0,4).map((r,i)=>(
                <span key={i} style={{
                  fontSize:11, padding:"2px 8px", borderRadius:6,
                  background:T.surfaceUp, border:`1px solid ${T.border}`, color:T.textMuted,
                }}>{r}</span>
              ))}
              {vac.requirements.length > 4 && (
                <span style={{fontSize:11, color:T.textDim}}>+{vac.requirements.length-4}</span>
              )}
            </div>
          )}
        </div>

        {/* counters */}
        <div style={{display:"flex", gap:8, flexShrink:0}}>
          {[
            {v:vac.appTotal,    l:"Jami",  bg:T.bg,         tc:T.textMuted},
            {v:vac.appNewCount, l:"Yangi", bg:T.indigoBg,   tc:"#3730A3"},
          ].map(s=>(
            <div key={s.l} style={{
              textAlign:"center", background:s.bg, borderRadius:10, padding:"8px 12px", minWidth:44,
            }}>
              <div style={{fontSize:18, fontWeight:800, color:s.tc, lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:9, fontWeight:700, color:s.tc+"99", marginTop:2, textTransform:"uppercase", letterSpacing:"0.05em"}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* actions */}
        <div style={{display:"flex", gap:6, flexShrink:0}}>
          <Btn icon={<LuUsers size={13}/>} color={T.indigo} bg={T.indigoBg} title="Arizalar" onClick={()=>onView(vac)}/>
          <Btn icon={<LuPencil size={13}/>} color={T.warn} bg={T.warnBg} title="Tahrirlash" onClick={()=>onEdit(vac)}/>
          <Btn
            icon={vac.isActive ? <LuToggleRight size={14}/> : <LuToggleLeft size={14}/>}
            color={vac.isActive ? T.success : T.textDim}
            bg={vac.isActive ? T.successBg : T.bg}
            title={vac.isActive ? "O'chirish" : "Yoqish"}
            onClick={()=>onToggle(vac)}
          />
          <Btn icon={<LuTrash2 size={13}/>} color={T.redMid} bg={T.redLight} title="O'chirish" onClick={()=>onDelete(vac)}/>
        </div>
      </div>
    </div>
  );
}

function Btn({ icon, color, bg, title, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        width:32, height:32, borderRadius:9, border:"none", cursor:"pointer",
        background: h ? color : bg, color: h ? "#fff" : color,
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.15s", fontFamily:"inherit",
      }}>{icon}</button>
  );
}

/* ── Applications modal ──────────────────────────────────────────────────────── */
function AppsModal({ vac, onClose, onPickApp }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCareersService.getApplications(vac._id);
      setApps(res.data);
    } catch { toast.error("Arizalar yuklanmadi"); }
    finally { setLoading(false); }
  }, [vac._id]);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => [
    {l:"Jami",  v:apps.length,                             bg:T.bg,         tc:T.textMuted},
    {l:"Yangi", v:apps.filter(a=>a.status==="new").length, bg:T.indigoBg,   tc:"#3730A3"},
    {l:"Qabul", v:apps.filter(a=>a.status==="accepted").length, bg:T.successBg, tc:"#14532D"},
    {l:"Rad",   v:apps.filter(a=>a.status==="rejected").length, bg:T.redLight,  tc:T.red},
  ], [apps]);

  const tc = TYPE_COLORS[vac.type] || TYPE_COLORS["full-time"];

  return (
    <Modal onClose={onClose} maxWidth={560}>
      <MHead
        title={vac.title}
        sub={`${vac.department} · ${TYPE_LABEL[vac.type]}`}
        onClose={onClose}
      />

      {/* stats */}
      <div style={{display:"flex", gap:10, padding:"14px 24px 0", flexShrink:0}}>
        {stats.map(s=>(
          <div key={s.l} style={{flex:1, textAlign:"center", background:s.bg, borderRadius:12, padding:"10px 8px"}}>
            <div style={{fontSize:20, fontWeight:800, color:s.tc, lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9, color:s.tc+"88", fontWeight:700, marginTop:3, textTransform:"uppercase", letterSpacing:"0.05em"}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* requirements */}
      {vac.requirements?.length > 0 && (
        <div style={{padding:"12px 24px 0", display:"flex", flexWrap:"wrap", gap:6, flexShrink:0}}>
          {vac.requirements.map((r,i)=>(
            <span key={i} style={{fontSize:11, padding:"3px 10px", borderRadius:6, background:T.surfaceUp, border:`1px solid ${T.border}`, color:T.textMuted}}>{r}</span>
          ))}
        </div>
      )}

      {/* list */}
      <div style={{overflowY:"auto", flex:1, padding:"14px 24px 24px"}}>
        {loading ? (
          <div style={{textAlign:"center", padding:"2rem", color:T.textDim}}>
            <LuLoader size={20} style={{animation:"spin 1s linear infinite"}}/>
          </div>
        ) : apps.length === 0 ? (
          <div style={{textAlign:"center", padding:"2.5rem", color:T.textDim, fontSize:14}}>
            Hali ariza yo'q
          </div>
        ) : (
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {apps.map(app => (
              <div key={app._id} onClick={()=>onPickApp(app, setApps)}
                style={{
                  display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                  borderRadius:14, cursor:"pointer", border:`1.5px solid ${T.border}`,
                  background:T.surfaceUp, transition:"all 0.14s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.borderColor=T.indigoBd;}}
                onMouseLeave={e=>{e.currentTarget.style.background=T.surfaceUp;e.currentTarget.style.borderColor=T.border;}}
              >
                <Ava name={app.name} size={40} fz={13}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:700, color:T.text}}>{app.name}</div>
                  <div style={{fontSize:11, color:T.textDim, marginTop:2}}>{app.email} · {app.phone}</div>
                </div>
                <StatusPill status={app.status}/>
                <LuChevronRight size={16} color={T.border}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ── Applicant detail modal ──────────────────────────────────────────────────── */
function AppDetailModal({ app: initialApp, vac, onClose, onUpdated }) {
  const [app, setApp] = useState(initialApp);
  const [saving, setSaving] = useState(false);

  const changeStatus = async (status) => {
    setSaving(true);
    try {
      const res = await adminCareersService.updateAppStatus(app._id, status);
      setApp(res.data);
      onUpdated?.(res.data);
      toast.success("Status yangilandi");
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  return (
    <Modal onClose={onClose} maxWidth={520}>
      <MHead title="Nomzod ma'lumotlari" onClose={onClose}/>

      {/* hero */}
      <div style={{
        padding:"20px 24px 18px",
        background:`linear-gradient(135deg,${T.indigoBg},${T.bg})`,
        borderBottom:`1px solid ${T.border}`, flexShrink:0,
      }}>
        <div style={{display:"flex", alignItems:"center", gap:14}}>
          <Ava name={app.name} size={54} fz={18}/>
          <div style={{flex:1}}>
            <div style={{fontSize:19, fontWeight:800, color:T.text, marginBottom:3}}>{app.name}</div>
            <div style={{fontSize:13, color:T.indigo, fontWeight:700, marginBottom:8}}>{vac?.title}</div>
            <StatusPill status={app.status}/>
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{overflowY:"auto", flex:1, padding:"20px 24px 24px"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18}}>
          {[
            {label:"Email",       val:app.email},
            {label:"Telefon",     val:app.phone || "—"},
            {label:"Ariza sanasi",val:new Date(app.createdAt).toLocaleDateString("uz-UZ")},
            {label:"Bo'lim",      val:vac?.department || "—"},
          ].map(r=>(
            <div key={r.label} style={{
              background:T.surfaceUp, border:`1px solid ${T.border}`,
              borderRadius:12, padding:"11px 13px",
            }}>
              <div style={{fontSize:10, fontWeight:700, color:T.textDim, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2}}>{r.label}</div>
              <div style={{fontSize:13, fontWeight:700, color:"#1E293B"}}>{r.val}</div>
            </div>
          ))}
        </div>

        {app.message && (
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11, fontWeight:700, color:T.textDim, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8}}>
              Motivatsiya xabari
            </div>
            <div style={{
              background:T.surfaceUp, border:`1px solid ${T.border}`,
              borderLeft:`3px solid ${T.indigo}`, borderRadius:"0 12px 12px 0",
              padding:"13px 16px", fontSize:14, color:T.textMuted, lineHeight:1.75, fontStyle:"italic",
            }}>"{app.message}"</div>
          </div>
        )}

        <div>
          <div style={{fontSize:11, fontWeight:700, color:T.textDim, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10}}>
            Statusni yangilash
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
            {Object.entries(ST).map(([key, c]) => {
              const active = app.status === key;
              return (
                <button key={key} onClick={()=>changeStatus(key)} disabled={saving || active} style={{
                  padding:"11px 13px", borderRadius:12, cursor: active ? "default" : "pointer",
                  border:`1.5px solid ${active ? c.dot : T.border}`,
                  background: active ? c.bg : T.surface,
                  color: active ? c.tc : T.textMuted,
                  fontSize:12, fontWeight: active ? 700 : 500,
                  display:"flex", alignItems:"center", gap:7,
                  transition:"all 0.15s", fontFamily:"inherit",
                }}
                  onMouseEnter={e=>{ if(!active){ e.currentTarget.style.borderColor=c.dot; e.currentTarget.style.background=c.bg+"88"; }}}
                  onMouseLeave={e=>{ if(!active){ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.surface; }}}
                >
                  <span style={{width:8, height:8, borderRadius:"50%", background:active?c.dot:"#CBD5E1", flexShrink:0}}/>
                  <span style={{flex:1, textAlign:"left"}}>{c.label}</span>
                  {active && <LuCircleCheck size={13}/>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── All applications tab ────────────────────────────────────────────────────── */
function AllAppsTab() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selApp, setSelApp] = useState(null);
  const [sf, setSf] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCareersService.getAllApplications(filterStatus ? { status: filterStatus } : {});
      setApps(res.data);
    } catch { toast.error("Arizalar yuklanmadi"); }
    finally { setLoading(false); }
  }, [filterStatus]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() =>
    apps.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    ), [apps, search]);

  const handleUpdated = (updated) => {
    setApps(p => p.map(a => a._id === updated._id ? updated : a));
    setSelApp(updated);
  };

  return (
    <div>
      {/* filters */}
      <div style={{display:"flex", gap:10, marginBottom:16, flexWrap:"wrap"}}>
        <div style={{position:"relative", flex:1, minWidth:200}}>
          <LuSearch size={14} style={{position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.textDim}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Ism yoki email bo'yicha qidiruv..."
            style={{
              width:"100%", padding:"10px 12px 10px 34px",
              border:`1.5px solid ${sf ? T.indigo : T.border}`,
              boxShadow: sf ? `0 0 0 3px ${T.indigo}18` : "none",
              borderRadius:10, fontSize:13, outline:"none",
              background:T.surface, color:T.text, fontFamily:"inherit",
            }}
            onFocus={()=>setSf(true)} onBlur={()=>setSf(false)}
          />
        </div>
        <div style={{display:"flex", gap:6}}>
          {["", "new", "reviewing", "accepted", "rejected"].map(s => (
            <button key={s} onClick={()=>setFilterStatus(s)} style={{
              padding:"8px 14px", borderRadius:9, border:"none", cursor:"pointer",
              background: filterStatus === s ? T.text : T.surface,
              color: filterStatus === s ? "#fff" : T.textMuted,
              border: `1.5px solid ${filterStatus === s ? T.text : T.border}`,
              fontSize:12, fontWeight:600, fontFamily:"inherit",
            }}>{s ? ST[s].label : "Barchasi"}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{textAlign:"center", padding:"3rem", color:T.textDim}}>
          <LuLoader size={24} style={{animation:"spin 1s linear infinite"}}/>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:"center", padding:"3rem", color:T.textDim, fontSize:14}}>
          Natija topilmadi
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:8}}>
          {filtered.map(app => (
            <div key={app._id} onClick={()=>setSelApp(app)}
              style={{
                display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
                borderRadius:14, cursor:"pointer", border:`1.5px solid ${T.border}`,
                background:T.surface, transition:"all 0.15s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="#FAFBFF";e.currentTarget.style.borderColor=T.indigoBd;}}
              onMouseLeave={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.borderColor=T.border;}}
            >
              <Ava name={app.name} size={40} fz={13}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14, fontWeight:700, color:T.text}}>{app.name}</div>
                <div style={{fontSize:12, color:T.textDim, marginTop:2}}>
                  {app.career?.title} · {app.email}
                </div>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0}}>
                <StatusPill status={app.status}/>
                <span style={{fontSize:11, color:T.textDim}}>
                  {new Date(app.createdAt).toLocaleDateString("uz-UZ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selApp && (
        <AppDetailModal
          app={selApp}
          vac={selApp.career}
          onClose={()=>setSelApp(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────────── */
export default function AdminCareer() {
  const [vacancies, setVacancies] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("vac");

  // modals
  const [createModal, setCreateModal] = useState(false);
  const [editVac,     setEditVac]     = useState(null);
  const [deleteVac,   setDeleteVac]   = useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [appsVac,     setAppsVac]     = useState(null);
  const [selApp,      setSelApp]      = useState(null);
  const [appsUpdater, setAppsUpdater] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCareersService.getAll();
      setVacancies(res.data);
    } catch { toast.error("Vakansiyalar yuklanmadi"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    const res = await adminCareersService.create(data);
    setVacancies(p => [{ ...res.data, appTotal:0, appNewCount:0 }, ...p]);
    toast.success("Vakansiya yaratildi");
  };

  const handleEdit = async (data) => {
    const res = await adminCareersService.update(editVac._id, data);
    setVacancies(p => p.map(v => v._id === editVac._id
      ? { ...res.data, appTotal:v.appTotal, appNewCount:v.appNewCount } : v));
    toast.success("Vakansiya yangilandi");
  };

  const handleToggle = async (vac) => {
    try {
      const res = await adminCareersService.update(vac._id, { isActive: !vac.isActive });
      setVacancies(p => p.map(v => v._id === vac._id
        ? { ...res.data, appTotal:v.appTotal, appNewCount:v.appNewCount } : v));
      toast.success(res.data.isActive ? "Faollashtirildi" : "Nofaollashtirildi");
    } catch { toast.error("Xatolik yuz berdi"); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminCareersService.remove(deleteVac._id);
      setVacancies(p => p.filter(v => v._id !== deleteVac._id));
      setDeleteVac(null);
      toast.success("Vakansiya o'chirildi");
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setDeleting(false); }
  };

  const totalApps = useMemo(() => vacancies.reduce((s,v)=>s+v.appTotal,0), [vacancies]);
  const newApps   = useMemo(() => vacancies.reduce((s,v)=>s+v.appNewCount,0), [vacancies]);
  const activeVac = useMemo(() => vacancies.filter(v=>v.isActive).length, [vacancies]);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-career * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-career ::-webkit-scrollbar { width: 4px; }
        .admin-career ::-webkit-scrollbar-thumb { background: #DDE1EA; border-radius: 4px; }
      `}</style>

      <div className="admin-career" style={{ fontFamily:"'Manrope',sans-serif", padding:"28px 28px 56px", background:T.bg, minHeight:"100vh" }}>
        <div style={{maxWidth:960, margin:"0 auto"}}>

          {/* Header */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28}}>
            <div>
              <h1 style={{fontSize:24, fontWeight:800, color:T.text, letterSpacing:"-0.03em", marginBottom:4}}>
                Karyera boshqaruvi
              </h1>
              <p style={{fontSize:13, color:T.textDim}}>Vakansiyalar va arizalarni boshqarish</p>
            </div>
            <div style={{display:"flex", gap:10, alignItems:"center"}}>
              {/* stat chips */}
              {[
                {l:"Vakansiyalar", v:activeVac, bg:T.indigoBg, tc:"#3730A3", bd:T.indigoBd},
                {l:"Arizalar",     v:totalApps, bg:T.bg,       tc:T.text,    bd:T.border},
                {l:"Yangi",        v:newApps,   bg:T.warnBg,   tc:"#92400E", bd:T.warnBd},
              ].map(s=>(
                <div key={s.l} style={{
                  textAlign:"center", background:s.bg,
                  border:`1.5px solid ${s.bd}`, borderRadius:14, padding:"10px 18px", minWidth:64,
                }}>
                  <div style={{fontSize:9, fontWeight:700, color:s.tc+"88", textTransform:"uppercase", letterSpacing:"0.07em"}}>{s.l}</div>
                  <div style={{fontSize:22, fontWeight:800, color:s.tc, lineHeight:1.1, marginTop:2}}>{s.v}</div>
                </div>
              ))}
              <button onClick={load} style={{
                width:38, height:38, borderRadius:10, border:`1.5px solid ${T.border}`,
                background:T.surface, cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center", color:T.textDim,
                fontFamily:"inherit",
              }}><LuRefreshCw size={14}/></button>
              <button onClick={()=>setCreateModal(true)} style={{
                display:"flex", alignItems:"center", gap:7,
                padding:"10px 18px", borderRadius:10, border:"none",
                background:T.indigo, color:"#fff", cursor:"pointer",
                fontSize:13, fontWeight:700, fontFamily:"inherit",
              }}>
                <LuPlus size={14}/> Yangi vakansiya
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display:"inline-flex", background:T.surface,
            border:`1.5px solid ${T.border}`, borderRadius:12,
            padding:4, marginBottom:20, gap:4,
          }}>
            {[["vac","Vakansiyalar"],["apps","Barcha arizalar"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{
                padding:"8px 22px", borderRadius:9, border:"none",
                background: tab===k ? T.text : "transparent",
                color: tab===k ? "#fff" : T.textDim,
                fontSize:13, fontWeight:700, cursor:"pointer",
                transition:"all 0.18s", fontFamily:"inherit",
              }}>{l}</button>
            ))}
          </div>

          {/* Tab: Vacancies */}
          {tab === "vac" && (
            loading ? (
              <div style={{textAlign:"center", padding:"4rem", color:T.textDim}}>
                <LuLoader size={28} style={{animation:"spin 1s linear infinite"}}/>
              </div>
            ) : vacancies.length === 0 ? (
              <div style={{
                textAlign:"center", padding:"4rem", background:T.surface,
                borderRadius:16, border:`1.5px solid ${T.border}`,
              }}>
                <LuBriefcase size={36} color={T.border} style={{marginBottom:12}}/>
                <div style={{fontSize:16, fontWeight:700, color:T.textMuted, marginBottom:8}}>Vakansiyalar yo'q</div>
                <div style={{fontSize:13, color:T.textDim, marginBottom:20}}>Birinchi vakansiyani yarating</div>
                <button onClick={()=>setCreateModal(true)} style={{
                  padding:"10px 20px", borderRadius:10, border:"none",
                  background:T.indigo, color:"#fff", cursor:"pointer",
                  fontSize:13, fontWeight:700, fontFamily:"inherit",
                }}><LuPlus size={13} style={{marginRight:6}}/>Vakansiya qo'shish</button>
              </div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:10}}>
                {vacancies.map(vac => (
                  <VacCard
                    key={vac._id}
                    vac={vac}
                    onView={v => setAppsVac(v)}
                    onEdit={v => setEditVac(v)}
                    onDelete={v => setDeleteVac(v)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )
          )}

          {/* Tab: All apps */}
          {tab === "apps" && <AllAppsTab/>}
        </div>
      </div>

      {/* Modals */}
      {createModal && (
        <VacancyFormModal
          onClose={()=>setCreateModal(false)}
          onSave={handleCreate}
        />
      )}
      {editVac && (
        <VacancyFormModal
          initial={editVac}
          onClose={()=>setEditVac(null)}
          onSave={handleEdit}
        />
      )}
      {deleteVac && (
        <DeleteConfirm
          title="Vakansiyani o'chirish"
          sub={`"${deleteVac.title}" vakansiyasi va unga tegishli barcha arizalar o'chiriladi.`}
          onClose={()=>setDeleteVac(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
      {appsVac && (
        <AppsModal
          vac={appsVac}
          onClose={()=>{ setAppsVac(null); load(); }}
          onPickApp={(app, setApps) => { setSelApp(app); setAppsUpdater(()=>setApps); }}
        />
      )}
      {selApp && (
        <AppDetailModal
          app={selApp}
          vac={selApp.career}
          onClose={()=>setSelApp(null)}
          onUpdated={(updated) => {
            setSelApp(updated);
            appsUpdater?.(p => p.map(a => a._id === updated._id ? updated : a));
          }}
        />
      )}
    </>
  );
}
