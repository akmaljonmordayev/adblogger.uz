import React from 'react';

const AdblogerUltimate = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-red-600 selection:text-white">
      
      {/* 1. HERO SECTION (Kichikroq va Premium) */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
            Performance & Creative Agency
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter text-white uppercase">
            Sizning o'singiz — <br />
            <span className="text-red-600 italic">Bizning missiyamiz.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
             2024-yilda raqamli marketing bozori <span className="text-white font-bold">$667 mlrd</span>ga yetdi. 
             Biz sizga ushbu ulkan bozordan munosib ulushingizni olishga yordam beramiz.
          </p>
          <button className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(220,38,38,0.2)]">
            BEPUL KONSULTATSIYA
          </button>
        </div>
      </section>

      {/* 2. CASE STUDIES / PORTFOLIO (Rasmlar uchun joy) */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-black text-white uppercase">Muvaffaqiyatli Keyslar</h2>
              <p className="text-red-600 font-bold text-xs uppercase tracking-widest mt-2">Natijalarimiz gapirsin</p>
            </div>
            <button className="text-sm font-bold border-b-2 border-red-600 pb-1 hover:text-red-500">Hammasini ko'rish</button>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Project Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video rounded-[2rem] bg-gray-900 overflow-hidden mb-6 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <span className="bg-red-600 text-[10px] font-black px-3 py-1 rounded-full text-white">E-COMMERCE</span>
                </div>
                <img src="https://unsplash.com" 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                     alt="Marketing Analysis" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 italic">Sotuvlarni 250% ga oshirish</h3>
              <p className="text-sm text-slate-500">Mijozimiz uchun noldan boshlab agressiv targeting va SMM strategiyasi orqali rekord ko'rsatkichlarga erishdik.</p>
            </div>

            {/* Project Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video rounded-[2rem] bg-gray-900 overflow-hidden mb-6 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <span className="bg-red-600 text-[10px] font-black px-3 py-1 rounded-full text-white">BRANDING</span>
                </div>
                <img src="https://unsplash.com" 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                     alt="Branding" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 italic">Minimalist Brend Identikasi</h3>
              <p className="text-sm text-slate-500">Yangi startap uchun xalqaro darajadagi brending va vizual kontent yaratdik, natijada investorlar ishonchini qozondik.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPERT SERVICES (Matn va Vizual uyg'unlik) */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              t: "SEO & Google Ads", 
              d: "Google'da 1-sahifani egallang. 93% internet foydalanuvchilari qidiruv tizimlaridan boshlaydi.",
              stat: "93%" 
            },
            { 
              t: "Social Media Ads", 
              d: "Instagram va Facebook'da faqat sotib oladigan auditoriyaga reklama ko'rsatamiz.",
              stat: "200% ROI" 
            },
            { 
              t: "Video Production", 
              d: "81% sotuvlar aynan video kontent orqali amalga oshadi. Millionlab ko'rishlar kafolatlanadi.",
              stat: "Viral Effect" 
            }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-red-600/20 font-black text-6xl group-hover:text-red-600/40 transition-colors">
                {item.stat}
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 relative z-10">{item.t}</h3>
              <p className="text-slate-500 text-sm leading-relaxed relative z-10">{item.d}</p>
              <div className="mt-8 flex items-center gap-2 text-red-500 text-xs font-bold tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                BATAFSIL <span className="text-lg">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST SECTION (Kompaniya haqida ko'proq matn) */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="rounded-[3rem] overflow-hidden bg-red-900/20 aspect-square relative">
             <img src="https://unsplash.com" 
                  className="w-full h-full object-cover mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-1000" 
                  alt="Adbloger Team" />
             <div className="absolute bottom-10 left-10 right-10 p-8 bg-black/60 backdrop-blur-md rounded-3xl border border-white/10">
                <p className="text-white italic text-lg font-medium">"Biz shunchaki agentlik emasmiz — biz mijozlarimizning o'sishi uchun mas'ul bo'lgan strategik hamkormiz."</p>
                <div className="mt-4 text-red-500 font-black text-xs uppercase tracking-widest">— Adbloger CEO</div>
             </div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter leading-none italic">
              Nima uchun <br /> <span className="text-red-600">Adbloger?</span>
            </h2>
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">01. Strategik Yondashuv</h4>
                <p className="text-sm text-slate-500">Har bir harakatimiz ma'lumotlarga (Data) asoslangan. Biz tasodiflarga ishonmaymiz, biz aniq hisob-kitobga ishonamiz.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">02. Kreativ Portlash</h4>
                <p className="text-sm text-slate-500">Kontentimiz nafaqat chiroyli, balki u sotadi. Biz auditoriya ongiga ta'sir qiluvchi vizuallar yaratamiz.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">03. Shaffoflik</h4>
                <p className="text-sm text-slate-500">Mijozlarimiz har bir sarflangan tiyin qayerga ketayotganini va qancha daromad keltirayotganini tahlillar (reports) orqali ko'rib borishadi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT FORM (Minimalist & Functional) */}
      <section className="py-24 px-6 bg-red-600">
        <div className="max-w-4xl mx-auto bg-black p-12 md:p-20 rounded-[4rem] text-center shadow-2xl">
          <h2 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">O'sishni bugun boshlang</h2>
          <p className="text-slate-400 mb-10">Ma'lumot qoldiring, biz sizga 15 daqiqada "Killer-Strategy" taklif qilamiz.</p>
          <form className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Ism" className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-600 transition" />
            <input type="tel" placeholder="Telefon" className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-600 transition" />
            <button className="md:col-span-2 bg-red-600 hover:bg-red-700 py-5 rounded-2xl font-black text-white uppercase tracking-widest transition-all">
              STRATEGIYANI OLISH
            </button>
          </form>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 text-center text-slate-700 border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.6em]">ADBLOGER AGENCY — 2024</p>
      </footer>

    </div>
  );
};

export default AdblogerUltimate;
