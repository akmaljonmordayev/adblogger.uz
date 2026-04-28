import React, { useState, useCallback, useMemo, useRef } from "react";


const styles = {
  container: {
    padding: "1.5rem",
    maxWidth: "860px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #E24B4A",
  },
  topbarH1: {
    fontSize: "20px",
    fontWeight: 500,
    color: "#A32D2D",
  },
  badgeCount: {
    background: "#E24B4A",
    color: "#fff",
    borderRadius: "999px",
    fontSize: "12px",
    padding: "2px 10px",
    fontWeight: 500,
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "1.25rem",
    flexWrap: "wrap",
  },
  tab: (isActive) => ({
    padding: "6px 16px",
    borderRadius: "999px",
    border: "1.5px solid #E24B4A",
    background: isActive ? "#E24B4A" : "#fff",
    color: isActive ? "#fff" : "#A32D2D",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  faqCard: (isEditing) => ({
    border: `1.5px solid ${isEditing ? "#E24B4A" : "#F7C1C1"}`,
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
  }),
  faqHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "#FCEBEB",
  },
  catPill: (catClass) => ({
    fontSize: "11px",
    fontWeight: 500,
    borderRadius: "999px",
    padding: "2px 10px",
    ...(catClass === "cat-bloger" && { background: "#E24B4A", color: "#fff" }),
    ...(catClass === "cat-reklam" && {
      background: "#FADB00",
      color: "#7a6200",
    }),
    ...(catClass === "cat-tolov" && {
      background: "#F7C1C1",
      color: "#791F1F",
    }),
  }),
  faqQ: {
    flex: 1,
    fontSize: "14px",
    fontWeight: 500,
    color: "#501313",
  },
  btnIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    transition: "background 0.1s",
    flexShrink: 0,
  },
  faqBody: {
    padding: "12px 16px",
    fontSize: "13px",
    color: "#444",
    lineHeight: 1.6,
    borderTop: "1px solid #F7C1C1",
  },
  editForm: {
    padding: "14px 16px",
    borderTop: "1px solid #F7C1C1",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  editFormLabel: {
    fontSize: "12px",
    color: "#A32D2D",
    fontWeight: 500,
    marginBottom: "2px",
    display: "block",
  },
  editFormInput: {
    width: "100%",
    border: "1.5px solid #F7C1C1",
    borderRadius: "8px",
    padding: "7px 10px",
    fontSize: "13px",
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
  },
  editFormTextarea: {
    width: "100%",
    border: "1.5px solid #F7C1C1",
    borderRadius: "8px",
    padding: "7px 10px",
    fontSize: "13px",
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
    minHeight: "70px",
    resize: "vertical",
  },
  editActions: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  btnSave: {
    background: "#E24B4A",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "7px 18px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  btnCancel: {
    background: "#fff",
    color: "#A32D2D",
    border: "1.5px solid #E24B4A",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "13px",
    cursor: "pointer",
  },
  addSection: {
    marginTop: "1.5rem",
    border: "2px dashed #F7C1C1",
    borderRadius: "12px",
    padding: "16px",
  },
  addTitle: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#A32D2D",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  addIcon: {
    background: "#E24B4A",
    color: "#fff",
    borderRadius: "999px",
    width: "20px",
    height: "20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    lineHeight: 1,
  },
  btnAdd: {
    background: "#E24B4A",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 20px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "4px",
  },
  empty: {
    textAlign: "center",
    padding: "2rem",
    color: "#999",
    fontSize: "13px",
  },
  toast: (show) => ({
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#E24B4A",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: 500,
    opacity: show ? 1 : 0,
    transition: "opacity 0.3s",
    pointerEvents: "none",
    zIndex: 999,
  }),
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  labelSmall: {
    fontSize: "12px",
    color: "#A32D2D",
    fontWeight: 500,
    display: "block",
    marginBottom: "3px",
  },
  select: {
    width: "100%",
    border: "1.5px solid #F7C1C1",
    borderRadius: "8px",
    padding: "7px 10px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
  },
  input: {
    width: "100%",
    border: "1.5px solid #F7C1C1",
    borderRadius: "8px",
    padding: "7px 10px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
  },
  textarea: {
    width: "100%",
    border: "1.5px solid #F7C1C1",
    borderRadius: "8px",
    padding: "7px 10px",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    minHeight: "70px",
    resize: "vertical",
  },
  flexEnd: {
    display: "flex",
    justifyContent: "flex-end",
  },
};

const CATS = {
  bloger: { label: "Bloger", cls: "cat-bloger" },
  reklam: { label: "Reklam beruvchi", cls: "cat-reklam" },
  tolov: { label: "To'lov", cls: "cat-tolov" },
  all: { label: "Barchasi", cls: "" },
};

