import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "../../components/ui/toast";
import {
  LuUser, LuShield, LuChartBar, LuCamera, LuSave, LuX,
  LuEye, LuEyeOff, LuCheck, LuPencil, LuPhone, LuMail,
  LuCalendar, LuUsers, LuFileText, LuMegaphone, LuActivity,
  LuTrendingUp, LuLoader,
} from "react-icons/lu";

const LuBarChart2 = LuChartBar;

/* ══════════════════════════════════════════
   UI PRIMITIVES
══════════════════════════════════════════ */
const C = {
  accent:    "#ef4444",
  accentBg:  "rgba(239,68,68,0.08)",
  accentBdr: "rgba(239,68,68,0.25)",
  border:    "#e8ecf4",
  bg:        "#f4f6fb",
  card:      "#ffffff",
  text:      "#0f172a",
  muted:     "#64748b",
  light:     "#94a3b8",
};

const Card = ({ children, style }) => (
  <div style={{
    background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)", padding: "24px",
    marginBottom: 16, ...style,
  }}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10, background: C.accentBg,
      border: `1px solid ${C.accentBdr}`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={17} color={C.accent} />
    </div>
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{subtitle}</div>}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ value, onChange, type = "text", placeholder, disabled, right }) => (
  <div style={{ position: "relative" }}>
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} disabled={disabled}
      style={{
        width: "100%", padding: right ? "9px 44px 9px 12px" : "9px 12px",
        border: `1.5px solid ${C.border}`, borderRadius: 10,
        fontSize: 13.5, color: C.text, background: disabled ? "#f8fafc" : "#fff",
        outline: "none", fontFamily: "inherit", boxSizing: "border-box",
        opacity: disabled ? 0.65 : 1, transition: "border-color .2s",
      }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = C.accent; }}
      onBlur={e => { e.target.style.borderColor = C.border; }}
    />
    {right && (
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
        {right}
      </div>
    )}
  </div>
);


const Btn = ({ children, onClick, variant = "primary", loading, disabled, style }) => {
  const base = {
    display: "flex", alignItems: "center", gap: 7,
    padding: "9px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 600,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    border: "none", fontFamily: "inherit", transition: "all .2s",
    opacity: disabled || loading ? 0.65 : 1,
  };
  const variants = {
    primary: { background: C.accent, color: "#fff", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" },
    outline: { background: "#fff", color: C.muted, border: `1.5px solid ${C.border}` },
    ghost:   { background: C.accentBg, color: C.accent, border: `1px solid ${C.accentBdr}` },
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{ ...base, ...variants[variant], ...style }}>
      {loading && <LuLoader size={14} style={{ animation: "spin 1s linear infinite" }} />}
      {children}
    </button>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color = C.accent }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>{value ?? "—"}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}
function getInitials(u) {
  if (!u) return "AD";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "AD";
}

