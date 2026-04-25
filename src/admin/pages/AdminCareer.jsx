import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

/* ─────────── DATA ─────────── */
const VACANCIES = [
  { id:1, title:"Frontend Developer", icon:"💻", dept:"IT bo'limi",     exp:"2+ yil", skills:["React","TypeScript","Tailwind"] },
  { id:2, title:"UI/UX Designer",     icon:"🎨", dept:"Dizayn bo'limi", exp:"1+ yil", skills:["Figma","Prototyping","Research"] },
  { id:3, title:"Marketing Manager",  icon:"📣", dept:"Marketing",       exp:"3+ yil", skills:["SMM","Content","Analytics"] },
  { id:4, title:"Backend Developer",  icon:"🛠",  dept:"IT bo'limi",     exp:"2+ yil", skills:["Node.js","PostgreSQL","Docker"] },
  { id:5, title:"HR Specialist",      icon:"👥", dept:"HR bo'limi",      exp:"1+ yil", skills:["Recruitment","Onboarding"] },
  { id:6, title:"Accountant",         icon:"📊", dept:"Moliya",          exp:"2+ yil", skills:["1C","Excel","Soliqlar"] },
];

const INITIAL_APPS = [
  { id:101,vacId:1,name:"Sardor Aliyev",    phone:"+998 90 123 45 67",date:"2026-04-18",status:"Yangi",             msg:"React va Tailwind bo'yicha 2 yillik tajribam bor. Vite va Axios bilan ko'p ishlaganman." },
  { id:102,vacId:2,name:"Malika Karimova",  phone:"+998 93 987 65 43",date:"2026-04-19",status:"Ko'rib chiqilmoqda",msg:"Figma va Prototyping bo'yicha ishlaganman. User research tajribam bor." },
  { id:103,vacId:3,name:"Bekzod Tursunov",  phone:"+998 97 111 22 33",date:"2026-04-20",status:"Rad etildi",        msg:"SMM bo'yicha jamoa boshqarganman. 3 yillik tajribam bor." },
  { id:104,vacId:1,name:"Jasur Qodirov",    phone:"+998 99 444 55 66",date:"2026-04-20",status:"Yangi",             msg:"Vite va Axios bilan ko'p ishlaganman. TypeScript ham bilaman." },
  { id:105,vacId:1,name:"Dilnoza Yusupova", phone:"+998 91 222 33 44",date:"2026-04-21",status:"Qabul qilindi",     msg:"3 yil React bilan ishlaganman, Redux, Zustand bilaman." },
  { id:106,vacId:4,name:"Otabek Nazarov",   phone:"+998 90 555 66 77",date:"2026-04-19",status:"Ko'rib chiqilmoqda",msg:"Node.js va PostgreSQL bilan 2 yil ishlashim bor." },
  { id:107,vacId:2,name:"Zulfiya Rashidova",phone:"+998 93 888 99 00",date:"2026-04-22",status:"Yangi",             msg:"Figma, Adobe XD ishlataman. Prototyping va UI testing tajribam bor." },
  { id:108,vacId:5,name:"Kamola Mirzayeva", phone:"+998 99 777 55 33",date:"2026-04-21",status:"Yangi",             msg:"Recruitment va onboarding jarayonlarini bilaman." },
  { id:109,vacId:4,name:"Sherzod Xolmatov", phone:"+998 97 333 44 55",date:"2026-04-22",status:"Yangi",             msg:"Docker va Kubernetes bilan ishlash tajribam bor." },
  { id:110,vacId:1,name:"Aziz Toshmatov",   phone:"+998 90 111 00 99",date:"2026-04-23",status:"Ko'rib chiqilmoqda",msg:"React Native ham bilaman. 2 yil tajribam bor." },
];

const STATUS_LIST = ["Yangi","Ko'rib chiqilmoqda","Qabul qilindi","Rad etildi"];
const SC = {
  "Yangi":             {bg:"#EEF2FF",tc:"#3730A3",dot:"#6366F1",bd:"#C7D2FE"},
  "Ko'rib chiqilmoqda":{bg:"#FFF7ED",tc:"#9A3412",dot:"#F97316",bd:"#FED7AA"},
  "Qabul qilindi":     {bg:"#F0FDF4",tc:"#166534",dot:"#22C55E",bd:"#BBF7D0"},
  "Rad etildi":        {bg:"#FFF1F2",tc:"#9F1239",dot:"#F43F5E",bd:"#FECDD3"},
};

