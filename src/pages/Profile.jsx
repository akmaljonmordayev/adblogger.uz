import { useState } from "react";
import { LuUser, LuSettings, LuBell, LuShield, LuLogOut, LuCamera, LuCheck } from "react-icons/lu";

const TABS = [
  { id: "profile", label: "Profil", Icon: LuUser },
  { id: "settings", label: "Sozlamalar", Icon: LuSettings },
  { id: "notifications", label: "Bildirishnomalar", Icon: LuBell },
  { id: "security", label: "Xavfsizlik", Icon: LuShield },
];

export default function Profile() {
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const inputStyle = {
    width: "100%", padding: "11px 14px", fontSize: 14,
    border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none",
    background: "#fff", color: "#0f172a", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.2s",
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#0f172a,#1e293b)",
        borderRadius: 20, padding: "32px 28px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 20,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 24, fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
            }}>AK</div>
            <button style={{
              position: "absolute", bottom: 0, right: 0,
              width: 24, height: 24, borderRadius: "50%",
              background: "#fff", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <LuCamera size={12} style={{ color: "#374151" }} />
            </button>
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>Akmal Karimov</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 8px" }}>akmal@example.com · @akmal_k</p>
            <span style={{
              background: "rgba(34,197,94,0.2)", color: "#4ade80",
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
            }}>✓ Tasdiqlangan hisob</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>

        {/* Sidebar tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 10, border: "none",
                background: tab === id ? "#fef2f2" : "transparent",
                color: tab === id ? "#dc2626" : "#374151",
                fontSize: 13.5, fontWeight: tab === id ? 700 : 500,
                cursor: "pointer", textAlign: "left",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <Icon size={15} style={{ color: tab === id ? "#dc2626" : "#9ca3af" }} />
              {label}
            </button>
          ))}

          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, border: "none",
              background: "transparent", color: "#ef4444",
              fontSize: 13.5, fontWeight: 500, cursor: "pointer", width: "100%",
            }}>
              <LuLogOut size={15} /> Chiqish
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 18, padding: "28px" }}>
          {tab === "profile" && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 22 }}>Shaxsiy ma'lumotlar</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                {[
                  { label: "Ism", placeholder: "Akmal", default: "Akmal" },
                  { label: "Familiya", placeholder: "Karimov", default: "Karimov" },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>{f.label}</label>
                    <input style={inputStyle} defaultValue={f.default}
                      onFocus={e => e.target.style.borderColor = "#dc2626"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
                <input style={inputStyle} defaultValue="akmal@example.com" type="email"
                  onFocus={e => e.target.style.borderColor = "#dc2626"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Telefon</label>
                <input style={inputStyle} defaultValue="+998 90 123 45 67"
                  onFocus={e => e.target.style.borderColor = "#dc2626"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              <button
                onClick={handleSave}
                style={{
                  padding: "12px 28px",
                  background: saved ? "#16a34a" : "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  border: "none", borderRadius: 11, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: saved ? "0 4px 16px rgba(22,163,74,0.3)" : "0 4px 16px rgba(220,38,38,0.3)",
                  transition: "background 0.3s",
                }}
              >
                {saved ? <><LuCheck size={15} strokeWidth={3} /> Saqlandi</> : "O'zgarishlarni saqlash"}
              </button>
            </div>
          )}

          {tab !== "profile" && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
              <p style={{ fontSize: 15 }}>{TABS.find(t => t.id === tab)?.label} bo'limi tez orada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
