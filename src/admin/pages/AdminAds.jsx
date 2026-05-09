import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "../../components/ui/toast";
import api from "../../services/api";
import {
  PiCheckCircleDuotone,
  PiXCircleDuotone,
  PiTrashDuotone,
  PiEyeDuotone,
  PiArrowsClockwiseDuotone,
  PiMagnifyingGlassDuotone,
  PiCaretUpDownDuotone,
  PiWarningCircleDuotone,
  PiCheckFatDuotone,
  PiProhibitDuotone,
  PiListChecksDuotone,
  PiClockCountdownDuotone,
  PiMegaphoneSimpleDuotone,
  PiCellSignalFullDuotone,
  PiUsersThreeDuotone,
  PiCurrencyDollarSimpleDuotone,
  PiMapPinDuotone,
  PiPhoneDuotone,
  PiCalendarDotsDuotone,
  PiBuildingsDuotone,
  PiPackageDuotone,
  PiTimerDuotone,
  PiTargetDuotone,
} from "react-icons/pi";

/* ─── Status config ─────────────────────────────────────────────── */
const ST = {
  pending:   { bg:"#FFF7ED", tc:"#9A3412", dot:"#F97316", bd:"#FED7AA", label:"Kutilmoqda"  },
  approved:  { bg:"#F0FDF4", tc:"#166534", dot:"#22C55E", bd:"#BBF7D0", label:"Tasdiqlangan"},
  rejected:  { bg:"#FFF1F2", tc:"#9F1239", dot:"#F43F5E", bd:"#FECDD3", label:"Rad etilgan" },
  active:    { bg:"#EFF6FF", tc:"#1E40AF", dot:"#3B82F6", bd:"#BFDBFE", label:"Faol"        },
  completed: { bg:"#F8FAFC", tc:"#475569", dot:"#94A3B8", bd:"#E2E8F0", label:"Yakunlangan" },
};

const PAGE_SIZE = 10;

/* ─── Helpers ───────────────────────────────────────────────────── */
const ini = str => (str||"?").split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";
const AVA_COLORS = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899"];
const avaColor = str => AVA_COLORS[(str||"?").charCodeAt(0) % AVA_COLORS.length];
const fmtDate  = d => d ? new Date(d).toLocaleDateString("uz-UZ") : "—";
const fmtNum   = n => n ? Number(n).toLocaleString("uz-UZ") : "0";

/* ─── Small components ──────────────────────────────────────────── */
function Pill({ status }) {
  const c = ST[status] || ST.pending;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:c.bg, color:c.tc, border:`1px solid ${c.bd}`,
      padding:"3px 10px", borderRadius:99,
      fontSize:11, fontWeight:700, whiteSpace:"nowrap",
    }}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {c.label}
    </span>
  );
}

function Ava({ name, avatar, size=32 }) {
  const col = avaColor(name);
  if (avatar) return (
    <img src={avatar} alt="" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
  );
  return (
    <div style={{
      width:size,height:size,borderRadius:"50%",flexShrink:0,
      background:col+"22",border:`1.5px solid ${col}44`,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:size*0.35,fontWeight:800,color:col,
    }}>{ini(name)}</div>
  );
}

function StatCard({ label, value, sub, accent, badge }) {
  return (
    <div style={{background:"#fff",borderRadius:18,padding:"18px 22px",border:"1.5px solid #E9ECF2",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",position:"relative",overflow:"hidden"}}>
      {badge && (
        <div style={{position:"absolute",top:10,right:12,background:"#F97316",color:"#fff",fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:99}}>
          {badge}
        </div>
      )}
      <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{label}</div>
      <div style={{fontSize:26,fontWeight:800,color:accent||"#0F172A",lineHeight:1,marginBottom:4}}>{value}</div>
      {sub && <div style={{fontSize:12,color:"#94A3B8"}}>{sub}</div>}
    </div>
  );
}

function IconBtn({ onClick, title, children, hoverBg, hoverColor }) {
  const [h,setH] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        width:30,height:30,borderRadius:8,
        border:`1.5px solid ${h ? hoverBg+"88":"#E9ECF2"}`,
        background:h ? hoverBg+"22":"#fff",
        color:h ? hoverColor:"#94A3B8",
        cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        transition:"all 0.14s",flexShrink:0,fontFamily:"inherit",fontSize:14,
      }}
    >{children}</button>
  );
}

