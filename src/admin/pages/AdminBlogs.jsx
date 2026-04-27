import { useState } from "react";
import { toast } from "../../components/ui/toast";

const initialPosts = [
  {
    id: 1,
    author: "Sardor Raximov",
    handle: "@sardortech",
    category: "Texnologiya",
    title: "Texnologiya blogeri bo'lishning haqiqiy yuzini ko'rsataman",
    excerpt: "450K obunachiга yetguncha nima qildim, qanday xatolar qildim.",
    date: "8 aprel, 2025",
    readTime: "5 daqiqa",
    visible: true,
    content:
      "Texnologiya — O'zbekistonda eng tez o'sayotgan content nishi.\n\n**Burilish nuqtasi**\n\nBir kuni o'zim uchun savol qo'ydim.",
  },
  {
    id: 2,
    author: "Nilufar Hasanova",
    handle: "@nilufarlife",
    category: "Lifestyle",
    title:
      "Lifestyle blogger bo'lish — bu 'hamma narsani' ko'rsatish degani emas",
    excerpt:
      "Ko'pchilik lifestyle — bu shunchaki hayotingni suratga olish deb o'ylaydi.",
    date: "5 aprel, 2025",
    readTime: "4 daqiqa",
    visible: true,
    content:
      "Lifestyle nishi — blogerlik dunyosidagi eng aldamchi yo'nalish.\n\n**O'zgarish nuqtasi**\n\nMen bir kuni 'ertalabki 5 daqiqam' seriyasini boshlaganimda hamma narsa o'zgardi.",
  },
  {
    id: 3,
    author: "Kamola Ergasheva",
    handle: "@kamola_beauty",
    category: "Go'zallik",
    title:
      "Beauty blogger bo'lish: brendlar sizni topgunga qadar nima qilish kerak?",
    excerpt:
      "Har bir beauty blogger bir kun brendlar bilan ishlashni orzu qiladi.",
    date: "3 aprel, 2025",
    readTime: "6 daqiqa",
    visible: true,
    content:
      "Go'zallik nishi — O'zbekistondagi eng raqobatli blogerlik yo'nalishlaridan biri.",
  },
  {
    id: 4,
    author: "Ulugbek Nazarov",
    handle: "@foody_uz",
    category: "Ovqat",
    title: "Food blogger bo'lish: faqat taom emas, hikoya sotasiz",
    excerpt:
      "Suratga olish qiyin. Yoritish qiyin. Ammo eng qiyini — hikoya yasash.",
    date: "1 aprel, 2025",
    readTime: "5 daqiqa",
    visible: false,
    content:
      "Food blogerlik — ko'rinishidan eng oson, amalda esa eng ko'p mahorat talab qiladigan nishlardan biri.",
  },
  {
    id: 5,
    author: "Meliqoziyev Jorabek",
    handle: "@jorabek_travel",
    category: "Sport",
    title: "15 million obunachilik: sport blogeri bo'lishda mening formulam",
    excerpt: "Kattalik sabr va tizimlilikdan keladi, iqtidordan emas.",
    date: "29 mart, 2025",
    readTime: "7 daqiqa",
    visible: true,
    content:
      "15 million. Bu raqam 6 yil davomida, har kuni ishlash orqali keldi.",
  },
  {
    id: 6,
    author: "Diyorbek Yuldashev",
    handle: "@diyorbek_music",
    category: "Musiqa",
    title: "Musiqa blogeri: tinglovchini qanday o'zingga bog'laysan?",
    excerpt:
      "800K odamni bir joyga to'plash uchun menga boshqa narsa kerak bo'ldi.",
    date: "27 mart, 2025",
    readTime: "5 daqiqa",
    visible: true,
    content: "Musiqa nishi — O'zbekistonda o'ziga xos.",
  },
  {
    id: 7,
    author: "Gulnora Karimova",
    handle: "@gulnora_fashion",
    category: "Lifestyle",
    title: "Fashion blogger bo'lish: kiyim emas, identifikatsiya sotasiz",
    excerpt:
      "250K obunachiim meni kiyim uchun emas, o'zlarini ko'rish uchun kuzatadi.",
    date: "24 mart, 2025",
    readTime: "6 daqiqa",
    visible: true,
    content: "Fashion blogerlik — bu kiyim namoyishi emas.",
  },
  {
    id: 8,
    author: "Azizbek Qodirov",
    handle: "@azizbek_gaming",
    category: "Gaming",
    title:
      "O'zbek gaming kontenti: nima uchun biz hali potensialimizni ochmadik?",
    excerpt: "1.2M obunachilik bilan gaming segmentini ko'raman.",
    date: "21 mart, 2025",
    readTime: "6 daqiqa",
    visible: false,
    content: "O'zbekistonda gaming auditoriyasi — ulkan.",
  },
  {
    id: 9,
    author: "Shahnoza Yusupova",
    handle: "@shahnoza_travel",
    category: "Sayohat",
    title:
      "Sayohat blogeri: dunyoni ko'rish uchun pul yig'ish emas, pul topish",
    excerpt:
      "600K obunachiim bilan O'zbekistonda va dunyoda ko'p joyda bo'ldim.",
    date: "18 mart, 2025",
    readTime: "8 daqiqa",
    visible: true,
    content: "Sayohat blogeringni ko'pchilik 'boyman' deb tushunadi.",
  },
  {
    id: 10,
    author: "Bekzod Tursunov",
    handle: "@bekzod_education",
    category: "Ta'lim",
    title:
      "Ta'lim blogeri bo'lish: odamlar bilim uchun emas, natija uchun keladi",
    excerpt: "350K obunachiim ko'p narsani o'rgatdi.",
    date: "15 mart, 2025",
    readTime: "5 daqiqa",
    visible: true,
    content: "Ta'lim nishi — eng mas'uliyatli blogerlik yo'nalishi.",
  },
  {
    id: 11,
    author: "Salohiddin Mirzakbarov",
    handle: "@salohiddin_fitness",
    category: "Sport",
    title: "Fitness bloger: 900K obunachilik meni qanday o'zgartirdi?",
    excerpt: "Fitness kontenti ko'p. Ammo 900K ga yetgan fitness bloger kam.",
    date: "12 mart, 2025",
    readTime: "6 daqiqa",
    visible: true,
    content:
      "Fitness nishi — O'zbekistonda eng tez o'sayotgan blogerlik segmentlaridan biri.",
  },
  {
    id: 12,
    author: "Salimov Asadbek",
    handle: "@asadbek_gamer",
    category: "Gaming",
    title: "Yosh gaming bloger: 500K ga yetishda mening 3 ta asosiy qoidam",
    excerpt: "20 yoshda 500K — bu baxtiyor tasodif emas.",
    date: "9 mart, 2025",
    readTime: "4 daqiqa",
    visible: true,
    content: "Men gaming blogeringga kirganimda 17 yoshda edim.",
  },
  {
    id: 13,
    author: "Doniyorov Ozodbek",
    handle: "@ozodbek_Teach",
    category: "Ta'lim",
    title: "Ta'lim kontenti: nima uchun 'foydali' kontent ko'rilmaydi?",
    excerpt: "Foydali kontent va qiziqarli kontent — bular bir xil emas.",
    date: "6 mart, 2025",
    readTime: "5 daqiqa",
    visible: false,
    content: "'Bu kontent foydali edi' — eng xavfli maqtov.",
  },
];

