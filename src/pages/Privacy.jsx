import SEO from "../components/SEO";

export default function Privacy() {
  const sections = [
    { title: "1. Ma'lumotlar yig'ish", body: "Biz siz haqingizda faqat xizmatimizdan foydalanish uchun zarur bo'lgan ma'lumotlarni yig'amiz: ism, email, telefon raqami va platforma foydalanish ma'lumotlari." },
    { title: "2. Ma'lumotlardan foydalanish", body: "Yig'ilgan ma'lumotlar faqat xizmat ko'rsatish, hisobingizni boshqarish va siz bilan bog'lanish uchun ishlatiladi. Uchinchi shaxslarga sotilmaydi." },
    { title: "3. Ma'lumotlarni saqlash", body: "Ma'lumotlaringiz xavfsiz serverlarimizda saqlanadi. Standart shifrlash texnologiyalaridan foydalaniladi." },
    { title: "4. Cookielar", body: "Saytimiz sessiya va funksional cookielardan foydalanadi. Brauzer sozlamalarida cookielarni o'chirib qo'yish mumkin." },
    { title: "5. Huquqlaringiz", body: "Siz o'z ma'lumotlaringizni ko'rish, o'zgartirish yoki o'chirish huquqiga egasiz. Buning uchun hello@addbloger.uz manziliga murojaat qiling." },
    { title: "6. O'zgarishlar", body: "Ushbu maxfiylik siyosati o'zgartirilishi mumkin. Muhim o'zgarishlar haqida email orqali xabar beramiz." },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>
      <SEO title="Maxfiylik Siyosati" description="ADBlogger maxfiylik siyosati — foydalanuvchi ma'lumotlari qanday yig'ilishi va ishlatilishi haqida." canonical="/privacy" noindex />
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: "inline-block", background: "#fef2f2", color: "#dc2626",
          fontSize: 11, fontWeight: 700, letterSpacing: "1px",
          padding: "4px 12px", borderRadius: 8, marginBottom: 14,
        }}>MAXFIYLIK SIYOSATI</span>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Maxfiylik siyosati</h1>
        <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>Oxirgi yangilanish: 1 yanvar 2025</p>
      </div>

      <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 32, background: "#f8fafc", borderRadius: 12, padding: "20px", border: "1px solid #e2e8f0" }}>
        adblogger.uz platformasi sifatida biz foydalanuvchilarimizning maxfiyligini jiddiy qabul qilamiz. Ushbu siyosat qanday ma'lumotlar yig'ilishi va ulardan qanday foydalanilishini tushuntiradi.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map(s => (
          <div key={s.title} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "22px 24px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, background: "#fef2f2", borderRadius: 14, padding: "20px 24px", border: "1px solid #fecaca" }}>
        <p style={{ fontSize: 13.5, color: "#374151", margin: 0, lineHeight: 1.7 }}>
          Savollar uchun: <a href="mailto:hello@addbloger.uz" style={{ color: "#dc2626", fontWeight: 700 }}>hello@addbloger.uz</a>
        </p>
      </div>
    </div>
  );
}
