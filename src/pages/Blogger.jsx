import React, { use, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BloggerCard from "../blogerCard/BlogerCard"; 
import FilterSidebar from "../components/layout/filterSiderbar"; 

const initialBloggers = [
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
  const [bloggers, setBloggers] = useState(initialBloggers);
const [isFilterOpen, setIsFilterOpen] = useState(false);
  const handleBron = (name) => toast.info(`${name} uchun bron qilindi!`);

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
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-8 relative">
      
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 active:scale-95 transition-transform"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-bold">Filtr</span>
      </button>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        <div className={`
          fixed inset-0 z-[100] lg:relative lg:inset-auto lg:z-[50] lg:block
          ${isFilterOpen ? 'block' : 'hidden'}
        `}>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden" 
            onClick={() => setIsFilterOpen(false)}
          ></div>

          <div className="relative w-[310px] h-full lg:h-auto bg-white lg:bg-transparent overflow-y-auto lg:overflow-visible ml-auto lg:ml-0 lg:sticky lg:top-8 p-4 lg:p-0">
             <button 
               onClick={() => setIsFilterOpen(false)} 
               className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl p-2"
             >✕</button>

             <FilterSidebar 
               onApplyFilter={(f, u) => { applyFilters(f, u); setIsFilterOpen(false); }} 
               usersList={initialBloggers} 
             />
          </div>
        </div>

        <div className="flex-1 w-full flex flex-wrap justify-center lg:justify-start gap-6 relative z-0">
          {bloggers.length > 0 ? (
            bloggers.map((blogger, index) => (
              <BloggerCard
                key={index}
                {...blogger}
                headerGradient={blogger.gradient}
                onBronClick={() => handleBron(blogger.name)}
              />
            ))
          ) : (
            <div className="w-full text-center py-20 text-gray-500 font-medium text-lg bg-white rounded-3xl border-2 border-dashed border-gray-100">
              🚫 Bunday mezonlarga mos blogger topilmadi.
            </div>
          )}
        </div>

      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}