const catMeta = {
  Texnologiya: { color: "text-blue-500", bg: "bg-blue-50", dot: "bg-blue-500" },
  Lifestyle: { color: "text-pink-500", bg: "bg-pink-50", dot: "bg-pink-500" },
  "Go'zallik": { color: "text-rose-500", bg: "bg-rose-50", dot: "bg-rose-500" },
  Ovqat: { color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-600" },
  Sport: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    dot: "bg-emerald-600",
  },
  Musiqa: {
    color: "text-violet-500",
    bg: "bg-violet-50",
    dot: "bg-violet-500",
  },
  Gaming: {
    color: "text-orange-500",
    bg: "bg-orange-50",
    dot: "bg-orange-500",
  },
  Sayohat: { color: "text-teal-600", bg: "bg-teal-50", dot: "bg-teal-600" },
  "Ta'lim": {
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    dot: "bg-indigo-500",
  },
};

const allCats = ["Barchasi", ...Object.keys(catMeta)];

const avatarPairs = [
  ["bg-red-100", "text-red-800"],
  ["bg-amber-100", "text-amber-800"],
  ["bg-emerald-100", "text-emerald-800"],
  ["bg-blue-100", "text-blue-800"],
  ["bg-violet-100", "text-violet-800"],
  ["bg-pink-100", "text-pink-800"],
  ["bg-cyan-100", "text-cyan-800"],
  ["bg-rose-100", "text-rose-800"],
];

