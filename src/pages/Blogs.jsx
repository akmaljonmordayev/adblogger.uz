import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO, { breadcrumbSchema } from "../components/SEO";
import api from "../services/api";
import {
  LuSearch, LuX, LuHeart, LuEye, LuClock, LuCalendar,
  LuChevronLeft, LuChevronRight, LuMessageCircle, LuTrendingUp,
  LuArrowUpDown, LuBookOpen,
  LuChevronDown, LuGrid3X3, LuList,
} from "react-icons/lu";

/* ── constants ──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: "", label: "Barchasi" },
  { value: "Tech",       label: "Texnologiya" },
  { value: "Lifestyle",  label: "Lifestyle" },
  { value: "Beauty",     label: "Go'zallik" },
  { value: "Food",       label: "Ovqat" },
  { value: "Sports",     label: "Sport" },
  { value: "Travel",     label: "Sayohat" },
  { value: "Education",  label: "Ta'lim" },
  { value: "Business",   label: "Biznes" },
  { value: "Gaming",     label: "Gaming" },
  { value: "Music",      label: "Musiqa" },
  { value: "Other",      label: "Boshqa" },
];

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Eng yangi" },
  { value: "createdAt",  label: "Eng eski" },
  { value: "-views",     label: "Ko'p ko'rilgan" },
  { value: "-likesCount",label: "Ko'p yoqtirilgan" },
];

const CAT_STYLE = {
  Tech:       { bg: "#eff6ff", tc: "#2563eb", border: "#bfdbfe" },
  Lifestyle:  { bg: "#fdf4ff", tc: "#a21caf", border: "#e9d5ff" },
  Beauty:     { bg: "#fff1f2", tc: "#e11d48", border: "#fecdd3" },
  Food:       { bg: "#fffbeb", tc: "#d97706", border: "#fde68a" },
  Sports:     { bg: "#f0fdf4", tc: "#16a34a", border: "#bbf7d0" },
  Travel:     { bg: "#f0fdfa", tc: "#0d9488", border: "#99f6e4" },
  Education:  { bg: "#f0f9ff", tc: "#0891b2", border: "#bae6fd" },
  Business:   { bg: "#f5f3ff", tc: "#7c3aed", border: "#ddd6fe" },
  Gaming:     { bg: "#fff7ed", tc: "#ea580c", border: "#fed7aa" },
  Music:      { bg: "#fdf4ff", tc: "#9333ea", border: "#e9d5ff" },
  Other:      { bg: "#f8fafc", tc: "#64748b", border: "#e2e8f0" },
};

const GRAD = {
  Tech: "135deg,#1e3a5f,#2563eb", Lifestyle: "135deg,#6b21a8,#a21caf",
  Beauty: "135deg,#9f1239,#e11d48", Food: "135deg,#78350f,#d97706",
  Sports: "135deg,#14532d,#16a34a", Travel: "135deg,#134e4a,#0d9488",
  Education: "135deg,#0c4a6e,#0891b2", Business: "135deg,#4c1d95,#7c3aed",
  Gaming: "135deg,#7c2d12,#ea580c", Music: "135deg,#581c87,#9333ea",
  Other: "135deg,#1e293b,#64748b",
};

const EMOJI = {
  Tech: "💻", Lifestyle: "✨", Beauty: "💄", Food: "🍜", Sports: "⚽",
  Travel: "✈️", Education: "📚", Business: "📊", Gaming: "🎮", Music: "🎵", Other: "📝",
};

const PER_PAGE = 9;

/* ── helpers ──────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
}
function getInitials(u) {
  if (!u) return "AD";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "AD";
}
function fmtNum(n = 0) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

/* ── skeleton ──────────────────────────────────────────────────────────── */
function Skeleton({ w = "100%", h = 16, r = 8, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
    }} />
  );
}

