import { useState, useEffect } from "react";

/* ─── ICONS ─── */
const IC = {
  user:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8|M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  palette: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
  credit:  "M1 4h22v16H1z|M1 10h22",
  cog:     "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  check:   "M20 6L9 17l-5-5",
  plus:    "M12 5v14|M5 12h14",
  trash:   "M3 6h18|M19 6l-1 14H6L5 6|M10 11v6m4-6v6|M9 6V4h6v2",
  sun:     "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10|M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  moon:    "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  monitor: "M20 3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z|M8 21h8m-4-4v4",
  link:    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71|M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  mail:    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6",
  cam:     "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z|M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

const Ico = ({ k, sz = 15, col }) => {
  const paths = IC[k]?.split("|") || [];
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
      stroke={col || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
};

/* ─── TOGGLE ─── */
const Tog = ({ on, set }) => (
  <button
    onClick={() => set(!on)}
    style={{
      position: "relative", width: 44, height: 24, borderRadius: 12,
      background: on ? "#2563eb" : "#d1d5db",
      border: "none", cursor: "pointer", transition: "background .2s", flexShrink: 0,
    }}
  >
    <span style={{
      position: "absolute", top: 3, left: on ? 23 : 3,
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,.15)", transition: "left .2s",
    }} />
  </button>
);

/* ─── CARD ─── */
const Card = ({ children, style }) => (
  <div style={{
    background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,.06)", padding: "20px 22px", marginBottom: 14, ...style,
  }}>
    {children}
  </div>
);

/* ─── SECTION LABEL ─── */
const SLabel = ({ children, color }) => (
  <div style={{
    fontSize: 11, fontWeight: 700, color: color || "#9ca3af",
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 14,
  }}>{children}</div>
);

/* ─── ROW ─── */
const Row = ({ label, desc, right }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "11px 0", borderBottom: "1px solid #f3f4f6", gap: 12,
  }}>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{desc}</div>}
    </div>
    {right}
  </div>
);

/* ─── INPUT ─── */
const Inp = ({ value, onChange, type = "text", disabled, placeholder, style }) => (
  <input
    type={type} value={value} onChange={onChange} disabled={disabled}
    placeholder={placeholder}
    style={{
      width: "100%", background: disabled ? "#f9fafb" : "#f3f4f6",
      border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 11px",
      fontSize: 13.5, color: "#111827", outline: "none",
      opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "text",
      fontFamily: "inherit", ...style,
    }}
  />
);

/* ─── BTN ─── */
const Btn = ({ children, onClick, variant = "primary", size = "md" }) => {
  const base = {
    fontFamily: "inherit", fontWeight: 600, cursor: "pointer", border: "none",
    borderRadius: 8, fontSize: size === "sm" ? 12.5 : 13.5, transition: "all .15s",
    padding: size === "sm" ? "5px 12px" : "8px 18px",
  };
  const variants = {
    primary: { background: "#2563eb", color: "#fff", border: "none" },
    outline: { background: "transparent", color: "#6b7280", border: "1.5px solid #d1d5db" },
    danger:  { background: "transparent", color: "#ef4444", border: "1.5px solid rgba(239,68,68,.3)" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick}>{children}</button>;
};

/* ─── BADGE ─── */
const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue:   { background: "rgba(37,99,235,.1)",  color: "#2563eb" },
    green:  { background: "rgba(34,197,94,.1)",  color: "#15803d" },
    orange: { background: "rgba(245,158,11,.1)", color: "#b45309" },
    red:    { background: "rgba(239,68,68,.09)", color: "#ef4444" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      ...colors[color],
    }}>{children}</span>
  );
};

/* ─── TABS ─── */
const TABS = [
  { id: "profile",       label: "Profil",           icon: "user" },
  { id: "account",       label: "Hisob",             icon: "cog" },
  { id: "security",      label: "Xavfsizlik",        icon: "shield" },
  { id: "notifications", label: "Bildirishnomalar",  icon: "bell" },
  { id: "privacy",       label: "Maxfiylik",         icon: "eye" },
  { id: "appearance",    label: "Ko'rinish",         icon: "palette" },
  { id: "billing",       label: "To'lov",            icon: "credit" },
  { id: "integrations",  label: "Integratsiyalar",   icon: "link" },
];

