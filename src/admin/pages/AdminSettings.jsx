import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "../../components/ui/toast";
import {
  LuUser, LuShield, LuChartBar, LuCamera, LuSave, LuX,
  LuEye, LuEyeOff, LuCheck, LuPencil, LuPhone, LuMail,
  LuCalendar, LuUsers, LuFileText, LuMegaphone, LuActivity,
  LuTrendingUp, LuLoader, LuRefreshCw, LuCircleCheck,
} from "react-icons/lu";

/* ── Design tokens (same as all other admin pages) ──────────────────────────── */
const T = {
  red:"#C62828", redMid:"#E53935", redLight:"#FFEBEE", redBorder:"#FFCDD2",
  bg:"#F1F5F9", surface:"#FFFFFF", surfaceUp:"#F8FAFC", border:"#E2E8F0",
  text:"#0F172A", textMuted:"#475569", textDim:"#94A3B8",
  success:"#16A34A", successBg:"#F0FDF4", successBd:"#BBF7D0",
  warn:"#D97706", warnBg:"#FFFBEB", warnBd:"#FDE68A",
  info:"#0284C7", infoBg:"#F0F9FF", infoBd:"#BAE6FD",
  indigo:"#4F46E5", indigoBg:"#EEF2FF", indigoBd:"#C7D2FE",
};

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", { day:"numeric", month:"long", year:"numeric" });
}
function getInitials(u) {
  if (!u) return "AD";
  return `${u.firstName?.[0]||""}${u.lastName?.[0]||""}`.toUpperCase() || "AD";
}

/* ── UI primitives ───────────────────────────────────────────────────────────── */
const Card = ({ children, style }) => (
  <div style={{
    background:T.surface, borderRadius:16, border:`1px solid ${T.border}`,
    boxShadow:"0 1px 4px rgba(0,0,0,0.04)", padding:24, ...style,
  }}>
    {children}
  </div>
);

const SectionHead = ({ icon: Icon, title, sub, color = T.indigo }) => (
  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
    <div style={{
      width:40, height:40, borderRadius:12, flexShrink:0,
      background:`${color}18`, border:`1px solid ${color}30`,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <Icon size={18} color={color}/>
    </div>
    <div>
      <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{title}</div>
      {sub && <div style={{ fontSize:12, color:T.textDim, marginTop:1 }}>{sub}</div>}
    </div>
  </div>
);

const FieldLabel = ({ children }) => (
  <label style={{
    display:"block", fontSize:11, fontWeight:700, color:T.textMuted,
    textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5,
  }}>{children}</label>
);

function InputField({ label, value, onChange, type="text", placeholder, disabled, right }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ position:"relative" }}>
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} disabled={disabled}
          style={{
            width:"100%", padding: right ? "10px 44px 10px 13px" : "10px 13px",
            border:`1.5px solid ${f && !disabled ? T.indigo : T.border}`,
            boxShadow: f && !disabled ? `0 0 0 3px ${T.indigo}18` : "none",
            borderRadius:10, fontSize:13, color:T.text,
            background: disabled ? T.surfaceUp : T.surface,
            outline:"none", fontFamily:"inherit",
            opacity: disabled ? 0.7 : 1, transition:"all 0.15s",
            boxSizing:"border-box",
          }}
          onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        />
        {right && (
          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>
            {right}
          </div>
        )}
      </div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, loading, disabled, color = T.indigo, style }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled || loading}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:"flex", alignItems:"center", gap:7,
        padding:"10px 20px", borderRadius:10, border:"none",
        background: disabled || loading ? `${color}88` : h ? `${color}dd` : color,
        color:"#fff", fontSize:13, fontWeight:700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily:"inherit", transition:"all 0.15s", ...style,
      }}>
      {loading && <LuLoader size={13} style={{ animation:"spin 1s linear infinite" }}/>}
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, disabled, style }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        display:"flex", alignItems:"center", gap:7,
        padding:"10px 18px", borderRadius:10,
        border:`1.5px solid ${T.border}`,
        background: h ? T.surfaceUp : T.surface,
        color:T.textMuted, fontSize:13, fontWeight:600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily:"inherit", transition:"all 0.15s", ...style,
      }}>
      {children}
    </button>
  );
}