/* ─── helpers ─── */
const ini = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const PALETTE = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
const avaColor = name => PALETTE[name.charCodeAt(0) % PALETTE.length];

/* ─── small shared pieces ─── */
function Pill({ status }) {
  const c = SC[status] || SC["Yangi"];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:c.bg, color:c.tc, border:`1px solid ${c.bd}`,
      padding:"3px 10px", borderRadius:99,
      fontSize:11, fontWeight:700, whiteSpace:"nowrap",
    }}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {status}
    </span>
  );
}

function Ava({ name, size=40, fz=13 }) {
  const col = avaColor(name);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:col+"1C", border:`2px solid ${col}44`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:fz, fontWeight:800, color:col, letterSpacing:"0.02em",
    }}>{ini(name)}</div>
  );
}

/* ─────────── PORTAL MODAL ─────────────────────────────────────
   Uses createPortal → mounts directly on document.body
   → NOT clipped by sidebar's overflow/transform  */
function PortalModal({ onClose, children }) {
  const overlay = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", top:0, left:0, right:0, bottom:0,
        zIndex:99999,                        /* above everything */
        background:"rgba(15,23,42,0.52)",
        backdropFilter:"blur(4px)",
        WebkitBackdropFilter:"blur(4px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"24px",
      }}
    >
      <div style={{
        background:"#fff",
        borderRadius:24,
        width:"100%",
        maxWidth:540,
        /* key: height relative to viewport, not parent */
        maxHeight:"90vh",
        display:"flex",
        flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.24)",
        overflow:"hidden",
      }}>
        {children}
      </div>
    </div>
  );
  return ReactDOM.createPortal(overlay, document.body);
}

function MHead({ title, sub, onClose }) {
  return (
    <div style={{
      padding:"22px 26px 18px",
      borderBottom:"1px solid #F1F5F9",
      display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      flexShrink:0,
    }}>
      <div>
        <div style={{fontSize:17,fontWeight:800,color:"#0F172A",marginBottom:sub?3:0}}>{title}</div>
        {sub && <div style={{fontSize:12,color:"#94A3B8"}}>{sub}</div>}
      </div>
      <button onClick={onClose} style={{
        width:32, height:32, borderRadius:10,
        border:"1.5px solid #E2E8F0", background:"#F8FAFC",
        cursor:"pointer", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:14, color:"#94A3B8", flexShrink:0,
      }}>✕</button>
    </div>
  );
}

