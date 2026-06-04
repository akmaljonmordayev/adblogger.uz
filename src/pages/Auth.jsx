import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SEO from "../components/SEO";
import { LuEye, LuEyeOff, LuArrowLeft, LuCheck, LuLoader } from "react-icons/lu";
import { toast } from "../components/ui/toast";
import { useAuthStore } from "../store/useAuthStore";

/* ─── Styles ─────────────────────────────────────────────────────── */
const S = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#fff5f5 0%,#ffffff 50%,#fef9f0 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px 16px", fontFamily: "'Inter',sans-serif",
    position: "relative", overflow: "hidden",
  },
  card: {
    background: "#fff", borderRadius: 24,
    border: "1.5px solid #f1f5f9",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    width: "100%", maxWidth: 420,
    position: "relative", zIndex: 1,
  },
  input: (hasError) => ({
    width: "100%", padding: "12px 14px",
    border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: 11, fontSize: 14, color: "#0f172a", outline: "none",
    background: hasError ? "#fff5f5" : "#fff",
    boxSizing: "border-box", fontFamily: "inherit",
    transition: "border-color .2s, box-shadow .2s",
  }),
  label: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 },
  errMsg: { fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 500 },
  btn: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg,#dc2626,#b91c1c)",
    color: "#fff", fontSize: 14, fontWeight: 700,
    border: "none", borderRadius: 12, cursor: "pointer",
    boxShadow: "0 4px 18px rgba(220,38,38,.28)",
    transition: "transform .18s, box-shadow .18s",
    fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
};

/* ─── Schemas ────────────────────────────────────────────────────── */
const loginSchema = yup.object({
  email:    yup.string().email("Email noto'g'ri").required("Email kiritilishi shart"),
  password: yup.string().required("Parol kiritilishi shart"),
});

const registerSchema = yup.object({
  role: yup.string()
    .oneOf(["brand", "blogger"], "Rolni tanlang: Blogger yoki Biznes/Brend")
    .required("Rolni tanlang"),
  firstName: yup.string().trim().required("Ism kiritilishi shart"),
  lastName:  yup.string().trim().default(""),
  email:     yup.string().email("Email noto'g'ri").required("Email kiritilishi shart"),
  phone:     yup.string().default(""),
  password:  yup.string()
    .min(6, "Parol kamida 6 ta belgi bo'lishi kerak")
    .required("Parol kiritilishi shart"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Parollar mos kelmadi")
    .required("Parolni tasdiqlang"),
  platform: yup.string().when("role", {
    is: "blogger",
    then: s => s.required("Platformani tanlang"),
    otherwise: s => s.default(""),
  }),
  followers: yup.string().when("role", {
    is: "blogger",
    then: s => s.required("Obunachilar sonini kiriting"),
    otherwise: s => s.default(""),
  }),
  category: yup.string().default(""),
});

/* ─── UI components ──────────────────────────────────────────────── */
function InputField({ label, type = "text", placeholder, error, ...inputProps }) {
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
          style={{ ...S.input(!!error), paddingRight: isPassword ? 42 : 14 }}
          {...inputProps}
          onFocus={e => {
            e.target.style.borderColor = "#dc2626";
            e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,.08)";
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0";
            e.target.style.boxShadow = "none";
            inputProps.onBlur?.(e);
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(v => !v)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", display: "flex", alignItems: "center", padding: 0,
          }}>
            {show ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>
        )}
      </div>
      {error && <p style={S.errMsg}>{error}</p>}
    </div>
  );
}

function SelectField({ label, error, children, ...selectProps }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      <select
        style={{
          ...S.input(!!error),
          color: selectProps.value ? "#0f172a" : "#94a3b8",
          cursor: "pointer", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
        }}
        {...selectProps}
        onFocus={e => {
          e.target.style.borderColor = "#dc2626";
          e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,.08)";
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0";
          e.target.style.boxShadow = "none";
          selectProps.onBlur?.(e);
        }}
      >
        {children}
      </select>
      {error && <p style={S.errMsg}>{error}</p>}
    </div>
  );
}

