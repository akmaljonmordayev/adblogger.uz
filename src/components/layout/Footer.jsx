import { NavLink, Link } from "react-router-dom";

function NavItem({ href, children }) {
  return (
    <li>
      <NavLink
        to={href}
        className={({ isActive }) =>
          `text-sm transition-colors duration-200 ${
            isActive ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
          }`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

function ContactItem({ icon, children }) {
  return (
    <li className="flex items-center gap-2 text-sm text-gray-400">
      <span className="w-4 h-4 shrink-0">{icon}</span>
      {children}
    </li>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1a1a1a" }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <Link to="/" className="text-2xl font-bold text-white">
            add<span style={{ color: "#f5a623" }}>Bloger</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400 mt-3">
            O'zbekistonning birinchi blogger marketplace platformasi. 500+
            bloger bir joyda.
          </p>
        </div>

        {/* Platforma */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">
            Platforma
          </h4>
          <ul className="space-y-2">
            <NavItem href="/blogerlar">Blogerlar</NavItem>
            <NavItem href="/kategoriyalar">Kategoriyalar</NavItem>
            <NavItem href="/narxlar">Narxlar</NavItem>
            <NavItem href="/bloger-bolish">Bloger bo'lish</NavItem>
          </ul>
        </div>

        {/* Kompaniya */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">
            Kompaniya
          </h4>
          <ul className="space-y-2">
            <NavItem href="/biz-haqimizda">Biz haqimizda</NavItem>
            <NavItem href="/blog">Blog</NavItem>
            <NavItem href="/karriera">Karriera</NavItem>
            <NavItem href="/boglanish">Bog'lanish</NavItem>
          </ul>
        </div>

        {/* Aloqa */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs">
            Aloqa
          </h4>
          <ul className="space-y-2">
            <ContactItem
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            >
              hello@addbloger.uz
            </ContactItem>
            <ContactItem
              icon={
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.42l-2.948-.924c-.64-.203-.653-.64.136-.953l11.527-4.444c.533-.194 1.002.131.759.149z" />
                </svg>
              }
            >
              @addbloger_uz
            </ContactItem>
            <ContactItem
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
              Du-Ju 9:00–18:00
            </ContactItem>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© 2025 BlogHub. Barcha huquqlar himoyalangan.</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 7l2.55 2.4A1 1 0 0116 11H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                clipRule="evenodd"
              />
            </svg>
            Toshkent, O'zbekiston
          </span>
        </div>
      </div>
    </footer>
  );
}
