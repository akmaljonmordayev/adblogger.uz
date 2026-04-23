import { useState } from "react";

const AV = [
  ["#e8eeff","#3C3489"],["#e8f5f0","#085041"],["#fde8e8","#c0392b"],
  ["#fff8e8","#854F0B"],["#fde8f3","#72243E"],["#e8f8f5","#0f6e56"],
  ["#f0e8ff","#534AB7"],["#fff0e8","#993C1D"],["#e6f1fb","#0C447C"],
];

const CAT_S = {
  "Sport":       ["#e8f5f0","#085041"],
  "Oziq-ovqat":  ["#fff8e8","#854F0B"],
  "Telekom":     ["#e8eeff","#3C3489"],
  "Moda":        ["#fde8f3","#72243E"],
  "Bank":        ["#e6f1fb","#0C447C"],
  "Texnologiya": ["#f0e8ff","#534AB7"],
  "Sog'liq":    ["#e8f5f0","#0f6e56"],
  "Savdo":       ["#fff0e8","#993C1D"],
  "IT":          ["#ede9fe","#5b21b6"],
};

const ALL = [
  {id:1, n:"Nike Uzbekistan",    e:"amir@nike.uz",             cat:"Sport",       st:"Faol",       b:85,  sp:62,  c:22, d:"2024-01-15"},
  {id:2, n:"Coca-Cola UZ",       e:"promo@coca-cola.uz",        cat:"Oziq-ovqat",  st:"Faol",       b:120, sp:98,  c:18, d:"2023-12-10"},
  {id:3, n:"Beeline Uzbekistan", e:"digital@beeline.uz",        cat:"Telekom",     st:"Faol",       b:200, sp:145, c:27, d:"2023-09-05"},
  {id:4, n:"Zara Official UZ",   e:"zara@zara.uz",              cat:"Moda",        st:"Faol",       b:55,  sp:31,  c:11, d:"2023-11-20"},
  {id:5, n:"Payme",              e:"marketing@payme.uz",        cat:"Bank",        st:"Faol",       b:75,  sp:58,  c:15, d:"2024-02-08"},
  {id:6, n:"Artel Electronics",  e:"pr@artel.uz",               cat:"Texnologiya", st:"Faol",       b:40,  sp:22,  c:9,  d:"2024-03-14"},
  {id:7, n:"MyFitness",          e:"info@myfitness.uz",         cat:"Sport",       st:"Kutilmoqda", b:15,  sp:0,   c:0,  d:"2024-07-01"},
  {id:8, n:"UzCard",             e:"ads@uzcard.uz",             cat:"Bank",        st:"Faol",       b:90,  sp:67,  c:20, d:"2024-01-22"},
  {id:9, n:"Hummo",              e:"media@hummo.uz",            cat:"Bank",        st:"Faol",       b:60,  sp:44,  c:13, d:"2024-02-28"},
  {id:10,n:"Nutrilife UZ",       e:"nutrilife@mail.ru",         cat:"Sog'liq",    st:"Kutilmoqda", b:8,   sp:0,   c:0,  d:"2024-06-15"},
  {id:11,n:"Pepsi UZ",           e:"pepsi@pepsiuz.com",         cat:"Oziq-ovqat",  st:"Faol",       b:70,  sp:52,  c:16, d:"2023-10-11"},
  {id:12,n:"Click UZ",           e:"ads@click.uz",              cat:"Bank",        st:"Faol",       b:55,  sp:41,  c:12, d:"2024-01-30"},
  {id:13,n:"Nestle Uzbekistan",  e:"promo@nestle.uz",           cat:"Oziq-ovqat",  st:"Faol",       b:95,  sp:78,  c:21, d:"2023-08-22"},
  {id:14,n:"TechHub Tashkent",   e:"hello@techhub.uz",          cat:"Texnologiya", st:"Bloklangan", b:12,  sp:3,   c:2,  d:"2024-03-20"},
  {id:15,n:"Husan",              e:"husan@gmail.com",           cat:"Savdo",       st:"Faol",       b:25,  sp:11,  c:4,  d:"2024-07-10"},
  {id:16,n:"Akmal Mordayev",     e:"akmal.mordayev@mail.ru",   cat:"Texnologiya",  st:"Faol", b:18,  sp:0,   c:0,  d:"2024-07-17"},
];


const CATS = ["Sport","Oziq-ovqat","Telekom","Moda","Bank","Texnologiya","Sog'liq","Savdo","IT"];
const PER  = 8;

function ini(n) { return n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }
function pct(b,s) { return b>0 ? Math.round(s/b*100) : 0; }

const ST = {
  "Faol":        { color:"#15803d", dot:"#22c55e", bg:"#dcfce7" },
  "Kutilmoqda":  { color:"#92400e", dot:"#f59e0b", bg:"#fef9c3" },
  "Bloklangan":  { color:"#991b1b", dot:"#ef4444", bg:"#fee2e2" },
};

