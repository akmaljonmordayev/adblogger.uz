import React from "react";
import CategoryItem from "./CategoryItem";

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
        <CategoryItem nomi="Texnologiya" icon="fa-laptop-code" soni={87} />
        <CategoryItem nomi="Lifestyle" icon="fa-wand-magic-sparkles" soni={120} />
        <CategoryItem nomi="Go'zallik" icon="fa-face-smile" soni={64} />
        <CategoryItem nomi="Ovqat" icon="fa-utensils" soni={45} />
        <CategoryItem nomi="Sport" icon="fa-futbol" soni={52} />
        <CategoryItem nomi="Sayohat" icon="fa-plane" soni={38} />
        <CategoryItem nomi="Biznes" icon="fa-briefcase" soni={71} />
        <CategoryItem nomi="Gaming" icon="fa-gamepad" soni={33} />
        <CategoryItem nomi="Ta'lim" icon="fa-book" soni={58} />
        <CategoryItem nomi="Musiqa" icon="fa-music" soni={29} />
      </div>
    </>
  );
}

export default CategoryCard;