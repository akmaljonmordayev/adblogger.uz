import { useState, useEffect } from "react";
import { toast } from "../components/ui/toast";
import BloggerCard from "../components/ui/BlogerCard";
import FilterSidebar from '../components/layout/FilterSidebar';
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";
import { LuSlidersHorizontal, LuX, LuUsers } from "react-icons/lu";
 export const initialBloggers = [
  {
    id: 1,
    name: "Sardor Raximov",
    username: "@sardortech",
    avatar:"🎥",
    platform: "YouTube",
    categoryType: "Tech",
    categoryText: "Texnologiya",  
    followers: "450K",
    rawFollowers: 450000,
    engagement: "8.4%",
    price: "2,500,000",
    rawPrice: 2500000,
    gradient: "linear-gradient(180deg, #024da1 0%, #012b64 100%)",
    isVerified: true,
  },
  {
    id: 2,
    name: "Nilufar Hasanova",
    username: "@nilufarlife",
    platform: "Instagram",
    categoryType: "Lifestyle",
    categoryText: "Lifestyle",
    followers: "320K",
    rawFollowers: 320000,
    engagement: "6.2%",
    price: "1,800,000",
    rawPrice: 1800000,
    gradient: "linear-gradient(180deg, #8c0d3a 0%, #46041d 100%)",
    isVerified: true,
  },
  {
    id: 3,
    name: "Kamola Ergasheva",
    username: "@kamola_beauty",
    platform: "Instagram",
    categoryType: "Beauty",
    categoryText: "Go'zallik",
    followers: "280K",
    rawFollowers: 280000,
    engagement: "9.1%",
    price: "1,500,000",
    rawPrice: 1500000,
    gradient: "linear-gradient(180deg, #5b137d 0%, #2f0745 100%)",
    isVerified: true,
  },
  {
    id: 4,
    name: "Ulugbek Nazarov",
    username: "@foody_uz",
    platform: "TikTok",
    categoryType: "Food",
    categoryText: "Ovqat",
    followers: "195K",
    rawFollowers: 195000,
    engagement: "11.3%",
    price: "900,000",
    rawPrice: 900000,
    gradient: "linear-gradient(180deg, #a13602 0%, #4b1700 100%)",
    isVerified: false,
  },
  {
    id:5,
    name: "Meliqoziyev Jorabek",
    username: "@jorabek_travel",
    platform: "Instagram",
    categoryType: "Sports",
    categoryText: "Sport",
    followers: "15M",
    rawFollowers: 15000000,
    engagement: "14.5%",
    price: "15,000,000",
    rawPrice: 15000000,
    gradient: "linear-gradient(180deg, #1a4d7c 0%, #0b2a3e 100%)",
    isVerified: true,
  },
  {
    id:6,
    name: "Diyorbek Yuldashev",
    username: "@diyorbek_music",
    platform: "YouTube",
    categoryType: "Music",
    categoryText: "Musiqa",
    followers: "800K",
    rawFollowers: 800000,
    engagement: "10.2%",
    price: "3,500,000",
    rawPrice: 3500000,
    gradient: "linear-gradient(180deg, #2c2c2c 0%, #0a0a0a 100%)",
    isVerified: false,
  },
  {
    id:7,
    name: "Gulnora Karimova",
    username: "@gulnora_fashion",
    platform: "TikTok",
    categoryType: "Lifestyle",
    categoryText: "Lifestyle",
    followers: "250K",
    rawFollowers: 250000,
    engagement: "7.8%",
    price: "7,200,000",
    rawPrice: 7200000,
    gradient: "linear-gradient(180deg, #ff416c 0%, #1a0d47 100%)",
    isVerified: true,
  },
  {
    id:8,
    name: "Azizbek Qodirov",
    username: "@azizbek_gaming",
    platform: "YouTube",
    categoryType: "Gaming",
    categoryText: "Gaming",
    followers: "1.2M",
    rawFollowers: 1200000,
    engagement: "12.7%",
    price: "5,000,000",
    rawPrice: 5000000,
    gradient: "linear-gradient(180deg, #1a4d7c 0%, #0b2a3e 100%)",
    isVerified: true,
  },
  {
    id:9,
    name: "Shahnoza Yusupova",
    username: "@shahnoza_travel",
    platform: "Instagram",
    categoryType: "Travel",
    categoryText: "Sayohat",
    followers: "600K",
    rawFollowers: 600000,
    engagement: "9.5%",
    price: "4,000,000",
    rawPrice: 4000000,
    gradient: "linear-gradient(180deg, #1b5e20 0%, #002d12 100%)",
    isVerified: true,
  },
  {
    id:10,
    name: "Bekzod Tursunov",
    username: "@bekzod_education",
    platform: "Instagram",
    categoryType: "Education",
    categoryText: "Ta'lim",
    followers: "350K",
    rawFollowers: 350000,
    engagement: "8.0%",
    price: "2,800,000",
    rawPrice: 2800000,
    gradient: "linear-gradient(180deg, #4a148c 0%, #1a0d47 100%)",
    isVerified: false,
  },
  {
    id:11,
    name: "Nilufar Hasanova",
    username: "@nilufarlife",
    platform: "Instagram",
    categoryType: "Tech",
    categoryText: "Texnologiya",
    followers: "200K",
    rawFollowers: 200000,
    engagement: "7.5%",
    price: "2,200,000",
    rawPrice: 2200000,
    gradient: "linear-gradient(180deg, #b71c1c 0%, #3a0000 100%)",
    isVerified: true,
  },
  {
      id:12,
    name: "Sardor Raximov",
    username: "@sardortech",
    platform: "YouTube",
    categoryType: "Tech",
    categoryText: "Texnologiya",
    followers: "450K",
    rawFollowers: 450000,
    engagement: "8.4%",
    price: "2,500,000",
    rawPrice: 2500000,
    gradient: "linear-gradient(180deg, #ef4444 0%, #3b0a0a 100%)",
    isVerified: true,

  },
  {
    id:13,
    name: "Salohiddin Mirzakbarov",
    username: "@salohiddin_fitness",
      platform: "Instagram",
    categoryType: "Sqorts",
    categoryText: "Sport",
    followers: "900K",
    rawFollowers: 900000,
    engagement: "13.2%",
    price: "6,000,000",
    rawPrice: 6000000,
    gradient: "linear-gradient(180deg, #1565c0 0%, #0a1f3d 100%)",
    isVerified: true,
  },

  {
    id:14,
    name: "Salimov Asadbek",
    username: "@asadbek_gamer",
    platform: "Telegram",
    categoryType: "Gaming",
    categoryText: "Gaming",
    followers: "500K",
    rawFollowers: 500000,
    engagement: "11.0%",
    price: "3,000,000",
    rawPrice: 3000000,
    gradient: "linear-gradient(180deg, #9c27b0 0%, #2d003f 100%)",
    isVerified: false,
  },
  {
    id:15,
    name: "Doniyorov Ozodbek",
    username: "@ozodbek_Teach",
    platform: "YouTube",
    categoryType: "Education",
    categoryText: "Ta'lim",
    followers: "300K",
    rawFollowers: 300000,
    engagement: "8.5%",
    price: "2,600,000",
    rawPrice: 2600000,
    gradient: "linear-gradient(180deg, #22c55e 0%, #052e16 100%)",
    isVerified: false,
  }
];

