import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// LuLoader2 xato berayotgan edi, LuLoader ishlatamiz
import { LuEye, LuEyeOff, LuShield, LuMail, LuLock, LuLoader, LuArrowRight } from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import { ROUTE_PATHS } from "../config/constants";

const ADMIN_CREDENTIALS = { email: "admin@adblogger.uz", password: "admin123" };

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim() || !password.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    // Haqiqiy tizimdek tuyulishi uchun biroz kutish
    await new Promise((r) => setTimeout(r, 1500));

    if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({ name: "Admin", email: email.trim(), role: "admin" });
      setToken("admin-token-" + Date.now());
      navigate(ROUTE_PATHS.ADMIN_DASHBOARD, { replace: true });
    } else {
      setError("Email yoki parol noto'g'ri!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Orqa fon neon effektlari */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      {/* Asosiy Karta (Siz tashlagan rasmdagi uslubda) */}
      <div className="relative z-10 w-full max-w-[900px] bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Chap tomon: Form qismi */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">
              ADMIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">KIRISH</span>
            </h2>
            <p className="text-slate-400 text-sm">Xush kelibsiz! Boshqaruv tizimiga kiring.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2 animate-shake">
              <LuShield size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <LuMail className="absolute left-0 top-3 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent border-b-2 border-slate-800 py-3 pl-10 text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
              />
            </div>

            <div className="relative group">
              <LuLock className="absolute left-0 top-3 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent border-b-2 border-slate-800 py-3 pl-10 pr-10 text-white outline-none focus:border-red-500 transition-all placeholder:text-slate-600"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-0 top-3 text-slate-500 hover:text-white transition-colors"
              >
                {showPass ? <LuEyeOff size={20} /> : <LuEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-red-600 p-4 rounded-2xl text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? <LuLoader className="animate-spin" size={24} /> : (
                  <>
                    <span>Sign In</span>
                    <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                    
                  </>
                )}
              </div>
            </button>
          </form>


          <div className="mt-8 text-center">
            <Link to="/" className="text-slate-500 hover:text-blue-400 text-sm transition-colors">
              Already Have Account?
            </Link>
          </div>
        </div>

        {/* O'ng tomon: Rasm va Neon effektlar */}
        <div className="flex-1 bg-black/40 relative flex items-center justify-center overflow-hidden border-l border-white/5">
          <div className="relative w-64 h-80 flex items-center justify-center">
            {/* Neon barglar - CSS orqali (Rasmdagidek) */}
            <div className="absolute w-24 h-44 bg-blue-500/20 border-2 border-blue-500 rounded-[100%_0%_100%_0%] -rotate-12 blur-[1px] shadow-[0_0_40px_#2563eb] animate-sway"></div>
            <div className="absolute w-20 h-36 bg-red-500/20 border-2 border-red-500 rounded-[100%_0%_100%_0%] -rotate-45 translate-x-[-40px] translate-y-[20px] blur-[1px] shadow-[0_0_40px_#ef4444] animate-sway delay-150"></div>
            <div className="absolute w-20 h-36 bg-purple-500/20 border-2 border-purple-500 rounded-[0%_100%_0%_100%] rotate-45 translate-x-[40px] translate-y-[20px] blur-[1px] shadow-[0_0_40px_#a855f7] animate-sway delay-300"></div>
            
            {/* Tuvak qismi */}
            <div className="absolute bottom-4 w-28 h-20 bg-gradient-to-b from-slate-800 to-black rounded-b-[40px] border border-white/10"></div>
            
            {/* Pastdagi nurli aylana */}
            <div className="absolute bottom-0 w-48 h-10 bg-red-600/30 blur-[30px] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      

      {/* Maxsus animatsiyalar uchun style tag */}
      <style>{`
        @keyframes sway {
          0% { transform: translateY(0) rotate(-12deg); }
          100% { transform: translateY(-10px) rotate(-8deg); }
        }
        .animate-sway { animation: sway 3s ease-in-out infinite alternate; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}