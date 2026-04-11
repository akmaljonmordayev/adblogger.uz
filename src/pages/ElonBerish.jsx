import { useState } from "react";
import { LuPlus, LuImage, LuCheck, LuArrowRight } from "react-icons/lu";

const CATEGORIES = ["Texnologiya", "Marketing", "Go'zallik", "Ovqat", "Sport", "Sayohat", "Biznes", "Gaming", "Ta'lim", "Musiqa"];

export default function ElonBerish() {
  const [form, setForm] = useState({
    title: "", category: "", price: "", location: "", desc: "", phone: "", name: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%", padding: "12px 14px", fontSize: 14,
    border: "1.5px solid #e2e8f0", borderRadius: 10, outline: "none",
    background: "#fff", color: "#0f172a", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.2s",
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "#dcfce7", display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 20px",
      }}>
        <LuCheck size={32} style={{ color: "#16a34a" }} strokeWidth={2.5} />
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>E'lon muvaffaqiyatli yuborildi!</h2>
      <p style={{ fontSize: 15, color: "#64748b", marginBottom: 28 }}>E'loningiz ko'rib chiqilgandan so'ng (24 soat ichida) nashr etiladi.</p>
      <button
        onClick={() => setSubmitted(false)}
        style={{
          background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "#fff",
          padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: 700,
        }}
      >Yangi e'lon berish</button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#fef2f2", color: "#dc2626",
          fontSize: 12, fontWeight: 700, letterSpacing: "1px",
          padding: "5px 14px", borderRadius: 20, marginBottom: 16,
        }}>
          <LuPlus size={12} /> E'LON BERISH
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Yangi e'lon joylashtiring</h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>E'loningiz 10 000+ foydalanuvchiga ko'rinadi</p>
      </div>

      <div style={{
        background: "#fff", border: "1.5px solid #e2e8f0",
        borderRadius: 20, padding: "32px 28px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}>

        {/* Image upload */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>
            Rasmlar <span style={{ color: "#94a3b8", fontWeight: 400 }}>(ixtiyoriy)</span>
          </label>
          <div style={{
            height: 120, border: "2px dashed #e2e8f0", borderRadius: 12,
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 6, cursor: "pointer", background: "#f8fafc",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#dc2626"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
          >
            <LuImage size={24} style={{ color: "#94a3b8" }} />
            <span style={{ fontSize: 13, color: "#94a3b8" }}>Rasm yuklash uchun bosing yoki tortib tashlang</span>
            <span style={{ fontSize: 11, color: "#cbd5e1" }}>PNG, JPG · max 5MB</span>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>E'lon sarlavhasi *</label>
            <input style={inputStyle} placeholder="Masalan: iPhone 15 Pro Max sotiladi"
              value={form.title} onChange={e => set("title", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Kategoriya *</label>
              <select style={{ ...inputStyle, color: form.category ? "#0f172a" : "#9ca3af" }}
                value={form.category} onChange={e => set("category", e.target.value)}>
                <option value="">Tanlang...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Narx (so'm)</label>
              <input style={inputStyle} placeholder="Masalan: 1 500 000" type="text"
                value={form.price} onChange={e => set("price", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Joylashuv</label>
            <input style={inputStyle} placeholder="Shahar yoki tuman"
              value={form.location} onChange={e => set("location", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Tavsif *</label>
            <textarea
              rows={5}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
              placeholder="E'lon haqida batafsil ma'lumot yozing..."
              value={form.desc} onChange={e => set("desc", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#dc2626"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Ism *</label>
              <input style={inputStyle} placeholder="To'liq ism"
                value={form.name} onChange={e => set("name", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Telefon *</label>
              <input style={inputStyle} placeholder="+998 90 000 00 00"
                value={form.phone} onChange={e => set("phone", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#dc2626"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              border: "none", borderRadius: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              boxShadow: "0 4px 20px rgba(220,38,38,0.35)", marginTop: 4,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            E'lonni joylash <LuArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
