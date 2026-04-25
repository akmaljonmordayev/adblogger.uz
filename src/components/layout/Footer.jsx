import { NavLink, Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { ROUTE_PATHS } from "../../config/constants";

function useCountUp(target, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

function NavItem({ href, children, badge, badgeType = "gold" }) {
  return (
    <li>
      <NavLink
        to={href}
        className={({ isActive }) =>
          `group flex items-center gap-2 text-sm py-1.5 transition-colors duration-200 ${
            isActive
              ? "text-yellow-300"
              : "text-red-100/70 hover:text-yellow-300"
          }`
        }
      >
        <span className="inline-block w-0 h-[1.5px] bg-yellow-400 group-hover:w-3 transition-all duration-300 ease-out rounded-full" />
        <span className="group-hover:translate-x-0.5 transition-transform duration-200">
          {children}
        </span>
        {badge && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-bold leading-none ${
              badgeType === "gold"
                ? "bg-yellow-400 text-black animate-bounce"
                : "bg-white/20 text-white animate-pulse border border-white/30"
            }`}
          >
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
}

function ContactItem({ icon, iconColor = "yellow", children }) {
  return (
    <li
      className={`flex items-start gap-3 text-sm text-red-100/60 transition-colors duration-200 group cursor-default ${
        iconColor === "red" ? "hover:text-white" : "hover:text-yellow-300"
      }`}
    >
      <span
        className={`w-4 h-4 mt-0.5 shrink-0 transition-colors duration-200 ${
          iconColor === "red"
            ? "text-red-200/70 group-hover:text-white"
            : "text-yellow-400 group-hover:text-yellow-300"
        }`}
      >
        {icon}
      </span>
      {children}
    </li>
  );
}

function SocialBtn({ href, label, color = "yellow", children }) {
  const hoverBg = color === "red" ? "bg-white" : "bg-yellow-400";
  const hoverText = color === "red" ? "hover:text-red-600" : "hover:text-black";
  return (
    <a
      href={href}
      aria-label={label}
      className={`relative w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 overflow-hidden group transition-all duration-300 hover:border-transparent ${hoverText}`}
    >
      <span
        className={`absolute inset-0 ${hoverBg} scale-0 group-hover:scale-100 transition-transform duration-300 ease-out rounded-full`}
      />
      <span className="relative z-10 w-[15px] h-[15px] group-hover:scale-110 transition-transform duration-200">
        {children}
      </span>
    </a>
  );
}

function ColTitle({ children, dotColor = "yellow" }) {
  return (
    <h4 className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest mb-4">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          dotColor === "red"
            ? "bg-white/60 animate-pulse"
            : "bg-yellow-400 animate-pulse"
        }`}
      />
      <span className="text-white/90">{children}</span>
    </h4>
  );
}

function StatCard({ num, label, color = "yellow" }) {
  return (
    <div
      className={`rounded-xl px-3 py-2 text-center transition-all duration-300 hover:-translate-y-1 cursor-default border ${
        color === "red"
          ? "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
          : "bg-yellow-400/20 border-yellow-400/30 hover:bg-yellow-400/30 hover:border-yellow-400/50"
      }`}
    >
      <span
        className={`block text-lg font-bold font-mono leading-tight ${
          color === "red" ? "text-white" : "text-yellow-300"
        }`}
      >
        {num}
      </span>
      <span className="block text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </div>
  );
}

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const bloggerCount = useCountUp(500, 1400, visible);
  const brandCount = useCountUp(120, 1000, visible);
  const dealCount = useCountUp(3400, 1600, visible);

  const revealClass = (delay) =>
    `transition-all duration-700 ${delay} ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-800"
    >
      {/* yumshoq sariq glow — o'ng yuqori burchak */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      {/* to'q qizil glow — chap pastki burchak */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/40 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
      {/* markazda sariq nuqta */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* diagonal pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.8) 20px,
            rgba(255,255,255,0.8) 21px
          )`,
        }}
      />

      {/* yuqori chiziq — sariq-oq-sariq */}
      <div className="relative h-[3px] w-full bg-gradient-to-r from-red-600 via-yellow-400 to-red-600" />

      {/* asosiy kontent */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* ── BRAND ── */}
        <div className={revealClass("delay-0")}>
          <Link
            to="/"
            className="inline-block font-extrabold text-3xl tracking-tight leading-none"
          >
            <span className="text-white">ad</span>
            <span className="text-yellow-300">Blogger</span>
          </Link>
          <p className="text-xs text-red-100/60 leading-relaxed mt-3 max-w-[220px]">
            O'zbekistonning birinchi blogger marketplace platformasi. 500+
            bloger bir joyda.
          </p>

          <div className="flex gap-3 mt-4 flex-wrap">
            <StatCard num={bloggerCount + "+"} label="Bloger" color="red" />
            <StatCard num={brandCount + "+"} label="Brend" color="yellow" />
            <StatCard num={dealCount + "+"} label="Bitim" color="red" />
          </div>

          <div className="flex gap-2 mt-4">
            <SocialBtn href="#" label="Telegram" color="red">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.42l-2.948-.924c-.64-.203-.653-.64.136-.953l11.527-4.444c.533-.194 1.002.131.759.149z" />
              </svg>
            </SocialBtn>
            <SocialBtn href="#" label="Instagram" color="yellow">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </SocialBtn>
            <SocialBtn href="#" label="YouTube" color="red">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
            </SocialBtn>
          </div>
        </div>

        {/* ── PLATFORMA ── */}
        <div className={revealClass("delay-100")}>
          <ColTitle dotColor="yellow">Platforma</ColTitle>
          <ul className="space-y-0.5">
            <NavItem href={ROUTE_PATHS.BLOGGERS} badge="500+" badgeType="gold">
              Blogerlar
            </NavItem>
            <NavItem href={ROUTE_PATHS.CATEGORIES}>Kategoriyalar</NavItem>
            <NavItem href={ROUTE_PATHS.ADS}>Reklamalar</NavItem>
            <NavItem href={ROUTE_PATHS.ELON_BERISH} badge="E'lon" badgeType="red">
              E'lon berish
            </NavItem>
            <NavItem href={ROUTE_PATHS.BLOGER_BOLISH} badge="NEW" badgeType="red">
              Bloger bo'lish
            </NavItem>
          </ul>
          <div className="mt-5 h-px bg-gradient-to-r from-yellow-400/60 via-white/20 to-transparent" />
        </div>

        {/* ── KOMPANIYA ── */}
        <div className={revealClass("delay-200")}>
          <ColTitle dotColor="red">Kompaniya</ColTitle>
          <ul className="space-y-0.5">
            <NavItem href={ROUTE_PATHS.ABOUT}>Biz haqimizda</NavItem>
            <NavItem href={ROUTE_PATHS.BLOGS}>Blog</NavItem>
            <NavItem href={ROUTE_PATHS.CAREER} badge="OCHIQ" badgeType="red">
              Karriera
            </NavItem>
            <NavItem href={ROUTE_PATHS.FAQ}>Ko'p so'raladigan savollar</NavItem>
            <NavItem href={ROUTE_PATHS.CONTACT}>Bog'lanish</NavItem>
            <NavItem href={ROUTE_PATHS.LOGIN}>Kirish</NavItem>
            <NavItem href={ROUTE_PATHS.REGISTER}>Ro'yxatdan o'tish</NavItem>
          </ul>
          <div className="mt-5 h-px bg-gradient-to-r from-white/30 via-yellow-400/40 to-transparent" />
        </div>

        {/* ── ALOQA ── */}
        <div className={revealClass("delay-300")}>
          <ColTitle dotColor="yellow">Aloqa</ColTitle>
          <ul className="space-y-3">
            <ContactItem
              iconColor="yellow"
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            >
              hello@adblogger.uz
            </ContactItem>
            <ContactItem
              iconColor="red"
              icon={
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.42l-2.948-.924c-.64-.203-.653-.64.136-.953l11.527-4.444c.533-.194 1.002.131.759.149z" />
                </svg>
              }
            >
              @adblogger_uz
            </ContactItem>
            <ContactItem
              iconColor="yellow"
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Toshkent, O'zbekiston
            </ContactItem>
            <ContactItem
              iconColor="red"
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              <span className="flex items-center gap-2">
                Du-Ju 9:00–18:00
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              </span>
            </ContactItem>
          </ul>

          <div className="flex gap-2 mt-5 flex-wrap">
            <Link
    to={ROUTE_PATHS.CONTACT}
    className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white border border-white/30 rounded-full group hover:border-white/60 transition-all duration-300"
  >
              <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-full" />
              <span className="relative z-10">Bog'lanish →</span>
            </Link>
            <Link
              to={ROUTE_PATHS.BLOGER_BOLISH}
              className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-yellow-400 border border-yellow-400 rounded-full group hover:bg-yellow-300 hover:border-yellow-300 transition-all duration-300"
            >
              <span className="relative z-10">Bloger bo'lish →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>
            © 2025 <span className="text-white font-semibold">ad</span>
            <span className="text-yellow-300 font-semibold">blogger</span>.{" "}
            Barcha huquqlar himoyalangan.
          </span>
          <div className="flex items-center gap-4">
            <Link
              to={ROUTE_PATHS.PRIVACY}
              className="hover:text-white transition-colors duration-200"
            >
              Maxfiylik
            </Link>
            <Link
              to={ROUTE_PATHS.TERMS}
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              Shartlar
            </Link>
            <Link
              to={ROUTE_PATHS.COOKIES}
              className="hover:text-white transition-colors duration-200"
            >
              Cookies
            </Link>
            <Link
              to={ROUTE_PATHS.FAQ}
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
