import React, { useState, useMemo, useCallback, useRef } from "react";
import { toast } from "../../components/ui/toast";

/* ─── MOCK DATA ─── */
const INITIAL_ADS = [
  { id:1,  title:"iPhone 15 Pro Max batafsil sharhi",  price:15000000, author:"MrBeast",          status:"Kutilmoqda",  date:"2026-04-22", category:"Texnologiya", views:1240 },
  { id:2,  title:"MacBook M2 Pro — loyiq mi?",          price:12000000, author:"Marques Brownlee", status:"Faol",        date:"2026-04-21", category:"Texnologiya", views:8820 },
  { id:3,  title:"Kundalik vlog: Nyu-York",             price:400000,   author:"Casey Neistat",    status:"Rad etilgan", date:"2026-04-20", category:"Vlog",        views:302  },
  { id:4,  title:"Samsung Galaxy S24 Ultra test",       price:9500000,  author:"Linus Tech Tips",  status:"Kutilmoqda",  date:"2026-04-19", category:"Texnologiya", views:540  },
  { id:5,  title:"Ovqat pishirish — 10 daqiqada",      price:1200000,  author:"Tasty Uzbekistan", status:"Faol",        date:"2026-04-18", category:"Ovqat",       views:3100 },
  { id:6,  title:"Fitness dasturi: 30 kun",             price:2500000,  author:"AthleanX",         status:"Faol",        date:"2026-04-17", category:"Sport",       views:4500 },
  { id:7,  title:"DJI Mavic 3 Pro unboxing",            price:7800000,  author:"Peter McKinnon",   status:"Kutilmoqda",  date:"2026-04-16", category:"Foto/Video",  views:980  },
  { id:8,  title:"Python dasturlash asoslari",          price:3200000,  author:"Tech With Tim",    status:"Faol",        date:"2026-04-15", category:"Ta'lim",      views:6700 },
  { id:9,  title:"Sayohat: Maldiv orollari",            price:18000000, author:"Lost LeBlancs",    status:"Rad etilgan", date:"2026-04-14", category:"Sayohat",     views:220  },
  { id:10, title:"Sony WH-1000XM5 tahlil",              price:5500000,  author:"Headphones Addict",status:"Kutilmoqda",  date:"2026-04-13", category:"Audio",       views:410  },
  { id:11, title:"Minecraft survival challenge",        price:800000,   author:"Dream",            status:"Faol",        date:"2026-04-12", category:"O'yin",       views:9900 },
  { id:12, title:"Adobe Premiere Pro darslari",         price:4100000,  author:"Justin Odisho",    status:"Faol",        date:"2026-04-11", category:"Ta'lim",      views:2200 },
];

const PAGE_SIZE = 8;

/* ─── HELPERS ─── */
const fmt    = n => Number(n).toLocaleString("uz-UZ");
const fmtM   = n => (n / 1_000_000).toFixed(1) + "M";
const ini    = name => name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

const AVA_COLORS = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
const avaColor  = name => AVA_COLORS[name.charCodeAt(0) % AVA_COLORS.length];

const STATUS_CFG = {
  "Faol":        { bg:"#F0FDF4", tc:"#166534", dot:"#22C55E", bd:"#BBF7D0", label:"Faol"        },
  "Kutilmoqda":  { bg:"#FFF7ED", tc:"#9A3412", dot:"#F97316", bd:"#FED7AA", label:"Kutilmoqda"  },
  "Rad etilgan": { bg:"#FFF1F2", tc:"#9F1239", dot:"#F43F5E", bd:"#FECDD3", label:"Rad etilgan" },
};

/* ─── SMALL COMPONENTS ─── */
function Pill({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG["Kutilmoqda"];
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

function Ava({ name, size=32 }) {
  const col = avaColor(name);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:col+"22", border:`1.5px solid ${col}44`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.35, fontWeight:800, color:col,
    }}>{ini(name)}</div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background:"#fff", borderRadius:18, padding:"18px 22px",
      border:"1.5px solid #E9ECF2",
      boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{label}</div>
      <div style={{fontSize:26,fontWeight:800,color:accent||"#0F172A",lineHeight:1,marginBottom:4}}>{value}</div>
      {sub && <div style={{fontSize:12,color:"#94A3B8"}}>{sub}</div>}
    </div>
  );
}

