import { useState, useEffect, useCallback } from "react";
import { toast } from "../../components/ui/toast";
import { adminFaqsService } from "../../services/adminService";
import { LuLoader } from "react-icons/lu";

const CAT_OPTIONS = [
  { value: "general",   label: "Umumiy" },
  { value: "blogger",   label: "Blogger" },
  { value: "business",  label: "Reklam beruvchi" },
  { value: "payment",   label: "To'lov" },
  { value: "technical", label: "Texnik" },
];
const CAT_MAP = Object.fromEntries(CAT_OPTIONS.map(c => [c.value, c.label]));
const CAT_COLORS = {
  general:   { bg: "#f3f4f6", c: "#374151" },
  blogger:   { bg: "#fee2e2", c: "#991b1b" },
  business:  { bg: "#fef9c3", c: "#854d0e" },
  payment:   { bg: "#dcfce7", c: "#166534" },
  technical: { bg: "#dbeafe", c: "#1e40af" },
};

const BLANK = { question: "", answer: "", category: "general", order: 0 };

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [editingFaq, setEditingFaq] = useState(null);
  const [newFaq, setNewFaq] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFaqsService.getAll();
      setFaqs(res.data || []);
    } catch {
      toast.error("FAQ larni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = activeTab === "all" ? faqs : faqs.filter(f => f.category === activeTab);
  const counts = { all: faqs.length, ...Object.fromEntries(CAT_OPTIONS.map(c => [c.value, faqs.filter(f => f.category === c.value).length])) };

  const addFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error("Savol va javob bo'sh bo'lmasin!");
      return;
    }
    setSaving(true);
    try {
      await adminFaqsService.create(newFaq);
      toast.success("Yangi FAQ qo'shildi");
      setNewFaq(BLANK);
      fetch();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editingFaq?.question?.trim() || !editingFaq?.answer?.trim()) {
      toast.error("Savol va javob bo'sh bo'lmasin!");
      return;
    }
    setSaving(true);
    try {
      await adminFaqsService.update(editingFaq._id, {
        question: editingFaq.question,
        answer: editingFaq.answer,
        category: editingFaq.category,
        isActive: editingFaq.isActive,
      });
      toast.success("FAQ yangilandi");
      setEditingFaq(null);
      fetch();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (id) => {
    if (!window.confirm("Bu FAQ ni o'chirmoqchimisiz?")) return;
    try {
      await adminFaqsService.remove(id);
      toast.success("FAQ o'chirildi");
      fetch();
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const S = {
    container: { padding: "1.5rem", maxWidth: 860, margin: "0 auto", fontFamily: "system-ui,-apple-system,sans-serif" },
    topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "2px solid #E24B4A" },
    tabs: { display: "flex", gap: 8, marginBottom: "1.25rem", flexWrap: "wrap" },
    tab: (a) => ({ padding: "6px 16px", borderRadius: 999, border: "1.5px solid #E24B4A", background: a ? "#E24B4A" : "#fff", color: a ? "#fff" : "#A32D2D", fontSize: 13, fontWeight: 500, cursor: "pointer" }),
    card: (ed) => ({ border: `1.5px solid ${ed ? "#E24B4A" : "#F7C1C1"}`, borderRadius: 12, overflow: "hidden", background: "#fff", marginBottom: 10 }),
    cardHead: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#FCEBEB" },
    body: { padding: "12px 16px", fontSize: 13, color: "#444", lineHeight: 1.6, borderTop: "1px solid #F7C1C1" },
    input: { width: "100%", border: "1.5px solid #F7C1C1", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", border: "1.5px solid #F7C1C1", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", outline: "none", minHeight: 70, resize: "vertical", boxSizing: "border-box" },
    select: { width: "100%", border: "1.5px solid #F7C1C1", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontFamily: "inherit", outline: "none" },
    btnSave: { background: "#E24B4A", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer" },
    btnCancel: { background: "#fff", color: "#A32D2D", border: "1.5px solid #E24B4A", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" },
    btnAdd: { background: "#E24B4A", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer" },
    addSection: { border: "2px dashed #F7C1C1", borderRadius: 12, padding: 16, marginBottom: "1.5rem" },
    label: { fontSize: 12, color: "#A32D2D", fontWeight: 500, display: "block", marginBottom: 3 },
  };

  return (
    <div style={S.container}>
      <div style={S.topbar}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#A32D2D" }}>FAQ boshqaruvi</h1>
        <span style={{ background: "#E24B4A", color: "#fff", borderRadius: 999, fontSize: 12, padding: "2px 10px", fontWeight: 500 }}>
          {faqs.length} ta savol
        </span>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        <button style={S.tab(activeTab === "all")} onClick={() => setActiveTab("all")}>
          Barchasi <span style={{ opacity: 0.7, fontSize: 11 }}>({counts.all})</span>
        </button>
        {CAT_OPTIONS.map(c => (
          <button key={c.value} style={S.tab(activeTab === c.value)} onClick={() => setActiveTab(c.value)}>
            {c.label} <span style={{ opacity: 0.7, fontSize: 11 }}>({counts[c.value] || 0})</span>
          </button>
        ))}
      </div>

      {/* Add new FAQ */}
      <div style={S.addSection}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#A32D2D", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ background: "#E24B4A", color: "#fff", borderRadius: 999, width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</span>
          Yangi savol qo'shish
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={S.label}>Kategoriya</label>
            <select value={newFaq.category} onChange={e => setNewFaq(p => ({ ...p, category: e.target.value }))} style={S.select}>
              {CAT_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>Savol</label>
            <input value={newFaq.question} onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))} placeholder="Savol matnini kiriting..." style={S.input} />
          </div>
          <div>
            <label style={S.label}>Javob</label>
            <textarea value={newFaq.answer} onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))} placeholder="Javob matnini kiriting..." style={S.textarea} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{ ...S.btnAdd, opacity: saving ? 0.6 : 1 }} onClick={addFaq} disabled={saving}>
              {saving ? "Saqlanmoqda…" : "+ Qo'shish"}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
          <LuLoader style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "block", margin: "0 auto 8px" }} />
          Yuklanmoqda…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#999", fontSize: 13 }}>Bu kategoriyada savol yo'q</div>
      ) : filtered.map(f => {
        const isEd = editingFaq?._id === f._id;
        const cc = CAT_COLORS[f.category] || CAT_COLORS.general;
        return (
          <div key={f._id} style={S.card(isEd)}>
            <div style={S.cardHead}>
              <span style={{ ...cc, fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "2px 10px" }}>
                {CAT_MAP[f.category] || f.category}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#501313" }}>{f.question}</span>
              {!f.isActive && <span style={{ fontSize: 10, color: "#9ca3af", fontStyle: "italic" }}>Nofaol</span>}
              <button style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontSize: 15 }} onClick={() => setEditingFaq(isEd ? null : { ...f })} title="Tahrirlash">✏️</button>
              <button style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontSize: 15 }} onClick={() => deleteFaq(f._id)} title="O'chirish">🗑️</button>
            </div>
            {!isEd && <div style={S.body}>{f.answer}</div>}
            {isEd && (
              <div style={{ padding: "14px 16px", borderTop: "1px solid #F7C1C1", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={S.label}>Kategoriya</label>
                  <select value={editingFaq.category} onChange={e => setEditingFaq(p => ({ ...p, category: e.target.value }))} style={S.select}>
                    {CAT_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Savol</label>
                  <input value={editingFaq.question} onChange={e => setEditingFaq(p => ({ ...p, question: e.target.value }))} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Javob</label>
                  <textarea value={editingFaq.answer} onChange={e => setEditingFaq(p => ({ ...p, answer: e.target.value }))} style={S.textarea} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
                  <input type="checkbox" checked={editingFaq.isActive} onChange={e => setEditingFaq(p => ({ ...p, isActive: e.target.checked }))} />
                  Faol holat
                </label>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button style={S.btnCancel} onClick={() => setEditingFaq(null)}>Bekor</button>
                  <button style={{ ...S.btnSave, opacity: saving ? 0.6 : 1 }} onClick={saveEdit} disabled={saving}>{saving ? "…" : "Saqlash"}</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
