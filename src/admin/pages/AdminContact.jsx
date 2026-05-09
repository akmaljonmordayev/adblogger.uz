import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail, FiMessageSquare, FiCheckCircle, FiTrash2,
  FiSearch, FiRefreshCw, FiSend, FiX, FiInbox,
  FiClock, FiEye,
} from "react-icons/fi";
import api from "../../services/api";
import { toast } from "../../components/ui/toast";

// ─── helpers ──────────────────────────────────────────────────────────────────
const STATUS_CFG = {
  new:       { label: "Yangi",     dot: "bg-red-500",     pill: "bg-red-50 text-red-600 border-red-200" },
  read:      { label: "Ko'rildi",  dot: "bg-slate-400",   pill: "bg-slate-100 text-slate-500 border-slate-200" },
  responded: { label: "Javob b.", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const ROLE_LABELS = { blogger: "Blogger", business: "Biznesmen", other: "Boshqa" };

const AVATAR_GRADS = [
  "from-red-500 to-rose-600", "from-rose-500 to-pink-600",
  "from-red-600 to-red-800",  "from-pink-500 to-rose-500",
];

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??";
}

function fmtShort(iso) {
  const diff = Date.now() - new Date(iso);
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "hozirgina";
  if (h < 24) return `${h}s oldin`;
  const d = Math.floor(diff / 86_400_000);
  if (d < 7) return `${d}k oldin`;
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
}

function fmtFull(iso) {
  return new Date(iso).toLocaleString("uz-UZ", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Reply Modal ──────────────────────────────────────────────────────────────
function ReplyModal({ contact, onClose, onReplied }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.patch(`/admin/contacts/${contact._id}/reply`, { reply: text.trim() });
      toast.success("Javob yuborildi!");
      onReplied();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Javob yozish</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {contact.name} — <span className="text-slate-500">{contact.email}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <FiX size={18} />
          </button>
        </div>

        {/* Original message */}
        <div className="mx-6 my-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Xabar</p>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{contact.message}</p>
        </div>

        {/* Reply textarea */}
        <div className="px-6 pb-5">
          <label className="block text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Javobingiz</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            placeholder="Javob yozing..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-50 outline-none text-sm text-slate-700 resize-none transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">
            {contact.userId
              ? "Javob bildirishnoma sifatida foydalanuvchiga yuboriladi"
              : "Faqat email orqali yuboriladi (ro'yxatdan o'tmagan foydalanuvchi)"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={send}
            disabled={!text.trim() || loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
          >
            <FiSend size={14} />
            {loading ? "Yuborilmoqda..." : "Yuborish"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminContact() {
  const [contacts, setContacts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected]       = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await api.get(`/admin/contacts${params}`);
      setContacts(res.data.data || []);
    } catch {
      toast.error("Xabarlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const openContact = async (c) => {
    setSelected(c);
    if (c.status === "new") {
      try {
        const res = await api.get(`/admin/contacts/${c._id}`);
        setContacts(prev => prev.map(x => x._id === c._id ? res.data.data : x));
        setSelected(res.data.data);
      } catch { /* ignore */ }
    }
  };

  const deleteContact = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Xabarni o'chirasizmi?")) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success("O'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  const filtered = contacts.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q)
    );
  });

  const stats = {
    total:     contacts.length,
    new:       contacts.filter(c => c.status === "new").length,
    read:      contacts.filter(c => c.status === "read").length,
    responded: contacts.filter(c => c.status === "responded").length,
  };

  return (
    <div className="flex flex-col h-full gap-4" style={{ fontFamily: "'Inter',sans-serif" }}>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Jami",      value: stats.total,     icon: FiInbox,        color: "#6366f1" },
          { label: "Yangi",     value: stats.new,       icon: FiMail,         color: "#dc2626" },
          { label: "Ko'rildi",  value: stats.read,      icon: FiEye,          color: "#64748b" },
          { label: "Javob b.", value: stats.responded, icon: FiCheckCircle,  color: "#16a34a" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.color + "18" }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 leading-none">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ism, email yoki mavzu bo'yicha qidirish..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {["all", "new", "read", "responded"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === s
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-slate-500 border-slate-200 hover:border-red-300"
              }`}
            >
              {s === "all" ? "Barchasi" : STATUS_CFG[s]?.label}
            </button>
          ))}

          <button
            onClick={fetchContacts}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-red-300 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex gap-4 min-h-0 flex-1">

        {/* List */}
        <div className="flex flex-col gap-2 w-full lg:w-[340px] xl:w-[380px] overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FiInbox size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Xabar topilmadi</p>
            </div>
          ) : filtered.map(c => {
            const cfg = STATUS_CFG[c.status] || STATUS_CFG.new;
            const isActive = selected?._id === c._id;
            const gradIdx = c.name.charCodeAt(0) % AVATAR_GRADS.length;
            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => openContact(c)}
                className={`group relative p-4 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? "border-red-400 bg-red-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-red-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_GRADS[gradIdx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {getInitials(c.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-semibold truncate ${c.status === "new" ? "text-slate-900" : "text-slate-700"}`}>
                        {c.name}
                      </p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{fmtShort(c.createdAt)}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${c.status === "new" ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                      {c.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                      {c.role && c.role !== "other" && (
                        <span className="text-[10px] text-slate-400">{ROLE_LABELS[c.role]}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => deleteContact(c._id, e)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <FiTrash2 size={12} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="flex-1 hidden lg:block overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-100 h-full p-6"
              >
                {/* Contact header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${AVATAR_GRADS[selected.name.charCodeAt(0) % AVATAR_GRADS.length]} flex items-center justify-center text-white font-bold`}>
                      {getInitials(selected.name)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{selected.name}</p>
                      <p className="text-xs text-slate-400">{selected.email}</p>
                      {selected.phone && (
                        <p className="text-xs text-slate-400">{selected.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.role && selected.role !== "other" && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                        {ROLE_LABELS[selected.role]}
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${STATUS_CFG[selected.status]?.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[selected.status]?.dot}`} />
                      {STATUS_CFG[selected.status]?.label}
                    </span>
                  </div>
                </div>

                {/* Subject & date */}
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-800 text-base mb-1">{selected.subject}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <FiClock size={11} />
                    {fmtFull(selected.createdAt)}
                  </p>
                </div>

                {/* Message */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Existing reply */}
                {selected.reply && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCheckCircle size={13} className="text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">Javob yuborildi</span>
                      {selected.repliedAt && (
                        <span className="text-xs text-emerald-500 ml-auto">{fmtFull(selected.repliedAt)}</span>
                      )}
                    </div>
                    <p className="text-sm text-emerald-800 leading-relaxed whitespace-pre-wrap">{selected.reply}</p>
                  </div>
                )}

                {/* Admin note */}
                {selected.adminNote && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                    <p className="text-xs text-amber-700 font-medium mb-1">Admin eslatma</p>
                    <p className="text-xs text-amber-600">{selected.adminNote}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setReplyTarget(selected)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <FiSend size={13} />
                    {selected.reply ? "Yana javob" : "Javob yozish"}
                  </button>
                  <button
                    onClick={() => deleteContact(selected._id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={13} />
                    O'chirish
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full bg-white rounded-2xl border border-slate-100"
              >
                <div className="text-center text-slate-400">
                  <FiMessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Xabarni tanlang</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reply modal */}
      <AnimatePresence>
        {replyTarget && (
          <ReplyModal
            contact={replyTarget}
            onClose={() => setReplyTarget(null)}
            onReplied={fetchContacts}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
