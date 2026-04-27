import { useState } from "react";
import { toast } from "../../components/ui/toast";

const COLORS = [
  "from-red-600 to-red-700",
  "from-orange-500 to-orange-600",
  "from-yellow-500 to-yellow-600",
  "from-red-500 to-orange-500",
  "from-orange-600 to-red-600",
  "from-yellow-600 to-orange-600",
  "from-red-700 to-red-800",
  "from-orange-400 to-yellow-500",
  "from-red-400 to-orange-500",
  "from-yellow-400 to-orange-500",
];

const ICON_OPTIONS = [
  "💻",
  "✏️",
  "😊",
  "🍴",
  "⚽",
  "✈️",
  "💼",
  "🎮",
  "📚",
  "🎵",
  "📸",
  "🎨",
  "🏥",
  "🌿",
  "🎭",
];

const initialCategories = [
  { id: 1, name: "Texnologiya", blogCount: 87, color: 0, icon: "💻" },
  { id: 2, name: "Lifestyle", blogCount: 120, color: 1, icon: "✏️" },
  { id: 3, name: "Go'zallik", blogCount: 64, color: 2, icon: "😊" },
  { id: 4, name: "Ovqat", blogCount: 45, color: 3, icon: "🍴" },
  { id: 5, name: "Sport", blogCount: 52, color: 4, icon: "⚽" },
  { id: 6, name: "Sayohat", blogCount: 38, color: 5, icon: "✈️" },
  { id: 7, name: "Biznes", blogCount: 71, color: 6, icon: "💼" },
  { id: 8, name: "Gaming", blogCount: 33, color: 7, icon: "🎮" },
  { id: 9, name: "Ta'lim", blogCount: 58, color: 8, icon: "📚" },
  { id: 10, name: "Musiqa", blogCount: 29, color: 9, icon: "🎵" },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newCat, setNewCat] = useState({ name: "", icon: "💻", color: 0 });
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => {
    if (type === "error") toast.error(msg);
    else toast.success(msg);
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? { ...c, name: editName.trim(), icon: editIcon }
          : c,
      ),
    );
    setEditingId(null);
    showToast("Kategoriya yangilandi ✅");
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setShowDeleteConfirm(null);
    showToast("Kategoriya o'chirildi", "error");
  };

  const addCategory = () => {
    if (!newCat.name.trim()) return;
    setCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newCat.name.trim(),
        blogCount: 0,
        color: newCat.color,
        icon: newCat.icon,
      },
    ]);
    setNewCat({ name: "", icon: "💻", color: 0 });
    setShowAddModal(false);
    showToast("Yangi kategoriya qo'shildi 🎉");
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-red-600 rounded-full" />
          <h1 className="text-xl font-bold text-gray-800">Kategoriyalar</h1>
          <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {categories.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 pl-8 w-44 focus:outline-none focus:border-red-400 placeholder-gray-400 transition-colors"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              🔍
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all"
          >
            + Qo'shish
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3">
                #
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3">
                Kategoriya
              </th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3">
                Bloglar soni
              </th>
              <th className="text-right text-xs font-semibold uppercase tracking-wide px-5 py-3">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat, i) => (
              <tr
                key={cat.id}
                className={`border-t border-gray-100 hover:bg-red-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
              >
                <td className="px-5 py-3.5 text-gray-400 text-sm">{i + 1}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${COLORS[cat.color % COLORS.length]} flex items-center justify-center text-lg shadow-sm`}
                    >
                      {cat.icon}
                    </div>
                    <span className="text-gray-800 font-medium text-sm">
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {cat.blogCount} ta bloger
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="flex items-center gap-1 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ✏️ Tahrirlash
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(cat)}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-300 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      🗑️ O'chirish
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Kategoriya topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-800 font-bold">
                Yangi kategoriya qo'shish
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Kategoriya nomi
                </label>
                <input
                  value={newCat.name}
                  onChange={(e) =>
                    setNewCat((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Masalan: Sog'liq"
                  className="w-full border border-gray-200 focus:border-red-400 text-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-gray-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Ikonka
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setNewCat((p) => ({ ...p, icon: ic }))}
                      className={`text-2xl p-2 rounded-xl border-2 transition-all ${newCat.icon === ic ? "border-red-500 bg-red-50 scale-110" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Rang
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setNewCat((p) => ({ ...p, color: i }))}
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${c} transition-all ${newCat.color === i ? "scale-125 ring-2 ring-red-400 ring-offset-1" : "hover:scale-110"}`}
                    />
                  ))}
                </div>
              </div>
              <div
                className={`rounded-xl bg-gradient-to-br ${COLORS[newCat.color]} px-4 py-3 flex items-center gap-3`}
              >
                <span className="text-2xl">{newCat.icon}</span>
                <div>
                  <div className="text-white font-bold text-sm">
                    {newCat.name || "Kategoriya nomi"}
                  </div>
                  <div className="text-white/70 text-xs">0 ta bloger</div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={addCategory}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-800 font-bold">
                Kategoriyani tahrirlash
              </h3>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Yangi nom
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="w-full border border-gray-200 focus:border-yellow-400 text-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Ikonka
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setEditIcon(ic)}
                      className={`text-2xl p-2 rounded-xl border-2 transition-all ${editIcon === ic ? "border-yellow-500 bg-yellow-50 scale-110" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                🗑️
              </div>
              <h3 className="text-gray-800 font-bold text-base mb-1">
                O'chirishni tasdiqlang
              </h3>
              <p className="text-gray-500 text-sm">
                <span className="text-red-600 font-semibold">
                  "{showDeleteConfirm.name}"
                </span>{" "}
                o'chirilsinmi?
              </p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Yo'q
              </button>
              <button
                onClick={() => deleteCategory(showDeleteConfirm.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
