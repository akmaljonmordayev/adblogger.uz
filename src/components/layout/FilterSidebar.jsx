import React, { useState, useRef, useEffect, useCallback } from "react";

const ComponentStyles = () => (
  <style>{`
    @keyframes slide-in {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-in { animation: slide-in 0.2s ease-out; }
    .slim-scroll::-webkit-scrollbar { width: 4px; }
    .slim-scroll::-webkit-scrollbar-track { background: transparent; }
    .slim-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 9999px; }
    .slim-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  `}</style>
);

const CATEGORIES = [
  { id: "Texnologiya", emoji: "💻" },
  { id: "Lifestyle", emoji: "🌿" },
  { id: "Go'zallik", emoji: "✨" },
  { id: "Ovqat", emoji: "🍕" },
  { id: "Sport", emoji: "🏆" },
  { id: "Gaming", emoji: "🎮" },
  { id: "Sayohat", emoji: "✈️" },
  { id: "Ta'lim", emoji: "📚" },
];

const PLATFORMS = [
  { id: "YouTube", emoji: "📺" },
  { id: "Instagram", emoji: "📸" },
  { id: "Telegram", emoji: "✈️" },
  { id: "TikTok", emoji: "🎵" },
];

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-gray-400 text-[10px] font-black mb-3 uppercase tracking-widest">{title}</h3>
    {children}
  </div>
);

const Checkbox = ({ label, onChange, checked }) => (
  <label className="flex items-center gap-2 mb-2 cursor-pointer group">
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${checked ? "bg-red-600 border-red-600 shadow-sm shadow-red-200" : "border-gray-300 group-hover:border-red-400"}`}>
      {checked && (
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
  </label>
);

const SelectionCard = ({ label, emoji, onChange, checked, halfWidth = false }) => (
  <button
    type="button"
    onClick={onChange}
    className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all duration-200 ${
      halfWidth ? "w-[calc(50%-4px)]" : "w-full mb-2"
    } ${
      checked 
        ? "border-red-500 bg-red-50 text-red-700 shadow-sm" 
        : "border-gray-100 bg-white text-gray-600 hover:border-red-200"
    }`}
  >
    <div className={`text-lg w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${checked ? "bg-red-100" : "bg-gray-50"}`}>
      {emoji}
    </div>
    <span className="text-sm font-bold truncate">{label}</span>
    {checked && <span className="ml-auto text-red-500 font-bold text-xs animate-in">✓</span>}
  </button>
);

const PRICE_MIN = 0;
const PRICE_MAX = 20_000_000;
const HISTOGRAM_BARS = [3, 5, 8, 13, 18, 24, 30, 38, 42, 44, 40, 35, 28, 20, 14, 9, 6, 4, 3, 2];

function formatPriceFull(val) {
  return val.toLocaleString("ru-RU");
}

const PriceRangeSlider = ({ minVal, maxVal, onChange }) => {
  const trackRef = useRef(null);
  const dragging = useRef(null);
  const toPercent = (v) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const getValueFromEvent = useCallback((e) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const raw = PRICE_MIN + ratio * (PRICE_MAX - PRICE_MIN);
    return Math.round(raw / 100_000) * 100_000;
  }, []);

  const startDrag = (which) => (e) => { e.preventDefault(); dragging.current = which; };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const val = getValueFromEvent(e);
      if (dragging.current === "min") {
        onChange({ min: Math.min(val, maxVal - 100_000), max: maxVal });
      } else {
        onChange({ min: minVal, max: Math.max(val, minVal + 100_000) });
      }
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false }); // Mobilda ishlashi uchun
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => { 
        window.removeEventListener("mousemove", onMove); 
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("mouseup", onUp); 
        window.removeEventListener("touchend", onUp);
    };
  }, [minVal, maxVal, getValueFromEvent, onChange]);

  const minPct = toPercent(minVal);
  const maxPct = toPercent(maxVal);

  return (
    <div className="select-none">
      <div ref={trackRef} className="relative h-12 flex items-end gap-[2px] mb-1 cursor-default">
        {HISTOGRAM_BARS.map((h, i) => {
          const barPct = (i / HISTOGRAM_BARS.length) * 100;
          const inRange = barPct >= minPct && barPct <= maxPct;
          return <div key={i} className="flex-1 rounded-sm transition-colors duration-200" style={{ height: `${(h / 44) * 100}%`, backgroundColor: inRange ? "#ef4444" : "#e5e7eb" }} />
        })}
      </div>
      <div className="relative h-1.5 bg-gray-200 rounded-full mx-2 mt-3">
        <div className="absolute h-full bg-red-500 rounded-full" style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }} />
        <button onTouchStart={startDrag("min")} onMouseDown={startDrag("min")} className="absolute w-5 h-5 bg-white border-2 border-red-500 rounded-full shadow -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 focus:outline-none" style={{ left: `${minPct}%` }} />
        <button onTouchStart={startDrag("max")} onMouseDown={startDrag("max")} className="absolute w-5 h-5 bg-white border-2 border-red-500 rounded-full shadow -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 focus:outline-none" style={{ left: `${maxPct}%` }} />
      </div>
      <div className="flex justify-between mt-4">
        <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{formatPriceFull(minVal)}</div>
        <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{formatPriceFull(maxVal)}</div>
      </div>
    </div>
  );
};