/* ─── Detail / Review Modal ─────────────────────────────────────── */
function DetailModal({ ad, onClose, onStatus, onDelete, saving }) {
  if (!ad) return null;
  const name = ad.type==="blogger"
    ? (ad.user ? `${ad.user.firstName||""} ${ad.user.lastName||""}`.trim() : "Foydalanuvchi")
    : (ad.companyName || "Biznes");

  const isPending = ad.status === "pending";

  const infoRows = ad.type === "blogger" ? [
    {Icon:PiMegaphoneSimpleDuotone,  label:"Sarlavha",     val:ad.title||"—"},
    {Icon:PiCellSignalFullDuotone,   label:"Platformalar", val:(ad.platforms||[]).join(", ")||"—"},
    {Icon:PiUsersThreeDuotone,       label:"Obunachilar",  val:ad.followersRange||"—"},
    {Icon:PiCurrencyDollarSimpleDuotone, label:"Post narxi", val:ad.pricing?.post ? fmtNum(ad.pricing.post)+" so'm":"—"},
    {Icon:PiMapPinDuotone,           label:"Joylashuv",    val:ad.location||"—"},
    {Icon:PiPhoneDuotone,            label:"Telefon",      val:ad.phone||"—"},
    {Icon:PiEyeDuotone,              label:"Ko'rishlar",   val:fmtNum(ad.views)},
    {Icon:PiCalendarDotsDuotone,     label:"Sana",         val:fmtDate(ad.createdAt)},
  ] : [
    {Icon:PiBuildingsDuotone,        label:"Kompaniya",    val:ad.companyName||"—"},
    {Icon:PiPackageDuotone,          label:"Mahsulot",     val:ad.productName||"—"},
    {Icon:PiCurrencyDollarSimpleDuotone, label:"Byudjet",  val:ad.budget?.range||"—"},
    {Icon:PiCellSignalFullDuotone,   label:"Platformalar", val:(ad.targetPlatforms||[]).join(", ")||"—"},
    {Icon:PiTargetDuotone,           label:"Auditoriya",   val:ad.targetAudience||"—"},
    {Icon:PiTimerDuotone,            label:"Davomiyligi",  val:ad.campaignDuration||"—"},
    {Icon:PiPhoneDuotone,            label:"Telefon",      val:ad.phone||"—"},
    {Icon:PiCalendarDotsDuotone,     label:"Sana",         val:fmtDate(ad.createdAt)},
  ];

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{
      position:"fixed",inset:0,zIndex:9999,
      background:"rgba(15,23,42,0.6)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20,
    }}>
      <div style={{
        background:"#fff",borderRadius:24,width:"100%",maxWidth:520,
        maxHeight:"92vh",display:"flex",flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.22)",overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{padding:"20px 24px 16px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,background:ad.type==="blogger"?"#EDE9FE":"#DBEAFE",color:ad.type==="blogger"?"#6D28D9":"#1E40AF",padding:"2px 8px",borderRadius:5}}>
                {ad.type==="blogger"?"Bloger":"Biznes"}
              </span>
              <Pill status={ad.status}/>
            </div>
            <div style={{fontSize:15,fontWeight:800,color:"#0F172A"}}>{ad.title||ad.productName||name}</div>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:10,border:"1.5px solid #E2E8F0",background:"#F8FAFC",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#94A3B8",fontFamily:"inherit",flexShrink:0}}>✕</button>
        </div>

        {/* Body */}
        <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>

          {/* Author */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,padding:"12px 16px",background:"#F8FAFC",borderRadius:14,border:"1.5px solid #F1F5F9"}}>
            <Ava name={name} avatar={ad.user?.avatar} size={44}/>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{name}</div>
              <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>
                {ad.user?.email || ad.contactPerson || "—"}
              </div>
            </div>
          </div>

          {/* Description */}
          {(ad.description || ad.productDescription) && (
            <div style={{background:"#F8FAFC",border:"1.5px solid #F1F5F9",borderLeft:"3px solid #6366F1",borderRadius:"0 12px 12px 0",padding:"12px 16px",marginBottom:18,fontSize:13,color:"#334155",lineHeight:1.6}}>
              {ad.description || ad.productDescription}
            </div>
          )}

          {/* Info grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
            {infoRows.map(r=>(
              <div key={r.label} style={{background:"#F8FAFC",border:"1.5px solid #F1F5F9",borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:8}}>
                <r.Icon size={16} style={{flexShrink:0,marginTop:2,color:"#6366F1",opacity:0.8}}/>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{r.label}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#1E293B",wordBreak:"break-word"}}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Services / tags */}
          {(ad.services?.length > 0 || ad.bloggerTypesNeeded?.length > 0) && (
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>
                {ad.type==="blogger" ? "Xizmatlar" : "Kerakli bloger turlari"}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {(ad.services || ad.bloggerTypesNeeded || []).map(s=>(
                  <span key={s} style={{padding:"4px 10px",borderRadius:100,background:"#F1F5F9",color:"#475569",fontSize:11,fontWeight:600,border:"1px solid #E2E8F0"}}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Pending — approve / reject */}
          {isPending && (
            <div style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:14,padding:"16px",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"#92400E",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                <PiClockCountdownDuotone size={16}/> Bu e'lon ko'rib chiqishni kutmoqda
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button
                  onClick={()=>onStatus(ad._id,"approved")} disabled={saving}
                  style={{padding:"12px",borderRadius:12,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit",border:"1.5px solid #22C55E",background:"#F0FDF4",color:"#166534",fontSize:13,fontWeight:700,opacity:saving?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}
                >
                  <PiCheckCircleDuotone size={16}/> Tasdiqlash
                </button>
                <button
                  onClick={()=>onStatus(ad._id,"rejected")} disabled={saving}
                  style={{padding:"12px",borderRadius:12,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit",border:"1.5px solid #F43F5E",background:"#FFF1F2",color:"#9F1239",fontSize:13,fontWeight:700,opacity:saving?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}
                >
                  <PiXCircleDuotone size={16}/> Rad etish
                </button>
              </div>
            </div>
          )}

          {/* Status change (non-pending) */}
          {!isPending && (
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Statusni o'zgartirish</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {Object.entries(ST).map(([key,cfg])=>{
                  const active = ad.status===key;
                  const StatusIcon = {
                    pending:   PiClockCountdownDuotone,
                    approved:  PiCheckCircleDuotone,
                    rejected:  PiXCircleDuotone,
                    active:    PiCheckFatDuotone,
                    completed: PiListChecksDuotone,
                  }[key] || PiCheckDuotone;
                  return (
                    <button key={key} onClick={()=>!active&&onStatus(ad._id,key)} disabled={saving}
                      style={{padding:"6px 12px",borderRadius:10,cursor:active||saving?"default":"pointer",fontFamily:"inherit",border:`1.5px solid ${active?cfg.dot:cfg.bd}`,background:active?cfg.bg:"#fff",color:active?cfg.tc:"#64748B",fontSize:12,fontWeight:700,opacity:saving?0.6:1,transition:"all 0.14s",display:"flex",alignItems:"center",gap:5}}
                    ><StatusIcon size={13}/>{cfg.label}</button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delete */}
          <button
            onClick={()=>{ onDelete(ad._id); onClose(); }}
            style={{width:"100%",padding:"11px",borderRadius:12,cursor:"pointer",border:"1.5px solid #FECDD3",background:"#FFF1F2",color:"#9F1239",fontSize:13,fontWeight:700,fontFamily:"inherit",transition:"all 0.14s",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}
            onMouseEnter={e=>e.currentTarget.style.background="#FFE4E6"}
            onMouseLeave={e=>e.currentTarget.style.background="#FFF1F2"}
          ><PiTrashDuotone size={16}/> E'lonni o'chirish</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────────────── */
export default function AdminAds() {
  const [ads, setAds]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState("all");
  const [sort,    setSort]    = useState("newest");
  const [page,    setPage]    = useState(1);
  const [modal,   setModal]   = useState(null);
  const [selected,setSelected]= useState(new Set());

  /* fetch */
  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/ads");
      setAds(r.data.data || []);
    } catch { toast.error("E'lonlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  /* status change */
  const changeStatus = useCallback(async (id, status) => {
    setSaving(true);
    try {
      const r = await api.patch(`/admin/ads/${id}/status`, { status });
      const updated = r.data.data;
      setAds(p => p.map(a => a._id===id ? {...a, status:updated.status} : a));
      setModal(p => p?._id===id ? {...p, status:updated.status} : p);
      const cfg = ST[status];
      toast.success(`Status: ${cfg?.label || status}`);
    } catch { toast.error("Statusni o'zgartirishda xatolik"); }
    finally { setSaving(false); }
  }, []);

  /* delete */
  const deleteAd = useCallback(async (id) => {
    if (!confirm("E'lonni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/ads/${id}`);
      setAds(p => p.filter(a => a._id!==id));
      setSelected(p => { const s=new Set(p); s.delete(id); return s; });
      toast.success("E'lon o'chirildi");
    } catch { toast.error("O'chirishda xatolik"); }
  }, []);

  /* bulk */
  const bulkAction = useCallback(async (action) => {
    if (!selected.size) return;
    const ids = [...selected];
    if (action === "delete") {
      if (!confirm(`${ids.length} ta e'lonni o'chirasizmi?`)) return;
      await Promise.all(ids.map(id => api.delete(`/ads/${id}`).catch(()=>{})));
      setAds(p => p.filter(a => !selected.has(a._id)));
      toast.success(`${ids.length} ta e'lon o'chirildi`);
    } else {
      setSaving(true);
      await Promise.all(ids.map(id => api.patch(`/admin/ads/${id}/status`, { status:action }).catch(()=>{})));
      const cfg = ST[action];
      setAds(p => p.map(a => selected.has(a._id) ? {...a, status:action} : a));
      toast.success(`${ids.length} ta e'lon: ${cfg?.label || action}`);
      setSaving(false);
    }
    setSelected(new Set());
  }, [selected]);

  /* filtered */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let res = ads.filter(a => {
      const name = a.type==="blogger"
        ? `${a.user?.firstName||""} ${a.user?.lastName||""}`.trim()
        : (a.companyName||"");
      const title = a.title || a.productName || "";
      const mq = !q || title.toLowerCase().includes(q) || name.toLowerCase().includes(q);
      const ms = statusF==="all" || a.status===statusF;
      return mq && ms;
    });
    if (sort==="newest") res = [...res].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    if (sort==="oldest") res = [...res].sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
    if (sort==="views")  res = [...res].sort((a,b)=>(b.views||0)-(a.views||0));
    return res;
  }, [ads, search, statusF, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);

  const toggleOne = (id, checked) => setSelected(p => { const s=new Set(p); checked?s.add(id):s.delete(id); return s; });
  const toggleAll = checked => setSelected(p => { const s=new Set(p); pageItems.forEach(a=>checked?s.add(a._id):s.delete(a._id)); return s; });
  const allChecked  = pageItems.length>0 && pageItems.every(a=>selected.has(a._id));
  const someChecked = pageItems.some(a=>selected.has(a._id));

  /* counts */
  const counts = useMemo(()=>{
    const c = { all:ads.length };
    Object.keys(ST).forEach(k => { c[k] = ads.filter(a=>a.status===k).length; });
    return c;
  }, [ads]);

  const STATUS_TABS = [
    { v:"all",       l:"Barchasi",    cnt:counts.all },
    { v:"pending",   l:"Kutilmoqda",  cnt:counts.pending||0,   urgent:true },
    { v:"approved",  l:"Tasdiqlangan",cnt:counts.approved||0 },
    { v:"active",    l:"Faol",        cnt:counts.active||0 },
    { v:"rejected",  l:"Rad etilgan", cnt:counts.rejected||0 },
    { v:"completed", l:"Yakunlangan", cnt:counts.completed||0 },
  ];

  return (
    <div style={{fontFamily:"'Manrope',sans-serif",padding:"28px 28px 56px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .aa-root *, .aa-root *::before, .aa-root *::after { box-sizing:border-box; }
        .aa-root button, .aa-root input, .aa-root select { font-family:'Manrope',sans-serif; }
        .aa-root ::-webkit-scrollbar { width:4px; height:4px; }
        .aa-root ::-webkit-scrollbar-thumb { background:#DDE1EA; border-radius:4px; }
        .aa-row:hover { background:#FAFBFF !important; }
        .aa-row-sel  { background:#EEF2FF !important; }
        @keyframes aa-spin { to { transform:rotate(360deg); } }
      `}</style>

      <DetailModal ad={modal} onClose={()=>setModal(null)} onStatus={changeStatus} onDelete={deleteAd} saving={saving}/>

      {/* ── STAT CARDS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Jami e'lonlar"  value={counts.all}            sub="barcha holatlarda"     accent="#0F172A"/>
        <StatCard label="Kutilmoqda"     value={counts.pending||0}     sub="ko'rib chiqish kerak"  accent="#9A3412"
          badge={counts.pending > 0 ? `${counts.pending} yangi` : null}/>
        <StatCard label="Tasdiqlangan"   value={counts.approved||0}    sub="faol e'lonlar"         accent="#166534"/>
        <StatCard label="Rad etilgan"    value={counts.rejected||0}    sub="ko'rib chiqilgan"      accent="#9F1239"/>
      </div>

      {/* ── PENDING ALERT ── */}
      {(counts.pending||0) > 0 && (
        <div style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:14,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <PiWarningCircleDuotone size={22} style={{color:"#F97316",flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#92400E"}}>{counts.pending} ta e'lon ko'rib chiqishni kutmoqda</div>
            <div style={{fontSize:12,color:"#B45309"}}>Ularni ko'rish uchun "Kutilmoqda" tabiga o'ting</div>
          </div>
          <button onClick={()=>{ setStatusF("pending"); setPage(1); }}
            style={{padding:"7px 16px",borderRadius:10,background:"#F97316",color:"#fff",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",flexShrink:0}}>
            Ko'rish
          </button>
        </div>
      )}

      {/* ── TOOLBAR ── */}
      <div style={{background:"#fff",borderRadius:18,padding:"12px 16px",border:"1.5px solid #E9ECF2",marginBottom:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        {/* Search */}
        <div style={{position:"relative",flex:1,minWidth:180}}>
          <PiMagnifyingGlassDuotone size={15} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#CBD5E1",pointerEvents:"none"}}/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Sarlavha, kompaniya yoki foydalanuvchi..."
            style={{width:"100%",padding:"8px 10px 8px 32px",border:"1.5px solid #E9ECF2",borderRadius:10,fontSize:12,color:"#0F172A",background:"#F8FAFC",outline:"none"}}
            onFocus={e=>{e.target.style.borderColor="#6366F1";}}
            onBlur={e=>{e.target.style.borderColor="#E9ECF2";}}
          />
        </div>

        {/* Status tabs */}
        <div style={{display:"flex",gap:3,background:"#F8FAFC",borderRadius:10,padding:3,border:"1.5px solid #E9ECF2",flexWrap:"wrap"}}>
          {STATUS_TABS.map(t=>{
            const active = statusF===t.v;
            const cfg = ST[t.v];
            return (
              <button key={t.v} onClick={()=>{setStatusF(t.v);setPage(1);setSelected(new Set());}}
                style={{padding:"5px 12px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,transition:"all 0.15s",
                  background:active?"#0F172A":"transparent",color:active?"#fff":"#64748B"}}>
                {t.urgent && t.cnt>0 && <span style={{width:6,height:6,borderRadius:"50%",background:"#F97316",flexShrink:0}}/>}
                {t.l}
                <span style={{background:active?"rgba(255,255,255,0.2)":cfg?cfg.bg:"#F1F5F9",color:active?"#fff":cfg?cfg.tc:"#64748B",fontSize:10,fontWeight:800,padding:"1px 6px",borderRadius:99}}>
                  {t.cnt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div style={{position:"relative",display:"flex",alignItems:"center"}}>
          <PiCaretUpDownDuotone size={14} style={{position:"absolute",left:9,color:"#94A3B8",pointerEvents:"none"}}/>
          <select value={sort} onChange={e=>setSort(e.target.value)}
            style={{padding:"8px 12px 8px 28px",borderRadius:10,fontSize:12,fontWeight:600,border:"1.5px solid #E9ECF2",background:"#F8FAFC",color:"#0F172A",outline:"none",cursor:"pointer",appearance:"none"}}>
            <option value="newest">Yangi avval</option>
            <option value="oldest">Eski avval</option>
            <option value="views">Ko'rishlar ↓</option>
          </select>
        </div>

        <button onClick={fetchAds} title="Yangilash"
          style={{padding:"8px 10px",borderRadius:10,border:"1.5px solid #E9ECF2",background:"#F8FAFC",color:"#64748B",cursor:"pointer",display:"flex",alignItems:"center"}}>
          <PiArrowsClockwiseDuotone size={16}/>
        </button>
      </div>

      {/* ── BULK BAR ── */}
      {selected.size > 0 && (
        <div style={{background:"#EEF2FF",border:"1.5px solid #C7D2FE",borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:700,color:"#3730A3"}}>{selected.size} ta tanlandi</span>
          <button onClick={()=>bulkAction("approved")} style={{padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"1.5px solid #BBF7D0",background:"#F0FDF4",color:"#166534",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><PiCheckCircleDuotone size={14}/> Tasdiqlash</button>
          <button onClick={()=>bulkAction("rejected")} style={{padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"1.5px solid #FECDD3",background:"#FFF1F2",color:"#9F1239",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><PiProhibitDuotone size={14}/> Rad etish</button>
          <button onClick={()=>bulkAction("delete")}   style={{padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"1.5px solid #FECDD3",background:"#FFF1F2",color:"#9F1239",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><PiTrashDuotone size={14}/> O'chirish</button>
          <button onClick={()=>setSelected(new Set())} style={{padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:"1.5px solid #E9ECF2",background:"#fff",color:"#64748B",fontFamily:"inherit",marginLeft:"auto"}}>Bekor</button>
        </div>
      )}

      {/* ── TABLE ── */}
      <div style={{background:"#fff",borderRadius:18,border:"1.5px solid #E9ECF2",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        {loading ? (
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:240}}>
            <div style={{width:32,height:32,border:"3px solid #E9ECF2",borderTopColor:"#6366F1",borderRadius:"50%",animation:"aa-spin 0.8s linear infinite"}}/>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:760}}>
              <thead>
                <tr style={{background:"#F8FAFC"}}>
                  {[
                    {l:<input type="checkbox" checked={allChecked} ref={el=>{if(el)el.indeterminate=!allChecked&&someChecked;}} onChange={e=>toggleAll(e.target.checked)} style={{cursor:"pointer",accentColor:"#6366F1"}}/>, w:44},
                    {l:"Tur",        w:70},
                    {l:"E'lon",      w:"auto"},
                    {l:"Kim",        w:160},
                    {l:"Ko'rish",    w:80},
                    {l:"Sana",       w:100},
                    {l:"Holat",      w:130},
                    {l:"Amallar",    w:160},
                  ].map((h,i)=>(
                    <th key={i} style={{padding:"11px 12px",textAlign:i>=4&&i<=5?"right":i===7?"center":"left",fontSize:10,fontWeight:800,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:"1.5px solid #F1F5F9",width:h.w,whiteSpace:"nowrap"}}>
                      {h.l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageItems.length===0 ? (
                  <tr><td colSpan={8} style={{textAlign:"center",padding:"48px",color:"#CBD5E1",fontSize:14}}>
                    Hech narsa topilmadi
                  </td></tr>
                ) : pageItems.map(ad => {
                  const name = ad.type==="blogger"
                    ? `${ad.user?.firstName||""} ${ad.user?.lastName||""}`.trim() || "Foydalanuvchi"
                    : (ad.companyName || "Biznes");
                  const title = ad.title || ad.productName || name;
                  const isPending = ad.status === "pending";

                  return (
                    <tr key={ad._id}
                      className={`aa-row${selected.has(ad._id)?" aa-row-sel":""}`}
                      style={{borderBottom:"1.5px solid #F8FAFC",transition:"background 0.12s",background:isPending?"#FFFDF0":"#fff"}}
                    >
                      <td style={{padding:"12px"}}>
                        <input type="checkbox" checked={selected.has(ad._id)} onChange={e=>toggleOne(ad._id,e.target.checked)} style={{cursor:"pointer",accentColor:"#6366F1"}}/>
                      </td>
                      <td style={{padding:"12px 8px"}}>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:5,background:ad.type==="blogger"?"#EDE9FE":"#DBEAFE",color:ad.type==="blogger"?"#6D28D9":"#1E40AF"}}>
                          {ad.type==="blogger"?"Bloger":"Biznes"}
                        </span>
                      </td>
                      <td style={{padding:"12px"}}>
                        <div style={{fontWeight:700,color:"#0F172A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220,marginBottom:2}}>{title}</div>
                        <div style={{fontSize:11,color:"#94A3B8"}}>{(ad.platforms||ad.targetPlatforms||[]).slice(0,3).join(", ")||"—"}</div>
                      </td>
                      <td style={{padding:"12px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <Ava name={name} avatar={ad.user?.avatar} size={28}/>
                          <span style={{fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:110,fontSize:12}}>{name}</span>
                        </div>
                      </td>
                      <td style={{padding:"12px",textAlign:"right",color:"#64748B",fontVariantNumeric:"tabular-nums",fontSize:12}}>{fmtNum(ad.views)}</td>
                      <td style={{padding:"12px",textAlign:"right",color:"#94A3B8",fontSize:12,whiteSpace:"nowrap"}}>{fmtDate(ad.createdAt)}</td>
                      <td style={{padding:"12px"}}><Pill status={ad.status}/></td>
                      <td style={{padding:"12px"}}>
                        <div style={{display:"flex",justifyContent:"center",gap:4}}>
                          {isPending ? (
                            <>
                              <button onClick={()=>changeStatus(ad._id,"approved")} disabled={saving}
                                style={{padding:"5px 9px",borderRadius:8,border:"1.5px solid #22C55E",background:"#F0FDF4",color:"#166534",cursor:saving?"not-allowed":"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
                                <PiCheckCircleDuotone size={13}/> Tasdiqlash
                              </button>
                              <button onClick={()=>changeStatus(ad._id,"rejected")} disabled={saving}
                                style={{padding:"5px 9px",borderRadius:8,border:"1.5px solid #F43F5E",background:"#FFF1F2",color:"#9F1239",cursor:saving?"not-allowed":"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
                                <PiXCircleDuotone size={13}/> Rad
                              </button>
                            </>
                          ) : (
                            <>
                              <IconBtn onClick={()=>changeStatus(ad._id,"approved")} title="Tasdiqlash" hoverBg="#22C55E" hoverColor="#166534"><PiCheckCircleDuotone size={15}/></IconBtn>
                              <IconBtn onClick={()=>changeStatus(ad._id,"rejected")} title="Rad etish"  hoverBg="#F97316" hoverColor="#9A3412"><PiProhibitDuotone    size={15}/></IconBtn>
                            </>
                          )}
                          <IconBtn onClick={()=>deleteAd(ad._id)}  title="O'chirish" hoverBg="#F43F5E" hoverColor="#9F1239"><PiTrashDuotone size={15}/></IconBtn>
                          <IconBtn onClick={()=>setModal(ad)}       title="Ko'rish"   hoverBg="#6366F1" hoverColor="#3730A3"><PiEyeDuotone  size={15}/></IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderTop:"1.5px solid #F1F5F9",flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:12,color:"#94A3B8",fontWeight:600}}>{filtered.length} ta natija · {safePage}/{totalPages} sahifa</span>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <PgBtn disabled={safePage<=1} onClick={()=>setPage(p=>p-1)}>‹</PgBtn>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>{
              const show = totalPages<=7 || p===1 || p===totalPages || Math.abs(p-safePage)<=1;
              const dots  = Math.abs(p-safePage)===2 && totalPages>7;
              if (dots) return <span key={p} style={{color:"#CBD5E1",fontSize:13,padding:"0 2px"}}>…</span>;
              if (!show) return null;
              return <PgBtn key={p} active={p===safePage} onClick={()=>setPage(p)}>{p}</PgBtn>;
            })}
            <PgBtn disabled={safePage>=totalPages} onClick={()=>setPage(p=>p+1)}>›</PgBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PgBtn({ children, onClick, disabled, active }) {
  const [h,setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{minWidth:30,height:30,padding:"0 8px",borderRadius:9,border:`1.5px solid ${active?"#C7D2FE":h?"#E2E8F0":"#F1F5F9"}`,background:active?"#EEF2FF":h?"#F8FAFC":"#fff",fontSize:12,fontWeight:active?800:500,cursor:disabled?"not-allowed":"pointer",color:active?"#3730A3":"#64748B",opacity:disabled?0.4:1,transition:"all 0.14s",fontFamily:"inherit"}}>
      {children}
    </button>
  );
}