const BASE = { minHeight:"100vh", padding:"28px 32px", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#f4f6fb" };
const CARD = { background:"#fff", border:"1px solid #e5e7eb", borderRadius:14 };
const INP  = { background:"#fff", border:"1px solid #e5e7eb", borderRadius:9, height:36, padding:"0 12px", fontSize:13, color:"#111827", fontFamily:"inherit", outline:"none" };
const TH   = { padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.5px", borderBottom:"1px solid #f3f4f6", cursor:"pointer", userSelect:"none", whiteSpace:"nowrap" };
const TD   = { padding:"11px 14px", borderBottom:"1px solid #f9fafb", verticalAlign:"middle", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" };

export default function BusinessesPage() {
  const [data,   setData]   = useState(ALL);
  const [search, setSearch] = useState("");
  const [fcat,   setFcat]   = useState("");
  const [fst,    setFst]    = useState("");
  const [sk,     setSk]     = useState("d");
  const [sd,     setSd]     = useState(-1);
  const [pg,     setPg]     = useState(1);
  const [sel,    setSel]    = useState(new Set());

  const doSort = k => {
    if (sk===k) setSd(d=>d*-1); else { setSk(k); setSd(-1); }
    setPg(1);
  };
  const toggleStatus = id =>
    setData(p => p.map(d => d.id===id ? {...d, st: d.st==="Bloklangan"?"Faol":"Bloklangan"} : d));
  const toggleSel = id =>
    setSel(p => { const s=new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });

  const filtered = data
    .filter(d => {
      if (search && !d.n.toLowerCase().includes(search.toLowerCase()) && !d.e.toLowerCase().includes(search.toLowerCase())) return false;
      if (fcat && d.cat!==fcat) return false;
      if (fst  && d.st!==fst)  return false;
      return true;
    })
    .sort((a,b) => {
      const av=a[sk], bv=b[sk];
      return typeof av==="string" ? av.localeCompare(bv)*sd : (av-bv)*sd;
    });

  const pages = Math.ceil(filtered.length/PER) || 1;
  const curPg = Math.min(pg, pages);
  const slice = filtered.slice((curPg-1)*PER, curPg*PER);
  const Arr   = k => sk===k ? (sd===1?" ↑":" ↓") : "";

  const stats = [
    { l:"Jami",       v:data.length,                               c:"#111827" },
    { l:"Faol",       v:data.filter(d=>d.st==="Faol").length,      c:"#15803d" },
    { l:"Kutilmoqda", v:data.filter(d=>d.st==="Kutilmoqda").length, c:"#92400e" },
    { l:"Bloklangan", v:data.filter(d=>d.st==="Bloklangan").length, c:"#991b1b" },
  ];

  return (
    <div style={BASE}>

      {/* ── Header ── */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:22}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:"#111827",letterSpacing:"-0.4px"}}>Biznesmenlar</div>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:3}}>Reklam beruvchi kompaniyalar va shaxslar</div>
        </div>
        <button style={{background:"#111827",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
          + Yangi qo'shish
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        {stats.map(s => (
          <div key={s.l} style={{...CARD, padding:"16px 18px"}}>
            <div style={{fontSize:11,color:"#9ca3af",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:7}}>{s.l}</div>
            <div style={{fontSize:30,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
        <div style={{...INP, display:"flex", alignItems:"center", gap:8, width:210, padding:"0 12px"}}>
          <span style={{color:"#9ca3af",fontSize:14,flexShrink:0}}>⌕</span>
          <input
            placeholder="Qidirish..."
            value={search}
            onChange={e=>{setSearch(e.target.value); setPg(1);}}
            style={{background:"none",border:"none",outline:"none",color:"#111827",fontSize:13,fontFamily:"inherit",width:"100%"}}
          />
        </div>
        <select value={fcat} onChange={e=>{setFcat(e.target.value); setPg(1);}} style={INP}>
          <option value="">Barcha kategoriya</option>
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={fst} onChange={e=>{setFst(e.target.value); setPg(1);}} style={INP}>
          <option value="">Barcha holat</option>
          <option>Faol</option>
          <option>Kutilmoqda</option>
          <option>Bloklangan</option>
        </select>
        {sel.size > 0 && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"#f3f0ff",border:"1px solid #ddd6fe",borderRadius:9}}>
            <span style={{fontSize:12,color:"#5b21b6",fontWeight:600}}>{sel.size} ta tanlandi</span>
            <button onClick={()=>setSel(new Set())} style={{background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontSize:14,lineHeight:1}}>✕</button>
          </div>
        )}
        <span style={{marginLeft:"auto",fontSize:12,color:"#9ca3af"}}>{filtered.length} ta natija</span>
      </div>

      {/* ── Table ── */}
      <div style={CARD}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
            <thead>
              <tr>
                <th style={{...TH,width:40}}>
                  <input type="checkbox" style={{accentColor:"#7c3aed"}} onChange={e=>{
                    const ids = slice.map(d=>d.id);
                    setSel(p=>{ const s=new Set(p); ids.forEach(id=>e.target.checked?s.add(id):s.delete(id)); return s; });
                  }}/>
                </th>
                {[
                  ["n",  "Biznesmen",  190],
                  ["cat","Kategoriya", 105],
                  ["st", "Holat",      105],
                  ["b",  "Byudjet",     90],
                  ["c",  "Kampaniya",   90],
                  ["sp", "Sarflangan", 135],
                  ["d",  "Sana",       100],
                ].map(([k,l,w]) => (
                  <th key={k} style={{...TH,width:w}} onClick={()=>doSort(k)}
                    onMouseEnter={e=>e.target.style.color="#374151"}
                    onMouseLeave={e=>e.target.style.color="#9ca3af"}>
                    {l}{Arr(k)}
                  </th>
                ))}
                <th style={{...TH,width:120}}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {slice.map(d => {
                const [bg, tc] = AV[(d.id-1) % AV.length];
                const p        = pct(d.b, d.sp);
                const bc       = p>80 ? "#16a34a" : p>40 ? "#2563eb" : "#d97706";
                const [cbg,ctc]= CAT_S[d.cat] || ["#f3f4f6","#374151"];
                const ss       = ST[d.st];
                const isSel    = sel.has(d.id);
                return (
                  <tr key={d.id}
                    style={{background: isSel ? "#f5f3ff" : "#fff"}}
                    onMouseEnter={e => !isSel && (e.currentTarget.style.background="#fafafa")}
                    onMouseLeave={e => !isSel && (e.currentTarget.style.background="#fff")}>
                    <td style={TD}>
                      <input type="checkbox" style={{accentColor:"#7c3aed"}} checked={isSel} onChange={()=>toggleSel(d.id)}/>
                    </td>
                    <td style={TD}>
                      <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
                        <div style={{width:36,height:36,borderRadius:10,background:bg,color:tc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>
                          {ini(d.n)}
                        </div>
                        <div style={{minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.n}</div>
                          <div style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.e}</div>
                        </div>
                      </div>
                    </td>
                    <td style={TD}>
                      <span style={{background:cbg,color:ctc,fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:6}}>{d.cat}</span>
                    </td>
                    <td style={TD}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:5,background:ss.bg,color:ss.color,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:ss.dot,flexShrink:0}}/>
                        {d.st}
                      </span>
                    </td>
                    <td style={{...TD,fontWeight:700,color:"#111827"}}>{d.b} mln</td>
                    <td style={{...TD,textAlign:"center",fontWeight:600,color:"#374151"}}>
                      {d.c ? d.c : <span style={{color:"#d1d5db"}}>—</span>}
                    </td>
                    <td style={TD}>
                      <div style={{fontSize:11,color:"#9ca3af",marginBottom:5}}>
                        {d.sp ? `${d.sp} mln (${p}%)` : "—"}
                      </div>
                      <div style={{height:4,borderRadius:2,background:"#f3f4f6",overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${p}%`,background:bc,borderRadius:2}}/>
                      </div>
                    </td>
                    <td style={{...TD,fontSize:12,color:"#9ca3af"}}>{d.d}</td>
                    <td style={TD}>
                      <div style={{display:"flex",gap:6}}>
                        <button style={{background:"#f9fafb",border:"1px solid #e5e7eb",color:"#374151",borderRadius:8,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.target.style.background="#f3f4f6";}}
                          onMouseLeave={e=>{e.target.style.background="#f9fafb";}}>
                          Ko'r
                        </button>
                        <button onClick={()=>toggleStatus(d.id)} style={{
                          border:      d.st==="Bloklangan" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                          color:       d.st==="Bloklangan" ? "#15803d"           : "#dc2626",
                          background:  d.st==="Bloklangan" ? "#f0fdf4"           : "#fff5f5",
                          borderRadius:8, padding:"5px 12px", fontSize:12,
                          cursor:"pointer", fontFamily:"inherit", fontWeight:600, transition:"all 0.15s",
                        }}>
                          {d.st==="Bloklangan" ? "Ochish" : "Blok"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderTop:"1px solid #f3f4f6"}}>
          <span style={{fontSize:12,color:"#9ca3af"}}>
            {(curPg-1)*PER+1}–{Math.min(curPg*PER,filtered.length)} / {filtered.length} ta
          </span>
          <div style={{display:"flex",gap:3}}>
            {Array.from({length:pages},(_,i)=>i+1).map(p => (
              <button key={p} onClick={()=>setPg(p)} style={{
                width:30, height:30, borderRadius:8, border:"none", cursor:"pointer",
                fontSize:13, fontFamily:"inherit", fontWeight:p===curPg?700:400,
                background: p===curPg ? "#111827" : "transparent",
                color:      p===curPg ? "#fff"    : "#9ca3af",
                transition:"all 0.15s",
              }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
