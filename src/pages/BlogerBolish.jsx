import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LuInstagram, LuYoutube, LuCheck, LuArrowRight, LuUsers, LuTrendingUp, LuDollarSign, LuStar, LuLoader, LuEye, LuEyeOff } from "react-icons/lu";
import { useState, forwardRef } from "react";
import SEO, { breadcrumbSchema } from "../components/SEO";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "../components/ui/toast";

/* ─── Static data ────────────────────────────────────────────────── */
const steps = [
  { num: "01", title: "Ro'yxatdan o'ting",        desc: "Bepul profil yarating va o'z ma'lumotlaringizni kiriting." },
  { num: "02", title: "Profilingizni to'ldiring",  desc: "Kategoriya, platforma va auditoriya haqida ma'lumot bering." },
  { num: "03", title: "Brendlar bilan bog'laning", desc: "Sizga mos brendlar sizni topadi yoki o'zingiz murojaat qiling." },
  { num: "04", title: "Daromad oling",             desc: "Bitim tuzing, kontent yarating va to'lovingizni oling." },
];

const perks = [
  { Icon: LuDollarSign, title: "Kafolatlangan to'lov", desc: "Platforma orqali barcha to'lovlar himoyalangan." },
  { Icon: LuUsers,      title: "200+ brend",           desc: "Faol brendlar doimo yangi blogerlarni qidiradi." },
  { Icon: LuTrendingUp, title: "0% komissiya",         desc: "Birinchi oy to'liq komissiyasiz ishlang." },
  { Icon: LuStar,       title: "Reytingni oshiring",   desc: "Har bir bitim reytingingizni yaxshilaydi." },
];

/* ─── Yup schema ─────────────────────────────────────────────────── */
const schema = yup.object({
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
  platform:  yup.string().required("Platformani tanlang"),
  followers: yup.string().required("Obunachilar sonini kiriting"),
  category:  yup.string().default(""),
});

/* ─── Reusable input components ──────────────────────────────────── */
const inputBase = (hasError) => ({
  width: "100%", padding: "12px 14px", fontSize: 14,
  border: `1.5px solid ${hasError ? "#ef4444" : "#e2e8f0"}`,
  borderRadius: 10, outline: "none",
  background: hasError ? "#fff5f5" : "#fff",
  color: "#0f172a", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
});

function Field({ label, error, children }) {
  return (
    <div>
      {label && <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{label}</label>}
      {children}
      {error && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 500 }}>{error}</p>}
    </div>
  );
}

const BBInput = forwardRef(function BBInput({ label, type = "text", placeholder, error, ...rest }, ref) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && show ? "text" : type;

  return (
    <Field label={label} error={error}>
      <div style={{ position: "relative" }}>
        <input
          ref={ref}
          type={actualType}
          placeholder={placeholder}
          style={{ ...inputBase(!!error), paddingRight: isPassword ? 42 : 14 }}
          {...rest}
          onFocus={e => {
            e.target.style.borderColor = "#dc2626";
            e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,.08)";
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0";
            e.target.style.boxShadow = "none";
            rest.onBlur?.(e);
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(v => !v)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", display: "flex", alignItems: "center", padding: 0,
          }}>
            {show ? <LuEyeOff size={15} /> : <LuEye size={15} />}
          </button>
        )}
      </div>
    </Field>
  );
});

