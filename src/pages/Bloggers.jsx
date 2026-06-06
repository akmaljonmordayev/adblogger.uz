import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import SEO, { breadcrumbSchema } from "../components/SEO";
import BloggerCard from "../components/ui/BlogerCard";
import FilterSidebar from '../components/layout/FilterSidebar';
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";
import { LuSlidersHorizontal, LuX, LuUsers, LuLoader, LuArrowUpDown, LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu";
import api from "../services/api";

/* ── Kategoriya nomi (uz) ─────────────────────────────────── */
const CATEGORY_LABELS = {
  Tech:      "Texnologiya",
  Lifestyle: "Lifestyle",
  Beauty:    "Go'zallik",
  Food:      "Ovqat",
  Sports:    "Sport",
  Travel:    "Sayohat",
  Education: "Ta'lim",
  Business:  "Biznes",
  Gaming:    "Gaming",
  Music:     "Musiqa",
  Other:     "Boshqa",
};

const CATEGORY_GRADIENTS = {
  Tech:      "linear-gradient(180deg, #024da1 0%, #012b64 100%)",
  Lifestyle: "linear-gradient(180deg, #8c0d3a 0%, #46041d 100%)",
  Beauty:    "linear-gradient(180deg, #5b137d 0%, #2f0745 100%)",
  Food:      "linear-gradient(180deg, #a13602 0%, #4b1700 100%)",
  Sports:    "linear-gradient(180deg, #1a4d7c 0%, #0b2a3e 100%)",
  Travel:    "linear-gradient(180deg, #1b5e20 0%, #002d12 100%)",
  Education: "linear-gradient(180deg, #4a148c 0%, #1a0d47 100%)",
  Gaming:    "linear-gradient(180deg, #9c27b0 0%, #2d003f 100%)",
  Music:     "linear-gradient(180deg, #2c2c2c 0%, #0a0a0a 100%)",
  Business:  "linear-gradient(180deg, #b45309 0%, #431407 100%)",
  Other:     "linear-gradient(180deg, #334155 0%, #0f172a 100%)",
};

const PLATFORM_DISPLAY = {
  youtube:   "YouTube",
  instagram: "Instagram",
  telegram:  "Telegram",
  tiktok:    "TikTok",
};

function formatFollowers(n) {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function formatPrice(n) {
  if (!n) return "0";
  return Number(n).toLocaleString("uz-UZ");
}

function mapBlogger(b) {
  const cat  = b.categories?.[0] || "Other";
  const plat = b.platforms?.[0]  || "youtube";
  return {
    _id:           b._id,
    id:            b._id,
    name:          `${b.user?.firstName || ""} ${b.user?.lastName || ""}`.trim(),
    username:      `@${b.handle || (b.user?.firstName || "").toLowerCase()}`,
    avatar:        b.user?.avatar || null,
    platform:      PLATFORM_DISPLAY[plat] ?? plat,
    allPlatforms:  (b.platforms || [plat]).map(p => PLATFORM_DISPLAY[p] ?? p),
    categoryType:  cat,
    categoryText:  CATEGORY_LABELS[cat] ?? cat,
    allCategories: (b.categories || [cat]).map(c => CATEGORY_LABELS[c] ?? c),
    followers:     formatFollowers(b.followers),
    rawFollowers:  b.followers || 0,
    engagement:    `${b.engagementRate || 0}%`,
    rawEngagement: b.engagementRate || 0,
    price:         formatPrice(b.pricing?.post),
    rawPrice:      b.pricing?.post || 0,
    gradient:      CATEGORY_GRADIENTS[cat] ?? CATEGORY_GRADIENTS.Other,
    isVerified:    b.isVerified || false,
  };
}

export default function Blogger() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromQS = searchParams.get("category");
  const qFromQS        = searchParams.get("q") || "";

  const [bloggers, setBloggers]         = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy]             = useState("default");
  const [currentPage, setCurrentPage]   = useState(0);
  const [slideDir, setSlideDir]         = useState("next"); // "next" | "prev"
  const allRef      = useRef([]);
  const filteredRef = useRef([]);

  const CARDS_PER_PAGE = 6; // 3 ustun × 2 qator

  const { data: bloggersRaw, isLoading: loading, isError: error } = useQuery({
    queryKey: ["bloggers"],
    queryFn: () => api.get("/bloggers").then(res => (res.data.data || []).map(mapBlogger)),
    staleTime: 5 * 60 * 1000,
  });

  /* ── QS category / q o'zgarganda filter ── */
  useEffect(() => {
    const mapped = bloggersRaw || [];
    if (!mapped.length) return;
    allRef.current = mapped;
    let result = mapped;

    if (categoryFromQS) {
      const cat = categoryFromQS.toLowerCase();
      const byCat = result.filter(b =>
        b.categoryText.toLowerCase() === cat ||
        b.categoryType.toLowerCase() === cat ||
        b.allCategories.some(c => c.toLowerCase() === cat)
      );
      if (byCat.length > 0) result = byCat;
    }

    if (qFromQS) {
      const q = qFromQS.toLowerCase();
      const byQ = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.username.toLowerCase().includes(q) ||
        b.categoryText.toLowerCase().includes(q) ||
        b.allCategories.some(c => c.toLowerCase().includes(q)) ||
        b.allPlatforms.some(p => p.toLowerCase().includes(q))
      );
      if (byQ.length > 0) result = byQ;
    }

    filteredRef.current = result;
    setBloggers(applySort(result, sortBy));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromQS, qFromQS, bloggersRaw]);

  const applySort = (list, sort) => {
    const arr = [...list];
    if (sort === "followers_desc") arr.sort((a, b) => b.rawFollowers - a.rawFollowers);
    else if (sort === "followers_asc") arr.sort((a, b) => a.rawFollowers - b.rawFollowers);
    else if (sort === "price_asc")  arr.sort((a, b) => a.rawPrice - b.rawPrice);
    else if (sort === "price_desc") arr.sort((a, b) => b.rawPrice - a.rawPrice);
    else if (sort === "engagement") arr.sort((a, b) => b.rawEngagement - a.rawEngagement);
    return arr;
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setBloggers(applySort(filteredRef.current.length ? filteredRef.current : allRef.current, newSort));
  };

  /* ── Reset page on results change ── */
  useEffect(() => { setCurrentPage(0); }, [bloggers]);

  const totalPages = Math.ceil(bloggers.length / CARDS_PER_PAGE);
  const pageBloggers = bloggers.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);

  const goPrev = () => { setSlideDir("prev"); setCurrentPage(p => Math.max(0, p - 1)); };
  const goNext = () => { setSlideDir("next"); setCurrentPage(p => Math.min(totalPages - 1, p + 1)); };

  const handleBron = (id) => {
    const path = ROUTE_PATHS.BLOGGER_DETAIL.replace(":id", id);
    navigate(path);
  };

  const applyFilters = (filters, selectedUser) => {
    let result = [...allRef.current];

    if (selectedUser) {
      result = result.filter(b => b.id === selectedUser.id);
    }
    if (filters.category?.length) {
      result = result.filter(b =>
        b.allCategories.some(c => filters.category.includes(c))
      );
    }
    if (filters.platform?.length) {
      result = result.filter(b =>
        b.allPlatforms.some(p => filters.platform.includes(p))
      );
    }
    if (filters.price && (filters.price.min > 0 || filters.price.max < 20_000_000)) {
      result = result.filter(b => b.rawPrice >= filters.price.min && b.rawPrice <= filters.price.max);
    }
    if (filters.status?.includes("Tasdiqlangan")) {
      result = result.filter(b => b.isVerified === true);
    }
    if (filters.subscribers?.length) {
      result = result.filter(b =>
        filters.subscribers.some(range => {
          if (range === "10K - 50K")   return b.rawFollowers >= 10000  && b.rawFollowers <= 50000;
          if (range === "50K - 200K")  return b.rawFollowers >= 50000  && b.rawFollowers <= 200000;
          if (range === "200K - 500K") return b.rawFollowers >= 200000 && b.rawFollowers <= 500000;
          if (range === "500K+")       return b.rawFollowers >= 500000;
          return false;
        })
      );
    }
    filteredRef.current = result;
    setBloggers(applySort(result, sortBy));
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <SEO
        title="Bloggerlar — O'zbekistoning Top Influencerlari"
        description="O'zbekistonning 500+ tasdiqlangan bloggerlari. Instagram, YouTube, Telegram, TikTok. Auditoriyangizga mos bloggerni tanlang va reklamangizni joylashtiring."
        canonical="/blogerlar"
        schema={breadcrumbSchema([{ name: "Bosh sahifa", path: "/" }, { name: "Bloggerlar", path: "/blogerlar" }])}
      />
      <style>{`
        .bl-scroll::-webkit-scrollbar { width: 4px; }
        .bl-scroll::-webkit-scrollbar-track { background: transparent; }
        .bl-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .bl-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .bl-layout {
          display: flex; gap: 20px;
          height: calc(100vh - 128px); overflow: hidden;
        }
        .bl-sidebar { width: 300px; flex-shrink: 0; height: 100%; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        .bl-sidebar::-webkit-scrollbar { width: 4px; }
        .bl-sidebar::-webkit-scrollbar-track { background: transparent; }
        .bl-sidebar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .bl-main { flex: 1; min-width: 0; height: 100%; overflow-y: auto; padding-right: 2px; }
        @keyframes slideInNext { from { opacity:0; transform:translateX(48px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInPrev { from { opacity:0; transform:translateX(-48px); } to { opacity:1; transform:translateX(0); } }
        .bl-page-next { animation: slideInNext 0.32s cubic-bezier(.4,0,.2,1); }
        .bl-page-prev { animation: slideInPrev 0.32s cubic-bezier(.4,0,.2,1); }
        .bl-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .bl-nav-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; color: #374151; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: all 0.15s; }
        .bl-nav-btn:hover:not(:disabled) { background: #dc2626; color: #fff; border-color: #dc2626; box-shadow: 0 4px 14px rgba(220,38,38,0.25); }
        .bl-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .bl-dot { width: 7px; height: 7px; border-radius: 50%; background: #e2e8f0; border: none; cursor: pointer; padding: 0; transition: all 0.2s; flex-shrink: 0; }
        .bl-dot.active { background: #dc2626; width: 22px; border-radius: 4px; }
        @media (min-width: 1025px) { .bl-mobile-drawer { display: none !important; } }
        @media (max-width: 1024px) {
          .bl-sidebar    { display: none; }
          .bl-mobile-btn { display: flex !important; }
          .bl-layout     { height: auto; overflow: visible; }
          .bl-main       { height: auto; overflow: visible; }
          .bl-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .bl-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Mobile drawer overlay */}
      {isFilterOpen && (
        <div onClick={() => setIsFilterOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(15,23,42,0.5)", backdropFilter: "blur(3px)",
        }} />
      )}

      {/* Mobile drawer */}
      <div className="bl-mobile-drawer" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 320, zIndex: 201,
        transform: isFilterOpen ? "translateX(0)" : "translateX(110%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        background: "#f8fafc", overflowY: "auto",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 12px", borderBottom: "1px solid #e2e8f0",
          background: "#fff", flexShrink: 0,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Filtrlar</span>
          <button onClick={() => setIsFilterOpen(false)} style={{
            background: "#f8fafc", border: "1.5px solid #e2e8f0",
            borderRadius: 8, width: 30, height: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#64748b", marginTop: 100,
          }}>
            <LuX size={15} />
          </button>
        </div>
        <div style={{ padding: 12 }}>
          <FilterSidebar
            onApplyFilter={(f, u) => { applyFilters(f, u); setIsFilterOpen(false); }}
            usersList={allRef.current}
            initialCategory={categoryFromQS}
          />
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="bl-layout">

        {/* Desktop sidebar */}
        <div className="bl-sidebar bl-scroll">
          <FilterSidebar
            onApplyFilter={applyFilters}
            usersList={allRef.current}
            initialCategory={categoryFromQS}
          />
        </div>

        {/* Cards panel */}
        <div className="bl-main bl-scroll">

          {/* Search result banner */}
          {qFromQS && (
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"#fef2f2", border:"1.5px solid #fecaca", borderRadius:12, padding:"10px 16px", marginBottom:14 }}>
              <LuSearch size={14} style={{ color:"#dc2626", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#7f1d1d", flex:1 }}>
                "<strong>{qFromQS}</strong>" bo'yicha{" "}
                <strong style={{ color:"#dc2626" }}>{bloggers.length} ta</strong> bloger topildi
              </span>
              <button
                onClick={() => navigate("/blogerlar")}
                style={{ background:"#dc2626", color:"#fff", border:"none", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}
              >Tozalash</button>
            </div>
          )}

          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16, paddingBottom: 14,
            borderBottom: "1px solid #f1f5f9",
            position: "sticky", top: 0, background: "#f8fafc", zIndex: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LuUsers size={15} style={{ color: "#dc2626" }} />
              <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Blogerlar</span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: "#fef2f2", color: "#dc2626",
                padding: "2px 8px", borderRadius: 20,
              }}>
                {loading ? "..." : `${bloggers.length} ta`}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Sort dropdown */}
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <LuArrowUpDown size={13} style={{ position: "absolute", left: 10, color: "#64748b", pointerEvents: "none" }} />
                <select
                  value={sortBy}
                  onChange={e => handleSortChange(e.target.value)}
                  style={{
                    appearance: "none", WebkitAppearance: "none",
                    background: "#fff", border: "1.5px solid #e2e8f0",
                    borderRadius: 10, padding: "7px 28px 7px 28px",
                    fontSize: 12.5, fontWeight: 600, color: "#374151",
                    cursor: "pointer", outline: "none",
                  }}
                >
                  <option value="default">Saralash</option>
                  <option value="followers_desc">Obunachi ↓</option>
                  <option value="followers_asc">Obunachi ↑</option>
                  <option value="price_asc">Narx ↑</option>
                  <option value="price_desc">Narx ↓</option>
                  <option value="engagement">Engagement ↓</option>
                </select>
              </div>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="bl-mobile-btn"
                style={{
                  display: "none", alignItems: "center", gap: 6,
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  borderRadius: 10, padding: "7px 14px",
                  fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer",
                }}
              >
                <LuSlidersHorizontal size={14} /> Filter
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
              <LuLoader size={32} style={{ color: "#dc2626", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 16, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#dc2626", fontWeight: 600 }}>Xatolik yuz berdi</div>
            </div>
          )}

          {/* Paged grid */}
          {!loading && !error && (
            bloggers.length > 0 ? (
              <div>
                {/* Cards grid — animatsiya key bilan qayta render qiladi */}
                <div
                  key={`page-${currentPage}`}
                  className={`bl-cards-grid ${slideDir === "next" ? "bl-page-next" : "bl-page-prev"}`}
                >
                  {pageBloggers.map(blogger => (
                    <BloggerCard
                      key={blogger._id}
                      {...blogger}
                      headerGradient={blogger.gradient}
                      onBronClick={() => handleBron(blogger._id)}
                    />
                  ))}
                </div>

                {/* Navigation */}
                {totalPages > 1 && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 10, marginTop: 20, paddingBottom: 16,
                  }}>
                    <button className="bl-nav-btn" onClick={goPrev} disabled={currentPage === 0}>
                      <LuChevronLeft size={16} />
                    </button>

                    {/* Dots */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`bl-dot${i === currentPage ? " active" : ""}`}
                          onClick={() => { setSlideDir(i > currentPage ? "next" : "prev"); setCurrentPage(i); }}
                        />
                      ))}
                    </div>

                    {/* Counter */}
                    <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 600, minWidth: 52, textAlign: "center" }}>
                      <span style={{ color: "#dc2626", fontWeight: 800 }}>{currentPage + 1}</span>
                      {" / "}
                      {totalPages}
                    </span>

                    <button className="bl-nav-btn" onClick={goNext} disabled={currentPage >= totalPages - 1}>
                      <LuChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: "#fff", border: "1.5px solid #e2e8f0",
                borderRadius: 20, padding: "60px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>Bloger topilmadi</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Boshqa filtr sozlamalarini sinab ko'ring</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
