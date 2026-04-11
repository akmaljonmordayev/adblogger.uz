import React from "react";

const gradients = [
  "linear-gradient(135deg, #2979FF, #1565C0)",   // Ko'k
  "linear-gradient(135deg, #E91E8C, #C2185B)",   // Pushti
  "linear-gradient(135deg, #9C27B0, #6A0080)",   // Binafsha
  "linear-gradient(135deg, #FF5722, #BF360C)",   // To'q sariq-qizil
  "linear-gradient(135deg, #2E7D32, #1B5E20)",   // Yashil
  "linear-gradient(135deg, #00897B, #004D40)",   // Zangori-yashil
  "linear-gradient(135deg, #F57C00, #E65100)",   // Apelsin
  "linear-gradient(135deg, #0288D1, #01579B)",   // Osmon ko'k
  "linear-gradient(135deg, #6D4C41, #3E2723)",   // Kofe jigarrang
  "linear-gradient(135deg, #C62828, #7B1FA2)", // Qizil → Binafsha
];

let gradientIndex = 0;

function Categories({ nomi, icon, soni }) {
  const gradient = gradients[gradientIndex % gradients.length];
  gradientIndex++;

  return (
    <div
      className="relative flex flex-col items-center justify-end gap-2 rounded-2xl px-4 pb-12 min-h-[200px]  cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
      style={{ background: gradient }}
    >
      <i
        className={`fa-solid ${icon} text-[42px] text-black/25 absolute top-14 left-1/2 -translate-x-1/2`}
      ></i>
      <span className="font-nunito font-black text-[15px] text-white z-10">
        {nomi}
      </span>
      <span className="font-rubik text-xs text-white/75 z-10">
        {soni} ta bloger
      </span>
    </div>
  );
}

export default Categories;