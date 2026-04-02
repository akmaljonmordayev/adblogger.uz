import { useState, useRef, useEffect, useCallback } from "react";

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

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h3 className="text-gray-500 text-sm font-bold mb-2 uppercase">{title}</h3>
    {children}
  </div>
);

const Checkbox = ({ label, onChange, checked }) => (
  <label className="flex items-center gap-2 mb-2 cursor-pointer group">
    <div
      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
        checked
          ? "bg-red-600 border-red-600"
          : "border-gray-300 group-hover:border-red-400"
      }`}
    >
      {checked && (
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
      {label}
    </span>
  </label>
);

const PRICE_MIN = 0;
const PRICE_MAX = 20_000_000;

const HISTOGRAM_BARS = [
  3, 5, 8, 13, 18, 24, 30, 38, 42, 44, 40, 35, 28, 20, 14, 9, 6, 4, 3, 2,
];

function formatPrice(val) {
  if (val >= 1_000_000)
    return (val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1) + " mln";
  if (val >= 1_000) return (val / 1_000).toFixed(0) + " K";
  return val.toString();
}

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

  const startDrag = (which) => (e) => {
    e.preventDefault();
    dragging.current = which;
  };

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
    const onUp = () => {
      dragging.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [minVal, maxVal, getValueFromEvent, onChange]);

  const minPct = toPercent(minVal);
  const maxPct = toPercent(maxVal);
  const maxBarH = 44;

  return (
    <div className="select-none">
      <div
        ref={trackRef}
        className="relative h-12 flex items-end gap-[2px] mb-1 cursor-default"
      >
        {HISTOGRAM_BARS.map((h, i) => {
          const barPct = (i / HISTOGRAM_BARS.length) * 100;
          const inRange = barPct >= minPct && barPct <= maxPct;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-colors duration-200"
              style={{
                height: `${(h / maxBarH) * 100}%`,
                backgroundColor: inRange ? "#3b82f6" : "#d1d5db",
              }}
            />
          );
        })}

        <div
          className="absolute inset-0"
          onMouseDown={(e) => {
            const val = getValueFromEvent(e);
            const distMin = Math.abs(val - minVal);
            const distMax = Math.abs(val - maxVal);
            if (distMin < distMax) {
              onChange({ min: Math.min(val, maxVal - 100_000), max: maxVal });
              dragging.current = "min";
            } else {
              onChange({ min: minVal, max: Math.max(val, minVal + 100_000) });
              dragging.current = "max";
            }
          }}
        />
      </div>

      <div className="relative h-1.5 bg-gray-200 rounded-full mx-2 mt-3">
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />

        <button
          type="button"
          onMouseDown={startDrag("min")}
          onTouchStart={startDrag("min")}
          className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `${minPct}%` }}
        />

        <button
          type="button"
          onMouseDown={startDrag("max")}
          onTouchStart={startDrag("max")}
          className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 top-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `${maxPct}%` }}
        />
      </div>

      <div className="flex justify-between mt-3">
        <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-lg px-2 py-1 min-w-[70px] text-center">
          {formatPriceFull(minVal)}
        </div>
        <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-lg px-2 py-1 min-w-[70px] text-center">
          {formatPriceFull(maxVal)}
        </div>
      </div>
    </div>
  );
};

const USERS = [
  { id: 1, name: "Aziz Tech", avatar: "🧑‍💻", platform: "YouTube", subs: "320K" },
  {
    id: 2,
    name: "Dilnoza Beauty",
    avatar: "💄",
    platform: "Instagram",
    subs: "150K",
  },
  {
    id: 3,
    name: "Sardor Vlog",
    avatar: "🎥",
    platform: "YouTube",
    subs: "90K",
  },
  {
    id: 4,
    name: "Madina Food",
    avatar: "🍳",
    platform: "Telegram",
    subs: "45K",
  },
  { id: 5, name: "Jasur Fit", avatar: "💪", platform: "TikTok", subs: "510K" },
  {
    id: 6,
    name: "Nodir Travel",
    avatar: "✈️",
    platform: "Instagram",
    subs: "200K",
  },
  {
    id: 7,
    name: "Shaxlo Lifestyle",
    avatar: "🌸",
    platform: "TikTok",
    subs: "78K",
  },
  {
    id: 8,
    name: "Bobur Gaming",
    avatar: "🎮",
    platform: "YouTube",
    subs: "430K",
  },
];

const UserSelector = ({ selectedUser, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 border-2 border-gray-200 rounded-lg px-3 py-2 text-left text-sm hover:border-red-400 focus:border-red-500 focus:outline-none transition-all duration-200"
      >
        {selectedUser ? (
          <>
            <span className="text-lg">{selectedUser.avatar}</span>
            <span className="flex-1 font-medium text-gray-800 truncate">
              {selectedUser.name}
            </span>
            <span className="text-xs text-gray-400">
              {selectedUser.platform}
            </span>
          </>
        ) : (
          <>
            <span className="text-gray-400">👤</span>
            <span className="flex-1 text-gray-400">Foydalanuvchi tanlang…</span>
          </>
        )}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Qidirish…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-red-400 transition-colors"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-3 text-center text-sm text-gray-400">
                Topilmadi
              </div>
            )}
            {filtered.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  onSelect(user);
                  setOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-red-50 transition-colors ${
                  selectedUser?.id === user.id ? "bg-red-50 font-medium" : ""
                }`}
              >
                <span className="text-lg">{user.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.platform} · {user.subs}
                  </div>
                </div>
                {selectedUser?.id === user.id && (
                  <svg
                    className="w-4 h-4 text-red-600 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
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
        [type]: exists
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const handleReset = () => {
    setFilters({
      category: [],
      platform: [],
      subscribers: [],
      status: [],
      price: { min: PRICE_MIN, max: PRICE_MAX },
    });
    setSelectedUser(null);
    setApplied(false);
  };

  const handleSubmit = () => {
    console.log("User:", selectedUser, "Filters:", filters);
    setApplied(true);
  };

  const activeCount =
    filters.category.length +
    filters.platform.length +
    filters.subscribers.length +
    filters.status.length +
    (selectedUser ? 1 : 0) +
    (filters.price.min > PRICE_MIN || filters.price.max < PRICE_MAX ? 1 : 0);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-5 font-sans">
      <div className="w-[310px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtr
          </div>
          {activeCount > 0 && (
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
              {activeCount} tanlangan
            </span>
          )}
        </div>

        <div className="p-4">
          <Section title="FOYDALANUVCHI">
            <UserSelector
              selectedUser={selectedUser}
              onSelect={setSelectedUser}
            />
          </Section>

          <Section title="KATEGORIYA">
            {[
              "Texnologiya",
              "Lifestyle",
              "Go'zallik",
              "Ovqat",
              "Sport",
              "Sayohat",
            ].map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={filters.category.includes(item)}
                onChange={() => toggleFilter("category", item)}
              />
            ))}
          </Section>

          <Section title="PLATFORMA">
            {["YouTube", "Instagram", "Telegram", "TikTok"].map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={filters.platform.includes(item)}
                onChange={() => toggleFilter("platform", item)}
              />
            ))}
          </Section>

          <Section title="OBUNACHILAR">
            {["10K - 50K", "50K - 200K", "200K - 500K", "500K+"].map((item) => (
              <Checkbox
                key={item}
                label={item}
                checked={filters.subscribers.includes(item)}
                onChange={() => toggleFilter("subscribers", item)}
              />
            ))}
          </Section>

          <Section title="NARX (SO'M)">
            <PriceRangeSlider
              minVal={filters.price.min}
              maxVal={filters.price.max}
              onChange={({ min, max }) => {
                setApplied(false);
                setFilters((prev) => ({ ...prev, price: { min, max } }));
              }}
            />
          </Section>

          <Section title="HOLAT">
            <Checkbox
              label="Tasdiqlangan"
              checked={filters.status.includes("Tasdiqlangan")}
              onChange={() => toggleFilter("status", "Tasdiqlangan")}
            />
            <Checkbox
              label="Barchasi"
              checked={filters.status.includes("Barchasi")}
              onChange={() => toggleFilter("status", "Barchasi")}
            />
          </Section>

          {applied && (
            <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-3 py-2 flex items-center gap-1.5 animate-in">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Filtrlar muvaffaqiyatli qo'llanildi!
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-sm hover:border-red-300 hover:text-red-600 active:scale-95 transition-all duration-200"
            >
              Tozalash
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 rounded-xl font-bold text-sm hover:from-red-700 hover:to-red-600 active:scale-95 transition-all duration-200 shadow-md shadow-red-200"
            >
              Filtrlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