const INITIAL_FAQS = [
  {
    id: 1,
    cat: "bloger",
    q: "Platformaga bloger sifatida qanday qo'shilaman?",
    a: "Ro'yxatdan o'tish juda oddiy — telefon raqamingiz yoki email orqali akkaunt oching, so'ng bloger profilingizni to'ldiring: ijtimoiy tarmoq havolalari, auditoriya hajmi va nisha yo'nalishingizni kiriting. Moderatsiya 24 soat ichida amalga oshiriladi.",
  },
  {
    id: 2,
    cat: "bloger",
    q: "Qanday ijtimoiy tarmoqlar qo'llab-quvvatlanadi?",
    a: "Instagram, YouTube, Telegram, TikTok, Facebook va Twitter/X platformalari qo'llab-quvvatlanadi. Bir nechta platformani bir vaqtda ulashingiz mumkin.",
  },
  {
    id: 3,
    cat: "bloger",
    q: "Minimal obunachilar soni qancha bo'lishi kerak?",
    a: "Hozircha minimal talab yo'q — mikroblogerlar (1 000+ obunachi) ham platforma orqali brendlar bilan ishlashi mumkin. Muhimi — auditoriyangizdagi faollik darajasi.",
  },
  {
    id: 4,
    cat: "bloger",
    q: "Platformadan foydalanish bepulmi?",
    a: "Ha, blogerlar uchun ro'yxatdan o'tish va profil yaratish to'liq bepul. Birinchi oy komissiyasiz ishlaysiz. Undan keyin bitimdan foiz olinadi.",
  },
  {
    id: 5,
    cat: "reklam",
    q: "Menga mos blogerlarni qanday topaman?",
    a: "Kategoriya, auditoriya hajmi, joylashuv, nisha va engagement rate bo'yicha filtr qo'llang. AI tavsiya tizimi ham sizning maqsadlaringizga mos blogerlarni avtomatik taklif qiladi.",
  },
  {
    id: 6,
    cat: "reklam",
    q: "Kampaniya natijalarini qanday kuzataman?",
    a: "Shaxsiy dashboard orqali real vaqtda qamrov, bosishlar, konversiya va ROI ko'rsatkichlarini kuzatishingiz mumkin. Har bir bloger bo'yicha alohida hisobot yuklab olish imkoniyati mavjud.",
  },
  {
    id: 7,
    cat: "reklam",
    q: "Blogerning auditoriyasi haqiqiymi?",
    a: "Barcha blogerlar qo'lda tekshiriladi. Fake followerlarni aniqlash uchun maxsus tizim ishlatiladi. Tekshiruv natijasi profilida ko'rsatiladi.",
  },
  {
    id: 8,
    cat: "reklam",
    q: "Minimal byudjet qancha?",
    a: "Minimal reklama byudjeti 500 000 so'm. Byudjetni o'zingiz belgilaysiz va istalgan vaqt to'xtatishingiz mumkin.",
  },
  {
    id: 9,
    cat: "tolov",
    q: "To'lovlar qanday amalga oshiriladi?",
    a: "Blogerlar o'z daromadlarini Payme, Click, bank kartasi yoki bank o'tkazmasi orqali yechib olishlari mumkin. To'lov so'rovi kiritgandan so'ng 1–3 ish kuni ichida amalga oshiriladi.",
  },
  {
    id: 10,
    cat: "tolov",
    q: "Komissiya foizi qancha?",
    a: "Platforma har bir muvaffaqiyatli bitimdan 10% komissiya oladi. Birinchi oy uchun komissiya 0% — to'liq bepul.",
  },
  {
    id: 11,
    cat: "tolov",
    q: "Pul qaytarish mumkinmi?",
    a: "Agar bloger shartnoma shartlarini bajarmasa, reklam beruvchiga to'liq pul qaytariladi. Har bir bitim platforma tomonidan kafolatlanadi.",
  },
];

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [nextId, setNextId] = useState(12);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // New FAQ form state
  const [newCat, setNewCat] = useState("bloger");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const showToastMessage = useCallback((msg) => {
    toast.success(msg);
  }, []);

  const renderTabs = useCallback(() => {
    // This is handled by the JSX rendering based on activeTab and counts
  }, []);

  const setTab = useCallback((cat) => {
    setActiveTab(cat);
    setEditingId(null);
  }, []);

  const getFilteredFaqs = useMemo(() => {
    if (activeTab === "all") return faqs;
    return faqs.filter((f) => f.cat === activeTab);
  }, [faqs, activeTab]);

  const getCounts = useMemo(() => {
    const counts = { all: faqs.length, bloger: 0, reklam: 0, tolov: 0 };
    faqs.forEach((f) => counts[f.cat]++);
    return counts;
  }, [faqs]);

  const toggleEdit = useCallback((id) => {
    setEditingId((prev) => (prev === id ? null : id));
  }, []);

  const saveEdit = useCallback(
    (id) => {
      const catSelect = document.getElementById(`edit-cat-${id}`);
      const qInput = document.getElementById(`edit-q-${id}`);
      const aTextarea = document.getElementById(`edit-a-${id}`);

      if (!catSelect || !qInput || !aTextarea) return;

      const cat = catSelect.value;
      const q = qInput.value.trim();
      const a = aTextarea.value.trim();

      if (!q || !a) {
        showToastMessage("Savol va javob bo'sh bo'lmasin!");
        return;
      }

      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, cat, q, a } : f)),
      );
      setEditingId(null);
      showToastMessage("O'zgarishlar saqlandi ✓");
    },
    [showToastMessage],
  );

  const deleteFaq = useCallback(
    (id) => {
      if (window.confirm("Bu savolni o'chirmoqchimisiz?")) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        if (editingId === id) setEditingId(null);
        showToastMessage("Savol o'chirildi");
      }
    },
    [editingId, showToastMessage],
  );

  const addFaq = useCallback(() => {
    if (!newQ.trim() || !newA.trim()) {
      showToastMessage("Savol va javob bo'sh bo'lmasin!");
      return;
    }
    const newFaq = {
      id: nextId,
      cat: newCat,
      q: newQ.trim(),
      a: newA.trim(),
    };
    setFaqs((prev) => [...prev, newFaq]);
    setNextId((prev) => prev + 1);
    setNewQ("");
    setNewA("");
    setActiveTab("all");
    showToastMessage("Yangi savol qo'shildi ✓");
  }, [newQ, newA, newCat, nextId, showToastMessage]);

  const escHtml = useCallback((s) => {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }, []);

  const escAttr = useCallback((s) => {
    return String(s).replace(/"/g, "&quot;");
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.topbar}>
        <h1 style={styles.topbarH1}>FAQ boshqaruvi</h1>
        <span style={styles.badgeCount}>{faqs.length} ta savol</span>
      </div>
      <div style={styles.tabs}>
        {["all", "bloger", "reklam", "tolov"].map((cat) => (
          <button
            key={cat}
            style={styles.tab(activeTab === cat)}
            onClick={() => setTab(cat)}
          >
            {CATS[cat].label}{" "}
            <span style={{ opacity: 0.7, fontSize: "11px" }}>
              ({getCounts[cat]})
            </span>
          </button>
        ))}
      </div>
      <div style={{ ...styles.addSection, marginBottom: "1.5rem" }}>
        <div style={styles.addTitle}>
          <span style={styles.addIcon}>+</span> Yangi savol qo'shish
        </div>
        <div style={styles.flexColumn}>
          <div>
            <label style={styles.labelSmall}>Kategoriya</label>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              style={styles.select}
            >
              <option value="bloger">Bloger</option>
              <option value="reklam">Reklam beruvchi</option>
              <option value="tolov">To'lov</option>
            </select>
          </div>
          <div>
            <label style={styles.labelSmall}>Savol</label>
            <input
              type="text"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              placeholder="Savol matnini kiriting..."
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.labelSmall}>Javob</label>
            <textarea
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              placeholder="Javob matnini kiriting..."
              style={styles.textarea}
            />
          </div>
          <div style={{ ...styles.flexEnd}}>
            <button style={{ ...styles.btnAdd }} onClick={addFaq}>
              + Qo'shish
            </button>
          </div>
        </div>
      </div>


      <div style={styles.faqList}>
        {getFilteredFaqs.length === 0 ? (
          <div style={styles.empty}>Bu kategoriyada savol yo'q</div>
        ) : (
          getFilteredFaqs.map((f) => {
            const isEditing = editingId === f.id;
            return (
              <div key={f.id} style={styles.faqCard(isEditing)}>
                <div style={styles.faqHeader}>
                  <span style={styles.catPill(CATS[f.cat].cls)}>
                    {CATS[f.cat].label}
                  </span>
                  <span
                    style={styles.faqQ}
                    dangerouslySetInnerHTML={{ __html: escHtml(f.q) }}
                  />
                  <button
                    style={styles.btnIcon}
                    onClick={() => toggleEdit(f.id)}
                    title="Tahrirlash"
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.btnIcon}
                    onClick={() => deleteFaq(f.id)}
                    title="O'chirish"
                  >
                    🗑️
                  </button>
                </div>
                {!isEditing && (
                  <div
                    style={styles.faqBody}
                    dangerouslySetInnerHTML={{ __html: escHtml(f.a) }}
                  />
                )}
                {isEditing && (
                  <div style={styles.editForm}>
                    <div>
                      <label style={styles.editFormLabel}>Kategoriya</label>
                      <select
                        id={`edit-cat-${f.id}`}
                        defaultValue={f.cat}
                        style={styles.select}
                      >
                        <option value="bloger">Bloger</option>
                        <option value="reklam">Reklam beruvchi</option>
                        <option value="tolov">To'lov</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.editFormLabel}>Savol</label>
                      <input
                        id={`edit-q-${f.id}`}
                        defaultValue={f.q}
                        style={styles.input}
                      />
                    </div>
                    <div>
                      <label style={styles.editFormLabel}>Javob</label>
                      <textarea
                        id={`edit-a-${f.id}`}
                        defaultValue={f.a}
                        style={styles.textarea}
                      />
                    </div>
                    <div style={styles.editActions}>
                      <button
                        style={styles.btnCancel}
                        onClick={() => toggleEdit(null)}
                      >
                        Bekor
                      </button>
                      <button
                        style={styles.btnSave}
                        onClick={() => saveEdit(f.id)}
                      >
                        Saqlash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminFAQ;
