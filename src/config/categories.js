/**
 * Yagona kategoriya konfiguratsiyasi.
 * DB da ingliz qiymatlari (Tech, Food …) saqlanadi,
 * foydalanuvchiga esa o'zbek nomlari ko'rsatiladi.
 */

export const CATEGORY_LIST = [
  { value: "Tech",      label: "Texnologiya", emoji: "💻", color: "#2563EB", gradient: "linear-gradient(180deg,#024da1 0%,#012b64 100%)" },
  { value: "Lifestyle", label: "Lifestyle",   emoji: "✨", color: "#A21CAF", gradient: "linear-gradient(180deg,#8c0d3a 0%,#46041d 100%)" },
  { value: "Beauty",    label: "Go'zallik",   emoji: "💄", color: "#E11D48", gradient: "linear-gradient(180deg,#5b137d 0%,#2f0745 100%)" },
  { value: "Food",      label: "Ovqat",       emoji: "🍴", color: "#D97706", gradient: "linear-gradient(180deg,#a13602 0%,#4b1700 100%)" },
  { value: "Sports",    label: "Sport",       emoji: "⚽", color: "#16A34A", gradient: "linear-gradient(180deg,#1a4d7c 0%,#0b2a3e 100%)" },
  { value: "Travel",    label: "Sayohat",     emoji: "✈️", color: "#0D9488", gradient: "linear-gradient(180deg,#1b5e20 0%,#002d12 100%)" },
  { value: "Education", label: "Ta'lim",      emoji: "📚", color: "#0891B2", gradient: "linear-gradient(180deg,#4a148c 0%,#1a0d47 100%)" },
  { value: "Business",  label: "Biznes",      emoji: "💼", color: "#7C3AED", gradient: "linear-gradient(180deg,#b45309 0%,#431407 100%)" },
  { value: "Gaming",    label: "Gaming",      emoji: "🎮", color: "#EA580C", gradient: "linear-gradient(180deg,#9c27b0 0%,#2d003f 100%)" },
  { value: "Music",     label: "Musiqa",      emoji: "🎵", color: "#9333EA", gradient: "linear-gradient(180deg,#2c2c2c 0%,#0a0a0a 100%)" },
  { value: "Other",     label: "Boshqa",      emoji: "🏷️", color: "#64748B", gradient: "linear-gradient(180deg,#334155 0%,#0f172a 100%)" },
];

/** DB qiymati → O'zbek nomi */
export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORY_LIST.map(c => [c.value, c.label])
);

/** DB qiymati → emoji */
export const CATEGORY_EMOJI = Object.fromEntries(
  CATEGORY_LIST.map(c => [c.value, c.emoji])
);

/** DB qiymati → rang */
export const CATEGORY_COLOR = Object.fromEntries(
  CATEGORY_LIST.map(c => [c.value, c.color])
);

/** DB qiymati → gradient */
export const CATEGORY_GRADIENT = Object.fromEntries(
  CATEGORY_LIST.map(c => [c.value, c.gradient])
);

/** Select uchun options massivi (bo'sh "Barchasi" bilan) */
export const CATEGORY_SELECT_OPTIONS = [
  { value: "", label: "Barcha kategoriya" },
  ...CATEGORY_LIST.map(c => ({ value: c.value, label: c.label })),
];
