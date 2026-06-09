import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../components/ui/toast";
import { adminCategoriesService, adminBloggersService } from "../../services/adminService";
import { CATEGORY_LABEL } from "../../config/categories";
import {
  LuLoader, LuSearch, LuPlus, LuPencil, LuTrash2,
  LuTriangleAlert, LuX, LuCheck, LuTag, LuUsers,
  LuRefreshCw, LuStar, LuChevronDown, LuGrip,
  LuLayers, LuWifi,
} from "react-icons/lu";

const POLL_INTERVAL = 30_000; // 30 soniya

/* ── Design Tokens ─────────────────────────────────────────────── */
const T = {
  red:       "#C62828",
  redMid:    "#E53935",
  redLight:  "#FFEBEE",
  redBorder: "#FFCDD2",
  bg:        "#F1F5F9",
  surface:   "#FFFFFF",
  surfaceUp: "#F8FAFC",
  border:    "#E2E8F0",
  text:      "#0F172A",
  textMuted: "#475569",
  textDim:   "#94A3B8",
  success:   "#16A34A",
  successBg: "#F0FDF4",
  successBd: "#BBF7D0",
  warn:      "#D97706",
  warnBg:    "#FFFBEB",
  warnBd:    "#FDE68A",
  purple:    "#7C3AED",
  purpleBg:  "#F5F3FF",
  purpleBd:  "#DDD6FE",
  info:      "#0284C7",
  infoBg:    "#F0F9FF",
  infoBd:    "#BAE6FD",
};

