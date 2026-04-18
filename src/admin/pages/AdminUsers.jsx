import { useState } from "react";

const AVCOLORS = [
  ["#B5D4F4","#0C447C"],["#9FE1CB","#085041"],["#F5C4B3","#712B13"],
  ["#CECBF6","#3C3489"],["#FAC775","#633806"],["#F4C0D1","#72243E"],
  ["#C0DD97","#27500A"],["#E1F5EE","#0F6E56"],["#FAEEDA","#854F0B"],
];

const ALL_BRANDS = [
  {id:1,name:"Nike Uzbekistan",contact:"amir@nike.uz",cat:"Sport",status:"Faol",budget:85000000,spent:62000000,campaigns:22,joined:"2024-01-15"},
  {id:2,name:"Coca-Cola UZ",contact:"promo@coca-cola.uz",cat:"Oziq-ovqat",status:"Faol",budget:120000000,spent:98000000,campaigns:18,joined:"2023-12-10"},
  {id:3,name:"Beeline Uzbekistan",contact:"digital@beeline.uz",cat:"Telekom",status:"Faol",budget:200000000,spent:145000000,campaigns:27,joined:"2023-09-05"},
  {id:4,name:"Zara Official UZ",contact:"zara@zara.uz",cat:"Moda",status:"Faol",budget:55000000,spent:31000000,campaigns:11,joined:"2023-11-20"},
  {id:5,name:"Payme",contact:"marketing@payme.uz",cat:"Bank",status:"Faol",budget:75000000,spent:58000000,campaigns:15,joined:"2024-02-08"},
  {id:6,name:"Artel Electronics",contact:"pr@artel.uz",cat:"Texnologiya",status:"Faol",budget:40000000,spent:22000000,campaigns:9,joined:"2024-03-14"},
  {id:7,name:"MyFitness",contact:"info@myfitness.uz",cat:"Sport",status:"Kutilmoqda",budget:15000000,spent:0,campaigns:0,joined:"2024-07-01"},
  {id:8,name:"UzCard",contact:"ads@uzcard.uz",cat:"Bank",status:"Faol",budget:90000000,spent:67000000,campaigns:20,joined:"2024-01-22"},
  {id:9,name:"Hummo",contact:"media@hummo.uz",cat:"Bank",status:"Faol",budget:60000000,spent:44000000,campaigns:13,joined:"2024-02-28"},
  {id:10,name:"Nutrilife UZ",contact:"nutrilife@mail.ru",cat:"Sog'liq",status:"Kutilmoqda",budget:8000000,spent:0,campaigns:0,joined:"2024-06-15"},
  {id:11,name:"Pepsi UZ",contact:"pepsi@pepsiuz.com",cat:"Oziq-ovqat",status:"Faol",budget:70000000,spent:52000000,campaigns:16,joined:"2023-10-11"},
  {id:12,name:"Click UZ",contact:"ads@click.uz",cat:"Bank",status:"Faol",budget:55000000,spent:41000000,campaigns:12,joined:"2024-01-30"},
  {id:13,name:"Nestle Uzbekistan",contact:"promo@nestle.uz",cat:"Oziq-ovqat",status:"Faol",budget:95000000,spent:78000000,campaigns:21,joined:"2023-08-22"},
  {id:14,name:"TechHub Tashkent",contact:"hello@techhub.uz",cat:"Texnologiya",status:"Bloklangan",budget:12000000,spent:3000000,campaigns:2,joined:"2024-03-20"},
  {id:15,name:"Husan",contact:"husan@gmail.com",cat:"Savdo",status:"Faol",budget:25000000,spent:11000000,campaigns:4,joined:"2024-07-10"},
  {id:16,name:"Akmal Mordayev",contact:"akmal.mordayev@mail.ru",cat:"Texnologiya",status:"Faol",budget:58000000,spent:3000000,campaigns:1,joined:"2024-07-17"},
];

const CATS = ["Sport","Oziq-ovqat","Telekom","Moda","Bank","Texnologiya","Sog'liq","Savdo","Qurilish"];
const STATUSES = ["Faol","Kutilmoqda","Bloklangan"];

const STATUS_CLS = {
  "Faol":"bg-green-100 text-green-700",
  "Kutilmoqda":"bg-amber-100 text-amber-700",
  "Bloklangan":"bg-red-100 text-red-700",
};

function initials(name){ return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }
function fmtSum(n){
  if(!n) return "—";
  if(n>=1000000) return (n/1000000).toFixed(0)+" mln";
  if(n>=1000) return (n/1000).toFixed(0)+" ming";
  return n;
}

