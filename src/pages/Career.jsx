import React, { useState } from "react";
import SEO, { breadcrumbSchema } from "../components/SEO";
import { LuMapPin, LuClock, LuArrowRight, LuBriefcase, LuX, LuCheck, LuChevronDown } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

/* ─── Ma'lumotlar — Admin Career bilan to'liq mos ─── */
const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    icon: "💻",
    dept: "IT bo'limi",
    exp: "2+ yil",
    type: "To'liq stavka",
    location: "Toshkent / Remote",
    skills: ["React", "TypeScript", "Tailwind"],
    desc: "React, TypeScript, Tailwind CSS bilan ishlash tajribasi. Vite, Axios va zamonaviy frontend stack.",
    hot: true,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    icon: "🎨",
    dept: "Dizayn bo'limi",
    exp: "1+ yil",
    type: "To'liq stavka",
    location: "Toshkent",
    skills: ["Figma", "Prototyping", "Research"],
    desc: "Figma, user research, prototyping. Portfolio taqdim etish shart. UX yozuv tajribasi afzal.",
    hot: false,
  },
  {
    id: 3,
    title: "Marketing Manager",
    icon: "📣",
    dept: "Marketing",
    exp: "3+ yil",
    type: "To'liq stavka",
    location: "Toshkent",
    skills: ["SMM", "Content", "Analytics"],
    desc: "Digital marketing, SMM, influencer marketing. Analitika va kontent strategiyasi bo'yicha tajriba.",
    hot: true,
  },
  {
    id: 4,
    title: "Backend Developer",
    icon: "🛠",
    dept: "IT bo'limi",
    exp: "2+ yil",
    type: "To'liq stavka",
    location: "Toshkent / Remote",
    skills: ["Node.js", "PostgreSQL", "Docker"],
    desc: "Node.js, PostgreSQL, Docker bilan ishlash. REST API va mikroservislar bo'yicha tajriba.",
    hot: false,
  },
  {
    id: 5,
    title: "HR Specialist",
    icon: "👥",
    dept: "HR bo'limi",
    exp: "1+ yil",
    type: "To'liq stavka",
    location: "Toshkent",
    skills: ["Recruitment", "Onboarding"],
    desc: "Recruitment, onboarding jarayonlari. Xodimlar bilan muloqot va korporativ madaniyatni rivojlantirish.",
    hot: false,
  },
  {
    id: 6,
    title: "Accountant",
    icon: "📊",
    dept: "Moliya",
    exp: "2+ yil",
    type: "To'liq stavka",
    location: "Toshkent",
    skills: ["1C", "Excel", "Soliqlar"],
    desc: "1C, Excel, soliq hisobi. Moliyaviy hisobot va byudjetlashtirish bo'yicha tajriba talab etiladi.",
    hot: false,
  },
];

const PERKS = [
  { emoji: "💰", title: "Raqobatbardosh maosh", desc: "Bozor narxidan yuqori va performance bonus" },
  { emoji: "🌍", title: "Gibrid ish", desc: "Ofis va remote orasida tanlov" },
  { emoji: "📚", title: "O'rganish imkoni", desc: "Kurslar va konferensiyalar uchun byudjet" },
  { emoji: "🏥", title: "Sog'liq sug'urtasi", desc: "To'liq tibbiy sug'urta" },
  { emoji: "🎯", title: "Rivojlanish", desc: "Aniq karyera o'sish yo'li" },
  { emoji: "🤝", title: "Jamoaviy ruh", desc: "Yosh va g'ayratli jamoa" },
];

const CATEGORIES = ["Barchasi", "IT bo'limi", "Dizayn bo'limi", "Marketing", "HR bo'limi", "Moliya"];

const EXP_OPTIONS = ["Tajriba tanlang", "0–1 yil", "1–2 yil", "2–3 yil", "3+ yil"];

