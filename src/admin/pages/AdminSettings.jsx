import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: #5B5BD6;
  --accent-soft: rgba(91,91,214,0.10);
  --accent-mid: rgba(91,91,214,0.20);
  --bg: #F7F7FB;
  --surface: #FFFFFF;
  --surface2: #F0F0F8;
  --border: rgba(0,0,0,0.07);
  --border2: rgba(0,0,0,0.12);
  --text: #18181B;
  --text2: #52525B;
  --text3: #A1A1AA;
  --danger: #EF4444;
  --danger-soft: rgba(239,68,68,0.09);
  --success: #22C55E;
  --success-soft: rgba(34,197,94,0.10);
  --warn: #F59E0B;
  --warn-soft: rgba(245,158,11,0.10);
  --radius: 14px;
  --shadow: 0 2px 16px rgba(0,0,0,0.07);
  --font-size: 14px;
}

body { font-family: 'Nunito', sans-serif; font-size: var(--font-size); background: var(--bg); color: var(--text); }

/* scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 10px; }

/* transitions */
.fade-in { animation: fadeIn 0.22s ease; }
@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

/* card */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 22px 24px;
  margin-bottom: 14px;
}
.card:last-child { margin-bottom: 0; }

/* inputs */
.inp {
  width: 100%;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 9px 13px;
  font-size: inherit;
  font-family: 'Nunito', sans-serif;
  color: var(--text);
  outline: none;
  transition: border-color .15s;
}
.inp:focus { border-color: var(--accent); }
.inp:disabled { opacity: .45; cursor: not-allowed; }

textarea.inp { resize: vertical; min-height: 80px; }
select.inp { cursor: pointer; }

/* buttons */
.btn { font-family: 'Nunito', sans-serif; font-weight: 600; cursor: pointer; border: none; transition: all .15s; border-radius: 10px; font-size: inherit; }
.btn-primary { background: var(--accent); color: #fff; padding: 9px 20px; }
.btn-primary:hover { filter: brightness(1.1); }
.btn-primary:active { transform: scale(.97); }
.btn-outline { background: transparent; color: var(--text2); border: 1.5px solid var(--border2); padding: 8px 18px; }
.btn-outline:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.btn-danger { background: transparent; color: var(--danger); border: 1.5px solid rgba(239,68,68,.25); padding: 8px 16px; }
.btn-danger:hover { background: var(--danger-soft); }
.btn-sm { padding: 6px 13px; font-size: .85em; border-radius: 8px; }

/* badges */
.badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: .75em; font-weight: 700; }
.badge-blue { background: var(--accent-soft); color: var(--accent); }
.badge-green { background: var(--success-soft); color: #15803D; }
.badge-orange { background: var(--warn-soft); color: #B45309; }
.badge-red { background: var(--danger-soft); color: var(--danger); }

/* toggle */
.tog { position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-flex; align-items: center; }
.tog input { opacity: 0; width: 0; height: 0; position: absolute; }
.tog-track { position: absolute; inset: 0; border-radius: 12px; background: #D4D4D8; transition: background .2s; }
.tog input:checked + .tog-track { background: var(--accent); }
.tog-thumb { position: absolute; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.15); transition: transform .2s; pointer-events: none; }
.tog input:checked ~ .tog-thumb { transform: translateX(20px); }

/* row */
.row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--border); gap: 12px; }
.row:last-child { border-bottom: none; }
.row-info strong { display: block; font-size: .93em; font-weight: 600; color: var(--text); }
.row-info span { display: block; font-size: .8em; color: var(--text3); margin-top: 2px; }

/* strength bars */
.s-bars { display: flex; gap: 4px; margin-top: 7px; }
.s-bar { flex: 1; height: 4px; border-radius: 2px; background: var(--border2); transition: background .3s; }

/* nav item */
.nav-it { display: flex; align-items: center; gap: 10px; padding: 9px 13px; border-radius: 11px; cursor: pointer; font-weight: 600; font-size: .88em; color: var(--text2); transition: all .15s; position: relative; }
.nav-it:hover { background: var(--surface2); color: var(--text); }
.nav-it.act { background: var(--accent-soft); color: var(--accent); }
.nav-it .pip { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-left: auto; opacity: 0; }
.nav-it.act .pip { opacity: 1; }

/* grid helpers */
.g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; }
.g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.fl { display: flex; align-items: center; gap: 10px; }
.lbl { font-size: .78em; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 14px; }
.fl-lbl { font-size: .82em; font-weight: 600; color: var(--text2); margin-bottom: 6px; }

/* color swatch */
.swatch { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: all .15s; outline: none; flex-shrink: 0; }
.swatch:hover { transform: scale(1.12); }
.swatch.sel { border-color: var(--text); transform: scale(1.15); box-shadow: 0 0 0 2px var(--bg); }

