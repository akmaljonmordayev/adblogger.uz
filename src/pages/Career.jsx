import { LuMapPin, LuClock, LuArrowRight, LuBriefcase } from "react-icons/lu";

const JOBS = [
  { title: "Frontend Developer (React)", type: "To'liq stavka", location: "Toshkent / Remote", dept: "Texnologiya", desc: "React, TypeScript, Tailwind CSS bilan ishlash tajribasi. 2+ yil tajriba.", hot: true },
  { title: "UI/UX Designer", type: "To'liq stavka", location: "Toshkent", dept: "Dizayn", desc: "Figma, user research, prototyping. Portfolio taqdim etish shart.", hot: false },
  { title: "Marketing Manager", type: "To'liq stavka", location: "Toshkent", dept: "Marketing", desc: "Digital marketing, SMM, influencer marketing bo'yicha tajriba.", hot: true },
  { title: "Sales Manager", type: "To'liq stavka", location: "Toshkent", dept: "Sotuv", desc: "B2B sotuv, muloqot ko'nikmalari. Ingliz tili bo'lsa afzal.", hot: false },
  { title: "Content Writer (UZ)", type: "Part-time", location: "Remote", dept: "Kontent", desc: "O'zbek tilida sifatli kontent yozish. SEO ko'nikmalari.", hot: false },
];

const perks = [
  { emoji: "💰", title: "Raqobatbardosh maosh", desc: "Bozor narxidan yuqori va performance bonus" },
  { emoji: "🌍", title: "Gibrid ish", desc: "Ofis va remote orasida tanlov" },
  { emoji: "📚", title: "O'rganish imkoni", desc: "Kurslar va konferensiyalar uchun byudjet" },
  { emoji: "🏥", title: "Sog'liq sug'urtasi", desc: "To'liq tibbiy sug'urta" },
  { emoji: "🎯", title: "Rivojlanish", desc: "Aniq karyera o'sish yo'li" },
  { emoji: "🤝", title: "Jamoaviy ruh", desc: "Yosh va g'ayratli jamoa" },
];

export default function Career() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
        borderRadius: 20, padding: "56px 32px", marginBottom: 48, textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{
            display: "inline-block", background: "rgba(56,189,248,0.15)",
            color: "#38bdf8", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
            padding: "5px 14px", borderRadius: 20, marginBottom: 20,
          }}>KARRIERA</span>
          <h1 style={{
            fontSize: 40, fontWeight: 800, color: "#fff",
            lineHeight: 1.1, margin: "0 0 16px",
            fontFamily: "'Syne', sans-serif",
          }}>
            Bizning jamoaga<br />
            <span style={{ color: "#38bdf8" }}>qo'shiling</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            O'zbekistonning eng tezkor o'sayotgan tech startupida ishlang va kelajakni birga quring.
          </p>
        </div>
      </div>

      {/* Perks */}
      <div style={{ marginBottom: 48, maxWidth: 960, margin: "0 auto 48px", padding: "0 20px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 20, textAlign: "center" }}>Nima taklif etamiz?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          {perks.map(p => (
            <div key={p.title} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
          Ochiq lavozimlar <span style={{
            background: "#fef2f2", color: "#dc2626",
            fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
          }}>{JOBS.length}</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {JOBS.map(j => (
            <div key={j.title} style={{
              background: "#fff", border: `1.5px solid ${j.hot ? "#fecaca" : "#e2e8f0"}`,
              borderRadius: 16, padding: "20px 22px",
              transition: "border-color 0.2s, box-shadow 0.2s",
              cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,38,38,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = j.hot ? "#fecaca" : "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{j.title}</h3>
                    {j.hot && (
                      <span style={{ background: "#fef2f2", color: "#dc2626", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>HOT</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px", lineHeight: 1.5 }}>{j.desc}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                      { Icon: LuBriefcase, text: j.dept },
                      { Icon: LuClock,     text: j.type },
                      { Icon: LuMapPin,    text: j.location },
                    ].map(({ Icon, text }) => (
                      <span key={text} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94a3b8" }}>
                        <Icon size={12} /> {text}
                      </span>
                    ))}
                  </div>
                </div>
                <button style={{
                  flexShrink: 0, background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                  whiteSpace: "nowrap",
                }}>
                  Ariza <LuArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
