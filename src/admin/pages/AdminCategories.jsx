import { useState, useEffect, useCallback } from "react";
import { toast } from "../../components/ui/toast";
import { adminCategoriesService } from "../../services/adminService";
import { LuLoader } from "react-icons/lu";

const COLORS = [
  "from-red-600 to-red-700", "from-orange-500 to-orange-600",
  "from-yellow-500 to-yellow-600", "from-red-500 to-orange-500",
  "from-orange-600 to-red-600", "from-yellow-600 to-orange-600",
  "from-red-700 to-red-800", "from-orange-400 to-yellow-500",
  "from-red-400 to-orange-500", "from-yellow-400 to-orange-500",
];

const ICON_OPTIONS = ["💻","✏️","😊","🍴","⚽","✈️","💼","🎮","📚","🎵","📸","🎨","🏥","🌿","🎭"];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState(null); // { _id, name, icon }
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newCat, setNewCat] = useState({ name: "", icon: "💻", color: 0 });
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCategoriesService.getAll();
      setCategories(res.data || []);
    } catch {
      toast.error("Kategoriyalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const saveEdit = async () => {
    if (!editingCat?.name?.trim()) return;
    setSaving(true);
    try {
      await adminCategoriesService.update(editingCat._id, { name: editingCat.name.trim(), icon: editingCat.icon });
      toast.success("Kategoriya yangilandi");
      setEditingCat(null);
      fetch();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    setSaving(true);
    try {
      await adminCategoriesService.remove(id);
      toast.success("Kategoriya o'chirildi");
      setShowDeleteConfirm(null);
      fetch();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = async () => {
    if (!newCat.name.trim()) return;
    setSaving(true);
    try {
      await adminCategoriesService.create({ name: newCat.name.trim(), icon: newCat.icon });
      toast.success("Yangi kategoriya qo'shildi");
      setNewCat({ name: "", icon: "💻", color: 0 });
      setShowAddModal(false);
      fetch();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

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
              onChange={e => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 pl-8 w-44 focus:outline-none focus:border-red-400 placeholder-gray-400 transition-colors"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <LuLoader className="animate-spin text-2xl mb-2" />
            Yuklanmoqda…
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3">#</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3">Kategoriya</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-5 py-3">Tartib raqami</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-5 py-3">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat, i) => (
                <tr key={cat._id} className={`border-t border-gray-100 hover:bg-red-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <td className="px-5 py-3.5 text-gray-400 text-sm">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-lg shadow-sm`}>
                        {cat.icon || "📌"}
                      </div>
                      <span className="text-gray-800 font-medium text-sm">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      #{cat.order ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCat({ _id: cat._id, name: cat.name, icon: cat.icon || "📌" })}
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
                <tr><td colSpan={4} className="text-center py-10 text-gray-400 text-sm">Kategoriya topilmadi</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-800 font-bold">Yangi kategoriya qo'shish</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Kategoriya nomi</label>
                <input
                  value={newCat.name}
                  onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                  placeholder="Masalan: Sog'liq"
                  className="w-full border border-gray-200 focus:border-red-400 text-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors placeholder-gray-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Ikonka</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map(ic => (
                    <button key={ic} onClick={() => setNewCat(p => ({ ...p, icon: ic }))}
                      className={`text-2xl p-2 rounded-xl border-2 transition-all ${newCat.icon === ic ? "border-red-500 bg-red-50 scale-110" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl text-sm">Bekor qilish</button>
              <button onClick={addCategory} disabled={saving} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">
                {saving ? "Saqlanmoqda…" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-800 font-bold">Kategoriyani tahrirlash</h3>
              <button onClick={() => setEditingCat(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Yangi nom</label>
                <input
                  value={editingCat.name}
                  onChange={e => setEditingCat(p => ({ ...p, name: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && saveEdit()}
                  className="w-full border border-gray-200 focus:border-yellow-400 text-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Ikonka</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map(ic => (
                    <button key={ic} onClick={() => setEditingCat(p => ({ ...p, icon: ic }))}
                      className={`text-2xl p-2 rounded-xl border-2 transition-all ${editingCat.icon === ic ? "border-yellow-500 bg-yellow-50 scale-110" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setEditingCat(null)} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl text-sm">Bekor qilish</button>
              <button onClick={saveEdit} disabled={saving} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">
                {saving ? "Saqlanmoqda…" : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">🗑️</div>
              <h3 className="text-gray-800 font-bold text-base mb-1">O'chirishni tasdiqlang</h3>
              <p className="text-gray-500 text-sm">
                <span className="text-red-600 font-semibold">"{showDeleteConfirm.name}"</span> o'chirilsinmi?
              </p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-xl text-sm">Yo'q</button>
              <button onClick={() => deleteCategory(showDeleteConfirm._id)} disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">
                {saving ? "O'chirilmoqda…" : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