/* ── Category accent colors ────────────────────────────────────── */
const CAT_ACCENTS = [
  { color: "#E53935", bg: "#FFEBEE", border: "#FFCDD2" },
  { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  { color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD" },
  { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { color: "#DB2777", bg: "#FDF2F8", border: "#FBCFE8" },
  { color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
  { color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" },
  { color: "#9333EA", bg: "#FAF5FF", border: "#E9D5FF" },
  { color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC" },
];

const ICON_OPTIONS = [
  "💻","✏️","😊","🍴","⚽","✈️","💼","🎮","📚","🎵",
  "📸","🎨","🏥","🌿","🎭","🧑‍🍳","🔬","🏋️","🎤","🏠",
];

const inp = (extra = {}) => ({
  width: "100%", padding: "10px 13px", fontSize: 13.5,
  border: `1.5px solid ${T.border}`, borderRadius: 10, outline: "none",
  background: T.surfaceUp, color: T.text, boxSizing: "border-box",
  fontFamily: "inherit", ...extra,
});

/* ── StatCard ───────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg, border }) {
  return (
    <div style={{ background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`, padding: "20px 22px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.textDim, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 800, color: T.text, margin: 0, lineHeight: 1 }}>{value ?? 0}</p>
      </div>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  );
}

/* ── IconPicker ─────────────────────────────────────────────────── */
function IconPicker({ value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
      {ICON_OPTIONS.map(ic => (
        <button
          key={ic}
          type="button"
          onClick={() => onChange(ic)}
          style={{
            fontSize: 22, padding: "8px 0", borderRadius: 10,
            border: `2px solid ${value === ic ? T.red : T.border}`,
            background: value === ic ? T.redLight : T.surfaceUp,
            cursor: "pointer", transition: "all .12s",
            transform: value === ic ? "scale(1.1)" : "scale(1)",
          }}
        >
          {ic}
        </button>
      ))}
    </div>
  );
}

/* ── FormModal ──────────────────────────────────────────────────── */
function FormModal({ title, icon: HeaderIcon, initial, onClose, onSubmit, saving }) {
  const [form, setForm] = useState({
    name:        initial?.name        || "",
    icon:        initial?.icon        || "💻",
    description: initial?.description || "",
    color:       initial?.color       || "#6366f1",
    order:       initial?.order       ?? 0,
    isFeatured:  initial?.isFeatured  || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.25)", border: `1px solid ${T.border}` }}>
        {/* Header */}
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: T.surface, zIndex: 1, borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeaderIcon size={16} style={{ color: T.red }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{title}</span>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
            <LuX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "26px" }}>
          {/* Preview */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "16px 18px", background: T.surfaceUp, borderRadius: 14, border: `1px solid ${T.border}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              {form.icon}
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: "0 0 2px" }}>
                {form.name || <span style={{ color: T.textDim, fontWeight: 400 }}>Kategoriya nomi...</span>}
              </p>
              <p style={{ fontSize: 12, color: T.textDim, margin: 0 }}>{form.description || "Tavsif yo'q"}</p>
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Kategoriya nomi *</label>
            <input
              style={inp()}
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Masalan: Sog'liq"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Tavsif</label>
            <textarea
              style={{ ...inp(), resize: "vertical" }}
              rows={2}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Kategoriya haqida qisqacha..."
            />
          </div>

          {/* Order + Featured */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Tartib raqami</label>
              <input
                type="number"
                style={inp()}
                value={form.order}
                onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                min={0}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>Featured</label>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
                style={{
                  width: "100%", padding: "10px 13px", borderRadius: 10, cursor: "pointer",
                  border: form.isFeatured ? `1.5px solid ${T.warnBd}` : `1.5px solid ${T.border}`,
                  background: form.isFeatured ? T.warnBg : T.surfaceUp,
                  color: form.isFeatured ? T.warn : T.textMuted,
                  fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <LuStar size={14} /> {form.isFeatured ? "Featured ✓" : "Featured emas"}
              </button>
            </div>
          </div>

          {/* Icon picker */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 8 }}>Ikonka</label>
            <IconPicker value={form.icon} onChange={v => setForm(p => ({ ...p, icon: v }))} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>
              Bekor qilish
            </button>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {saving ? <LuLoader size={14} className="spin" /> : <LuCheck size={14} />}
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── DeleteConfirm ──────────────────────────────────────────────── */
function DeleteConfirm({ cat, onConfirm, onCancel, saving }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 22, padding: "36px 32px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,.2)", border: `1px solid ${T.border}` }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.redLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: `1.5px solid ${T.redBorder}`, fontSize: 26 }}>
          {cat?.icon || "🗑️"}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>O'chirishni tasdiqlang</h3>
        <p style={{ fontSize: 13.5, color: T.textMuted, margin: "0 0 10px", lineHeight: 1.6 }}>Bu kategoriyani o'chirsangiz, qaytarib bo'lmaydi.</p>
        {cat && (
          <p style={{ fontSize: 13, color: T.text, fontWeight: 700, background: T.surfaceUp, padding: "8px 16px", borderRadius: 10, border: `1px solid ${T.border}`, margin: "0 0 24px" }}>
            "{CATEGORY_LABEL[cat.name] ?? cat.name}"
            {cat.bloggerCount > 0 && (
              <span style={{ fontSize: 12, color: T.warn, marginLeft: 8, fontWeight: 600 }}>
                ⚠️ {cat.bloggerCount} ta blogger bor
              </span>
            )}
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>
            Bekor qilish
          </button>
          <button onClick={onConfirm} disabled={saving} style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.redMid},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [search,      setSearch]    = useState("");
  const [showCreate,  setShowCreate]= useState(false);
  const [editingCat,  setEditingCat]= useState(null);
  const [deletingCat, setDeletingCat]=useState(null);
  const [saving,      setSaving]    = useState(false);
  const [syncing,     setSyncing]   = useState(false);
  const [isLive,      setIsLive]    = useState(true);

  const { data: categoriesData, isLoading: loadingCats, dataUpdatedAt } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminCategoriesService.getAll(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? POLL_INTERVAL : false,
  });

  const { data: bloggersData, isLoading: loadingBloggers } = useQuery({
    queryKey: ["admin-bloggers-for-cats"],
    queryFn: () => adminBloggersService.getAll({ limit: 9999 }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: isLive ? POLL_INTERVAL : false,
  });

  const loading = loadingCats || loadingBloggers;

  // Blogerlar API dan har bir kategoriya uchun real sonni hisoblaymiz
  const { categories, totalBloggers } = useMemo(() => {
    const rawCats    = categoriesData?.data  || [];
    const bloggers   = bloggersData?.data    || [];

    // Har bir bloger faqat bir marta — asosiy (birinchi) kategoriyasida hisoblanadi
    const countMap = {};
    bloggers.forEach(b => {
      const primary = (b.categories || [])[0];
      if (primary) countMap[primary] = (countMap[primary] || 0) + 1;
    });

    const enriched = rawCats.map(cat => ({
      ...cat,
      bloggerCount: countMap[cat.name] || 0,
    }));

    return { categories: enriched, totalBloggers: bloggers.length };
  }, [categoriesData, bloggersData]);

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  const fetchCategories = () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] });

  /* ── Create ── */
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await adminCategoriesService.create({ ...form, name: form.name.trim() });
      toast.success("Yangi kategoriya qo'shildi");
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch (err) {
      const msg = err?.response?.data?.message || "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── Update ── */
  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await adminCategoriesService.update(editingCat._id, { ...form, name: form.name.trim() });
      toast.success("Kategoriya yangilandi");
      setEditingCat(null);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  /* ── Sync counts ── */
  const handleSync = async () => {
    setSyncing(true);
    try {
      await adminCategoriesService.syncCounts();
      toast.success("Blogger sonlari yangilandi");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch {
      toast.error("Sync xatoligi");
    } finally {
      setSyncing(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deletingCat?._id) {
      toast.error("Bu kategoriya DB da yo'q, o'chirib bo'lmaydi");
      setDeletingCat(null);
      return;
    }
    setSaving(true);
    try {
      await adminCategoriesService.remove(deletingCat._id);
      toast.success("Kategoriya o'chirildi");
      setDeletingCat(null);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch (err) {
      const msg = err?.response?.data?.message || "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── Derived ── */
  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const featuredCount = categories.filter(c => c.isFeatured).length;

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", padding: "28px 32px", background: T.bg, minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuTag size={18} style={{ color: T.red }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>Kategoriyalar</h1>
          </div>
          <p style={{ fontSize: 13, color: T.textDim, margin: 0 }}>Barcha kategoriyalar, bloggerlar soni va boshqaruv</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Live badge */}
          <button
            onClick={() => setIsLive(v => !v)}
            title={isLive ? "Real-time yoqiq (o'chirish uchun bosing)" : "Real-time o'chiq (yoqish uchun bosing)"}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 13px", borderRadius: 99,
              border: `1.5px solid ${isLive ? T.successBd : T.border}`,
              background: isLive ? T.successBg : T.surfaceUp,
              color: isLive ? T.success : T.textDim,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: isLive ? T.success : T.textDim, display: "inline-block", boxShadow: isLive ? `0 0 0 2px ${T.successBd}` : "none" }} className={isLive ? "pulse" : ""} />
            {isLive ? "Live" : "Paused"}
          </button>

          {lastUpdated && (
            <span style={{ fontSize: 11.5, color: T.textDim, fontWeight: 500 }}>
              {lastUpdated.toLocaleTimeString("uz-UZ")} da yangilandi
            </span>
          )}

          <button
            onClick={() => setShowCreate(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", borderRadius: 12, background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(198,40,40,.3)" }}
          >
            <LuPlus size={15} /> Yangi kategoriya
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            title="Blogger sonlarini DB dan qayta hisoblash + yo'q kategoriyalarni yaratish"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: `1.5px solid ${T.infoBd}`, borderRadius: 12, background: T.infoBg, color: T.info, fontSize: 13, fontWeight: 600, cursor: syncing ? "not-allowed" : "pointer", opacity: syncing ? 0.7 : 1 }}
          >
            {syncing ? <LuLoader size={14} className="spin" /> : <LuUsers size={14} />}
            Sync
          </button>
          <button
            onClick={() => fetchCategories()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <LuRefreshCw size={14} /> Yangilash
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Jami kategoriya"   value={categories.length} icon={LuLayers} color={T.textMuted} bg="#F8FAFC"       border={T.border}    />
        <StatCard label="Jami bloggerlar"   value={totalBloggers}     icon={LuUsers}  color={T.info}      bg={T.infoBg}      border={T.infoBd}    />
        <StatCard label="Featured"          value={featuredCount}     icon={LuStar}   color={T.warn}      bg={T.warnBg}      border={T.warnBd}    />
        <StatCard label="Qidiruv natijalari" value={filtered.length}  icon={LuTag}    color={T.red}       bg={T.redLight}    border={T.redBorder} />
      </div>

      {/* ── Search ── */}
      <div style={{ background: T.surface, borderRadius: 14, border: `1.5px solid ${T.border}`, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <LuSearch size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kategoriya qidirish..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: T.text, background: T.surfaceUp }}
          />
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: T.textDim, fontWeight: 600, background: T.surfaceUp, padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}` }}>
          {filtered.length} ta kategoriya
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>

        {/* Table Head */}
        <div style={{ display: "grid", gridTemplateColumns: "44px 2fr 1fr 80px 90px 100px 120px", padding: "11px 20px", background: T.surfaceUp, borderBottom: `1px solid ${T.border}` }}>
          {["#", "Kategoriya", "Tavsif", "Tartib", "Featured", "Bloggerlar", "Amallar"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 20px", gap: 14 }}>
            <LuLoader size={32} className="spin" style={{ color: T.red }} />
            <p style={{ color: T.textDim, fontSize: 13.5, margin: 0, fontWeight: 600 }}>Yuklanmoqda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🏷️</div>
            <p style={{ color: T.textMuted, fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>Kategoriya topilmadi</p>
            <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Yangi kategoriya qo'shing</p>
          </div>
        ) : (
          filtered.map((cat, idx) => {
            const accent = CAT_ACCENTS[idx % CAT_ACCENTS.length];
            const bloggerCount = cat.bloggerCount || 0;

            return (
              <div
                key={cat._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 2fr 1fr 80px 90px 100px 120px",
                  padding: "14px 20px",
                  borderBottom: idx < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                  alignItems: "center",
                  transition: "background .12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceUp}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* # */}
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.textDim, textAlign: "center" }}>{idx + 1}</span>

                {/* Category */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    background: accent.bg, border: `1.5px solid ${accent.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {cat.icon || "📌"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {CATEGORY_LABEL[cat.name] ?? cat.name}
                      </p>
                      {cat._noDoc && (
                        <span title="Bu kategoriya DB da yo'q, faqat bloggerlarda mavjud" style={{ fontSize: 10, fontWeight: 700, color: T.warn, background: T.warnBg, border: `1px solid ${T.warnBd}`, padding: "1px 6px", borderRadius: 6 }}>
                          DB yo'q
                        </span>
                      )}
                    </div>
                    {cat.slug && (
                      <p style={{ fontSize: 11, color: T.textDim, margin: 0, fontFamily: "monospace" }}>/{cat.slug}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div style={{ fontSize: 12, color: T.textDim, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", paddingRight: 8 }}>
                  {cat.description || <span style={{ color: T.border }}>—</span>}
                </div>

                {/* Order */}
                <span style={{ background: T.surfaceUp, color: T.textMuted, border: `1px solid ${T.border}`, padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, display: "inline-block", textAlign: "center" }}>
                  #{cat.order ?? 0}
                </span>

                {/* Featured */}
                {cat.isFeatured ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: T.warnBg, color: T.warn, border: `1px solid ${T.warnBd}`, padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
                    <LuStar size={10} /> Featured
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: T.textDim }}>—</span>
                )}

                {/* Blogger count */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 10,
                    background: bloggerCount > 0 ? T.infoBg : T.surfaceUp,
                    border: `1px solid ${bloggerCount > 0 ? T.infoBd : T.border}`,
                  }}>
                    <LuUsers size={12} style={{ color: bloggerCount > 0 ? T.info : T.textDim }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: bloggerCount > 0 ? T.info : T.textDim }}>
                      {bloggerCount}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 5 }}>
                  {cat._noDoc ? (
                    <span title="Sync bosib avval DB ga yarating" style={{ fontSize: 11, color: T.textDim, fontStyle: "italic", alignSelf: "center" }}>
                      Sync kerak
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingCat(cat)}
                        title="Tahrirlash"
                        style={{ width: 32, height: 32, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, transition: "all .12s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = T.purpleBg; e.currentTarget.style.borderColor = T.purpleBd; e.currentTarget.style.color = T.purple; }}
                        onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                      >
                        <LuPencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeletingCat(cat)}
                        title="O'chirish"
                        style={{ width: 32, height: 32, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, transition: "all .12s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = T.redBorder; e.currentTarget.style.color = T.red; }}
                        onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
                      >
                        <LuTrash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <FormModal
          title="Yangi kategoriya"
          icon={LuPlus}
          initial={null}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          saving={saving}
        />
      )}

      {editingCat && (
        <FormModal
          title="Kategoriyani tahrirlash"
          icon={LuPencil}
          initial={editingCat}
          onClose={() => setEditingCat(null)}
          onSubmit={handleUpdate}
          saving={saving}
        />
      )}

      {deletingCat && (
        <DeleteConfirm
          cat={deletingCat}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCat(null)}
          saving={saving}
        />
      )}

      <style>{`
        @keyframes spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow:0 0 0 2px #BBF7D0; } 50% { opacity:.6; box-shadow:0 0 0 4px #86EFAC; } }
        .spin  { animation: spin  0.8s linear infinite; }
        .pulse { animation: pulse 2s  ease   infinite; }
      `}</style>
    </div>
  );
}
