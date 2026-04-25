import React, { useState, useMemo } from "react";

const INITIAL_BLOGGERS = [
  {
    id: 1,
    name: "Ali Valiyev",
    platform: "Instagram",
    category: "Texnologiya",
    price: 5000000,
    status: "Tasdiqlangan",
    avatar: "👨‍💻",
  },

  {
    id: 2,
    name: "Malika Asatova",
    platform: "YouTube",
    category: "Lifestyle",
    price: 12000000,
    status: "Kutilmoqda",
    avatar: "👩‍🎨",
  },
  {
    id: 3,
    name: "Sanjar Gaming",
    platform: "YouTube",
    category: "Gaming",
    price: 3000000,
    status: "Tasdiqlangan",
    avatar: "🎮",
  },
  {
    id: 4,
    name: "Go'zallik Sirlari",
    platform: "TikTok",
    category: "Go'zallik",
    price: 1500000,
    status: "Rad etilgan",
    avatar: "💅",
  },
  {
    id: 5,
    name: "Hamdam Dev",
    platform: "Telegram",
    category: "Texnologiya",
    price: 8000000,
    status: "Kutilmoqda",
    avatar: "🚀",
  },
  {
    id: 6,
    name: "Lola Fashion",
    platform: "Instagram",
    category: "Go'zallik",
    price: 4500000,
    status: "Tasdiqlangan",
    avatar: "👗",
  },
];

const AdminBloggers = () => {
  const [bloggers, setBloggers] = useState(INITIAL_BLOGGERS);
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogger, setEditingBlogger] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    platform: "Instagram",
    category: "Texnologiya",
    price: "",
  });

  // --- STATISTIKA ---
  const stats = {
    total: bloggers.length,
    pending: bloggers.filter((b) => b.status === "Kutilmoqda").length,
    totalValue: bloggers.reduce((acc, curr) => acc + curr.price, 0),
  };

  // --- FILTRLASH VA SARALASH ---
  const processedBloggers = useMemo(() => {
    let result = bloggers.filter(
      (b) =>
        (b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.platform.toLowerCase().includes(search.toLowerCase())) &&
        (filterPlatform === "All" || b.platform === filterPlatform),
    );

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [bloggers, search, filterPlatform, sortBy]);

  // --- FUNKSIYALAR ---
  const handleDelete = (id) => {
    if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      setBloggers(bloggers.filter((b) => b.id !== id));
    }
  };

  const toggleStatus = (id, newStatus) => {
    setBloggers(
      bloggers.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    );
  };

  const openModal = (blogger = null) => {
    if (blogger) {
      setEditingBlogger(blogger);
      setFormData({
        name: blogger.name,
        platform: blogger.platform,
        category: blogger.category,
        price: blogger.price,
      });
    } else {
      setEditingBlogger(null);
      setFormData({
        name: "",
        platform: "Instagram",
        category: "Texnologiya",
        price: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingBlogger) {
      setBloggers(
        bloggers.map((b) =>
          b.id === editingBlogger.id
            ? { ...b, ...formData, price: Number(formData.price) }
            : b,
        ),
      );
    } else {
      const newBlogger = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        status: "Kutilmoqda",
        avatar: "👤",
      };
      setBloggers([newBlogger, ...bloggers]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* 1. DASHBOARD STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Jami Blogerlar
            </p>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              {stats.total} ta
            </h2>
          </div>
          <div className="bg-indigo-600 p-6 rounded-[24px] shadow-lg shadow-indigo-100 text-white">
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">
              Kutilmoqda
            </p>
            <h2 className="text-3xl font-black mt-2">{stats.pending} ta</h2>
          </div>
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Umumiy Aylanma
            </p>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              {stats.totalValue.toLocaleString()}{" "}
              <span className="text-sm font-medium">UZS</span>
            </h2>
          </div>
        </div>

        {/* 2. HEADER & SEARCH */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h1 className="text-2xl font-black text-slate-900">
            Boshqaruv Paneli
          </h1>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
           <div className="relative group w-full md:w-64">
  {/* Orqa fondagi yaltiroq neon (Hover va Focus bo'lganda ko'rinadi) */}
  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
  
  <div className="relative flex items-center">
    {/* Qidiruv ikonkachasi */}
    <div className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </div>

    <input 
      type="text" 
      placeholder="Ism bo'yicha qidirish..." 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none 
                 transition-all duration-300
                 hover:border-indigo-300
                 focus:border-indigo-500 focus:bg-white"
    />
  </div>
</div>
           <select
  value={filterPlatform}
  onChange={(e) => setFilterPlatform(e.target.value)}
  className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none cursor-pointer
             transition-all duration-300 ease-in-out
             hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] 
             focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 
             appearance-none pr-10 relative"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px'
  }}
>
  <option value="All">Barcha Platformalar</option>
  <option value="Instagram">Instagram</option>
  <option value="YouTube">YouTube</option>
  <option value="Telegram">Telegram</option>
  <option value="TikTok">TikTok</option>
</select>
            <button
              onClick={() => openModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              + Qo'shish
            </button>
          </div>
        </div>

        {/* 3. TABLE CARD */}
        <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4 text-left">Bloger</th>
                  <th className="px-6 py-4 text-left">Kategoriya</th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() =>
                        setSortBy(
                          sortBy === "price-asc" ? "price-desc" : "price-asc",
                        )
                      }
                      className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                    >
                      Narxi ↕️
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">Holat</th>
                  <th className="px-6 py-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {processedBloggers.map((blogger) => (
                  <tr
                    key={blogger.id}
                    className="group hover:bg-indigo-50/20 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shadow-inner border border-white">
                          {blogger.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {blogger.name}
                          </div>
                          <div className="text-[10px] font-bold text-indigo-500 uppercase">
                            {blogger.platform}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {blogger.category}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-sm">
                      {blogger.price.toLocaleString()} UZS
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          blogger.status === "Tasdiqlangan"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : blogger.status === "Kutilmoqda"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {blogger.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {blogger.status === "Kutilmoqda" && (
                          <button
                            onClick={() =>
                              toggleStatus(blogger.id, "Tasdiqlangan")
                            }
                            className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => openModal(blogger)}
                          className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(blogger.id)}
                          className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. PAGINATION FOOTER */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400">
              Jami {processedBloggers.length} ta natija ko'rsatilyapti
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-not-allowed">
                Oldingi
              </button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-100">
                1
              </button>
              <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                Keyingi
              </button>
            </div>
          </div>
        </div>

        {/* 5. MODAL FORM (Tugmalar shu yerda ishlaydi) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden scale-in-center">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">
                  {editingBlogger ? "Blogerni Tahrirlash" : "Yangi Bloger"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-rose-500 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">
                    Bloger Ismi
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                    placeholder="Masalan: Ali Valiyev"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">
                      Platforma
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium"
                    >
                      <option>Instagram</option>
                      <option>YouTube</option>
                      <option>Telegram</option>
                      <option>TikTok</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">
                      Kategoriya
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-medium"
                    >
                      <option>Texnologiya</option>
                      <option>Lifestyle</option>
                      <option>Gaming</option>
                      <option>Go'zallik</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">
                    Narxi (UZS)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBloggers;
