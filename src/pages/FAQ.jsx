import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const CATEGORIES = [
  { key: "all", label: "Barchasi", count: 11 },
  { key: "bloger", label: "Blogerlar", count: 4 },
  { key: "reklam", label: "Reklam beruvchilar", count: 4 },
  { key: "tolov", label: "To'lov", count: 3 },
];

const TAG_COLORS = {
  bloger: "bg-blue-50 text-blue-600 border-blue-100",
  reklam: "bg-emerald-50 text-emerald-600 border-emerald-100",
  tolov: "bg-amber-50 text-amber-600 border-amber-100",
};

const TAG_LABELS = {
  bloger: "Blogerlar",
  reklam: "Reklam beruvchi",
  tolov: "To'lov",
};

const FAQS = [
  {
    cat: "bloger",
    q: "Platformaga bloger sifatida qanday qo'shilaman?",
    a: "Ro'yxatdan o'tish juda oddiy — telefon raqamingiz yoki email orqali akkaunt oching, so'ng bloger profilingizni to'ldiring: ijtimoiy tarmoq havolalari, auditoriya hajmi va nisha yo'nalishingizni kiriting. Moderatsiya 24 soat ichida amalga oshiriladi.",
  },
  {
    cat: "bloger",
    q: "Qanday ijtimoiy tarmoqlar qo'llab-quvvatlanadi?",
    a: "Instagram, YouTube, Telegram, TikTok, Facebook va Twitter/X platformalari qo'llab-quvvatlanadi. Bir nechta platformani bir vaqtda ulashingiz mumkin.",
  },
  {
    cat: "bloger",
    q: "Minimal obunachilar soni qancha bo'lishi kerak?",
    a: "Hozircha minimal talab yo'q — mikroblogerlar (1 000+ obunachi) ham platforma orqali brendlar bilan ishlashi mumkin. Muhimi — auditoriyangizdagi faollik darajasi.",
  },
  {
    cat: "bloger",
    q: "Platformadan foydalanish bepulmi?",
    a: "Ha, blogerlar uchun ro'yxatdan o'tish va profil yaratish to'liq bepul. Birinchi oy komissiyasiz ishlaysiz. Undan keyin bitimdan foiz olinadi.",
  },
  {
    cat: "reklam",
    q: "Menga mos blogerlarni qanday topaman?",
    a: "Kategoriya, auditoriya hajmi, joylashuv, nisha va engagement rate bo'yicha filtr qo'llang. AI tavsiya tizimi ham sizning maqsadlaringizga mos blogerlarni avtomatik taklif qiladi.",
  },
  {
    cat: "reklam",
    q: "Kampaniya natijalarini qanday kuzataman?",
    a: "Shaxsiy dashboard orqali real vaqtda qamrov, bosishlar, konversiya va ROI ko'rsatkichlarini kuzatishingiz mumkin. Har bir bloger bo'yicha alohida hisobot yuklab olish imkoniyati mavjud.",
  },
  {
    cat: "reklam",
    q: "Blogerning auditoriyasi haqiqiymi?",
    a: "Barcha blogerlar qo'lda tekshiriladi. Fake followerlarni aniqlash uchun maxsus tizim ishlatiladi. Tekshiruv natijasi profilida ko'rsatiladi.",
  },
  {
    cat: "reklam",
    q: "Minimal byudjet qancha?",
    a: "Minimal reklama byudjeti 500 000 so'm. Byudjetni o'zingiz belgilaysiz va istalgan vaqt to'xtatishingiz mumkin.",
  },
  {
    cat: "tolov",
    q: "To'lovlar qanday amalga oshiriladi?",
    a: "Blogerlar o'z daromadlarini Payme, Click, bank kartasi yoki bank o'tkazmasi orqali yechib olishlari mumkin. To'lov so'rovi kiritgandan so'ng 1–3 ish kuni ichida amalga oshiriladi.",
  },
  {
    cat: "tolov",
    q: "Komissiya foizi qancha?",
    a: "Platforma har bir muvaffaqiyatli bitimdan 10% komissiya oladi. Birinchi oy uchun komissiya 0% — to'liq bepul.",
  },
  {
    cat: "tolov",
    q: "Pul qaytarish mumkinmi?",
    a: "Agar bloger shartnoma shartlarini bajarmasa, reklam beruvchiga to'liq pul qaytariladi. Har bir bitim platforma tomonidan kafolatlanadi.",
  },
];

