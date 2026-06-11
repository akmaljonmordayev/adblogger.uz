import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuInstagram, LuYoutube, LuMessageCircle, LuUser,
  LuBuilding2, LuChevronRight, LuCircleCheck, LuLoader,
} from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import api from "../services/api";
import { toast } from "../components/ui/toast";
import { CATEGORY_LIST } from "../config/categories";

const CATEGORIES = CATEGORY_LIST; // { value, label, emoji, … }
const SERVICES   = ["Post","Story","Reel","Video","Live","Unboxing"];
const PLATFORMS  = [
  { key: "instagram", label: "Instagram", Icon: LuInstagram,    color: "#e1306c" },
  { key: "youtube",   label: "YouTube",   Icon: LuYoutube,       color: "#ff0000" },
  { key: "telegram",  label: "Telegram",  Icon: LuMessageCircle, color: "#0088cc" },
  { key: "tiktok",    label: "TikTok",    Icon: LuUser,          color: "#010101" },
];
const FOLLOWERS_RANGES = ["1K-10K","10K-50K","50K-100K","100K-500K","500K-1M","1M+"];

function StepIndicator({ step }) {
  const steps = [
    { n: 1, label: "Ariza yuborish",    done: true  },
    { n: 2, label: "Profil to'ldirish", done: false, active: step === 2 },
    { n: 3, label: "Tasdiqlash",        done: false, active: step === 3 },
  ];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:32 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{
              width:36, height:36, borderRadius:"50%",
              background: s.done ? "#16a34a" : s.active ? "#dc2626" : "#e5e7eb",
              color: s.done || s.active ? "#fff" : "#9ca3af",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:800, fontSize:14,
              boxShadow: s.active ? "0 0 0 4px rgba(220,38,38,0.15)" : "none",
              transition:"all .3s",
            }}>
              {s.done ? <LuCircleCheck size={18} /> : s.n}
            </div>
            <span style={{ fontSize:11, fontWeight:600, color: s.done ? "#16a34a" : s.active ? "#dc2626" : "#9ca3af", whiteSpace:"nowrap" }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width:60, height:2, background: s.done ? "#16a34a" : "#e5e7eb", margin:"0 8px", marginBottom:22, transition:"background .3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"7px 14px", borderRadius:10, border:`1.5px solid ${value ? "#dc2626" : "#e5e7eb"}`,
      background: value ? "#fef2f2" : "#f9fafb",
      color: value ? "#dc2626" : "#6b7280",
      fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit",
      transition:"all .2s",
    }}>
      {value && <LuCircleCheck size={14} />}
      {label}
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>{hint}</p>}
    </div>
  );
}

const inp = {
  width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
  fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", color:"#111827",
  transition:"border-color .2s",
};

/* ── Blogger form ────────────────────────────────────────────────── */
function BloggerForm({ onSubmit, loading }) {
  const [bio, setBio]               = useState("");
  const [platforms, setPlatforms]   = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const [categories, setCategories] = useState([]);
  const [services, setServices]     = useState([]);
  const [followers, setFollowers]   = useState("");
  const [followersRange, setFollowersRange] = useState("");
  const [pricing, setPricing]       = useState({});

  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (platforms.length === 0) return toast.error("Kamida 1 ta platforma tanlang");
    if (categories.length === 0) return toast.error("Kamida 1 ta kategoriya tanlang");
    onSubmit({ bio, platforms, socialLinks, categories, services, followers: Number(followers), followersRange, pricing });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Bio / Tavsif" hint="O'zingiz haqingizda qisqacha yozing (ixtiyoriy)">
        <textarea
          value={bio} onChange={e => setBio(e.target.value)}
          rows={3} maxLength={500}
          placeholder="Men tech va lifestyle yo'nalishida kontent yarataman..."
          style={{ ...inp, resize:"vertical" }}
        />
      </Field>

      <Field label="Platformalar *">
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {PLATFORMS.map(p => (
            <Toggle key={p.key} value={platforms.includes(p.key)}
              onChange={() => toggleArr(platforms, setPlatforms, p.key)}
              label={p.label}
            />
          ))}
        </div>
      </Field>

      {platforms.length > 0 && (
        <Field label="Ijtimoiy tarmoq havolalari">
          {platforms.map(p => {
            const pl = PLATFORMS.find(x => x.key === p);
            return (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <pl.Icon size={18} style={{ color: pl.color, flexShrink:0 }} />
                <input
                  value={socialLinks[p] || ""} onChange={e => setSocialLinks(prev => ({ ...prev, [p]: e.target.value }))}
                  placeholder={`${pl.label} profil havolasi`}
                  style={{ ...inp, flex:1 }}
                />
              </div>
            );
          })}
        </Field>
      )}

      <Field label="Kategoriyalar *">
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {CATEGORIES.map(({ value, label, emoji }) => (
            <Toggle key={value} value={categories.includes(value)} onChange={() => toggleArr(categories, setCategories, value)} label={`${emoji} ${label}`} />
          ))}
        </div>
      </Field>

      <Field label="Xizmatlar">
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {SERVICES.map(s => (
            <Toggle key={s} value={services.includes(s)} onChange={() => toggleArr(services, setServices, s)} label={s} />
          ))}
        </div>
      </Field>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Field label="Followers soni">
          <input type="number" value={followers} onChange={e => setFollowers(e.target.value)}
            placeholder="masalan: 50000" style={inp} min={0}
          />
        </Field>
        <Field label="Followers oralig'i">
          <select value={followersRange} onChange={e => setFollowersRange(e.target.value)} style={{ ...inp, background:"#fff" }}>
            <option value="">Tanlang...</option>
            {FOLLOWERS_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Narxlar (so'm)" hint="Ixtiyoriy — keyin ham to'ldirishingiz mumkin">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {["post","story","reel","video","live","unboxing"].map(s => (
            <div key={s}>
              <label style={{ fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", display:"block", marginBottom:4 }}>{s}</label>
              <input type="number" min={0} placeholder="0"
                value={pricing[s] || ""} onChange={e => setPricing(prev => ({ ...prev, [s]: Number(e.target.value) }))}
                style={{ ...inp, padding:"8px 10px", fontSize:13 }}
              />
            </div>
          ))}
        </div>
      </Field>

      <button type="submit" disabled={loading} style={{
        width:"100%", padding:"14px", borderRadius:12, border:"none",
        background: loading ? "#9ca3af" : "#dc2626", color:"#fff",
        fontWeight:700, fontSize:16, cursor: loading ? "not-allowed" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        fontFamily:"inherit", transition:"background .2s",
      }}>
        {loading ? <><LuLoader size={18} className="spin" /> Saqlanmoqda...</> : <>Profilni saqlash <LuChevronRight size={18} /></>}
      </button>
    </form>
  );
}

