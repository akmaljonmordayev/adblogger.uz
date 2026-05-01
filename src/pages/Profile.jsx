import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import {
  LuUser, LuSettings, LuShield, LuLogOut, LuCamera, LuCheck,
  LuLoader, LuHeart, LuMegaphone, LuBriefcase,
  LuPhone, LuMail, LuBadgeCheck, LuPlus, LuEye, LuTrash2,
  LuCalendar, LuInstagram, LuYoutube, LuStar, LuTrendingUp,
  LuGlobe, LuMapPin, LuUsers, LuDollarSign, LuInfo,
  LuLink, LuBookmark, LuBell, LuChevronRight, LuSend,
} from "react-icons/lu";
import { toast } from "../components/ui/toast";
import { useAuthStore } from "../store/useAuthStore";
import api from "../services/api";
import LogoutModal from "../components/ui/LogoutModal";

/* ─── tiny helpers ────────────────────────────────────────────── */
const inp = (extra = {}) => ({
  width: "100%", padding: "11px 14px", fontSize: 14,
  border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none",
  background: "#fff", color: "#0f172a", boxSizing: "border-box",
  fontFamily: "inherit", transition: "border-color .2s", ...extra,
});
const onFocus = e => e.target.style.borderColor = "#dc2626";
const onBlur  = e => e.target.style.borderColor = "#e2e8f0";
const Label   = ({ children }) => (
  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
    {children}
  </label>
);
const FieldWrap = ({ children, style = {} }) => (
  <div style={{ marginBottom: 18, ...style }}>{children}</div>
);
const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 22 }}>
    <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>{children}</h2>
    {sub && <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{sub}</p>}
  </div>
);
const Divider = () => <div style={{ borderTop: "1px solid #f1f5f9", margin: "24px 0" }} />;

const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#e1306c",  bg: "#fff0f5", Icon: LuInstagram },
  { id: "youtube",   label: "YouTube",   color: "#ff0000",  bg: "#fff0f0", Icon: LuYoutube   },
  { id: "telegram",  label: "Telegram",  color: "#0088cc",  bg: "#f0f8ff", Icon: LuSend      },
  { id: "tiktok",    label: "TikTok",    color: "#010101",  bg: "#f8f8f8", Icon: LuTrendingUp },
];

const CATEGORIES = [
  "Tech","Lifestyle","Beauty","Food","Sports","Travel","Education","Business","Gaming","Music","Other"
];
const SERVICES = [
  { id: "Post",     label: "Post",      emoji: "📸" },
  { id: "Story",    label: "Story",     emoji: "⏱" },
  { id: "Reel",     label: "Reel",      emoji: "🎬" },
  { id: "Video",    label: "Video",     emoji: "📹" },
  { id: "Live",     label: "Live",      emoji: "🔴" },
  { id: "Unboxing", label: "Unboxing",  emoji: "📦" },
];
const PRICING_FIELDS = [
  { key: "post",     label: "Post narxi",     icon: "📸", placeholder: "500 000" },
  { key: "story",    label: "Story narxi",    icon: "⏱", placeholder: "250 000" },
  { key: "reel",     label: "Reel narxi",     icon: "🎬", placeholder: "700 000" },
  { key: "video",    label: "Video narxi",    icon: "📹", placeholder: "1 500 000" },
  { key: "live",     label: "Live narxi",     icon: "🔴", placeholder: "2 000 000" },
  { key: "unboxing", label: "Unboxing narxi", icon: "📦", placeholder: "1 200 000" },
];
const FOLLOWERS_RANGES = ["1K-10K","10K-50K","50K-100K","100K-500K","500K-1M","1M+"];

const COMPANY_TYPES = [
  "Manufacturing","Retail","Restaurant","Beauty","RealEstate",
  "Education","Tech","Tourism","Finance","Other",
];
const COMPANY_TYPE_LABELS = {
  Manufacturing:"Ishlab chiqarish", Retail:"Savdo", Restaurant:"Restoran/Cafe",
  Beauty:"Go'zallik", RealEstate:"Ko'chmas mulk", Education:"Ta'lim",
  Tech:"Texnologiya", Tourism:"Turizm", Finance:"Moliya", Other:"Boshqa",
};
const BUDGET_RANGES = ["500K-1M","1M-3M","3M-5M","5M-10M","10M+","Negotiable"];
const BUDGET_LABELS = {
  "500K-1M":"500K – 1M so'm","1M-3M":"1M – 3M so'm","3M-5M":"3M – 5M so'm",
  "5M-10M":"5M – 10M so'm","10M+":"10M+ so'm","Negotiable":"Kelishiladi",
};

const TABS = [
  { id: "personal",  label: "Shaxsiy",         Icon: LuUser },
  { id: "blogger",   label: "Blogger profili",  Icon: LuStar,       roles: ["blogger"] },
  { id: "business",  label: "Biznes profili",   Icon: LuBriefcase,  roles: ["business"] },
  { id: "my-ads",    label: "E'lonlarim",       Icon: LuMegaphone },
  { id: "wishlist",  label: "Saqlanganlar",     Icon: LuHeart },
  { id: "campaigns", label: "Kampaniyalar",     Icon: LuBriefcase },
  { id: "settings",  label: "Sozlamalar",       Icon: LuSettings },
  { id: "security",  label: "Xavfsizlik",       Icon: LuShield },
];