/* ─── LoginForm ──────────────────────────────────────────────────── */
function LoginForm({ onSwitchTab }) {
  const navigate = useNavigate();
  const { login: loginFn } = useAuthStore();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await loginFn({ email: data.email, password: data.password });
      toast.success(`Xush kelibsiz, ${user.firstName}!`);
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Email yoki parol noto'g'ri";
      setError("root", { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
      <InputField
        label="Email" placeholder="email@example.com"
        error={errors.email?.message} {...register("email")}
      />
      <InputField
        label="Parol" type="password" placeholder="Parolni kiriting"
        error={errors.password?.message} {...register("password")}
      />

      <div style={{ textAlign: "right", marginTop: -6 }}>
        <span style={{ fontSize: 12.5, color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>
          Parolni unutdingizmi?
        </span>
      </div>

      {errors.root && (
        <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px" }}>
          <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontWeight: 500 }}>{errors.root.message}</p>
        </div>
      )}

      <button
        type="submit" disabled={isSubmitting}
        style={{ ...S.btn, opacity: isSubmitting ? 0.7 : 1 }}
        onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(220,38,38,.35)"; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(220,38,38,.28)"; }}
      >
        {isSubmitting && <LuLoader size={16} style={{ animation: "spin 1s linear infinite" }} />}
        {isSubmitting ? "Kirish..." : "Kirish"}
      </button>

      <div style={{ textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
        Hisobingiz yo'qmi?{" "}
        <span onClick={() => onSwitchTab("register")} style={{ color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>
          Ro'yxatdan o'ting
        </span>
      </div>
    </form>
  );
}

/* ─── RegisterForm ───────────────────────────────────────────────── */
function RegisterForm({ onSwitchTab }) {
  const navigate = useNavigate();
  const { register: registerFn } = useAuthStore();

  const { register, handleSubmit, setValue, watch, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: "", firstName: "", lastName: "", email: "",
      phone: "", password: "", confirmPassword: "",
      platform: "", followers: "", category: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        password:  data.password,
        role:      data.role === "brand" ? "business" : data.role,
      };
      if (data.role === "blogger") {
        payload.platforms  = data.platform  ? [data.platform]  : [];
        payload.followers  = data.followers ? Number(data.followers) : 0;
        payload.categories = data.category  ? [data.category]  : [];
      }
      const result = await registerFn(payload);
      if (result?.status === "pending") {
        navigate("/tasdiqlash-kutilmoqda", { replace: true });
      } else {
        toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Ro'yxatdan o'tish xatosi";
      setError("root", { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 14 }} noValidate>

      {/* Role selector */}
      <div>
        <div className="auth-role-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { val: "brand",   emoji: "🏢", label: "Biznes / Brend" },
            { val: "blogger", emoji: "📲", label: "Bloger" },
          ].map(r => (
            <button
              key={r.val} type="button"
              onClick={() => setValue("role", r.val, { shouldValidate: true })}
              style={{
                padding: "11px 8px", borderRadius: 11, cursor: "pointer",
                border: `1.5px solid ${selectedRole === r.val ? "#dc2626" : "#e2e8f0"}`,
                background: selectedRole === r.val ? "#fef2f2" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, fontSize: 13, fontWeight: 600, transition: "all .18s",
                color: selectedRole === r.val ? "#dc2626" : "#64748b", fontFamily: "inherit",
              }}
            >
              {selectedRole === r.val && <LuCheck size={13} strokeWidth={3} style={{ color: "#dc2626" }} />}
              {r.emoji} {r.label}
            </button>
          ))}
        </div>
        {errors.role && <p style={S.errMsg}>{errors.role.message}</p>}
      </div>

      {/* Name */}
      <div className="auth-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Ism *" placeholder="Ismingiz" error={errors.firstName?.message} {...register("firstName")} />
        <InputField label="Familiya" placeholder="Familiya" error={errors.lastName?.message} {...register("lastName")} />
      </div>

      <InputField label="Email *" placeholder="email@example.com" error={errors.email?.message} {...register("email")} />
      <InputField label="Telefon" placeholder="+998 90 000 00 00" error={errors.phone?.message} {...register("phone")} />
      <InputField label="Parol *" type="password" placeholder="Kamida 6 ta belgi" error={errors.password?.message} {...register("password")} />
      <InputField label="Parolni tasdiqlang *" type="password" placeholder="Parolni qayta kiriting" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

      {/* Blogger-specific fields */}
      {selectedRole === "blogger" && (
        <div style={{ borderTop: "1px dashed #fca5a5", paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#dc2626", margin: 0, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            📊 Blogger ma'lumotlari
          </p>
          <SelectField label="Asosiy platforma *" error={errors.platform?.message} {...register("platform")}>
            <option value="">Platformani tanlang</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="telegram">Telegram</option>
          </SelectField>
          <InputField label="Obunachilar soni *" type="number" placeholder="Masalan: 50000" error={errors.followers?.message} {...register("followers")} />
          <SelectField label="Kategoriya" error={errors.category?.message} {...register("category")}>
            <option value="">Kategoriyani tanlang</option>
            <option value="Tech">Texnologiya</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Food">Ovqat</option>
            <option value="Sports">Sport</option>
            <option value="Travel">Sayohat</option>
            <option value="Business">Biznes</option>
            <option value="Beauty">Go'zallik</option>
            <option value="Music">Musiqa</option>
            <option value="Other">Boshqa</option>
          </SelectField>
        </div>
      )}

      {errors.root && (
        <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px" }}>
          <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontWeight: 500 }}>{errors.root.message}</p>
        </div>
      )}

      <button
        type="submit" disabled={isSubmitting}
        style={{ ...S.btn, marginTop: 4, opacity: isSubmitting ? 0.7 : 1 }}
        onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(220,38,38,.35)"; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(220,38,38,.28)"; }}
      >
        {isSubmitting && <LuLoader size={16} style={{ animation: "spin 1s linear infinite" }} />}
        {isSubmitting ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
      </button>

      <div style={{ textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
        Hisobingiz bormi?{" "}
        <span onClick={() => onSwitchTab("login")} style={{ color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>
          Kirish
        </span>
      </div>

      <p style={{ fontSize: 11.5, color: "#cbd5e1", textAlign: "center", lineHeight: 1.7, margin: 0 }}>
        Ro'yxatdan o'tish orqali{" "}
        <Link to="/shartlar" style={{ color: "#94a3b8" }}>shartlar</Link> va{" "}
        <Link to="/maxfiylik" style={{ color: "#94a3b8" }}>maxfiylik siyosati</Link>ga rozilik bildirasiz.
      </p>
    </form>
  );
}

/* ─── Auth (main) ────────────────────────────────────────────────── */
export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultTab = location.pathname === "/royxatdan-otish" ? "register" : "login";
  const [tab, setTab] = useState(defaultTab);

  const handleTab = (t) => {
    setTab(t);
    navigate(t === "login" ? "/kirish" : "/royxatdan-otish", { replace: true });
  };

  return (
    <div style={S.wrap}>
      <SEO title="Kirish / Ro'yxatdan O'tish" noindex />
      <style>{`
        .auth-card { padding: 36px 32px; }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 480px) {
          .auth-card      { padding: 28px 20px; border-radius: 18px !important; }
          .auth-name-row  { grid-template-columns: 1fr !important; }
          .auth-role-row  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* bg blobs */}
      <div style={{ position: "fixed", top: "-10%", right: "-5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(220,38,38,.07) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "5%", left: "-8%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,.06) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div className="auth-card" style={{ ...S.card }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", marginBottom: 24 }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff4b2b" /><stop offset="100%" stopColor="#c0392b" />
              </linearGradient>
            </defs>
            <rect width="36" height="36" rx="10" fill="url(#ag)" />
            <rect width="36" height="18" rx="10" fill="rgba(255,255,255,0.18)" />
            <path d="M9 22C9 14 27 14 27 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".35" />
            <path d="M12 22C12 16.5 24 16.5 24 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6" />
            <path d="M15 22C15 19 21 19 21 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".9" />
            <circle cx="18" cy="24" r="2.2" fill="white" />
            <text x="18" y="11" textAnchor="middle" fill="white" style={{ fontSize: 7, fontWeight: 800, fontFamily: "sans-serif", letterSpacing: "0.5px" }}>AD</text>
          </svg>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#dc2626" }}>ad</span>
            <span style={{ color: "#111827" }}>blo</span>
            <span style={{ color: "#dc2626" }}>gg</span>
            <span style={{ color: "#111827" }}>er</span>
          </span>
        </Link>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#f8fafc", borderRadius: 12, padding: 4, marginBottom: 28, border: "1px solid #f1f5f9" }}>
          {[{ id: "login", label: "Kirish" }, { id: "register", label: "Ro'yxatdan o'tish" }].map(t => (
            <button key={t.id} onClick={() => handleTab(t.id)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 9, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700, transition: "all .2s", fontFamily: "inherit",
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#dc2626" : "#94a3b8",
              boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,.08)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "login"    && <LoginForm    onSwitchTab={handleTab} />}
        {tab === "register" && <RegisterForm onSwitchTab={handleTab} />}

        {/* Back link */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#94a3b8", textDecoration: "none", transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#dc2626"}
            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
          >
            <LuArrowLeft size={13} /> Bosh sahifaga qaytish
          </Link>
        </div>

      </div>
    </div>
  );
}