/* ─── Vacancy card — horizontal ─── */
function VacCard({ vac, apps, onClick }) {
  const total  = apps.filter(a=>a.vacId===vac.id).length;
  const newC   = apps.filter(a=>a.vacId===vac.id&&a.status==="Yangi").length;
  const accept = apps.filter(a=>a.vacId===vac.id&&a.status==="Qabul qilindi").length;
  const reject = apps.filter(a=>a.vacId===vac.id&&a.status==="Rad etildi").length;
  const [h,setH] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      style={{
        background:h?"#FAFBFF":"#fff",
        border:`1.5px solid ${h?"#C7D2FE":"#E9ECF2"}`,
        borderRadius:18, padding:"18px 22px",
        cursor:"pointer", transition:"all 0.18s ease",
        transform:h?"translateY(-1px)":"none",
        boxShadow:h?"0 8px 28px rgba(99,102,241,0.10)":"0 1px 4px rgba(0,0,0,0.04)",
        display:"flex", alignItems:"center", gap:18,
      }}
    >
      <div style={{
        width:54, height:54, borderRadius:15, flexShrink:0,
        background:"#F1F5F9",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
      }}>{vac.icon}</div>

      <div style={{flex:1, minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
          <span style={{fontSize:15,fontWeight:800,color:"#0F172A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {vac.title}
          </span>
          {newC>0 && (
            <span style={{
              background:"#EEF2FF",color:"#3730A3",border:"1px solid #C7D2FE",
              fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,flexShrink:0,
            }}>{newC} yangi</span>
          )}
        </div>
        <div style={{fontSize:12,color:"#94A3B8",marginBottom:10}}>
          {vac.dept} · {vac.exp} tajriba
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {vac.skills.map(s=>(
            <span key={s} style={{
              fontSize:11,padding:"2px 9px",borderRadius:6,
              background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#64748B",
            }}>{s}</span>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:8,flexShrink:0}}>
        {[
          {v:total, l:"Jami",  bg:"#F1F5F9",tc:"#475569"},
          {v:newC,  l:"Yangi", bg:"#EEF2FF",tc:"#3730A3"},
          {v:accept,l:"Qabul", bg:"#F0FDF4",tc:"#166534"},
          {v:reject,l:"Rad",   bg:"#FFF1F2",tc:"#9F1239"},
        ].map(s=>(
          <div key={s.l} style={{
            textAlign:"center",background:s.bg,borderRadius:10,
            padding:"7px 11px",minWidth:44,
          }}>
            <div style={{fontSize:18,fontWeight:800,color:s.tc,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9,fontWeight:700,color:s.tc+"99",marginTop:2,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{
        width:34,height:34,borderRadius:10,flexShrink:0,
        background:h?"#6366F1":"#F1F5F9",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:20,color:h?"#fff":"#94A3B8",transition:"all 0.18s",
      }}>›</div>
    </div>
  );
}

/* ─── Vacancy modal (list of applicants) ─── */
function VacModal({ vac, apps, onClose, onPick }) {
  const list = apps.filter(a=>a.vacId===vac.id);
  const stats=[
    {l:"Jami", v:list.length,                                        bg:"#F1F5F9",tc:"#475569"},
    {l:"Yangi",v:list.filter(a=>a.status==="Yangi").length,          bg:"#EEF2FF",tc:"#3730A3"},
    {l:"Qabul",v:list.filter(a=>a.status==="Qabul qilindi").length,  bg:"#F0FDF4",tc:"#166534"},
    {l:"Rad",  v:list.filter(a=>a.status==="Rad etildi").length,     bg:"#FFF1F2",tc:"#9F1239"},
  ];

  return (
    <PortalModal onClose={onClose}>
      <MHead title={`${vac.icon} ${vac.title}`} sub={`${vac.dept} · ${vac.exp} tajriba`} onClose={onClose}/>

      <div style={{display:"flex",gap:10,padding:"16px 26px 0",flexShrink:0}}>
        {stats.map(s=>(
          <div key={s.l} style={{flex:1,textAlign:"center",background:s.bg,borderRadius:12,padding:"10px 8px"}}>
            <div style={{fontSize:20,fontWeight:800,color:s.tc,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9,color:s.tc+"88",fontWeight:700,marginTop:3,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"12px 26px 0",display:"flex",flexWrap:"wrap",gap:6,flexShrink:0}}>
        {vac.skills.map(s=>(
          <span key={s} style={{fontSize:11,padding:"3px 10px",borderRadius:6,background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#64748B"}}>{s}</span>
        ))}
      </div>

      <div style={{overflowY:"auto",flex:1,padding:"14px 26px 26px"}}>
        {list.length===0
          ? <div style={{textAlign:"center",padding:"2.5rem",color:"#CBD5E1",fontSize:14}}>Hali ariza yo'q</div>
          : <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {list.map(app=>(
                <div key={app.id} onClick={()=>onPick(app)}
                  style={{
                    display:"flex",alignItems:"center",gap:12,
                    padding:"12px 14px",borderRadius:14,cursor:"pointer",
                    border:"1.5px solid #F1F5F9",background:"#FAFAFA",
                    transition:"all 0.14s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor="#C7D2FE";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#FAFAFA";e.currentTarget.style.borderColor="#F1F5F9";}}
                >
                  <Ava name={app.name} size={40} fz={13}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{app.name}</div>
                    <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{app.phone} · {app.date}</div>
                  </div>
                  <Pill status={app.status}/>
                  <span style={{color:"#CBD5E1",fontSize:20,marginLeft:4}}>›</span>
                </div>
              ))}
            </div>
        }
      </div>
    </PortalModal>
  );
}

/* ─── Applicant detail modal ─── */
function AppModal({ app, vac, onClose, onChange }) {
  return (
    <PortalModal onClose={onClose}>
      <MHead title="Nomzod ma'lumotlari" onClose={onClose}/>

      {/* hero */}
      <div style={{
        padding:"20px 26px 18px",
        background:"linear-gradient(135deg,#F8FAFF,#F1F5F9)",
        borderBottom:"1px solid #F1F5F9", flexShrink:0,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <Ava name={app.name} size={58} fz={19}/>
          <div style={{flex:1}}>
            <div style={{fontSize:20,fontWeight:800,color:"#0F172A",marginBottom:3}}>{app.name}</div>
            <div style={{fontSize:13,color:"#6366F1",fontWeight:700,marginBottom:8}}>{vac?.title}</div>
            <Pill status={app.status}/>
          </div>
        </div>
      </div>

      {/* scrollable body */}
      <div style={{overflowY:"auto",flex:1,padding:"20px 26px 28px"}}>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          {[
            {icon:"📞",label:"Telefon",     val:app.phone},
            {icon:"📅",label:"Ariza sanasi",val:app.date},
            {icon:"🏢",label:"Bo'lim",      val:vac?.dept||"—"},
            {icon:"⏱", label:"Tajriba",     val:vac?.exp||"—"},
          ].map(r=>(
            <div key={r.label} style={{
              background:"#F8FAFC",border:"1px solid #F1F5F9",
              borderRadius:12,padding:"11px 13px",
              display:"flex",alignItems:"flex-start",gap:9,
            }}>
              <span style={{fontSize:16,marginTop:1}}>{r.icon}</span>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{r.label}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#1E293B"}}>{r.val}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginBottom:22}}>
          <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>
            Motivatsiya xabari
          </div>
          <div style={{
            background:"#F8FAFC",border:"1px solid #E2E8F0",
            borderLeft:"3px solid #6366F1",borderRadius:"0 12px 12px 0",
            padding:"13px 16px",fontSize:14,color:"#475569",lineHeight:1.75,fontStyle:"italic",
          }}>"{app.msg}"</div>
        </div>

        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>
            Statusni yangilash
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {STATUS_LIST.map(st=>{
              const c=SC[st]; const active=app.status===st;
              return (
                <button key={st} onClick={()=>onChange(app.id,st)} style={{
                  padding:"11px 13px",borderRadius:12,cursor:"pointer",
                  border:`1.5px solid ${active?c.dot:"#E9ECF2"}`,
                  background:active?c.bg:"#fff",
                  color:active?c.tc:"#64748B",
                  fontSize:12,fontWeight:active?700:500,
                  display:"flex",alignItems:"center",gap:7,
                  transition:"all 0.15s",fontFamily:"inherit",
                }}
                  onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor=c.dot;e.currentTarget.style.background=c.bg+"88";}}}
                  onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor="#E9ECF2";e.currentTarget.style.background="#fff";}}}
                >
                  <span style={{width:8,height:8,borderRadius:"50%",background:active?c.dot:"#CBD5E1",flexShrink:0}}/>
                  <span style={{flex:1,textAlign:"left"}}>{st}</span>
                  {active&&<span>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PortalModal>
  );
}

/* ─── All-apps tab row ─── */
function AppRow({ app, vac, onClick }) {
  const [h,setH]=useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:"flex",alignItems:"center",gap:12,
        padding:"13px 16px",borderRadius:14,cursor:"pointer",
        border:`1.5px solid ${h?"#C7D2FE":"#E9ECF2"}`,
        background:h?"#FAFBFF":"#fff",
        boxShadow:h?"0 4px 16px rgba(99,102,241,0.08)":"none",
        transition:"all 0.15s",
      }}
    >
      <Ava name={app.name} size={40} fz={13}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{app.name}</div>
        <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{vac?.title} · {app.phone}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
        <Pill status={app.status}/>
        <span style={{fontSize:11,color:"#CBD5E1"}}>{app.date}</span>
      </div>
    </div>
  );
}

/* ─────────── MAIN COMPONENT ─────────── */
export default function AdminCareer() {
  const [apps,setApps]     = useState(INITIAL_APPS);
  const [tab,setTab]       = useState("vac");
  const [selVac,setSelVac] = useState(null);
  const [selApp,setSelApp] = useState(null);
  const [search,setSearch] = useState("");

  const changeStatus = (id, st) => {
    setApps(p => p.map(a => a.id===id ? {...a,status:st} : a));
    setSelApp(p => p?.id===id ? {...p,status:st} : p);
  };

  const filtered = useMemo(()=>
    apps.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
  ,[apps,search]);

  return (
    <>
     <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  .admin-career-root *, .admin-career-root *::before, .admin-career-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }
  .admin-career-root button { font-family: 'Manrope', sans-serif; }
  .admin-career-root input  { font-family: 'Manrope', sans-serif; }
  .admin-career-root ::-webkit-scrollbar { width: 4px; }
  .admin-career-root ::-webkit-scrollbar-thumb { background: #DDE1EA; border-radius: 4px; }
`}</style>

    <div style={{ fontFamily:"'Manrope',sans-serif", padding:"28px 28px 56px" }}>
        <div style={{maxWidth:900, margin:"0 auto"}}>

          {/* header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:800,color:"#0F172A",letterSpacing:"-0.03em",marginBottom:4}}>
                HR boshqaruvi
              </h1>
              <p style={{fontSize:13,color:"#94A3B8"}}>Karyera bo'limi · vakansiyalar va arizalar</p>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[
                {l:"Jami", v:apps.length,                                          bg:"#fff",   tc:"#0F172A",bd:"#E9ECF2"},
                {l:"Yangi",v:apps.filter(a=>a.status==="Yangi").length,            bg:"#EEF2FF",tc:"#3730A3",bd:"#C7D2FE"},
                {l:"Qabul",v:apps.filter(a=>a.status==="Qabul qilindi").length,    bg:"#F0FDF4",tc:"#166534",bd:"#BBF7D0"},
              ].map(s=>(
                <div key={s.l} style={{
                  textAlign:"center", background:s.bg,
                  border:`1.5px solid ${s.bd}`, borderRadius:14,
                  padding:"10px 18px", minWidth:64,
                }}>
                  <div style={{fontSize:9,fontWeight:700,color:s.tc+"88",textTransform:"uppercase",letterSpacing:"0.07em"}}>{s.l}</div>
                  <div style={{fontSize:22,fontWeight:800,color:s.tc,lineHeight:1.1,marginTop:2}}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* tabs */}
          <div style={{
            display:"inline-flex", background:"#fff",
            border:"1.5px solid #E9ECF2", borderRadius:12,
            padding:4, marginBottom:20, gap:4,
          }}>
            {[["vac","Vakansiyalar"],["apps","Barcha arizalar"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{
                padding:"8px 22px", borderRadius:9, border:"none",
                background:tab===k?"#0F172A":"transparent",
                color:tab===k?"#fff":"#94A3B8",
                fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.18s",
              }}>{l}</button>
            ))}
          </div>

          {/* vacancies */}
          {tab==="vac" && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {VACANCIES.map(v=>(
                <VacCard key={v.id} vac={v} apps={apps} onClick={()=>setSelVac(v)}/>
              ))}
            </div>
          )}

          {/* all apps */}
          {tab==="apps" && (
            <div>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Ism bo'yicha qidiruv..."
                style={{
                  width:"100%", padding:"12px 16px", marginBottom:14,
                  border:"1.5px solid #E9ECF2", borderRadius:12,
                  fontSize:14, outline:"none", background:"#fff", color:"#0F172A",
                }}
                onFocus={e=>{e.target.style.borderColor="#6366F1";e.target.style.boxShadow="0 0 0 3px #6366F11A";}}
                onBlur={e=>{e.target.style.borderColor="#E9ECF2";e.target.style.boxShadow="none";}}
              />
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {filtered.map(app=>(
                  <AppRow key={app.id} app={app}
                    vac={VACANCIES.find(v=>v.id===app.vacId)}
                    onClick={()=>setSelApp(app)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals — rendered into document.body via portal */}
      {selVac && !selApp && (
        <VacModal
          vac={selVac} apps={apps}
          onClose={()=>setSelVac(null)}
          onPick={a=>setSelApp(a)}
        />
      )}
      {selApp && (
        <AppModal
          app={selApp}
          vac={VACANCIES.find(v=>v.id===selApp.vacId)}
          onClose={()=>setSelApp(null)}
          onChange={changeStatus}
        />
      )}
    </>
  );
}