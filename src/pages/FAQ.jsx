import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO, { breadcrumbSchema } from "../components/SEO";

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
      className={`group relative rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-red-200 bg-white shadow-lg shadow-red-500/5"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* left accent bar */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-0.75 rounded-full transition-all duration-300 ${
          isOpen
            ? "bg-linear-to-b from-red-500 to-red-700 opacity-100"
            : "opacity-0"
        }`}
      />

      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 px-6 py-5 text-left"
      >
        <span
          className={`shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
            isOpen
              ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.25)]"
              : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`flex-1 text-[15px] font-semibold leading-snug transition-colors duration-200 ${
            isOpen
              ? "text-slate-900"
              : "text-slate-700 group-hover:text-slate-900"
          }`}
        >
          {faq.q}
        </span>

        <span
          className={`shrink-0 mt-1 w-5 h-5 flex items-center justify-center transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className={`w-4 h-4 transition-colors duration-200 ${
              isOpen
                ? "text-red-500"
                : "text-slate-400 group-hover:text-slate-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div ref={bodyRef} className="px-6 pb-5 pl-17">
          <span
            className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border mb-3 uppercase tracking-wider ${TAG_COLORS[faq.cat]}`}
          >
            {TAG_LABELS[faq.cat]}
          </span>
          <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCat, setActiveCat] = useState("all");
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState("");

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
    <div className="max-w-3xl mx-auto py-6">
      <SEO
        title="Ko'p So'raladigan Savollar — FAQ"
        description="ADBlogger platformasi haqida eng ko'p beriladigan savollar va ularga to'liq javoblar. Blogger bo'lish, reklama joylashtirish va to'lov haqida."
        canonical="/faq"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "ADBlogger nima?", "acceptedAnswer": { "@type": "Answer", "text": "ADBlogger — O'zbekistonning eng yirik blogger va reklama platformasi. Biznes va bloggerlarni birlashtiradi." }},
            { "@type": "Question", "name": "Qanday ro'yxatdan o'taman?", "acceptedAnswer": { "@type": "Answer", "text": "Saytga kirib, ro'yxatdan o'tish tugmasini bosing va kerakli ma'lumotlarni to'ldiring." }},
          ]
        }}
      />
      {/* ── HERO ── */}
      <div className="relative rounded-3xl overflow-hidden mb-10 grid grid-cols-[1fr_190px] bg-white border border-slate-100 shadow-sm min-h-[300px]">
        {/* CHAP: oq tomon */}
        <div className="flex flex-col justify-between gap-6 px-10 py-10">
          {/* badge */}
          <div className="inline-flex items-center gap-2 border-2 border-red-500 rounded-full px-4 py-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-[10px] tracking-[0.2em] text-red-500 font-bold uppercase">
              Yordam markazi
            </span>
          </div>

          {/* sarlavha */}
          <div>
            <h1 className="text-4xl font-black text-red-600 leading-tight tracking-tight mb-3">
              Ko'p so'raladigan
              <br />
              <span className="text-yellow-500">savollar</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Platformamiz haqida eng tez-tez beriladigan savollar va ularga
              aniq javoblar.
            </p>
          </div>

          {/* qidiruv */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIdx(null);
              }}
              placeholder="Savol yoki kalit so'z qidiring..."
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-red-400 transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* O'NG: qizil tomon */}
        <div className="relative bg-red-600 flex flex-col items-center justify-center gap-4 px-6 py-10 overflow-hidden">
          {/* dekorativ doiralar */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />

          {[
            { v: "11", l: "Savol", yellow: true },
            { v: "3", l: "Bo'lim", yellow: false },
            { v: "24h", l: "Javob vaqti", yellow: false },
          ].map(({ v, l, yellow }) => (
            <div
              key={l}
              className={`relative z-10 w-full rounded-2xl py-3 px-4 text-center border ${
                yellow
                  ? "bg-yellow-400 border-yellow-400"
                  : "bg-white/10 border-white/20"
              }`}
            >
              <span
                className={`block text-3xl font-black leading-none ${yellow ? "text-red-600" : "text-white"}`}
              >
                {v}
              </span>
              <span
                className={`block text-[9px] font-bold uppercase tracking-widest mt-1 ${yellow ? "text-red-500/70" : "text-white/50"}`}
              >
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCatChange(cat.key)}
            className={`flex items-center gap-2 text-[12px] font-bold px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              activeCat === cat.key
                ? "bg-red-600 border-red-600 text-white shadow-[0_4px_14px_rgba(220,38,38,0.3)]"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {cat.label}
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                activeCat === cat.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── ACCORDION ── */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3 mb-10">
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
        <div className="text-center py-16 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Hech narsa topilmadi</p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCat("all");
            }}
            className="mt-3 text-red-600 text-xs hover:text-red-500 transition-colors underline underline-offset-2"
          >
            Filterni tozalash
          </button>
        </div>
      )}

      {/* ── BOTTOM CTA ── */}
      <div className="relative rounded-3xl border border-slate-200 bg-white overflow-hidden p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-black text-slate-800">
                Savolingiz javobsiz qoldimi?
              </h3>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Bizning jamoa 24 soat ichida sizga javob beradi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="mailto:hello@addbloger.uz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                />
              </svg>
              Email
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 border border-red-600 text-white text-sm font-bold hover:bg-red-500 transition-all duration-200 shadow-[0_4px_14px_rgba(220,38,38,0.25)]"
            >
              Bog'lanish
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
