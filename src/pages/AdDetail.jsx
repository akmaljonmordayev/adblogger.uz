import { useParams, Link } from "react-router-dom";
import { LuArrowLeft, LuCalendar, LuMapPin, LuTag, LuDollarSign, LuEye, LuShare2, LuPhone } from "react-icons/lu";

const ADS = {
  1: { title: "Samsung Galaxy S25 Ultra — rasmiy diler", category: "Texnologiya", price: "15 990 000", location: "Toshkent", date: "12 aprel 2025", views: 1240, desc: "Eng yangi Samsung Galaxy S25 Ultra smartfoni. 200MP kamera, 12GB RAM, 512GB xotira. Rasmiy kafolat 2 yil. Kredit va bo'lib to'lash mavjud.", images: 3, seller: "TechStore Uz" },
  2: { title: "Instagram reklama — 100K+ auditoriya", category: "Marketing", price: "500 000", location: "Online", date: "11 aprel 2025", views: 890, desc: "100K+ aktiv obunachilar bilan Instagram sahifasida reklama. 18-35 yoshli auditoriya. Engagement rate 4.5%. Story + post formatida.", images: 2, seller: "Bloger Agency" },
};

export default function AdDetail() {
  const { id } = useParams();
  const ad = ADS[id] || ADS[1];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 20px 60px" }}>

      <Link to="/ads" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500,
        marginBottom: 28,
      }}>
        <LuArrowLeft size={15} /> E'lonlarga qaytish
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        <div>
          {/* Image placeholder */}
          <div style={{
            height: 300, borderRadius: 16, marginBottom: 24,
            background: "linear-gradient(135deg,#1e3a5f,#0f172a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.3)", fontSize: 64,
          }}>📦</div>

          <span style={{
            display: "inline-block", background: "#fef2f2", color: "#dc2626",
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 8, marginBottom: 14,
          }}>{ad.category.toUpperCase()}</span>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, margin: "0 0 16px" }}>{ad.title}</h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
            {[
              { Icon: LuMapPin, text: ad.location },
              { Icon: LuCalendar, text: ad.date },
              { Icon: LuEye, text: `${ad.views} ko'rilgan` },
            ].map(({ Icon, text }) => (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                <Icon size={13} /> {text}
              </span>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Tavsif</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>{ad.desc}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{
            background: "#fff", border: "1.5px solid #e2e8f0",
            borderRadius: 20, padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#dc2626", fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>
              {ad.price} <span style={{ fontSize: 14, color: "#64748b", fontFamily: "inherit" }}>so'm</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Sotuvchi: <strong style={{ color: "#0f172a" }}>{ad.seller}</strong></div>

            <button style={{
              width: "100%", padding: "13px",
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
              <LuPhone size={14} /> Bog'lanish
            </button>

            <button style={{
              width: "100%", padding: "12px",
              border: "1.5px solid #e2e8f0", borderRadius: 12,
              background: "#fff", color: "#374151",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <LuShare2 size={14} /> Ulashish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