/* ─── Modal ariza formasi ─── */
function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    direction: job?.title || "",
    exp: "",
    skills: "",
    message: "",
    portfolio: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Ism kiritish shart";
    if (!form.phone.trim()) e.phone = "Telefon kiritish shart";
    if (!form.email.trim()) e.email = "Email kiritish shart";
    if (!form.exp || form.exp === "Tajriba tanlang") e.exp = "Tajribani tanlang";
    if (!form.message.trim()) e.message = "Motivatsiya xabarini yozing";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(true);
    setTimeout(() => { onClose(); }, 3500);
  };

  const set = (k) => (ev) => {
    setForm((p) => ({ ...p, [k]: ev.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10,15,28,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: "28px",
        width: "100%",
        maxWidth: "520px",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 40px 100px rgba(0,0,0,0.28)",
        overflow: "hidden",
      }}>
        {submitted ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "48px 32px", textAlign: "center",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20, fontSize: 32,
            }}>✓</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              Arizangiz qabul qilindi!
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
              <strong>{job?.title}</strong> lavozimi bo'yicha arizangiz muvaffaqiyatli yuborildi.<br />
              Tez orada siz bilan bog'lanamiz.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              padding: "20px 24px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>Ariza topshirish</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  {job?.icon} {job?.title} · {job?.dept}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16, color: "#94a3b8",
                }}
              >✕</button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} style={{ overflowY: "auto", flex: 1, padding: "20px 24px 28px" }}>

              {/* Lavozim banner */}
              <div style={{
                background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                border: "1px solid #bfdbfe",
                borderRadius: 14, padding: "12px 16px",
                marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 22 }}>{job?.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e40af" }}>{job?.title}</div>
                  <div style={{ fontSize: 11, color: "#3b82f6" }}>{job?.dept} · {job?.exp} tajriba · {job?.location}</div>
                </div>
              </div>

              {/* 2 ustunli grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <Field label="To'liq ism *" error={errors.name}>
                  <input
                    value={form.name} onChange={set("name")}
                    placeholder="Sardor Aliyev"
                    style={inputStyle(errors.name)}
                  />
                </Field>
                <Field label="Telefon raqam *" error={errors.phone}>
                  <input
                    value={form.phone} onChange={set("phone")}
                    placeholder="+998 90 123 45 67"
                    style={inputStyle(errors.phone)}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Field label="Email manzil *" error={errors.email}>
                  <input
                    type="email"
                    value={form.email} onChange={set("email")}
                    placeholder="sizning@email.com"
                    style={inputStyle(errors.email)}
                  />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <Field label="Yo'nalish" error={null}>
                  <input
                    value={form.direction} onChange={set("direction")}
                    placeholder="Frontend, Dizayn..."
                    style={inputStyle(false)}
                  />
                </Field>
                <Field label="Tajriba *" error={errors.exp}>
                  <div style={{ position: "relative" }}>
                    <select
                      value={form.exp} onChange={set("exp")}
                      style={{ ...inputStyle(errors.exp), appearance: "none", paddingRight: 32, cursor: "pointer" }}
                    >
                      {EXP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <LuChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                  </div>
                </Field>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Field label="Ko'nikmalar (vergul bilan)" error={null}>
                  <input
                    value={form.skills} onChange={set("skills")}
                    placeholder="React, Figma, Python..."
                    style={inputStyle(false)}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Field label="Portfolio yoki CV linki" error={null}>
                  <input
                    type="url"
                    value={form.portfolio} onChange={set("portfolio")}
                    placeholder="https://..."
                    style={inputStyle(false)}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: 20 }}>
                <Field label="Motivatsiya xabari *" error={errors.message}>
                  <textarea
                    value={form.message} onChange={set("message")}
                    rows={3}
                    placeholder="O'zingiz haqingizda qisqacha yozing, nima uchun aynan biz bilan ishlashni xohlaysiz..."
                    style={{ ...inputStyle(errors.message), resize: "vertical", lineHeight: 1.6 }}
                  />
                </Field>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%", padding: "14px",
                  background: "linear-gradient(135deg,#1e40af,#2563eb)",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  border: "none", borderRadius: 14, cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(37,99,235,0.28)",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Arizani yuborish →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function inputStyle(hasError) {
  return {
    width: "100%",
    padding: "10px 12px",
    border: `1.5px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: 10,
    fontSize: 13,
    color: "#0f172a",
    background: hasError ? "#fff5f5" : "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  };
}

/* ─── Asosiy sahifa ─── */
export default function Career() {
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [applyingJob, setApplyingJob] = useState(null);

  const filteredJobs = activeCategory === "Barchasi"
    ? JOBS
    : JOBS.filter(j => j.dept === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <SEO
        title="Karyera — ADBlogger Jamoasiga Qo'shiling"
        description="ADBlogger jamoasiga qo'shiling! IT, marketing, dizayn, HR va boshqa yo'nalishlarda ochiq vakansiyalar. Zamonaviy ish sharoiti va raqobatbardosh maosh."
        canonical="/career"
        schema={breadcrumbSchema([{ name: "Bosh sahifa", path: "/" }, { name: "Karyera", path: "/career" }])}
      />

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(160deg,#0f172a 0%,#1e3a5f 60%,#0f2744 100%)", padding: "80px 24px 96px", position: "relative", overflow: "hidden" }}>
        {/* dekor doiralar */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", top: -40, right: -40, width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.15),transparent 70%)" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
            color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "6px 16px", borderRadius: 99, marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            Karyera
          </div>
          <h1 style={{ fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
            Bizning jamoaga{" "}
            <span style={{ color: "transparent", backgroundImage: "linear-gradient(90deg,#60a5fa,#34d399)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
              qo'shiling
            </span>
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
            O'zbekistonning eng tezkor o'sayotgan tech loyihasida ishlang va kelajakni birga quring.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { v: JOBS.length, l: "Ochiq lavozim" },
              { v: "50+", l: "Jamoa a'zosi" },
              { v: "3+", l: "Yillik tajriba" },
            ].map(s => (
              <div key={s.l} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "16px 28px", textAlign: "center",
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERKS ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Nima taklif etamiz?</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>O'z xodimlarimizga eng yaxshi sharoitlarni yaratamiz.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 20, padding: "24px 20px",
              border: "1.5px solid #f1f5f9",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 30, marginBottom: 12 }}>{p.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VAKANSIYALAR ── */}
      <div style={{ maxWidth: 860, margin: "72px auto 0", padding: "0 24px 80px" }}>
        {/* sarlavha + filter */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
              Ochiq lavozimlar
              <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 13, fontWeight: 700, padding: "3px 12px", borderRadius: 99 }}>
                {filteredJobs.length}
              </span>
            </h2>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>O'zingizga mos yo'nalishni tanlang</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  background: activeCategory === cat ? "#0f172a" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#64748b",
                  border: `1.5px solid ${activeCategory === cat ? "#0f172a" : "#e2e8f0"}`,
                  boxShadow: activeCategory === cat ? "0 4px 12px rgba(15,23,42,0.18)" : "none",
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Job kartalar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredJobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", background: "#fff", borderRadius: 20, border: "1.5px dashed #e2e8f0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>Bu yo'nalishda hozircha ochiq vakansiyalar yo'q.</div>
            </div>
          ) : filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onApply={() => setApplyingJob(job)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {applyingJob && <ApplyModal job={applyingJob} onClose={() => setApplyingJob(null)} />}
    </div>
  );
}

/* ─── Job Card ─── */
function JobCard({ job, onApply }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "20px 24px",
        border: `1.5px solid ${hover ? "#bfdbfe" : "#f1f5f9"}`,
        boxShadow: hover ? "0 12px 36px rgba(37,99,235,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.22s ease",
        transform: hover ? "translateY(-2px)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {job.hot && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: "linear-gradient(135deg,#ef4444,#f97316)",
          color: "#fff", fontSize: 9, fontWeight: 800,
          padding: "5px 12px", borderBottomLeftRadius: 10,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>Qaynoq</div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: "#f8fafc", border: "1.5px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>{job.icon}</div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{job.title}</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            {[
              { icon: "🏢", val: job.dept },
              { icon: "⏱", val: job.exp + " tajriba" },
              { icon: "📍", val: job.location },
              { icon: "🕐", val: job.type },
            ].map(m => (
              <span key={m.val} style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 12 }}>{m.icon}</span> {m.val}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {job.skills.map(s => (
              <span key={s} style={{
                fontSize: 11, padding: "3px 9px", borderRadius: 6,
                background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569",
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Tugma */}
        <button
          onClick={onApply}
          style={{
            padding: "11px 22px", borderRadius: 12, border: "none",
            background: hover ? "linear-gradient(135deg,#1e40af,#2563eb)" : "#0f172a",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: hover ? "0 8px 20px rgba(37,99,235,0.28)" : "none",
            transition: "all 0.2s", whiteSpace: "nowrap",
            fontFamily: "inherit", flexShrink: 0,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          Ariza topshirish <LuArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}