import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../components/ui/toast";
import { adminUsersService } from "../../services/adminService";
import {
  PiMagnifyingGlassDuotone,
  PiArrowsClockwiseDuotone,
  PiTrashDuotone,
  PiCaretUpDownDuotone,
  PiUserCircleDuotone,
  PiEnvelopeDuotone,
  PiPhoneDuotone,
  PiCalendarDotsDuotone,
  PiCheckCircleDuotone,
  PiProhibitDuotone,
  PiLockSimpleDuotone,
  PiLockOpenDuotone,
  PiSnowflakeDuotone,
  PiWarningCircleDuotone,
  PiEyeDuotone,
  PiBriefcaseDuotone,
  PiHashDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

const PER = 10;
const AVA_COLORS = ["#f43f5e","#f97316","#10b981","#8b5cf6","#0ea5e9","#ec4899","#6366f1"];

/* ── helpers ── */
const ini = u => `${u?.firstName?.[0]||""}${u?.lastName?.[0]||""}`.toUpperCase() || "?";
const avaColor = u => AVA_COLORS[((u?.firstName||"?").charCodeAt(0)) % AVA_COLORS.length];
const fmtDate = d => d ? new Date(d).toLocaleDateString("uz-UZ", { year:"numeric", month:"short", day:"numeric" }) : "—";

/* ── Avatar ── */
function Ava({ user, size = 40 }) {
  const col = avaColor(user);
  if (user?.avatar) return (
    <img src={user.avatar} alt="" style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
  );
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:col+"22", border:`2px solid ${col}44`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.36, fontWeight:800, color:col,
    }}>{ini(user)}</div>
  );
}