function IconBtn({ onClick, title, icon, hoverBg, hoverColor }) {
  const [h,setH] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        width:30, height:30, borderRadius:8,
        border:`1.5px solid ${h ? hoverBg+"88" : "#E9ECF2"}`,
        background:h ? hoverBg+"22" : "#fff",
        color:h ? hoverColor : "#94A3B8",
        cursor:"pointer", display:"flex", alignItems:"center",
        justifyContent:"center", transition:"all 0.14s", flexShrink:0,
        fontFamily:"inherit",
      }}
    >{icon}</button>
  );
}


/* ─── DETAIL MODAL ─── */
function DetailModal({ ad, onClose, onApprove, onReject, onDelete }) {
  if (!ad) return null;
  const c = STATUS_CFG[ad.status] || STATUS_CFG["Kutilmoqda"];

  return (
    <div onClick={e => { if (e.target===e.currentTarget) onClose(); }} style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(15,23,42,0.55)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:24,
    }}>
      <div style={{
        background:"#fff", borderRadius:24, width:"100%", maxWidth:480,
        maxHeight:"90vh", display:"flex", flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.22)", overflow:"hidden",
      }}>
        {/* header */}
        <div style={{
          padding:"20px 24px 16px", borderBottom:"1px solid #F1F5F9",
          display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexShrink:0,
        }}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:"#0F172A",marginBottom:3}}>E'lon #{ad.id}</div>
            <div style={{fontSize:12,color:"#94A3B8"}}>{ad.category} · {ad.date}</div>
          </div>
          <button onClick={onClose} style={{
            width:32,height:32,borderRadius:10,border:"1.5px solid #E2E8F0",
            background:"#F8FAFC",cursor:"pointer",display:"flex",
            alignItems:"center",justifyContent:"center",fontSize:14,color:"#94A3B8",
            fontFamily:"inherit",
          }}>✕</button>
        </div>

        {/* body */}
        <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>
          {/* title */}
          <div style={{
            background:"#F8FAFC", border:"1.5px solid #F1F5F9",
            borderLeft:"3px solid #6366F1",
            borderRadius:"0 12px 12px 0", padding:"12px 16px", marginBottom:18,
            fontSize:15, fontWeight:700, color:"#0F172A", lineHeight:1.5,
          }}>{ad.title}</div>

          {/* author */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,padding:"12px 16px",background:"#F8FAFC",borderRadius:14,border:"1.5px solid #F1F5F9"}}>
            <Ava name={ad.author} size={44}/>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{ad.author}</div>
              <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>Bloger</div>
            </div>
          </div>

          {/* grid info */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            {[
              {icon:"💰", label:"Narx",       val:`${fmt(ad.price)} so'm`},
              {icon:"👁", label:"Ko'rishlar",  val:fmt(ad.views)},
              {icon:"🏷",  label:"Kategoriya", val:ad.category},
              {icon:"📅", label:"Sana",        val:ad.date},
            ].map(r=>(
              <div key={r.label} style={{background:"#F8FAFC",border:"1.5px solid #F1F5F9",borderRadius:12,padding:"11px 14px",display:"flex",alignItems:"flex-start",gap:9}}>
                <span style={{fontSize:18,marginTop:1}}>{r.icon}</span>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{r.label}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* status */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Joriy holat</div>
            <Pill status={ad.status}/>
          </div>

          {/* actions */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {label:"✓ Tasdiqlash", st:"Faol",        bg:"#F0FDF4",tc:"#166534",bd:"#22C55E"},
              {label:"✕ Rad etish",  st:"Rad etilgan", bg:"#FFF1F2",tc:"#9F1239",bd:"#F43F5E"},
            ].map(btn=>{
              const active = ad.status === btn.st;
              return (
                <button key={btn.st}
                  onClick={()=>{ btn.st==="Faol" ? onApprove(ad.id) : onReject(ad.id); }}
                  style={{
                    padding:"11px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",
                    border:`1.5px solid ${active ? btn.bd : "#E9ECF2"}`,
                    background:active ? btn.bg : "#fff",
                    color:active ? btn.tc : "#64748B",
                    fontSize:13,fontWeight:700,transition:"all 0.14s",
                  }}
                  onMouseEnter={e=>{ if(!active){e.currentTarget.style.borderColor=btn.bd;e.currentTarget.style.background=btn.bg+"66";}}}
                  onMouseLeave={e=>{ if(!active){e.currentTarget.style.borderColor="#E9ECF2";e.currentTarget.style.background="#fff";}}}
                >{btn.label}</button>
              );
            })}
          </div>

          <button
            onClick={()=>{ onDelete(ad.id); onClose(); }}
            style={{
              width:"100%",marginTop:8,padding:"11px",borderRadius:12,cursor:"pointer",
              border:"1.5px solid #FECDD3",background:"#FFF1F2",
              color:"#9F1239",fontSize:13,fontWeight:700,fontFamily:"inherit",
              transition:"all 0.14s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="#FFE4E6";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#FFF1F2";}}
          >🗑 E'lonni o'chirish</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function AdminAds() {
  const [ads, setAds]           = useState(INITIAL_ADS);
  const [search, setSearch]     = useState("");
  const [statusF, setStatusF]   = useState("all");
  const [sort, setSort]         = useState("newest");
  const [selected, setSelected] = useState(new Set());
  const [page, setPage]         = useState(1);
  const [modal, setModal]       = useState(null);
  const notify = useCallback((type, msg) => {
    if (type === "err") toast.error(msg);
    else if (type === "warn") toast.warning(msg);
    else toast.success(msg);
  }, []);

  /* filtered & sorted */
  const filtered = useMemo(()=>{
    const q = search.toLowerCase();
    let res = ads.filter(a=>{
      const mq = a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
      const ms = statusF==="all" || a.status===statusF;
      return mq && ms;
    });
    if (sort==="newest")     res.sort((a,b)=>new Date(b.date)-new Date(a.date));
    if (sort==="oldest")     res.sort((a,b)=>new Date(a.date)-new Date(b.date));
    if (sort==="price_desc") res.sort((a,b)=>b.price-a.price);
    if (sort==="price_asc")  res.sort((a,b)=>a.price-b.price);
    if (sort==="views")      res.sort((a,b)=>b.views-a.views);
    return res;
  },[ads,search,statusF,sort]);

  const totalPages = Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const safePage   = Math.min(page,totalPages);
  const pageItems  = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);

  /* actions */
  const updateStatus = useCallback((id, st)=>{
    setAds(p=>p.map(a=>a.id===id?{...a,status:st}:a));
    setModal(p=>p?.id===id?{...p,status:st}:p);
    notify(st==="Faol"?"ok":"warn", `Status: ${st}`);
  },[notify]);

  const deleteAd = useCallback((id)=>{
    setAds(p=>p.filter(a=>a.id!==id));
    setSelected(p=>{ const s=new Set(p); s.delete(id); return s; });
    setModal(p=>p?.id===id?null:p);
    notify("err","E'lon o'chirildi");
  },[notify]);

  const bulkAction = (action)=>{
    if (!selected.size) return;
    const cnt = selected.size;
    if (action==="delete"){
      setAds(p=>p.filter(a=>!selected.has(a.id)));
      notify("err",`${cnt} ta e'lon o'chirildi`);
    } else {
      setAds(p=>p.map(a=>selected.has(a.id)?{...a,status:action}:a));
      notify("ok",`${cnt} ta e'lon yangilandi`);
    }
    setSelected(new Set());
  };

  const toggleOne = (id,checked)=>setSelected(p=>{const s=new Set(p);checked?s.add(id):s.delete(id);return s;});
  const toggleAll = checked=>setSelected(p=>{const s=new Set(p);pageItems.forEach(a=>checked?s.add(a.id):s.delete(a.id));return s;});
  const allChecked  = pageItems.length>0 && pageItems.every(a=>selected.has(a.id));
  const someChecked = pageItems.some(a=>selected.has(a.id));

  /* stats */
  const faolC  = ads.filter(a=>a.status==="Faol").length;
  const waitC  = ads.filter(a=>a.status==="Kutilmoqda").length;
  const rejC   = ads.filter(a=>a.status==="Rad etilgan").length;
  const totalP = ads.reduce((s,a)=>s+a.price,0);

  const STATUS_TABS = [
    {v:"all",        l:"Barchasi",    count:ads.length},
    {v:"Kutilmoqda", l:"Kutilmoqda",  count:waitC},
    {v:"Faol",       l:"Faol",        count:faolC},
    {v:"Rad etilgan",l:"Rad etilgan", count:rejC},
  ];

  return (
    <div className="admin-ads-root" style={{fontFamily:"'Manrope',sans-serif",padding:"28px 28px 56px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .admin-ads-root *, .admin-ads-root *::before, .admin-ads-root *::after { box-sizing:border-box; }
        .admin-ads-root button, .admin-ads-root input, .admin-ads-root select { font-family:'Manrope',sans-serif; }
        .admin-ads-root ::-webkit-scrollbar { width:4px; height:4px; }
        .admin-ads-root ::-webkit-scrollbar-thumb { background:#DDE1EA; border-radius:4px; }
        @keyframes adsToastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .ads-row:hover { background:#FAFBFF !important; }
        .ads-row-sel { background:#EEF2FF !important; }
      `}</style>

      <DetailModal
        ad={modal} onClose={()=>setModal(null)}
        onApprove={id=>updateStatus(id,"Faol")}
        onReject={id=>updateStatus(id,"Rad etilgan")}
        onDelete={deleteAd}
      />

      {/* ── STAT CARDS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Jami e'lonlar"  value={ads.length}    sub="barcha holatlarda"      accent="#0F172A"/>
        <StatCard label="Faol"           value={faolC}         sub={`${ads.length?Math.round(faolC/ads.length*100):0}% ulushi`} accent="#166534"/>
        <StatCard label="Kutilmoqda"     value={waitC}         sub="ko'rib chiqish kerak"   accent="#9A3412"/>
        <StatCard label="Umumiy qiymat"  value={fmtM(totalP)}  sub="so'm"                   accent="#1D4ED8"/>
      </div>

      {/* ── TOOLBAR ── */}
      <div style={{
        background:"#fff", borderRadius:18, padding:"14px 18px",
        border:"1.5px solid #E9ECF2", marginBottom:14,
        display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
      }}>
        {/* search */}
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#CBD5E1",fontSize:15,pointerEvents:"none"}}>🔍</span>
          <input
            value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            placeholder="Sarlavha yoki bloger..."
            style={{
              width:"100%", padding:"9px 12px 9px 36px",
              border:"1.5px solid #E9ECF2", borderRadius:12,
              fontSize:13, color:"#0F172A", background:"#F8FAFC", outline:"none",
              transition:"border-color 0.15s",
            }}
            onFocus={e=>{e.target.style.borderColor="#6366F1";e.target.style.boxShadow="0 0 0 3px #6366F115";}}
            onBlur={e=>{e.target.style.borderColor="#E9ECF2";e.target.style.boxShadow="none";}}
          />
        </div>

        {/* status tabs */}
        <div style={{display:"flex",gap:4,background:"#F8FAFC",borderRadius:12,padding:4,border:"1.5px solid #E9ECF2"}}>
          {STATUS_TABS.map(t=>{
            const active = statusF===t.v;
            const dotCfg = STATUS_CFG[t.v];
            return (
              <button key={t.v}
                onClick={()=>{setStatusF(t.v);setPage(1);setSelected(new Set());}}
                style={{
                  padding:"6px 14px", borderRadius:9, fontSize:12, fontWeight:700,
                  cursor:"pointer", border:"none", transition:"all 0.15s", fontFamily:"inherit",
                  background:active?"#0F172A":"transparent",
                  color:active?"#fff":"#64748B",
                  display:"flex", alignItems:"center", gap:5,
                }}
              >
                {t.l}
                <span style={{
                  background:active?"rgba(255,255,255,0.2)":dotCfg?dotCfg.bg:"#F1F5F9",
                  color:active?"#fff":dotCfg?dotCfg.tc:"#64748B",
                  fontSize:10, fontWeight:800, padding:"1px 6px", borderRadius:99,
                }}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* sort */}
        <div style={{position:"relative"}}>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{
            padding:"9px 32px 9px 12px", borderRadius:12, fontSize:12, fontWeight:600,
            border:"1.5px solid #E9ECF2", background:"#F8FAFC", color:"#0F172A",
            outline:"none", cursor:"pointer", appearance:"none",
          }}>
            <option value="newest">Yangi avval</option>
            <option value="oldest">Eski avval</option>
            <option value="price_desc">Narx ↓</option>
            <option value="price_asc">Narx ↑</option>
            <option value="views">Ko'rishlar ↓</option>
          </select>
          <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"#94A3B8",fontSize:12}}>▾</span>
        </div>
      </div>

      {/* ── BULK BAR ── */}
      {selected.size>0 && (
        <div style={{
          background:"#EEF2FF", border:"1.5px solid #C7D2FE", borderRadius:14,
          padding:"10px 16px", display:"flex", alignItems:"center", gap:10,
          marginBottom:12, flexWrap:"wrap",
        }}>
          <span style={{fontSize:13,fontWeight:700,color:"#3730A3"}}>{selected.size} ta tanlandi</span>
          {[
            {l:"✓ Tasdiqlash", a:"Faol",        bg:"#F0FDF4",tc:"#166534",bd:"#BBF7D0"},
            {l:"✕ Rad etish",  a:"Rad etilgan", bg:"#FFF1F2",tc:"#9F1239",bd:"#FECDD3"},
            {l:"🗑 O'chirish",  a:"delete",      bg:"#FFF1F2",tc:"#9F1239",bd:"#FECDD3"},
          ].map(b=>(
            <button key={b.a} onClick={()=>bulkAction(b.a)} style={{
              padding:"6px 14px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",
              border:`1.5px solid ${b.bd}`,background:b.bg,color:b.tc,fontFamily:"inherit",
              transition:"all 0.14s",
            }}>{b.l}</button>
          ))}
          <button onClick={()=>setSelected(new Set())} style={{
            padding:"6px 14px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",
            border:"1.5px solid #E9ECF2",background:"#fff",color:"#64748B",fontFamily:"inherit",
            marginLeft:"auto",
          }}>Bekor</button>
        </div>
      )}

      {/* ── TABLE ── */}
      <div style={{background:"#fff",borderRadius:18,border:"1.5px solid #E9ECF2",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:720}}>
            <thead>
              <tr style={{background:"#F8FAFC"}}>
                {[
                  {label:<input type="checkbox" checked={allChecked} ref={el=>{if(el)el.indeterminate=!allChecked&&someChecked;}} onChange={e=>toggleAll(e.target.checked)} style={{cursor:"pointer",accentColor:"#6366F1"}}/>, w:44},
                  {label:"#",            w:48},
                  {label:"Sarlavha",     w:"auto"},
                  {label:"Bloger",       w:160},
                  {label:"Narx",         w:130},
                  {label:"Ko'rishlar",   w:100},
                  {label:"Sana",         w:100},
                  {label:"Holat",        w:130},
                  {label:"Amallar",      w:130},
                ].map((h,i)=>(
                  <th key={i} style={{
                    padding:"12px 14px", textAlign:i>=4&&i<=6?"right":i===8?"center":"left",
                    fontSize:10, fontWeight:800, color:"#94A3B8",
                    textTransform:"uppercase", letterSpacing:"0.07em",
                    borderBottom:"1.5px solid #F1F5F9", width:h.w,
                    whiteSpace:"nowrap",
                  }}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length===0 ? (
                <tr><td colSpan={9} style={{textAlign:"center",padding:"48px",color:"#CBD5E1",fontSize:14}}>
                  Hech narsa topilmadi
                </td></tr>
              ) : pageItems.map((ad,i)=>(
                <tr key={ad.id}
                  className={`ads-row${selected.has(ad.id)?" ads-row-sel":""}`}
                  style={{borderBottom:"1.5px solid #F8FAFC",transition:"background 0.12s",background:"#fff"}}
                >
                  <td style={{padding:"12px 14px"}}>
                    <input type="checkbox" checked={selected.has(ad.id)}
                      onChange={e=>toggleOne(ad.id,e.target.checked)}
                      style={{cursor:"pointer",accentColor:"#6366F1"}}
                    />
                  </td>
                  <td style={{padding:"12px 14px",color:"#CBD5E1",fontSize:12,fontWeight:700}}>
                    {(safePage-1)*PAGE_SIZE+i+1}
                  </td>
                  <td style={{padding:"12px 14px",maxWidth:240}}>
                    <div style={{fontWeight:700,color:"#0F172A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{ad.title}</div>
                    <div style={{fontSize:11,color:"#94A3B8"}}>{ad.category}</div>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Ava name={ad.author} size={30}/>
                      <span style={{fontWeight:600,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:110}}>{ad.author}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 14px",textAlign:"right",fontWeight:700,color:"#0F172A",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"}}>
                    {fmt(ad.price)} <span style={{fontSize:11,color:"#94A3B8",fontWeight:500}}>so'm</span>
                  </td>
                  <td style={{padding:"12px 14px",textAlign:"right",color:"#64748B",fontVariantNumeric:"tabular-nums"}}>
                    {fmt(ad.views)}
                  </td>
                  <td style={{padding:"12px 14px",textAlign:"right",color:"#94A3B8",fontSize:12,whiteSpace:"nowrap"}}>{ad.date}</td>
                  <td style={{padding:"12px 14px"}}>
                    <Pill status={ad.status}/>
                  </td>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",justifyContent:"center",gap:5}}>
                      <IconBtn onClick={()=>updateStatus(ad.id,"Faol")}        title="Tasdiqlash" hoverBg="#22C55E" hoverColor="#166534" icon="✓"/>
                      <IconBtn onClick={()=>updateStatus(ad.id,"Rad etilgan")} title="Rad etish"  hoverBg="#F97316" hoverColor="#9A3412" icon="✕"/>
                      <IconBtn onClick={()=>deleteAd(ad.id)}                   title="O'chirish"  hoverBg="#F43F5E" hoverColor="#9F1239" icon="🗑"/>
                      <IconBtn onClick={()=>setModal(ad)}                      title="Ko'rish"    hoverBg="#6366F1" hoverColor="#3730A3" icon="👁"/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"14px 18px", borderTop:"1.5px solid #F1F5F9", flexWrap:"wrap", gap:10,
        }}>
          <span style={{fontSize:12,color:"#94A3B8",fontWeight:600}}>
            {filtered.length} ta natija · {safePage}/{totalPages} sahifa
          </span>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <PgBtn disabled={safePage<=1}          onClick={()=>setPage(p=>p-1)}>‹</PgBtn>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>{
              const show = totalPages<=7 || p===1 || p===totalPages || Math.abs(p-safePage)<=1;
              const dots  = Math.abs(p-safePage)===2 && totalPages>7;
              if (dots) return <span key={p} style={{color:"#CBD5E1",fontSize:13,lineHeight:"30px",padding:"0 2px"}}>…</span>;
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
      style={{
        minWidth:30,height:30,padding:"0 8px",borderRadius:9,
        border:`1.5px solid ${active?"#C7D2FE":h?"#E2E8F0":"#F1F5F9"}`,
        background:active?"#EEF2FF":h?"#F8FAFC":"#fff",
        fontSize:12,fontWeight:active?800:500,cursor:disabled?"not-allowed":"pointer",
        color:active?"#3730A3":"#64748B",
        opacity:disabled?0.4:1,transition:"all 0.14s",fontFamily:"inherit",
      }}
    >{children}</button>
  );
}