const UserSelector = ({ users = [], selectedUser, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 border-2 border-gray-100 bg-gray-50 rounded-xl px-3 py-3 text-left text-sm hover:border-red-400 focus:outline-none transition-all">
        {selectedUser ? (
          <>
            <span className="text-xl">{selectedUser.avatar || "👤"}</span>
            <span className="flex-1 font-bold text-gray-800 truncate">{selectedUser.name}</span>
          </>
        ) : (
          <span className="flex-1 text-gray-500 font-medium">Foydalanuvchi tanlang...</span>
        )}
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <div className="absolute z-[100] mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in">
          <div className="p-3 border-b border-gray-50 bg-gray-50/50">
            <input type="text" placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-sm border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-red-400 bg-white transition-all" autoFocus />
          </div>
          <div className="max-h-48 overflow-y-auto slim-scroll bg-white">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs font-medium text-gray-400">Topilmadi</div>
            ) : (
              filtered.map((user) => (
                <button key={user.id} type="button" onClick={() => { onSelect(user); setOpen(false); setSearch(""); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-red-50 border-b border-gray-50 last:border-0 transition-colors">
                  <span className="text-xl">{user.avatar || "👤"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 truncate">{user.name}</div>
                    <div className="text-[10px] font-medium text-gray-400 uppercase">{user.platform} • {user.followers || user.subs || "0"}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function FilterSidebar({ onApplyFilter, usersList = [] }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    category: [],
    platform: [],
    subscribers: [],
    status: [],
    price: { min: PRICE_MIN, max: PRICE_MAX },
  });
  const [applied, setApplied] = useState(false);

  const toggleFilter = (type, value) => {
    setApplied(false);
    setFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists ? prev[type].filter((v) => v !== value) : [...prev[type], value],
      };
    });
  };

  const handleReset = () => {
    setFilters({ category: [], platform: [], subscribers: [], status: [], price: { min: PRICE_MIN, max: PRICE_MAX } });
    setSelectedUser(null);
    setApplied(false);
  };

  const handleSubmit = () => {
    onApplyFilter(filters, selectedUser);
    setApplied(true);
  };

  return (
    <div className="flex justify-center p-2 sm:p-4 bg-gray-50 min-h-screen font-sans items-center">
      <ComponentStyles />
      
      <div className="w-full max-w-[330px] max-h-[95vh] h-full bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col">
        
        {/* Header (O'zgarmadi) */}
        <div className="bg-red-600 text-white p-5 flex items-center justify-between rounded-t-3xl shadow-md z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h2 className="font-black text-lg leading-none">Filtrlar</h2>
            </div>
          </div>
          <button onClick={handleReset} className="text-red-100 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors bg-black/10 px-3 py-1.5 rounded-lg hover:bg-black/20">
            Tozalash
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 slim-scroll relative">
          
          <Section title="FOYDALANUVCHI">
            <UserSelector users={usersList} selectedUser={selectedUser} onSelect={setSelectedUser} />
          </Section>

          <Section title="KATEGORIYA">
            <div className="flex flex-col">
              {CATEGORIES.map((item) => (
                <SelectionCard key={item.id} label={item.id} emoji={item.emoji} checked={filters.category.includes(item.id)} onChange={() => toggleFilter("category", item.id)} />
              ))}
            </div>
          </Section>

          <Section title="PLATFORMA">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((item) => (
                <SelectionCard key={item.id} label={item.id} emoji={item.emoji} halfWidth={true} checked={filters.platform.includes(item.id)} onChange={() => toggleFilter("platform", item.id)} />
              ))}
            </div>
          </Section>

          <Section title="NARX ORALIG'I (SO'M)">
            <PriceRangeSlider minVal={filters.price.min} maxVal={filters.price.max} onChange={({ min, max }) => { setApplied(false); setFilters(p => ({ ...p, price: { min, max } })); }} />
          </Section>

          <Section title="HOLAT">
            {["Tasdiqlangan", "Barchasi"].map((item) => (
              <Checkbox key={item} label={item} checked={filters.status.includes(item)} onChange={() => toggleFilter("status", item)} />
            ))}
          </Section>

          {applied && (
            <div className="mb-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl px-4 py-3 text-center animate-in">
              Filtrlar muvaffaqiyatli qo'llanildi!
            </div>
          )}
        </div>

        <div className="p-5 bg-gray-50/50 border-t border-gray-100 rounded-b-3xl flex-shrink-0">
          <button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-red-100 active:scale-95 flex items-center justify-center gap-2">
            Natijalarni ko'rsatish
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}