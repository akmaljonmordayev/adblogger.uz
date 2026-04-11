export default function Terms() {
  const sections = [
    { title: "1. Xizmatdan foydalanish", body: "adblogger.uz platformasidan foydalanish uchun 18 yoshdan katta bo'lish va haqiqiy ma'lumotlar bilan ro'yxatdan o'tish shart." },
    { title: "2. Hisob javobgarligi", body: "Hisobingiz xavfsizligi uchun siz javobgarsiz. Parolni maxfiy saqlang va uchinchi shaxslarga bermang." },
    { title: "3. Taqiqlangan harakatlar", body: "Soxta profil yaratish, spam yuborish, aldash, platformani buzish yoki boshqa foydalanuvchilarga zarar yetkazish taqiqlanadi." },
    { title: "4. Kontent qoidalari", body: "Joylashtirilgan kontent qonuniy, to'g'ri va kamsitimaydigan bo'lishi kerak. Qoidabuzarlik hisobni blokirovka qilishga olib keladi." },
    { title: "5. To'lov shartlari", body: "Barcha to'lovlar so'mda amalga oshiriladi. Qaytarish uchun 7 kun ichida murojaat qilish kerak." },
    { title: "6. Xizmat uzilishi", body: "Texnik ishlar yoki fors-major holatda xizmat vaqtincha to'xtatilishi mumkin. Bunda to'lov qaytarilmaydi." },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: "inline-block", background: "#fef2f2", color: "#dc2626",
          fontSize: 11, fontWeight: 700, letterSpacing: "1px",
          padding: "4px 12px", borderRadius: 8, marginBottom: 14,
        }}>SHARTLAR</span>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Foydalanish shartlari</h1>
        <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>Oxirgi yangilanish: 1 yanvar 2025</p>
      </div>

      <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 32, background: "#f8fafc", borderRadius: 12, padding: "20px", border: "1px solid #e2e8f0" }}>
        Ushbu shartlar adblogger.uz platformasidan foydalanishni tartibga soladi. Platformadan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map(s => (
          <div key={s.title} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "22px 24px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, background: "#fef2f2", borderRadius: 14, padding: "20px 24px", border: "1px solid #fecaca" }}>
        <p style={{ fontSize: 13.5, color: "#374151", margin: 0 }}>
          Savollar uchun: <a href="mailto:hello@addbloger.uz" style={{ color: "#dc2626", fontWeight: 700 }}>hello@addbloger.uz</a>
        </p>
      </div>
    </div>
  );
}
