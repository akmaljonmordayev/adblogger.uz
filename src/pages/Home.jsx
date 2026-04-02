import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../config/constants";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-gray-900">
          O'z e'loningizni <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">ADBLOGER</span> bilan ulashing!
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Platformamiz orqali minglab foydalanuvchilarga o'z xizmatlaringizni va mahsulotlaringizni reklama qiling. Oson, tez va samarali.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to={ROUTE_PATHS.ADS} className="group relative px-10 py-5 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-2 overflow-hidden">
             Boshlash <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
             <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Link>
          <Link to={ROUTE_PATHS.BLOG} className="px-10 py-5 bg-white text-gray-800 font-black text-lg rounded-2xl border-2 border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
             Blogimizni o'qish
          </Link>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full">
        <div className="p-8 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition duration-500">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black">1</div>
          <h3 className="text-xl font-bold mb-4">Tezkor e'lonlar</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Bir necha daqiqa ichida o'z e'loningizni platformamizga joylashtiring.</p>
        </div>
        <div className="p-8 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition duration-500">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black">2</div>
          <h3 className="text-xl font-bold mb-4">Xavfsiz tizim</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Barcha foydalanuvchilar va e'lonlar bizning moderatsiyadan o'tib turadilar.</p>
        </div>
        <div className="p-8 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition duration-500">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black">3</div>
          <h3 className="text-xl font-bold mb-4">Blog postlar</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Sohaga oid eng so'nggi yangiliklar va maslahatlarni blogimizda toping.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