/* ══════════════════════════════════════════
   TABS
══════════════════════════════════════════ */
const TABS = [
  { id: "profile",  label: "Profil",      Icon: LuUser      },
  { id: "security", label: "Xavfsizlik",  Icon: LuShield    },
  { id: "system",   label: "Tizim",       Icon: LuBarChart2 },
];

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function AdminSettings() {
  const [tab, setTab]         = useState("profile");
  const { user: storeUser, setUser } = useAuthStore();

  /* ── Profile state ── */
  const [profile, setProfile]   = useState({ firstName: "", lastName: "", phone: "" });
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileRef = useRef(null);

  /* ── Password state ── */
  const [pwd, setPwd]       = useState({ current: "", next: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [strength, setStrength]   = useState(0);

  /* ── System stats ── */
  const [stats, setStats]     = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  /* ── Load me ── */
  useEffect(() => {
    if (storeUser) {
      setProfile({
        firstName: storeUser.firstName || "",
        lastName:  storeUser.lastName  || "",
        phone:     storeUser.phone     || "",
      });
    } else {
      api.get("/auth/me").then(r => {
        const u = r.data.data;
        setUser(u);
        setProfile({ firstName: u.firstName || "", lastName: u.lastName || "", phone: u.phone || "" });
      });
    }
  }, []);

  /* ── Load stats when system tab ── */
  useEffect(() => {
    if (tab === "system" && !stats) {
      setStatsLoading(true);
      api.get("/admin/dashboard")
        .then(r => setStats(r.data.data?.stats || r.data.stats || null))
        .catch(() => setStats(null))
        .finally(() => setStatsLoading(false));
    }
  }, [tab]);

  /* ── Password strength ── */
  const checkStrength = (v) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setStrength(s);
    setPwd(p => ({ ...p, next: v }));
  };

  /* ── Save profile ── */
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
      toast.success("Profil muvaffaqiyatli saqlandi");
      setEditing(false);
    } catch {/* api.js shows toast */}
    setSaving(false);
  };

  /* ── Avatar upload ── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Fayl 2MB dan katta bo'lmasin"); return; }
    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const base64 = ev.target.result;
        const res = await api.patch("/profile/avatar", { avatar: base64 });
        const updated = res.data.data || res.data.user;
        if (updated) setUser({ ...storeUser, ...updated });
        toast.success("Avatar yangilandi");
      } catch {/* api.js shows toast */}
      setAvatarLoading(false);
    };
    reader.readAsDataURL(file);
  };

  /* ── Change password ── */
  const changePassword = async () => {
    if (!pwd.current)             { toast.error("Joriy parolni kiriting"); return; }
    if (pwd.next.length < 8)      { toast.error("Yangi parol kamida 8 ta belgi bo'lishi kerak"); return; }
    if (pwd.next !== pwd.confirm) { toast.error("Parollar mos kelmadi"); return; }
    setPwdSaving(true);
    try {
      await api.patch("/auth/update-password", {
        currentPassword: pwd.current,
        newPassword:     pwd.next,
      });
      toast.success("Parol muvaffaqiyatli o'zgartirildi");
      setPwd({ current: "", next: "", confirm: "" });
      setStrength(0);
    } catch {/* api.js shows toast */}
    setPwdSaving(false);
  };

  const strColors = ["#e5e7eb", "#ef4444", "#f59e0b", "#22c55e", "#10b981"];
  const strLabels = ["", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"];

  const cancelEdit = () => {
    setProfile({
      firstName: storeUser?.firstName || "",
      lastName:  storeUser?.lastName  || "",
      phone:     storeUser?.phone     || "",
    });
    setEditing(false);
  };

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", fontFamily: "inherit", maxWidth: 960, margin: "0 auto" }}>

      {/* ── Left nav ── */}
      <aside style={{
        width: 200, flexShrink: 0, background: C.card,
        borderRadius: 16, border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        padding: "12px 8px", position: "sticky", top: 24,
      }}>
        {/* Admin card */}
        <div style={{ padding: "12px", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: storeUser?.avatar ? `url(${storeUser.avatar}) center/cover` : `linear-gradient(135deg,#ef4444,#b91c1c)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#fff",
            }}>
              {!storeUser?.avatar && getInitials(storeUser)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {storeUser ? `${storeUser.firstName || ""} ${storeUser.lastName || ""}`.trim() || "Admin" : "Admin"}
              </div>
              <div style={{ fontSize: 10.5, color: C.light }}>Administrator</div>
            </div>
          </div>
        </div>

        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 9, width: "100%",
            padding: "9px 12px", borderRadius: 10, border: "none",
            background: tab === t.id ? C.accentBg : "transparent",
            color: tab === t.id ? C.accent : C.muted,
            fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            transition: "all .15s",
          }}>
            <t.Icon size={15} />
            {t.label}
            {tab === t.id && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.accent }} />}
          </button>
        ))}

        <div style={{ padding: "10px 12px 4px", marginTop: 8, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.light, textTransform: "uppercase", letterSpacing: 1 }}>
            Hisob ma'lumoti
          </div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { label: "Email", val: storeUser?.email },
              { label: "Rol",   val: storeUser?.role === "admin" ? "Administrator" : storeUser?.role },
              { label: "Qo'shilgan", val: fmtDate(storeUser?.createdAt) },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: C.light }}>{label}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, wordBreak: "break-all" }}>{val || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Content ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* ════════════════ PROFILE TAB ════════════════ */}
        {tab === "profile" && (
          <>
            {/* Avatar card */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: 20,
                    background: storeUser?.avatar ? `url(${storeUser.avatar}) center/cover` : `linear-gradient(135deg,#ef4444,#b91c1c)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 800, color: "#fff",
                    border: "3px solid #fff", boxShadow: "0 4px 16px rgba(239,68,68,.25)",
                  }}>
                    {!storeUser?.avatar && getInitials(storeUser)}
                    {avatarLoading && (
                      <div style={{
                        position: "absolute", inset: 0, borderRadius: 20,
                        background: "rgba(0,0,0,0.45)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <LuLoader size={20} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={avatarLoading}
                    style={{
                      position: "absolute", bottom: -4, right: -4,
                      width: 28, height: 28, borderRadius: "50%",
                      background: C.accent, border: "2px solid #fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <LuCamera size={12} color="#fff" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
                    {storeUser ? `${storeUser.firstName || ""} ${storeUser.lastName || ""}`.trim() || "Admin" : "Admin"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                    <LuMail size={13} color={C.light} />
                    <span style={{ fontSize: 13, color: C.muted }}>{storeUser?.email || "—"}</span>
                  </div>
                  {storeUser?.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <LuPhone size={13} color={C.light} />
                      <span style={{ fontSize: 13, color: C.muted }}>{storeUser.phone}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <LuCalendar size={13} color={C.light} />
                    <span style={{ fontSize: 13, color: C.muted }}>Qo'shilgan: {fmtDate(storeUser?.createdAt)}</span>
                  </div>
                </div>

                {/* Edit actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  {!editing ? (
                    <Btn variant="ghost" onClick={() => setEditing(true)}>
                      <LuPencil size={14} /> Tahrirlash
                    </Btn>
                  ) : (
                    <>
                      <Btn variant="outline" onClick={cancelEdit} disabled={saving}>
                        <LuX size={14} /> Bekor
                      </Btn>
                      <Btn onClick={saveProfile} loading={saving}>
                        <LuSave size={14} /> Saqlash
                      </Btn>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Profile fields */}
            <Card>
              <SectionTitle icon={LuUser} title="Shaxsiy ma'lumotlar" subtitle="Profil ma'lumotlarini yangilang" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <Field label="Ism">
                  <Input
                    value={profile.firstName}
                    onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="Ismingiz"
                    disabled={!editing}
                  />
                </Field>
                <Field label="Familiya">
                  <Input
                    value={profile.lastName}
                    onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Familiyangiz"
                    disabled={!editing}
                  />
                </Field>
                <Field label="Telefon">
                  <Input
                    value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+998 90 123 45 67"
                    disabled={!editing}
                  />
                </Field>
                <Field label="Email (o'zgartirib bo'lmaydi)">
                  <Input value={storeUser?.email || ""} disabled />
                </Field>
              </div>

              {/* Readonly fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginTop: 4 }}>
                <Field label="Rol">
                  <div style={{
                    padding: "9px 12px", borderRadius: 10,
                    border: `1.5px solid ${C.border}`, background: "#f8fafc",
                    fontSize: 13.5, color: C.muted, display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                    Administrator
                  </div>
                </Field>
                <Field label="Hisob holati">
                  <div style={{
                    padding: "9px 12px", borderRadius: 10,
                    border: `1.5px solid #bbf7d0`, background: "#f0fdf4",
                    fontSize: 13.5, color: "#15803d", display: "flex", alignItems: "center", gap: 8,
                    fontWeight: 600,
                  }}>
                    <LuCheck size={14} /> Faol hisob
                  </div>
                </Field>
              </div>

              {editing && (
                <div style={{ display: "flex", gap: 10, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <Btn onClick={saveProfile} loading={saving}>
                    <LuSave size={14} /> O'zgarishlarni saqlash
                  </Btn>
                  <Btn variant="outline" onClick={cancelEdit} disabled={saving}>
                    Bekor qilish
                  </Btn>
                </div>
              )}
            </Card>
          </>
        )}

        {/* ════════════════ SECURITY TAB ════════════════ */}
        {tab === "security" && (
          <>
            <Card>
              <SectionTitle icon={LuShield} title="Parolni o'zgartirish" subtitle="Xavfsizlik uchun vaqti-vaqti bilan parolni yangilang" />

              <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
                {/* Current password */}
                <Field label="Joriy parol">
                  <Input
                    type={showPwd.current ? "text" : "password"}
                    value={pwd.current}
                    onChange={e => setPwd(p => ({ ...p, current: e.target.value }))}
                    placeholder="Joriy parolingizni kiriting"
                    right={
                      <button
                        onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.light, display: "flex" }}
                      >
                        {showPwd.current ? <LuEyeOff size={15} /> : <LuEye size={15} />}
                      </button>
                    }
                  />
                </Field>

                {/* New password */}
                <Field label="Yangi parol">
                  <Input
                    type={showPwd.next ? "text" : "password"}
                    value={pwd.next}
                    onChange={e => checkStrength(e.target.value)}
                    placeholder="Yangi parol (kamida 8 belgi)"
                    right={
                      <button
                        onClick={() => setShowPwd(p => ({ ...p, next: !p.next }))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.light, display: "flex" }}
                      >
                        {showPwd.next ? <LuEyeOff size={15} /> : <LuEye size={15} />}
                      </button>
                    }
                  />
                  {/* Strength bar */}
                  {pwd.next && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 4, borderRadius: 2,
                            background: i <= strength ? strColors[strength] : C.border,
                            transition: "background .25s",
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 11.5, color: strColors[strength], marginTop: 5, fontWeight: 600 }}>
                        {strLabels[strength]}
                        {strength > 0 && (
                          <span style={{ color: C.light, fontWeight: 400, marginLeft: 8 }}>
                            {strength < 3 ? "· Katta harf, raqam va belgi qo'shing" : "· Parol yetarli darajada kuchli"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Field>

                {/* Confirm */}
                <Field label="Parolni tasdiqlang">
                  <Input
                    type={showPwd.confirm ? "text" : "password"}
                    value={pwd.confirm}
                    onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="Yangi parolni qaytaring"
                    right={
                      <button
                        onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.light, display: "flex" }}
                      >
                        {showPwd.confirm ? <LuEyeOff size={15} /> : <LuEye size={15} />}
                      </button>
                    }
                  />
                  {pwd.confirm && pwd.next !== pwd.confirm && (
                    <div style={{ fontSize: 12, color: "#ef4444", marginTop: 5 }}>Parollar mos kelmadi</div>
                  )}
                  {pwd.confirm && pwd.next === pwd.confirm && pwd.confirm.length > 0 && (
                    <div style={{ fontSize: 12, color: "#22c55e", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                      <LuCheck size={12} /> Parollar mos keldi
                    </div>
                  )}
                </Field>

                <div>
                  <Btn
                    onClick={changePassword}
                    loading={pwdSaving}
                    disabled={!pwd.current || !pwd.next || !pwd.confirm}
                  >
                    <LuShield size={14} /> Parolni o'zgartirish
                  </Btn>
                </div>
              </div>
            </Card>

            {/* Tips card */}
            <Card style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", border: "none" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <LuShield size={15} color="#ef4444" /> Parol xavfsizligi maslahatlar
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  "Kamida 8 ta belgi ishlating",
                  "Katta va kichik harflar qo'shing",
                  "Raqamlar va maxsus belgilar (+, #, !)",
                  "Shaxsiy ma'lumotlardan foydalanmang",
                  "Har xil platformada boshqa parol ishlating",
                  "Parol menejeridan foydalaning",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <LuCheck size={9} color="#ef4444" />
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* ════════════════ SYSTEM TAB ════════════════ */}
        {tab === "system" && (
          <>
            {statsLoading ? (
              <Card style={{ textAlign: "center", padding: 48 }}>
                <LuLoader size={28} color={C.accent} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                <div style={{ color: C.muted, fontSize: 14 }}>Statistika yuklanmoqda...</div>
              </Card>
            ) : stats ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>Tizim statistikasi</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>Real vaqt ma'lumotlari</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 16 }}>
                  <StatCard icon={LuUsers}    label="Jami foydalanuvchilar" value={stats.totalUsers}    color="#2563eb" />
                  <StatCard icon={LuActivity} label="Blogerlar"             value={stats.totalBloggers}  color="#7c3aed" />
                  <StatCard icon={LuMegaphone} label="E'lonlar"             value={stats.totalAds}       color="#d97706" />
                  <StatCard icon={LuFileText}  label="Blog maqolalari"      value={stats.totalBlogs}     color="#059669" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>
                  <StatCard icon={LuTrendingUp} label="Kutilayotgan e'lonlar" value={stats.pendingAds}    color={C.accent} sub="Ko'rib chiqilishi kerak" />
                  <StatCard icon={LuMail}       label="Yangi xabarlar"        value={stats.newContacts}   color="#0891b2" sub="Javob berilmagan" />
                  <StatCard icon={LuCheck}      label="Tugallangan kampaniyalar" value={stats.completedCampaigns} color="#22c55e" sub="Muvaffaqiyatli" />
                </div>

                {/* System info */}
                <Card>
                  <SectionTitle icon={LuBarChart2} title="Tizim ma'lumotlari" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                    {[
                      ["Platforma",   "ADBlogger Admin v1.0"],
                      ["Backend",    "Node.js + Express"],
                      ["Ma'lumotlar ombori", "MongoDB Atlas"],
                      ["Fayl saqlash", "Cloudinary"],
                      ["API versiya", "v1"],
                      ["Server", "Render.com"],
                    ].map(([label, val]) => (
                      <div key={label} style={{ padding: "12px 0", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: C.muted }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card style={{ textAlign: "center", padding: 48 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>Statistika yuklanmadi</div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Server bilan aloqa yo'q</div>
                <Btn variant="ghost" onClick={() => {
                  setStats(null);
                  setStatsLoading(true);
                  api.get("/admin/dashboard")
                    .then(r => setStats(r.data.data?.stats || r.data.stats || null))
                    .catch(() => {})
                    .finally(() => setStatsLoading(false));
                }}>
                  Qayta urinish
                </Btn>
              </Card>
            )}
          </>
        )}

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