/* ── Status Pill ── */
function StatusPill({ user }) {
  if (user.isBlocked) return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <PiProhibitDuotone size={11}/> Bloklangan
    </span>
  );
  if (user.isFrozen) return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#dbeafe", color:"#1e40af", border:"1px solid #93c5fd", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <PiSnowflakeDuotone size={11}/> Muzlatilgan
    </span>
  );
  if (user.isActive) return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#dcfce7", color:"#166534", border:"1px solid #86efac", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:"#16a34a" }}/> Faol
    </span>
  );
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fef9c3", color:"#854d0e", border:"1px solid #fde68a", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:"#ca8a04" }}/> Nofaol
    </span>
  );
}

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:"18px 20px", border:"1.5px solid #e9ecf2", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:46, height:46, borderRadius:14, background:accent+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={22} style={{ color:accent }} />
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:24, fontWeight:900, color:accent, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Icon button ── */
function IconBtn({ onClick, title, children, hoverBg, hoverColor, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width:32, height:32, borderRadius:9,
        border:`1.5px solid ${h&&!disabled ? hoverBg+"88":"#e9ecf2"}`,
        background: h&&!disabled ? hoverBg+"18":"#fff",
        color: h&&!disabled ? hoverColor:"#94a3b8",
        cursor:disabled?"not-allowed":"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.14s", flexShrink:0, opacity:disabled?0.4:1,
      }}
    >{children}</button>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ user, onClose, onConfirm, saving }) {
  if (!user) return null;
  const name = `${user.firstName||""} ${user.lastName||""}`.trim() || "Foydalanuvchi";
  return (
    <div onClick={e => { if(e.target===e.currentTarget) onClose(); }} style={{
      position:"fixed", inset:0, zIndex:9998, background:"rgba(15,23,42,0.6)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div style={{ background:"#fff", borderRadius:22, maxWidth:400, width:"100%", padding:28, boxShadow:"0 32px 80px rgba(0,0,0,0.22)" }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <PiWarningCircleDuotone size={28} style={{ color:"#ef4444" }}/>
        </div>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:17, fontWeight:800, color:"#0f172a", marginBottom:6 }}>Biznesmenni o'chirish</div>
          <div style={{ fontSize:13, color:"#64748b" }}>
            <strong style={{ color:"#0f172a" }}>{name}</strong> hisobini o'chirishni tasdiqlaysizmi?
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={onClose} style={{ padding:"11px", borderRadius:12, border:"1.5px solid #e2e8f0", background:"#f8fafc", color:"#64748b", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            Bekor qilish
          </button>
          <button onClick={onConfirm} disabled={saving} style={{ padding:"11px", borderRadius:12, border:"none", background:"#ef4444", color:"#fff", fontSize:13, fontWeight:700, cursor:saving?"not-allowed":"pointer", fontFamily:"inherit", opacity:saving?0.6:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <PiTrashDuotone size={15}/> {saving?"O'chirilmoqda…":"O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Modal ── */
function DetailModal({ user, onClose, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(user);

  useEffect(() => { setLocal(user); }, [user]);

  if (!local) return null;
  const name = `${local.firstName||""} ${local.lastName||""}`.trim() || "—";

  const push = patch => {
    const updated = { ...local, ...patch };
    setLocal(updated);
    onUpdate(updated);
  };

  const doAction = async (patch, successMsg) => {
    setSaving(true);
    try {
      await adminUsersService.update(local._id, patch);
      push(patch);
      toast.success(successMsg);
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setSaving(false); }
  };

  const rows = [
    { Icon: PiEnvelopeDuotone,    label:"Email",        val: local.email || "—" },
    { Icon: PiPhoneDuotone,        label:"Telefon",      val: local.phone || "—" },
    { Icon: PiCalendarDotsDuotone, label:"Ro'yxatdan",    val: fmtDate(local.createdAt) },
    { Icon: PiUserCircleDuotone,   label:"Rol",           val: "Biznesmen" },
    { Icon: PiCalendarDotsDuotone, label:"Oxirgi kirish", val: local.lastLoginAt ? fmtDate(local.lastLoginAt) : "Hali kirmagan" },
  ];

  return (
    <div onClick={e => { if(e.target===e.currentTarget) onClose(); }} style={{
      position:"fixed", inset:0, zIndex:9999, background:"rgba(15,23,42,0.65)",
      backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div style={{
        background:"#fff", borderRadius:24, width:"100%", maxWidth:520,
        maxHeight:"94vh", display:"flex", flexDirection:"column",
        boxShadow:"0 40px 100px rgba(0,0,0,0.28)", overflow:"hidden",
      }}>
        {/* status banners */}
        {local.isBlocked && (
          <div style={{ background:"#fee2e2", borderBottom:"1.5px solid #fca5a5", padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <PiProhibitDuotone size={16} style={{ color:"#dc2626" }}/>
              <span style={{ fontSize:13, fontWeight:700, color:"#991b1b" }}>Bu hisob bloklangan</span>
            </div>
            <button onClick={() => doAction({ isBlocked:false }, "Bloklash bekor qilindi")} disabled={saving}
              style={{ padding:"5px 14px", borderRadius:8, border:"1.5px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>
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
            <button onClick={() => doAction({ isFrozen:false }, "Muzlatish bekor qilindi")} disabled={saving}
              style={{ padding:"5px 14px", borderRadius:8, border:"1.5px solid #93c5fd", background:"#fff", color:"#2563eb", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5 }}>
              <PiLockOpenDuotone size={13}/> Muzlatishdan chiqarish
            </button>
          </div>
        )}

        {/* header */}
        <div style={{
          padding:"20px 24px 16px", borderBottom:"1.5px solid #f1f5f9",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background: local.isBlocked ? "linear-gradient(135deg,#fff5f5,#fee2e2)" : local.isFrozen ? "linear-gradient(135deg,#f0f9ff,#dbeafe)" : "linear-gradient(135deg,#fafbff,#f0f4ff)",
          flexShrink:0,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ position:"relative" }}>
              <Ava user={local} size={52} />
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
              <StatusPill user={local} />
            </div>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:11, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#94a3b8", fontFamily:"inherit", flexShrink:0 }}>✕</button>
        </div>

        {/* body */}
        <div style={{ overflowY:"auto", flex:1, padding:"20px 24px" }}>
          {/* info rows */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
            {rows.map(r => (
              <div key={r.label} style={{ background:"#f8fafc", border:"1.5px solid #f1f5f9", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"flex-start", gap:10 }}>
                <r.Icon size={16} style={{ color:"#f97316", flexShrink:0, marginTop:2 }}/>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{r.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", wordBreak:"break-word" }}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* actions */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Hisob boshqaruvi</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {/* Activate / Deactivate */}
              <button onClick={() => doAction({ isActive:!local.isActive }, local.isActive?"Hisob o'chirildi":"Hisob faollashtirildi")} disabled={saving} style={{
                padding:"10px 8px", borderRadius:12, cursor:"pointer", fontFamily:"inherit",
                border: local.isActive ? "1.5px solid #fde68a" : "1.5px solid #bbf7d0",
                background: local.isActive ? "#fffbeb" : "#f0fdf4",
                color: local.isActive ? "#92400e" : "#166534",
                fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:5, opacity:saving?0.6:1,
              }}>
                {local.isActive ? <><PiXCircleDuotone size={14}/> Faolsizlantirish</> : <><PiCheckCircleDuotone size={14}/> Faollashtirish</>}
              </button>

              {/* Freeze */}
              <button onClick={() => doAction({ isFrozen:!local.isFrozen }, local.isFrozen?"Muzlatish bekor qilindi":"Hisob muzlatildi")} disabled={saving} style={{
                padding:"10px 8px", borderRadius:12, cursor:"pointer", fontFamily:"inherit",
                border: local.isFrozen ? "1.5px solid #bae6fd" : "1.5px solid #e2e8f0",
                background: local.isFrozen ? "#f0f9ff" : "#f8fafc",
                color: local.isFrozen ? "#0369a1" : "#475569",
                fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:5, opacity:saving?0.6:1,
              }}>
                <PiSnowflakeDuotone size={14}/> {local.isFrozen ? "Muzlatishni bekor" : "Muzlatish"}
              </button>

              {/* Block */}
              <button onClick={() => doAction({ isBlocked:!local.isBlocked }, local.isBlocked?"Bloklash bekor qilindi":"Hisob bloklandi")} disabled={saving} style={{
                padding:"10px 8px", borderRadius:12, cursor:"pointer", fontFamily:"inherit",
                border:"1.5px solid #fca5a5",
                background:"#fff1f2",
                color: local.isBlocked ? "#991b1b" : "#be123c",
                fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:5, opacity:saving?0.6:1,
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

/* ── Pagination button ── */
function PgBtn({ children, onClick, disabled, active }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ minWidth:32, height:32, padding:"0 8px", borderRadius:9,
        border:`1.5px solid ${active?"#fed7aa":h?"#e2e8f0":"#f1f5f9"}`,
        background:active?"#fff7ed":h?"#f8fafc":"#fff",
        fontSize:12, fontWeight:active?800:500,
        cursor:disabled?"not-allowed":"pointer",
        color:active?"#c2410c":"#64748b",
        opacity:disabled?0.4:1, transition:"all 0.14s", fontFamily:"inherit",
      }}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminBusinessmen() {
  const queryClient = useQueryClient();
  const [saving,      setSaving]      = useState(false);
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [sort,        setSort]        = useState("newest");
  const [statusFilter,setStatusFilter]= useState("all");
  const [detail,      setDetail]      = useState(null);
  const [deleteTarget,setDeleteTarget]= useState(null);
  const [rowSaving,   setRowSaving]   = useState(null);

  const { data, isLoading: loading, refetch } = useQuery({
    queryKey: ["admin-businessmen"],
    queryFn: () => adminUsersService.getAll({ role: "business", limit: 9999 }),
    staleTime: 5 * 60 * 1000,
  });

  const users = data?.data || [];

  /* ── Filter & sort ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let res = users.filter(u => {
      const fullName = `${u.firstName||""} ${u.lastName||""}`.toLowerCase();
      const matchQ = !q ||
        fullName.includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q);

      const matchStatus =
        statusFilter === "all"      ? true :
        statusFilter === "active"   ? (u.isActive && !u.isBlocked && !u.isFrozen) :
        statusFilter === "inactive" ? (!u.isActive && !u.isBlocked && !u.isFrozen) :
        statusFilter === "frozen"   ? u.isFrozen :
        statusFilter === "blocked"  ? u.isBlocked : true;

      return matchQ && matchStatus;
    });

    if (sort === "newest") res = [...res].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
    if (sort === "oldest") res = [...res].sort((a,b) => new Date(a.createdAt)-new Date(b.createdAt));
    if (sort === "name")   res = [...res].sort((a,b) => (a.firstName||"").localeCompare(b.firstName||""));
    return res;
  }, [users, search, sort, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage-1)*PER, safePage*PER);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:    users.length,
    active:   users.filter(u => u.isActive && !u.isBlocked && !u.isFrozen).length,
    inactive: users.filter(u => !u.isActive && !u.isBlocked && !u.isFrozen).length,
    frozen:   users.filter(u => u.isFrozen).length,
    blocked:  users.filter(u => u.isBlocked).length,
  }), [users]);

  /* ── Update user in list ── */
  const updateUser = useCallback(updated => {
    queryClient.invalidateQueries({ queryKey: ["admin-businessmen"] });
    setDetail(updated);
  }, [queryClient]);

  /* ── Quick row action ── */
  const rowAction = useCallback(async (user, patch, msg) => {
    setRowSaving(user._id);
    try {
      await adminUsersService.update(user._id, patch);
      queryClient.invalidateQueries({ queryKey: ["admin-businessmen"] });
      toast.success(msg);
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setRowSaving(null); }
  }, [queryClient]);

  /* ── Delete ── */
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await adminUsersService.remove(deleteTarget._id);
      queryClient.invalidateQueries({ queryKey: ["admin-businessmen"] });
      toast.success("Hisob o'chirildi");
      setDeleteTarget(null);
    } catch { toast.error("O'chirishda xatolik"); }
    finally { setSaving(false); }
  }, [deleteTarget, queryClient]);

  return (
    <div style={{ fontFamily:"'Manrope',sans-serif", padding:"28px 28px 60px", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        .bm-row { transition:background 0.12s; }
        .bm-row:hover { background:#fff8f4 !important; }
        @keyframes bm-spin { to { transform:rotate(360deg); } }
      `}</style>

      <DetailModal user={detail} onClose={() => setDetail(null)} onUpdate={updateUser} />
      <DeleteModal user={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} saving={saving} />

      {/* header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <div style={{ width:38, height:38, borderRadius:12, background:"linear-gradient(135deg,#f97316,#ea580c)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <PiBriefcaseDuotone size={20} style={{ color:"#fff" }}/>
          </div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#0f172a", margin:0, letterSpacing:"-0.5px" }}>Biznesmenlar</h1>
        </div>
        <p style={{ fontSize:13, color:"#64748b", marginTop:0, fontWeight:500, marginLeft:48 }}>
          Jami {users.length} ta biznesmen ro'yxatdan o'tgan
        </p>
      </div>

      {/* stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:24 }}>
        <StatCard icon={PiBriefcaseDuotone}   label="Jami"          value={stats.total}    accent="#f97316" sub="barcha biznesmenlar" />
        <StatCard icon={PiCheckCircleDuotone}  label="Faol"          value={stats.active}   accent="#10b981" sub="aktiv hisoblar" />
        <StatCard icon={PiXCircleDuotone}      label="Nofaol"        value={stats.inactive} accent="#94a3b8" sub="faolsizlantirilgan" />
        <StatCard icon={PiSnowflakeDuotone}    label="Muzlatilgan"   value={stats.frozen}   accent="#2563eb" sub="vaqtincha to'xtatilgan" />
        <StatCard icon={PiProhibitDuotone}     label="Bloklangan"    value={stats.blocked}  accent="#ef4444" sub="cheklangan" />
      </div>

      {/* alert banners */}
      {stats.frozen > 0 && (
        <div style={{ background:"#eff6ff", border:"1.5px solid #93c5fd", borderRadius:14, padding:"11px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
          <PiSnowflakeDuotone size={20} style={{ color:"#2563eb", flexShrink:0 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:"#1d4ed8" }}>{stats.frozen} ta biznesmen hisob muzlatilgan</span>
        </div>
      )}
      {stats.blocked > 0 && (
        <div style={{ background:"#fff1f2", border:"1.5px solid #fca5a5", borderRadius:14, padding:"11px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
          <PiProhibitDuotone size={20} style={{ color:"#dc2626", flexShrink:0 }}/>
          <span style={{ fontSize:13, fontWeight:700, color:"#991b1b" }}>{stats.blocked} ta biznesmen hisob bloklangan</span>
        </div>
      )}

      {/* toolbar */}
      <div style={{ background:"#fff", borderRadius:18, padding:"14px 16px", border:"1.5px solid #e9ecf2", marginBottom:14, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        {/* search */}
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <PiMagnifyingGlassDuotone size={15} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#cbd5e1", pointerEvents:"none" }}/>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ism, email, telefon bo'yicha qidirish…"
            style={{ width:"100%", padding:"9px 12px 9px 34px", border:"1.5px solid #e9ecf2", borderRadius:10, fontSize:12, color:"#0f172a", background:"#f8fafc", outline:"none" }}
            onFocus={e => e.target.style.borderColor="#f97316"}
            onBlur={e => e.target.style.borderColor="#e9ecf2"}
          />
        </div>

        {/* status tabs */}
        <div style={{ display:"flex", gap:3, background:"#f8fafc", borderRadius:10, padding:3, border:"1.5px solid #e9ecf2" }}>
          {[
            { v:"all",      label:"Barchasi",    dot:null,      cnt:stats.total    },
            { v:"active",   label:"Faol",         dot:"#10b981", cnt:stats.active   },
            { v:"inactive", label:"Nofaol",       dot:"#94a3b8", cnt:stats.inactive },
            { v:"frozen",   label:"Muzlatilgan",  dot:"#2563eb", cnt:stats.frozen   },
            { v:"blocked",  label:"Bloklangan",   dot:"#ef4444", cnt:stats.blocked  },
          ].map(({ v, label, dot, cnt }) => {
            const active = statusFilter === v;
            return (
              <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
                style={{ padding:"5px 11px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", border:"none", fontFamily:"inherit",
                  background:active?"#0f172a":"transparent", color:active?"#fff":"#64748b",
                  display:"flex", alignItems:"center", gap:5, transition:"all 0.15s", whiteSpace:"nowrap",
                }}>
                {dot && <span style={{ width:6, height:6, borderRadius:"50%", background:active?"#fff":dot, flexShrink:0 }}/>}
                {label}
                <span style={{ fontSize:10, fontWeight:800, padding:"1px 5px", borderRadius:99,
                  background:active?"rgba(255,255,255,0.2)":"#e9ecf2",
                  color:active?"#fff":"#64748b",
                }}>{cnt}</span>
              </button>
            );
          })}
        </div>

        {/* sort */}
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          <PiCaretUpDownDuotone size={14} style={{ position:"absolute", left:9, color:"#94a3b8", pointerEvents:"none" }}/>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding:"9px 12px 9px 28px", borderRadius:10, fontSize:12, fontWeight:600, border:"1.5px solid #e9ecf2", background:"#f8fafc", color:"#0f172a", outline:"none", cursor:"pointer", appearance:"none" }}>
            <option value="newest">Yangi avval</option>
            <option value="oldest">Eski avval</option>
            <option value="name">Ism bo'yicha</option>
          </select>
        </div>

        <button onClick={refetch} title="Yangilash"
          style={{ padding:"9px 11px", borderRadius:10, border:"1.5px solid #e9ecf2", background:"#f8fafc", color:"#64748b", cursor:"pointer", display:"flex", alignItems:"center" }}>
          <PiArrowsClockwiseDuotone size={16} style={{ animation:loading?"bm-spin 0.8s linear infinite":"none" }}/>
        </button>
      </div>

      {/* table */}
      <div style={{ background:"#fff", borderRadius:18, border:"1.5px solid #e9ecf2", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:260, flexDirection:"column", gap:12 }}>
            <div style={{ width:34, height:34, border:"3px solid #e9ecf2", borderTopColor:"#f97316", borderRadius:"50%", animation:"bm-spin 0.8s linear infinite" }}/>
            <span style={{ fontSize:13, color:"#94a3b8", fontWeight:600 }}>Yuklanmoqda…</span>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:760 }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {[
                    { l:"#",             w:48   },
                    { l:"Biznesmen",     w:"auto" },
                    { l:"Email",         w:180  },
                    { l:"Telefon",       w:130  },
                    { l:"Sana",          w:110  },
                    { l:"Oxirgi kirish", w:130  },
                    { l:"Holat",         w:150  },
                    { l:"Amallar",       w:110  },
                  ].map((h, i) => (
                    <th key={i} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", borderBottom:"1.5px solid #f1f5f9", width:h.w, whiteSpace:"nowrap" }}>
                      {h.l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign:"center", padding:"56px", color:"#cbd5e1", fontSize:14, fontWeight:600 }}>
                    Biznesmen topilmadi
                  </td></tr>
                ) : pageData.map((u, idx) => {
                  const name = `${u.firstName||""} ${u.lastName||""}`.trim() || "—";
                  const isRS = rowSaving === u._id;
                  const rowBg = u.isBlocked ? "#fff5f5" : u.isFrozen ? "#f0f7ff" : "#fff";
                  const rowBL = u.isBlocked ? "3px solid #fca5a5" : u.isFrozen ? "3px solid #93c5fd" : "3px solid transparent";

                  return (
                    <tr key={u._id} className="bm-row" style={{ borderBottom:"1.5px solid #f8fafc", background:rowBg, borderLeft:rowBL }}>
                      {/* # */}
                      <td style={{ padding:"12px 14px", fontSize:12, fontWeight:700, color:"#94a3b8" }}>
                        {(safePage-1)*PER + idx + 1}
                      </td>

                      {/* name */}
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                          <div style={{ position:"relative" }}>
                            <Ava user={u} size={38} />
                            {u.isBlocked && (
                              <div style={{ position:"absolute", bottom:-2, right:-2, width:14, height:14, borderRadius:"50%", background:"#dc2626", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <PiProhibitDuotone size={8} style={{ color:"#fff" }}/>
                              </div>
                            )}
                            {u.isFrozen && !u.isBlocked && (
                              <div style={{ position:"absolute", bottom:-2, right:-2, width:14, height:14, borderRadius:"50%", background:"#2563eb", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <PiSnowflakeDuotone size={8} style={{ color:"#fff" }}/>
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:13, color: u.isBlocked?"#991b1b":u.isFrozen?"#1d4ed8":"#0f172a", marginBottom:1 }}>{name}</div>
                            <div style={{ display:"inline-flex", alignItems:"center", gap:3, background:"#fff7ed", border:"1px solid #fed7aa", padding:"1px 7px", borderRadius:5, fontSize:10, fontWeight:700, color:"#c2410c" }}>
                              <PiBriefcaseDuotone size={9}/> Biznesmen
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* email */}
                      <td style={{ padding:"12px 14px", fontSize:12, color:"#475569" }}>
                        {u.email || "—"}
                      </td>

                      {/* phone */}
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ fontSize:12, fontWeight:600, color:"#475569", background:"#f1f5f9", padding:"3px 9px", borderRadius:7 }}>
                          {u.phone || "—"}
                        </span>
                      </td>

                      {/* date */}
                      <td style={{ padding:"12px 14px", fontSize:12, color:"#94a3b8" }}>
                        {fmtDate(u.createdAt)}
                      </td>

                      {/* last login */}
                      <td style={{ padding:"12px 14px" }}>
                        {u.lastLoginAt ? (
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{fmtDate(u.lastLoginAt)}</div>
                            <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>
                              {new Date(u.lastLoginAt).toLocaleTimeString("uz-UZ", { hour:"2-digit", minute:"2-digit" })}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize:11, color:"#d1d5db", fontStyle:"italic" }}>Hali kirmagan</span>
                        )}
                      </td>

                      {/* status + quick actions */}
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-start" }}>
                          <StatusPill user={u} />
                          {u.isBlocked && (
                            <button onClick={() => rowAction(u, { isBlocked:false }, "Bloklash bekor qilindi")} disabled={isRS}
                              style={{ padding:"3px 9px", borderRadius:7, border:"1.5px solid #fca5a5", background:"#fff", color:"#dc2626", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
                              <PiLockOpenDuotone size={10}/> Blokdan chiqarish
                            </button>
                          )}
                          {u.isFrozen && !u.isBlocked && (
                            <button onClick={() => rowAction(u, { isFrozen:false }, "Muzlatish bekor qilindi")} disabled={isRS}
                              style={{ padding:"3px 9px", borderRadius:7, border:"1.5px solid #93c5fd", background:"#fff", color:"#2563eb", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
                              <PiLockOpenDuotone size={10}/> Muzlatishdan chiqarish
                            </button>
                          )}
                        </div>
                      </td>

                      {/* actions */}
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <IconBtn onClick={() => setDetail(u)} title="Batafsil" hoverBg="#f97316" hoverColor="#c2410c">
                            <PiEyeDuotone size={15}/>
                          </IconBtn>
                          <IconBtn onClick={() => u.isBlocked
                              ? rowAction(u, { isBlocked:false }, "Bloklash bekor qilindi")
                              : rowAction(u, { isBlocked:true  }, "Hisob bloklandi")
                            } title={u.isBlocked?"Blokdan chiqarish":"Bloklash"} hoverBg="#ef4444" hoverColor="#991b1b" disabled={isRS}>
                            {u.isBlocked ? <PiLockOpenDuotone size={15}/> : <PiLockSimpleDuotone size={15}/>}
                          </IconBtn>
                          <IconBtn onClick={() => u.isFrozen
                              ? rowAction(u, { isFrozen:false }, "Muzlatish bekor qilindi")
                              : rowAction(u, { isFrozen:true  }, "Hisob muzlatildi")
                            } title={u.isFrozen?"Muzlatishdan chiqarish":"Muzlatish"} hoverBg="#2563eb" hoverColor="#1d4ed8" disabled={isRS}>
                            {u.isFrozen ? <PiLockOpenDuotone size={15}/> : <PiSnowflakeDuotone size={15}/>}
                          </IconBtn>
                          <IconBtn onClick={() => setDeleteTarget(u)} title="O'chirish" hoverBg="#ef4444" hoverColor="#991b1b">
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

        {/* pagination */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderTop:"1.5px solid #f1f5f9", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>
            {filtered.length} ta natija · {safePage}/{totalPages} sahifa
          </span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <PgBtn disabled={safePage<=1} onClick={() => setPage(p=>p-1)}>‹</PgBtn>
            {Array.from({ length:totalPages }, (_,i) => i+1).map(p => {
              const show = totalPages<=7 || p===1 || p===totalPages || Math.abs(p-safePage)<=1;
              const dots  = Math.abs(p-safePage)===2 && totalPages>7;
              if (dots) return <span key={p} style={{ color:"#cbd5e1", fontSize:13, padding:"0 2px" }}>…</span>;
              if (!show) return null;
              return <PgBtn key={p} active={p===safePage} onClick={() => setPage(p)}>{p}</PgBtn>;
            })}
            <PgBtn disabled={safePage>=totalPages} onClick={() => setPage(p=>p+1)}>›</PgBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
