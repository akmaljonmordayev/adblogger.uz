import { useParams, Link } from "react-router-dom";
import { LuArrowLeft, LuUsers, LuTrendingUp, LuStar, LuMapPin, LuCheck, LuMessageCircle } from "react-icons/lu";
import { initialBloggers } from "./Bloggers"; // Blogers.jsx dagi massiv

export default function BloggerDetail() {
  const { id } = useParams();
  
  // 1. Haqiqiy ma'lumotni massivdan qidirib topamiz
  const blogger = initialBloggers.find((item) => item.id === Number(id));

  // 2. Agar bloger topilmasa, xato bermasligi uchun tekshiramiz
  if (!blogger) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold">Blogger topilmadi!</h2>
        <Link to="/bloggers" className="text-red-600 underline">Ro'yxatga qaytish</Link>
      </div>
    );
  }

  // 3. Statistika uchun blogger ma'lumotlarini tayyorlaymiz
  const stats = [
    { label: "Obunachilar", value: blogger.followers, Icon: LuUsers },
    { label: "Engagement", value: blogger.engagement, Icon: LuTrendingUp },
    { label: "Reyting", value: "4.9", Icon: LuStar }, // Default qiymat
    { label: "Bitimlar", value: "40+", Icon: LuCheck }, // Default qiymat
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 20px 60px" }}>
      
      {/* Linkni constants dagi /bloggers ga mosladik */}
      <Link to="/bloggers" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500,
        marginBottom: 28, marginTop: 20
      }}>
        <LuArrowLeft/> Blogerlarga qaytish
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>

        {/* Chap tomon (Asosiy ma'lumotlar) */}
        <div>
          <div style={{
            background: "#fff", border: "1.5px solid #e2e8f0",
            borderRadius: 20, padding: "28px", marginBottom: 20,
          }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: blogger.gradient || "#2563eb", // Bloggerning o'z gradiyenti
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 26, fontWeight: 800,
                flexShrink: 0,
              }}>
                {blogger.name.charAt(0)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>{blogger.name}</h1>
                  {blogger.isVerified && (
                    <span style={{
                      background: "#dcfce7", color: "#16a34a",
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                      display: "flex", alignItems: "center", gap: 3,
                    }}>
                      <LuCheck size={9} strokeWidth={3} /> Tasdiqlangan
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13.5, color: "#64748b", marginBottom: 10 }}>{blogger.username}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    background: "#fef2f2", color: "#dc2626",
                    fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 8,
                  }}>{blogger.categoryText}</span>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 12, color: "#64748b",
                  }}>
                    <LuMapPin size={12} /> O'zbekiston
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12,
              marginTop: 24, paddingTop: 24, borderTop: "1px solid #f1f5f9",
            }}>
              {stats.map(({ label, value, Icon }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <Icon size={11} /> {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio (Har bir blogger uchun dinamik qilsa bo'ladi) */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Bio</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>
              {blogger.name} - {blogger.categoryText} yo'nalishida {blogger.platform} platformasidagi mashhur ijodkor. 
              Uning auditoriyasi asosan faol foydalanuvchilardan tashkil topgan.
            </p>
          </div>
        </div>

        {/* O'ng tomon (Buyurtma paneli) */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{
            background: "#fff", border: "1.5px solid #e2e8f0",
            borderRadius: 20, padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Boshlang'ich narx</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>
                {blogger.price} <span style={{ fontSize: 14, color: "#64748b" }}>so'm</span>
              </div>
            </div>

            <button style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              border: "none", borderRadius: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: "0 4px 20px rgba(220,38,38,0.35)", marginBottom: 10,
            }}>
              Reklama buyurtma qilish
            </button>

            <button style={{
              width: "100%", padding: "13px",
              border: "1.5px solid #e2e8f0", borderRadius: 12,
              background: "#fff", color: "#374151",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <LuMessageCircle size={15} /> Xabar yuborish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}