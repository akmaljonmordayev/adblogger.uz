import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SEO from "../components/SEO";
import { LuEye, LuEyeOff, LuArrowLeft, LuCheck, LuLoader } from "react-icons/lu";
import { toast } from "../components/ui/toast";
import { useAuthStore } from "../store/useAuthStore";

const S = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#fff5f5 0%,#ffffff 50%,#fef9f0 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px 16px", fontFamily: "'Inter',sans-serif",
    position: "relative", overflow: "hidden",
  },
  card: {
    background: "#fff",
    borderRadius: 24,
    border: "1.5px solid #f1f5f9",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    width: "100%", maxWidth: 420,
    position: "relative", zIndex: 1,
  },
  input: {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #e2e8f0", borderRadius: 11,
    fontSize: 14, color: "#0f172a", outline: "none",
    background: "#fff", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color .2s, box-shadow .2s",
  },
  label: {
    fontSize: 13, fontWeight: 600, color: "#374151",
    display: "block", marginBottom: 6,
  },
  btn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg,#dc2626,#b91c1c)",
    color: "#fff", fontSize: 14, fontWeight: 700,
    border: "none", borderRadius: 12, cursor: "pointer",
    boxShadow: "0 4px 18px rgba(220,38,38,.28)",
    transition: "transform .18s, box-shadow .18s",
    fontFamily: "inherit",
  },
};

