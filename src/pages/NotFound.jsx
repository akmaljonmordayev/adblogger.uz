import { Link } from "react-router-dom";
import notFoundImg from "../assets/404.png";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl border border-[#FFE4E4] p-12 max-w-[460px] w-full text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#FFF1F1] text-red-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 tracking-wide">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          adbloger.uz
        </div>

        {/* Illustration */}
        <div className="relative w-[200px] mx-auto mb-6">
          <img src={notFoundImg} alt="Sahifa topilmadi" className="w-full h-auto" />
          <span className="absolute -top-2.5 -right-2.5 bg-rose-700 text-white text-[13px] font-extrabold px-2.5 py-1 rounded-full tracking-wide">
            404
          </span>
        </div>

        {/* Accent line */}
        <div className="w-10 h-[3px] bg-rose-700 rounded-full mx-auto mb-5" />

        <h1 className="text-[26px] font-extrabold text-[#1A0000] mb-2.5 leading-tight">
          Sahifa topilmadi
        </h1>
        <p className="text-[14.5px] text-gray-500 leading-relaxed max-w-[320px] mx-auto mb-8">
          Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
          Blogerlar va biznes egalari uchun to'g'ri yo'lni topamiz!
        </p>

        {/* Buttons */}
        <div className="flex gap-2.5 justify-center flex-wrap mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L8 2l6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 10V14h3v-3h2v3h3V10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Bosh sahifa
          </Link>
          <Link
            to="/bloggers"
            className="inline-flex items-center gap-2 bg-[#FFF1F1] hover:bg-[#FFE4E6] text-red-800 text-sm font-semibold px-5 py-2.5 rounded-xl border border-[#FECDD3] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="3" stroke="#B91C1C" strokeWidth="1.5"/>
              <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Blogerlar
          </Link>
        </div>

        <hr className="border-[#FFF1F1] mb-5" />

        <p className="text-xs text-gray-400 mb-2.5">Quyidagi bo'limlarga o'tishingiz mumkin</p>
        <div className="flex gap-1.5 justify-center flex-wrap">
          {[
            { label: "Blogerlar katalogi", to: "/bloggers" },
            { label: "Biznes uchun", to: "/business" },
            { label: "Kampaniyalar", to: "/campaigns" },
            { label: "Aloqa", to: "/contact" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[12.5px] text-rose-700 bg-[#FFF5F5] hover:bg-[#FFE4E6] px-3.5 py-1.5 rounded-full border border-[#FECDD3] font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NotFound;