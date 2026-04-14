import React from "react";

const gradients = [
  "linear-gradient(135deg, #2979FF, #1565C0)",
  "linear-gradient(135deg, #E91E8C, #C2185B)",
  "linear-gradient(135deg, #9C27B0, #6A0080)",
  "linear-gradient(135deg, #FF5722, #BF360C)",
  "linear-gradient(135deg, #2E7D32, #1B5E20)",
  "linear-gradient(135deg, #00897B, #004D40)",
  "linear-gradient(135deg, #F57C00, #E65100)",
  "linear-gradient(135deg, #0288D1, #01579B)",
  "linear-gradient(135deg, #6D4C41, #3E2723)",
  "linear-gradient(135deg, #C62828, #7B1FA2)",
];

function Categories({ nomi, icon, soni }) {
  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <div
      className="relative flex flex-col items-center justify-end gap-1 rounded-xl px-3 pb-6 min-h-[130px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg overflow-hidden"
      style={{ background: randomGradient }}
    >
      <i
        className={`fa-solid ${icon} text-[26px] text-black/20 absolute top-8 left-1/2 -translate-x-1/2`}
      ></i>

      <span className="font-nunito font-bold text-sm text-white z-10 text-center">
        {nomi}
      </span>

      <span className="font-rubik text-[11px] text-white/80 z-10">
        {soni} ta
      </span>
    </div>
  );
}

export default Categories;