import { useParams, Link } from "react-router-dom";
import { LuArrowLeft, LuCalendar, LuClock, LuEye, LuShare2, LuBookmark } from "react-icons/lu";

const POSTS = {
  1: {
    title: "Instagram blogerlari bilan reklama berishning 10 ta usuli",
    author: "Asilbek Nazarov", avatar: "AN", date: "15 mart 2025", readTime: "7 daqiqa", views: 4820,
    category: "Marketing", tag: "#instagram #reklama",
    body: `Bugungi raqamli dunyoda Instagram blogerlari orqali reklama berish eng samarali usullardan biri hisoblanadi. Bu maqolada biz eng yaxshi 10 ta usulni ko'rib chiqamiz.

**1. To'g'ri bloger tanlash**
Auditoriyangizga mos bloger tanlash eng muhim qadam. Faqat obunachilar soniga emas, engagement rate ga ham e'tibor bering.

**2. Micro-blogerlar bilan ishlash**
10K–100K obunachili blogerlar ko'pincha yirik blogerlarga qaraganda yuqoriroq engagement ko'rsatadi va narxi ancha qulay.

**3. Stories va Reels formatidan foydalaning**
Videoformat statik rasmga qaraganda 3x ko'proq ko'riladi va brendni yaxshiroq taqdim etadi.

**4. Uzoq muddatli hamkorlik**
Bir martalik postdan ko'ra, uzoq muddatli hamkorlik brend ishonchini oshiradi.

**5. Aniq KPI belgilang**
Har bir kampaniya uchun o'lchash mumkin bo'lgan maqsadlar qo'ying: cover, CPC, CR.`,
    related: [2, 3],
  },
  2: {
    title: "YouTube reklama kampaniyasini qanday rejalashtirish kerak",
    author: "Dilnoza Yusupova", avatar: "DY", date: "10 mart 2025", readTime: "5 daqiqa", views: 3210,
    category: "Video Marketing", tag: "#youtube #video",
    body: `YouTube — o'zbekiston auditoriyasiga yetish uchun eng kuchli platformalardan biri. Bu maqolada muvaffaqiyatli kampaniya rejalashtirishni o'rganamiz.`,
    related: [1, 3],
  },
  3: {
    title: "Bloger bilan shartnoma tuzishda e'tibor bering",
    author: "Jasur Mirzayev", avatar: "JM", date: "5 mart 2025", readTime: "4 daqiqa", views: 2780,
    category: "Huquq", tag: "#shartnoma #huquq",
    body: `Bloger bilan ishlashda to'g'ri shartnoma tuzish har ikki tomonni himoya qiladi. Eng muhim nuqtalarni ko'rib chiqamiz.`,
    related: [1, 2],
  },
};

export default function BlogDetail() {
  const { id } = useParams();
  const post = POSTS[id] || POSTS[1];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 780, margin: "0 auto", padding: "0 20px 60px" }}>

      <Link to="/blog" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500,
        marginBottom: 28, padding: "6px 0",
      }}>
        <LuArrowLeft size={15} /> Bloglarga qaytish
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span style={{
          display: "inline-block", background: "#fef2f2", color: "#dc2626",
          fontSize: 11, fontWeight: 700, letterSpacing: "1px",
          padding: "4px 12px", borderRadius: 8, marginBottom: 16,
        }}>
          {post.category.toUpperCase()}
        </span>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", lineHeight: 1.25, margin: "0 0 20px" }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13, fontWeight: 700,
            }}>{post.avatar}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{post.author}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#94a3b8" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LuCalendar size={11} /> {post.date}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LuClock size={11} /> {post.readTime}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LuEye size={11} /> {post.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ Icon: LuShare2, label: "Ulashish" }, { Icon: LuBookmark, label: "Saqlash" }].map(({ Icon, label }) => (
              <button key={label} style={{
                display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
                border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff",
                fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer",
              }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cover */}
      <div style={{
        height: 280, borderRadius: 16, marginBottom: 36,
        background: "linear-gradient(135deg,#dc2626,#b91c1c)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.4)", fontSize: 48,
      }}>📝</div>

      {/* Body */}
      <div style={{ fontSize: 15.5, lineHeight: 1.85, color: "#374151" }}>
        {post.body.split("\n\n").map((para, i) => (
          <p key={i} style={{ marginBottom: 20 }}>{para}</p>
        ))}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 8, marginTop: 32, paddingTop: 24, borderTop: "1px solid #f1f5f9" }}>
        {post.tag.split(" ").map(t => (
          <span key={t} style={{
            background: "#f8fafc", border: "1px solid #e2e8f0",
            padding: "4px 12px", borderRadius: 20, fontSize: 12, color: "#64748b",
          }}>{t}</span>
        ))}
      </div>

      {/* Related */}
      <div style={{ marginTop: 48 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>O'xshash maqolalar</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {post.related.map(rid => {
            const r = POSTS[rid];
            return (
              <Link key={rid} to={`/blog/${rid}`} style={{
                textDecoration: "none", background: "#fff",
                border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "16px",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#dc2626"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 700, marginBottom: 6 }}>{r.category.toUpperCase()}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.4 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 8 }}>{r.readTime} · {r.date}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
