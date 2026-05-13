import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "../../components/ui/toast";
import { adminBloggersService } from "../../services/adminService";
import { FiInstagram, FiYoutube } from "react-icons/fi";
import { BsTiktok, BsTelegram } from "react-icons/bs";
import {
  PiMagnifyingGlassDuotone,
  PiArrowsClockwiseDuotone,
  PiTrashDuotone,
  PiCaretUpDownDuotone,
  PiUserCircleDuotone,
  PiEnvelopeDuotone,
  PiMapPinDuotone,
  PiStarDuotone,
  PiUsersThreeDuotone,
  PiCurrencyDollarSimpleDuotone,
  PiShoppingBagDuotone,
  PiCalendarDotsDuotone,
  PiCheckCircleDuotone,
  PiProhibitDuotone,
  PiLockSimpleDuotone,
  PiLockOpenDuotone,
  PiSnowflakeDuotone,
  PiWarningCircleDuotone,
  PiChartLineUpDuotone,
  PiEyeDuotone,
  PiEyeSlashDuotone,
  PiHashDuotone,
} from "react-icons/pi";

/* ─── Platform config ────────────────────────────────────────────── */
const PLT = {
  instagram: { Icon: FiInstagram,  color: "#e1306c", bg: "#fce7f3", label: "Instagram" },
  youtube:   { Icon: FiYoutube,    color: "#ff0000", bg: "#fee2e2", label: "YouTube"   },
  tiktok:    { Icon: BsTiktok,     color: "#010101", bg: "#f3f4f6", label: "TikTok"    },
  telegram:  { Icon: BsTelegram,   color: "#229ed9", bg: "#dbeafe", label: "Telegram"  },
};

const FOLLOWER_RANGES = [
  { label: "Barchasi",          min: 0,       max: Infinity },
  { label: "0 – 10K",           min: 0,       max: 10000    },
  { label: "10K – 50K",         min: 10000,   max: 50000    },
  { label: "50K – 100K",        min: 50000,   max: 100000   },
  { label: "100K – 500K",       min: 100000,  max: 500000   },
  { label: "500K+",             min: 500000,  max: Infinity },
];

const PER = 10;
const AVA_COLORS = ["#6366f1","#f43f5e","#f97316","#10b981","#8b5cf6","#0ea5e9","#ec4899"];

