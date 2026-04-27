import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LuHeart, LuTrash2, LuUser, LuBriefcase,
  LuInstagram, LuYoutube, LuMapPin, LuStar,
} from "react-icons/lu";
import { toast } from "../components/ui/toast";
import { useAuthStore } from "../store/useAuthStore";

const TABS = [
  { id: "bloggers", label: "Bloggerlar", Icon: LuUser },
  { id: "ads",      label: "E'lonlar",   Icon: LuBriefcase },
];

const platformIcon = (p) => {
  if (p === "instagram") return <LuInstagram size={13} />;
  if (p === "youtube")   return <LuYoutube size={13} />;
  return null;
};

export default function Wishlist() {
  const { user } = useAuthStore();
  const [tab, setTab]         = useState("bloggers");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("adb_wishlist") || "[]");
    setWishlist(stored);
  }, []);

  const items = wishlist.filter(w => tab === "bloggers" ? w.itemType === "blogger" : w.itemType === "ad");

  const removeItem = (id) => {
    const updated = wishlist.filter(w => w._id !== id);
    setWishlist(updated);
    localStorage.setItem("adb_wishlist", JSON.stringify(updated));
    toast.success("Saqlanganlardan o'chirildi");
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
          <LuHeart size={24} style={{ color: "#dc2626" }} />
          Saqlanganlar
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
          Sevimli blogger va e'lonlaringiz — {wishlist.length} ta
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", background: "#f8fafc",
        borderRadius: 12, padding: 4, marginBottom: 24,
        border: "1px solid #f1f5f9", width: "fit-content",
      }}>
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 20px", borderRadius: 9, border: "none",
            background: tab === id ? "#fff" : "transparent",
            color:      tab === id ? "#dc2626" : "#94a3b8",
            fontWeight: tab === id ? 700 : 500,
            fontSize: 13, cursor: "pointer",
            boxShadow: tab === id ? "0 2px 8px rgba(0,0,0,.07)" : "none",
            transition: "all .2s", fontFamily: "inherit",
          }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💾</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            Hali {tab === "bloggers" ? "blogger" : "e'lon"} saqlanmagan
          </h3>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
            {tab === "bloggers" ? "Blogger profilida ❤️ belgisini bosing" : "E'lonlarda ❤️ belgisini bosing"}
          </p>
          <Link to={tab === "bloggers" ? "/bloggers" : "/ads"} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "11px 24px",
            background: "linear-gradient(135deg,#dc2626,#b91c1c)",
            color: "#fff", borderRadius: 11, textDecoration: "none",
            fontSize: 14, fontWeight: 700,
          }}>
            {tab === "bloggers" ? "Bloggerlarni ko'rish" : "E'lonlarni ko'rish"}
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {items.map(item => (
            <div key={item._id} style={{
              background: "#fff", border: "1.5px solid #e2e8f0",
              borderRadius: 16, overflow: "hidden",
              transition: "box-shadow .2s, transform .2s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,.09)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Card top */}
              <div style={{
                background: "linear-gradient(135deg,#fef2f2,#fff5f5)",
                padding: "20px 18px 16px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 20,
                  overflow: "hidden", flexShrink: 0,
                }}>
                  {item.avatar
                    ? <img src={item.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : (item.name?.[0] || "B")
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{item.name}</p>
                  {item.handle && (
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>@{item.handle}</p>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "14px 18px 16px" }}>
                {item.platforms && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                    {item.platforms.map(p => (
                      <span key={p} style={{
                        display: "flex", alignItems: "center", gap: 3,
                        background: "#f8fafc", border: "1px solid #e2e8f0",
                        borderRadius: 6, padding: "3px 8px", fontSize: 11,
                        fontWeight: 600, color: "#64748b",
                      }}>
                        {platformIcon(p)} {p}
                      </span>
                    ))}
                  </div>
                )}

                {item.rating && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                    <LuStar size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{item.rating}</span>
                    {item.location && (
                      <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6, display: "flex", alignItems: "center", gap: 3 }}>
                        <LuMapPin size={10} /> {item.location}
                      </span>
                    )}
                  </div>
                )}

                <p style={{ margin: "0 0 14px", fontSize: 11, color: "#94a3b8" }}>
                  Saqlangan: {item.savedAt}
                </p>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={item.link || "#"} style={{
                    flex: 1, padding: "8px", textAlign: "center",
                    background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                    color: "#fff", borderRadius: 9, textDecoration: "none",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    Ko'rish
                  </Link>
                  <button onClick={() => removeItem(item._id)} style={{
                    padding: "8px 10px", border: "1.5px solid #fee2e2",
                    borderRadius: 9, background: "#fef2f2", color: "#dc2626",
                    cursor: "pointer", display: "flex", alignItems: "center",
                  }}>
                    <LuTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!user && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "#fef2f2", borderRadius: 16, marginTop: 20,
        }}>
          <p style={{ fontSize: 15, color: "#374151", marginBottom: 16 }}>
            Saqlanganlarni ko'rish uchun tizimga kiring
          </p>
          <Link to="/login" style={{
            padding: "10px 24px",
            background: "linear-gradient(135deg,#dc2626,#b91c1c)",
            color: "#fff", borderRadius: 10, textDecoration: "none",
            fontSize: 14, fontWeight: 700,
          }}>Kirish</Link>
        </div>
      )}
    </div>
  );
}
