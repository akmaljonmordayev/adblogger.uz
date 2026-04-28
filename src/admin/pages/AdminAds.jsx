import React, { useState, useMemo } from "react";

/* ─── KENGAYTIRILGAN MOCK DATA (Barcha maydonlar bilan) ─── */
const INITIAL_ADS = [
  {
    id: "B-001",
    userType: "blogger",
    status: "Kutilmoqda",
    date: "2026-04-28",
    name: "Alisher Uzoqov",
    phone: "+998 90 123 45 67",
    platforms: ["Instagram", "Telegram"],
    followers: "100k - 500k",
    niches: ["Lifestyle", "Texnologiya", "Gaming"],
    services: ["Post (feed)", "Story", "Reel / Shorts"],
    prices: { post: "1,200,000", story: "600,000", video: "3,000,000" },
    portfolio: "https://portfolio.uz/alisher",
    about: "Asosan texnologiya va gadjetlar haqida sifatli kontent tayyorlayman.",
  },
  {
    id: "B-002",
    userType: "blogger",
    status: "Faol",
    date: "2026-04-27",
    name: "Sardor Tech",
    phone: "+998 91 777 88 99",
    platforms: ["YouTube", "Instagram"],
    followers: "500k - 1M",
    niches: ["Texnologiya", "Review"],
    services: ["Video review", "Shorts"],
    prices: { post: "2,000,000", story: "800,000", video: "5,000,000" },
    portfolio: "https://portfolio.uz/sardor",
    about: "Smartfon va texnika reviewlari bilan shug‘ullanaman.",
  },
  {
    id: "B-003",
    userType: "blogger",
    status: "Faol",
    date: "2026-04-25",
    name: "Madina Life",
    phone: "+998 93 555 44 33",
    platforms: ["Instagram"],
    followers: "50k - 100k",
    niches: ["Lifestyle", "Beauty"],
    services: ["Post", "Story"],
    prices: { post: "700,000", story: "300,000", video: "1,500,000" },
    portfolio: "https://portfolio.uz/madina",
    about: "Beauty va kundalik hayot haqida kontent qilaman.",
  },
   {
    id: "C-102",
    userType: "business",
    status: "Faol",
    date: "2026-04-28",
    companyName: "Shirin Zavodi",
    contactPerson: "E'zoza Rahmonova",
    phone: "+998 99 888 77 66",
    activityType: "Oziq-ovqat",
    productName: "Shirin Premium konfetlari",
    productDesc: "Yangi turdagi shokoladli konfetlar, shakarsiz va tabiiy.",
    reqPlatforms: ["Instagram", "YouTube"],
    reqBloggerTypes: ["Food bloger", "Lifestyle bloger"],
    targetAudience: "20-35 yosh, ayollar",
    budget: "10,000,000",
    duration: "1 oy",
    location: "Toshkent sh.",
    goal: "Brend taniqliligini oshirish",
  },
  {
    id: "C-103",
    userType: "business",
    status: "Kutilmoqda",
    date: "2026-04-26",
    companyName: "Tech Market",
    contactPerson: "Jasur Aliyev",
    phone: "+998 90 999 00 11",
    activityType: "Elektronika",
    productName: "Smartfonlar",
    productDesc: "Yangi model smartfonlar arzon narxda.",
    reqPlatforms: ["YouTube", "Telegram"],
    reqBloggerTypes: ["Texno bloger"],
    targetAudience: "18-40 yosh",
    budget: "20,000,000",
    duration: "2 oy",
    location: "Toshkent",
    goal: "Sotuvni oshirish",
  },
  {
    id: "C-104",
    userType: "business",
    status: "Faol",
    date: "2026-04-24",
    companyName: "FitLife",
    contactPerson: "Dilnoza Karimova",
    phone: "+998 97 222 33 44",
    activityType: "Sport / Fitness",
    productName: "Fitness abonement",
    productDesc: "Ayollar uchun maxsus fitness dasturi.",
    reqPlatforms: ["Instagram"],
    reqBloggerTypes: ["Fitness bloger", "Lifestyle bloger"],
    targetAudience: "18-35 yosh, ayollar",
    budget: "8,000,000",
    duration: "1 oy",
    location: "Toshkent",
    goal: "Yangi mijoz jalb qilish",
  }
];

/* ─── YORDAMCHI KOMPONENTLAR ─── */
const Badge = ({ text, color = "#475569", bg = "#F1F5F9" }) => (
  <span style={{ padding: "4px 10px", background: bg, borderRadius: 8, fontSize: 11, fontWeight: 700, color: color, border: "1px solid rgba(0,0,0,0.05)", marginRight: 4, marginBottom: 4, display: "inline-block" }}>
    {text}
  </span>
);

const StatusBadge = ({ status }) => {
  const styles = {
    "Kutilmoqda": { bg: "#FFFBEB", text: "#D97706" },
    "Faol": { bg: "#ECFDF5", text: "#059669" },
    "Rad etilgan": { bg: "#FEF2F2", text: "#DC2626" }
  };
  const s = styles[status] || styles["Kutilmoqda"];
  return <Badge text={status} color={s.text} bg={s.bg} />;
};

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
    {children} <div style={{ flex: 1, height: "1px", background: "#F1F5F9" }}></div>
  </div>
);