/* sidebar avatar */
.av { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 16px; color: #fff; flex-shrink: 0; }

/* section title */
.st { font-family: 'Playfair Display', serif; font-size: 1.25em; color: var(--text); margin-bottom: 18px; }

/* plan card */
.plan-card { background: linear-gradient(135deg, #5B5BD6 0%, #8B5CF6 100%); border-radius: var(--radius); padding: 22px 24px; color: #fff; margin-bottom: 14px; position: relative; overflow: hidden; }
.plan-card::before { content: ''; position: absolute; width: 200px; height: 200px; background: rgba(255,255,255,.05); border-radius: 50%; top: -60px; right: -40px; }
.plan-card::after { content: ''; position: absolute; width: 120px; height: 120px; background: rgba(255,255,255,.04); border-radius: 50%; bottom: -30px; left: 60px; }

/* progress */
.prog { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 4px; background: var(--accent); transition: width .6s ease; }

/* toast */
.toast { position: fixed; bottom: 22px; right: 22px; z-index: 9999; background: var(--surface); border: 1px solid var(--border2); border-radius: 12px; padding: 12px 18px; display: flex; align-items: center; gap: 10px; font-size: .88em; font-weight: 600; color: var(--text); box-shadow: 0 8px 30px rgba(0,0,0,.12); transition: all .28s cubic-bezier(.34,1.56,.64,1); opacity: 0; transform: translateY(14px) scale(.96); pointer-events: none; }
.toast.on { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
.t-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* app-icon chip */
.app-chip { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--surface2); border-radius: 12px; border: 1.5px solid var(--border); transition: border-color .15s; margin-bottom: 10px; }
.app-chip:hover { border-color: var(--border2); }
.app-chip-ico { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; background: var(--surface); }

/* mono tag */
.mono { font-family: 'Courier New', monospace; font-size: .85em; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; color: var(--text2); word-break: break-all; }

/* logout screen */
.logout-wrap { min-height: 600px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: var(--bg); }
`;

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IC = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8|M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  palette: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
  credit: "M1 4h22v16H1z|M1 10h22",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  check: "M20 6L9 17l-5-5",
  plus: "M12 5v14|M5 12h14",
  trash: "M3 6h18|M19 6l-1 14H6L5 6|M10 11v6m4-6v6|M9 6V4h6v2",
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  sun: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10|M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  monitor: "M20 3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z|M8 21h8m-4-4v4",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71|M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6",
  cam: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z|M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  copy: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .017h8c1.105 0 2 .911 2 2.036v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.054c0-1.124.895-2.036 2-2.036z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

const Ico = ({ k, sz = 15, col }) => {
  const paths = IC[k]?.split("|") || [];
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
};

/* ─────────────────────────────────────────
   TOGGLE COMPONENT
───────────────────────────────────────── */
const Tog = ({ on, set }) => (
  <label className="tog" onClick={() => set(!on)}>
    <input type="checkbox" readOnly checked={on} />
    <div className="tog-track" />
    <div className="tog-thumb" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
  </label>
);

/* ─────────────────────────────────────────
   ROW COMPONENT
───────────────────────────────────────── */
const Row = ({ label, desc, right }) => (
  <div className="row">
    <div className="row-info">
      <strong>{label}</strong>
      {desc && <span>{desc}</span>}
    </div>
    {right}
  </div>
);

/* ─────────────────────────────────────────
   ACCENT COLORS
───────────────────────────────────────── */
const ACCENTS = [
  { hex: "#5B5BD6", name: "Indigo" },
  { hex: "#8B5CF6", name: "Violet" },
  { hex: "#EC4899", name: "Pink" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#F59E0B", name: "Amber" },
  { hex: "#10B981", name: "Emerald" },
  { hex: "#06B6D4", name: "Cyan" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#F97316", name: "Orange" },
];

const FONT_SIZES = [
  { id: "xs", label: "XS", px: "12px" },
  { id: "sm", label: "S", px: "13px" },
  { id: "md", label: "M", px: "14px" },
  { id: "lg", label: "L", px: "16px" },
  { id: "xl", label: "XL", px: "18px" },
  { id: "xxl", label: "XXL", px: "20px" },
];

const TABS = [
  { id: "profile", label: "Profil", icon: "user" },
  { id: "account", label: "Hisob", icon: "cog" },
  { id: "security", label: "Xavfsizlik", icon: "shield" },
  { id: "notifications", label: "Bildirishnomalar", icon: "bell" },
  { id: "privacy", label: "Maxfiylik", icon: "eye" },
  { id: "appearance", label: "Ko'rinish", icon: "palette" },
  { id: "billing", label: "To'lov", icon: "credit" },
  { id: "integrations", label: "Integratsiyalar", icon: "link" },
];

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [toast, setToast] = useState({ on: false, msg: "", col: "#22C55E" });
  const [accent, setAccent] = useState("#5B5BD6");
  const [customAccent, setCustomAccent] = useState("#5B5BD6");
  const [fontSize, setFontSize] = useState("md");
  const [theme, setTheme] = useState("light");

  // inject dynamic CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-soft", accent + "1A");
    root.style.setProperty("--accent-mid", accent + "33");
  }, [accent]);

  useEffect(() => {
    const sz = FONT_SIZES.find(f => f.id === fontSize)?.px || "14px";
    document.documentElement.style.setProperty("--font-size", sz);
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.style.setProperty("--bg", "#0F0F12");
      root.style.setProperty("--surface", "#18181B");
      root.style.setProperty("--surface2", "#27272A");
      root.style.setProperty("--border", "rgba(255,255,255,0.07)");
      root.style.setProperty("--border2", "rgba(255,255,255,0.13)");
      root.style.setProperty("--text", "#FAFAFA");
      root.style.setProperty("--text2", "#A1A1AA");
      root.style.setProperty("--text3", "#71717A");
      root.style.setProperty("--shadow", "0 2px 20px rgba(0,0,0,0.35)");
    } else {
      root.style.setProperty("--bg", "#F7F7FB");
      root.style.setProperty("--surface", "#FFFFFF");
      root.style.setProperty("--surface2", "#F0F0F8");
      root.style.setProperty("--border", "rgba(0,0,0,0.07)");
      root.style.setProperty("--border2", "rgba(0,0,0,0.12)");
      root.style.setProperty("--text", "#18181B");
      root.style.setProperty("--text2", "#52525B");
      root.style.setProperty("--text3", "#A1A1AA");
      root.style.setProperty("--shadow", "0 2px 16px rgba(0,0,0,0.07)");
    }
  }, [theme]);

  const ping = (msg, col = "#22C55E") => {
    setToast({ on: true, msg, col });
    setTimeout(() => setToast(t => ({ ...t, on: false })), 2600);
  };

  // ── Profile state ──
  const [form, setForm] = useState({ name: "Alexa Rawles", nick: "alexa_r", phone: "+998 90 123 45 67", web: "https://alexa.dev", bio: "Senior frontend developer. O'zbekistondan 🇺🇿", gender: "female", country: "uz", lang: "uz", tz: "asia/tashkent" });
  const [emails, setEmails] = useState([
    { id: 1, addr: "alexarawles@gmail.com", verified: true, primary: true },
    { id: 2, addr: "alexa@work.uz", verified: false, primary: false },
  ]);

  // ── Security state ──
  const [curP, setCurP] = useState(""); const [newP, setNewP] = useState(""); const [cfP, setCfP] = useState("");
  const [pStr, setPStr] = useState(0);
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, dev: "Chrome 124 / Windows 11", loc: "Toshkent, UZ", t: "Hozir", active: true },
    { id: 2, dev: "Safari / iPhone 15 Pro", loc: "Toshkent, UZ", t: "4 soat oldin", active: false },
    { id: 3, dev: "Firefox / MacBook", loc: "Moskva, RU", t: "2 kun oldin", active: false },
  ]);

  // ── Notif state ──
  const [notifs, setNotifs] = useState({ email: true, push: false, sms: true, security: true, updates: false, marketing: true, weekly: false, mentions: true });

  // ── Privacy state ──
  const [priv, setPriv] = useState({ pub: true, showEmail: false, online: true, search: true, data: false, read: true });
  const [apps, setApps] = useState([
    { id: 1, name: "Google", ico: "🔵", scope: "Profil, kalender", on: true },
    { id: 2, name: "GitHub", ico: "⚫", scope: "Repozitoriyalar", on: true },
    { id: 3, name: "Slack", ico: "🟣", scope: "Xabarlar", on: false },
    { id: 4, name: "Figma", ico: "🟠", scope: "Dizayn fayllar", on: false },
    { id: 5, name: "Notion", ico: "⬜", scope: "Hujjatlar", on: false },
  ]);

  // ── Billing state ──
  const [plan] = useState({ stor: 68, bw: 42 });
  const [apiVis, setApiVis] = useState(false);
  const [wh, setWh] = useState("https://myapp.uz/webhook/events");
  const [compact, setCompact] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [langUI, setLangUI] = useState("uz");

  const checkStr = (v) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setPStr(s); setNewP(v);
  };

  const strC = ["#E4E4E7", "#EF4444", "#F59E0B", "#22C55E", "#10B981"];
  const strL = ["", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"];

  const doLogout = () => {
    if (window.confirm("Hisobdan chiqishni xohlaysizmi?")) setLoggedOut(true);
  };

  const addEmail = () => {
    const a = window.prompt("Yangi email:");
    if (!a?.includes("@")) return;
    setEmails(p => [...p, { id: Date.now(), addr: a, verified: false, primary: false }]);
    ping("✓ Email qo'shildi");
  };

  if (loggedOut) return (
    <>
      <style>{BASE_CSS}</style>
      <div className="logout-wrap">
        <div style={{ width: 72, height: 72, borderRadius: 20, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico k="logout" sz={28} col="#fff" />
        </div>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6em", color: "var(--text)" }}>Chiqildi</div>
        <div style={{ color: "var(--text3)", fontSize: ".9em" }}>alexarawles@gmail.com</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={() => setLoggedOut(false)}>Qayta kirish</button>
          <button className="btn btn-outline" onClick={() => ping("Boshqa hisob...")}>Boshqa hisob</button>
        </div>
      </div>
    </>
  );

  const tabData = TABS.find(t => t.id === tab) || TABS[0];

  return (
    <>
      <style>{BASE_CSS}</style>
      <div style={{ display: "flex", height: "100vh", minHeight: 600, background: "var(--bg)", overflow: "hidden" }}>

        {/* ───── SIDEBAR ───── */}
        <div style={{ width: 230, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Logo */}
          <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2em", color: "var(--text)" }}>
              Sozlama<span style={{ color: accent }}>lar</span>
            </div>
            <div style={{ fontSize: ".75em", color: "var(--text3)", marginTop: 3 }}>Hisobingizni boshqaring</div>
          </div>

          {/* User pill */}
          <div style={{ margin: "12px 12px 6px", background: "var(--surface2)", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border)" }}>
            <div className="av" style={{ background: accent }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: ".82em", fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.name}</div>
              <div style={{ fontSize: ".72em", color: "var(--text3)" }}>Pro · Faol</div>
            </div>
            <span className="badge badge-blue" style={{ fontSize: ".68em" }}>Pro</span>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "6px 10px" }}>
            <div style={{ fontSize: ".72em", fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, padding: "8px 4px 4px" }}>Asosiy</div>
            {TABS.slice(0, 2).map(t => (
              <div key={t.id} className={`nav-it ${tab === t.id ? "act" : ""}`} onClick={() => setTab(t.id)}>
                <Ico k={t.icon} sz={14} col={tab === t.id ? accent : "var(--text3)"} />
                {t.label}
                <div className="pip" />
              </div>
            ))}
            <div style={{ fontSize: ".72em", fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, padding: "10px 4px 4px" }}>Xavfsizlik</div>
            {TABS.slice(2, 5).map(t => (
              <div key={t.id} className={`nav-it ${tab === t.id ? "act" : ""}`} onClick={() => setTab(t.id)}>
                <Ico k={t.icon} sz={14} col={tab === t.id ? accent : "var(--text3)"} />
                {t.label}
                <div className="pip" />
              </div>
            ))}
            <div style={{ fontSize: ".72em", fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, padding: "10px 4px 4px" }}>Ilova</div>
            {TABS.slice(5).map(t => (
              <div key={t.id} className={`nav-it ${tab === t.id ? "act" : ""}`} onClick={() => setTab(t.id)}>
                <Ico k={t.icon} sz={14} col={tab === t.id ? accent : "var(--text3)"} />
                {t.label}
                <div className="pip" />
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div style={{ padding: "10px 10px 14px", borderTop: "1px solid var(--border)" }}>
            <div className="nav-it" style={{ color: "var(--danger)" }} onClick={doLogout}>
              <Ico k="logout" sz={14} col="var(--danger)" />
              Hisobdan chiqish
            </div>
          </div>
        </div>

        {/* ───── MAIN ───── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Topbar */}
          <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Ico k={tabData.icon} sz={18} col={accent} />
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15em", color: "var(--text)" }}>{tabData.label}</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {tab === "profile" && !editing && (
                <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Tahrirlash</button>
              )}
              {tab === "profile" && editing && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Bekor</button>
                  <button className="btn btn-primary btn-sm" onClick={() => { setEditing(false); ping("✓ Profil saqlandi"); }}>Saqlash</button>
                </div>
              )}
              <div style={{ width: 34, height: 34, borderRadius: 10, background: accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "Playfair Display, serif", color: "#fff", fontSize: "1em", fontWeight: 700 }}>A</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            <div className="fade-in" key={tab}>

              {/* ══════ PROFILE ══════ */}
              {tab === "profile" && <>
                <div className="card">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
                    <div style={{ position: "relative", cursor: editing ? "pointer" : "default" }} onClick={() => editing && ping("Rasm o'zgartirish...")}>
                      <div style={{ width: 76, height: 76, borderRadius: 20, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display, serif", fontSize: 26, color: "#fff", fontWeight: 700 }}>A</div>
                      {editing && <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(0,0,0,.38)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico k="cam" sz={18} col="#fff" /></div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.35em", color: "var(--text)" }}>{form.name}</div>
                      <div style={{ color: "var(--text3)", fontSize: ".85em", margin: "3px 0 10px" }}>alexarawles@gmail.com · {form.bio}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span className="badge badge-blue">Pro hisob</span>
                        <span className="badge badge-green">Faol</span>
                        <span className="badge badge-orange">Toshkent, UZ</span>
                      </div>
                    </div>
                    <div className="g3" style={{ minWidth: 240, gap: 10 }}>
                      {[["247", "Loyihalar"], ["1.2K", "Hamkorlar"], ["4.8★", "Reyting"]].map(([v, l]) => (
                        <div key={l} style={{ background: "var(--surface2)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--border)", textAlign: "center" }}>
                          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2em", color: "var(--text)" }}>{v}</div>
                          <div style={{ fontSize: ".75em", color: "var(--text3)", marginTop: 2 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="lbl">Shaxsiy ma'lumotlar</div>
                  <div className="g2">
                    {[["name","To'liq ism","text"],["nick","Laqab","text"],["phone","Telefon","tel"],["web","Vebsayt","url"]].map(([id,lbl,type]) => (
                      <div key={id}>
                        <div className="fl-lbl">{lbl}</div>
                        <input className="inp" type={type} disabled={!editing} value={form[id]} onChange={e => setForm(p=>({...p,[id]:e.target.value}))} />
                      </div>
                    ))}
                    {[
                      ["gender","Jinsi",[["","Tanlang"],["female","Ayol"],["male","Erkak"],["other","Boshqa"]]],
                      ["country","Mamlakat",[["uz","O'zbekiston 🇺🇿"],["ru","Rossiya 🇷🇺"],["us","AQSh 🇺🇸"],["de","Germaniya 🇩🇪"],["tr","Turkiya 🇹🇷"]]],
                      ["lang","Til",[["uz","O'zbek"],["ru","Rus"],["en","English"],["de","Deutsch"]]],
                      ["tz","Vaqt zonasi",[["asia/tashkent","Toshkent UTC+5"],["europe/moscow","Moskva UTC+3"],["utc","UTC+0"],["america/ny","New York UTC-5"]]],
                    ].map(([id,lbl,opts])=>(
                      <div key={id}>
                        <div className="fl-lbl">{lbl}</div>
                        <select className="inp" disabled={!editing} value={form[id]} onChange={e=>setForm(p=>({...p,[id]:e.target.value}))}>
                          {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                    ))}
                    <div style={{ gridColumn:"1/-1" }}>
                      <div className="fl-lbl">Bio</div>
                      <textarea className="inp" disabled={!editing} value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="lbl">Email manzillar</div>
                  {emails.map(em=>(
                    <div key={em.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"var(--surface2)",borderRadius:11,border:"1.5px solid var(--border)",marginBottom:8 }}>
                      <div style={{ width:34,height:34,borderRadius:9,background:accent+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <Ico k="mail" sz={14} col={accent} />
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:".9em",fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{em.addr}</div>
                        <div style={{ fontSize:".75em",color:"var(--text3)" }}>{em.verified?"✓ Tasdiqlangan":"Tasdiqlanmagan"}</div>
                      </div>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        {em.primary && <span className="badge badge-blue">Asosiy</span>}
                        {!em.verified && <button className="btn btn-outline btn-sm" onClick={()=>{ setEmails(p=>p.map(e=>e.id===em.id?{...e,verified:true}:e)); ping("✓ Email tasdiqlandi"); }}>Tasdiqlash</button>}
                        {!em.primary && <button className="btn btn-outline btn-sm" onClick={()=>{ setEmails(p=>p.filter(e=>e.id!==em.id)); ping("Email o'chirildi","#F59E0B"); }}>O'chirish</button>}
                      </div>
                    </div>
                  ))}
                  <button onClick={addEmail} style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 14px",borderRadius:10,border:"1.5px dashed var(--border2)",background:"transparent",color:accent,fontSize:".85em",fontWeight:700,cursor:"pointer",marginTop:4 }}>
                    <Ico k="plus" sz={13} col={accent} /> Email qo'shish
                  </button>
                </div>
              </>}

              {/* ══════ ACCOUNT ══════ */}
              {tab === "account" && <>
                <div className="card">
                  <div className="lbl">Hisob ma'lumotlari</div>
                  {[["Foydalanuvchi ID","#USR-48291"],["Ro'yxatdan o'tgan","07 Iyun 2022"],["Oxirgi kirish","Bugun 14:32"],["Tarif","Pro"],["Holat","Faol"],["Saqlash","68% (6.8 GB / 10 GB)"]].map(([l,v])=>(
                    <div key={l} className="row" style={{ borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontSize:".88em",color:"var(--text2)" }}>{l}</span>
                      <span style={{ fontSize:".88em",fontWeight:700,color:"var(--text)" }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="lbl">Interfeys tili</div>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    {[["uz","O'zbek 🇺🇿"],["ru","Русский 🇷🇺"],["en","English 🇬🇧"],["de","Deutsch 🇩🇪"],["tr","Türkçe 🇹🇷"]].map(([v,l])=>(
                      <div key={v} onClick={()=>{ setLangUI(v); ping(`✓ Til: ${l.split(" ")[0]}`); }}
                        style={{ padding:"8px 14px",borderRadius:10,border:`1.5px solid ${langUI===v?accent:"var(--border2)"}`,background:langUI===v?accent+"15":"var(--surface2)",color:langUI===v?accent:"var(--text2)",fontSize:".85em",cursor:"pointer",fontWeight:langUI===v?700:500,transition:"all .15s" }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ border:"1.5px solid rgba(239,68,68,.18)" }}>
                  <div className="lbl" style={{ color:"var(--danger)" }}>Xavfli zona</div>
                  {[["Ma'lumotlarni yuklab olish","Barcha ma'lumotlarni JSON formatda oling","#F59E0B"],
                    ["Hisobni muzlatish","Vaqtincha to'xtatish — istalgan vaqt tiklash mumkin","#F59E0B"],
                    ["Hisobni o'chirish","Bu amal qaytarib bo'lmaydi. Barcha ma'lumotlar yo'qoladi.","var(--danger)"]].map(([lbl,desc,col])=>(
                    <div key={lbl} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px",background:"var(--surface2)",borderRadius:11,border:"1.5px solid var(--border)",marginBottom:8 }}>
                      <div>
                        <div style={{ fontSize:".9em",fontWeight:700,color:col }}>{lbl}</div>
                        <div style={{ fontSize:".78em",color:"var(--text3)",marginTop:2 }}>{desc}</div>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={()=>ping(`${lbl}...`,"#F59E0B")}>{lbl.split(" ")[0]}</button>
                    </div>
                  ))}
                </div>
              </>}

              {/* ══════ SECURITY ══════ */}
              {tab === "security" && <>
                <div className="card">
                  <div className="lbl">Parolni o'zgartirish</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
                    <div>
                      <div className="fl-lbl">Joriy parol</div>
                      <input className="inp" type="password" placeholder="••••••••" value={curP} onChange={e=>setCurP(e.target.value)} />
                    </div>
                    <div>
                      <div className="fl-lbl">Yangi parol</div>
                      <input className="inp" type="password" placeholder="••••••••" value={newP} onChange={e=>checkStr(e.target.value)} />
                      {newP && <>
                        <div className="s-bars">
                          {[1,2,3,4].map(i=><div key={i} className="s-bar" style={{ background: i<=pStr?strC[pStr]:undefined }} />)}
                        </div>
                        <div style={{ fontSize:".78em",color:strC[pStr],marginTop:4,fontWeight:600 }}>{strL[pStr]}</div>
                      </>}
                    </div>
                    <div>
                      <div className="fl-lbl">Parolni tasdiqlang</div>
                      <input className="inp" type="password" placeholder="••••••••" value={cfP} onChange={e=>setCfP(e.target.value)} style={{ borderColor: cfP&&cfP!==newP?"var(--danger)":undefined }} />
                      {cfP&&cfP!==newP&&<div style={{ fontSize:".78em",color:"var(--danger)",marginTop:4 }}>Parollar mos kelmaydi</div>}
                    </div>
                    <div style={{ display:"flex",gap:8 }}>
                      <button className="btn btn-primary" onClick={()=>{ if(!curP){ping("Joriy parolni kiriting","#F59E0B");return;} if(newP!==cfP){ping("Parollar mos kelmaydi","#EF4444");return;} if(newP.length<8){ping("Juda qisqa","#F59E0B");return;} setCurP("");setNewP("");setCfP("");setPStr(0);ping("✓ Parol o'zgartirildi"); }}>O'zgartirish</button>
                      <button className="btn btn-outline" onClick={()=>{setCurP("");setNewP("");setCfP("");setPStr(0);}}>Tozalash</button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <Row label="Ikki bosqichli autentifikatsiya (2FA)" desc="SMS yoki authenticator app orqali" right={<Tog on={twoFA} set={v=>{setTwoFA(v);ping(v?"✓ 2FA yoqildi":"2FA o'chirildi",v?"#22C55E":"#F59E0B");}} />} />
                  {twoFA && (
                    <div style={{ marginTop:12,padding:"12px",background:"var(--success-soft)",borderRadius:10,border:"1px solid rgba(34,197,94,.2)" }}>
                      <div style={{ fontSize:".85em",color:"#15803D",fontWeight:700 }}>✓ 2FA faol — SMS orqali tasdiqlash yoqilgan</div>
                      <div style={{ display:"flex",gap:8,marginTop:10 }}>
                        <button className="btn btn-outline btn-sm" onClick={()=>ping("Backup kodlar ko'chirildi")}>Backup kodlar</button>
                        <button className="btn btn-outline btn-sm" onClick={()=>ping("Authenticator sozlash...")}>App sozlash</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card">
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                    <div className="lbl" style={{ marginBottom:0 }}>Faol sessiyalar ({sessions.length})</div>
                    <button className="btn btn-outline btn-sm" onClick={()=>{setSessions(p=>p.filter(s=>s.active));ping("Barcha sessiyalar tugatildi","#F59E0B");}}>Barchasini tugatish</button>
                  </div>
                  {sessions.map(s=>(
                    <div key={s.id} className="row">
                      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                        <div style={{ width:8,height:8,borderRadius:"50%",background:s.active?"var(--success)":"var(--border2)",flexShrink:0 }} />
                        <div>
                          <div style={{ fontSize:".88em",fontWeight:700,color:"var(--text)" }}>{s.dev}</div>
                          <div style={{ fontSize:".76em",color:"var(--text3)" }}>{s.loc} · {s.t}</div>
                        </div>
                      </div>
                      {s.active ? <span className="badge badge-green">Joriy</span>
                        : <button className="btn btn-danger btn-sm" onClick={()=>{setSessions(p=>p.filter(x=>x.id!==s.id));ping("Sessiya tugatildi","#F59E0B");}}>Tugatish</button>}
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="lbl">So'nggi kirish tarixi</div>
                  {[{t:"Bugun 14:32",l:"Toshkent, UZ",ok:true},{t:"Kecha 21:14",l:"Toshkent, UZ",ok:true},{t:"3 kun oldin",l:"Moskva, RU",ok:false},{t:"1 hafta oldin",l:"Toshkent, UZ",ok:true}].map((x,i)=>(
                    <div key={i} className="row">
                      <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                        <div style={{ width:7,height:7,borderRadius:"50%",background:x.ok?"var(--success)":"var(--warn)" }} />
                        <div>
                          <div style={{ fontSize:".88em",fontWeight:600,color:"var(--text)" }}>{x.t}</div>
                          <div style={{ fontSize:".76em",color:"var(--text3)" }}>{x.l}</div>
                        </div>
                      </div>
                      <span className={`badge ${x.ok?"badge-green":"badge-orange"}`}>{x.ok?"Muvaffaqiyatli":"Shubhali"}</span>
                    </div>
                  ))}
                </div>
              </>}

              {/* ══════ NOTIFICATIONS ══════ */}
              {tab === "notifications" && <>
                <div className="card">
                  <div className="lbl">Bildirishnoma kanallari</div>
                  {[{id:"email",lbl:"Email bildirishnomalar",desc:"Muhim yangiliklar emailga yuborilsin"},
                    {id:"push",lbl:"Push bildirishnomalar",desc:"Brauzer orqali real-vaqt xabarlari"},
                    {id:"sms",lbl:"SMS bildirishnomalar",desc:"+998 90 123 45 67 ga SMS xabarlari"},
                  ].map(n=>(
                    <Row key={n.id} label={n.lbl} desc={n.desc} right={<Tog on={notifs[n.id]} set={v=>{setNotifs(p=>({...p,[n.id]:v}));ping(v?`✓ ${n.lbl} yoqildi`:`${n.lbl} o'chirildi`,v?"#22C55E":"#F59E0B");}} />} />
                  ))}
                </div>
                <div className="card">
                  <div className="lbl">Bildirishnoma turlari</div>
                  {[{id:"security",lbl:"Xavfsizlik ogohlantirishlari",desc:"Kirish urinishlari, parol o'zgarishi",imp:true},
                    {id:"updates",lbl:"Mahsulot yangilanishlari",desc:"Yangi funksiyalar va yaxshilanishlar"},
                    {id:"marketing",lbl:"Marketing va takliflar",desc:"Maxsus chegirmalar va yangiliklar"},
                    {id:"weekly",lbl:"Haftalik hisobot",desc:"Faollik va statistika xulasasi"},
                    {id:"mentions",lbl:"Eslatmalar va teglar",desc:"Siz eslatilganingizda xabar olish"},
                  ].map(n=>(
                    <Row key={n.id} label={<span style={{ display:"flex",alignItems:"center",gap:6 }}>{n.lbl}{n.imp&&<span className="badge badge-red" style={{ fontSize:".7em" }}>Muhim</span>}</span>} desc={n.desc} right={<Tog on={notifs[n.id]} set={v=>{setNotifs(p=>({...p,[n.id]:v}));ping(v?`✓ ${n.lbl} yoqildi`:`${n.lbl} o'chirildi`,v?"#22C55E":"#F59E0B");}} />} />
                  ))}
                </div>
                <div className="card">
                  <div className="lbl">Jim rejim (bildirishnomalar o'chiriladi)</div>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    {["22:00–08:00","Tushlik 12–13","Dam olish kunlari","Butunlay"].map(t=>(
                      <div key={t} onClick={()=>ping(`Jim rejim: ${t}`)} style={{ padding:"8px 14px",borderRadius:10,border:"1.5px solid var(--border2)",background:"var(--surface2)",color:"var(--text2)",fontSize:".85em",cursor:"pointer",fontWeight:500,transition:"all .15s" }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color=accent;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)";}}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </>}

              {/* ══════ PRIVACY ══════ */}
              {tab === "privacy" && <>
                <div className="card">
                  <div className="lbl">Profil ko'rinishi</div>
                  {[{id:"pub",lbl:"Profilni ochiq qilish",desc:"Boshqalar profilingizni ko'radi"},
                    {id:"showEmail",lbl:"Emailni ko'rsatish",desc:"Profilingizda email ko'rinsin"},
                    {id:"online",lbl:"Online holatni ko'rsatish",desc:"Faol/nofaol holatingiz ko'rinsin"},
                    {id:"search",lbl:"Qidiruvda topilish",desc:"Qidiruv natijalarida ko'rinsin"},
                    {id:"read",lbl:"O'qildi belgisi",desc:"Xabar o'qilganligini ko'rsatish"},
                    {id:"data",lbl:"Anonim statistika yuborish",desc:"Mahsulotni yaxshilash uchun"},
                  ].map(p=>(
                    <Row key={p.id} label={p.lbl} desc={p.desc} right={<Tog on={priv[p.id]} set={v=>{setPriv(pr=>({...pr,[p.id]:v}));ping(v?`✓ ${p.lbl} yoqildi`:`${p.lbl} o'chirildi`,v?"#22C55E":"#F59E0B");}} />} />
                  ))}
                </div>
                <div className="card">
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                    <div className="lbl" style={{ marginBottom:0 }}>Ulangan ilovalar</div>
                    <button className="btn btn-primary btn-sm" onClick={()=>ping("Yangi ilova qidirish...")}>+ Ulash</button>
                  </div>
                  {apps.map(a=>(
                    <div key={a.id} className="app-chip">
                      <div className="app-chip-ico">{a.ico}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:".88em",fontWeight:700,color:"var(--text)" }}>{a.name}</div>
                        <div style={{ fontSize:".76em",color:"var(--text3)" }}>{a.scope}</div>
                      </div>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        {a.on && <span className="badge badge-green">Ulangan</span>}
                        <button className={`btn btn-sm ${a.on?"btn-danger":"btn-outline"}`}
                          onClick={()=>{setApps(p=>p.map(x=>x.id===a.id?{...x,on:!x.on}:x));ping(a.on?`${a.name} uzildi`:`✓ ${a.name} ulandi`,a.on?"#F59E0B":"#22C55E");}}>
                          {a.on?"Uzish":"Ulash"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>}

              {/* ══════ APPEARANCE ══════ */}
              {tab === "appearance" && <>
                <div className="card">
                  <div className="lbl">Mavzu (Tema)</div>
                  <div style={{ display:"flex",gap:10 }}>
                    {[["light","Yorug' 🌤","sun"],["dark","Qorong'u 🌙","moon"],["system","Tizim 💻","monitor"]].map(([v,l,ic])=>(
                      <div key={v} onClick={()=>{setTheme(v);ping(`✓ Mavzu: ${l.split(" ")[0]}`);}}
                        style={{ flex:1,padding:"14px 12px",borderRadius:12,border:`1.5px solid ${theme===v?accent:"var(--border2)"}`,background:theme===v?accent+"14":"var(--surface2)",cursor:"pointer",textAlign:"center",transition:"all .15s" }}>
                        <div style={{ display:"flex",justifyContent:"center",marginBottom:8 }}><Ico k={ic} sz={20} col={theme===v?accent:"var(--text3)"} /></div>
                        <div style={{ fontSize:".85em",fontWeight:theme===v?700:500,color:theme===v?accent:"var(--text2)" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="lbl">Asosiy rang</div>
                  <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:16 }}>
                    {ACCENTS.map(c=>(
                      <div key={c.hex} title={c.name} className={`swatch ${accent===c.hex?"sel":""}`} style={{ background:c.hex }}
                        onClick={()=>{setAccent(c.hex);setCustomAccent(c.hex);ping(`✓ Rang: ${c.name}`);}} />
                    ))}
                  </div>
                  <div>
                    <div className="fl-lbl">Maxsus rang (color picker)</div>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <input type="color" value={customAccent}
                        onChange={e=>{setCustomAccent(e.target.value);setAccent(e.target.value);}}
                        style={{ width:48,height:40,borderRadius:10,border:"1.5px solid var(--border2)",background:"none",cursor:"pointer",padding:3 }} />
                      <div style={{ fontFamily:"'Courier New',monospace",fontSize:".85em",color:"var(--text2)",background:"var(--surface2)",padding:"8px 12px",borderRadius:9,border:"1px solid var(--border)" }}>{customAccent}</div>
                      <div style={{ width:40,height:40,borderRadius:10,background:customAccent,flexShrink:0,border:"1.5px solid var(--border2)" }} />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="lbl">Matn o'lchami (font size)</div>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    {FONT_SIZES.map(f=>(
                      <div key={f.id} onClick={()=>{setFontSize(f.id);ping(`✓ Matn o'lchami: ${f.px}`);}}
                        style={{ flex:1,minWidth:60,padding:"12px 8px",borderRadius:12,border:`1.5px solid ${fontSize===f.id?accent:"var(--border2)"}`,background:fontSize===f.id?accent+"14":"var(--surface2)",cursor:"pointer",textAlign:"center",transition:"all .15s" }}>
                        <div style={{ fontFamily:"Playfair Display,serif",fontSize:f.px,color:fontSize===f.id?accent:"var(--text2)",fontWeight:700,lineHeight:1 }}>{f.label}</div>
                        <div style={{ fontSize:"10px",color:"var(--text3)",marginTop:5 }}>{f.px}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:14,padding:"12px 14px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:".8em",color:"var(--text3)",marginBottom:4 }}>Namuna matn:</div>
                    <div style={{ color:"var(--text)" }}>Salom! Bu matning joriy o'lchami: <strong style={{ color:accent }}>{FONT_SIZES.find(f=>f.id===fontSize)?.px}</strong></div>
                  </div>
                </div>

                <div className="card">
                  <div className="lbl">Qo'shimcha</div>
                  <Row label="Ixcham rejim" desc="Elementlar orasidagi bo'shliqni kamaytirish" right={<Tog on={compact} set={v=>{setCompact(v);ping(v?"✓ Ixcham rejim yoqildi":"Ixcham rejim o'chirildi",v?"#22C55E":"#F59E0B");}} />} />
                  <Row label="Animatsiyalar va effektlar" desc="Silliq o'tishlar, hover effektlar" right={<Tog on={animations} set={v=>{setAnimations(v);ping(v?"✓ Animatsiyalar yoqildi":"Animatsiyalar o'chirildi",v?"#22C55E":"#F59E0B");}} />} />
                </div>
              </>}

              {/* ══════ BILLING ══════ */}
              {tab === "billing" && <>
                <div className="plan-card">
                  <div style={{ position:"relative",zIndex:1 }}>
                    <div style={{ fontSize:".8em",fontWeight:800,letterSpacing:1,textTransform:"uppercase",opacity:.75,marginBottom:8 }}>Joriy tarif</div>
                    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
                      <div>
                        <div style={{ fontFamily:"Playfair Display,serif",fontSize:"2em",fontWeight:700 }}>Pro</div>
                        <div style={{ opacity:.8,marginTop:3 }}>$12 / oy · Keyingi to'lov: 15 May 2026</div>
                      </div>
                      <div style={{ display:"flex",gap:8 }}>
                        <button className="btn" style={{ background:"rgba(255,255,255,.18)",color:"#fff",border:"1.5px solid rgba(255,255,255,.35)",padding:"8px 16px",fontFamily:"Nunito,sans-serif",fontWeight:700,borderRadius:10,cursor:"pointer" }} onClick={()=>ping("Tarifni o'zgartirish...")}>O'zgartirish</button>
                        <button className="btn" style={{ background:"transparent",color:"rgba(255,255,255,.7)",border:"1.5px solid rgba(255,255,255,.2)",padding:"8px 16px",fontFamily:"Nunito,sans-serif",fontWeight:700,borderRadius:10,cursor:"pointer" }} onClick={()=>ping("Bekor qilish so'rovi...")}>Bekor qilish</button>
                      </div>
                    </div>
                    <div style={{ marginTop:18,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                      {[["Saqlash",plan.stor,"6.8 GB / 10 GB"],["Kenglik",plan.bw,"42 GB / 100 GB"]].map(([l,v,sub])=>(
                        <div key={l}>
                          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                            <span style={{ fontSize:".82em",opacity:.75 }}>{l}</span>
                            <span style={{ fontSize:".82em",opacity:.9,fontWeight:700 }}>{v}%</span>
                          </div>
                          <div style={{ height:7,background:"rgba(255,255,255,.2)",borderRadius:4 }}>
                            <div style={{ width:`${v}%`,height:"100%",borderRadius:4,background:"rgba(255,255,255,.8)" }} />
                          </div>
                          <div style={{ fontSize:".72em",opacity:.6,marginTop:3 }}>{sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                    <div className="lbl" style={{ marginBottom:0 }}>To'lov usullari</div>
                    <button className="btn btn-primary btn-sm" onClick={()=>ping("Karta qo'shish...")}>+ Karta qo'shish</button>
                  </div>
                  {[{type:"VISA",n:"4242",exp:"12/27",primary:true,col:"#1A1F71"},{type:"MC",n:"8891",exp:"06/26",primary:false,col:"#EB001B"}].map(c=>(
                    <div key={c.n} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"var(--surface2)",borderRadius:12,border:"1.5px solid var(--border)",marginBottom:8 }}>
                      <div style={{ width:46,height:30,borderRadius:7,background:c.col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:900,letterSpacing:.5,flexShrink:0 }}>{c.type}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:".9em",fontWeight:700,color:"var(--text)" }}>•••• •••• •••• {c.n}</div>
                        <div style={{ fontSize:".76em",color:"var(--text3)" }}>Muddati: {c.exp}</div>
                      </div>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        {c.primary && <span className="badge badge-blue">Asosiy</span>}
                        {!c.primary && <button className="btn btn-outline btn-sm" onClick={()=>ping("Asosiy karta o'zgartirildi")}>Asosiy qilish</button>}
                        <button className="btn btn-danger btn-sm" onClick={()=>ping("Karta o'chirildi","#F59E0B")}>O'chirish</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                    <div className="lbl" style={{ marginBottom:0 }}>To'lov tarixi</div>
                    <button className="btn btn-outline btn-sm" onClick={()=>ping("Barcha hisoblar yuklab olindi")}>Barchasini yuklab olish</button>
                  </div>
                  {[{d:"15 Apr 2026",a:"$12.00",inv:"INV-2026-04"},{d:"15 Mar 2026",a:"$12.00",inv:"INV-2026-03"},{d:"15 Feb 2026",a:"$12.00",inv:"INV-2026-02"},{d:"15 Jan 2026",a:"$12.00",inv:"INV-2026-01"}].map(p=>(
                    <div key={p.inv} className="row">
                      <div>
                        <div style={{ fontSize:".88em",fontWeight:700,color:"var(--text)" }}>{p.d}</div>
                        <div style={{ fontSize:".76em",color:"var(--text3)" }}>{p.inv}</div>
                      </div>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <span style={{ fontSize:".9em",fontWeight:800,color:"var(--text)" }}>{p.a}</span>
                        <span className="badge badge-green">To'langan</span>
                        <button className="btn btn-outline btn-sm" onClick={()=>ping(`${p.inv} yuklab olindi`)}>PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>}

              {/* ══════ INTEGRATIONS ══════ */}
              {tab === "integrations" && <>
                <div className="card">
                  <div className="lbl">API kaliti</div>
                  <div style={{ marginBottom:14 }}>
                    <div className="fl-lbl">Ishlab chiqarish kaliti</div>
                    <div style={{ display:"flex",gap:8 }}>
                      <div className="mono" style={{ flex:1 }}>{apiVis?"sk_live_xxxx_xxxx_xxxx_xxxx_xxxx_4a2f":"sk_live_•••••••••••••••••••••••••••••••4a2f"}</div>
                      <button className="btn btn-outline btn-sm" onClick={()=>setApiVis(v=>!v)}>{apiVis?"Yashirish":"Ko'rish"}</button>
                      <button className="btn btn-outline btn-sm" onClick={()=>{navigator.clipboard?.writeText("sk_live_actual").catch(()=>{});ping("✓ Nusxalandi");}}>Nusxa</button>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <button className="btn btn-primary" onClick={()=>ping("✓ Yangi kalit yaratildi")}>Yangi kalit yaratish</button>
                    <button className="btn btn-danger" onClick={()=>ping("Kalit o'chirildi","#F59E0B")}>Kalitni o'chirish</button>
                  </div>
                </div>

                <div className="card">
                  <div className="lbl">Webhook</div>
                  <div style={{ marginBottom:12 }}>
                    <div className="fl-lbl">Webhook URL</div>
                    <div style={{ display:"flex",gap:8 }}>
                      <input className="inp" value={wh} onChange={e=>setWh(e.target.value)} placeholder="https://your-app.com/webhook" style={{ flex:1 }} />
                      <button className="btn btn-primary" onClick={()=>ping("✓ Webhook saqlandi")}>Saqlash</button>
                    </div>
                  </div>
                  <div>
                    <div className="fl-lbl">Yuborilishi kerak hodisalar:</div>
                    <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                      {["user.login","user.update","payment.success","payment.failed","session.end","data.export"].map(ev=>(
                        <div key={ev} onClick={()=>ping(`✓ ${ev} tanlandi`)}
                          style={{ padding:"5px 11px",borderRadius:20,border:"1.5px solid var(--border2)",background:"var(--surface2)",color:"var(--text2)",fontSize:".78em",cursor:"pointer",fontFamily:"'Courier New',monospace",transition:"all .15s" }}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color=accent;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)";}}>
                          {ev}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="lbl">Uchinchi tomon ilovalar</div>
                  {[{n:"Zapier",ico:"⚡",desc:"Ish jarayonlarini avtomatlashtirish",on:true},{n:"Stripe",ico:"💳",desc:"To'lov tizimi integratsiyasi",on:true},{n:"Airtable",ico:"📊",desc:"Ma'lumotlar sinxronizatsiyasi",on:false},{n:"SendGrid",ico:"📧",desc:"Transaksion email xizmati",on:false}].map(a=>(
                    <div key={a.n} className="app-chip">
                      <div className="app-chip-ico">{a.ico}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:".88em",fontWeight:700,color:"var(--text)" }}>{a.n}</div>
                        <div style={{ fontSize:".76em",color:"var(--text3)" }}>{a.desc}</div>
                      </div>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        {a.on && <span className="badge badge-green">Ulangan</span>}
                        <button className={`btn btn-sm ${a.on?"btn-danger":"btn-outline"}`} onClick={()=>ping(a.on?`${a.n} uzildi`:`✓ ${a.n} ulandi`,a.on?"#F59E0B":"#22C55E")}>{a.on?"Uzish":"Ulash"}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>}

            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className={`toast ${toast.on?"on":""}`}>
        <div className="t-dot" style={{ background:toast.col }} />
        {toast.msg}
      </div>
    </>
  );
}