const BBSelect = forwardRef(function BBSelect({ label, error, children, ...rest }, ref) {
  return (
    <Field label={label} error={error}>
      <select
        ref={ref}
        style={{
          ...inputBase(!!error),
          cursor: "pointer", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
        }}
        {...rest}
        onFocus={e => { e.target.style.borderColor = "#dc2626"; e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,.08)"; }}
        onBlur={e => { e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; rest.onBlur?.(e); }}
      >
        {children}
      </select>
    </Field>
  );
});

/* ─── Main component ─────────────────────────────────────────────── */
export default function BlogerBolish() {
  const navigate = useNavigate();
  const { register: registerFn } = useAuthStore();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      password: "", confirmPassword: "", platform: "", followers: "", category: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await registerFn({
        firstName:  data.firstName,
        lastName:   data.lastName,
        email:      data.email,
        phone:      data.phone,
        password:   data.password,
        role:       "blogger",
        platforms:  data.platform  ? [data.platform]  : [],
        followers:  data.followers ? Number(data.followers) : 0,
        categories: data.category  ? [data.category]  : [],
      });
      if (result?.status === "pending") {
        navigate("/tasdiqlash-kutilmoqda");
      } else {
        toast.success("Blogger sifatida muvaffaqiyatli ro'yxatdan o'tdingiz!");
        navigate("/");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Ro'yxatdan o'tish xatosi";
      setError("root", { message: msg });
      toast.error(msg);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <SEO
        title="Blogger Bo'lish — Daromad Oling"
        description="ADBlogger platformasida blogger bo'ling. Auditoriyangizni monetizatsiya qiling, brendlar bilan hamkorlik qiling va daromad oling. Ro'yxatdan o'tish bepul!"
        canonical="/blogger-bolish"
        schema={breadcrumbSchema([{ name: "Bosh sahifa", path: "/" }, { name: "Blogger bo'lish", path: "/blogger-bolish" }])}
      />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .bb-hero        { padding: 48px 32px; }
        .bb-hero h1     { font-size: 40px; }
        .bb-hero p      { font-size: 16px; }
        .bb-grid        { display: grid; grid-template-columns: 1fr 420px; gap: 32px;
                          max-width: 1000px; margin: 0 auto; padding: 0 20px 60px; align-items: start; }
        .bb-perks       { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .bb-form-card   { position: sticky; top: 80px; }
        @media (max-width: 900px) {
          .bb-grid      { grid-template-columns: 1fr; }
          .bb-form-card { position: static; }
        }
        @media (max-width: 600px) {
          .bb-hero        { padding: 32px 20px; margin-bottom: 28px !important; border-radius: 14px !important; }
          .bb-hero h1     { font-size: 26px; }
          .bb-hero p      { font-size: 14px; }
          .bb-hero-badges { gap: 12px !important; }
          .bb-grid        { padding: 0 0 40px; gap: 24px; }
          .bb-perks       { grid-template-columns: 1fr; }
          .bb-name-row    { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <div className="bb-hero" style={{
        background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
        borderRadius: 20, marginBottom: 48, textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-block", background: "rgba(220,38,38,0.2)", color: "#fca5a5", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", padding: "4px 14px", borderRadius: 20, marginBottom: 20 }}>
            🚀 YANGI IMKONIYAT
          </span>
          <h1 style={{ fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 16px", fontFamily: "'Syne', sans-serif" }}>
            Bloger bo'ling va<br /><span style={{ color: "#38bdf8" }}>daromad oling</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.7 }}>
            O'z auditoriyangizni monetizatsiya qiling. 200+ brend bilan to'g'ridan-to'g'ri ishlang.
          </p>
          <div className="bb-hero-badges" style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {["500+ bloger", "200+ brend", "5M+ so'm to'lov"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                <LuCheck size={13} style={{ color: "#4ade80" }} strokeWidth={3} /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bb-grid">

        {/* Left — Info */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Qanday ishlaydi?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
            {steps.map(s => (
              <div key={s.num} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#dc2626,#b91c1c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{s.num}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Nima olasiz?</h2>
          <div className="bb-perks">
            {perks.map(({ Icon, title, desc }) => (
              <div key={title} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={17} style={{ color: "#dc2626" }} />
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div className="bb-form-card" style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Hozir ro'yxatdan o'ting</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Bepul · 2 daqiqa · Kredit karta shart emas</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 12 }} noValidate>

            {/* Name */}
            <div className="bb-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <BBInput label="Ism *" placeholder="Ismingiz" error={errors.firstName?.message} {...register("firstName")} />
              <BBInput label="Familiya" placeholder="Familiya" error={errors.lastName?.message} {...register("lastName")} />
            </div>

            <BBInput label="Email *" placeholder="email@example.com" error={errors.email?.message} {...register("email")} />
            <BBInput label="Telefon" placeholder="+998 90 000 00 00" error={errors.phone?.message} {...register("phone")} />
            <BBInput label="Parol *" type="password" placeholder="Kamida 6 ta belgi" error={errors.password?.message} {...register("password")} />
            <BBInput label="Parolni tasdiqlang *" type="password" placeholder="Parolni qayta kiriting" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

            {/* Divider */}
            <div style={{ borderTop: "1px dashed #fca5a5", paddingTop: 12, marginTop: 2 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#dc2626", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                📊 Blogger ma'lumotlari
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <BBSelect label="Asosiy platforma *" error={errors.platform?.message} {...register("platform")}>
                  <option value="">Platforma tanlang</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="telegram">Telegram</option>
                </BBSelect>
                <BBInput label="Obunachilar soni *" type="number" placeholder="Masalan: 50000" error={errors.followers?.message} {...register("followers")} />
                <BBSelect label="Kategoriya" error={errors.category?.message} {...register("category")}>
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
                </BBSelect>
              </div>
            </div>

            {errors.root && (
              <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontWeight: 500 }}>{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit" disabled={isSubmitting}
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: "#fff", fontSize: 14, fontWeight: 700,
                border: "none", borderRadius: 12,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                boxShadow: "0 4px 20px rgba(220,38,38,0.35)",
                marginTop: 4, opacity: isSubmitting ? 0.75 : 1, transition: "opacity 0.2s",
              }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = isSubmitting ? "0.75" : "1"; }}
            >
              {isSubmitting ? <LuLoader size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
              {isSubmitting ? "Yuklanmoqda..." : <><span>Ro'yxatdan o'tish</span> <LuArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ fontSize: 11.5, color: "#94a3b8", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
            Ro'yxatdan o'tish orqali <a href="/shartlar" style={{ color: "#dc2626" }}>foydalanish shartlari</a>ga rozilik bildirasiz.
          </p>
        </div>
      </div>
    </div>
  );
}
