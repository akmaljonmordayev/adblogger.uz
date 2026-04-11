import { useState } from "react";
import { LuInstagram, LuYoutube, LuCheck, LuArrowRight, LuUsers, LuTrendingUp, LuDollarSign, LuStar } from "react-icons/lu";

const steps = [
  { num: "01", title: "Ro'yxatdan o'ting", desc: "Bepul profil yarating va o'z ma'lumotlaringizni kiriting." },
  { num: "02", title: "Profilingizni to'ldiring", desc: "Kategoriya, platforma va auditoriya haqida ma'lumot bering." },
  { num: "03", title: "Brendlar bilan bog'laning", desc: "Sizga mos brendlar sizni topadi yoki o'zingiz murojaat qiling." },
  { num: "04", title: "Daromad oling", desc: "Bitim tuzing, kontent yarating va to'lovingizni oling." },
];

const perks = [
  { Icon: LuDollarSign, title: "Kafolatlangan to'lov", desc: "Platforma orqali barcha to'lovlar himoyalangan." },
  { Icon: LuUsers,      title: "200+ brend",           desc: "Faol brendlar doimo yangi blogerlarni qidiradi." },
  { Icon: LuTrendingUp, title: "0% komissiya",         desc: "Birinchi oy to'liq komissiyasiz ishlang." },
  { Icon: LuStar,       title: "Reytingni oshiring",   desc: "Har bir bitim reytingingizni yaxshilaydi." },
];

const platforms = [
  { Icon: LuInstagram, label: "Instagram", color: "#e1306c" },
  { Icon: LuYoutube,   label: "YouTube",   color: "#ff0000" },
];

export default function BlogerBolish() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", platform: "", followers: "", category: "" });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%", padding: "12px 14px", fontSize: 14,
    border: "1.5px solid #e2e8f0", borderRadius: 10,
    outline: "none", background: "#fff", color: "#0f172a",
    boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
        borderRadius: 20, padding: "48px 32px", marginBottom: 48, textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-block", background: "rgba(220,38,38,0.2)",
            color: "#fca5a5", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
            padding: "4px 14px", borderRadius: 20, marginBottom: 20,
          }}>
            🚀 YANGI IMKONIYAT
          </span>
          <h1 style={{
            fontSize: 40, fontWeight: 800, color: "#fff",
            lineHeight: 1.1, margin: "0 0 16px",
            fontFamily: "'Syne', sans-serif",
          }}>
            Bloger bo'ling va<br />
            <span style={{ color: "#38bdf8" }}>daromad oling</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.7 }}>
            O'z auditoriyangizni monetizatsiya qiling. 200+ brend bilan to'g'ridan-to'g'ri ishlang.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {["500+ bloger", "200+ brend", "5M+ so'm to'lov"].map(t => (
              <span key={t} style={{
                display: "flex", alignItems: "center", gap: 5,
                color: "rgba(255,255,255,0.75)", fontSize: 13,
              }}>
                <LuCheck size={13} style={{ color: "#4ade80" }} strokeWidth={3} /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 32, maxWidth: 1000, margin: "0 auto", padding: "0 20px 60px", alignItems: "start" }}>

        {/* Left */}
        <div>
          {/* Steps */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Qanday ishlaydi?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 13, fontWeight: 800,
                  fontFamily: "'Syne', sans-serif",
                }}>{s.num}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Perks */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Nima olasiz?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {perks.map(({ Icon, title, desc }) => (
              <div key={title} style={{
                background: "#fff", border: "1.5px solid #e2e8f0",
                borderRadius: 14, padding: "18px",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "#fef2f2", display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 10,
                }}>
                  <Icon size={17} style={{ color: "#dc2626" }} />
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <div style={{
          background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: 20, padding: "28px 24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          position: "sticky", top: 80,
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
            Hozir ro'yxatdan o'ting
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>Bepul · 2 daqiqa · Kredit karta shart emas</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input style={inputStyle} placeholder="Ism Familiya *" value={form.name} onChange={e => set("name", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <input style={inputStyle} placeholder="Email *" type="email" value={form.email} onChange={e => set("email", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <input style={inputStyle} placeholder="Telefon +998 __ ___ __ __" value={form.phone} onChange={e => set("phone", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <select style={{ ...inputStyle, color: form.platform ? "#0f172a" : "#9ca3af" }} value={form.platform} onChange={e => set("platform", e.target.value)}>
              <option value="">Platforma tanlang *</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="telegram">Telegram</option>
            </select>
            <input style={inputStyle} placeholder="Obunachilar soni *" type="number" value={form.followers} onChange={e => set("followers", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <select style={{ ...inputStyle, color: form.category ? "#0f172a" : "#9ca3af" }} value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">Kategoriya *</option>
              <option>Texnologiya</option>
              <option>Lifestyle</option>
              <option>Ovqat</option>
              <option>Sport</option>
              <option>Sayohat</option>
              <option>Biznes</option>
              <option>Go'zallik</option>
              <option>Musiqa</option>
            </select>

            <button style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              border: "none", borderRadius: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: "0 4px 20px rgba(220,38,38,0.35)",
              marginTop: 4,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Arizani yuborish <LuArrowRight size={16} />
            </button>
          </div>

          <p style={{ fontSize: 11.5, color: "#94a3b8", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
            Ro'yxatdan o'tish orqali <a href="/shartlar" style={{ color: "#dc2626" }}>foydalanish shartlari</a>ga rozilik bildirasiz.
          </p>
        </div>
      </div>
    </div>
  );
}