const ACCENTS = [
  { hex: "#2563eb", name: "Blue" },
  { hex: "#5B5BD6", name: "Indigo" },
  { hex: "#8B5CF6", name: "Violet" },
  { hex: "#EC4899", name: "Pink" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#F59E0B", name: "Amber" },
  { hex: "#10B981", name: "Emerald" },
  { hex: "#06B6D4", name: "Cyan" },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AdminSettings() {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState({ on: false, msg: "", col: "#22C55E" });

  const ping = (msg, col = "#22C55E") => {
    setToast({ on: true, msg, col });
    setTimeout(() => setToast(t => ({ ...t, on: false })), 2600);
  };

  /* ── Profile ── */
  const [form, setForm] = useState({
    name: "Alexa Rawles", nick: "alexa_r",
    phone: "+998 90 123 45 67", web: "https://alexa.dev",
    bio: "Senior frontend developer. O'zbekistondan 🇺🇿",
    gender: "female", country: "uz", lang: "uz", tz: "asia/tashkent",
  });
  const [emails, setEmails] = useState([
    { id: 1, addr: "alexarawles@gmail.com", verified: true,  primary: true  },
    { id: 2, addr: "alexa@work.uz",         verified: false, primary: false },
  ]);

  /* ── Security ── */
  const [curP, setCurP] = useState(""); const [newP, setNewP] = useState(""); const [cfP, setCfP] = useState("");
  const [pStr, setPStr] = useState(0);
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, dev: "Chrome 124 / Windows 11", loc: "Toshkent, UZ", t: "Hozir",        active: true  },
    { id: 2, dev: "Safari / iPhone 15 Pro",  loc: "Toshkent, UZ", t: "4 soat oldin", active: false },
    { id: 3, dev: "Firefox / MacBook",       loc: "Moskva, RU",   t: "2 kun oldin",  active: false },
  ]);

  /* ── Notif ── */
  const [notifs, setNotifs] = useState({
    email: true, push: false, sms: true, security: true,
    updates: false, marketing: true, weekly: false, mentions: true,
  });

  /* ── Privacy ── */
  const [priv, setPriv] = useState({ pub: true, showEmail: false, online: true, search: true, data: false, read: true });
  const [apps, setApps] = useState([
    { id: 1, name: "Google", ico: "🔵", scope: "Profil, kalender",  on: true  },
    { id: 2, name: "GitHub", ico: "⚫", scope: "Repozitoriyalar",    on: true  },
    { id: 3, name: "Slack",  ico: "🟣", scope: "Xabarlar",          on: false },
    { id: 4, name: "Figma",  ico: "🟠", scope: "Dizayn fayllar",    on: false },
  ]);

  /* ── Appearance ── */
  const [accent, setAccent]     = useState("#2563eb");
  const [customAccent, setCustomAccent] = useState("#2563eb");
  const [theme, setTheme]       = useState("light");
  const [compact, setCompact]   = useState(false);
  const [animations, setAnimations] = useState(true);

  /* ── Billing ── */
  const [plan] = useState({ stor: 68, bw: 42 });
  const [apiVis, setApiVis] = useState(false);
  const [wh, setWh] = useState("https://myapp.uz/webhook/events");
  const [langUI, setLangUI] = useState("uz");

  const checkStr = (v) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setPStr(s); setNewP(v);
  };
  const strC = ["#e5e7eb", "#ef4444", "#f59e0b", "#22c55e", "#10b981"];
  const strL = ["", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"];

  const addEmail = () => {
    const a = window.prompt("Yangi email:");
    if (!a?.includes("@")) return;
    setEmails(p => [...p, { id: Date.now(), addr: a, verified: false, primary: false }]);
    ping("✓ Email qo'shildi");
  };

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", fontFamily: "inherit" }}>

      {/* ── LEFT NAV PANEL ── */}
      <aside style={{
        width: 210, flexShrink: 0, background: "#fff",
        borderRadius: 12, border: "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
        padding: "10px 8px", position: "sticky", top: 24,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, padding: "6px 10px 8px" }}>Asosiy</div>
        {TABS.slice(0, 2).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 9, width: "100%",
            padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            background: tab === t.id ? "rgba(37,99,235,.08)" : "transparent",
            color: tab === t.id ? "#2563eb" : "#6b7280",
            transition: "all .15s", textAlign: "left",
          }}>
            <Ico k={t.icon} sz={14} col={tab === t.id ? "#2563eb" : "#9ca3af"} />
            {t.label}
          </button>
        ))}

        <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, padding: "12px 10px 8px" }}>Xavfsizlik</div>
        {TABS.slice(2, 5).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 9, width: "100%",
            padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            background: tab === t.id ? "rgba(37,99,235,.08)" : "transparent",
            color: tab === t.id ? "#2563eb" : "#6b7280",
            transition: "all .15s", textAlign: "left",
          }}>
            <Ico k={t.icon} sz={14} col={tab === t.id ? "#2563eb" : "#9ca3af"} />
            {t.label}
          </button>
        ))}

        <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, padding: "12px 10px 8px" }}>Ilova</div>
        {TABS.slice(5).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 9, width: "100%",
            padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
            fontFamily: "inherit", fontWeight: 600, fontSize: 13,
            background: tab === t.id ? "rgba(37,99,235,.08)" : "transparent",
            color: tab === t.id ? "#2563eb" : "#6b7280",
            transition: "all .15s", textAlign: "left",
          }}>
            <Ico k={t.icon} sz={14} col={tab === t.id ? "#2563eb" : "#9ca3af"} />
            {t.label}
          </button>
        ))}
      </aside>

      {/* ── CONTENT AREA ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Ico k={TABS.find(t => t.id === tab)?.icon} sz={20} col="#2563eb" />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>
              {TABS.find(t => t.id === tab)?.label}
            </h2>
          </div>
          {tab === "profile" && !editing && (
            <Btn onClick={() => setEditing(true)} size="sm">Tahrirlash</Btn>
          )}
          {tab === "profile" && editing && (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" size="sm" onClick={() => setEditing(false)}>Bekor</Btn>
              <Btn size="sm" onClick={() => { setEditing(false); ping("✓ Profil saqlandi"); }}>Saqlash</Btn>
            </div>
          )}
        </div>

        {/* ══════ PROFILE ══════ */}
        {tab === "profile" && <>
          <Card>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
              <div
                style={{ position: "relative", cursor: editing ? "pointer" : "default" }}
                onClick={() => editing && ping("Rasm o'zgartirish...")}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: 18, background: "#2563eb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, color: "#fff", fontWeight: 700,
                }}>A</div>
                {editing && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 18,
                    background: "rgba(0,0,0,.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Ico k="cam" sz={18} col="#fff" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{form.name}</div>
                <div style={{ color: "#9ca3af", fontSize: 13, margin: "3px 0 10px" }}>
                  alexarawles@gmail.com · {form.bio}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color="blue">Pro hisob</Badge>
                  <Badge color="green">Faol</Badge>
                  <Badge color="orange">Toshkent, UZ</Badge>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 220 }}>
                {[["247", "Loyihalar"], ["1.2K", "Hamkorlar"], ["4.8★", "Reyting"]].map(([v, l]) => (
                  <div key={l} style={{
                    background: "#f9fafb", borderRadius: 10, padding: "10px 12px",
                    border: "1px solid #e5e7eb", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{v}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <SLabel>Shaxsiy ma'lumotlar</SLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 18px" }}>
              {[["name","To'liq ism","text"],["nick","Laqab","text"],["phone","Telefon","tel"],["web","Vebsayt","url"]].map(([id,lbl,type]) => (
                <div key={id}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>{lbl}</div>
                  <Inp type={type} disabled={!editing} value={form[id]} onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))} />
                </div>
              ))}
              {[
                ["gender","Jinsi",[["","Tanlang"],["female","Ayol"],["male","Erkak"],["other","Boshqa"]]],
                ["country","Mamlakat",[["uz","O'zbekiston 🇺🇿"],["ru","Rossiya 🇷🇺"],["us","AQSh 🇺🇸"],["de","Germaniya 🇩🇪"]]],
                ["lang","Til",[["uz","O'zbek"],["ru","Rus"],["en","English"]]],
                ["tz","Vaqt zonasi",[["asia/tashkent","Toshkent UTC+5"],["europe/moscow","Moskva UTC+3"],["utc","UTC+0"]]],
              ].map(([id,lbl,opts]) => (
                <div key={id}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>{lbl}</div>
                  <select
                    disabled={!editing} value={form[id]}
                    onChange={e => setForm(p => ({ ...p, [id]: e.target.value }))}
                    style={{
                      width: "100%", background: "#f3f4f6", border: "1.5px solid #e5e7eb",
                      borderRadius: 8, padding: "8px 11px", fontSize: 13.5, color: "#111827",
                      outline: "none", fontFamily: "inherit", cursor: "pointer",
                      opacity: !editing ? 0.6 : 1,
                    }}
                  >
                    {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ gridColumn: "1/-1" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>Bio</div>
                <textarea
                  disabled={!editing} value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  style={{
                    width: "100%", background: "#f3f4f6", border: "1.5px solid #e5e7eb",
                    borderRadius: 8, padding: "8px 11px", fontSize: 13.5, color: "#111827",
                    outline: "none", fontFamily: "inherit", resize: "vertical", minHeight: 72,
                    opacity: !editing ? 0.6 : 1,
                  }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <SLabel>Email manzillar</SLabel>
            {emails.map(em => (
              <div key={em.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", background: "#f9fafb", borderRadius: 10,
                border: "1.5px solid #e5e7eb", marginBottom: 8,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, background: "rgba(37,99,235,.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Ico k="mail" sz={14} col="#2563eb" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{em.addr}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{em.verified ? "✓ Tasdiqlangan" : "Tasdiqlanmagan"}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {em.primary && <Badge color="blue">Asosiy</Badge>}
                  {!em.verified && (
                    <Btn variant="outline" size="sm" onClick={() => { setEmails(p => p.map(e => e.id === em.id ? { ...e, verified: true } : e)); ping("✓ Email tasdiqlandi"); }}>
                      Tasdiqlash
                    </Btn>
                  )}
                  {!em.primary && (
                    <Btn variant="danger" size="sm" onClick={() => { setEmails(p => p.filter(e => e.id !== em.id)); ping("Email o'chirildi", "#f59e0b"); }}>
                      O'chirish
                    </Btn>
                  )}
                </div>
              </div>
            ))}
            <button onClick={addEmail} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 14px", borderRadius: 8, border: "1.5px dashed #d1d5db",
              background: "transparent", color: "#2563eb", fontSize: 13, fontWeight: 700,
              cursor: "pointer", marginTop: 4, fontFamily: "inherit",
            }}>
              <Ico k="plus" sz={13} col="#2563eb" /> Email qo'shish
            </button>
          </Card>
        </>}

        {/* ══════ ACCOUNT ══════ */}
        {tab === "account" && <>
          <Card>
            <SLabel>Hisob ma'lumotlari</SLabel>
            {[["Foydalanuvchi ID","#USR-48291"],["Ro'yxatdan o'tgan","07 Iyun 2022"],
              ["Oxirgi kirish","Bugun 14:32"],["Tarif","Pro"],
              ["Holat","Faol"],["Saqlash","68% (6.8 GB / 10 GB)"]].map(([l,v]) => (
              <Row key={l} label={l} right={<span style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{v}</span>} />
            ))}
          </Card>

          <Card>
            <SLabel>Interfeys tili</SLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["uz","O'zbek 🇺🇿"],["ru","Русский 🇷🇺"],["en","English 🇬🇧"]].map(([v,l]) => (
                <div key={v} onClick={() => { setLangUI(v); ping(`✓ Til: ${l.split(" ")[0]}`); }} style={{
                  padding: "8px 14px", borderRadius: 8,
                  border: `1.5px solid ${langUI === v ? "#2563eb" : "#e5e7eb"}`,
                  background: langUI === v ? "rgba(37,99,235,.08)" : "#f9fafb",
                  color: langUI === v ? "#2563eb" : "#6b7280",
                  fontSize: 13, cursor: "pointer", fontWeight: langUI === v ? 700 : 500,
                  transition: "all .15s",
                }}>{l}</div>
              ))}
            </div>
          </Card>

          <Card style={{ border: "1.5px solid rgba(239,68,68,.2)" }}>
            <SLabel color="#ef4444">Xavfli zona</SLabel>
            {[
              ["Ma'lumotlarni yuklab olish","Barcha ma'lumotlarni JSON formatda oling","#f59e0b"],
              ["Hisobni muzlatish","Vaqtincha to'xtatish — istalgan vaqt tiklash mumkin","#f59e0b"],
              ["Hisobni o'chirish","Bu amal qaytarib bo'lmaydi. Barcha ma'lumotlar yo'qoladi.","#ef4444"],
            ].map(([lbl, desc]) => (
              <div key={lbl} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: 12, background: "#fef2f2", borderRadius: 10,
                border: "1.5px solid #fee2e2", marginBottom: 8,
              }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#ef4444" }}>{lbl}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{desc}</div>
                </div>
                <Btn variant="danger" size="sm" onClick={() => ping(`${lbl}...`, "#f59e0b")}>{lbl.split(" ")[0]}</Btn>
              </div>
            ))}
          </Card>
        </>}

        {/* ══════ SECURITY ══════ */}
        {tab === "security" && <>
          <Card>
            <SLabel>Parolni o'zgartirish</SLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>Joriy parol</div>
                <Inp type="password" placeholder="••••••••" value={curP} onChange={e => setCurP(e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>Yangi parol</div>
                <Inp type="password" placeholder="••••••••" value={newP} onChange={e => checkStr(e.target.value)} />
                {newP && <>
                  <div style={{ display: "flex", gap: 4, marginTop: 7 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= pStr ? strC[pStr] : "#e5e7eb", transition: "background .3s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: strC[pStr], marginTop: 4, fontWeight: 600 }}>{strL[pStr]}</div>
                </>}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>Parolni tasdiqlang</div>
                <Inp type="password" placeholder="••••••••" value={cfP} onChange={e => setCfP(e.target.value)}
                  style={{ borderColor: cfP && cfP !== newP ? "#ef4444" : undefined }} />
                {cfP && cfP !== newP && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>Parollar mos kelmaydi</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => {
                  if (!curP) { ping("Joriy parolni kiriting", "#f59e0b"); return; }
                  if (newP !== cfP) { ping("Parollar mos kelmaydi", "#ef4444"); return; }
                  if (newP.length < 8) { ping("Juda qisqa", "#f59e0b"); return; }
                  setCurP(""); setNewP(""); setCfP(""); setPStr(0); ping("✓ Parol o'zgartirildi");
                }}>O'zgartirish</Btn>
                <Btn variant="outline" onClick={() => { setCurP(""); setNewP(""); setCfP(""); setPStr(0); }}>Tozalash</Btn>
              </div>
            </div>
          </Card>

          <Card>
            <Row
              label="Ikki bosqichli autentifikatsiya (2FA)"
              desc="SMS yoki authenticator app orqali"
              right={<Tog on={twoFA} set={v => { setTwoFA(v); ping(v ? "✓ 2FA yoqildi" : "2FA o'chirildi", v ? "#22c55e" : "#f59e0b"); }} />}
            />
            {twoFA && (
              <div style={{ marginTop: 12, padding: 12, background: "rgba(34,197,94,.08)", borderRadius: 10, border: "1px solid rgba(34,197,94,.2)" }}>
                <div style={{ fontSize: 13, color: "#15803d", fontWeight: 700 }}>✓ 2FA faol — SMS orqali tasdiqlash yoqilgan</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Btn variant="outline" size="sm" onClick={() => ping("Backup kodlar ko'chirildi")}>Backup kodlar</Btn>
                  <Btn variant="outline" size="sm" onClick={() => ping("Authenticator sozlash...")}>App sozlash</Btn>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <SLabel style={{ marginBottom: 0 }}>Faol sessiyalar ({sessions.length})</SLabel>
              <Btn variant="outline" size="sm" onClick={() => { setSessions(p => p.filter(s => s.active)); ping("Barcha sessiyalar tugatildi", "#f59e0b"); }}>
                Barchasini tugatish
              </Btn>
            </div>
            {sessions.map(s => (
              <Row key={s.id}
                label={
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.active ? "#22c55e" : "#d1d5db", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{s.dev}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.loc} · {s.t}</div>
                    </div>
                  </div>
                }
                right={
                  s.active ? <Badge color="green">Joriy</Badge>
                    : <Btn variant="danger" size="sm" onClick={() => { setSessions(p => p.filter(x => x.id !== s.id)); ping("Sessiya tugatildi", "#f59e0b"); }}>Tugatish</Btn>
                }
              />
            ))}
          </Card>
        </>}

        {/* ══════ NOTIFICATIONS ══════ */}
        {tab === "notifications" && <>
          <Card>
            <SLabel>Bildirishnoma kanallari</SLabel>
            {[
              { id: "email", lbl: "Email bildirishnomalar",  desc: "Muhim yangiliklar emailga yuborilsin" },
              { id: "push",  lbl: "Push bildirishnomalar",   desc: "Brauzer orqali real-vaqt xabarlari" },
              { id: "sms",   lbl: "SMS bildirishnomalar",    desc: "+998 90 123 45 67 ga SMS xabarlari" },
            ].map(n => (
              <Row key={n.id} label={n.lbl} desc={n.desc}
                right={<Tog on={notifs[n.id]} set={v => { setNotifs(p => ({ ...p, [n.id]: v })); ping(v ? `✓ ${n.lbl} yoqildi` : `${n.lbl} o'chirildi`, v ? "#22c55e" : "#f59e0b"); }} />}
              />
            ))}
          </Card>

          <Card>
            <SLabel>Bildirishnoma turlari</SLabel>
            {[
              { id: "security",  lbl: "Xavfsizlik ogohlantirishlari", desc: "Kirish urinishlari, parol o'zgarishi", imp: true },
              { id: "updates",   lbl: "Mahsulot yangilanishlari",      desc: "Yangi funksiyalar va yaxshilanishlar" },
              { id: "marketing", lbl: "Marketing va takliflar",        desc: "Maxsus chegirmalar va yangiliklar" },
              { id: "weekly",    lbl: "Haftalik hisobot",              desc: "Faollik va statistika xulasasi" },
              { id: "mentions",  lbl: "Eslatmalar va teglar",          desc: "Siz eslatilganingizda xabar olish" },
            ].map(n => (
              <Row key={n.id}
                label={<span style={{ display: "flex", alignItems: "center", gap: 6 }}>{n.lbl}{n.imp && <Badge color="red">Muhim</Badge>}</span>}
                desc={n.desc}
                right={<Tog on={notifs[n.id]} set={v => { setNotifs(p => ({ ...p, [n.id]: v })); ping(v ? `✓ ${n.lbl} yoqildi` : `${n.lbl} o'chirildi`, v ? "#22c55e" : "#f59e0b"); }} />}
              />
            ))}
          </Card>
        </>}

        {/* ══════ PRIVACY ══════ */}
        {tab === "privacy" && <>
          <Card>
            <SLabel>Profil ko'rinishi</SLabel>
            {[
              { id: "pub",       lbl: "Profilni ochiq qilish",      desc: "Boshqalar profilingizni ko'radi" },
              { id: "showEmail", lbl: "Emailni ko'rsatish",         desc: "Profilingizda email ko'rinsin" },
              { id: "online",    lbl: "Online holatni ko'rsatish",  desc: "Faol/nofaol holatingiz ko'rinsin" },
              { id: "search",    lbl: "Qidiruvda topilish",         desc: "Qidiruv natijalarida ko'rinsin" },
              { id: "read",      lbl: "O'qildi belgisi",            desc: "Xabar o'qilganligini ko'rsatish" },
              { id: "data",      lbl: "Anonim statistika yuborish", desc: "Mahsulotni yaxshilash uchun" },
            ].map(p => (
              <Row key={p.id} label={p.lbl} desc={p.desc}
                right={<Tog on={priv[p.id]} set={v => { setPriv(pr => ({ ...pr, [p.id]: v })); ping(v ? `✓ ${p.lbl} yoqildi` : `${p.lbl} o'chirildi`, v ? "#22c55e" : "#f59e0b"); }} />}
              />
            ))}
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <SLabel style={{ marginBottom: 0 }}>Ulangan ilovalar</SLabel>
              <Btn size="sm" onClick={() => ping("Yangi ilova qidirish...")}>+ Ulash</Btn>
            </div>
            {apps.map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 13px", background: "#f9fafb", borderRadius: 10,
                border: "1.5px solid #e5e7eb", marginBottom: 8,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, background: "#fff", border: "1px solid #e5e7eb" }}>{a.ico}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{a.scope}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {a.on && <Badge color="green">Ulangan</Badge>}
                  <Btn variant={a.on ? "danger" : "outline"} size="sm"
                    onClick={() => { setApps(p => p.map(x => x.id === a.id ? { ...x, on: !x.on } : x)); ping(a.on ? `${a.name} uzildi` : `✓ ${a.name} ulandi`, a.on ? "#f59e0b" : "#22c55e"); }}>
                    {a.on ? "Uzish" : "Ulash"}
                  </Btn>
                </div>
              </div>
            ))}
          </Card>
        </>}

        {/* ══════ APPEARANCE ══════ */}
        {tab === "appearance" && <>
          <Card>
            <SLabel>Mavzu (Tema)</SLabel>
            <div style={{ display: "flex", gap: 10 }}>
              {[["light","Yorug' 🌤","sun"],["dark","Qorong'u 🌙","moon"],["system","Tizim 💻","monitor"]].map(([v,l,ic]) => (
                <div key={v} onClick={() => { setTheme(v); ping(`✓ Mavzu: ${l.split(" ")[0]}`); }} style={{
                  flex: 1, padding: "14px 12px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                  border: `1.5px solid ${theme === v ? "#2563eb" : "#e5e7eb"}`,
                  background: theme === v ? "rgba(37,99,235,.08)" : "#f9fafb",
                  transition: "all .15s",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <Ico k={ic} sz={20} col={theme === v ? "#2563eb" : "#9ca3af"} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: theme === v ? 700 : 500, color: theme === v ? "#2563eb" : "#6b7280" }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SLabel>Asosiy rang</SLabel>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {ACCENTS.map(c => (
                <button key={c.hex} title={c.name} onClick={() => { setAccent(c.hex); setCustomAccent(c.hex); ping(`✓ Rang: ${c.name}`); }}
                  style={{
                    width: 30, height: 30, borderRadius: "50%", background: c.hex,
                    border: accent === c.hex ? "3px solid #111827" : "3px solid transparent",
                    cursor: "pointer", transition: "all .15s", transform: accent === c.hex ? "scale(1.15)" : "scale(1)",
                    outline: "none",
                  }}
                />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>Maxsus rang</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="color" value={customAccent}
                  onChange={e => { setCustomAccent(e.target.value); setAccent(e.target.value); }}
                  style={{ width: 48, height: 40, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "none", cursor: "pointer", padding: 3 }}
                />
                <div style={{ fontFamily: "monospace", fontSize: 13, color: "#6b7280", background: "#f3f4f6", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}>{customAccent}</div>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: customAccent, border: "1.5px solid #e5e7eb" }} />
              </div>
            </div>
          </Card>

          <Card>
            <SLabel>Qo'shimcha</SLabel>
            <Row label="Ixcham rejim" desc="Elementlar orasidagi bo'shliqni kamaytirish"
              right={<Tog on={compact} set={v => { setCompact(v); ping(v ? "✓ Ixcham rejim yoqildi" : "Ixcham rejim o'chirildi", v ? "#22c55e" : "#f59e0b"); }} />}
            />
            <Row label="Animatsiyalar va effektlar" desc="Silliq o'tishlar, hover effektlar"
              right={<Tog on={animations} set={v => { setAnimations(v); ping(v ? "✓ Animatsiyalar yoqildi" : "Animatsiyalar o'chirildi", v ? "#22c55e" : "#f59e0b"); }} />}
            />
          </Card>
        </>}

        {/* ══════ BILLING ══════ */}
        {tab === "billing" && <>
          <Card style={{ background: "linear-gradient(135deg,#2563eb 0%,#7c3aed 100%)", border: "none" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 8 }}>Joriy tarif</div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>Pro</div>
                <div style={{ color: "rgba(255,255,255,.75)", marginTop: 3, fontSize: 13 }}>$12 / oy · Keyingi to'lov: 15 May 2026</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "rgba(255,255,255,.18)", color: "#fff", border: "1.5px solid rgba(255,255,255,.35)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }} onClick={() => ping("Tarifni o'zgartirish...")}>O'zgartirish</button>
                <button style={{ background: "transparent", color: "rgba(255,255,255,.65)", border: "1.5px solid rgba(255,255,255,.2)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }} onClick={() => ping("Bekor qilish so'rovi...")}>Bekor qilish</button>
              </div>
            </div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Saqlash", plan.stor, "6.8 GB / 10 GB"], ["Kenglik", plan.bw, "42 GB / 100 GB"]].map(([l,v,sub]) => (
                <div key={l}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>{l}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,.9)", fontWeight: 700 }}>{v}%</span>
                  </div>
                  <div style={{ height: 7, background: "rgba(255,255,255,.2)", borderRadius: 4 }}>
                    <div style={{ width: `${v}%`, height: "100%", borderRadius: 4, background: "rgba(255,255,255,.8)" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 3 }}>{sub}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <SLabel style={{ marginBottom: 0 }}>To'lov usullari</SLabel>
              <Btn size="sm" onClick={() => ping("Karta qo'shish...")}>+ Karta qo'shish</Btn>
            </div>
            {[{ type: "VISA", n: "4242", exp: "12/27", primary: true, col: "#1a1f71" }, { type: "MC", n: "8891", exp: "06/26", primary: false, col: "#eb001b" }].map(c => (
              <div key={c.n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 10, border: "1.5px solid #e5e7eb", marginBottom: 8 }}>
                <div style={{ width: 46, height: 30, borderRadius: 7, background: c.col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 900, flexShrink: 0 }}>{c.type}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>•••• •••• •••• {c.n}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Muddati: {c.exp}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {c.primary && <Badge color="blue">Asosiy</Badge>}
                  {!c.primary && <Btn variant="outline" size="sm" onClick={() => ping("Asosiy karta o'zgartirildi")}>Asosiy qilish</Btn>}
                  <Btn variant="danger" size="sm" onClick={() => ping("Karta o'chirildi", "#f59e0b")}>O'chirish</Btn>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <SLabel style={{ marginBottom: 0 }}>To'lov tarixi</SLabel>
              <Btn variant="outline" size="sm" onClick={() => ping("Barcha hisoblar yuklab olindi")}>Barchasini yuklab olish</Btn>
            </div>
            {[{ d: "15 Apr 2026", a: "$12.00", inv: "INV-2026-04" }, { d: "15 Mar 2026", a: "$12.00", inv: "INV-2026-03" }, { d: "15 Feb 2026", a: "$12.00", inv: "INV-2026-02" }].map(p => (
              <Row key={p.inv}
                label={<><div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{p.d}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{p.inv}</div></>}
                right={<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#111827" }}>{p.a}</span>
                  <Badge color="green">To'langan</Badge>
                  <Btn variant="outline" size="sm" onClick={() => ping(`${p.inv} yuklab olindi`)}>PDF</Btn>
                </div>}
              />
            ))}
          </Card>
        </>}

        {/* ══════ INTEGRATIONS ══════ */}
        {tab === "integrations" && <>
          <Card>
            <SLabel>API kaliti</SLabel>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>Ishlab chiqarish kaliti</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, fontFamily: "monospace", fontSize: 13, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", color: "#6b7280", wordBreak: "break-all" }}>
                  {apiVis ? "sk_live_xxxx_xxxx_xxxx_xxxx_xxxx_4a2f" : "sk_live_•••••••••••••••••••••••••••••••4a2f"}
                </div>
                <Btn variant="outline" size="sm" onClick={() => setApiVis(v => !v)}>{apiVis ? "Yashirish" : "Ko'rish"}</Btn>
                <Btn variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText("sk_live_actual").catch(() => {}); ping("✓ Nusxalandi"); }}>Nusxa</Btn>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => ping("✓ Yangi kalit yaratildi")}>Yangi kalit yaratish</Btn>
              <Btn variant="danger" onClick={() => ping("Kalit o'chirildi", "#f59e0b")}>Kalitni o'chirish</Btn>
            </div>
          </Card>

          <Card>
            <SLabel>Webhook</SLabel>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 }}>Webhook URL</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Inp value={wh} onChange={e => setWh(e.target.value)} placeholder="https://your-app.com/webhook" style={{ flex: 1 }} />
                <Btn onClick={() => ping("✓ Webhook saqlandi")}>Saqlash</Btn>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>Hodisalar:</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["user.login","user.update","payment.success","payment.failed","session.end","data.export"].map(ev => (
                  <div key={ev} onClick={() => ping(`✓ ${ev} tanlandi`)}
                    style={{ padding: "5px 10px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#6b7280", fontSize: 12, cursor: "pointer", fontFamily: "monospace", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}>
                    {ev}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <SLabel>Uchinchi tomon ilovalar</SLabel>
            {[
              { n: "Zapier",   ico: "⚡", desc: "Ish jarayonlarini avtomatlashtirish", on: true  },
              { n: "Stripe",   ico: "💳", desc: "To'lov tizimi integratsiyasi",         on: true  },
              { n: "Airtable", ico: "📊", desc: "Ma'lumotlar sinxronizatsiyasi",        on: false },
              { n: "SendGrid", ico: "📧", desc: "Transaksion email xizmati",            on: false },
            ].map(a => (
              <div key={a.n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", background: "#f9fafb", borderRadius: 10, border: "1.5px solid #e5e7eb", marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, background: "#fff", border: "1px solid #e5e7eb" }}>{a.ico}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{a.n}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{a.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {a.on && <Badge color="green">Ulangan</Badge>}
                  <Btn variant={a.on ? "danger" : "outline"} size="sm" onClick={() => ping(a.on ? `${a.n} uzildi` : `✓ ${a.n} ulandi`, a.on ? "#f59e0b" : "#22c55e")}>{a.on ? "Uzish" : "Ulash"}</Btn>
                </div>
              </div>
            ))}
          </Card>
        </>}

      </div>

      {/* ── TOAST ── */}
      <div style={{
        position: "fixed", bottom: 22, right: 22, zIndex: 9999,
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
        padding: "11px 16px", display: "flex", alignItems: "center", gap: 10,
        fontSize: 13, fontWeight: 600, color: "#111827",
        boxShadow: "0 8px 30px rgba(0,0,0,.12)",
        transition: "all .28s cubic-bezier(.34,1.56,.64,1)",
        opacity: toast.on ? 1 : 0,
        transform: toast.on ? "translateY(0) scale(1)" : "translateY(14px) scale(.96)",
        pointerEvents: toast.on ? "all" : "none",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: toast.col, flexShrink: 0 }} />
        {toast.msg}
      </div>
    </div>
  );
}
