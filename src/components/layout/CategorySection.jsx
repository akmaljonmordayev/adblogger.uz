import { useState } from "react";

const categories = [
  { id: "all", label: "Barchasi", icon: "fa-house", count: 500 },
  { id: "tech", label: "Texnologiya", icon: "fa-laptop-code", count: 87 },
  { id: "lifestyle", label: "Lifestyle", icon: "fa-magic", count: 120 },
  { id: "beauty", label: "Go'zallik", icon: "fa-face-smile", count: 64 },
  { id: "food", label: "Ovqat", icon: "fa-utensils", count: 45 },
  { id: "sport", label: "Sport", icon: "fa-futbol", count: 52 },
  { id: "travel", label: "Sayohat", icon: "fa-plane", count: 38 },
  { id: "business", label: "Biznes", icon: "fa-briefcase", count: 71 },
  { id: "gaming", label: "Gaming", icon: "fa-gamepad", count: 33 },
  { id: "education", label: "Ta'lim", icon: "fa-book", count: 58 },
  { id: "music", label: "Musiqa", icon: "fa-music", count: 29 },
];

function CategorySection() {
  const [active, setActive] = useState("all");

  const handleClick = (id, e) => {
    setActive(id);
    e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <>
      <div className="bg-white border-b-2 border-gray-200">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
          <div className="flex items-center gap-[2px] whitespace-nowrap max-w-[1300px] mx-auto px-4">
            {categories.map(({ id, label, icon, count }) => (
              <button
                key={id}
                onClick={(e) => handleClick(id, e)}
                className={`
              inline-flex items-center gap-[6px] px-4 py-3
              text-[13px] font-semibold border-b-[3px] cursor-pointer shrink-0
              transition-colors duration-150
              ${active === id
                    ? "text-red-600 border-red-600"
                    : "text-gray-600 border-transparent hover:text-red-600"}
            `}
              >
                <i className={`fa-solid ${icon} text-[14px]`}></i>
                {label}
                <span className={`
              text-[11px] font-bold px-[6px] py-[1px] rounded-full
              ${active === id
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-500"}
            `}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>





    </>
  );
}


export default CategorySection;