const StatBox = ({ icon: Icon, label, value, sub, color }) => (
  <div style={{
    background:T.surface, border:`1px solid ${T.border}`, borderRadius:14,
    padding:"18px 20px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
  }}>
    <div style={{
      width:40, height:40, borderRadius:11, background:`${color}18`,
      display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14,
    }}>
      <Icon size={18} color={color}/>
    </div>
    <div style={{ fontSize:26, fontWeight:800, color:T.text, lineHeight:1 }}>{value ?? "—"}</div>
    <div style={{ fontSize:12, fontWeight:600, color:T.textMuted, marginTop:5 }}>{label}</div>
    {sub && <div style={{ fontSize:11, color:T.textDim, marginTop:2 }}>{sub}</div>}
  </div>
);

/* ── Tabs config ─────────────────────────────────────────────────────────────── */
const TABS = [
  { id:"profile",  label:"Profil",      Icon:LuUser,     color:T.indigo },
  { id:"security", label:"Xavfsizlik",  Icon:LuShield,   color:T.red    },
  { id:"system",   label:"Tizim",       Icon:LuChartBar,color:T.info   },
];

/* ── Main ────────────────────────────────────────────────────────────────────── */
export default function AdminSettings() {
  const [tab, setTab] = useState("profile");
  const { user: storeUser, setUser } = useAuthStore();

  /* profile */
  const [profile, setProfile]   = useState({ firstName:"", lastName:"", phone:"" });
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileRef = useRef(null);

  /* password */
  const [pwd, setPwd]         = useState({ current:"", next:"", confirm:"" });
  const [showPwd, setShowPwd] = useState({ current:false, next:false, confirm:false });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [strength, setStrength]   = useState(0);

  /* system stats */
  const [stats, setStats]           = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  /* load me */
  useEffect(() => {
    if (storeUser) {
      setProfile({ firstName:storeUser.firstName||"", lastName:storeUser.lastName||"", phone:storeUser.phone||"" });
    } else {
      api.get("/auth/me").then(r => {
        const u = r.data.data;
        setUser(u);
        setProfile({ firstName:u.firstName||"", lastName:u.lastName||"", phone:u.phone||"" });
      });
    }
  }, []);

  /* load stats on system tab */
  const loadStats = () => {
    setStatsLoading(true);
    api.get("/admin/dashboard")
      .then(r => setStats(r.data.data?.stats || r.data.stats || null))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  };
  useEffect(() => { if (tab === "system" && !stats) loadStats(); }, [tab]);

  /* password strength */
  const checkStrength = (v) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setStrength(s);
    setPwd(p => ({ ...p, next:v }));
  };

  /* save profile */
  const saveProfile = async () => {
    if (!profile.firstName.trim()) { toast.error("Ism bo'sh bo'lishi mumkin emas"); return; }
    setSaving(true);
    try {
      const res = await api.patch("/profile", {
        firstName: profile.firstName.trim(),
        lastName:  profile.lastName.trim(),
        phone:     profile.phone.trim(),
      });
      const updated = res.data.data || res.data.user;
      if (updated) setUser({ ...storeUser, ...updated });
      toast.success("Profil saqlandi");
      setEditing(false);
    } catch {/* handled by api.js */}
    setSaving(false);
  };

  /* avatar */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Fayl 2MB dan katta bo'lmasin"); return; }
    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await api.patch("/profile/avatar", { avatar: ev.target.result });
        const updated = res.data.data || res.data.user;
        if (updated) setUser({ ...storeUser, ...updated });
        toast.success("Avatar yangilandi");
      } catch {/* handled by api.js */}
      setAvatarLoading(false);
    };
    reader.readAsDataURL(file);
  };

  /* change password */
  const changePassword = async () => {
    if (!pwd.current)             { toast.error("Joriy parolni kiriting"); return; }
    if (pwd.next.length < 8)      { toast.error("Yangi parol kamida 8 ta belgi bo'lishi kerak"); return; }
    if (pwd.next !== pwd.confirm) { toast.error("Parollar mos kelmadi"); return; }
    setPwdSaving(true);
    try {
      await api.patch("/auth/update-password", { currentPassword:pwd.current, newPassword:pwd.next });
      toast.success("Parol o'zgartirildi");
      setPwd({ current:"", next:"", confirm:"" });
      setStrength(0);
    } catch {/* handled by api.js */}
    setPwdSaving(false);
  };

  const cancelEdit = () => {
    setProfile({ firstName:storeUser?.firstName||"", lastName:storeUser?.lastName||"", phone:storeUser?.phone||"" });
    setEditing(false);
  };

  const strColors = ["#E2E8F0", T.redMid, T.warn, T.success, "#10B981"];
  const strLabels = ["", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"];
  const fullName  = storeUser ? `${storeUser.firstName||""} ${storeUser.lastName||""}`.trim() || "Admin" : "Admin";

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .adm-settings * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div className="adm-settings" style={{
        fontFamily:"'Manrope',sans-serif", padding:"28px 28px 56px",
        background:T.bg, minHeight:"100vh",
      }}>
        <div style={{ maxWidth:980, margin:"0 auto" }}>

          {/* Page header */}
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:24, fontWeight:800, color:T.text, letterSpacing:"-0.03em", marginBottom:4 }}>
              Sozlamalar
            </h1>
            <p style={{ fontSize:13, color:T.textDim }}>Profil, xavfsizlik va tizim ma'lumotlari</p>
          </div>

          <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>

            {/* ── Sidebar ── */}
            <aside style={{
              width:220, flexShrink:0, background:T.surface,
              borderRadius:16, border:`1px solid ${T.border}`,
              boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
              overflow:"hidden", position:"sticky", top:24,
            }}>
              {/* Admin card */}
              <div style={{
                padding:"20px 16px",
                background:`linear-gradient(135deg, ${T.indigoBg}, ${T.bg})`,
                borderBottom:`1px solid ${T.border}`,
              }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center" }}>
                  <div style={{ position:"relative" }}>
                    <div style={{
                      width:64, height:64, borderRadius:18,
                      background: storeUser?.avatar
                        ? `url(${storeUser.avatar}) center/cover`
                        : `linear-gradient(135deg,${T.indigo},#7C3AED)`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:22, fontWeight:800, color:"#fff",
                      border:`3px solid ${T.surface}`,
                      boxShadow:`0 4px 16px ${T.indigo}30`,
                    }}>
                      {!storeUser?.avatar && getInitials(storeUser)}
                    </div>
                    <button onClick={()=>fileRef.current?.click()} disabled={avatarLoading} style={{
                      position:"absolute", bottom:-3, right:-3,
                      width:24, height:24, borderRadius:"50%",
                      background:T.indigo, border:`2px solid ${T.surface}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      cursor:"pointer",
                    }}>
                      <LuCamera size={10} color="#fff"/>
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange}/>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:T.text }}>{fullName}</div>
                    <div style={{ fontSize:11, color:T.textDim, marginTop:2 }}>Administrator</div>
                    <div style={{
                      display:"inline-flex", alignItems:"center", gap:4,
                      background:T.successBg, color:T.success, border:`1px solid ${T.successBd}`,
                      padding:"2px 10px", borderRadius:99, fontSize:11, fontWeight:700, marginTop:6,
                    }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:T.success }}/>
                      Faol
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <div style={{ padding:"8px" }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{
                    display:"flex", alignItems:"center", gap:10, width:"100%",
                    padding:"10px 12px", borderRadius:10, border:"none",
                    background: tab===t.id ? `${t.color}14` : "transparent",
                    color: tab===t.id ? t.color : T.textMuted,
                    fontSize:13, fontWeight: tab===t.id ? 700 : 500,
                    cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                    transition:"all 0.15s", marginBottom:2,
                  }}>
                    <div style={{
                      width:30, height:30, borderRadius:8,
                      background: tab===t.id ? `${t.color}18` : T.surfaceUp,
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                    }}>
                      <t.Icon size={14} color={tab===t.id ? t.color : T.textDim}/>
                    </div>
                    {t.label}
                    {tab===t.id && (
                      <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:t.color }}/>
                    )}
                  </button>
                ))}
              </div>

              {/* Account info */}
              <div style={{ padding:"12px 16px 16px", borderTop:`1px solid ${T.border}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.textDim, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
                  Hisob
                </div>
                {[
                  { label:"Email",      val:storeUser?.email },
                  { label:"Qo'shilgan", val:fmtDate(storeUser?.createdAt) },
                ].map(({ label, val }) => (
                  <div key={label} style={{ marginBottom:8 }}>
                    <div style={{ fontSize:10, color:T.textDim }}>{label}</div>
                    <div style={{ fontSize:11.5, fontWeight:600, color:T.textMuted, wordBreak:"break-all" }}>{val||"—"}</div>
                  </div>
                ))}
              </div>
            </aside>

            {/* ── Content ── */}
            <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:16 }}>

              {/* ══ PROFILE TAB ══════════════════════════════════════ */}
              {tab === "profile" && (
                <>
                  {/* Avatar banner */}
                  <Card style={{
                    background:`linear-gradient(135deg, ${T.indigoBg}, ${T.bg})`,
                    border:`1px solid ${T.indigoBd}`,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                      {/* Big avatar */}
                      <div style={{ position:"relative", flexShrink:0 }}>
                        <div style={{
                          width:90, height:90, borderRadius:22,
                          background: storeUser?.avatar
                            ? `url(${storeUser.avatar}) center/cover`
                            : `linear-gradient(135deg,${T.indigo},#7C3AED)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:30, fontWeight:800, color:"#fff",
                          border:`3px solid ${T.surface}`,
                          boxShadow:`0 8px 24px ${T.indigo}30`,
                        }}>
                          {!storeUser?.avatar && getInitials(storeUser)}
                          {avatarLoading && (
                            <div style={{
                              position:"absolute", inset:0, borderRadius:22,
                              background:"rgba(0,0,0,0.45)",
                              display:"flex", alignItems:"center", justifyContent:"center",
                            }}>
                              <LuLoader size={22} color="#fff" style={{ animation:"spin 1s linear infinite" }}/>
                            </div>
                          )}
                        </div>
                        <button onClick={()=>fileRef.current?.click()} disabled={avatarLoading} style={{
                          position:"absolute", bottom:-4, right:-4,
                          width:30, height:30, borderRadius:"50%",
                          background:T.indigo, border:`2.5px solid ${T.surface}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          cursor:"pointer",
                        }}>
                          <LuCamera size={12} color="#fff"/>
                        </button>
                      </div>

                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:22, fontWeight:800, color:T.text, marginBottom:6 }}>{fullName}</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:T.textMuted }}>
                            <LuMail size={13} color={T.textDim}/>{storeUser?.email||"—"}
                          </span>
                          {storeUser?.phone && (
                            <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:T.textMuted }}>
                              <LuPhone size={13} color={T.textDim}/>{storeUser.phone}
                            </span>
                          )}
                          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:T.textMuted }}>
                            <LuCalendar size={13} color={T.textDim}/>{fmtDate(storeUser?.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display:"flex", gap:8 }}>
                        {!editing ? (
                          <button onClick={()=>setEditing(true)} style={{
                            display:"flex", alignItems:"center", gap:7,
                            padding:"10px 18px", borderRadius:10,
                            border:`1.5px solid ${T.indigoBd}`,
                            background:T.surface, color:T.indigo,
                            fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                          }}>
                            <LuPencil size={14}/> Tahrirlash
                          </button>
                        ) : (
                          <>
                            <GhostBtn onClick={cancelEdit} disabled={saving}>
                              <LuX size={14}/> Bekor
                            </GhostBtn>
                            <PrimaryBtn onClick={saveProfile} loading={saving}>
                              <LuSave size={14}/> Saqlash
                            </PrimaryBtn>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Fields */}
                  <Card>
                    <SectionHead icon={LuUser} title="Shaxsiy ma'lumotlar" sub="Profil ma'lumotlarini yangilang"/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
                      <InputField label="Ism" value={profile.firstName}
                        onChange={e=>setProfile(p=>({...p,firstName:e.target.value}))}
                        placeholder="Ismingiz" disabled={!editing}/>
                      <InputField label="Familiya" value={profile.lastName}
                        onChange={e=>setProfile(p=>({...p,lastName:e.target.value}))}
                        placeholder="Familiyangiz" disabled={!editing}/>
                      <InputField label="Telefon" value={profile.phone}
                        onChange={e=>setProfile(p=>({...p,phone:e.target.value}))}
                        placeholder="+998 90 123 45 67" disabled={!editing}/>
                      <InputField label="Email (o'zgartirib bo'lmaydi)" value={storeUser?.email||""} disabled/>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px", marginTop:4 }}>
                      {/* Role */}
                      <div style={{ marginBottom:16 }}>
                        <FieldLabel>Rol</FieldLabel>
                        <div style={{
                          padding:"10px 13px", borderRadius:10,
                          border:`1.5px solid ${T.border}`, background:T.surfaceUp,
                          fontSize:13, color:T.textMuted,
                          display:"flex", alignItems:"center", gap:8,
                        }}>
                          <span style={{ width:8, height:8, borderRadius:"50%", background:T.success }}/>
                          Administrator
                        </div>
                      </div>
                      {/* Status */}
                      <div style={{ marginBottom:16 }}>
                        <FieldLabel>Hisob holati</FieldLabel>
                        <div style={{
                          padding:"10px 13px", borderRadius:10,
                          border:`1.5px solid ${T.successBd}`, background:T.successBg,
                          fontSize:13, color:T.success, fontWeight:700,
                          display:"flex", alignItems:"center", gap:8,
                        }}>
                          <LuCircleCheck size={15}/> Faol hisob
                        </div>
                      </div>
                    </div>

                    {editing && (
                      <div style={{
                        display:"flex", gap:10, marginTop:8,
                        paddingTop:16, borderTop:`1px solid ${T.border}`,
                      }}>
                        <PrimaryBtn onClick={saveProfile} loading={saving}>
                          <LuSave size={14}/> O'zgarishlarni saqlash
                        </PrimaryBtn>
                        <GhostBtn onClick={cancelEdit} disabled={saving}>
                          Bekor qilish
                        </GhostBtn>
                      </div>
                    )}
                  </Card>
                </>
              )}

              {/* ══ SECURITY TAB ══════════════════════════════════════ */}
              {tab === "security" && (
                <>
                  <Card>
                    <SectionHead icon={LuShield} title="Parolni o'zgartirish"
                      sub="Xavfsizlik uchun vaqti-vaqti bilan parolni yangilang" color={T.redMid}/>

                    <div style={{ maxWidth:480, display:"flex", flexDirection:"column" }}>
                      <InputField
                        label="Joriy parol"
                        type={showPwd.current ? "text" : "password"}
                        value={pwd.current}
                        onChange={e=>setPwd(p=>({...p,current:e.target.value}))}
                        placeholder="Joriy parolingizni kiriting"
                        right={
                          <button onClick={()=>setShowPwd(p=>({...p,current:!p.current}))} style={{
                            background:"none", border:"none", cursor:"pointer",
                            color:T.textDim, display:"flex", fontFamily:"inherit",
                          }}>
                            {showPwd.current ? <LuEyeOff size={15}/> : <LuEye size={15}/>}
                          </button>
                        }
                      />

                      {/* New password with strength */}
                      <div style={{ marginBottom:16 }}>
                        <FieldLabel>Yangi parol</FieldLabel>
                        <div style={{ position:"relative" }}>
                          <input
                            type={showPwd.next ? "text" : "password"}
                            value={pwd.next}
                            onChange={e=>checkStrength(e.target.value)}
                            placeholder="Yangi parol (kamida 8 belgi)"
                            style={{
                              width:"100%", padding:"10px 44px 10px 13px",
                              border:`1.5px solid ${T.border}`, borderRadius:10,
                              fontSize:13, color:T.text, background:T.surface,
                              outline:"none", fontFamily:"inherit", boxSizing:"border-box",
                            }}
                            onFocus={e=>e.target.style.borderColor=T.indigo}
                            onBlur={e=>e.target.style.borderColor=T.border}
                          />
                          <button onClick={()=>setShowPwd(p=>({...p,next:!p.next}))} style={{
                            position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                            background:"none", border:"none", cursor:"pointer",
                            color:T.textDim, display:"flex", fontFamily:"inherit",
                          }}>
                            {showPwd.next ? <LuEyeOff size={15}/> : <LuEye size={15}/>}
                          </button>
                        </div>
                        {pwd.next && (
                          <div style={{ marginTop:8 }}>
                            <div style={{ display:"flex", gap:4, marginBottom:5 }}>
                              {[1,2,3,4].map(i=>(
                                <div key={i} style={{
                                  flex:1, height:4, borderRadius:2,
                                  background: i<=strength ? strColors[strength] : T.border,
                                  transition:"background 0.25s",
                                }}/>
                              ))}
                            </div>
                            <div style={{ fontSize:11.5, color:strColors[strength], fontWeight:700 }}>
                              {strLabels[strength]}
                              {strength>0 && (
                                <span style={{ color:T.textDim, fontWeight:400, marginLeft:8 }}>
                                  {strength<3 ? "· Katta harf, raqam va belgi qo'shing" : "· Parol yetarli darajada kuchli"}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <InputField
                        label="Parolni tasdiqlang"
                        type={showPwd.confirm ? "text" : "password"}
                        value={pwd.confirm}
                        onChange={e=>setPwd(p=>({...p,confirm:e.target.value}))}
                        placeholder="Yangi parolni qaytaring"
                        right={
                          <button onClick={()=>setShowPwd(p=>({...p,confirm:!p.confirm}))} style={{
                            background:"none", border:"none", cursor:"pointer",
                            color:T.textDim, display:"flex", fontFamily:"inherit",
                          }}>
                            {showPwd.confirm ? <LuEyeOff size={15}/> : <LuEye size={15}/>}
                          </button>
                        }
                      />
                      {pwd.confirm && pwd.next !== pwd.confirm && (
                        <div style={{ fontSize:12, color:T.redMid, marginTop:-10, marginBottom:12 }}>
                          Parollar mos kelmadi
                        </div>
                      )}
                      {pwd.confirm && pwd.next === pwd.confirm && pwd.confirm.length>0 && (
                        <div style={{ fontSize:12, color:T.success, marginTop:-10, marginBottom:12,
                          display:"flex", alignItems:"center", gap:4 }}>
                          <LuCheck size={12}/> Parollar mos keldi
                        </div>
                      )}

                      <PrimaryBtn
                        onClick={changePassword} loading={pwdSaving}
                        disabled={!pwd.current || !pwd.next || !pwd.confirm}
                        color={T.redMid} style={{ width:"fit-content" }}
                      >
                        <LuShield size={14}/> Parolni o'zgartirish
                      </PrimaryBtn>
                    </div>
                  </Card>

                  {/* Tips */}
                  <Card style={{ background:"linear-gradient(135deg,#0F172A,#1E293B)", border:"none" }}>
                    <div style={{
                      fontSize:13, fontWeight:700, color:"#fff", marginBottom:14,
                      display:"flex", alignItems:"center", gap:8,
                    }}>
                      <LuShield size={15} color={T.redMid}/>
                      Parol xavfsizligi maslahatlari
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      {[
                        "Kamida 8 ta belgi ishlating",
                        "Katta va kichik harflar qo'shing",
                        "Raqamlar va maxsus belgilar (+, #, !)",
                        "Shaxsiy ma'lumotlardan foydalanmang",
                        "Har xil platformada boshqa parol ishlating",
                        "Parol menejeridan foydalaning",
                      ].map((tip,i)=>(
                        <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                          <div style={{
                            width:18, height:18, borderRadius:"50%", flexShrink:0, marginTop:1,
                            background:"rgba(239,68,68,0.2)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            <LuCheck size={9} color={T.redMid}/>
                          </div>
                          <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {/* ══ SYSTEM TAB ══════════════════════════════════════ */}
              {tab === "system" && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:800, color:T.text }}>Tizim statistikasi</div>
                      <div style={{ fontSize:12, color:T.textDim, marginTop:2 }}>Real vaqt ma'lumotlari</div>
                    </div>
                    <button onClick={loadStats} disabled={statsLoading} style={{
                      display:"flex", alignItems:"center", gap:7,
                      padding:"9px 16px", borderRadius:10,
                      border:`1.5px solid ${T.border}`,
                      background:T.surface, color:T.textMuted,
                      fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                    }}>
                      <LuRefreshCw size={13} style={statsLoading ? {animation:"spin 1s linear infinite"} : {}}/>
                      Yangilash
                    </button>
                  </div>

                  {statsLoading ? (
                    <Card style={{ textAlign:"center", padding:56 }}>
                      <LuLoader size={28} color={T.indigo} style={{ animation:"spin 1s linear infinite", margin:"0 auto 12px" }}/>
                      <div style={{ color:T.textMuted, fontSize:14 }}>Statistika yuklanmoqda...</div>
                    </Card>
                  ) : stats ? (
                    <>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
                        <StatBox icon={LuUsers}     label="Jami foydalanuvchilar" value={stats.totalUsers}     color="#2563EB"/>
                        <StatBox icon={LuActivity}  label="Blogerlar"              value={stats.totalBloggers}  color="#7C3AED"/>
                        <StatBox icon={LuMegaphone} label="E'lonlar"               value={stats.totalAds}       color={T.warn}/>
                        <StatBox icon={LuFileText}  label="Blog maqolalari"        value={stats.totalBlogs}     color={T.success}/>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                        <StatBox icon={LuTrendingUp} label="Kutilayotgan e'lonlar"   value={stats.pendingAds}          color={T.redMid}  sub="Ko'rib chiqilishi kerak"/>
                        <StatBox icon={LuMail}       label="Yangi xabarlar"          value={stats.newContacts}         color={T.info}    sub="Javob berilmagan"/>
                        <StatBox icon={LuCheck}      label="Tugallangan kampaniyalar" value={stats.completedCampaigns} color={T.success} sub="Muvaffaqiyatli"/>
                      </div>

                      <Card>
                        <SectionHead icon={LuChartBar} title="Tizim ma'lumotlari" sub="Texnologiyalar va versiyalar" color={T.info}/>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
                          {[
                            ["Platforma",          "ADBlogger Admin v1.0"],
                            ["Backend",            "Node.js + Express"],
                            ["Ma'lumotlar ombori", "MongoDB Atlas"],
                            ["Fayl saqlash",       "Cloudinary"],
                            ["API versiya",        "v1"],
                            ["Server",             "Render.com"],
                          ].map(([label,val])=>(
                            <div key={label} style={{
                              padding:"12px 0", borderBottom:`1px solid ${T.border}`,
                              display:"flex", justifyContent:"space-between", alignItems:"center",
                            }}>
                              <span style={{ fontSize:13, color:T.textMuted }}>{label}</span>
                              <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{val}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </>
                  ) : (
                    <Card style={{ textAlign:"center", padding:56 }}>
                      <div style={{ fontSize:42, marginBottom:12 }}>📊</div>
                      <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:6 }}>Statistika yuklanmadi</div>
                      <div style={{ color:T.textMuted, fontSize:13, marginBottom:20 }}>Server bilan aloqa yo'q</div>
                      <button onClick={loadStats} style={{
                        padding:"10px 20px", borderRadius:10, border:"none",
                        background:T.indigo, color:"#fff", cursor:"pointer",
                        fontSize:13, fontWeight:700, fontFamily:"inherit",
                        display:"inline-flex", alignItems:"center", gap:7,
                      }}>
                        <LuRefreshCw size={13}/> Qayta urinish
                      </button>
                    </Card>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
