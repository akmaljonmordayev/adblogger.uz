import { NavLink } from "react-router-dom";
import { useState } from "react";
import HeroSwiper from "./HeroSwiper";
import CategorySection from "./CategorySection";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">

        {/* TOP BAR */}
        <div className="bg-red-600 text-white text-xs sm:text-sm">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-4">
              <span>📍 Toshkent</span>
              <span className="hidden sm:block">🔥 500+ tasdiqlangan bloger</span>
            </div>

            <div className="flex items-center gap-3">
              <NavLink to="/login" className="hover:underline">
                Kirish
              </NavLink>
              <NavLink
                to="/register"
                className="bg-orange-400 hover:bg-orange-500 transition px-3 py-1 rounded-md font-medium"
              >
                Bloger bo'lish
              </NavLink>
            </div>
          </div>
        </div>

        {/* MAIN NAV */}
        <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-4">

          {/* LOGO */}
          <NavLink to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-red-500">add</span>
            <span className="text-yellow-500">Bloger</span>
          </NavLink>

          {/* SEARCH */}
          <div className="hidden lg:flex items-center w-[400px] border rounded-lg overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-red-400">
            <input
              type="text"
              placeholder="Bloger, kategoriya..."
              className="w-full px-3 py-2 bg-transparent outline-none text-sm"
            />
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 transition">
              🔍
            </button>
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <li>
              <NavLink to="/" className="hover:text-red-500">
                Bosh sahifa
              </NavLink>
            </li>
            <li>
              <NavLink to="/blogerlar" className="hover:text-red-500">
                Blogerlar
              </NavLink>
            </li>
            <li>
              <NavLink to="/kategoriyalar" className="hover:text-red-500">
                Kategoriyalar
              </NavLink>
            </li>
            <li>
              <NavLink to="/narxlar" className="hover:text-red-500">
                Narxlar
              </NavLink>
            </li>
            <li>
              <NavLink to="/boglanish" className="hover:text-red-500">
                Bog'lanish
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/elon-berish"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
              >
                + E'lon
              </NavLink>
            </li>
          </ul>

          {/* MOBILE MENU BUTTON */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl cursor-pointer"
          >
            ☰
          </div>
        </nav>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3 border-t bg-white">

            <div className="flex border rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-full px-3 py-2 outline-none text-sm"
              />
              <button className="bg-red-500 text-white px-4">🔍</button>
            </div>

            <NavLink to="/" className="block">Bosh sahifa</NavLink>
            <NavLink to="/blogerlar" className="block">Blogerlar</NavLink>
            <NavLink to="/kategoriyalar" className="block">Kategoriyalar</NavLink>
            <NavLink to="/narxlar" className="block">Narxlar</NavLink>
            <NavLink to="/boglanish" className="block">Bog'lanish</NavLink>

            <NavLink
              to="/elon-berish"
              className="block bg-red-500 text-white text-center px-4 py-2 rounded-lg"
            >
              + E'lon berish
            </NavLink>
          </div>
        )}
      </header>

      <CategorySection />
      <HeroSwiper />
    </>
  );
}

export default Header;