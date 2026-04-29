import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  PiArrowLeftDuotone,
  PiShareNetworkDuotone,
  PiCopyDuotone,
  PiPhoneDuotone,
  PiChatTextDuotone,
  PiTelegramLogoDuotone,
  PiInstagramLogoDuotone,
  PiYoutubeLogoDuotone,
  PiTiktokLogoDuotone,
  PiMapPinDuotone,
  PiCalendarDotsDuotone,
  PiEyeDuotone,
  PiUsersThreeDuotone,
  PiCurrencyDollarSimpleDuotone,
  PiCheckCircleDuotone,
  PiSpinnerGapDuotone,
  PiSealCheckDuotone,
  PiCellSignalFullDuotone,
  PiMegaphoneSimpleDuotone,
  PiBuildingsDuotone,
  PiPackageDuotone,
  PiTimerDuotone,
  PiTargetDuotone,
  PiLinkSimpleDuotone,
  PiTagDuotone,
  PiStarDuotone,
  PiFireDuotone,
  PiImageSquareDuotone,
} from "react-icons/pi";
import api from "../services/api";
import { toast } from "../components/ui/toast";

/* ── Font ── */
if (!document.getElementById("addetail-font")) {
  const l = document.createElement("link");
  l.id = "addetail-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}

/* ── Helpers ── */
const fmtNum  = n => n ? Number(n).toLocaleString("uz-UZ") : "0";
const fmtDate = d => d ? new Date(d).toLocaleDateString("uz-UZ", { day:"numeric", month:"long", year:"numeric" }) : "—";

const STATUS_CFG = {
  pending:   { bg:"#fef9c3", c:"#854d0e", t:"Tekshiruvda" },
  approved:  { bg:"#dcfce7", c:"#166534", t:"Tasdiqlangan" },
  active:    { bg:"#dbeafe", c:"#1e40af", t:"Faol" },
  rejected:  { bg:"#fee2e2", c:"#991b1b", t:"Rad etilgan" },
  completed: { bg:"#f3f4f6", c:"#374151", t:"Yakunlangan" },
};

const PLATFORM_CFG = {
  instagram: { Icon: PiInstagramLogoDuotone, color:"#e1306c", label:"Instagram" },
  youtube:   { Icon: PiYoutubeLogoDuotone,   color:"#ff0000", label:"YouTube"   },
  telegram:  { Icon: PiTelegramLogoDuotone,  color:"#0088cc", label:"Telegram"  },
  tiktok:    { Icon: PiTiktokLogoDuotone,    color:"#010101", label:"TikTok"    },
};

const NICHE_COLOR = {
  Tech:"#2563eb", Lifestyle:"#e1306c", Beauty:"#9333ea", Food:"#d97706",
  Sports:"#16a34a", Travel:"#0891b2", Education:"#7c3aed", Gaming:"#dc2626",
  Music:"#374151", Business:"#b45309", Other:"#64748b",
};

/* ── Zayavka modal ── */
function ZayavkaModal({ ad, onClose }) {
  const [form, setForm] = useState({ name:"", phone:"", message:"" });
  const [sent, setSent] = useState(false);
  const name = ad?.type === "blogger"
    ? `${ad.user?.firstName||""} ${ad.user?.lastName||""}`.trim() || "Bloger"
    : (ad?.companyName || "Biznes");

  const inpStyle = {
    width:"100%", padding:"11px 14px", fontSize:14, fontFamily:"inherit",
    border:"1.5px solid #e5e7eb", borderRadius:10, outline:"none",
    background:"#fff", color:"#111827", boxSizing:"border-box", transition:"border-color .2s",
  };

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:"28px",maxWidth:440,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,0.18)"}}>
        {sent ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <PiCheckCircleDuotone size={32} style={{color:"#16a34a"}}/>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#111827",marginBottom:8}}>Zayavka yuborildi!</div>
            <p style={{fontSize:14,color:"#6b7280",marginBottom:20}}>{name} siz bilan tez orada bog'lanadi.</p>
            <button onClick={onClose} style={{padding:"11px 28px",borderRadius:12,background:"linear-gradient(135deg,#dc2626,#b91c1c)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Yopish</button>
          </div>
        ) : (
          <>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#111827",marginBottom:6}}>Zayavka yozish</div>
            <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}><strong style={{color:"#111827"}}>{name}</strong> ga murojaat</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <input style={inpStyle} placeholder="Ismingiz *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                onFocus={e=>e.target.style.borderColor="#dc2626"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
              <input style={inpStyle} placeholder="Telefon *" type="tel" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}
                onFocus={e=>e.target.style.borderColor="#dc2626"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
              <textarea style={{...inpStyle,resize:"vertical"}} rows={3} placeholder="Reklama haqida qisqacha..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                onFocus={e=>e.target.style.borderColor="#dc2626"} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
              <button onClick={()=>{ if(form.name&&form.phone) setSent(true); else toast.error("Ism va telefon kiritilishi shart"); }}
                style={{padding:"13px",borderRadius:12,background:"linear-gradient(135deg,#dc2626,#b91c1c)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 16px rgba(220,38,38,0.3)"}}>
                <PiChatTextDuotone size={16}/> Yuborish
              </button>
              <button onClick={onClose} style={{padding:"10px",background:"none",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,color:"#9ca3af",cursor:"pointer",fontFamily:"inherit"}}>Bekor qilish</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Pricing row ── */
function PriceRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid #f1f5f9"}}>
      <span style={{fontSize:13,color:"#64748b"}}>{label}</span>
      <span style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{fmtNum(value)} <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>so'm</span></span>
    </div>
  );
}

/* ── Info chip ── */
function InfoChip({ Icon, text }) {
  if (!text || text === "—") return null;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:100,fontSize:12,color:"#475569",fontWeight:500}}>
      <Icon size={13} style={{color:"#94a3b8"}}/>
      {text}
    </span>
  );
}

