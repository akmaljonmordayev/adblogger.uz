import React, { useState, useMemo } from "react";
import { LuSearch, LuEye, LuCheck, LuCircle, LuClock, LuX, LuCalendar, LuPhone, LuUser, LuBriefcase } from "react-icons/lu";

const INITIAL_APPLICATIONS = [
  { id: 101, name: "Sardor Aliyev", role: "Frontend Developer (React)", date: "2026-04-18", status: "Yangi", phone: "+998 90 123 45 67", message: "React va Tailwind bo'yicha 2 yillik tajribam bor." },
  { id: 102, name: "Malika Karimova", role: "UI/UX Designer", date: "2026-04-19", status: "Ko'rib chiqilmoqda", phone: "+998 93 987 65 43", message: "Figma va Prototyping bo'yicha ishlaganman." },
  { id: 103, name: "Bekzod Tursunov", role: "Marketing Manager", date: "2026-04-20", status: "Rad etildi", phone: "+998 97 111 22 33", message: "SMM bo'yicha jamoa boshqarganman." },
  { id: 104, name: "Jasur Qodirov", role: "Frontend Developer (React)", date: "2026-04-20", status: "Yangi", phone: "+998 99 444 55 66", message: "Vite va Axios bilan ko'p ishlaganman." },
];

export default function AdminCareer() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Barchasi");
  const [selectedApp, setSelectedApp] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Yangi": return { bg: "bg-blue-100", text: "text-blue-700", icon: <LuClock size={14} /> };
      case "Ko'rib chiqilmoqda": return { bg: "bg-amber-100", text: "text-amber-700", icon: <LuEye size={14} /> };
      case "Qabul qilindi": return { bg: "bg-emerald-100", text: "text-emerald-700", icon: <LuCheck size={14} /> };
      case "Rad etildi": return { bg: "bg-red-100", text: "text-red-700", icon: <LuCircle size={14} className="rotate-45" /> };
      default: return { bg: "bg-slate-100", text: "text-slate-700", icon: <LuCircle size={14} /> };
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status: newStatus }));
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchName = app.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "Barchasi" || app.status === filterStatus;
      return matchName && matchStatus;
    });
  }, [applications, searchTerm, filterStatus]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">HR Boshqaruvi</h1>
            <p className="text-slate-500 text-sm md:text-base mt-1">Karyera bo'limi uchun tushgan arizalar</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jami</span>
              <span className="text-xl font-black text-slate-900">{applications.length}</span>
            </div>
            <div className="bg-blue-600 px-5 py-3 rounded-2xl shadow-lg shadow-blue-200 text-center text-white">
              <span className="block text-[10px] font-bold text-blue-100 uppercase tracking-widest">Yangi</span>
              <span className="text-xl font-black">{applications.filter(a => a.status === "Yangi").length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Ism bo'yicha qidiruv..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3.5 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50/50 cursor-pointer shadow-sm"
          >
            <option value="Barchasi">Barcha statuslar</option>
            <option value="Yangi">Yangi</option>
            <option value="Ko'rib chiqilmoqda">Ko'rib chiqilmoqda</option>
            <option value="Qabul qilindi">Qabul qilindi</option>
            <option value="Rad etildi">Rad etildi</option>
          </select>
        </div>

        {/* Desktop View: Table (Hidden on Mobile) */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nomzod</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lavozim</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sana</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Harakat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900">{app.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{app.phone}</div>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-700 text-sm">{app.role}</td>
                  <td className="px-6 py-5 text-slate-500 text-sm">{app.date}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${getStatusStyle(app.status).bg} ${getStatusStyle(app.status).text}`}>
                      {getStatusStyle(app.status).icon} {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => setSelectedApp(app)} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      <LuEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards (Hidden on Desktop) */}
        <div className="md:hidden space-y-4">
          {filteredApps.map(app => (
            <div key={app.id} onClick={() => setSelectedApp(app)} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{app.name}</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{app.role}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${getStatusStyle(app.status).bg} ${getStatusStyle(app.status).text}`}>
                  {app.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
                <span className="flex items-center gap-1"><LuCalendar size={12}/> {app.date}</span>
                <span className="flex items-center gap-1 text-blue-600 font-bold">Ko'rish <LuEye size={14}/></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Bu telefonda ham to'liq moslashgan */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-t-[32px] md:rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-3 md:hidden" />
            <div className="px-6 py-6 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Ma'lumot</h3>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:rotate-90 transition-transform">
                <LuX size={20} />
              </button>
            </div>
            
            <div className="px-6 pb-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-100">
                  {selectedApp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 leading-none">{selectedApp.name}</h4>
                  <p className="text-blue-600 text-sm font-semibold mt-1">{selectedApp.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <LuPhone className="text-slate-400" size={18}/>
                  <span className="text-sm font-bold text-slate-700">{selectedApp.phone}</span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <LuBriefcase className="text-slate-400 mt-1" size={18}/>
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedApp.message}"</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Statusni o'zgartirish</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Yangi", "Ko'rib chiqilmoqda", "Qabul qilindi", "Rad etildi"].map(st => (
                    <button 
                      key={st}
                      onClick={() => handleStatusChange(selectedApp.id, st)}
                      className={`px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${selectedApp.status === st ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}