const STATS = [
  { v: "11", l: "Savol", yellow: true },
  { v: "3", l: "Bo'lim", yellow: false },
  { v: "24h", l: "Javob", yellow: false },
];

const IconSearch = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);

const IconClose = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconChevron = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function AccordionItem({ faq, index, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`group relative rounded-xl sm:rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-red-200 bg-white shadow-md shadow-red-500/5"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* accent bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-all duration-300 ${
          isOpen ? "bg-red-500 opacity-100" : "opacity-0"
        }`}
      />

      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 py-[14px] sm:px-6 sm:py-5 text-left touch-manipulation select-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span
          className={`shrink-0 mt-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-colors duration-200 ${
            isOpen ? "bg-red-600 text-white" : "bg-slate-100 text-slate-400"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`flex-1 text-[13px] sm:text-[15px] font-semibold leading-[1.4] transition-colors duration-200 ${
            isOpen ? "text-slate-900" : "text-slate-700"
          }`}
        >
          {faq.q}
        </span>

        <span
          className={`shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <IconChevron
            className={`w-4 h-4 ${isOpen ? "text-red-500" : "text-slate-400"}`}
          />
        </span>
      </button>

      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div ref={bodyRef} className="px-4 pb-4 pl-[52px] sm:px-6 sm:pb-5 sm:pl-[60px]">
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border mb-2.5 uppercase tracking-wider ${TAG_COLORS[faq.cat]}`}
          >
            {TAG_LABELS[faq.cat]}
          </span>
          <p className="text-[12px] sm:text-sm text-slate-500 leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <IconSearch className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 text-[13px] sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-red-400 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: "" } })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-0.5 touch-manipulation"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <IconClose className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function FAQ() {
  const [activeCat, setActiveCat] = useState("all");
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setOpenIdx(null);
  };

  const filtered = FAQS.filter((f) => {
    const matchCat = activeCat === "all" || f.cat === activeCat;
    const matchSearch =
      search.trim() === "" ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleToggle = (i) => setOpenIdx(openIdx === i ? null : i);
  const handleCatChange = (key) => {
    setActiveCat(key);
    setOpenIdx(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-5 sm:py-6">
      <SEO
        title="Ko'p So'raladigan Savollar — FAQ"
        description="ADBlogger platformasi haqida eng ko'p beriladigan savollar va ularga to'liq javoblar. Blogger bo'lish, reklama joylashtirish va to'lov haqida."
        canonical="/faq"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "ADBlogger nima?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ADBlogger — O'zbekistonning eng yirik blogger va reklama platformasi. Biznes va bloggerlarni birlashtiradi.",
              },
            },
          ],
        }}
      />

      <div className="rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-10 bg-white border border-slate-100 shadow-sm">

        {/* ─── MOBILE ONLY (< 640px) ─── */}
        <div className="sm:hidden">
          {/* Stats row — red bg, 3 equal cells */}
          <div className="relative bg-red-600 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10 pointer-events-none" />
            <div className="relative z-10 flex">
              {STATS.map(({ v, l, yellow }, i) => (
                <div
                  key={l}
                  className={`flex-1 flex flex-col items-center justify-center py-4 px-2 ${
                    yellow ? "bg-yellow-400" : ""
                  } ${i > 0 ? "border-l border-white/10" : ""}`}
                >
                  <span className={`text-[22px] leading-none font-black ${yellow ? "text-red-600" : "text-white"}`}>
                    {v}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${yellow ? "text-red-500/70" : "text-white/50"}`}>
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pt-5 pb-5 flex flex-col gap-4">
            <div className="inline-flex items-center gap-1.5 border-2 border-red-500 rounded-full px-3 py-1 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-[9px] tracking-[0.15em] text-red-500 font-bold uppercase">Yordam markazi</span>
            </div>

            <div>
              <h1 className="text-[26px] font-black text-red-600 leading-tight tracking-tight">
                Ko'p so'raladigan<br />
                <span className="text-yellow-500">savollar</span>
              </h1>
              <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
                Platformamiz haqida eng tez-tez beriladigan savollar va ularga aniq javoblar.
              </p>
            </div>

            <SearchBar value={search} onChange={handleSearch} placeholder="Savol qidiring..." />
          </div>
        </div>

        {/* ─── TABLET + LAPTOP (≥ 640px) ─── */}
        <div className="hidden sm:grid grid-cols-[1fr_190px] md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_220px]">
          {/* Left content */}
          <div className="flex flex-col justify-between gap-6 px-8 md:px-10 py-8 md:py-10">
            <div className="inline-flex items-center gap-2 border-2 border-red-500 rounded-full px-4 py-1.5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[10px] tracking-[0.2em] text-red-500 font-bold uppercase">Yordam markazi</span>
            </div>

            <div>
              <h1 className="text-4xl font-black text-red-600 leading-tight tracking-tight mb-3">
                Ko'p so'raladigan<br />
                <span className="text-yellow-500">savollar</span>
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Platformamiz haqida eng tez-tez beriladigan savollar va ularga aniq javoblar.
              </p>
            </div>

            <SearchBar value={search} onChange={handleSearch} placeholder="Savol yoki kalit so'z qidiring..." />
          </div>

          {/* Right: red stats panel */}
          <div className="relative bg-red-600 flex flex-col items-center justify-center gap-3 lg:gap-4 px-5 py-10 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />
            {STATS.map(({ v, l, yellow }) => (
              <div
                key={l}
                className={`relative z-10 w-full rounded-2xl py-3 px-4 text-center border ${
                  yellow ? "bg-yellow-400 border-yellow-300" : "bg-white/10 border-white/20"
                }`}
              >
                <span className={`block text-3xl font-black leading-none ${yellow ? "text-red-600" : "text-white"}`}>{v}</span>
                <span className={`block text-[9px] font-bold uppercase tracking-widest mt-1 ${yellow ? "text-red-500/70" : "text-white/50"}`}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontally scrollable on small phones, wraps on sm+ */}
      <div
        className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto sm:flex-wrap pb-1 -mx-3 px-3 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCatChange(cat.key)}
            className={`flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold px-3 sm:px-4 py-2 rounded-xl border transition-colors duration-200 whitespace-nowrap shrink-0 touch-manipulation ${
              activeCat === cat.key
                ? "bg-red-600 border-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.25)]"
                : "bg-white border-slate-200 text-slate-500"
            }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {cat.label}
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                activeCat === cat.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2 sm:gap-3 mb-7 sm:mb-10">
          {filtered.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              faq={faq}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mb-7">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
            <IconSearch className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm">Hech narsa topilmadi</p>
          <button
            onClick={() => { setSearch(""); setActiveCat("all"); }}
            className="mt-3 text-red-600 text-xs underline underline-offset-2 touch-manipulation"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            Filterni tozalash
          </button>
        </div>
      )}

      {/* ╔══════════════════════════════════════╗
          ║            BOTTOM CTA               ║
          ╚══════════════════════════════════════╝ */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200 bg-white overflow-hidden p-5 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                Savolingiz javobsiz qoldimi?
              </h3>
            </div>
            <p className="text-[12px] sm:text-sm text-slate-400 leading-relaxed">
              Bizning jamoa 24 soat ichida sizga javob beradi.
            </p>
          </div>

          {/* Buttons — equal width on mobile, auto on desktop */}
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <a
              href="mailto:hello@addbloger.uz"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[12px] sm:text-sm font-bold active:bg-slate-100 hover:bg-slate-100 transition-colors touch-manipulation"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email
            </a>
            <Link
              to="/contact"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 text-white text-[12px] sm:text-sm font-bold hover:bg-red-500 active:bg-red-700 transition-colors shadow-[0_4px_12px_rgba(220,38,38,0.25)] touch-manipulation"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              Bog'lanish
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
