import React from "react";
import Categories from "../../pages/Categories";

function CategoryCard() {
  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 px-4">
          <div className="flex items-center gap-2">
            <span className="block w-1 h-4 bg-red-600 rounded-sm"></span>
            <i className="fa-solid fa-folder-open text-black text-lg"></i>
            <span className="font-nunito font-extrabold text-lg text-black">
              Kategoriyalar
            </span>
          </div>
          <span className="font-rubik font-semibold text-sm text-red-600 cursor-pointer">
            Barchasini ko'rish →
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <Categories index={0} nomi="Texnologiya" icon="fa-laptop-code" soni={87} />
        <Categories index={1} nomi="Lifestyle"   icon="fa-magic"       soni={120} />
        <Categories index={2} nomi="Go'zallik"   icon="fa-spa"         soni={95} />
        <Categories index={3} nomi="Ovqat"       icon="fa-utensils"    soni={45} />
        <Categories index={4} nomi="Sport"       icon="fa-futbol"      soni={52} />
        <Categories index={5} nomi="Sayohat"     icon="fa-plane"       soni={67} />
        <Categories index={6} nomi="Biznes"      icon="fa-briefcase"   soni={71} />
        <Categories index={7} nomi="Gaming"      icon="fa-gamepad"     soni={33} />
        <Categories index={8} nomi="Ta'lim"      icon="fa-book"        soni={58} />
        <Categories index={9} nomi="Musiqa"      icon="fa-music"       soni={29} />
      </div>
    </>
  );
}

export default CategoryCard;