/* ─── Helpers ────────────────────────────────────────────────────── */
const ini = u => `${u?.firstName?.[0]||""}${u?.lastName?.[0]||""}`.toUpperCase() || "?";
const avaColor = u => AVA_COLORS[((u?.firstName||"?").charCodeAt(0)) % AVA_COLORS.length];
const fmtNum = n => n ? Number(n).toLocaleString("uz-UZ") : "0";
const fmtMoney = n => n ? Number(n).toLocaleString("uz-UZ") + " so'm" : "—";
const fmtDate = d => d ? new Date(d).toLocaleDateString("uz-UZ", { year:"numeric", month:"short", day:"numeric" }) : "—";

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Ava({ user, size = 40 }) {
  const col = avaColor(user);
  if (user?.avatar) return (
    <img src={user.avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: col + "22", border: `2px solid ${col}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 800, color: col, letterSpacing: "-0.5px",
    }}>{ini(user)}</div>
  );
}

/* ─── Status Pill ────────────────────────────────────────────────── */
function StatusPill({ blogger }) {
  if (blogger.isBlocked) return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <PiProhibitDuotone size={11}/> Bloklangan
    </span>
  );
  if (blogger.isFrozen) return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#dbeafe", color:"#1e40af", border:"1px solid #93c5fd", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <PiSnowflakeDuotone size={11}/> Muzlatilgan
    </span>
  );
  if (blogger.isVerified) return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#dcfce7", color:"#166534", border:"1px solid #86efac", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:"#16a34a" }}/> Tasdiqlangan
    </span>
  );
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fef9c3", color:"#854d0e", border:"1px solid #fde68a", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:"#ca8a04" }}/> Kutilmoqda
    </span>
  );
}

/* ─── Platform icons row ─────────────────────────────────────────── */
function PlatformIcons({ platforms = [], size = 22, gap = 5 }) {
  if (!platforms.length) return <span style={{ color:"#cbd5e1", fontSize:12 }}>—</span>;
  return (
    <div style={{ display:"flex", gap }}>
      {platforms.map(p => {
        const cfg = PLT[p?.toLowerCase()] || PLT.instagram;
        const { Icon, color, bg } = cfg;
        return (
          <span key={p} title={cfg.label} style={{ width: size, height: size, borderRadius: 6, background: bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink: 0 }}>
            <Icon style={{ fontSize: size * 0.55, color }} />
          </span>
        );
      })}
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:"18px 20px", border:"1.5px solid #e9ecf2", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:46, height:46, borderRadius:14, background: accent+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={22} style={{ color: accent }} />
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:24, fontWeight:900, color: accent, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Icon button ────────────────────────────────────────────────── */
function IconBtn({ onClick, title, children, hoverBg, hoverColor, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick} title={title} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width:32, height:32, borderRadius:9,
        border:`1.5px solid ${h&&!disabled ? hoverBg+"88" : "#e9ecf2"}`,
        background: h&&!disabled ? hoverBg+"18" : "#fff",
        color: h&&!disabled ? hoverColor : "#94a3b8",
        cursor: disabled ? "not-allowed" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.14s", flexShrink:0, opacity: disabled ? 0.4 : 1,
      }}
    >{children}</button>
  );
}

/* ─── Delete confirm modal ───────────────────────────────────────── */
function DeleteModal({ blogger, onClose, onConfirm, saving }) {
  if (!blogger) return null;
  const u = blogger.user;
  const name = u ? `${u.firstName} ${u.lastName}` : "Blogger";
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position:"fixed", inset:0, zIndex:9998, background:"rgba(15,23,42,0.6)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div style={{ background:"#fff", borderRadius:22, maxWidth:400, width:"100%", padding:28, boxShadow:"0 32px 80px rgba(0,0,0,0.22)" }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <PiWarningCircleDuotone size={28} style={{ color:"#ef4444" }}/>
        </div>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:17, fontWeight:800, color:"#0f172a", marginBottom:6 }}>Bloggerni o'chirish</div>
          <div style={{ fontSize:13, color:"#64748b" }}>
            <strong style={{ color:"#0f172a" }}>{name}</strong> blogger profilini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={onClose} style={{ padding:"11px", borderRadius:12, border:"1.5px solid #e2e8f0", background:"#f8fafc", color:"#64748b", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Bekor qilish
          </button>
          <button onClick={onConfirm} disabled={saving} style={{ padding:"11px", borderRadius:12, border:"none", background:"#ef4444", color:"#fff", fontSize:13, fontWeight:700, cursor:saving?"not-allowed":"pointer", fontFamily:"inherit", opacity:saving?0.6:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <PiTrashDuotone size={15}/> {saving ? "O'chirilmoqda…" : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail Modal ───────────────────────────────────────────────── */
function DetailModal({ blogger, onClose, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(blogger);

  useEffect(() => { setLocal(blogger); }, [blogger]);

  if (!local) return null;
  const u = local.user;
  const name = u ? `${u.firstName} ${u.lastName}`.trim() : "—";

  const push = (patch) => {
    const updated = { ...local, ...patch };
    setLocal(updated);
    onUpdate(updated);
  };

  const doVerify = async () => {
    setSaving(true);
    try {
      await adminBloggersService.verify(local._id, !local.isVerified);
      push({ isVerified: !local.isVerified });
      toast.success(local.isVerified ? "Tasdiq bekor qilindi" : "Blogger tasdiqlandi");
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  const doBlock = async () => {
    setSaving(true);
    try {
      await adminBloggersService.block(local._id, !local.isBlocked);
      push({ isBlocked: !local.isBlocked });
      toast.success(local.isBlocked ? "Bloklash bekor qilindi" : "Blogger bloklandi");
    } catch { toast.error("Bloklashda xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  const doFreeze = async () => {
    setSaving(true);
    try {
      await adminBloggersService.freeze(local._id, !local.isFrozen);
      push({ isFrozen: !local.isFrozen });
      toast.success(local.isFrozen ? "Muzlatish bekor qilindi" : "Hisob muzlatildi");
    } catch { toast.error("Muzlatishda xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  /* platform-level followers */
  const platformFollowers = local.socialAccounts || local.platformData || [];

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position:"fixed", inset:0, zIndex:9999, background:"rgba(15,23,42,0.65)",
      backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div style={{
        background:"#fff", borderRadius:24, width:"100%", maxWidth:600,
        maxHeight:"94vh", display:"flex", flexDirection:"column",
        boxShadow:"0 40px 100px rgba(0,0,0,0.28)", overflow:"hidden",
      }}>
        {/* ── Status banner (blocked / frozen) ── */}
        {local.isBlocked && (
          <div style={{ background:"#fee2e2", borderBottom:"1.5px solid #fca5a5", padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <PiProhibitDuotone size={16} style={{ color:"#dc2626" }}/>
              <span style={{ fontSize:13, fontWeight:700, color:"#991b1b" }}>Bu hisob bloklangan</span>
            </div>
            <button onClick={doBlock} disabled={saving}
              style={{ padding:"5px 14px", borderRadius:8, border:"1.5px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:12, fontWeight:700, cursor:saving?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, opacity:saving?0.6:1 }}>
              <PiLockOpenDuotone size={13}/> Blokdan chiqarish
            </button>
          </div>
        )}
        {local.isFrozen && !local.isBlocked && (
          <div style={{ background:"#dbeafe", borderBottom:"1.5px solid #93c5fd", padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <PiSnowflakeDuotone size={16} style={{ color:"#2563eb" }}/>
              <span style={{ fontSize:13, fontWeight:700, color:"#1d4ed8" }}>Bu hisob muzlatilgan</span>
            </div>
            <button onClick={doFreeze} disabled={saving}
              style={{ padding:"5px 14px", borderRadius:8, border:"1.5px solid #93c5fd", background:"#fff", color:"#2563eb", fontSize:12, fontWeight:700, cursor:saving?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, opacity:saving?0.6:1 }}>
              <PiLockOpenDuotone size={13}/> Muzlatishdan chiqarish
            </button>
          </div>
        )}

        {/* ── Header ── */}
        <div style={{ padding:"20px 24px 16px", borderBottom:"1.5px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background: local.isBlocked ? "linear-gradient(135deg,#fff5f5 0%,#fee2e2 100%)" : local.isFrozen ? "linear-gradient(135deg,#f0f9ff 0%,#dbeafe 100%)" : "linear-gradient(135deg,#fafbff 0%,#f0f4ff 100%)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ position:"relative" }}>
              <Ava user={u} size={52} />
              {local.isBlocked && (
                <div style={{ position:"absolute", bottom:-2, right:-2, width:18, height:18, borderRadius:"50%", background:"#dc2626", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <PiProhibitDuotone size={10} style={{ color:"#fff" }}/>
                </div>
              )}
              {local.isFrozen && !local.isBlocked && (
                <div style={{ position:"absolute", bottom:-2, right:-2, width:18, height:18, borderRadius:"50%", background:"#2563eb", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <PiSnowflakeDuotone size={10} style={{ color:"#fff" }}/>
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{name}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <StatusPill blogger={local} />
                {local.handle && (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#f1f5f9", color:"#475569", border:"1px solid #e2e8f0", padding:"3px 9px", borderRadius:99, fontSize:11, fontWeight:700 }}>
                    <PiHashDuotone size={11}/>@{local.handle}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:11, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#94a3b8", fontFamily:"inherit", flexShrink:0 }}>✕</button>
        </div>

        {/* ── Body ── */}
        <div style={{ overflowY:"auto", flex:1, padding:"20px 24px" }}>

          {/* Contact info */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {[
              { Icon: PiEnvelopeDuotone,            label:"Email",          val: u?.email || "—"                },
              { Icon: PiMapPinDuotone,               label:"Joylashuv",      val: local.location || "—"           },
              { Icon: PiCalendarDotsDuotone,         label:"Ro'yxatdan",     val: fmtDate(local.createdAt)        },
              { Icon: PiUserCircleDuotone,           label:"Hisob turi",     val: local.accountType || "Blogger"  },
            ].map(r => (
              <div key={r.label} style={{ background:"#f8fafc", border:"1.5px solid #f1f5f9", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"flex-start", gap:10 }}>
                <r.Icon size={16} style={{ color:"#6366f1", flexShrink:0, marginTop:2 }}/>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{r.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", wordBreak:"break-word" }}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Key metrics */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
            {[
              { Icon: PiUsersThreeDuotone,            label:"Obunachilar",  val: fmtNum(local.followers),             accent:"#6366f1" },
              { Icon: PiStarDuotone,                  label:"Reyting",      val: local.engagementRate ? `${local.engagementRate}%` : "—", accent:"#f59e0b" },
              { Icon: PiCurrencyDollarSimpleDuotone,  label:"Daromad",      val: fmtMoney(local.totalEarnings),        accent:"#10b981" },
              { Icon: PiShoppingBagDuotone,           label:"Zakazlar",     val: fmtNum(local.totalOrders || local.completedOrders), accent:"#8b5cf6" },
            ].map(r => (
              <div key={r.label} style={{ background:"#f8fafc", border:`1.5px solid ${r.accent}22`, borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
                <div style={{ width:34, height:34, borderRadius:10, background: r.accent+"18", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px" }}>
                  <r.Icon size={17} style={{ color: r.accent }}/>
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:2 }}>{r.val}</div>
                <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.05em" }}>{r.label}</div>
              </div>
            ))}
          </div>

          {/* Platforms section */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Platformalar</div>
            {(local.platforms || []).length === 0 ? (
              <div style={{ padding:"16px", background:"#f8fafc", border:"1.5px solid #f1f5f9", borderRadius:12, color:"#94a3b8", fontSize:13, textAlign:"center" }}>
                Platform ma'lumoti yo'q
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {(local.platforms || []).map(p => {
                  const cfg = PLT[p?.toLowerCase()] || { Icon: FiInstagram, color:"#6b7280", bg:"#f3f4f6", label: p };
                  const { Icon, color, bg, label } = cfg;
                  /* try to find per-platform followers */
                  const pData = platformFollowers.find(x => x.platform?.toLowerCase() === p?.toLowerCase());
                  const pfollowers = pData?.followers || pData?.followersCount;
                  const pengagement = pData?.engagementRate;
                  const plink = pData?.url || pData?.profileUrl || pData?.link;
                  return (
                    <div key={p} style={{ background:"#f8fafc", border:"1.5px solid #f1f5f9", borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background: bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon style={{ fontSize:20, color }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:"#0f172a", marginBottom:2 }}>{label}</div>
                        {plink && (
                          <div style={{ fontSize:11, color:"#94a3b8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{plink}</div>
                        )}
                      </div>
                      <div style={{ display:"flex", gap:16, flexShrink:0 }}>
                        {pfollowers != null && (
                          <div style={{ textAlign:"center" }}>
                            <div style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>{fmtNum(pfollowers)}</div>
                            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>followers</div>
                          </div>
                        )}
                        {pengagement != null && (
                          <div style={{ textAlign:"center" }}>
                            <div style={{ fontSize:14, fontWeight:800, color:"#f59e0b" }}>{pengagement}%</div>
                            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>engagement</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* If no platformData, show single summary row */}
                {platformFollowers.length === 0 && local.followers != null && (
                  <div style={{ background:"#f0f9ff", border:"1.5px solid #bae6fd", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <PiUsersThreeDuotone size={16} style={{ color:"#0ea5e9" }}/>
                    <span style={{ fontSize:13, fontWeight:700, color:"#0369a1" }}>Umumiy obunachilar:</span>
                    <span style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>{fmtNum(local.followers)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bio / description */}
          {local.bio && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Bio</div>
              <div style={{ background:"#f8fafc", border:"1.5px solid #f1f5f9", borderLeft:"3px solid #6366f1", borderRadius:"0 12px 12px 0", padding:"12px 16px", fontSize:13, color:"#334155", lineHeight:1.65 }}>
                {local.bio}
              </div>
            </div>
          )}

          {/* Pricing */}
          {local.pricing && Object.keys(local.pricing).length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Narxlar</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {Object.entries(local.pricing).map(([type, price]) => price ? (
                  <div key={type} style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:12, padding:"10px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:13, fontWeight:800, color:"#166534" }}>{fmtNum(price)}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:"#4ade80", textTransform:"uppercase", marginTop:2 }}>so'm / {type}</div>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {/* Services / niches */}
          {(local.services || local.niches || []).length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Yo'nalishlar</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(local.services || local.niches || []).map(s => (
                  <span key={s} style={{ padding:"4px 12px", borderRadius:100, background:"#f1f5f9", color:"#475569", fontSize:11, fontWeight:600, border:"1px solid #e2e8f0" }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Account actions ── */}
          <div style={{ marginBottom:6 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Hisob boshqaruvi</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {/* Verify */}
              <button onClick={doVerify} disabled={saving} style={{
                padding:"10px 8px", borderRadius:12, cursor:saving?"not-allowed":"pointer", fontFamily:"inherit",
                border: local.isVerified ? "1.5px solid #fde68a" : "1.5px solid #bbf7d0",
                background: local.isVerified ? "#fffbeb" : "#f0fdf4",
                color: local.isVerified ? "#92400e" : "#166534",
                fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:5, opacity:saving?0.6:1, transition:"all 0.14s",
              }}>
                {local.isVerified ? <><PiEyeSlashDuotone size={14}/> Bekor qilish</> : <><PiCheckCircleDuotone size={14}/> Tasdiqlash</>}
              </button>

              {/* Freeze */}
              <button onClick={doFreeze} disabled={saving} style={{
                padding:"10px 8px", borderRadius:12, cursor:saving?"not-allowed":"pointer", fontFamily:"inherit",
                border: local.isFrozen ? "1.5px solid #bae6fd" : "1.5px solid #e2e8f0",
                background: local.isFrozen ? "#f0f9ff" : "#f8fafc",
                color: local.isFrozen ? "#0369a1" : "#475569",
                fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:5, opacity:saving?0.6:1, transition:"all 0.14s",
              }}>
                <PiSnowflakeDuotone size={14}/> {local.isFrozen ? "Muzlatishni bekor" : "Muzlatish"}
              </button>

              {/* Block */}
              <button onClick={doBlock} disabled={saving} style={{
                padding:"10px 8px", borderRadius:12, cursor:saving?"not-allowed":"pointer", fontFamily:"inherit",
                border: local.isBlocked ? "1.5px solid #fca5a5" : "1.5px solid #fca5a5",
                background: local.isBlocked ? "#fff1f2" : "#fff1f2",
                color: local.isBlocked ? "#991b1b" : "#be123c",
                fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:5, opacity:saving?0.6:1, transition:"all 0.14s",
              }}>
                {local.isBlocked ? <><PiLockOpenDuotone size={14}/> Blokni ochish</> : <><PiLockSimpleDuotone size={14}/> Bloklash</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Pagination button ──────────────────────────────────────────── */
function PgBtn({ children, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ minWidth:32, height:32, padding:"0 8px", borderRadius:9, border:`1.5px solid ${active?"#c7d2fe":h?"#e2e8f0":"#f1f5f9"}`, background:active?"#eef2ff":h?"#f8fafc":"#fff", fontSize:12, fontWeight:active?800:500, cursor:disabled?"not-allowed":"pointer", color:active?"#3730a3":"#64748b", opacity:disabled?0.4:1, transition:"all 0.14s", fontFamily:"inherit" }}>
      {children}
    </button>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────── */
export default function AdminBloggers() {
  const [bloggers, setBloggers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [sort, setSort]         = useState("followers_desc");
  const [platFilter, setPlatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [followerRange, setFollowerRange] = useState(0); // index in FOLLOWER_RANGES
  const [detail, setDetail]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rowSaving, setRowSaving] = useState(null); // blogger._id being saved in row

  const fetchBloggers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminBloggersService.getAll({ page: 1, limit: 9999 });
      setBloggers(res.data || []);
    } catch { toast.error("Bloggerlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBloggers(); }, [fetchBloggers]);

  /* ── Filter & sort ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const range = FOLLOWER_RANGES[followerRange];

    let res = bloggers.filter(b => {
      const fullName = `${b.user?.firstName||""} ${b.user?.lastName||""}`.toLowerCase();
      const matchQ = !q ||
        b.handle?.toLowerCase().includes(q) ||
        fullName.includes(q) ||
        b.user?.email?.toLowerCase().includes(q);

      const matchPlt = platFilter === "all" || (b.platforms || []).map(p => p.toLowerCase()).includes(platFilter);

      const follows = b.followers || 0;
      const matchRange = follows >= range.min && follows < range.max;

      const matchStatus =
        statusFilter === "all"         ? true :
        statusFilter === "verified"    ? (b.isVerified && !b.isBlocked && !b.isFrozen) :
        statusFilter === "pending"     ? (!b.isVerified && !b.isBlocked && !b.isFrozen) :
        statusFilter === "frozen"      ? b.isFrozen :
        statusFilter === "blocked"     ? b.isBlocked : true;

      return matchQ && matchPlt && matchRange && matchStatus;
    });

    if (sort === "followers_desc") res = [...res].sort((a,b) => (b.followers||0) - (a.followers||0));
    if (sort === "followers_asc")  res = [...res].sort((a,b) => (a.followers||0) - (b.followers||0));
    if (sort === "rating_desc")    res = [...res].sort((a,b) => (b.engagementRate||0) - (a.engagementRate||0));
    if (sort === "rating_asc")     res = [...res].sort((a,b) => (a.engagementRate||0) - (b.engagementRate||0));
    if (sort === "newest")         res = [...res].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
    if (sort === "oldest")         res = [...res].sort((a,b) => new Date(a.createdAt)-new Date(b.createdAt));
    return res;
  }, [bloggers, search, sort, platFilter, followerRange, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage-1)*PER, safePage*PER);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:    bloggers.length,
    verified: bloggers.filter(b => b.isVerified && !b.isBlocked && !b.isFrozen).length,
    pending:  bloggers.filter(b => !b.isVerified && !b.isBlocked && !b.isFrozen).length,
    frozen:   bloggers.filter(b => b.isFrozen).length,
    blocked:  bloggers.filter(b => b.isBlocked).length,
  }), [bloggers]);

  /* ── Update single blogger in list (from modal) ── */
  const updateBlogger = useCallback((updated) => {
    setBloggers(p => p.map(b => b._id === updated._id ? { ...b, ...updated } : b));
    setDetail(updated);
  }, []);

  /* ── Quick row action (unblock / unfreeze) ── */
  const rowAction = useCallback(async (blogger, patch) => {
    setRowSaving(blogger._id);
    try {
      if (patch.isBlocked !== undefined) {
        await adminBloggersService.block(blogger._id, patch.isBlocked);
      } else if (patch.isFrozen !== undefined) {
        await adminBloggersService.freeze(blogger._id, patch.isFrozen);
      }
      const updated = { ...blogger, ...patch };
      setBloggers(p => p.map(b => b._id === blogger._id ? updated : b));
      if (patch.isBlocked === false) toast.success("Bloklash bekor qilindi");
      if (patch.isFrozen  === false) toast.success("Muzlatish bekor qilindi");
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setRowSaving(null); }
  }, []);

  /* ── Delete ── */
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await adminBloggersService.remove(deleteTarget._id);
      setBloggers(p => p.filter(b => b._id !== deleteTarget._id));
      toast.success("Blogger o'chirildi");
      setDeleteTarget(null);
    } catch { toast.error("O'chirishda xatolik"); }
    finally { setSaving(false); }
  }, [deleteTarget]);

  return (
    <div style={{ fontFamily:"'Manrope',sans-serif", padding:"28px 28px 60px", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        .ab-root *, .ab-root *::before, .ab-root *::after { box-sizing:border-box; }
        .ab-row { transition: background 0.12s; }
        .ab-row:hover { background: #f8faff !important; }
        .ab-root ::-webkit-scrollbar { width:4px; height:4px; }
        .ab-root ::-webkit-scrollbar-thumb { background:#dde1ea; border-radius:4px; }
        @keyframes ab-spin { to { transform:rotate(360deg); } }
        @keyframes ab-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <DetailModal blogger={detail} onClose={() => setDetail(null)} onUpdate={updateBlogger} />
      <DeleteModal blogger={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} saving={saving} />

      {/* ── Page header ── */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:900, color:"#0f172a", margin:0, letterSpacing:"-0.5px" }}>Bloggerlar</h1>
        <p style={{ fontSize:13, color:"#64748b", marginTop:4, fontWeight:500 }}>Jami {bloggers.length} ta blogger ro'yxatdan o'tgan</p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:24 }}>
        <StatCard icon={PiUsersThreeDuotone}          label="Jami"         value={stats.total}    accent="#6366f1" sub="barcha bloggerlar" />
        <StatCard icon={PiCheckCircleDuotone}         label="Tasdiqlangan" value={stats.verified}  accent="#10b981" sub="aktiv profillar" />
        <StatCard icon={PiChartLineUpDuotone}         label="Kutilmoqda"   value={stats.pending}   accent="#f59e0b" sub="tasdiqlanmagan" />
        <StatCard icon={PiSnowflakeDuotone}           label="Muzlatilgan"  value={stats.frozen}    accent="#2563eb" sub="vaqtincha to'xtatilgan" />
        <StatCard icon={PiProhibitDuotone}            label="Bloklangan"   value={stats.blocked}   accent="#ef4444" sub="cheklangan" />
      </div>

      {/* ── Frozen / Blocked alert banners ── */}
      {stats.frozen > 0 && (
        <div style={{ background:"#eff6ff", border:"1.5px solid #93c5fd", borderRadius:14, padding:"11px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
          <PiSnowflakeDuotone size={20} style={{ color:"#2563eb", flexShrink:0 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:"#1d4ed8", flex:1 }}>{stats.frozen} ta blogger hisob muzlatilgan</span>
        </div>
      )}
      {stats.blocked > 0 && (
        <div style={{ background:"#fff1f2", border:"1.5px solid #fca5a5", borderRadius:14, padding:"11px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
          <PiProhibitDuotone size={20} style={{ color:"#dc2626", flexShrink:0 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:"#991b1b", flex:1 }}>{stats.blocked} ta blogger hisob bloklangan</span>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div style={{ background:"#fff", borderRadius:18, padding:"14px 16px", border:"1.5px solid #e9ecf2", marginBottom:14, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        {/* Search */}
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <PiMagnifyingGlassDuotone size={15} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#cbd5e1", pointerEvents:"none" }}/>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Handle, ism, email bo'yicha qidirish…"
            style={{ width:"100%", padding:"9px 12px 9px 34px", border:"1.5px solid #e9ecf2", borderRadius:10, fontSize:12, color:"#0f172a", background:"#f8fafc", outline:"none", transition:"border-color 0.14s" }}
            onFocus={e => e.target.style.borderColor="#6366f1"}
            onBlur={e => e.target.style.borderColor="#e9ecf2"}
          />
        </div>

        {/* Status filter */}
        <div style={{ display:"flex", gap:3, background:"#f8fafc", borderRadius:10, padding:3, border:"1.5px solid #e9ecf2" }}>
          {[
            { v:"all",      label:"Barchasi",    dot:null,      cnt: stats.total    },
            { v:"verified", label:"Tasdiqlangan",dot:"#10b981", cnt: stats.verified },
            { v:"pending",  label:"Kutilmoqda",  dot:"#f59e0b", cnt: stats.pending  },
            { v:"frozen",   label:"Muzlatilgan", dot:"#2563eb", cnt: stats.frozen   },
            { v:"blocked",  label:"Bloklangan",  dot:"#ef4444", cnt: stats.blocked  },
          ].map(({ v, label, dot, cnt }) => {
            const active = statusFilter === v;
            return (
              <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
                style={{ padding:"5px 11px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", border:"none", fontFamily:"inherit",
                  background: active ? "#0f172a" : "transparent", color: active ? "#fff" : "#64748b",
                  display:"flex", alignItems:"center", gap:5, transition:"all 0.15s", whiteSpace:"nowrap",
                }}>
                {dot && <span style={{ width:6, height:6, borderRadius:"50%", background: active ? "#fff" : dot, flexShrink:0 }}/>}
                {label}
                <span style={{ fontSize:10, fontWeight:800, padding:"1px 5px", borderRadius:99,
                  background: active ? "rgba(255,255,255,0.2)" : "#e9ecf2",
                  color: active ? "#fff" : "#64748b",
                }}>{cnt}</span>
              </button>
            );
          })}
        </div>

        {/* Platform filter */}
        <div style={{ display:"flex", gap:4, background:"#f8fafc", borderRadius:10, padding:3, border:"1.5px solid #e9ecf2" }}>
          {[
            { v:"all",       label:"Barchasi" },
            { v:"instagram", label:"Instagram" },
            { v:"youtube",   label:"YouTube"   },
            { v:"telegram",  label:"Telegram"  },
            { v:"tiktok",    label:"TikTok"    },
          ].map(({ v, label }) => {
            const cfg = PLT[v];
            const active = platFilter === v;
            return (
              <button key={v} onClick={() => { setPlatFilter(v); setPage(1); }}
                style={{ padding:"5px 12px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", border:"none", fontFamily:"inherit",
                  background: active ? "#0f172a" : "transparent",
                  color: active ? "#fff" : "#64748b",
                  display:"flex", alignItems:"center", gap:5, transition:"all 0.15s",
                }}>
                {cfg && <cfg.Icon style={{ fontSize:11, color: active ? "#fff" : cfg.color }}/>}
                {label}
              </button>
            );
          })}
        </div>

        {/* Follower range */}
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          <PiUsersThreeDuotone size={14} style={{ position:"absolute", left:9, color:"#94a3b8", pointerEvents:"none" }}/>
          <select value={followerRange} onChange={e => { setFollowerRange(+e.target.value); setPage(1); }}
            style={{ padding:"9px 12px 9px 28px", borderRadius:10, fontSize:12, fontWeight:600, border:"1.5px solid #e9ecf2", background:"#f8fafc", color:"#0f172a", outline:"none", cursor:"pointer", appearance:"none" }}>
            {FOLLOWER_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          <PiCaretUpDownDuotone size={14} style={{ position:"absolute", left:9, color:"#94a3b8", pointerEvents:"none" }}/>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding:"9px 12px 9px 28px", borderRadius:10, fontSize:12, fontWeight:600, border:"1.5px solid #e9ecf2", background:"#f8fafc", color:"#0f172a", outline:"none", cursor:"pointer", appearance:"none" }}>
            <option value="followers_desc">Followers ↓</option>
            <option value="followers_asc"> Followers ↑</option>
            <option value="rating_desc">  Reyting ↓</option>
            <option value="rating_asc">   Reyting ↑</option>
            <option value="newest">       Yangi avval</option>
            <option value="oldest">       Eski avval</option>
          </select>
        </div>

        <button onClick={fetchBloggers} title="Yangilash"
          style={{ padding:"9px 11px", borderRadius:10, border:"1.5px solid #e9ecf2", background:"#f8fafc", color:"#64748b", cursor:"pointer", display:"flex", alignItems:"center" }}>
          <PiArrowsClockwiseDuotone size={16} style={{ animation: loading ? "ab-spin 0.8s linear infinite" : "none" }}/>
        </button>
      </div>

      {/* ── Results count ── */}
      {search || platFilter !== "all" || followerRange !== 0 ? (
        <div style={{ fontSize:12, color:"#64748b", fontWeight:600, marginBottom:10, paddingLeft:2 }}>
          {filtered.length} ta natija topildi
          {search && <> · "<strong>{search}</strong>"</>}
        </div>
      ) : null}

      {/* ── Table ── */}
      <div style={{ background:"#fff", borderRadius:18, border:"1.5px solid #e9ecf2", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:260, flexDirection:"column", gap:12 }}>
            <div style={{ width:34, height:34, border:"3px solid #e9ecf2", borderTopColor:"#6366f1", borderRadius:"50%", animation:"ab-spin 0.8s linear infinite" }}/>
            <span style={{ fontSize:13, color:"#94a3b8", fontWeight:600 }}>Yuklanmoqda…</span>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:800 }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {[
                    { l:"#",           w:48  },
                    { l:"Blogger",     w:"auto" },
                    { l:"Handle",      w:130 },
                    { l:"Followers",   w:100 },
                    { l:"Reyting",     w:90  },
                    { l:"Platformalar",w:140 },
                    { l:"Holat",       w:130 },
                    { l:"Amallar",     w:100 },
                  ].map((h, i) => (
                    <th key={i} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", borderBottom:"1.5px solid #f1f5f9", width:h.w, whiteSpace:"nowrap" }}>
                      {h.l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign:"center", padding:"56px", color:"#cbd5e1", fontSize:14, fontWeight:600 }}>
                    Blogger topilmadi
                  </td></tr>
                ) : pageData.map((b, idx) => {
                  const u = b.user;
                  const name = u ? `${u.firstName} ${u.lastName}`.trim() : "—";
                  const isRowSaving = rowSaving === b._id;

                  /* Row accent */
                  const rowBg = b.isBlocked
                    ? "#fff5f5"
                    : b.isFrozen
                    ? "#f0f7ff"
                    : "#fff";
                  const rowBorderLeft = b.isBlocked
                    ? "3px solid #fca5a5"
                    : b.isFrozen
                    ? "3px solid #93c5fd"
                    : "3px solid transparent";

                  return (
                    <tr key={b._id} className="ab-row" style={{ borderBottom:"1.5px solid #f8fafc", background: rowBg, borderLeft: rowBorderLeft }}>
                      {/* # */}
                      <td style={{ padding:"12px 14px", fontSize:12, fontWeight:700, color:"#94a3b8" }}>
                        {(safePage-1)*PER + idx + 1}
                      </td>

                      {/* Blogger */}
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                          <div style={{ position:"relative" }}>
                            <Ava user={u} size={38} />
                            {b.isBlocked && (
                              <div style={{ position:"absolute", bottom:-2, right:-2, width:14, height:14, borderRadius:"50%", background:"#dc2626", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <PiProhibitDuotone size={8} style={{ color:"#fff" }}/>
                              </div>
                            )}
                            {b.isFrozen && !b.isBlocked && (
                              <div style={{ position:"absolute", bottom:-2, right:-2, width:14, height:14, borderRadius:"50%", background:"#2563eb", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <PiSnowflakeDuotone size={8} style={{ color:"#fff" }}/>
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:13, color: b.isBlocked ? "#991b1b" : b.isFrozen ? "#1d4ed8" : "#0f172a", marginBottom:1 }}>{name}</div>
                            <div style={{ fontSize:11, color:"#94a3b8" }}>{u?.email || "—"}</div>
                          </div>
                        </div>
                      </td>

                      {/* Handle */}
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ fontSize:13, fontWeight:600, color:"#475569", background:"#f1f5f9", padding:"3px 9px", borderRadius:7 }}>
                          {b.handle ? `@${b.handle}` : "—"}
                        </span>
                      </td>

                      {/* Followers */}
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ fontWeight:800, fontSize:14, color:"#0f172a" }}>{b.followers ? fmtNum(b.followers) : "—"}</div>
                      </td>

                      {/* Rating */}
                      <td style={{ padding:"12px 14px" }}>
                        {b.engagementRate ? (
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <PiStarDuotone size={13} style={{ color:"#f59e0b" }}/>
                            <span style={{ fontWeight:700, fontSize:13, color:"#0f172a" }}>{b.engagementRate}%</span>
                          </div>
                        ) : <span style={{ color:"#cbd5e1", fontSize:12 }}>—</span>}
                      </td>

                      {/* Platforms */}
                      <td style={{ padding:"12px 14px" }}>
                        <PlatformIcons platforms={b.platforms} size={24} gap={5} />
                      </td>

                      {/* Status + quick unblock/unfreeze */}
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-start" }}>
                          <StatusPill blogger={b} />
                          {b.isBlocked && (
                            <button
                              onClick={() => rowAction(b, { isBlocked: false })}
                              disabled={isRowSaving}
                              style={{ padding:"3px 9px", borderRadius:7, border:"1.5px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:10, fontWeight:700, cursor:isRowSaving?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, opacity:isRowSaving?0.5:1, whiteSpace:"nowrap" }}>
                              <PiLockOpenDuotone size={10}/> Blokdan chiqarish
                            </button>
                          )}
                          {b.isFrozen && !b.isBlocked && (
                            <button
                              onClick={() => rowAction(b, { isFrozen: false })}
                              disabled={isRowSaving}
                              style={{ padding:"3px 9px", borderRadius:7, border:"1.5px solid #93c5fd", background:"#fff", color:"#2563eb", fontSize:10, fontWeight:700, cursor:isRowSaving?"not-allowed":"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, opacity:isRowSaving?0.5:1, whiteSpace:"nowrap" }}>
                              <PiLockOpenDuotone size={10}/> Muzlatishdan chiqarish
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <IconBtn onClick={() => setDetail(b)} title="Batafsil ko'rish" hoverBg="#6366f1" hoverColor="#4338ca">
                            <PiEyeDuotone size={15}/>
                          </IconBtn>
                          <IconBtn onClick={() => setDeleteTarget(b)} title="O'chirish" hoverBg="#ef4444" hoverColor="#991b1b">
                            <PiTrashDuotone size={15}/>
                          </IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderTop:"1.5px solid #f1f5f9", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>
            {filtered.length} ta natija · {safePage}/{totalPages} sahifa
          </span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <PgBtn disabled={safePage <= 1} onClick={() => setPage(p => p-1)}>‹</PgBtn>
            {Array.from({ length: totalPages }, (_, i) => i+1).map(p => {
              const show = totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p-safePage) <= 1;
              const dots  = Math.abs(p-safePage) === 2 && totalPages > 7;
              if (dots) return <span key={p} style={{ color:"#cbd5e1", fontSize:13, padding:"0 2px" }}>…</span>;
              if (!show) return null;
              return <PgBtn key={p} active={p === safePage} onClick={() => setPage(p)}>{p}</PgBtn>;
            })}
            <PgBtn disabled={safePage >= totalPages} onClick={() => setPage(p => p+1)}>›</PgBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
