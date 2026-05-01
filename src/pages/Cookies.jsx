import SEO from "../components/SEO";

export default function Cookies() {
  const types = [
    { name: "Zaruriy Cookielar", desc: "Saytning asosiy funksiyalari uchun zarur. O'chirish mumkin emas.", always: true },
    { name: "Funksional Cookielar", desc: "Til tanlash, login holati kabi sozlamalarni eslab qolish uchun.", always: false },
    { name: "Analitik Cookielar", desc: "Sayt foydalanishini tahlil qilish va yaxshilash uchun (Google Analytics).", always: false },
    { name: "Marketing Cookielar", desc: "Maqsadli reklama va ijtimoiy tarmoq integratsiyasi uchun.", always: false },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>
      <SEO title="Cookie Siyosati" description="ADBlogger cookie siyosati — saytimiz qanday cookielardan foydalanishi haqida." canonical="/cookies" noindex />
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: "inline-block", background: "#fef2f2", color: "#dc2626",
          fontSize: 11, fontWeight: 700, letterSpacing: "1px",
          padding: "4px 12px", borderRadius: 8, marginBottom: 14,
        }}>COOKIE SIYOSATI</span>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Cookie siyosati</h1>
        <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>Oxirgi yangilanish: 1 yanvar 2025</p>
      </div>

      <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 32, background: "#f8fafc", borderRadius: 12, padding: "20px", border: "1px solid #e2e8f0" }}>
        Cookie — brauzeringizda saqlanadigan kichik matn fayli. Biz cookielardan foydalanuvchi tajribasini yaxshilash uchun foydalanamiz.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
        {types.map(t => (
          <div key={t.name} style={{
            background: "#fff", border: "1.5px solid #e2e8f0",
            borderRadius: 14, padding: "20px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{t.desc}</div>
            </div>
            <div style={{
              flexShrink: 0,
              width: 44, height: 24, borderRadius: 12,
              background: t.always ? "#dc2626" : "#e2e8f0",
              position: "relative", cursor: t.always ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>
              <div style={{
                position: "absolute", width: 18, height: 18, borderRadius: "50%",
                background: "#fff", top: 3,
                left: t.always ? 23 : 3,
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fef2f2", borderRadius: 14, padding: "20px 24px", border: "1px solid #fecaca" }}>
        <p style={{ fontSize: 13.5, color: "#374151", margin: 0, lineHeight: 1.7 }}>
          Brauzer cookiey sozlamalari: <strong>Sozlamalar → Maxfiylik → Cookielar</strong>.<br />
          Savollar: <a href="mailto:hello@addbloger.uz" style={{ color: "#dc2626", fontWeight: 700 }}>hello@addbloger.uz</a>
        </p>
      </div>
    </div>
  );
}