function InputField({ label, type = "text", placeholder, value, onChange, icon }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && show ? "text" : type;

  return (
    <div>
      <label style={S.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ ...S.input, paddingRight: isPassword ? 42 : 14 }}
          onFocus={e => {
            e.target.style.borderColor = "#dc2626";
            e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,.08)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#94a3b8", display: "flex", alignItems: "center", padding: 0,
            }}
          >
            {show ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Auth() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { login: loginFn, register: registerFn } = useAuthStore();

  const defaultTab = location.pathname === "/register" ? "register" : "login";
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState({ email: "", password: "" });
  const [reg,   setReg]   = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", role: "user",
  });

  const setL = (k, v) => setLogin(p => ({ ...p, [k]: v }));
  const setR = (k, v) => setReg(p => ({ ...p, [k]: v }));

  const handleTab = (t) => {
    setTab(t);
    navigate(t === "login" ? "/login" : "/register", { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!login.email || !login.password) {
      toast.error("Email va parolni kiriting");
      return;
    }
    setLoading(true);
    try {
      const user = await loginFn({ email: login.email, password: login.password });
      toast.success(`Xush kelibsiz, ${user.firstName}!`);
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Kirish xatosi");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!reg.firstName || !reg.email || !reg.password) {
      toast.error("Majburiy maydonlarni to'ldiring");
      return;
    }
    if (reg.password.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    setLoading(true);
    try {
      const user = await registerFn({
        firstName: reg.firstName,
        lastName:  reg.lastName,
        email:     reg.email,
        phone:     reg.phone,
        password:  reg.password,
        role:      reg.role === "brand" ? "business" : reg.role || "user",
      });
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Ro'yxatdan o'tish xatosi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <SEO title="Kirish / Ro'yxatdan O'tish" noindex />
      <style>{`
        .auth-card { padding: 36px 32px; }

        @media (max-width: 480px) {
          .auth-card            { padding: 28px 20px; border-radius: 18px !important; }
          .auth-name-row        { grid-template-columns: 1fr !important; }
          .auth-role-row        { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* bg blobs */}
      <div style={{
        position:"fixed", top:"-10%", right:"-5%",
        width:320, height:320, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(220,38,38,.07) 0%,transparent 70%)",
        filter:"blur(40px)", pointerEvents:"none",
      }}/>
      <div style={{
        position:"fixed", bottom:"5%", left:"-8%",
        width:280, height:280, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,115,22,.06) 0%,transparent 70%)",
        filter:"blur(40px)", pointerEvents:"none",
      }}/>

      <div className="auth-card" style={{ ...S.card }}>

        {/* Logo */}
        <Link to="/" style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:8, textDecoration:"none", marginBottom:24,
        }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff4b2b"/>
                <stop offset="100%" stopColor="#c0392b"/>
              </linearGradient>
            </defs>
            <rect width="36" height="36" rx="10" fill="url(#ag)"/>
            <rect width="36" height="18" rx="10" fill="rgba(255,255,255,0.18)"/>
            <path d="M9 22C9 14 27 14 27 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".35"/>
            <path d="M12 22C12 16.5 24 16.5 24 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6"/>
            <path d="M15 22C15 19 21 19 21 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".9"/>
            <circle cx="18" cy="24" r="2.2" fill="white"/>
            <text x="18" y="11" textAnchor="middle" fill="white" style={{fontSize:7,fontWeight:800,fontFamily:"sans-serif",letterSpacing:"0.5px"}}>AD</text>
          </svg>
          <span style={{fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, lineHeight:1, letterSpacing:"-0.5px"}}>
            <span style={{color:"#dc2626"}}>ad</span>
            <span style={{color:"#111827"}}>blo</span>
            <span style={{color:"#dc2626"}}>gg</span>
            <span style={{color:"#111827"}}>er</span>
          </span>
        </Link>

        {/* Tabs */}
        <div style={{
          display:"flex", background:"#f8fafc",
          borderRadius:12, padding:4, marginBottom:28,
          border:"1px solid #f1f5f9",
        }}>
          {[
            { id:"login",    label:"Kirish" },
            { id:"register", label:"Ro'yxatdan o'tish" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleTab(t.id)}
              style={{
                flex:1, padding:"10px 8px", borderRadius:9,
                border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                transition:"all .2s",
                background: tab === t.id ? "#fff" : "transparent",
                color:       tab === t.id ? "#dc2626" : "#94a3b8",
                boxShadow:   tab === t.id ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                fontFamily:"inherit",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {tab === "login" && (
          <form
            onSubmit={handleLogin}
            style={{ display:"flex", flexDirection:"column", gap:16 }}
          >
            <InputField
              label="Email"
              placeholder="email@example.com"
              value={login.email}
              onChange={e => setL("email", e.target.value)}
            />
            <InputField
              label="Parol"
              type="password"
              placeholder="Parolni kiriting"
              value={login.password}
              onChange={e => setL("password", e.target.value)}
            />

            <div style={{ textAlign:"right", marginTop:-6 }}>
              <span style={{ fontSize:12.5, color:"#dc2626", cursor:"pointer", fontWeight:600 }}>
                Parolni unutdingizmi?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...S.btn, opacity: loading ? 0.7 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              onMouseEnter={e => { if(!loading){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(220,38,38,.35)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 18px rgba(220,38,38,.28)"; }}
            >
              {loading ? <LuLoader size={16} style={{animation:"spin 1s linear infinite"}} /> : null}
              {loading ? "Kirish..." : "Kirish"}
            </button>

            <div style={{ textAlign:"center", fontSize:13, color:"#94a3b8" }}>
              Hisobingiz yo'qmi?{" "}
              <span
                onClick={() => handleTab("register")}
                style={{ color:"#dc2626", fontWeight:700, cursor:"pointer" }}
              >
                Ro'yxatdan o'ting
              </span>
            </div>
          </form>
        )}

        {/* ── REGISTER ── */}
        {tab === "register" && (
          <form
            onSubmit={handleRegister}
            style={{ display:"flex", flexDirection:"column", gap:14 }}
          >
            {/* Role selector */}
            <div className="auth-role-row" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:2 }}>
              {[
                { val:"brand",   emoji:"🏢", label:"Biznes / Brend" },
                { val:"blogger", emoji:"📲", label:"Bloger" },
              ].map(r => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setR("role", r.val)}
                  style={{
                    padding:"11px 8px", borderRadius:11, cursor:"pointer",
                    border:`1.5px solid ${reg.role===r.val ? "#dc2626" : "#e2e8f0"}`,
                    background: reg.role===r.val ? "#fef2f2" : "#fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    gap:6, fontSize:13, fontWeight:600, transition:"all .18s",
                    color: reg.role===r.val ? "#dc2626" : "#64748b",
                    fontFamily:"inherit",
                  }}
                >
                  {reg.role===r.val && (
                    <LuCheck size={13} strokeWidth={3} style={{color:"#dc2626"}} />
                  )}
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>

            <div className="auth-name-row" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <InputField label="Ism" placeholder="Ismingiz" value={reg.firstName} onChange={e => setR("firstName", e.target.value)} />
              <InputField label="Familiya" placeholder="Familiya" value={reg.lastName} onChange={e => setR("lastName", e.target.value)} />
            </div>

            <InputField label="Email" placeholder="email@example.com" value={reg.email} onChange={e => setR("email", e.target.value)} />

            <InputField label="Telefon" placeholder="+998 90 000 00 00" value={reg.phone} onChange={e => setR("phone", e.target.value)} />

            <InputField label="Parol" type="password" placeholder="Kamida 8 ta belgi" value={reg.password} onChange={e => setR("password", e.target.value)} />

            <button
              type="submit"
              disabled={loading}
              style={{ ...S.btn, marginTop:4, opacity: loading ? 0.7 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              onMouseEnter={e => { if(!loading){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(220,38,38,.35)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 18px rgba(220,38,38,.28)"; }}
            >
              {loading ? <LuLoader size={16} style={{animation:"spin 1s linear infinite"}} /> : null}
              {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
            </button>

            <div style={{ textAlign:"center", fontSize:13, color:"#94a3b8" }}>
              Hisobingiz bormi?{" "}
              <span
                onClick={() => handleTab("login")}
                style={{ color:"#dc2626", fontWeight:700, cursor:"pointer" }}
              >
                Kirish
              </span>
            </div>

            <p style={{ fontSize:11.5, color:"#cbd5e1", textAlign:"center", lineHeight:1.7, margin:0 }}>
              Ro'yxatdan o'tish orqali{" "}
              <Link to="/terms" style={{color:"#94a3b8"}}>shartlar</Link> va{" "}
              <Link to="/privacy" style={{color:"#94a3b8"}}>maxfiylik siyosati</Link>ga rozilik bildirasiz.
            </p>
          </form>
        )}

        {/* Back link */}
        <div style={{ marginTop:20, textAlign:"center" }}>
          <Link to="/" style={{
            display:"inline-flex", alignItems:"center", gap:5,
            fontSize:12.5, color:"#94a3b8", textDecoration:"none",
            transition:"color .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color="#dc2626"}
            onMouseLeave={e => e.currentTarget.style.color="#94a3b8"}
          >
            <LuArrowLeft size={13} /> Bosh sahifaga qaytish
          </Link>
        </div>

      </div>
    </div>
  );
}