const STATUS_META = {
  pending:  { bg:"#fef9c3", c:"#854d0e", bd:"#fde68a", t:"Kutilmoqda",   icon:"⏳" },
  approved: { bg:"#dcfce7", c:"#166534", bd:"#86efac", t:"Tasdiqlangan", icon:"✓"  },
  active:   { bg:"#dbeafe", c:"#1e40af", bd:"#93c5fd", t:"Faol",         icon:"🔵" },
  rejected: { bg:"#fee2e2", c:"#991b1b", bd:"#fca5a5", t:"Rad etilgan",  icon:"✕"  },
  completed:{ bg:"#f3f4f6", c:"#374151", bd:"#d1d5db", t:"Yakunlangan",  icon:"✓"  },
};
const StatusBadge = ({ s }) => {
  const x = STATUS_META[s] || STATUS_META.pending;
  return (
    <span style={{ background:x.bg, color:x.c, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:6, border:`1px solid ${x.bd}`, display:"inline-flex", alignItems:"center", gap:4 }}>
      {x.icon} {x.t}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════ */
export default function Profile() {
  const navigate          = useNavigate();
  const [searchParams]    = useSearchParams();
  const { user, setUser } = useAuthStore();

  const [tab,          setTab]          = useState(searchParams.get("tab") || "personal");
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [avatarLoading,setAvatarLoading]= useState(false);
  const [logoLoading,  setLogoLoading]  = useState(false);
  const [myAds,        setMyAds]        = useState([]);
  const [campaigns,    setCampaigns]    = useState([]);
  const [wishlist,     setWishlist]     = useState([]);
  const [loadingTab,   setLoadingTab]   = useState(false);
  const [bloggerProfile,  setBloggerProfile]  = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [showLogout,   setShowLogout]   = useState(false);
  const [editAd,       setEditAd]       = useState(null);   // ad being edited
  const [editForm,     setEditForm]     = useState({});
  const [editSaving,   setEditSaving]   = useState(false);

  // Personal form
  const [pForm, setPForm] = useState({
    firstName: "", lastName: "", phone: "",
  });

  // Business form
  const [bizForm, setBizForm] = useState({
    companyName: "", companyType: "", description: "", website: "", location: "",
    contactPhone: "", contactEmail: "",
    logo: "",
    socialLinks: { instagram:"", youtube:"", telegram:"", tiktok:"" },
    targetPlatforms: [],
    targetNiches: [],
    budgetRange: "",
  });

  // Blogger form
  const [bForm, setBForm] = useState({
    handle: "", bio: "", location: "", website: "", portfolio: "",
    followers: "", followersRange: "", engagementRate: "",
    audienceAge: "", audienceGender: "",
    platforms: [],
    socialLinks: { instagram:"", youtube:"", telegram:"", tiktok:"" },
    categories: [],
    services: [],
    pricing: { post:"", story:"", reel:"", video:"", live:"", unboxing:"" },
  });

  // Password form
  const [passForm, setPassForm] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });

  const fileRef    = useRef(null);
  const logoRef    = useRef(null);

  // Redirect
  useEffect(() => { if (!user && !showLogout) navigate("/login", { replace: true }); }, [user, showLogout]);

  // Sync personal form
  useEffect(() => {
    if (user) setPForm({ firstName: user.firstName||"", lastName: user.lastName||"", phone: user.phone||"" });
  }, [user]);

  // Pre-load role-specific profile for banner stats
  useEffect(() => {
    if (!user) return;
    if (user.role === "business" && !businessProfile) fetchBusinessProfile();
    if (user.role === "blogger"  && !bloggerProfile)  fetchBloggerProfile();
  }, [user]);

  // Load tab data
  useEffect(() => {
    if (tab === "my-ads")    fetchMyAds();
    if (tab === "campaigns") fetchCampaigns();
    if (tab === "wishlist") {
      setWishlist(JSON.parse(localStorage.getItem("adb_wishlist") || "[]"));
    }
    if (tab === "blogger"  && user?.role === "blogger")  fetchBloggerProfile();
    if (tab === "business" && user?.role === "business") fetchBusinessProfile();
  }, [tab]);

  const fetchBusinessProfile = async () => {
    setLoadingTab(true);
    try {
      const res = await api.get("/business/me");
      const d = res.data.data;
      setBusinessProfile(d);
      if (d) {
        setBizForm({
          companyName:   d.companyName   || "",
          companyType:   d.companyType   || "",
          description:   d.description   || "",
          website:       d.website       || "",
          location:      d.location      || "",
          contactPhone:  d.contactPhone  || "",
          contactEmail:  d.contactEmail  || "",
          logo:          d.logo          || "",
          socialLinks:   { instagram:"", youtube:"", telegram:"", tiktok:"", ...(d.socialLinks||{}) },
          targetPlatforms: d.targetPlatforms || [],
          targetNiches:    d.targetNiches    || [],
          budgetRange:     d.budgetRange     || "",
        });
      }
    } catch { /* first visit */ }
    finally { setLoadingTab(false); }
  };

  const fetchBloggerProfile = async () => {
    setLoadingTab(true);
    try {
      const res = await api.get("/bloggers/me/profile");
      const d = res.data.data;
      setBloggerProfile(d);
      setBForm({
        handle:         d.handle || "",
        bio:            d.bio || "",
        location:       d.location || "",
        website:        d.website || "",
        portfolio:      d.portfolio || "",
        followers:      d.followers || "",
        followersRange: d.followersRange || "",
        engagementRate: d.engagementRate || "",
        audienceAge:    d.audienceAge || "",
        audienceGender: d.audienceGender || "",
        platforms:      d.platforms || [],
        socialLinks:    { instagram:"", youtube:"", telegram:"", tiktok:"", ...(d.socialLinks||{}) },
        categories:     d.categories || [],
        services:       d.services || [],
        pricing: {
          post:     d.pricing?.post || "",
          story:    d.pricing?.story || "",
          reel:     d.pricing?.reel || "",
          video:    d.pricing?.video || "",
          live:     d.pricing?.live || "",
          unboxing: d.pricing?.unboxing || "",
        },
      });
    } catch { /* new blogger, empty form */ }
    finally { setLoadingTab(false); }
  };

  const fetchMyAds = async () => {
    setLoadingTab(true);
    try { const r = await api.get("/ads/user/my-ads"); setMyAds(r.data.data || []); }
    catch { toast.error("E'lonlarni yuklashda xatolik"); }
    finally { setLoadingTab(false); }
  };

  const fetchCampaigns = async () => {
    setLoadingTab(true);
    try { const r = await api.get("/campaigns/my"); setCampaigns(r.data.data || []); }
    catch { /* */ } finally { setLoadingTab(false); }
  };

  // ── Avatar ────────────────────────────────────────────────────
  const handleAvatarChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { toast.error("Rasm 2MB dan kichik bo'lsin"); return; }
    const fd = new FormData(); fd.append("avatar", file);
    setAvatarLoading(true);
    try {
      const r = await api.patch("/profile/avatar", fd, { headers:{ "Content-Type":"multipart/form-data" } });
      setUser(r.data.data); toast.success("Avatar yangilandi!");
    } catch { toast.error("Avatar yuklashda xatolik"); }
    finally { setAvatarLoading(false); }
  };

  // ── Logo upload ───────────────────────────────────────────────
  const handleLogoChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2*1024*1024) { toast.error("Logo 2MB dan kichik bo'lsin"); return; }
    const fd = new FormData(); fd.append("logo", file);
    setLogoLoading(true);
    try {
      const r = await api.patch("/business/me/logo", fd, { headers:{ "Content-Type":"multipart/form-data" } });
      const d = r.data.data;
      setBusinessProfile(d);
      setBizForm(p => ({ ...p, logo: d.logo || "" }));
      toast.success("Logo yangilandi!");
    } catch { toast.error("Logo yuklashda xatolik"); }
    finally { setLogoLoading(false); e.target.value = ""; }
  };

  // ── Save personal ─────────────────────────────────────────────
  const savePersonal = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const r = await api.patch("/profile", { firstName:pForm.firstName, lastName:pForm.lastName, phone:pForm.phone });
      setUser(r.data.data); setSaved(true); toast.success("Saqlandi!");
      setTimeout(()=>setSaved(false),2500);
    } catch(err) { toast.error(err?.response?.data?.message||"Xatolik"); }
    finally { setSaving(false); }
  };

  // ── Toggle helpers ────────────────────────────────────────────
  const toggleArr = useCallback((key, val) => {
    setBForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v=>v!==val) : [...p[key], val],
    }));
  }, []);

  const toggleBizArr = useCallback((key, val) => {
    setBizForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v=>v!==val) : [...p[key], val],
    }));
  }, []);

  // ── Save business profile ─────────────────────────────────────
  const saveBusiness = async e => {
    e.preventDefault();
    if (!bizForm.companyName) { toast.error("Kompaniya nomi kiritilishi shart"); return; }
    setSaving(true);
    try {
      const r = await api.patch("/business/me", bizForm);
      setBusinessProfile(r.data.data);
      setSaved(true); toast.success("Biznes profili saqlandi!");
      setTimeout(()=>setSaved(false),2500);
    } catch(err) { toast.error(err?.response?.data?.message||"Xatolik"); }
    finally { setSaving(false); }
  };

  // ── Save blogger profile ──────────────────────────────────────
  const saveBlogger = async e => {
    e.preventDefault();
    if (!bForm.handle) { toast.error("Handle kiritilishi shart"); return; }
    setSaving(true);
    try {
      const payload = {
        ...bForm,
        followers:      Number(bForm.followers) || 0,
        engagementRate: Number(bForm.engagementRate) || 0,
        pricing: {
          post:     Number(bForm.pricing.post)     || 0,
          story:    Number(bForm.pricing.story)    || 0,
          reel:     Number(bForm.pricing.reel)     || 0,
          video:    Number(bForm.pricing.video)    || 0,
          live:     Number(bForm.pricing.live)     || 0,
          unboxing: Number(bForm.pricing.unboxing) || 0,
        },
      };
      const r = await api.patch("/bloggers/me/profile", payload);
      setBloggerProfile(r.data.data);
      setSaved(true); toast.success("Blogger profili saqlandi!");
      setTimeout(()=>setSaved(false),2500);
    } catch(err) { toast.error(err?.response?.data?.message||"Xatolik"); }
    finally { setSaving(false); }
  };

  // ── Change password ───────────────────────────────────────────
  const changePassword = async e => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) { toast.error("Parollar mos kelmadi"); return; }
    if (passForm.newPassword.length < 6) { toast.error("Parol kamida 6 ta belgi"); return; }
    setSaving(true);
    try {
      await api.patch("/auth/update-password", { currentPassword:passForm.currentPassword, newPassword:passForm.newPassword });
      toast.success("Parol yangilandi!"); setPassForm({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch(err) { toast.error(err?.response?.data?.message||"Xatolik"); }
    finally { setSaving(false); }
  };

  const deleteAd = async id => {
    if (!confirm("E'lonni o'chirishni tasdiqlaysizmi?")) return;
    try { await api.delete(`/ads/${id}`); setMyAds(p=>p.filter(a=>a._id!==id)); toast.success("O'chirildi"); }
    catch { toast.error("Xatolik"); }
  };

  const openEditAd = ad => {
    setEditAd(ad);
    if (ad.type === "blogger") {
      setEditForm({
        title:       ad.title       || "",
        description: ad.description || "",
        phone:       ad.phone       || "",
        followersRange: ad.followersRange || "",
        pricing: {
          post:  ad.pricing?.post  || "",
          story: ad.pricing?.story || "",
          video: ad.pricing?.video || "",
        },
        portfolio: ad.portfolio || "",
      });
    } else {
      setEditForm({
        companyName:        ad.companyName        || "",
        productName:        ad.productName        || "",
        productDescription: ad.productDescription || "",
        phone:              ad.phone              || "",
        targetAudience:     ad.targetAudience     || "",
        campaignDuration:   ad.campaignDuration   || "",
        budget: { range: ad.budget?.range || "" },
      });
    }
  };

  const saveEditAd = async () => {
    if (!editAd) return;
    setEditSaving(true);
    try {
      const r = await api.patch(`/ads/${editAd._id}`, editForm);
      setMyAds(p => p.map(a => a._id === editAd._id ? r.data.data : a));
      toast.success("E'lon yangilandi (tekshiruvga yuborildi)");
      setEditAd(null);
    } catch { toast.error("Xatolik"); }
    finally { setEditSaving(false); }
  };

  const removeWishlist = id => {
    const upd = wishlist.filter(w=>w._id!==id);
    setWishlist(upd); localStorage.setItem("adb_wishlist", JSON.stringify(upd));
    toast.success("O'chirildi");
  };

  const handleLogout = () => setShowLogout(true);

  if (!user) return null;
  const initials = `${user.firstName?.[0]||""}${user.lastName?.[0]||""}`.toUpperCase()||"U";
  const visibleTabs = TABS.filter(t => !t.roles || t.roles.includes(user.role));

  const SaveBtn = ({ label="Saqlash", loadLabel="Saqlanmoqda..." }) => (
    <button type="submit" disabled={saving} style={{
      padding:"12px 28px",
      background: saved ? "#16a34a" : "linear-gradient(135deg,#dc2626,#b91c1c)",
      color:"#fff", fontSize:14, fontWeight:700,
      border:"none", borderRadius:11, cursor:saving?"not-allowed":"pointer",
      display:"flex", alignItems:"center", gap:7,
      opacity:saving?0.75:1,
      boxShadow:"0 4px 16px rgba(220,38,38,0.28)",
      transition:"background .3s",
    }}>
      {saving ? <LuLoader size={15} className="spin" /> : saved ? <LuCheck size={15} strokeWidth={3}/> : null}
      {saved ? "Saqlandi ✓" : saving ? loadLabel : label}
    </button>
  );

  return (
    <>
    <SEO title="Profilim" noindex />
    <LogoutModal isOpen={showLogout} onClose={() => setShowLogout(false)} redirectTo="/" />
    <div style={{ fontFamily:"'Inter',sans-serif", maxWidth:960, margin:"0 auto", padding:"0 20px 80px" }}>
      <style>{`
        .spin{animation:spin 1s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .tab-btn:hover{background:#f8fafc!important}
        .chip-btn{transition:all .15s;cursor:pointer;user-select:none}
        .chip-btn:hover{opacity:.85}
        .field-inp:focus{border-color:#dc2626!important;box-shadow:0 0 0 3px rgba(220,38,38,.08)!important}
        @media(max-width:700px){.profile-grid{grid-template-columns:1fr!important}.profile-sidebar{position:static!important}}
      `}</style>

      {/* ── Banner ───────────────────────────────────────────── */}
      <div style={{
        background:"linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)",
        borderRadius:24, padding:"36px 32px", marginBottom:28,
        display:"flex", alignItems:"center", gap:24,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute",inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:-60,right:-40, width:220,height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(220,38,38,.15),transparent 70%)", filter:"blur(30px)", pointerEvents:"none" }}/>

        {/* Avatar */}
        <div style={{ position:"relative", flexShrink:0, zIndex:1 }}>
          <div style={{
            width:84, height:84, borderRadius:"50%",
            background: user.avatar ? "transparent" : "linear-gradient(135deg,#dc2626,#b91c1c)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#fff", fontSize:28, fontWeight:800,
            border:"3px solid rgba(255,255,255,.2)", overflow:"hidden",
          }}>
            {user.avatar
              ? <img src={user.avatar} alt="av" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
              : initials}
          </div>
          <button onClick={()=>fileRef.current?.click()} disabled={avatarLoading} style={{
            position:"absolute", bottom:0, right:0,
            width:28, height:28, borderRadius:"50%",
            background:avatarLoading?"#94a3b8":"#fff",
            border:"2px solid #1e293b", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 2px 8px rgba(0,0,0,.3)", transition:"transform .15s",
          }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            {avatarLoading
              ? <LuLoader size={12} className="spin" style={{ color:"#374151" }}/>
              : <LuCamera size={12} style={{ color:"#374151" }}/>
            }
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange}/>
        </div>

        {/* Info */}
        <div style={{ flex:1, zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:"#fff", margin:0 }}>
              {user.firstName} {user.lastName}
            </h1>
            {user.isVerified && (
              <span style={{
                background:"rgba(34,197,94,.2)", color:"#4ade80",
                fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20,
                display:"flex", alignItems:"center", gap:3,
              }}>
                <LuBadgeCheck size={11}/> Tasdiqlangan
              </span>
            )}
          </div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.5)", margin:"0 0 12px" }}>
            {user.email}{user.phone?` · ${user.phone}`:""}
          </p>
          {user.role === "business" && businessProfile?.companyName && (
            <p style={{ fontSize:13, color:"rgba(255,255,255,.7)", margin:"-8px 0 10px", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
              <LuBriefcase size={12}/> {businessProfile.companyName}
              {businessProfile.companyType && <span style={{ fontSize:11, color:"rgba(255,255,255,.4)", fontWeight:400 }}>· {COMPANY_TYPE_LABELS[businessProfile.companyType]||businessProfile.companyType}</span>}
            </p>
          )}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <span style={{
              background:"rgba(220,38,38,.2)", color:"#fca5a5",
              fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6,
              textTransform:"capitalize",
            }}>
              {user.role === "blogger" ? "🎥 Blogger" : user.role === "business" ? "🏢 Biznes" : user.role === "admin" ? "⚡ Admin" : "👤 Foydalanuvchi"}
            </span>
            {bloggerProfile?.rating > 0 && (
              <span style={{ background:"rgba(245,158,11,.2)", color:"#fcd34d", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6, display:"flex", alignItems:"center", gap:3 }}>
                <LuStar size={10}/> {bloggerProfile.rating} ({bloggerProfile.reviewCount} sharh)
              </span>
            )}
            {bloggerProfile?.isVerified && (
              <span style={{ background:"rgba(99,102,241,.2)", color:"#a5b4fc", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>
                ✓ Verified Blogger
              </span>
            )}
            {businessProfile?.isVerified && (
              <span style={{ background:"rgba(99,102,241,.2)", color:"#a5b4fc", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6, display:"flex", alignItems:"center", gap:3 }}>
                <LuBadgeCheck size={11}/> Verified Business
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        {user.role === "blogger" && bloggerProfile && (
          <div style={{ display:"flex", gap:20, zIndex:1, flexShrink:0 }} className="hidden-sm">
            {[
              { label:"Obunachi",  value: bloggerProfile.followers ? bloggerProfile.followers.toLocaleString() : "—" },
              { label:"Kampaniya", value: bloggerProfile.stats?.completedCampaigns || 0 },
              { label:"Reyting",   value: bloggerProfile.rating || "—" },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{s.value}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.45)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {user.role === "business" && businessProfile && (
          <div style={{ display:"flex", gap:20, zIndex:1, flexShrink:0 }} className="hidden-sm">
            {[
              { label:"Kampaniyalar", value: businessProfile.stats?.totalCampaigns || 0 },
              { label:"Faol",         value: businessProfile.stats?.activeCampaigns || 0 },
              { label:"Sarflandi",    value: businessProfile.stats?.totalSpent ? `${(businessProfile.stats.totalSpent/1000000).toFixed(1)}M` : "0" },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{s.value}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.45)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Body grid ─────────────────────────────────────────── */}
      <div className="profile-grid" style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:20, alignItems:"start" }}>

        {/* Sidebar */}
        <div className="profile-sidebar" style={{
          background:"#fff", border:"1.5px solid #e2e8f0",
          borderRadius:16, padding:"12px 8px",
          position:"sticky", top:80,
        }}>
          {visibleTabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={()=>setTab(id)} className="tab-btn" style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, border:"none",
              background: tab===id ? "#fef2f2" : "transparent",
              color: tab===id ? "#dc2626" : "#374151",
              fontSize:13, fontWeight:tab===id?700:500,
              cursor:"pointer", textAlign:"left", width:"100%",
              transition:"all .15s",
            }}>
              <Icon size={15} style={{ color:tab===id?"#dc2626":"#9ca3af", flexShrink:0 }}/>
              {label}
              {tab===id && <LuChevronRight size={13} style={{ marginLeft:"auto", color:"#dc2626" }}/>}
            </button>
          ))}

          <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
            <Link to="/notifications" style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, color:"#374151",
              fontSize:13, fontWeight:500, textDecoration:"none",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <LuBell size={15} style={{ color:"#9ca3af" }}/> Bildirishnomalar
            </Link>
            <Link to="/wishlist" style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, color:"#374151",
              fontSize:13, fontWeight:500, textDecoration:"none",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <LuBookmark size={15} style={{ color:"#9ca3af" }}/> Wishlist
            </Link>
          </div>
          <div style={{ marginTop:4, paddingTop:8, borderTop:"1px solid #f1f5f9" }}>
            <button onClick={handleLogout} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, border:"none",
              background:"transparent", color:"#ef4444",
              fontSize:13, fontWeight:500, cursor:"pointer", width:"100%",
            }}
              onMouseEnter={e=>e.currentTarget.style.background="#fef2f2"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <LuLogOut size={15}/> Chiqish
            </button>
          </div>
        </div>

        {/* Main panel */}
        <div style={{ background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:18, padding:"28px 32px", minHeight:400 }}>

          {/* ══ TAB: PERSONAL ══════════════════════════════════ */}
          {tab === "personal" && (
            <form onSubmit={savePersonal}>
              <SectionTitle sub="Asosiy ma'lumotlaringizni tahrirlang">Shaxsiy ma'lumotlar</SectionTitle>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:0 }}>
                <FieldWrap>
                  <Label>Ism</Label>
                  <input className="field-inp" style={inp()} value={pForm.firstName}
                    onChange={e=>setPForm(p=>({...p,firstName:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Ismingiz"/>
                </FieldWrap>
                <FieldWrap>
                  <Label>Familiya</Label>
                  <input className="field-inp" style={inp()} value={pForm.lastName}
                    onChange={e=>setPForm(p=>({...p,lastName:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Familiyangiz"/>
                </FieldWrap>
              </div>

              <FieldWrap>
                <Label><LuMail size={12} style={{ marginRight:4 }}/>Email (o'zgartirib bo'lmaydi)</Label>
                <input style={inp({ background:"#f8fafc", color:"#94a3b8" })} value={user.email} readOnly/>
              </FieldWrap>

              <FieldWrap>
                <Label><LuPhone size={12} style={{ marginRight:4 }}/>Telefon</Label>
                <input className="field-inp" style={inp()} value={pForm.phone}
                  onChange={e=>setPForm(p=>({...p,phone:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="+998 90 000 00 00"/>
              </FieldWrap>

              <SaveBtn label="O'zgarishlarni saqlash"/>
            </form>
          )}

          {/* ══ TAB: BLOGGER PROFILE ═══════════════════════════ */}
          {tab === "blogger" && user.role === "blogger" && (
            loadingTab ? (
              <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 0", gap:12 }}>
                <LuLoader size={32} className="spin" style={{ color:"#dc2626" }}/>
                <p style={{ color:"#94a3b8", margin:0 }}>Profil yuklanmoqda...</p>
              </div>
            ) : (
              <form onSubmit={saveBlogger}>
                {/* ── Asosiy ── */}
                <SectionTitle sub="Kanallar va asosiy ma'lumotlar">Blogger profili</SectionTitle>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <FieldWrap>
                    <Label>@ Handle (username) *</Label>
                    <div style={{ position:"relative" }}>
                      <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:14, fontWeight:700 }}>@</span>
                      <input className="field-inp" style={inp({ paddingLeft:28 })} value={bForm.handle}
                        onChange={e=>setBForm(p=>({...p,handle:e.target.value.toLowerCase().replace(/\s/g,"")}))}
                        onFocus={onFocus} onBlur={onBlur} placeholder="ismingiz"/>
                    </div>
                  </FieldWrap>
                  <FieldWrap>
                    <Label><LuMapPin size={12} style={{ marginRight:4 }}/>Joylashuv</Label>
                    <input className="field-inp" style={inp()} value={bForm.location}
                      onChange={e=>setBForm(p=>({...p,location:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Toshkent, O'zbekiston"/>
                  </FieldWrap>
                </div>

                <FieldWrap>
                  <Label>Bio / Tavsif</Label>
                  <textarea className="field-inp" style={{ ...inp(), resize:"vertical", minHeight:90, lineHeight:1.6 }}
                    value={bForm.bio} onChange={e=>setBForm(p=>({...p,bio:e.target.value}))}
                    onFocus={onFocus} onBlur={onBlur}
                    placeholder="O'zingiz va kontentingiz haqida qisqacha..." maxLength={500}/>
                  <div style={{ fontSize:11, color:"#94a3b8", textAlign:"right", marginTop:4 }}>{bForm.bio.length}/500</div>
                </FieldWrap>

                <Divider/>

                {/* ── Platformalar ── */}
                <SectionTitle sub="Faol ijtimoiy tarmoqlaringizni belgilang">Platformalar</SectionTitle>
                <FieldWrap>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
                    {PLATFORMS.map(({ id, label, color, bg, Icon }) => {
                      const active = bForm.platforms.includes(id);
                      return (
                        <button key={id} type="button" onClick={()=>toggleArr("platforms",id)} className="chip-btn" style={{
                          padding:"12px 8px", borderRadius:12, border:`2px solid ${active?color:"#e2e8f0"}`,
                          background: active ? bg : "#fff",
                          display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                        }}>
                          <Icon size={20} style={{ color: active ? color : "#9ca3af" }}/>
                          <span style={{ fontSize:12, fontWeight:700, color: active ? color : "#64748b" }}>{label}</span>
                          {active && <LuCheck size={11} style={{ color, fontWeight:800 }}/>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Social links — faqat tanlangan platformalar uchun */}
                  {bForm.platforms.length > 0 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      <Label>Profil linklari</Label>
                      {bForm.platforms.map(pid => {
                        const plat = PLATFORMS.find(p=>p.id===pid);
                        return (
                          <div key={pid} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{
                              width:36, height:36, borderRadius:9, flexShrink:0,
                              background: plat.bg, display:"flex", alignItems:"center", justifyContent:"center",
                            }}>
                              <plat.Icon size={16} style={{ color:plat.color }}/>
                            </div>
                            <input className="field-inp" style={{ ...inp(), flex:1 }}
                              value={bForm.socialLinks[pid]||""}
                              onChange={e=>setBForm(p=>({...p,socialLinks:{...p.socialLinks,[pid]:e.target.value}}))}
                              onFocus={onFocus} onBlur={onBlur}
                              placeholder={
                                pid==="instagram" ? "https://instagram.com/username"
                                : pid==="youtube" ? "https://youtube.com/@channel"
                                : pid==="telegram" ? "https://t.me/username"
                                : "https://tiktok.com/@username"
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </FieldWrap>

                <Divider/>

                {/* ── Auditoriya ── */}
                <SectionTitle sub="Kanalingizdagi obunachilar haqida">Auditoriya statistikasi</SectionTitle>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                  <FieldWrap>
                    <Label><LuUsers size={12} style={{ marginRight:4 }}/>Obunachilar soni</Label>
                    <input className="field-inp" style={inp()} type="number" value={bForm.followers}
                      onChange={e=>setBForm(p=>({...p,followers:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="85000"/>
                  </FieldWrap>
                  <FieldWrap>
                    <Label>Followers oraliq</Label>
                    <select className="field-inp" style={{ ...inp(), appearance:"none", cursor:"pointer" }}
                      value={bForm.followersRange} onChange={e=>setBForm(p=>({...p,followersRange:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Tanlang</option>
                      {FOLLOWERS_RANGES.map(r=><option key={r} value={r}>{r}</option>)}
                    </select>
                  </FieldWrap>
                  <FieldWrap>
                    <Label><LuTrendingUp size={12} style={{ marginRight:4 }}/>Engagement rate (%)</Label>
                    <input className="field-inp" style={inp()} type="number" step="0.1" value={bForm.engagementRate}
                      onChange={e=>setBForm(p=>({...p,engagementRate:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="3.5"/>
                  </FieldWrap>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <FieldWrap>
                    <Label>Auditoriya yoshi</Label>
                    <select className="field-inp" style={{ ...inp(), appearance:"none", cursor:"pointer" }}
                      value={bForm.audienceAge} onChange={e=>setBForm(p=>({...p,audienceAge:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Tanlang</option>
                      {["13-17","18-24","25-34","35-44","45+","Aralash"].map(a=><option key={a} value={a}>{a}</option>)}
                    </select>
                  </FieldWrap>
                  <FieldWrap>
                    <Label>Auditoriya jinsi</Label>
                    <select className="field-inp" style={{ ...inp(), appearance:"none", cursor:"pointer" }}
                      value={bForm.audienceGender} onChange={e=>setBForm(p=>({...p,audienceGender:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Tanlang</option>
                      {["Ko'proq erkaklar","Ko'proq ayollar","Teng","Aralash"].map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                  </FieldWrap>
                </div>

                <Divider/>

                {/* ── Nisha va xizmatlar ── */}
                <SectionTitle sub="Qaysi sohalarda ishlaysiz?">Kategoriyalar (Nisha)</SectionTitle>
                <FieldWrap>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {CATEGORIES.map(cat => {
                      const active = bForm.categories.includes(cat);
                      return (
                        <button key={cat} type="button" onClick={()=>toggleArr("categories",cat)} className="chip-btn" style={{
                          padding:"7px 14px", borderRadius:20,
                          border:`1.5px solid ${active?"#dc2626":"#e2e8f0"}`,
                          background: active?"#fef2f2":"#fff",
                          color: active?"#dc2626":"#64748b",
                          fontSize:13, fontWeight:active?700:500,
                        }}>{cat}</button>
                      );
                    })}
                  </div>
                </FieldWrap>

                <SectionTitle sub="Qanday reklama xizmatlarini ko'rsatasiz?">Xizmatlar</SectionTitle>
                <FieldWrap>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                    {SERVICES.map(({ id, label, emoji }) => {
                      const active = bForm.services.includes(id);
                      return (
                        <button key={id} type="button" onClick={()=>toggleArr("services",id)} className="chip-btn" style={{
                          padding:"12px 10px", borderRadius:12,
                          border:`2px solid ${active?"#dc2626":"#e2e8f0"}`,
                          background: active?"#fef2f2":"#fff",
                          display:"flex", alignItems:"center", gap:8,
                          fontSize:13, fontWeight:active?700:500,
                          color: active?"#dc2626":"#374151",
                        }}>
                          <span style={{ fontSize:18 }}>{emoji}</span>
                          {label}
                          {active && <LuCheck size={13} style={{ marginLeft:"auto", color:"#dc2626", strokeWidth:3 }}/>}
                        </button>
                      );
                    })}
                  </div>
                </FieldWrap>

                <Divider/>

                {/* ── Narxlar ── */}
                <SectionTitle sub="Har bir xizmat uchun narxlarni so'm da kiriting">
                  <LuDollarSign size={16} style={{ marginRight:6 }}/>Narxlar (so'm)
                </SectionTitle>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                  {PRICING_FIELDS.map(({ key, label, icon, placeholder }) => (
                    <FieldWrap key={key}>
                      <Label>{icon} {label}</Label>
                      <div style={{ position:"relative" }}>
                        <input className="field-inp" style={{ ...inp(), paddingRight:50 }}
                          type="number" value={bForm.pricing[key]}
                          onChange={e=>setBForm(p=>({...p,pricing:{...p.pricing,[key]:e.target.value}}))}
                          onFocus={onFocus} onBlur={onBlur} placeholder={placeholder}/>
                        <span style={{
                          position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                          fontSize:12, fontWeight:700, color:"#94a3b8",
                        }}>so'm</span>
                      </div>
                    </FieldWrap>
                  ))}
                </div>

                {/* Pricing summary card */}
                {Object.values(bForm.pricing).some(v=>Number(v)>0) && (
                  <div style={{
                    background:"#f8fafc", border:"1.5px solid #e2e8f0",
                    borderRadius:14, padding:"16px 20px", marginBottom:24,
                  }}>
                    <p style={{ fontSize:13, fontWeight:700, color:"#374151", margin:"0 0 12px" }}>
                      Narxlar xulosasi:
                    </p>
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      {PRICING_FIELDS.filter(f=>Number(bForm.pricing[f.key])>0).map(f=>(
                        <span key={f.key} style={{
                          background:"#fff", border:"1px solid #e2e8f0",
                          borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, color:"#0f172a",
                          display:"flex", alignItems:"center", gap:4,
                        }}>
                          {f.icon} {f.label.replace(" narxi","")}: {Number(bForm.pricing[f.key]).toLocaleString()} so'm
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Divider/>

                {/* ── Qo'shimcha ── */}
                <SectionTitle sub="Portfolio va veb sayt">Qo'shimcha</SectionTitle>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <FieldWrap>
                    <Label><LuLink size={12} style={{ marginRight:4 }}/>Portfolio (havola)</Label>
                    <input className="field-inp" style={inp()} value={bForm.portfolio}
                      onChange={e=>setBForm(p=>({...p,portfolio:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="https://portfolio.com"/>
                  </FieldWrap>
                  <FieldWrap>
                    <Label><LuGlobe size={12} style={{ marginRight:4 }}/>Veb sayt</Label>
                    <input className="field-inp" style={inp()} value={bForm.website}
                      onChange={e=>setBForm(p=>({...p,website:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="https://mening-saytim.uz"/>
                  </FieldWrap>
                </div>

                {/* Profil to'liqlik */}
                {(() => {
                  const fields = [bForm.handle,bForm.bio,bForm.location,bForm.platforms.length,bForm.categories.length,bForm.services.length,Object.values(bForm.pricing).some(v=>Number(v)>0),bForm.followers];
                  const filled = fields.filter(Boolean).length;
                  const pct = Math.round((filled/fields.length)*100);
                  return (
                    <div style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:14, padding:"16px 20px", marginBottom:24 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>Profil to'liqligi</span>
                        <span style={{ fontSize:13, fontWeight:800, color: pct>=80?"#16a34a":pct>=50?"#dc2626":"#94a3b8" }}>{pct}%</span>
                      </div>
                      <div style={{ background:"#e2e8f0", borderRadius:99, height:8, overflow:"hidden" }}>
                        <div style={{
                          height:"100%", borderRadius:99, transition:"width .5s",
                          width:`${pct}%`,
                          background: pct>=80?"#16a34a":pct>=50?"#dc2626":"#94a3b8",
                        }}/>
                      </div>
                      {pct < 100 && (
                        <p style={{ fontSize:12, color:"#94a3b8", margin:"8px 0 0", display:"flex", alignItems:"center", gap:4 }}>
                          <LuInfo size={12}/> To'liq profil qidiruvda yuqoriroq chiqadi
                        </p>
                      )}
                    </div>
                  );
                })()}

                <SaveBtn label="Blogger profilini saqlash" loadLabel="Saqlanmoqda..."/>
              </form>
            )
          )}

          {/* ══ TAB: BUSINESS PROFILE ═════════════════════════ */}
          {tab === "business" && user.role === "business" && (
            loadingTab ? (
              <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 0", gap:12 }}>
                <LuLoader size={32} className="spin" style={{ color:"#dc2626" }}/>
                <p style={{ color:"#94a3b8", margin:0 }}>Profil yuklanmoqda...</p>
              </div>
            ) : (
              <form onSubmit={saveBusiness}>
                <SectionTitle sub="Kompaniyangiz haqida to'liq ma'lumot kiriting">Biznes profili</SectionTitle>

                {/* ── Logo upload ── */}
                <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:24, padding:"18px 20px", background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:16 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{
                      width:72, height:72, borderRadius:16,
                      background: bizForm.logo ? "transparent" : "linear-gradient(135deg,#1e293b,#374151)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      border:"2px solid #e2e8f0", overflow:"hidden",
                    }}>
                      {bizForm.logo
                        ? <img src={bizForm.logo} alt="logo" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                        : <span style={{ fontSize:28 }}>🏢</span>
                      }
                    </div>
                    <button type="button" onClick={()=>logoRef.current?.click()} disabled={logoLoading} style={{
                      position:"absolute", bottom:-6, right:-6,
                      width:26, height:26, borderRadius:"50%",
                      background:logoLoading?"#94a3b8":"#dc2626",
                      border:"2px solid #fff", cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 2px 8px rgba(0,0,0,.2)",
                    }}>
                      {logoLoading
                        ? <LuLoader size={11} className="spin" style={{ color:"#fff" }}/>
                        : <LuCamera size={11} style={{ color:"#fff" }}/>
                      }
                    </button>
                    <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleLogoChange}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#0f172a" }}>Kompaniya logotipi</p>
                    <p style={{ margin:"4px 0 8px", fontSize:12, color:"#94a3b8" }}>JPG, PNG yoki WebP · Maksimal 2MB</p>
                    <button type="button" onClick={()=>logoRef.current?.click()} disabled={logoLoading} style={{
                      padding:"7px 16px", background:"#fff",
                      border:"1.5px solid #e2e8f0", borderRadius:8,
                      fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer",
                    }}>
                      {bizForm.logo ? "Logoni almashtirish" : "Logo yuklash"}
                    </button>
                  </div>
                </div>

                {/* ── Asosiy ── */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <FieldWrap>
                    <Label>Kompaniya nomi *</Label>
                    <input className="field-inp" style={inp()} value={bizForm.companyName}
                      onChange={e=>setBizForm(p=>({...p,companyName:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur} placeholder="Masalan: Poytaxt Group"/>
                  </FieldWrap>
                  <FieldWrap>
                    <Label>Kompaniya turi</Label>
                    <select className="field-inp" style={{ ...inp(), appearance:"none", cursor:"pointer" }}
                      value={bizForm.companyType} onChange={e=>setBizForm(p=>({...p,companyType:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Tanlang</option>
                      {COMPANY_TYPES.map(t=><option key={t} value={t}>{COMPANY_TYPE_LABELS[t]}</option>)}
                    </select>
                  </FieldWrap>
                </div>

                <FieldWrap>
                  <Label>Tavsif / Bio</Label>
                  <textarea className="field-inp" style={{ ...inp(), resize:"vertical", minHeight:90, lineHeight:1.6 }}
                    value={bizForm.description} onChange={e=>setBizForm(p=>({...p,description:e.target.value}))}
                    onFocus={onFocus} onBlur={onBlur}
                    placeholder="Kompaniyangiz, mahsulot yoki xizmatlaringiz haqida..." maxLength={600}/>
                  <div style={{ fontSize:11, color:"#94a3b8", textAlign:"right", marginTop:4 }}>{bizForm.description.length}/600</div>
                </FieldWrap>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <FieldWrap>
                    <Label><LuMapPin size={12} style={{ marginRight:4 }}/>Joylashuv</Label>
                    <input className="field-inp" style={inp()} value={bizForm.location}
                      onChange={e=>setBizForm(p=>({...p,location:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur} placeholder="Toshkent, O'zbekiston"/>
                  </FieldWrap>
                  <FieldWrap>
                    <Label><LuGlobe size={12} style={{ marginRight:4 }}/>Veb sayt</Label>
                    <input className="field-inp" style={inp()} value={bizForm.website}
                      onChange={e=>setBizForm(p=>({...p,website:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur} placeholder="https://kompaniyam.uz"/>
                  </FieldWrap>
                </div>

                <Divider/>

                {/* ── Aloqa ── */}
                <SectionTitle sub="Bloggerlar siz bilan qanday bog'lansin?">Aloqa ma'lumotlari</SectionTitle>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <FieldWrap>
                    <Label><LuPhone size={12} style={{ marginRight:4 }}/>Kompaniya telefoni</Label>
                    <input className="field-inp" style={inp()} value={bizForm.contactPhone}
                      onChange={e=>setBizForm(p=>({...p,contactPhone:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur} placeholder="+998 71 200 00 00"/>
                  </FieldWrap>
                  <FieldWrap>
                    <Label><LuMail size={12} style={{ marginRight:4 }}/>Kompaniya emaili</Label>
                    <input className="field-inp" style={inp()} type="email" value={bizForm.contactEmail}
                      onChange={e=>setBizForm(p=>({...p,contactEmail:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur} placeholder="info@kompaniyam.uz"/>
                  </FieldWrap>
                </div>

                <Divider/>

                {/* ── Ijtimoiy tarmoqlar ── */}
                <SectionTitle sub="Kompaniyangizning ijtimoiy sahifalarini kiriting">Ijtimoiy tarmoqlar</SectionTitle>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {PLATFORMS.map(({ id, color, bg, Icon }) => (
                    <div key={id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Icon size={17} style={{ color }}/>
                      </div>
                      <input className="field-inp" style={{ ...inp(), flex:1 }}
                        value={bizForm.socialLinks[id]||""}
                        onChange={e=>setBizForm(p=>({...p,socialLinks:{...p.socialLinks,[id]:e.target.value}}))}
                        onFocus={onFocus} onBlur={onBlur}
                        placeholder={
                          id==="instagram" ? "https://instagram.com/kompaniyam"
                          : id==="youtube"  ? "https://youtube.com/@kompaniyam"
                          : id==="telegram" ? "https://t.me/kompaniyam"
                          : "https://tiktok.com/@kompaniyam"
                        }
                      />
                    </div>
                  ))}
                </div>

                <Divider/>

                {/* ── Kampaniya sozlamalari ── */}
                <SectionTitle sub="Qaysi platformalarda reklama qilmoqchisiz?">Kampaniya sozlamalari</SectionTitle>

                <FieldWrap>
                  <Label>Maqsadli platformalar</Label>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                    {PLATFORMS.map(({ id, label, color, bg, Icon }) => {
                      const active = bizForm.targetPlatforms.includes(id);
                      return (
                        <button key={id} type="button" onClick={()=>toggleBizArr("targetPlatforms",id)} className="chip-btn" style={{
                          padding:"12px 8px", borderRadius:12,
                          border:`2px solid ${active?color:"#e2e8f0"}`,
                          background:active?bg:"#fff",
                          display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                        }}>
                          <Icon size={20} style={{ color:active?color:"#9ca3af" }}/>
                          <span style={{ fontSize:12, fontWeight:700, color:active?color:"#64748b" }}>{label}</span>
                          {active && <LuCheck size={11} style={{ color }}/>}
                        </button>
                      );
                    })}
                  </div>
                </FieldWrap>

                <FieldWrap>
                  <Label>Maqsadli nishalar (blogger kategoriyasi)</Label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {CATEGORIES.map(cat => {
                      const active = bizForm.targetNiches.includes(cat);
                      return (
                        <button key={cat} type="button" onClick={()=>toggleBizArr("targetNiches",cat)} className="chip-btn" style={{
                          padding:"7px 14px", borderRadius:20,
                          border:`1.5px solid ${active?"#dc2626":"#e2e8f0"}`,
                          background:active?"#fef2f2":"#fff",
                          color:active?"#dc2626":"#64748b",
                          fontSize:13, fontWeight:active?700:500,
                        }}>{cat}</button>
                      );
                    })}
                  </div>
                </FieldWrap>

                <FieldWrap>
                  <Label><LuDollarSign size={12} style={{ marginRight:4 }}/>Taxminiy byudjet</Label>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {BUDGET_RANGES.map(r => {
                      const active = bizForm.budgetRange === r;
                      return (
                        <button key={r} type="button" onClick={()=>setBizForm(p=>({...p,budgetRange:active?"":r}))} className="chip-btn" style={{
                          padding:"9px 16px", borderRadius:10,
                          border:`2px solid ${active?"#dc2626":"#e2e8f0"}`,
                          background:active?"#fef2f2":"#fff",
                          color:active?"#dc2626":"#374151",
                          fontSize:13, fontWeight:active?700:500,
                        }}>{BUDGET_LABELS[r]}</button>
                      );
                    })}
                  </div>
                </FieldWrap>

                {/* Profil to'liqlik */}
                {(() => {
                  const fields = [bizForm.companyName, bizForm.companyType, bizForm.description, bizForm.website, bizForm.location, bizForm.contactPhone||bizForm.contactEmail, bizForm.targetPlatforms.length, bizForm.targetNiches.length, bizForm.budgetRange, bizForm.logo];
                  const filled = fields.filter(Boolean).length;
                  const pct = Math.round((filled/fields.length)*100);
                  return (
                    <div style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:14, padding:"16px 20px", marginBottom:24 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>Profil to'liqligi</span>
                        <span style={{ fontSize:13, fontWeight:800, color:pct>=80?"#16a34a":pct>=50?"#dc2626":"#94a3b8" }}>{pct}%</span>
                      </div>
                      <div style={{ background:"#e2e8f0", borderRadius:99, height:8, overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:99, transition:"width .5s", width:`${pct}%`, background:pct>=80?"#16a34a":pct>=50?"#dc2626":"#94a3b8" }}/>
                      </div>
                      {pct < 100 && (
                        <p style={{ fontSize:12, color:"#94a3b8", margin:"8px 0 0", display:"flex", alignItems:"center", gap:4 }}>
                          <LuInfo size={12}/> To'liq profil bloggerlar uchun qiziqarliroq ko'rinadi
                        </p>
                      )}
                    </div>
                  );
                })()}

                <SaveBtn label="Biznes profilini saqlash" loadLabel="Saqlanmoqda..."/>
              </form>
            )
          )}

          {/* ══ TAB: MY ADS ════════════════════════════════════ */}
          {tab === "my-ads" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                <SectionTitle sub={`${myAds.length} ta e'lon`}>Mening e'lonlarim</SectionTitle>
                <Link to="/post-ad" style={{
                  display:"flex", alignItems:"center", gap:6,
                  padding:"9px 18px", background:"linear-gradient(135deg,#dc2626,#b91c1c)",
                  color:"#fff", borderRadius:10, textDecoration:"none", fontSize:13, fontWeight:700,
                }}>
                  <LuPlus size={14}/> Yangi e'lon
                </Link>
              </div>
              {loadingTab ? (
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"60px 0" }}><LuLoader size={32} className="spin" style={{ color:"#dc2626" }}/></div>
              ) : myAds.length===0 ? (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ fontSize:52, marginBottom:12 }}>📢</div>
                  <p style={{ color:"#94a3b8", marginBottom:20 }}>Hali e'lon bergansiz</p>
                  <Link to="/post-ad" style={{ padding:"10px 22px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", borderRadius:10, textDecoration:"none", fontSize:13, fontWeight:700 }}>
                    Birinchi e'lon berish
                  </Link>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {myAds.map(ad => (
                    <div key={ad._id} style={{ border:"1.5px solid #e2e8f0", borderRadius:14, padding:"16px 18px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:200 }}>
                        <div style={{ display:"flex", gap:8, marginBottom:6, flexWrap:"wrap", alignItems:"center" }}>
                          <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:5, background:ad.type==="blogger"?"#ede9fe":"#dbeafe", color:ad.type==="blogger"?"#6d28d9":"#1e40af" }}>
                            {ad.type==="blogger"?"Blogger":"Biznes"}
                          </span>
                          <StatusBadge s={ad.status}/>
                        </div>
                        {ad.status==="rejected" && (
                          <div style={{ margin:"4px 0 6px", padding:"6px 10px", background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, fontSize:12, color:"#991b1b", display:"flex", alignItems:"center", gap:6 }}>
                            ✕ Admin tomonidan rad etildi. Tahrirlang va qayta yuboring.
                          </div>
                        )}
                        {ad.status==="pending" && (
                          <div style={{ margin:"4px 0 6px", padding:"6px 10px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, fontSize:12, color:"#92400e", display:"flex", alignItems:"center", gap:6 }}>
                            ⏳ Admin tekshiruvi kutilmoqda (24 soat ichida)
                          </div>
                        )}
                        <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#0f172a" }}>
                          {ad.title||ad.companyName||ad.productName||"—"}
                        </p>
                        <p style={{ margin:"4px 0 0", fontSize:12, color:"#94a3b8" }}>
                          {ad.description||ad.productDescription||""}
                        </p>
                        <p style={{ margin:"6px 0 0", fontSize:11, color:"#94a3b8", display:"flex", alignItems:"center", gap:8 }}>
                          <LuCalendar size={11}/> {new Date(ad.createdAt).toLocaleDateString("uz-UZ")}
                          <LuEye size={11}/> {ad.views||0} ko'rildi
                          {ad.phone && <><LuPhone size={11}/> {ad.phone}</>}
                        </p>
                      </div>
                      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                        {(ad.status==="approved"||ad.status==="active") && (
                          <Link to={`/ads/${ad._id}`} style={{ padding:"7px 12px", border:"1.5px solid #e2e8f0", borderRadius:8, textDecoration:"none", color:"#374151", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                            <LuEye size={12}/> Ko'rish
                          </Link>
                        )}
                        <button onClick={()=>openEditAd(ad)} style={{ padding:"7px 12px", border:"1.5px solid #bfdbfe", borderRadius:8, background:"#eff6ff", color:"#2563eb", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600 }}>
                          <LuSettings size={12}/> Tahrirlash
                        </button>
                        <button onClick={()=>deleteAd(ad._id)} style={{ padding:"7px 10px", border:"1.5px solid #fee2e2", borderRadius:8, background:"#fef2f2", color:"#dc2626", cursor:"pointer", display:"flex", alignItems:"center" }}>
                          <LuTrash2 size={13}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Edit Ad Modal ── */}
              {editAd && (
                <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={()=>setEditAd(null)}>
                  <div style={{ background:"#fff", borderRadius:20, padding:"28px 24px", maxWidth:500, width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                      <div>
                        <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:"#0f172a" }}>E'lonni tahrirlash</h3>
                        <p style={{ margin:"4px 0 0", fontSize:12, color:"#94a3b8" }}>Saqlangandan so'ng admin tekshiruviga yuboriladi</p>
                      </div>
                      <button onClick={()=>setEditAd(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", padding:4 }}>✕</button>
                    </div>

                    {editAd.type==="blogger" ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                        <FieldWrap>
                          <Label>E'lon sarlavhasi</Label>
                          <input style={inp()} value={editForm.title||""} onChange={e=>setEditForm(p=>({...p,title:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Sarlavha" />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Tavsif</Label>
                          <textarea style={{...inp(),resize:"vertical"}} rows={3} value={editForm.description||""} onChange={e=>setEditForm(p=>({...p,description:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="O'zingiz haqingizda qisqacha..." />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Telefon</Label>
                          <input style={inp()} value={editForm.phone||""} onChange={e=>setEditForm(p=>({...p,phone:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="+998 90 000 00 00" />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Portfolio havolasi</Label>
                          <input style={inp()} value={editForm.portfolio||""} onChange={e=>setEditForm(p=>({...p,portfolio:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="https://..." />
                        </FieldWrap>
                        <div>
                          <Label>Narxlar (so'm)</Label>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:6 }}>
                            {[{k:"post",l:"Post"},{k:"story",l:"Story"},{k:"video",l:"Video"}].map(({k,l})=>(
                              <div key={k}>
                                <div style={{ fontSize:11, color:"#6b7280", marginBottom:4 }}>{l}</div>
                                <input style={inp({fontSize:13})} value={editForm.pricing?.[k]||""} onChange={e=>setEditForm(p=>({...p,pricing:{...p.pricing,[k]:e.target.value}}))} onFocus={onFocus} onBlur={onBlur} placeholder="0" type="number" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                        <FieldWrap>
                          <Label>Kompaniya nomi</Label>
                          <input style={inp()} value={editForm.companyName||""} onChange={e=>setEditForm(p=>({...p,companyName:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Kompaniya nomi" />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Mahsulot / xizmat nomi</Label>
                          <input style={inp()} value={editForm.productName||""} onChange={e=>setEditForm(p=>({...p,productName:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Mahsulot nomi" />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Tavsif</Label>
                          <textarea style={{...inp(),resize:"vertical"}} rows={3} value={editForm.productDescription||""} onChange={e=>setEditForm(p=>({...p,productDescription:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Mahsulot haqida..." />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Telefon</Label>
                          <input style={inp()} value={editForm.phone||""} onChange={e=>setEditForm(p=>({...p,phone:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="+998 90 000 00 00" />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Maqsadli auditoriya</Label>
                          <input style={inp()} value={editForm.targetAudience||""} onChange={e=>setEditForm(p=>({...p,targetAudience:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="Yoshlar, ayollar..." />
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Byudjet</Label>
                          <select style={{...inp(),cursor:"pointer"}} value={editForm.budget?.range||""} onChange={e=>setEditForm(p=>({...p,budget:{range:e.target.value}}))}>
                            <option value="">Tanlang</option>
                            {BUDGET_RANGES.map(r=><option key={r} value={r}>{BUDGET_LABELS[r]||r}</option>)}
                          </select>
                        </FieldWrap>
                        <FieldWrap>
                          <Label>Kampaniya davomiyligi</Label>
                          <input style={inp()} value={editForm.campaignDuration||""} onChange={e=>setEditForm(p=>({...p,campaignDuration:e.target.value}))} onFocus={onFocus} onBlur={onBlur} placeholder="1 oy, 2 hafta..." />
                        </FieldWrap>
                      </div>
                    )}

                    <div style={{ display:"flex", gap:10, marginTop:22 }}>
                      <button onClick={saveEditAd} disabled={editSaving} style={{ flex:1, padding:"12px", background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:editSaving?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, opacity:editSaving?0.7:1 }}>
                        {editSaving ? <><LuLoader size={15} style={{animation:"spin 1s linear infinite"}}/> Saqlanmoqda...</> : <><LuCheck size={15}/> Saqlash</>}
                      </button>
                      <button onClick={()=>setEditAd(null)} style={{ padding:"12px 18px", background:"none", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:13, color:"#64748b", cursor:"pointer" }}>Bekor</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ TAB: WISHLIST ══════════════════════════════════ */}
          {tab === "wishlist" && (
            <div>
              <SectionTitle sub={`${wishlist.length} ta saqlangan`}>Saqlanganlar</SectionTitle>
              {wishlist.length===0 ? (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ fontSize:52, marginBottom:12 }}>💾</div>
                  <p style={{ color:"#94a3b8", marginBottom:20 }}>Hali hech narsa saqlanmagan</p>
                  <Link to="/bloggers" style={{ padding:"10px 22px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", borderRadius:10, textDecoration:"none", fontSize:13, fontWeight:700 }}>
                    Bloggerlarni ko'rish
                  </Link>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {wishlist.map(item => (
                    <div key={item._id} style={{ border:"1.5px solid #e2e8f0", borderRadius:14, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#dc2626,#b91c1c)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:16, overflow:"hidden", flexShrink:0 }}>
                          {item.avatar ? <img src={item.avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (item.name?.[0]||"B")}
                        </div>
                        <div>
                          <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#0f172a" }}>{item.name}</p>
                          <p style={{ margin:"2px 0 0", fontSize:12, color:"#94a3b8" }}>{item.savedAt}</p>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        {item.link && <Link to={item.link} style={{ padding:"7px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, textDecoration:"none", color:"#374151", fontSize:12, fontWeight:600 }}>Ko'rish</Link>}
                        <button onClick={()=>removeWishlist(item._id)} style={{ padding:"7px 10px", border:"1.5px solid #fee2e2", borderRadius:8, background:"#fef2f2", color:"#dc2626", cursor:"pointer", display:"flex", alignItems:"center" }}>
                          <LuTrash2 size={13}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ TAB: CAMPAIGNS ═════════════════════════════════ */}
          {tab === "campaigns" && (
            <div>
              <SectionTitle sub="Faol va tugallangan kampaniyalar">Kampaniyalarim</SectionTitle>
              {loadingTab ? (
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"60px 0" }}><LuLoader size={32} className="spin" style={{ color:"#dc2626" }}/></div>
              ) : campaigns.length===0 ? (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ fontSize:52, marginBottom:12 }}>🤝</div>
                  <p style={{ color:"#94a3b8", marginBottom:20 }}>Hali aktiv kampaniya yo'q</p>
                  <Link to="/bloggers" style={{ padding:"10px 22px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", borderRadius:10, textDecoration:"none", fontSize:13, fontWeight:700 }}>
                    Blogger topish
                  </Link>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {campaigns.map(c => (
                    <div key={c._id} style={{ border:"1.5px solid #e2e8f0", borderRadius:14, padding:"16px 18px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <span style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>Kampaniya #{c._id?.slice(-6)}</span>
                        <StatusBadge s={c.status}/>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        {c.agreedPrice && <p style={{ margin:0, fontSize:12, color:"#64748b" }}>💰 {c.agreedPrice.toLocaleString()} so'm</p>}
                        {c.startDate && <p style={{ margin:0, fontSize:12, color:"#64748b" }}>📅 {new Date(c.startDate).toLocaleDateString("uz-UZ")}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ TAB: SETTINGS ══════════════════════════════════ */}
          {tab === "settings" && (
            <div>
              <SectionTitle sub="Til, bildirishnomalar va hisob sozlamalari">Sozlamalar</SectionTitle>
              <div style={{ border:"1.5px solid #e2e8f0", borderRadius:14, overflow:"hidden", marginBottom:16 }}>
                <div style={{ padding:"14px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#0f172a" }}>Bildirishnomalar</p>
                </div>
                {[
                  { label:"Email bildirishnomalar", desc:"Yangi kampaniya va xabarlar" },
                  { label:"Yangi e'lonlar", desc:"Mening kategoriyamga mos e'lonlar" },
                  { label:"Kampaniya yangilanishlari", desc:"Holat o'zgarganda xabar" },
                  { label:"Marketing emaillar", desc:"Yangiliklar va takliflar" },
                ].map((item,i,arr) => (
                  <div key={i} style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:i<arr.length-1?"1px solid #f8fafc":"none" }}>
                    <div>
                      <p style={{ margin:0, fontSize:13, fontWeight:600, color:"#374151" }}>{item.label}</p>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:"#94a3b8" }}>{item.desc}</p>
                    </div>
                    <div style={{ position:"relative", width:44, height:24, cursor:"pointer" }} onClick={e=>{
                      const span = e.currentTarget.querySelector("span");
                      const dot  = e.currentTarget.querySelector(".dot");
                      const isOn = span.dataset.on === "1";
                      span.style.background = isOn ? "#e2e8f0" : "#dc2626";
                      dot.style.transform = isOn ? "translateX(0px)" : "translateX(20px)";
                      span.dataset.on = isOn ? "0" : "1";
                    }}>
                      <span data-on="1" style={{ position:"absolute",inset:0,borderRadius:24,background:"#dc2626",transition:".3s" }}/>
                      <span className="dot" style={{ position:"absolute",width:18,height:18,background:"#fff",borderRadius:"50%",top:3,left:3,transition:".3s",transform:"translateX(20px)" }}/>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ border:"1.5px solid #e2e8f0", borderRadius:14, padding:"18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#0f172a" }}>Hisob turi</p>
                  <p style={{ margin:"4px 0 0", fontSize:13, color:"#64748b" }}>
                    {user.role==="blogger"?"Blogger hisob":user.role==="business"?"Biznes hisob":"Oddiy hisob"}
                  </p>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:user.isVerified?"#16a34a":"#94a3b8", display:"flex", alignItems:"center", gap:5 }}>
                  <LuBadgeCheck size={15}/> {user.isVerified?"Tasdiqlangan":"Tasdiqlanmagan"}
                </span>
              </div>
            </div>
          )}

          {/* ══ TAB: SECURITY ══════════════════════════════════ */}
          {tab === "security" && (
            <div>
              <SectionTitle sub="Parol va hisob xavfsizligi">Xavfsizlik</SectionTitle>
              <form onSubmit={changePassword} style={{ maxWidth:440 }}>
                {[
                  { label:"Joriy parol",         key:"currentPassword", ph:"••••••••" },
                  { label:"Yangi parol",          key:"newPassword",     ph:"Kamida 6 ta belgi" },
                  { label:"Yangi parolni tasdiqlang", key:"confirmPassword", ph:"Qayta kiriting" },
                ].map(f=>(
                  <FieldWrap key={f.key}>
                    <Label>{f.label}</Label>
                    <input type="password" className="field-inp" style={inp()}
                      value={passForm[f.key]}
                      onChange={e=>setPassForm(p=>({...p,[f.key]:e.target.value}))}
                      onFocus={onFocus} onBlur={onBlur} placeholder={f.ph}/>
                  </FieldWrap>
                ))}
                <SaveBtn label="Parolni yangilash"/>
              </form>

              <Divider/>
              <div style={{ border:"1.5px solid #fee2e2", borderRadius:14, padding:"20px" }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:"#dc2626", margin:"0 0 8px" }}>⚠️ Xavfli zona</h3>
                <p style={{ fontSize:13, color:"#94a3b8", margin:"0 0 14px" }}>Hisobni o'chirish qaytarib bo'lmaydigan harakat.</p>
                <button type="button" style={{ padding:"9px 20px", border:"1.5px solid #fca5a5", borderRadius:8, background:"#fff", color:"#dc2626", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  Hisobni o'chirish
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
    </>
  );
}
