import { LuCheck, LuZap, LuStar, LuBuilding2, LuArrowRight } from "react-icons/lu";

const plans = [
  {
    name: "Starter",
    price: "Bepul",
    period: "",
    desc: "Kichik biznes va shaxsiy brendlar uchun",
    color: "#64748b",
    features: [
      "5 ta bloger bilan bog'lanish",
      "Asosiy qidiruv filtrlari",
      "Kampaniya hisoboti",
      "Email support",
    ],
    cta: "Bepul boshlash",
    popular: false,
  },
  {
    name: "Pro",
    price: "299 000",
    period: "/ oy",
    desc: "O'sib borayotgan brendlar uchun eng ko'p tanlangan",
    color: "#dc2626",
    features: [
      "Cheksiz blogerlar bilan bog'lanish",
      "AI-tavsiya filtrlari",
      "Real-time kampaniya analitikasi",
      "Shartnoma va to'lov boshqaruvi",
      "Priority support (24h)",
      "Brend sahifasi",
    ],
    cta: "Pro boshlash",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Muloqot",
    period: "",
    desc: "Yirik kompaniyalar uchun moslashtirilgan yechim",
    color: "#0f172a",
    features: [
      "Hammasi Pro da bor",
      "Dedicated account manager",
      "API integratsiya",
      "Maxsus hisobotlar",
      "SLA kafolati",
      "Onboarding & training",
    ],
    cta: "Bog'lanish",
    popular: false,
  },
];

const faqs = [
  { q: "To'lovni qanday amalga oshiraman?", a: "Payme, Click yoki bank o'tkazmasi orqali to'lash mumkin. Oylik yoki yillik (20% chegirma) to'lov rejasi mavjud." },
  { q: "Bepul rejada qancha vaqt foydalanish mumkin?", a: "Starter rejasi doimiy bepul. Istalgan vaqt Pro yoki Enterprise ga o'tish mumkin." },
  { q: "Bekor qilish jarayoni qandaY?", a: "Istalgan vaqt obunani bekor qilish mumkin. Joriy oy oxirigacha xizmat davom etadi." },
  { q: "Enterprise uchun alohida narx bormi?", a: "Ha, kompaniya hajmi va ehtiyojlariga qarab individual narx taklif etamiz." },
];

export default function Pricing() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 20px 48px", maxWidth: 640, margin: "0 auto" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#fef2f2", color: "#dc2626",
          fontSize: 12, fontWeight: 700, letterSpacing: "1px",
          padding: "5px 14px", borderRadius: 20, marginBottom: 20,
        }}>
          <LuZap size={12} /> NARX REJALARI
        </span>
        <h1 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", lineHeight: 1.15, margin: "0 0 14px" }}>
          O'z biznesingiz uchun<br />
          <span style={{ color: "#dc2626" }}>to'g'ri rejani tanlang</span>
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
          Bepul boshlang, o'sib borgan sari kengaytiring. Yashirin to'lovlar yo'q.
        </p>
      </div>

      {/* Plans */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20, maxWidth: 960, margin: "0 auto", padding: "0 20px 60px",
      }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{
            background: plan.popular ? "#0f172a" : "#fff",
            border: plan.popular ? "2px solid #dc2626" : "1.5px solid #e2e8f0",
            borderRadius: 20, padding: "32px 28px",
            position: "relative",
            boxShadow: plan.popular ? "0 20px 60px rgba(220,38,38,0.2)" : "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            {plan.popular && (
              <div style={{
                position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "4px 16px", borderRadius: 20,
                display: "flex", alignItems: "center", gap: 4,
                whiteSpace: "nowrap",
              }}>
                <LuStar size={10} fill="#fff" /> ENG KO'P TANLANGAN
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: plan.popular ? "rgba(220,38,38,0.2)" : "#f8fafc",
                color: plan.popular ? "#fca5a5" : plan.color,
                fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 8,
                marginBottom: 16,
              }}>
                <LuBuilding2 size={12} /> {plan.name}
              </div>

              <div style={{ marginBottom: 8 }}>
                <span style={{
                  fontSize: 36, fontWeight: 800,
                  color: plan.popular ? "#fff" : "#0f172a",
                  fontFamily: "'Syne', sans-serif",
                }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: 14, color: plan.popular ? "#94a3b8" : "#64748b", marginLeft: 4 }}>
                    so'm {plan.period}
                  </span>
                )}
              </div>

              <p style={{ fontSize: 13.5, color: plan.popular ? "#94a3b8" : "#64748b", margin: 0, lineHeight: 1.5 }}>
                {plan.desc}
              </p>
            </div>

            <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.features.map((f) => (
                <li key={f} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  fontSize: 13.5, color: plan.popular ? "#e2e8f0" : "#374151",
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: plan.popular ? "rgba(220,38,38,0.3)" : "#fef2f2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <LuCheck size={11} style={{ color: plan.popular ? "#fca5a5" : "#dc2626" }} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button style={{
              width: "100%", padding: "13px", borderRadius: 12,
              border: "none", cursor: "pointer",
              background: plan.popular ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "#f8fafc",
              color: plan.popular ? "#fff" : "#0f172a",
              fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: plan.popular ? "0 4px 20px rgba(220,38,38,0.4)" : "none",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {plan.cta} <LuArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 60px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", textAlign: "center", marginBottom: 32 }}>
          Ko'p so'raladigan savollar
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f) => (
            <div key={f.q} style={{
              background: "#fff", border: "1.5px solid #e2e8f0",
              borderRadius: 14, padding: "18px 22px",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{f.q}</div>
              <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