function initials(name) {
  const p = name.trim().split(" ");
  return (p[0][0] + (p[1]?.[0] ?? "")).toUpperCase();
}

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── FORM MODAL ───────────────────────────────────────────────────────────────
function FormModal({ title, data, onSubmit, onClose }) {
  const cats = Object.keys(catMeta);
  const [form, setForm] = useState(
    data ?? {
      title: "",
      author: "",
      handle: "",
      category: cats[0],
      readTime: "5 daqiqa",
      excerpt: "",
      content: "",
    },
  );
  const valid = form.title.trim() && form.author.trim();
  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div
      className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3">
          <Field label="Sarlavha *">
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 transition-colors"
              value={form.title}
              onChange={f("title")}
              placeholder="Sarlavha..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Muallif *">
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 transition-colors"
                value={form.author}
                onChange={f("author")}
                placeholder="Ism Familiya"
              />
            </Field>
            <Field label="Handle">
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 transition-colors"
                value={form.handle}
                onChange={f("handle")}
                placeholder="@username"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Kategoriya">
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 transition-colors bg-white"
                value={form.category}
                onChange={f("category")}
              >
                {cats.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="O'qish vaqti">
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 transition-colors"
                value={form.readTime}
                onChange={f("readTime")}
                placeholder="5 daqiqa"
              />
            </Field>
          </div>

          <Field label="Qisqa tavsif">
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 transition-colors resize-y"
              rows={3}
              value={form.excerpt}
              onChange={f("excerpt")}
              placeholder="Qisqacha..."
            />
          </Field>

          <Field label="Kontent">
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-red-500 transition-colors resize-y"
              rows={5}
              value={form.content}
              onChange={f("content")}
              placeholder="Maqola matni..."
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Bekor
          </button>
          <button
            onClick={() => valid && onSubmit(form)}
            disabled={!valid}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            {data ? "Saqlash" : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const AdminBlogs = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Barchasi");
  const [tab, setTab] = useState("all");
  const [deleteTarget, setDelete] = useState(null);
  const [editTarget, setEdit] = useState(null);
  const [viewTarget, setView] = useState(null);
  const [addOpen, setAdd] = useState(false);
  const notify = (msg, type = "ok") => {
    if (type === "err") toast.error(msg);
    else if (type === "warn") toast.warning(msg);
    else toast.success(msg);
  };

  const toggleVisible = (id) => {
    const post = posts.find((p) => p.id === id);
    setPosts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)),
    );
    notify(
      post.visible ? "Yashirildi" : "Ko'rsatildi",
      post.visible ? "warn" : "ok",
    );
  };

  const doDelete = (id) => {
    setPosts((ps) => ps.filter((p) => p.id !== id));
    setDelete(null);
    notify("Maqola o'chirildi", "err");
  };

  const doSave = (updated) => {
    setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
    setEdit(null);
    notify("Saqlandi");
  };

  const doAdd = (form) => {
    const id = Math.max(...posts.map((p) => p.id)) + 1;
    setPosts((ps) => [
      {
        ...form,
        id,
        visible: true,
        date: new Date().toLocaleDateString("uz-UZ"),
      },
      ...ps,
    ]);
    setAdd(false);
    notify("Yangi maqola qo'shildi");
  };

  const filtered = posts.filter((p) => {
    const okCat = cat === "Barchasi" || p.category === cat;
    const okTab = tab === "all" || (tab === "on" ? p.visible : !p.visible);
    const q = search.toLowerCase();
    return (
      okCat &&
      okTab &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q))
    );
  });

  const vis = posts.filter((p) => p.visible).length;
  const hidden = posts.filter((p) => !p.visible).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── NAVBAR ─── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1160px] mx-auto px-7 h-14 flex items-center gap-5">
          {/* Brand */}
          <div className="flex items-center gap-2 mr-2 shrink-0">
            <div className="w-[26px] h-[26px] bg-red-600 rounded-lg flex items-center justify-center">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
              </svg>
            </div>
            <span className="font-extrabold text-sm text-gray-900 tracking-tight">
              BlogAdmin
            </span>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {[
              ["all", "Barchasi", posts.length],
              ["on", "Ko'rinadigan", vis],
              ["off", "Yashirilgan", hidden],
            ].map(([key, label, cnt]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  tab === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
                <span
                  className={`text-[10px] px-1.5 rounded-full font-mono ${
                    tab === key ? "bg-red-50 text-red-600" : "text-gray-300"
                  }`}
                >
                  {cnt}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-[280px]">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12"
              height="12"
              fill="none"
              stroke="#B0ADA7"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="10" cy="10" r="7" />
              <line x1="15" y1="15" x2="21" y2="21" />
            </svg>
            <input
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-red-500 transition-colors bg-white"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Count */}
          <span className="text-xs text-gray-300 font-mono whitespace-nowrap">
            {filtered.length}/{posts.length}
          </span>

          {/* Add */}
          <button
            onClick={() => setAdd(true)}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <svg
              width="11"
              height="11"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Yangi maqola
          </button>
        </div>

        {/* Category filters */}
        <div className="max-w-[1160px] mx-auto px-7 pb-2.5 flex flex-wrap gap-1.5">
          {allCats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                cat === c
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── MAIN ─── */}
      <main className="max-w-[1160px] mx-auto px-7 py-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Jami", val: posts.length, cls: "text-indigo-500" },
            { label: "Ko'rinadigan", val: vis, cls: "text-emerald-600" },
            { label: "Yashirilgan", val: hidden, cls: "text-amber-600" },
            {
              label: "Kategoriyalar",
              val: Object.keys(catMeta).length,
              cls: "text-red-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3"
            >
              <span
                className={`text-2xl font-extrabold font-mono leading-none ${s.cls}`}
              >
                {s.val}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-300 text-sm">
              <div className="text-3xl mb-2">∅</div>
              Hech narsa topilmadi
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Muallif",
                    "Sarlavha",
                    "Kategoriya",
                    "Sana",
                    "Ko'rinish",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => {
                  const pal = avatarPairs[post.id % avatarPairs.length];
                  const cm = catMeta[post.category];
                  return (
                    <tr
                      key={post.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      {/* Author */}
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg ${pal[0]} ${pal[1]} flex items-center justify-center text-[11px] font-bold shrink-0`}
                          >
                            {initials(post.author)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                              {post.author}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              {post.handle}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-2.5 max-w-[300px]">
                        <div className="text-[13px] text-gray-700 leading-snug line-clamp-2">
                          {post.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {cm ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cm.bg} ${cm.color}`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${cm.dot}`}
                            />
                            {post.category}
                          </span>
                        ) : (
                          post.category
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-[11px] text-gray-400 font-mono">
                          {post.date}
                        </span>
                      </td>

                      {/* Toggle */}
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <label className="relative w-9 h-5 shrink-0 cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={post.visible}
                              onChange={() => toggleVisible(post.id)}
                            />
                            <span className="absolute inset-0 rounded-full bg-gray-300 peer-checked:bg-emerald-500 transition-colors" />
                            <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                          </label>
                          <span
                            className={`text-[11px] font-semibold ${post.visible ? "text-emerald-600" : "text-gray-300"}`}
                          >
                            {post.visible ? "Ko'rinadigan" : "Yashirilgan"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2.5">
                        <div className="flex gap-0.5">
                          <button
                            title="Ko'rish"
                            onClick={() => setView(post)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all"
                          >
                            <svg
                              width="13"
                              height="13"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            title="Tahrirlash"
                            onClick={() => setEdit({ ...post })}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 transition-all"
                          >
                            <svg
                              width="13"
                              height="13"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            title="O'chirish"
                            onClick={() => setDelete(post)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <svg
                              width="13"
                              height="13"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ─── DELETE CONFIRM ─── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setDelete(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-7 pb-0 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-3.5">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Maqolani o'chirish
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                <strong className="text-gray-900">
                  "{deleteTarget.title}"
                </strong>{" "}
                — o'chirilsin? Qaytarib bo'lmaydi.
              </p>
            </div>
            <div className="px-6 py-5 flex justify-center gap-2">
              <button
                onClick={() => setDelete(null)}
                className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Bekor
              </button>
              <button
                onClick={() => doDelete(deleteTarget.id)}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW MODAL ─── */}
      {viewTarget && (
        <div
          className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setView(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-500">
                Ko'rish
              </span>
              <button
                onClick={() => setView(null)}
                className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              {catMeta[viewTarget.category] && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-3 ${catMeta[viewTarget.category].bg} ${catMeta[viewTarget.category].color}`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${catMeta[viewTarget.category].dot}`}
                  />
                  {viewTarget.category}
                </span>
              )}
              <h2 className="text-base font-bold leading-snug mb-2 text-gray-900">
                {viewTarget.title}
              </h2>
              <p className="text-[11px] text-gray-400 mb-3.5">
                {viewTarget.author} · {viewTarget.handle} · {viewTarget.date} ·{" "}
                {viewTarget.readTime}
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed px-3.5 py-3 bg-gray-50 rounded-lg border-l-[3px] border-red-600 mb-3.5">
                {viewTarget.excerpt}
              </p>
              {viewTarget.content
                .split("\n\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p
                    key={i}
                    className={`text-[13px] leading-relaxed mb-2 ${p.startsWith("**") ? "font-bold text-gray-900" : "text-gray-500"}`}
                  >
                    {p.replace(/\*\*/g, "")}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT / ADD MODAL ─── */}
      {editTarget && (
        <FormModal
          title="Tahrirlash"
          data={editTarget}
          onSubmit={doSave}
          onClose={() => setEdit(null)}
        />
      )}
      {addOpen && (
        <FormModal
          title="Yangi maqola"
          data={null}
          onSubmit={doAdd}
          onClose={() => setAdd(false)}
        />
      )}

    </div>
  );
};

export default AdminBlogs;
