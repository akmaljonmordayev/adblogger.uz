import React from "react";
import Categories from "./Categories"; // to‘g‘rilandi

function CategoryCard() {
  return (
    <>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="block w-1 h-3 bg-red-600 rounded-sm"></span>
            <i className="fa-solid fa-folder-open text-black text-sm"></i>
            <span className="font-nunito font-extrabold text-base text-black">
              Kategoriyalar
            </span>
          </div>

          <span className="font-rubik font-semibold text-xs text-red-600 cursor-pointer">
            Barchasini ko‘rish →
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
        <Categories nomi="Texnologiya" icon="fa-laptop-code" soni={87} />
        <Categories nomi="Lifestyle" icon="fa-wand-magic-sparkles" soni={120} />
        <Categories nomi="Go'zallik" icon="fa-face-smile" soni={64} />
        <Categories nomi="Ovqat" icon="fa-utensils" soni={45} />
        <Categories nomi="Sport" icon="fa-futbol" soni={52} />
        <Categories nomi="Sayohat" icon="fa-plane" soni={38} />
        <Categories nomi="Biznes" icon="fa-briefcase" soni={71} />
        <Categories nomi="Gaming" icon="fa-gamepad" soni={33} />
        <Categories nomi="Ta'lim" icon="fa-book" soni={58} />
        <Categories nomi="Musiqa" icon="fa-music" soni={29} />
      </div>
    </>
  );
}

export default CategoryCard;