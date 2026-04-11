import { useParams, Link } from "react-router-dom";
import { LuArrowLeft, LuInstagram, LuYoutube, LuUsers, LuTrendingUp, LuStar, LuMapPin, LuCheck, LuMessageCircle } from "react-icons/lu";

const BLOGGERS = {
  1: { name: "Sardor Raximov", username: "@sardor_tech", category: "Texnologiya", platform: "instagram", followers: "245K", er: "4.8%", location: "Toshkent", rating: 4.9, reviews: 42, price: "850 000", bio: "Texnologiya va gadjetlar haqida o'zbek tilida kontent yaratayman. Auditoriyam 18-35 yoshli yigitlar.", initials: "SR", color: "#2563eb" },
  2: { name: "Nodira Azimova", username: "@nodira_beauty", category: "Go'zallik", platform: "instagram", followers: "380K", er: "5.2%", location: "Toshkent", rating: 4.8, reviews: 67, price: "1 200 000", bio: "Go'zallik, makiyaj va parvarish haqida mukammal kontent. Aksariyat auditoriyam ayollar.", initials: "NA", color: "#ec4899" },
};

export default function BloggerDetail() {
  const { id } = useParams();
  const b = BLOGGERS[id] || BLOGGERS[1];

  const stats = [
    { label: "Obunachilar", value: b.followers, Icon: LuUsers },
    { label: "Engagement", value: b.er, Icon: LuTrendingUp },
    { label: "Reyting", value: b.rating, Icon: LuStar },
    { label: "Bitimlar", value: b.reviews, Icon: LuCheck },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 20px 60px" }}>

      <Link to="/blogerlar" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500,
        marginBottom: 28,
      }}>
        <LuArrowLeft size={15} /> Blogerlarga qaytish
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>

        {/* Left */}
        <div>
          {/* Profile card */}
          <div style={{
            background: "#fff", border: "1.5px solid #e2e8f0",
            borderRadius: 20, padding: "28px", marginBottom: 20,
          }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `linear-gradient(135deg, ${b.color}, ${b.color}99)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 26, fontWeight: 800,
                flexShrink: 0, fontFamily: "'Syne', sans-serif",
              }}>{b.initials}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>{b.name}</h1>
                  <span style={{
                    background: "#dcfce7", color: "#16a34a",
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    <LuCheck size={9} strokeWidth={3} /> Tasdiqlangan
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: "#64748b", marginBottom: 10 }}>{b.username}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    background: "#fef2f2", color: "#dc2626",
                    fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 8,
                  }}>{b.category}</span>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 12, color: "#64748b",
                  }}>
                    <LuMapPin size={12} /> {b.location}
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
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <Icon size={11} /> {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Bio</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>{b.bio}</p>
          </div>

          {/* Reviews */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Sharhlar ({b.reviews})</h3>
            {[1, 2].map(i => (
              <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Brend {i}</span>
                  <span style={{ display: "flex", gap: 2 }}>
                    {[...Array(5)].map((_, j) => <LuStar key={j} size={12} style={{ color: "#f59e0b" }} fill="#f59e0b" />)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.65 }}>
                  Juda professional, o'z vaqtida kontent tayyorladi. Auditoriyasi bilan yaxshi muloqot qiladi.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Order card */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{
            background: "#fff", border: "1.5px solid #e2e8f0",
            borderRadius: 20, padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Boshlang'ich narx</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
                {b.price} <span style={{ fontSize: 14, color: "#64748b", fontFamily: "'Inter'" }}>so'm</span>
              </div>
            </div>

            <button style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              border: "none", borderRadius: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: "0 4px 20px rgba(220,38,38,0.35)", marginBottom: 10,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
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

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {["Tasdiqlangan bloger", "Kafolatlangan xizmat", "Tez javob (avg 2h)"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#64748b" }}>
                  <LuCheck size={13} style={{ color: "#16a34a" }} strokeWidth={2.5} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
