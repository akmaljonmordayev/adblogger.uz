import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LuArrowLeft, LuUsers, LuTrendingUp, LuStar, LuMapPin,
  LuCheck, LuMessageCircle, LuInfo, LuLayoutDashboard,
  LuImage, LuVideo, LuX, LuHeart,
} from "react-icons/lu";
import { toast } from "../components/ui/toast";
import { initialBloggers } from "./Bloggers";

export default function BloggerDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("pricing");
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("adb_wishlist") || "[]");
    setInWishlist(stored.some(w => w._id === id));
  }, [id]);

  const toggleWishlist = (blogger) => {
    const stored = JSON.parse(localStorage.getItem("adb_wishlist") || "[]");
    if (inWishlist) {
      const updated = stored.filter(w => w._id !== id);
      localStorage.setItem("adb_wishlist", JSON.stringify(updated));
      setInWishlist(false);
      toast.success("Saqlanganlardan o'chirildi");
    } else {
      const item = {
        _id: id, itemType: "blogger",
        name: `${blogger.name}`,
        handle: blogger.handle || blogger.username,
        platforms: blogger.platforms || [],
        rating: blogger.rating || blogger.stars,
        avatar: blogger.avatar || blogger.image,
        location: blogger.location,
        link: `/bloggers/${id}`,
        savedAt: new Date().toLocaleDateString("uz-UZ"),
      };
      localStorage.setItem("adb_wishlist", JSON.stringify([...stored, item]));
      setInWishlist(true);
      toast.success("Saqlanganlariga qo'shildi ❤️");
    }
  };
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);

  const blogger = initialBloggers.find((item) => item.id === Number(id));

  if (!blogger) return <div className="p-20 text-center">Blogger topilmadi!</div>;

  const stats = [
    { label: "Obunachilar", value: blogger.followers, Icon: LuUsers },
    { label: "Engagement", value: blogger.engagement, Icon: LuTrendingUp },
    { label: "Reyting", value: "4.9", Icon: LuStar },
    { label: "Bitimlar", value: "40+", Icon: LuCheck },
  ];

  // Narxni hisoblashda xatolik bermasligi uchun raqamga aylantirish funksiyasi
  const getPrice = (multiplier) => {
    const basePrice = parseInt(String(blogger.price).replace(/\s/g, '')) || 0;
    return (basePrice * multiplier).toLocaleString();
  };

  const packages = [
    { id: 1, name: "Stories", price: blogger.price, desc: "15-soniyalik 3ta story + Link", icon: LuImage },
    { id: 2, name: "Reels / Post", price: getPrice(2.5), desc: "Asosiy lentada doimiy post yoki Reels", icon: LuVideo },
    { id: 3, name: "Full Integration", price: getPrice(5), desc: "Story + Reels + Telegram kanal", icon: LuLayoutDashboard }, // TO'G'IRLANDI
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
      
      <Link to="/bloggers" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, marginBottom: 20 }}>
        <LuArrowLeft size={16}/> Blogerlar ro'yxatiga qaytish
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        
        {/* LEFT COLUMN */}
        <div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 32, marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ 
                width: 100, height: 100, borderRadius: 24, background: blogger.gradient || "#3b82f6",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 36, fontWeight: 800 
              }}>
                {blogger.name.charAt(0)}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: 0 }}>{blogger.name}</h1>
                  {blogger.isVerified && (
                    <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <LuCheck size={12}/> Tasdiqlangan
                    </span>
                  )}
                </div>
                <p style={{ color: "#64748b", marginBottom: 16 }}>{blogger.username} • {blogger.platform}</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ background: "#f1f5f9", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{blogger.categoryText}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: 13 }}><LuMapPin size={14}/> O'zbekiston</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 32, paddingTop: 32, borderTop: "1px solid #f1f5f9" }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <s.Icon size={13}/> {s.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20, display: "flex", gap: 24, borderBottom: "1px solid #e2e8f0" }}>
            {["pricing", "audience", "reviews"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 4px", border: "none", background: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 600, color: activeTab === tab ? "#dc2626" : "#64748b",
                  borderBottom: activeTab === tab ? "2px solid #dc2626" : "2px solid transparent",
                  transition: "0.2s"
                }}
              >
                {tab === "pricing" ? "Tariflar" : tab === "audience" ? "Auditoriya" : "Sharhlar"}
              </button>
            ))}
          </div>

          {activeTab === "pricing" && (
            <div style={{ display: "grid", gap: 16 }}>
              {packages.map(pkg => (
                <div key={pkg.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, border: "1px solid #e2e8f0", borderRadius: 16, background: "#fff" }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ background: "#fef2f2", color: "#dc2626", padding: 10, borderRadius: 12 }}><pkg.icon size={24}/></div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{pkg.name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{pkg.desc}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{pkg.price} <small style={{ fontSize: 11 }}>UZS</small></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ position: "sticky", top: 20 }}>
          <div style={{ background: "#0f172a", borderRadius: 24, padding: 28, color: "#fff" }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Reklama berish</h3>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>Brendingizni {blogger.name} bilan birga rivojlantiring.</p>
            
            <button
              onClick={() => setIsOrderOpen(true)}
              style={{ width: "100%", padding: 16, background: "#dc2626", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
              Buyurtma berish
            </button>
            <button
              onClick={() => setIsMsgOpen(true)}
              style={{ width: "100%", padding: 16, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
              Xabar yuborish
            </button>
            <button
              onClick={() => toggleWishlist(blogger)}
              style={{
                width: "100%", padding: 14,
                background: inWishlist ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.06)",
                color: inWishlist ? "#f87171" : "rgba(255,255,255,0.7)",
                border: `1.5px solid ${inWishlist ? "rgba(220,38,38,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                fontSize: 14,
              }}>
              <LuHeart size={15} style={{ fill: inWishlist ? "#f87171" : "none" }} />
              {inWishlist ? "Saqlanganlardan o'chirish" : "Saqlanganlariga qo'shish"}
            </button>

            <div style={{ marginTop: 24, padding: 16, background: "rgba(255,255,255,0.05)", borderRadius: 12, fontSize: 12, color: "#94a3b8", display: "flex", gap: 8 }}>
              <LuInfo size={16} style={{ flexShrink: 0 }}/>
              To'lov xavfsizligi kafolatlanadi. Mablag' bloger ishini tugatgandan so'ng o'tkazib beriladi.
            </div>
          </div>
        </div>
      </div>

      {isOrderOpen && <OrderModal onClose={() => setIsOrderOpen(false)} bloggerName={blogger.name} />}
      {isMsgOpen && <MessageModal onClose={() => setIsMsgOpen(false)} bloggerName={blogger.name} />}
    </div>
  );
}

// --- MODAL KOMPONENTLARI ---

function OrderModal({ onClose, bloggerName }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0 }}>Reklama buyurtmasi: {bloggerName}</h3>
          <button onClick={onClose} style={closeBtnStyle}><LuX size={20}/></button>
        </div>
        <form style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
          <div>
            <label style={labelStyle}>Loyiha yoki Brend nomi</label>
            <input type="text" placeholder="Masalan: 'Poytaxt' o'quv markazi" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Reklama formati</label>
            <select style={inputStyle}>
              <option>Story (3ta)</option>
              <option>Post / Reels</option>
              <option>Full Integration</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Maqsad va havola</label>
            <textarea placeholder="Reklama haqida qisqacha ma'lumot va linklar..." style={{ ...inputStyle, height: 100 }}></textarea>
          </div>
          <button type="button" onClick={() => { alert("Buyurtma yuborildi!"); onClose(); }} style={primaryBtnStyle}>So'rovni yuborish</button>
        </form>
      </div>
    </div>
  );
}

function MessageModal({ onClose, bloggerName }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0 }}>{bloggerName}ga xabar</h3>
          <button onClick={onClose} style={closeBtnStyle}><LuX size={20}/></button>
        </div>
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>Savollaringiz bo'lsa to'g'ridan-to'g'ri blogerga yozishingiz mumkin.</p>
          <textarea placeholder="Xabaringizni yozing..." style={{ ...inputStyle, height: 150 }}></textarea>
          <button type="button" onClick={() => { alert("Xabar yuborildi!"); onClose(); }} style={{ ...primaryBtnStyle, marginTop: 16 }}>Xabarni jo'natish</button>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(4px)" };
const modalContentStyle = { background: "#fff", width: "100%", maxWidth: 500, borderRadius: 24, padding: 32, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" };
const modalHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: 16 };
const closeBtnStyle = { border: "none", background: "none", cursor: "pointer", color: "#64748b" };
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" };
const primaryBtnStyle = { width: "100%", padding: 16, background: "#dc2626", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer" };