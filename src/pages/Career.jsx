import React, { useState } from "react";
import { LuMapPin, LuClock, LuArrowRight, LuBriefcase, LuX, LuCheck } from "react-icons/lu"; 
import { FiCheckCircle } from "react-icons/fi";
const JOBS = [
  { id: 1, title: "Frontend Developer (React)", type: "To'liq stavka", location: "Toshkent / Remote", dept: "Texnologiya", desc: "React, TypeScript, Tailwind CSS bilan ishlash tajribasi. 2+ yil tajriba.", hot: true },
  { id: 2, title: "UI/UX Designer", type: "To'liq stavka", location: "Toshkent", dept: "Dizayn", desc: "Figma, user research, prototyping. Portfolio taqdim etish shart.", hot: false },
  { id: 3, title: "Marketing Manager", type: "To'liq stavka", location: "Toshkent", dept: "Marketing", desc: "Digital marketing, SMM, influencer marketing bo'yicha tajriba.", hot: true },
  { id: 4, title: "Sales Manager", type: "To'liq stavka", location: "Toshkent", dept: "Sotuv", desc: "B2B sotuv, muloqot ko'nikmalari. Ingliz tili bo'lsa afzal.", hot: false },
  { id: 5, title: "Content Writer (UZ)", type: "Part-time", location: "Remote", dept: "Kontent", desc: "O'zbek tilida sifatli kontent yozish. SEO ko'nikmalari.", hot: false },
];

const PERKS = [
  { emoji: "💰", title: "Raqobatbardosh maosh", desc: "Bozor narxidan yuqori va performance bonus" },
  { emoji: "🌍", title: "Gibrid ish", desc: "Ofis va remote orasida tanlov" },
  { emoji: "📚", title: "O'rganish imkoni", desc: "Kurslar va konferensiyalar uchun byudjet" },
  { emoji: "🏥", title: "Sog'liq sug'urtasi", desc: "To'liq tibbiy sug'urta" },
  { emoji: "🎯", title: "Rivojlanish", desc: "Aniq karyera o'sish yo'li" },
  { emoji: "🤝", title: "Jamoaviy ruh", desc: "Yosh va g'ayratli jamoa" },
];

const CATEGORIES = ["Barchasi", "Texnologiya", "Dizayn", "Marketing", "Sotuv", "Kontent"];

export default function Career() {
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [applyingJob, setApplyingJob] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredJobs = activeCategory === "Barchasi" 
    ? JOBS 
    : JOBS.filter(job => job.dept === activeCategory);

  const handleApply = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setApplyingJob(null);
    }, 3000);
  };
  // Career.jsx ichidagi JobCard-ni quyidagicha boyitamiz:

const JobCard = ({ job }) => {
  const [hover, setHover] = useState(false);

  // Har bir bo'lim uchun mos rasm (placeholder)
  const jobImages = {
    "Tech": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=100&q=80",
    "Design": "https://images.unsplash.com/photo-1561070791-26c145824e4d?auto=format&fit=crop&w=100&q=80",
    "Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80",
  };

  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px", // Rasm va matn orasidagi masofa
        border: `1px solid ${hover ? "#38bdf8" : "#e2e8f0"}`,
        boxShadow: hover ? "0 20px 30px -10px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.4s ease",
        transform: hover ? "scale(1.02)" : "scale(1)"
      }}
    >
      {/* MEDIA ELEMENT: Job Image */}
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "16px",
        overflow: "hidden",
        flexShrink: 0,
        backgroundColor: "#f1f5f9"
      }}>
        <img 
          src={jobImages[job.dept] || "https://via.placeholder.com/100"} 
          alt={job.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: hover ? "grayscale(0)" : "grayscale(0.5)", transition: "0.4s" }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>{job.title}</h3>
          {job.hot && <span style={{ background: "#ef4444", color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "6px" }}>HOT</span>}
        </div>
        
        <div style={{ display: "flex", gap: 15, color: "#64748b", fontSize: "13px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LuBriefcase size={14}/> {job.dept}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LuMapPin size={14}/> {job.location}</span>
        </div>
      </div>

      <button style={{
        padding: "10px 20px",
        borderRadius: "12px",
        border: "none",
        background: "#0f172a",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer"
      }}>
        Ariza topshirish
      </button>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="relative bg-slate-900 rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
          
          <div className="relative z-10">
            <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-blue-500/20">
              Karyera
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Bizning jamoaga <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">qo'shiling</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              O'zbekistonning eng tezkor o'sayotgan tech loyihasida ishlang va kelajakni birga quring.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Nima taklif etamiz?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Biz o'z xodimlarimizga eng yaxshi sharoitlarni yaratishga harakat qilamiz.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PERKS.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{p.emoji}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              Ochiq lavozimlar
              <span className="bg-blue-100 text-blue-700 text-sm py-1 px-3 rounded-full">{filteredJobs.length}</span>
            </h2>
            <p className="text-slate-500">O'zingizga mos yo'nalishni tanlang</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.length > 0 ? filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all group relative overflow-hidden">
              {job.hot && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Qaynoq
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{job.desc}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                      <LuBriefcase size={14} className="text-slate-400" /> {job.dept}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                      <LuClock size={14} className="text-slate-400" /> {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg">
                      <LuMapPin size={14} className="text-slate-400" /> {job.location}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setApplyingJob(job)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                >
                  Ariza qoldirish <LuArrowRight size={18} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">Bu yo'nalishda hozircha ochiq vakansiyalar yo'q.</p>
            </div>
          )}
        </div>
      </div>

      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {isSubmitted ? (
  <div className="p-10 text-center flex flex-col items-center">
    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
      {/* FiCheckCircle har doim barqaror eksport qilinadi */}
      <FiCheckCircle size={32} />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">Arizangiz qabul qilindi!</h3>
    <p className="text-slate-500">Tez orada siz bilan bog'lanamiz.</p>
  </div>
            ) : (
              <>
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">Ariza topshirish</h3>
                  <button onClick={() => setApplyingJob(null)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors">
                    <LuX size={20} />
                  </button>
                </div>
                <form onSubmit={handleApply} className="p-6 space-y-5">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <p className="text-sm text-blue-800 font-medium">Siz <span className="font-bold">{applyingJob.title}</span> lavozimiga ariza topshiryapsiz.</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">To'liq ismingiz</label>
                    <input required type="text" placeholder="Masalan: Sardor Aliyev" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Telefon raqam</label>
                    <input required type="tel" placeholder="+998 90 123 45 67" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Portfolio yoki CV linki</label>
                    <input required type="url" placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 mt-4">
                    Arizani yuborish
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}