/* ── Business form ───────────────────────────────────────────────── */
function BusinessForm({ onSubmit, loading }) {
  const [companyName, setCompanyName] = useState("");
  const [bio, setBio]                 = useState("");
  const [phone, setPhone]             = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) return toast.error("Kompaniya nomi kiritilishi shart");
    onSubmit({ companyName, bio, phone });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Kompaniya / Tashkilot nomi *">
        <input value={companyName} onChange={e => setCompanyName(e.target.value)}
          placeholder="Masalan: TechUz LLC" style={inp} required
        />
      </Field>
      <Field label="Telefon raqam">
        <input value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="+998 90 123 45 67" style={inp}
        />
      </Field>
      <Field label="Kompaniya haqida" hint="Faoliyatingiz, maqsadlaringiz (ixtiyoriy)">
        <textarea value={bio} onChange={e => setBio(e.target.value)}
          rows={3} maxLength={500}
          placeholder="Biz IT sohasida xizmatlar ko'rsatamiz..."
          style={{ ...inp, resize:"vertical" }}
        />
      </Field>

      <button type="submit" disabled={loading} style={{
        width:"100%", padding:"14px", borderRadius:12, border:"none",
        background: loading ? "#9ca3af" : "#2563eb", color:"#fff",
        fontWeight:700, fontSize:16, cursor: loading ? "not-allowed" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        fontFamily:"inherit", transition:"background .2s",
      }}>
        {loading ? <><LuLoader size={18} className="spin" /> Saqlanmoqda...</> : <>Profilni saqlash <LuChevronRight size={18} /></>}
      </button>
    </form>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.patch("/auth/complete-onboarding", data);
      setUser(res.data.data);
      setDone(true);
      // Redirect to profile pending approval screen (second admin review)
      setTimeout(() => navigate("/profil-tasdiqlash-kutilmoqda"), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const role   = user?.role;
  const accent = role === "business" ? "#2563eb" : "#dc2626";

  /* ── Success screen ── */
  if (done) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", fontFamily:"'Inter',sans-serif" }}>
        <div style={{ background:"#fff", borderRadius:24, padding:48, maxWidth:440, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,.1)" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <LuCircleCheck size={36} style={{ color:"#16a34a" }} />
          </div>
          <h2 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:"0 0 12px" }}>Profil yuborildi!</h2>
          <p style={{ color:"#4b5563", fontSize:15, marginBottom:8 }}>Profilingiz ko'rib chiqish uchun yuborildi.</p>
          <p style={{ color:"#9ca3af", fontSize:13 }}>Tasdiqlash sahifasiga o'tilmoqda...</p>
          <div style={{ height:4, background:"#e5e7eb", borderRadius:99, marginTop:24, overflow:"hidden" }}>
            <div style={{ height:"100%", background:"#22c55e", borderRadius:99, animation:"fillBar 2.5s linear forwards" }} />
          </div>
        </div>
        <style>{`@keyframes fillBar{from{width:0}to{width:100%}} .spin{animation:spin 1s linear infinite} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'Inter',sans-serif", padding:"40px 20px 80px" }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background: accent + "15", color: accent, padding:"6px 16px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16, textTransform:"uppercase", letterSpacing:"1px" }}>
            {role === "business" ? <LuBuilding2 size={13} /> : <LuUser size={13} />}
            {role === "business" ? "Biznesmen" : "Blogger"} ro'yxatdan o'tish
          </div>
          <h1 style={{ fontSize:26, fontWeight:800, color:"#111827", margin:"0 0 8px" }}>
            Profilingizni to'ldiring
          </h1>
          <p style={{ fontSize:14, color:"#6b7280", margin:0 }}>
            {role === "business"
              ? "Kompaniyangiz haqida ma'lumotlarni kiriting"
              : "Bloger sifatida platformadan to'liq foydalanish uchun ma'lumotlaringizni to'ldiring"}
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator step={2} />

        {/* Form card */}
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:20, padding:28, boxShadow:"0 4px 20px rgba(0,0,0,.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24, padding:"12px 16px", background: accent + "0D", borderRadius:12, border:`1px solid ${accent}22` }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background: accent, animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:13, fontWeight:600, color: accent }}>
              2-bosqich: Profil ma'lumotlarini kiriting
            </span>
          </div>

          {role === "blogger"
            ? <BloggerForm onSubmit={handleSubmit} loading={loading} />
            : <BusinessForm onSubmit={handleSubmit} loading={loading} />
          }
        </div>
      </div>
      <style>{`.spin{animation:spin 1s linear infinite} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
