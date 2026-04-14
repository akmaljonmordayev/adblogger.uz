import { useState } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
if (!document.head.querySelector('link[href*="Inter"]')) document.head.appendChild(fontLink);

const CATEGORIES = [
  { key: "all",    label: "Barchasi" },
  { key: "bloger", label: "Blogerlar" },
  { key: "reklam", label: "Reklam beruvchilar" },
  { key: "tolov",  label: "To'lov" },
];

const TAG = {
  bloger: { bg: "bg-blue-50 text-blue-700",   label: "Blogerlar" },
  reklam: { bg: "bg-green-50 text-green-700",  label: "Reklam beruvchi" },
  tolov:  { bg: "bg-amber-50 text-amber-700",  label: "To'lov" },
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

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 py-4 text-left group"
      >
        <span className="text-[15px] font-medium text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
          {faq.q}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-500 text-sm transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="pb-4">
          <span
            className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-2 ${TAG[faq.cat].bg}`}
          >
            {TAG[faq.cat].label}
          </span>
          <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCat, setActiveCat] = useState("all");
  const [openIdx, setOpenIdx] = useState(null);

  const filtered = FAQS.filter(
    (f) => activeCat === "all" || f.cat === activeCat
  );

  const handleToggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section
      className="w-full max-w-2xl mx-auto px-4 py-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-red-600 mb-2">
          FAQ
        </p>
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">
          Ko'p beriladigan savollar
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Platformamiz haqida eng ko'p so'raladigan savollar va javoblar.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCat(cat.key);
              setOpenIdx(null);
            }}
            className={`text-xs px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
              activeCat === cat.key
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      <div>
        {filtered.map((faq, i) => (
          <FaqItem
            key={faq.q}
            faq={faq}
            isOpen={openIdx === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>

      {/* Bottom note */}
      <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
        <span className="text-gray-400 text-lg mt-0.5">?</span>
        <div>
          <p className="text-sm font-medium text-gray-800">
            Boshqa savolingiz bormi?
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Bizga{" "}
            <a href="mailto:support@example.com" className="text-red-600 underline">
              support@example.com
            </a>{" "}
            orqali yozing — 24 soat ichida javob beramiz.
          </p>
        </div>
      </div>
    </section>
  );
}