export default function BusinessesPage() {
  const [brands, setBrands] = useState(ALL_BRANDS);
  const [search, setSearch] = useState("");
  const [fCat, setFCat]     = useState("");
  const [fStat, setFStat]   = useState("");
  const [sortKey, setSortKey] = useState("joined");
  const [sortDir, setSortDir] = useState(-1);
  const [page, setPage]     = useState(1);
  const PER = 8;

  const handleSort = k => {
    if(sortKey===k) setSortDir(d=>d*-1); else { setSortKey(k); setSortDir(-1); }
    setPage(1);
  };

  const toggleStatus = id => {
    setBrands(prev=>prev.map(b=>b.id===id?{...b,status:b.status==="Bloklangan"?"Faol":"Bloklangan"}:b));
  };

  const filtered = brands.filter(b=>{
    if(search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.contact.toLowerCase().includes(search.toLowerCase())) return false;
    if(fCat && b.cat!==fCat) return false;
    if(fStat && b.status!==fStat) return false;
    return true;
  }).sort((a,b)=>{
    const av=a[sortKey],bv=b[sortKey];
    if(typeof av==="string") return av.localeCompare(bv)*sortDir;
    return (av-bv)*sortDir;
  });

  const pages = Math.ceil(filtered.length/PER)||1;
  const slice = filtered.slice((page-1)*PER, page*PER);
  const Arr = k => sortKey===k?(sortDir===1?" ↑":" ↓"):"";

  const totalBudget = brands.reduce((a,b)=>a+b.budget,0);
  const stats = [
    {label:"Jami biznesmenlar", val:brands.length, cls:"text-gray-900"},
    {label:"Faol",              val:brands.filter(b=>b.status==="Faol").length, cls:"text-green-600"},
    {label:"Kutilmoqda",        val:brands.filter(b=>b.status==="Kutilmoqda").length, cls:"text-amber-500"},
    {label:"Bloklangan",        val:brands.filter(b=>b.status==="Bloklangan").length, cls:"text-red-500"},
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s=>(
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
            <div className={`text-3xl font-semibold ${s.cls}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" placeholder="Kompaniya yoki kontakt..." value={search}
          onChange={e=>{setSearch(e.target.value);setPage(1);}}
          className="border border-gray-200 rounded-xl px-3 h-9 text-sm outline-none focus:border-gray-400 w-52 bg-white"/>
        <select value={fCat} onChange={e=>{setFCat(e.target.value);setPage(1);}}
          className="border border-gray-200 rounded-xl px-3 h-9 text-sm outline-none bg-white">
          <option value="">Barcha kategoriya</option>
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={fStat} onChange={e=>{setFStat(e.target.value);setPage(1);}}
          className="border border-gray-200 rounded-xl px-3 h-9 text-sm outline-none bg-white">
          <option value="">Barcha holat</option>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} ta biznesmen</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{tableLayout:"fixed"}}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-10 px-4 py-3"><input type="checkbox"/></th>
                {[["name","Biznesmen",200],["cat","Kategoriya",110],["status","Holat",100],["budget","Byudjet",110],["campaigns","Kampaniya",100],["spent","Sarflangan",140],["joined","Sana",110]].map(([k,l,w])=>(
                  <th key={k} onClick={()=>handleSort(k)} style={{width:w}}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 cursor-pointer hover:text-gray-600 whitespace-nowrap">
                    {l}{Arr(k)}
                  </th>
                ))}
                <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-400">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {slice.map(b=>{
                const [bg,tc]=AVCOLORS[(b.id-1)%AVCOLORS.length];
                const pct=b.budget>0?Math.round(b.spent/b.budget*100):0;
                const barC=pct>80?"#16a34a":pct>40?"#2563eb":"#d97706";
                return (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox"/></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{background:bg,color:tc}}>
                          {initials(b.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate text-sm">{b.name}</div>
                          <div className="text-xs text-gray-400 truncate">{b.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700">{b.cat}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${STATUS_CLS[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600">{fmtSum(b.budget)}</td>
                    <td className="px-3 py-3 text-sm text-gray-400 text-center">{b.campaigns||"—"}</td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-400 mb-1.5">{b.spent?fmtSum(b.spent)+" ("+pct+"%)":"—"}</div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:pct+"%",background:barC}}/>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-400">{b.joined}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 cursor-pointer text-gray-600">Ko'r</button>
                        <button onClick={()=>toggleStatus(b.id)}
                          className={`text-xs border rounded-lg px-3 py-1.5 cursor-pointer font-medium transition-colors ${
                            b.status==="Bloklangan"
                              ? "border-green-200 text-green-600 hover:bg-green-50"
                              : "border-red-200 text-red-500 hover:bg-red-50"
                          }`}>
                          {b.status==="Bloklangan"?"Ochish":"Blok"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} / {filtered.length}</span>
        <div className="flex gap-1">
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs cursor-pointer transition-colors ${
                p===page?"bg-gray-900 text-white":"border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