export default function Blogger() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bloggers, setBloggers] = useState(initialBloggers);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const categoryFromState = location.state?.category;
    if (categoryFromState) {
      const filtered = initialBloggers.filter(
        (b) => b.categoryText === categoryFromState
      );
      setBloggers(filtered.length > 0 ? filtered : initialBloggers);
    }
  }, [location.state]);

  const handleBron = (id) =>{
    toast.success(`${id} bloggeri bron qilindi!`);
    const path = ROUTE_PATHS.BLOGGER_DETAIL.replace(":id", id); 
    navigate(path);
  }

  const applyFilters = (filters, selectedUser) => {
    let result = [...initialBloggers];

    if (selectedUser) {
     result = result.filter((b) => b.id === selectedUser.id);
    }

   if (filters.category && filters.category.length > 0) {
      result = result.filter((b) => filters.category.includes(b.categoryText));
    }

    if (filters.platform && filters.platform.length > 0) {
      result = result.filter((b) => filters.platform.includes(b.platform));
    }

 if (filters.price) {
      result = result.filter(
        (b) => b.rawPrice >= filters.price.min && b.rawPrice <= filters.price.max
      );
    }   

  if (filters.status && filters.status.includes("Tasdiqlangan")) {
      result = result.filter((b) => b.isVerified === true);
    }

   if (filters.subscribers && filters.subscribers.length > 0) {
      result = result.filter((b) => {
        return filters.subscribers.some((range) => {
          if (range === "10K - 50K") return b.rawFollowers >= 10000 && b.rawFollowers <= 50000;
          if (range === "50K - 200K") return b.rawFollowers >= 50000 && b.rawFollowers <= 200000;
          if (range === "200K - 500K") return b.rawFollowers >= 200000 && b.rawFollowers <= 500000;
          if (range === "500K+") return b.rawFollowers >= 500000;
          return false;
        });
      });
    }

    setBloggers(result);
  };
  

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        /* ── scrollbar ── */
        .bl-scroll::-webkit-scrollbar { width: 4px; }
        .bl-scroll::-webkit-scrollbar-track { background: transparent; }
        .bl-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .bl-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

        /* ── two-panel layout ── */
        .bl-layout {
          display: flex;
          gap: 20px;
          height: calc(100vh - 128px);   /* viewport - header(100px) - py-6(24px) - 4px */
          overflow: hidden;
        }
        .bl-sidebar {
          width: 300px;
          flex-shrink: 0;
          height: 100%;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        .bl-sidebar::-webkit-scrollbar { width: 4px; }
        .bl-sidebar::-webkit-scrollbar-track { background: transparent; }
        .bl-sidebar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .bl-main {
          flex: 1;
          min-width: 0;
          height: 100%;
          overflow-y: auto;
          padding-right: 2px;
        }

        /* ── desktop: hide mobile drawer ── */
        @media (min-width: 1025px) {
          .bl-mobile-drawer  { display: none !important; }
        }

        /* ── mobile: hide desktop sidebar, show drawer ── */
        @media (max-width: 1024px) {
          .bl-sidebar        { display: none; }
          .bl-mobile-btn     { display: flex !important; }
          .bl-layout         { height: auto; overflow: visible; }
          .bl-main           { height: auto; overflow: visible; }
          .bl-cards-grid     { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 540px) {
          .bl-cards-grid     { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Mobile drawer overlay ── */}
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(15,23,42,0.5)",
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className="bl-mobile-drawer" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 320, zIndex: 201,
        transform: isFilterOpen ? "translateX(0)" : "translateX(110%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        background: "#f8fafc",
        overflowY: "auto",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 12px",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff", flexShrink: 0,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Filtrlar</span>
          <button
            onClick={() => setIsFilterOpen(false)}
            style={{
              background: "#f8fafc", border: "1.5px solid #e2e8f0",
              borderRadius: 8, width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#64748b",
            }}
          >
            <LuX size={15} />
          </button>
        </div>
        <div style={{ padding: 12 }}>
          <FilterSidebar
            onApplyFilter={(f, u) => { applyFilters(f, u); setIsFilterOpen(false); }}
            usersList={initialBloggers}
          />
        </div>
      </div>

      {/* ── Two-panel layout ── */}
      <div className="bl-layout">

        {/* Desktop sidebar (own scroll) */}
        <div className="bl-sidebar bl-scroll">
          <FilterSidebar
            onApplyFilter={applyFilters}
            usersList={initialBloggers}
          />
        </div>

        {/* Cards panel (own scroll) */}
        <div className="bl-main bl-scroll">

          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16, paddingBottom: 14,
            borderBottom: "1px solid #f1f5f9",
            position: "sticky", top: 0, background: "#f8fafc", zIndex: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LuUsers size={15} style={{ color: "#dc2626" }} />
              <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                Blogerlar
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: "#fef2f2", color: "#dc2626",
                padding: "2px 8px", borderRadius: 20,
              }}>
                {bloggers.length} ta
              </span>
            </div>

            {/* Mobile filter trigger */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bl-mobile-btn"
              style={{
                display: "none",
                alignItems: "center", gap: 6,
                background: "#fff", border: "1.5px solid #e2e8f0",
                borderRadius: 10, padding: "7px 14px",
                fontSize: 13, fontWeight: 600, color: "#374151",
                cursor: "pointer",
              }}
            >
              <LuSlidersHorizontal size={14} />
              Filtr
            </button>
          </div>

          {/* Cards */}
          {bloggers.length > 0 ? (
            <div className="bl-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, paddingBottom: 24 }}>
              {bloggers.map((blogger) => (
                <BloggerCard
                  key={blogger.id}
                  {...blogger}
                  headerGradient={blogger.gradient}
                  onBronClick={() => handleBron(blogger.id)}
                />
              ))}
            </div>
          ) : (
            <div style={{
              background: "#fff", border: "1.5px solid #e2e8f0",
              borderRadius: 20, padding: "60px 20px", textAlign: "center",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                Bloger topilmadi
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Boshqa filtr sozlamalarini sinab ko'ring
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}