/* ── card ──────────────────────────────────────────────────────────────── */
function BlogCard({ post, view = "grid" }) {
  const cs  = CAT_STYLE[post.category] || CAT_STYLE.Other;
  const gr  = GRAD[post.category]      || GRAD.Other;
  const em  = EMOJI[post.category]     || "📝";
  const slug = post.slug || post._id;

  if (view === "list") {
    return (
      <Link to={`/blog/${slug}`} style={{ textDecoration: "none" }}>
        <div className="blog-card-list" style={{
          display: "flex", gap: 20, background: "#fff",
          border: "1.5px solid #f1f5f9", borderRadius: 16,
          overflow: "hidden", transition: "all .25s",
        }}>
          {/* thumb */}
          <div style={{
            width: 180, flexShrink: 0,
            background: post.coverImage ? `url(${post.coverImage}) center/cover` : `linear-gradient(${gr})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36,
          }}>
            {!post.coverImage && em}
          </div>
          {/* content */}
          <div style={{ padding: "20px 20px 20px 0", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: cs.bg, color: cs.tc, border: `1px solid ${cs.border}`, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>
                {post.category}
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 3 }}>
                <LuCalendar size={10} />{fmtDate(post.createdAt)}
              </span>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 15.5, color: "#0f172a", lineHeight: 1.4, margin: 0 }}>
              {post.title}
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {post.excerpt}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: post.author?.avatar ? `url(${post.author.avatar}) center/cover` : `linear-gradient(${gr})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                  {!post.author?.avatar && getInitials(post.author)}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                  {post.author ? `${post.author.firstName} ${post.author.lastName}` : "ADBlogger"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#94a3b8" }}><LuClock size={10} />{post.readTime} min</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#94a3b8" }}><LuEye size={10} />{fmtNum(post.views)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#94a3b8" }}><LuHeart size={10} />{fmtNum(post.likesCount)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#94a3b8" }}><LuMessageCircle size={10} />{fmtNum(post.commentsCount)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="blog-card-grid" style={{
        background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 20,
        overflow: "hidden", transition: "all .25s", height: "100%", display: "flex", flexDirection: "column",
      }}>
        {/* cover */}
        <div style={{
          height: 170, flexShrink: 0, position: "relative",
          background: post.coverImage ? `url(${post.coverImage}) center/cover` : `linear-gradient(${gr})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {!post.coverImage && (
            <>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative", zIndex: 1 }}>
                {em}
              </div>
            </>
          )}
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 8, display: "flex", alignItems: "center", gap: 3 }}>
            <LuClock size={9} />{post.readTime} min
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: "rgba(0,0,0,.4)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3 }}>
              <LuEye size={9} />{fmtNum(post.views)}
            </span>
            <span style={{ background: "rgba(0,0,0,.4)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3 }}>
              <LuHeart size={9} />{fmtNum(post.likesCount)}
            </span>
          </div>
        </div>

        {/* body */}
        <div style={{ padding: "18px 18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ background: cs.bg, color: cs.tc, border: `1px solid ${cs.border}`, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>
              {post.category}
            </span>
            <span style={{ fontSize: 10.5, color: "#94a3b8", display: "flex", alignItems: "center", gap: 3 }}>
              <LuCalendar size={9} />{fmtDate(post.createdAt)}
            </span>
          </div>

          <h3 style={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a", lineHeight: 1.45, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {post.title}
          </h3>

          <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
            {post.excerpt}
          </p>

          {/* footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f8fafc", paddingTop: 12, marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: post.author?.avatar ? `url(${post.author.avatar}) center/cover` : `linear-gradient(${gr})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#fff",
              }}>
                {!post.author?.avatar && getInitials(post.author)}
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "#0f172a", lineHeight: 1 }}>
                  {post.author ? `${post.author.firstName} ${post.author.lastName}` : "ADBlogger"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, color: "#94a3b8" }}><LuMessageCircle size={9} />{fmtNum(post.commentsCount)}</span>
              <span style={{ color: cs.tc, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                O'qish →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── main ──────────────────────────────────────────────────────────────── */
export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch]           = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [category, setCategory]       = useState(searchParams.get("category") || "");
  const [sort, setSort]               = useState(searchParams.get("sort") || "-createdAt");
  const [page, setPage]               = useState(Number(searchParams.get("page")) || 1);
  const [view, setView]               = useState("grid");
  const [showSort, setShowSort]       = useState(false);

  const debounceRef = useRef(null);

  /* ── fetch ── */
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PER_PAGE, sort };
      if (search)   params.search   = search;
      if (category) params.category = category;

      const res = await api.get("/blogs", { params });
      setPosts(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, category]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  /* ── sync URL ── */
  useEffect(() => {
    const p = {};
    if (search)   p.search   = search;
    if (category) p.category = category;
    if (sort !== "-createdAt") p.sort = sort;
    if (page > 1) p.page = String(page);
    setSearchParams(p, { replace: true });
  }, [search, category, sort, page]);

  /* ── handlers ── */
  const handleSearchInput = (val) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const handleCategory = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleSort = (val) => {
    setSort(val);
    setPage(1);
    setShowSort(false);
  };

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || "Saralash";

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <SEO
        title="Blog — Marketing va Reklama Maqolalari"
        description="Reklama, marketing va blogging bo'yicha foydali maqolalar. O'zbekiston bozori uchun amaliy tavsiyalar."
        canonical="/blog"
        schema={breadcrumbSchema([{ name: "Bosh sahifa", path: "/" }, { name: "Blog", path: "/blog" }])}
      />

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg,#7f1d1d 0%,#dc2626 55%,#991b1b 100%)", padding: "64px 32px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 100, padding: "5px 16px", fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#fbbf24", textTransform: "uppercase", marginBottom: 20 }}>
            <LuBookOpen size={11} /> Blog va Maqolalar
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(28px,5vw,52px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
            Bilim va tajriba{" "}
            <span style={{ background: "linear-gradient(90deg,#fbbf24,#fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              maqolalari
            </span>
          </h1>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,.7)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Blogging, marketing va reklama sohasida professional bilimlarga ega bo'ling
          </p>
          {/* search in hero */}
          <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
            <LuSearch size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.5)" }} />
            <input
              type="text"
              value={searchInput}
              onChange={e => handleSearchInput(e.target.value)}
              placeholder="Maqola qidirish..."
              style={{
                width: "100%", padding: "14px 44px 14px 46px", borderRadius: 14,
                border: "1.5px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.12)",
                backdropFilter: "blur(12px)", color: "#fff", fontSize: 14,
                outline: "none", boxSizing: "border-box",
              }}
            />
            {searchInput && (
              <button onClick={() => { handleSearchInput(""); }} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center" }}>
                <LuX size={15} />
              </button>
            )}
          </div>
          {/* stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { label: `${total} ta maqola`, Icon: LuBookOpen },
              { label: "Professional kontent", Icon: LuTrendingUp },
              { label: "Har hafta yangilanadi", Icon: LuCalendar },
            ].map(({ label, Icon }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "rgba(255,255,255,.6)", fontWeight: 500 }}>
                <Icon size={13} style={{ color: "#fbbf24" }} />{label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters & Controls ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 1px 12px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          {/* categories */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto", padding: "12px 0 8px", scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategory(cat.value)}
                style={{
                  padding: "7px 16px", borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                  border: category === cat.value ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
                  background: category === cat.value ? "#dc2626" : "#fff",
                  color: category === cat.value ? "#fff" : "#374151",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* controls row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 10, gap: 12 }}>
            <span style={{ fontSize: 12.5, color: "#94a3b8", fontWeight: 500 }}>
              {loading ? "Yuklanmoqda..." : `${total} ta natija`}
              {search && <span style={{ marginLeft: 6, background: "#fef2f2", color: "#dc2626", padding: "2px 8px", borderRadius: 6, fontSize: 11 }}>"{search}"</span>}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* sort dropdown */}
              <div style={{ position: "relative" }}>
                <button onClick={() => setShowSort(v => !v)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff",
                  fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer",
                }}>
                  <LuArrowUpDown size={13} />{sortLabel}<LuChevronDown size={12} />
                </button>
                {showSort && (
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,.12)", minWidth: 180, zIndex: 100, overflow: "hidden" }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => handleSort(opt.value)} style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "10px 16px", fontSize: 13, fontWeight: sort === opt.value ? 700 : 500,
                        color: sort === opt.value ? "#dc2626" : "#374151",
                        background: sort === opt.value ? "#fef2f2" : "transparent",
                        border: "none", cursor: "pointer",
                      }}>{opt.label}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* view toggle */}
              <div style={{ display: "flex", border: "1.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                {[{ val: "grid", Icon: LuGrid3X3 }, { val: "list", Icon: LuList }].map(({ val, Icon }) => (
                  <button key={val} onClick={() => setView(val)} style={{
                    padding: "7px 10px", border: "none", cursor: "pointer",
                    background: view === val ? "#dc2626" : "#fff",
                    color: view === val ? "#fff" : "#94a3b8",
                    transition: "all .2s",
                  }}>
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: view === "list" ? "1fr" : "repeat(3,1fr)", gap: 20 }}>
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #f1f5f9" }}>
                <div style={{ height: view === "list" ? 0 : 170, background: "#f1f5f9" }} />
                <div style={{ padding: 18 }}>
                  <Skeleton w="40%" h={12} r={6} mb={12} />
                  <Skeleton h={16} r={8} mb={8} />
                  <Skeleton w="90%" h={13} r={6} mb={4} />
                  <Skeleton w="70%" h={13} r={6} mb={16} />
                  <Skeleton h={1} r={0} mb={12} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Skeleton w="35%" h={12} r={6} />
                    <Skeleton w="20%" h={12} r={6} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Hech narsa topilmadi</h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>Qidiruvni o'zgartirib ko'ring yoki boshqa kategoriyani tanlang</p>
            <button onClick={() => { setSearch(""); setSearchInput(""); setCategory(""); setPage(1); }}
              style={{ marginTop: 20, padding: "10px 24px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Barcha maqolalar
            </button>
          </div>
        ) : (
          <div
            className="blogs-grid"
            style={{
              display: "grid",
              gridTemplateColumns: view === "list" ? "1fr" : "repeat(3,1fr)",
              gap: 20,
            }}
          >
            {posts.map(post => (
              <BlogCard key={post._id} post={post} view={view} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 48 }}>
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              style={{
                width: 38, height: 38, borderRadius: 10, border: "1.5px solid #e2e8f0",
                background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? .4 : 1, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <LuChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === "..." ? (
                <span key={`dots-${i}`} style={{ padding: "0 4px", color: "#94a3b8", fontSize: 14 }}>…</span>
              ) : (
                <button key={p} onClick={() => handlePage(p)} style={{
                  width: 38, height: 38, borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                  border: page === p ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
                  background: page === p ? "#dc2626" : "#fff",
                  color: page === p ? "#fff" : "#374151",
                  cursor: "pointer", transition: "all .2s",
                }}>{p}</button>
              ))
            }

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              style={{
                width: 38, height: 38, borderRadius: 10, border: "1.5px solid #e2e8f0",
                background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? .4 : 1, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <LuChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        input::placeholder { color: rgba(255,255,255,.4) !important; }
        .blog-card-grid:hover { box-shadow: 0 20px 48px rgba(0,0,0,.1); transform: translateY(-4px); border-color: #fecaca !important; }
        .blog-card-list:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); border-color: #fecaca !important; }
        ::-webkit-scrollbar { display: none; }
        @media(max-width:1024px) { .blogs-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:640px)  { .blogs-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