/* ══ MAIN ══════════════════════════════════════════════════════════ */
export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [zayavka, setZayavka] = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/ads/${id}`)
      .then(r => setAd(r.data.data))
      .catch(() => { toast.error("E'lon topilmadi"); navigate("/ads"); })
      .finally(() => setLoading(false));
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Havola nusxalandi!");
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:360,fontFamily:"'Inter',sans-serif"}}>
      <PiSpinnerGapDuotone size={36} style={{color:"#dc2626",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!ad) return null;

  const isBlogger = ad.type === "blogger";
  const name = isBlogger
    ? `${ad.user?.firstName||""} ${ad.user?.lastName||""}`.trim() || "Bloger"
    : (ad.companyName || "Biznes");
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  const accentColor = isBlogger
    ? (NICHE_COLOR[ad.niche?.[0]] || "#dc2626")
    : "#2563eb";

  const platforms = isBlogger ? (ad.platforms || []) : (ad.targetPlatforms || []);
  const statusCfg = STATUS_CFG[ad.status] || STATUS_CFG.pending;

  return (
    <div style={{fontFamily:"'Inter',sans-serif",maxWidth:1000,margin:"0 auto",padding:"0 20px 80px"}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .ad-detail-grid { grid-template-columns: 1fr !important; }
          .ad-detail-sidebar { position: static !important; }
        }
      `}</style>

      {zayavka && <ZayavkaModal ad={ad} onClose={()=>setZayavka(false)}/>}

      {/* ── Back ── */}
      <Link to="/ads" style={{display:"inline-flex",alignItems:"center",gap:7,color:"#64748b",textDecoration:"none",fontSize:13,fontWeight:600,marginBottom:28,padding:"8px 14px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,transition:"all .15s"}}
        onMouseEnter={e=>{e.currentTarget.style.color="#dc2626";e.currentTarget.style.borderColor="#fecaca";}}
        onMouseLeave={e=>{e.currentTarget.style.color="#64748b";e.currentTarget.style.borderColor="#e2e8f0";}}>
        <PiArrowLeftDuotone size={16}/> E'lonlarga qaytish
      </Link>

      {/* ── Hero banner ── */}
      <div style={{borderRadius:20,overflow:"hidden",marginBottom:28,position:"relative",height:200,background:`linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 100%)`,border:`1.5px solid ${accentColor}20`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {/* decorative circles */}
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:-30,left:-30,width:140,height:140,borderRadius:"50%",background:`radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`}}/>

        {/* avatar */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,position:"relative",zIndex:1}}>
          <div style={{width:72,height:72,borderRadius:20,background:accentColor+"22",border:`2px solid ${accentColor}44`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            {ad.user?.avatar
              ? <img src={ad.user.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : <span style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:accentColor}}>{initials}</span>
            }
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"#0f172a"}}>{name}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>
              {isBlogger ? (ad.user?.email || "") : (ad.contactPerson || "")}
            </div>
          </div>
        </div>

        {/* type + status badges */}
        <div style={{position:"absolute",top:14,left:16,display:"flex",gap:8}}>
          <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,background:isBlogger?"#ede9fe":"#dbeafe",color:isBlogger?"#6d28d9":"#1e40af",border:`1px solid ${isBlogger?"#c4b5fd":"#93c5fd"}`}}>
            {isBlogger ? "BLOGER" : "BIZNES"}
          </span>
          <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,background:statusCfg.bg,color:statusCfg.c}}>
            {statusCfg.t}
          </span>
        </div>

        {/* views */}
        <div style={{position:"absolute",top:14,right:16,display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#94a3b8"}}>
          <PiEyeDuotone size={14}/> {fmtNum(ad.views)}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="ad-detail-grid" style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:22,alignItems:"start"}}>

        {/* ── LEFT ── */}
        <div style={{display:"flex",flexDirection:"column",gap:18}}>

          {/* Title + meta */}
          <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(18px,3vw,26px)",fontWeight:800,color:"#0f172a",margin:"0 0 14px",lineHeight:1.3}}>
              {ad.title || ad.productName || name}
            </h1>

            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              <InfoChip Icon={PiMapPinDuotone}       text={ad.location}/>
              <InfoChip Icon={PiCalendarDotsDuotone} text={fmtDate(ad.createdAt)}/>
              {isBlogger && <InfoChip Icon={PiUsersThreeDuotone} text={ad.followersRange}/>}
              {!isBlogger && <InfoChip Icon={PiTimerDuotone} text={ad.campaignDuration}/>}
              {!isBlogger && <InfoChip Icon={PiCurrencyDollarSimpleDuotone} text={ad.budget?.range}/>}
            </div>

            {/* Platforms */}
            {platforms.length > 0 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {platforms.map(p => {
                  const cfg = PLATFORM_CFG[p];
                  if (!cfg) return null;
                  return (
                    <span key={p} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,fontSize:12,fontWeight:600,border:`1.5px solid ${cfg.color}30`,background:cfg.color+"10",color:cfg.color}}>
                      <cfg.Icon size={14}/> {cfg.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Description */}
          {(ad.description || ad.productDescription) && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <PiMegaphoneSimpleDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Tavsif</h3>
              </div>
              <p style={{fontSize:14,color:"#374151",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>
                {ad.description || ad.productDescription}
              </p>
            </div>
          )}

          {/* BLOGGER: Pricing table */}
          {isBlogger && (ad.pricing?.post || ad.pricing?.story || ad.pricing?.video) && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <PiCurrencyDollarSimpleDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Narxlar</h3>
              </div>
              <PriceRow label="📸  Post (feed)"   value={ad.pricing?.post}/>
              <PriceRow label="⏱  Story"          value={ad.pricing?.story}/>
              <PriceRow label="🎬  Reel / Video"  value={ad.pricing?.video}/>
              <div style={{marginTop:14,padding:"12px 16px",background:`${accentColor}08`,border:`1.5px solid ${accentColor}18`,borderRadius:12,display:"flex",alignItems:"center",gap:8}}>
                <PiFireDuotone size={16} style={{color:accentColor,flexShrink:0}}/>
                <span style={{fontSize:12,color:"#64748b"}}>Narxlar kelishish asosida o'zgarishi mumkin</span>
              </div>
            </div>
          )}

          {/* BLOGGER: Services */}
          {isBlogger && ad.services?.length > 0 && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <PiTagDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Xizmatlar</h3>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {ad.services.map(s=>(
                  <span key={s} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:100,background:`${accentColor}10`,color:accentColor,border:`1.5px solid ${accentColor}25`,fontSize:12,fontWeight:600}}>
                    <PiCheckCircleDuotone size={13}/> {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BLOGGER: Niche */}
          {isBlogger && ad.niche?.length > 0 && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <PiStarDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Yo'nalish (Niche)</h3>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {ad.niche.map(n=>{
                  const nc = NICHE_COLOR[n] || "#64748b";
                  return (
                    <span key={n} style={{padding:"5px 14px",borderRadius:100,background:nc+"15",color:nc,border:`1.5px solid ${nc}30`,fontSize:12,fontWeight:700}}>
                      {n}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* BLOGGER: Portfolio */}
          {isBlogger && ad.portfolio && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <PiLinkSimpleDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Portfolio</h3>
              </div>
              <a href={ad.portfolio} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:7,padding:"10px 18px",background:`${accentColor}10`,border:`1.5px solid ${accentColor}25`,borderRadius:12,color:accentColor,fontSize:13,fontWeight:600,textDecoration:"none"}}>
                <PiLinkSimpleDuotone size={15}/> {ad.portfolio}
              </a>
            </div>
          )}

          {/* BUSINESS: Company info */}
          {!isBlogger && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <PiBuildingsDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Kompaniya ma'lumotlari</h3>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {Icon:PiBuildingsDuotone,      label:"Kompaniya",     val:ad.companyName},
                  {Icon:PiPackageDuotone,         label:"Mahsulot",      val:ad.productName},
                  {Icon:PiCurrencyDollarSimpleDuotone, label:"Byudjet",  val:ad.budget?.range},
                  {Icon:PiTimerDuotone,           label:"Davomiyligi",   val:ad.campaignDuration},
                  {Icon:PiTargetDuotone,          label:"Auditoriya",    val:ad.targetAudience},
                  {Icon:PiTagDuotone,             label:"Biznes turi",   val:ad.businessType},
                ].filter(r=>r.val).map(r=>(
                  <div key={r.label} style={{padding:"11px 14px",background:"#f8fafc",borderRadius:12,border:"1.5px solid #f1f5f9"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <r.Icon size={13} style={{color:"#94a3b8"}}/>
                      <span style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em"}}>{r.label}</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{r.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUSINESS: Blogger types needed */}
          {!isBlogger && ad.bloggerTypesNeeded?.length > 0 && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <PiUsersThreeDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Qaysi bloger kerak</h3>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {ad.bloggerTypesNeeded.map(b=>(
                  <span key={b} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:100,background:accentColor+"10",color:accentColor,border:`1.5px solid ${accentColor}25`,fontSize:12,fontWeight:600}}>
                    <PiSealCheckDuotone size={13}/> {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BUSINESS: Description */}
          {!isBlogger && ad.productDescription && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <PiPackageDuotone size={18} style={{color:accentColor}}/>
                <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",margin:0}}>Mahsulot / xizmat haqida</h3>
              </div>
              <p style={{fontSize:14,color:"#374151",lineHeight:1.8,margin:0}}>{ad.productDescription}</p>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="ad-detail-sidebar" style={{position:"sticky",top:80,display:"flex",flexDirection:"column",gap:14}}>

          {/* Price / Budget card */}
          <div style={{background:"#fff",border:`1.5px solid ${accentColor}25`,borderRadius:18,padding:"22px",boxShadow:`0 4px 24px ${accentColor}10`}}>
            <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>
              {isBlogger ? "Boshlang'ich narx" : "Reklama byudjeti"}
            </div>
            {isBlogger ? (
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:accentColor,lineHeight:1,marginBottom:4}}>
                {ad.pricing?.post ? fmtNum(ad.pricing.post) : "—"}
                <span style={{fontSize:13,fontWeight:400,color:"#94a3b8",marginLeft:4}}>so'm / post</span>
              </div>
            ) : (
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:accentColor,lineHeight:1,marginBottom:4}}>
                {ad.budget?.range || "Kelishiladi"}
              </div>
            )}
            <p style={{fontSize:12,color:"#94a3b8",margin:"6px 0 20px"}}>
              {isBlogger ? "Narxlar xizmat turiga qarab farqlanadi" : "Kampaniya byudjeti"}
            </p>

            {/* CTA buttons */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ad.phone && (
                <a href={`tel:${ad.phone}`} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,color:"#fff",textDecoration:"none",borderRadius:12,fontSize:14,fontWeight:700,boxShadow:`0 4px 16px ${accentColor}30`,transition:"opacity .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <PiPhoneDuotone size={16}/> {ad.phone}
                </a>
              )}
              <button onClick={()=>setZayavka(true)}
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px",background:"#f8fafc",border:`1.5px solid ${accentColor}30`,borderRadius:12,fontSize:14,fontWeight:700,color:accentColor,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=accentColor+"10";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#f8fafc";}}>
                <PiChatTextDuotone size={16}/> Zayavka yuborish
              </button>
            </div>
          </div>

          {/* Platforms quick view */}
          {platforms.length > 0 && (
            <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:16,padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>
                {isBlogger ? "Faol platformalar" : "Kerakli platformalar"}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {platforms.map(p => {
                  const cfg = PLATFORM_CFG[p];
                  if (!cfg) return null;
                  return (
                    <div key={p} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:cfg.color+"0d",borderRadius:10,border:`1px solid ${cfg.color}22`}}>
                      <cfg.Icon size={18} style={{color:cfg.color,flexShrink:0}}/>
                      <span style={{fontSize:13,fontWeight:600,color:"#374151"}}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Share */}
          <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:16,padding:"16px 18px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Ulashish</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={copyLink}
                style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,fontSize:12,fontWeight:600,color:copied?"#16a34a":"#374151",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                {copied ? <PiCheckCircleDuotone size={14} style={{color:"#16a34a"}}/> : <PiCopyDuotone size={14}/>}
                {copied ? "Nusxalandi!" : "Havolani copy"}
              </button>
              <button onClick={()=>{ if(navigator.share) navigator.share({title:ad.title||name, url:window.location.href}); else copyLink(); }}
                style={{padding:"9px 12px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",color:"#374151",transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#c7d2fe"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>
                <PiShareNetworkDuotone size={16}/>
              </button>
            </div>
          </div>

          {/* Posted date */}
          <div style={{padding:"14px 16px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:14,display:"flex",alignItems:"center",gap:10}}>
            <PiCalendarDotsDuotone size={18} style={{color:"#94a3b8",flexShrink:0}}/>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em"}}>Joylashtirilgan</div>
              <div style={{fontSize:13,fontWeight:600,color:"#374151",marginTop:2}}>{fmtDate(ad.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