/* ─── BATAFSIL MODAL (Restored all fields) ─── */
function DetailModal({ ad, onClose, onAction }) {
  if (!ad) return null;
  const isBlogger = ad.userType === "blogger";

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 28, width: "100%", maxWidth: 650, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", position: "relative" }}>
        
        {/* Header */}
        <div style={{ padding: "24px 32px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", zIndex: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ padding: "6px 14px", borderRadius: 10, background: isBlogger ? "#EEF2FF" : "#FFF7ED", color: isBlogger ? "#4F46E5" : "#EA580C", fontSize: 12, fontWeight: 800 }}>
                {isBlogger ? "🤳 BLOGER" : "💼 BIZNES"}
              </span>
              <span style={{ fontSize: 14, color: "#94A3B8", fontWeight: 600 }}>ID: {ad.id}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F5F9", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontWeight: "bold", color: "#64748B" }}>✕</button>
        </div>

        <div style={{ padding: "0 32px 32px" }}>
          {isBlogger ? (
            <>
              <SectionTitle>Shaxsiy ma'lumotlar</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Ism-familiya</label><div style={{ fontWeight: 700, fontSize: 16 }}>{ad.name}</div></div>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Telefon</label><div style={{ fontWeight: 700, fontSize: 16 }}>{ad.phone}</div></div>
              </div>

              <SectionTitle>Platformalar va Obunachilar</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Platformalar</label>
                  <div style={{ marginTop: 6 }}>{ad.platforms.map(p => <Badge key={p} text={p} bg="#F8FAFC" />)}</div>
                </div>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Obunachilar soni</label><div style={{ fontWeight: 700 }}>{ad.followers}</div></div>
              </div>

              <div style={{ marginTop: 15 }}>
                <label style={{ fontSize: 12, color: "#94A3B8" }}>Nishalar (Yo'nalishlar)</label>
                <div style={{ marginTop: 6 }}>{ad.niches.map(n => <Badge key={n} text={n} bg="#EEF2FF" color="#4F46E5" />)}</div>
              </div>

              <SectionTitle>Xizmatlar va Narxlar (so'm)</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {Object.entries(ad.prices).map(([key, val]) => (
                  <div key={key} style={{ padding: 12, background: "#F8FAFC", borderRadius: 16, border: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", fontWeight: 800 }}>{key}</div>
                    <div style={{ fontWeight: 800, color: "#1E293B", fontSize: 15 }}>{val}</div>
                  </div>
                ))}
              </div>

              <SectionTitle>Qo'shimcha</SectionTitle>
              <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, color: "#94A3B8" }}>Portfolio</label>
                <div><a href={ad.portfolio} target="_blank" rel="noreferrer" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>{ad.portfolio}</a></div>
              </div>
              <div><label style={{ fontSize: 12, color: "#94A3B8" }}>O'zi haqida</label>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#475569", marginTop: 6, background: "#F8FAFC", padding: 12, borderRadius: 12 }}>{ad.about}</p>
              </div>
            </>
          ) : (
            <>
              <SectionTitle>Kompaniya va Aloqa</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Brend nomi</label><div style={{ fontWeight: 700, fontSize: 16 }}>{ad.companyName}</div></div>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Aloqa shaxsi</label><div style={{ fontWeight: 700 }}>{ad.contactPerson}</div></div>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Telefon</label><div style={{ fontWeight: 700 }}>{ad.phone}</div></div>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Faoliyat turi</label><div style={{ fontWeight: 700 }}>{ad.activityType}</div></div>
              </div>

              <SectionTitle>Mahsulot va Kampaniya</SectionTitle>
              <div style={{ background: "#FFF7ED", padding: 16, borderRadius: 16, marginBottom: 16 }}>
                <div style={{ fontWeight: 800, color: "#9A3412", fontSize: 16, marginBottom: 4 }}>{ad.productName}</div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.5, margin: 0 }}>{ad.productDesc}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Platformalar</label>
                  <div style={{ marginTop: 4 }}>{ad.reqPlatforms.map(p => <Badge key={p} text={p} bg="#fff" />)}</div>
                </div>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Bloger turi</label>
                  <div style={{ marginTop: 4 }}>{ad.reqBloggerTypes.map(b => <Badge key={b} text={b} bg="#fff" />)}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Budjet</label><div style={{ fontWeight: 800, color: "#059669", fontSize: 18 }}>{ad.budget} so'm</div></div>
                <div><label style={{ fontSize: 12, color: "#94A3B8" }}>Joylashuv</label><div style={{ fontWeight: 700 }}>{ad.location}</div></div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, color: "#94A3B8" }}>Maqsadli auditoriya</label>
                <div style={{ fontSize: 14, color: "#1E293B", fontWeight: 600, marginTop: 4 }}>{ad.targetAudience}</div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            {ad.status === "Kutilmoqda" ? (
              <>
                <button onClick={() => onAction(ad.id, "Faol")} style={{ flex: 1, padding: "16px", borderRadius: 16, border: "none", background: "#10B981", color: "#fff", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(16,185,129,0.3)" }}>TASDIQLASH</button>
                <button onClick={() => onAction(ad.id, "Rad etilgan")} style={{ flex: 1, padding: "16px", borderRadius: 16, border: "none", background: "#F43F5E", color: "#fff", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(244,63,94,0.3)" }}>RAD ETISH</button>
              </>
            ) : (
              <button onClick={onClose} style={{ flex: 1, padding: "16px", borderRadius: 16, border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontWeight: 800, cursor: "pointer" }}>YOPISH</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ASOSIY DASHBOARD ─── */
export default function AdminDashboard() {
  const [ads, setAds] = useState(INITIAL_ADS);
  const [activeTab, setActiveTab] = useState("blogger");
  const [selectedAd, setSelectedAd] = useState(null);

  const stats = useMemo(() => ({
    total: ads.length,
    pending: ads.filter(a => a.status === "Kutilmoqda").length,
    active: ads.filter(a => a.status === "Faol").length,
  }), [ads]);

  const list = useMemo(() => ads.filter(a => a.userType === activeTab), [ads, activeTab]);

  const handleAction = (id, newStatus) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setSelectedAd(null);
  };

  return (
    <div style={{ padding: "40px 20px", background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', system-ui" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", margin: 0 }}>Admin Panel</h1>
          <p style={{ color: "#64748B", marginTop: 8 }}>E'lonlarni boshqarish va sifat nazorati</p>
        </header>

        {/* Statistika Kartochkalari */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          <div style={statCardStyle}><div style={statLabelStyle}>Jami</div><div style={statValueStyle}>{stats.total}</div></div>
          <div style={{ ...statCardStyle, borderLeft: "4px solid #D97706" }}><div style={statLabelStyle}>Kutilmoqda</div><div style={{ ...statValueStyle, color: "#D97706" }}>{stats.pending}</div></div>
          <div style={{ ...statCardStyle, borderLeft: "4px solid #059669" }}><div style={statLabelStyle}>Faol</div><div style={{ ...statValueStyle, color: "#059669" }}>{stats.active}</div></div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, background: "#E2E8F0", padding: 6, borderRadius: 16, width: "fit-content" }}>
          <button onClick={() => setActiveTab("blogger")} style={tabStyle(activeTab === "blogger")}>🤳 Blogerlar</button>
          <button onClick={() => setActiveTab("business")} style={tabStyle(activeTab === "business")}>💼 Biznes</button>
        </div>

        {/* JADVAL */}
        <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                <th style={thStyle}>ID / Sana</th>
                <th style={thStyle}>{activeTab === "blogger" ? "Bloger" : "Kompaniya"}</th>
                <th style={thStyle}>Yo'nalish</th>
                <th style={thStyle}>Narx / Budjet</th>
                <th style={thStyle}>Holat</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Amal</th>
              </tr>
            </thead>
            <tbody>
              {list.map(ad => (
                <tr key={ad.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 800, color: "#1E293B" }}>{ad.id}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{ad.date}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700 }}>{activeTab === "blogger" ? ad.name : ad.companyName}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{ad.phone}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: 13, color: "#475569" }}>{activeTab === "blogger" ? ad.niches[0] : ad.productName}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 800 }}>{activeTab === "blogger" ? ad.prices.post : ad.budget} <span style={{ fontSize: 10, color: "#94A3B8" }}>so'm</span></div>
                  </td>
                  <td style={tdStyle}><StatusBadge status={ad.status} /></td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <button onClick={() => setSelectedAd(ad)} style={viewBtnStyle}>Ko'rish</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>E'lonlar mavjud emas</div>}
        </div>
      </div>

      <DetailModal ad={selectedAd} onClose={() => setSelectedAd(null)} onAction={handleAction} />
    </div>
  );
}

/* ─── STYLES ─── */
const thStyle = { padding: "16px 24px", fontSize: 12, fontWeight: 800, color: "#64748B", textTransform: "uppercase" };
const tdStyle = { padding: "18px 24px" };
const statCardStyle = { background: "#fff", padding: "20px 24px", borderRadius: 20, border: "1px solid #E2E8F0" };
const statLabelStyle = { fontSize: 13, color: "#64748B", fontWeight: 600, marginBottom: 4 };
const statValueStyle = { fontSize: 28, fontWeight: 900, color: "#0F172A" };
const viewBtnStyle = { padding: "8px 16px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "0.2s" };
const tabStyle = (active) => ({
  padding: "10px 24px", borderRadius: 12, border: "none", fontWeight: 800, cursor: "pointer", fontSize: 14,
  background: active ? "#fff" : "transparent", color: active ? "#0F172A" : "#64748B", boxShadow: active ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none"
});