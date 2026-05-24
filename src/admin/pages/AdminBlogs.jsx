import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LuSearch, LuEye, LuPencil, LuTrash2, LuCheck, LuX,
  LuLoader, LuChevronLeft, LuChevronRight, LuRefreshCw,
  LuBookOpen, LuClock, LuCalendar, LuTriangleAlert,
  LuCircleCheck, LuCircleX, LuClock3, LuPlus, LuRotateCcw,
  LuArrowUpRight, LuFilter, LuChevronDown, LuHeart, LuEye as LuView,
  LuImage, LuTag, LuArrowUpDown,
} from "react-icons/lu";
import { toast } from "../../components/ui/toast";
import api from "../../services/api";

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
  info:      "#0284C7",
  infoBg:    "#F0F9FF",
  infoBd:    "#BAE6FD",
  purple:    "#7C3AED",
  purpleBg:  "#F5F3FF",
  purpleBd:  "#DDD6FE",
};

/* ── Constants ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: "",           label: "Barcha kategoriya" },
  { value: "Tech",       label: "Tech" },
  { value: "Lifestyle",  label: "Lifestyle" },
  { value: "Beauty",     label: "Beauty" },
  { value: "Food",       label: "Food" },
  { value: "Sports",     label: "Sports" },
  { value: "Travel",     label: "Travel" },
  { value: "Education",  label: "Education" },
  { value: "Business",   label: "Business" },
  { value: "Gaming",     label: "Gaming" },
  { value: "Music",      label: "Music" },
  { value: "Other",      label: "Other" },
];

const STATUS_TABS = [
  { value: "",         label: "Barchasi",     icon: LuBookOpen,    color: T.textMuted },
  { value: "pending",  label: "Kutilmoqda",   icon: LuClock3,      color: T.warn },
  { value: "approved", label: "Tasdiqlangan", icon: LuCircleCheck, color: T.success },
  { value: "rejected", label: "Rad etilgan",  icon: LuCircleX,     color: T.red },
];

const STATUS_META = {
  pending:  { bg: T.warnBg,    c: "#92400E", bd: T.warnBd,    label: "Kutilmoqda",   dot: "#F59E0B" },
  approved: { bg: T.successBg, c: "#14532D", bd: T.successBd, label: "Tasdiqlangan", dot: "#22C55E" },
  rejected: { bg: T.redLight,  c: "#7F1D1D", bd: T.redBorder, label: "Rad etilgan",  dot: "#EF4444" },
};

const CAT_COLOR = {
  Tech: "#2563EB", Lifestyle: "#A21CAF", Beauty: "#E11D48", Food: "#D97706",
  Sports: "#16A34A", Travel: "#0D9488", Education: "#0891B2", Business: T.purple,
  Gaming: "#EA580C", Music: "#9333EA", Other: T.textDim,
};

const PER_PAGE = 10;

/* ── Helpers ───────────────────────────────────────────────────── */
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
};
const getInitials = (u) => {
  if (!u) return "AD";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "AD";
};
const avaColor = (u) => {
  const colors = ["#6366F1","#F43F5E","#F97316","#10B981","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
  const code = ((u?.email || u?.firstName || "?").charCodeAt(0)) % colors.length;
  return colors[code];
};

/* ── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ user, size = 32 }) {
  const color = avaColor(user);
  if (user?.avatar) return (
    <img src={user.avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: color + "22", border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 800, color,
    }}>{getInitials(user)}</div>
  );
}

/* ── StatusBadge ────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const x = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      background: x.bg, color: x.c, border: `1px solid ${x.bd}`,
      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99,
      display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: x.dot, flexShrink: 0 }} />
      {x.label}
    </span>
  );
}

/* ── CatBadge ───────────────────────────────────────────────────── */
function CatBadge({ category }) {
  const c = CAT_COLOR[category] || T.textDim;
  return (
    <span style={{
      background: c + "15", color: c, border: `1px solid ${c}30`,
      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99,
      display: "inline-block", whiteSpace: "nowrap",
    }}>
      {category || "—"}
    </span>
  );
}

/* ── StatCard ───────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg, border }) {
  return (
    <div style={{
      background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`,
      padding: "20px 22px", display: "flex", alignItems: "flex-start",
      justifyContent: "space-between", gap: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}>
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

/* ── Input style helper ─────────────────────────────────────────── */
const inp = (extra = {}) => ({
  width: "100%", padding: "10px 13px", fontSize: 13.5,
  border: `1.5px solid ${T.border}`, borderRadius: 10, outline: "none",
  background: T.surfaceUp, color: T.text, boxSizing: "border-box",
  fontFamily: "inherit", ...extra,
});

/* ── ViewModal ──────────────────────────────────────────────────── */
function ViewModal({ blog, onClose, onApprove, onReject, actionLoading }) {
  if (!blog) return null;
  const authorName = blog.author ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim() : "—";
  const isActing = actionLoading[blog._id];

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 760, maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.25)", border: `1px solid ${T.border}` }}>

        {/* Header */}
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: T.surface, zIndex: 2, borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CatBadge category={blog.category} />
            <StatusBadge status={blog.status || "pending"} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {blog.status !== "approved" && (
              <button
                onClick={() => onApprove(blog._id)}
                disabled={isActing}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: `linear-gradient(135deg,${T.success},#15803D)`, color: "#fff", border: "none", borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                {isActing ? <LuLoader size={13} className="spin" /> : <LuCheck size={13} />} Tasdiqlash
              </button>
            )}
            {blog.status !== "rejected" && (
              <button
                onClick={() => onReject(blog._id)}
                disabled={isActing}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: T.redLight, color: T.red, border: `1.5px solid ${T.redBorder}`, borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                <LuX size={13} /> Rad etish
              </button>
            )}
            <button onClick={onClose} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
              <LuX size={15} />
            </button>
          </div>
        </div>

        {/* Cover image */}
        {blog.coverImage && (
          <img src={blog.coverImage} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover" }} />
        )}

        {/* Body */}
        <div style={{ padding: "26px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: "0 0 16px", lineHeight: 1.35 }}>
            {blog.title}
          </h2>

          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "14px 16px", background: T.surfaceUp, borderRadius: 14, border: `1px solid ${T.border}`, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 6 }}>
              <Avatar user={blog.author} size={34} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>{authorName}</p>
                {blog.author?.role && (
                  <p style={{ fontSize: 11, color: T.textDim, margin: 0, textTransform: "capitalize" }}>{blog.author.role}</p>
                )}
              </div>
            </div>
            <div style={{ width: 1, height: 28, background: T.border, flexShrink: 0 }} />
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.textDim }}>
              <LuCalendar size={12} /> {fmtDate(blog.createdAt)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.textDim }}>
              <LuClock size={12} /> {blog.readTime || 1} min
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.textDim }}>
              <LuView size={12} /> {blog.views || 0}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.textDim }}>
              <LuHeart size={12} /> {blog.likesCount || 0}
            </span>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <p style={{ fontSize: 14, color: T.textMuted, fontStyle: "italic", borderLeft: `3px solid ${T.redBorder}`, paddingLeft: 14, marginBottom: 20, lineHeight: 1.7, margin: "0 0 20px" }}>
              {blog.excerpt}
            </p>
          )}

          {/* Content */}
          <div style={{ fontSize: 14, lineHeight: 1.85, color: T.textMuted, whiteSpace: "pre-wrap", padding: "16px", background: T.surfaceUp, borderRadius: 12, border: `1px solid ${T.border}` }}>
            {blog.content?.replace(/<[^>]*>/g, "") || "Kontent yo'q"}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
              {blog.tags.map(t => (
                <span key={t} style={{ background: T.surfaceUp, color: T.textMuted, border: `1px solid ${T.border}`, padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── EditModal ──────────────────────────────────────────────────── */
function EditModal({ blog, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       blog?.title       || "",
    category:    blog?.category    || "",
    excerpt:     blog?.excerpt     || "",
    content:     blog?.content     || "",
    tags:        (blog?.tags || []).join(", "),
    isPublished: blog?.isPublished || false,
    status:      blog?.status      || "pending",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(blog._id, {
        title:       form.title,
        category:    form.category,
        excerpt:     form.excerpt,
        content:     form.content,
        tags:        form.tags,
        isPublished: form.isPublished,
        status:      form.status,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 660, maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.25)", border: `1px solid ${T.border}` }}>
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: T.surface, zIndex: 1, borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.infoBg, border: `1.5px solid ${T.infoBd}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuPencil size={15} style={{ color: T.info }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Blogni tahrirlash</span>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
            <LuX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "26px" }}>
          <FormField label="Sarlavha *">
            <input style={inp()} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <FormField label="Kategoriya">
              <select style={inp()} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.slice(1).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={inp()} value={form.status} onChange={e => setForm(p => ({
                ...p, status: e.target.value, isPublished: e.target.value === "approved",
              }))}>
                <option value="pending">Kutilmoqda</option>
                <option value="approved">Tasdiqlangan</option>
                <option value="rejected">Rad etilgan</option>
              </select>
            </FormField>
          </div>

          <FormField label="Qisqacha tavsif">
            <textarea style={{ ...inp(), resize: "vertical" }} rows={2} value={form.excerpt}
              onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} />
          </FormField>

          <FormField label="Kontent *">
            <textarea style={{ ...inp(), resize: "vertical" }} rows={9} value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
          </FormField>

          <FormField label="Teglar (vergul bilan)">
            <input style={inp()} value={form.tags}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              placeholder="marketing, reklama" />
          </FormField>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 22px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
              Bekor
            </button>
            <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? <LuLoader size={14} className="spin" /> : <LuCheck size={14} />} Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── CreateModal ────────────────────────────────────────────────── */
function CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: "", category: "Tech", excerpt: "", content: "", tags: "", status: "approved" });
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",       form.title.trim());
      fd.append("category",    form.category);
      fd.append("excerpt",     form.excerpt.trim());
      fd.append("content",     form.content.trim());
      fd.append("tags",        form.tags);
      fd.append("status",      form.status);
      fd.append("isPublished", form.status === "approved" ? "true" : "false");
      if (coverFile) fd.append("coverImage", coverFile);
      const res = await api.post("/blogs/admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onCreated(res.data.data);
      onClose();
    } catch {
      /* toast shown by interceptor */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: T.surface, borderRadius: 24, width: "100%", maxWidth: 660, maxHeight: "92vh", overflow: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.25)", border: `1px solid ${T.border}` }}>
        <div style={{ padding: "20px 26px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: T.surface, zIndex: 1, borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuPlus size={16} style={{ color: T.red }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Yangi blog yaratish</span>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
            <LuX size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "26px" }}>
          <FormField label="Sarlavha *">
            <input style={inp()} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Blog sarlavhasi..." />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <FormField label="Kategoriya *">
              <select style={inp()} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.slice(1).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={inp()} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="approved">Tasdiqlangan (nashr)</option>
                <option value="pending">Kutilmoqda</option>
              </select>
            </FormField>
          </div>

          <FormField label="Qisqacha tavsif">
            <textarea style={{ ...inp(), resize: "vertical" }} rows={2} value={form.excerpt}
              onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
              placeholder="Blog haqida qisqacha..." />
          </FormField>

          <FormField label="Kontent *">
            <textarea style={{ ...inp(), resize: "vertical" }} rows={10} value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required
              placeholder="Blog mazmunini bu yerga yozing..." />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 4 }}>
            <FormField label="Teglar (vergul bilan)">
              <input style={inp()} value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="marketing, reklama" />
            </FormField>
            <FormField label="Muqova rasm">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{ ...inp(), display: "flex", alignItems: "center", gap: 8, cursor: "pointer", border: coverFile ? `1.5px solid ${T.successBd}` : `1.5px solid ${T.border}`, background: coverFile ? T.successBg : T.surfaceUp, color: coverFile ? T.success : T.textMuted, fontWeight: 600 }}
              >
                <LuImage size={14} />
                {coverFile ? coverFile.name.slice(0, 18) + "..." : "Rasm tanlash"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => setCoverFile(e.target.files?.[0] || null)} />
            </FormField>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 22px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
              Bekor
            </button>
            <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? <LuLoader size={14} className="spin" /> : <LuPlus size={14} />} Yaratish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── DeleteConfirm ──────────────────────────────────────────────── */
function DeleteConfirm({ title, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 22, padding: "36px 32px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,.2)", border: `1px solid ${T.border}` }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.redLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: `1.5px solid ${T.redBorder}` }}>
          <LuTriangleAlert size={26} style={{ color: T.red }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: "0 0 8px" }}>O'chirishni tasdiqlang</h3>
        <p style={{ fontSize: 13.5, color: T.textMuted, margin: "0 0 10px", lineHeight: 1.6 }}>
          Bu blogni o'chirsangiz, qaytarib bo'lmaydi.
        </p>
        {title && (
          <p style={{ fontSize: 13, color: T.text, fontWeight: 700, background: T.surfaceUp, padding: "8px 16px", borderRadius: 10, border: `1px solid ${T.border}`, margin: "0 0 24px" }}>
            "{title}"
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: T.textMuted }}>
            Bekor qilish
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px", background: `linear-gradient(135deg,${T.redMid},#B91C1C)`, color: "#fff", border: "none", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── FormField wrapper ──────────────────────────────────────────── */
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMuted, display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminBlogs() {
  const [blogs,      setBlogs]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts,     setCounts]     = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });

  const [statusTab,   setStatusTab]   = useState("");
  const [category,    setCategory]    = useState("");
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort,        setSort]        = useState("-createdAt");
  const [page,        setPage]        = useState(1);

  const [viewBlog,      setViewBlog]      = useState(null);
  const [editBlog,      setEditBlog]      = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [resetting,     setResetting]     = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const debRef = useRef(null);

  /* ── Fetch ── */
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PER_PAGE, sort };
      if (statusTab) params.status   = statusTab;
      if (category)  params.category = category;
      if (search)    params.search   = search;

      const res = await api.get("/blogs/admin/all", { params });
      setBlogs(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      if (res.data.counts) setCounts(res.data.counts);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, statusTab, category, search]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  /* ── Search debounce ── */
  const handleSearchInput = (val) => {
    setSearchInput(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => { setSearch(val); setPage(1); }, 400);
  };

  /* ── Reset views ── */
  const resetViews = async () => {
    if (!window.confirm("Barcha bloglarning ko'rishlar sonini 0 ga tushirishni istaysizmi?")) return;
    setResetting(true);
    try {
      const res = await api.get("/blogs/admin/all", { params: { limit: 1000, page: 1 } });
      const all = res.data.data || [];
      if (!all.length) { toast.success("Resetlanadigan blog topilmadi"); return; }
      await Promise.all(all.map(b => api.patch(`/blogs/admin/${b._id}`, { views: 0 })));
      setBlogs(prev => prev.map(b => ({ ...b, views: 0 })));
      toast.success(`${all.length} ta blogning ko'rishlar soni 0 ga tushirildi`);
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setResetting(false);
    }
  };

  /* ── Status change ── */
  const changeStatus = async (id, status) => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try {
      await api.patch(`/blogs/admin/${id}/status`, { status });
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, status, isPublished: status === "approved" } : b));
      setCounts(p => {
        const old = blogs.find(b => b._id === id)?.status || "pending";
        return { ...p, [old]: Math.max(0, (p[old] || 0) - 1), [status]: (p[status] || 0) + 1 };
      });
      const msgs = { approved: "Tasdiqlandi", rejected: "Rad etildi" };
      toast.success(msgs[status] || "Yangilandi");
      if (viewBlog?._id === id) setViewBlog(p => ({ ...p, status, isPublished: status === "approved" }));
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setActionLoading(p => ({ ...p, [id]: false }));
    }
  };

  /* ── Edit save ── */
  const handleEditSave = async (id, data) => {
    try {
      const r = await api.patch(`/blogs/admin/${id}`, data);
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, ...r.data.data } : b));
      toast.success("Blog yangilandi");
    } catch {
      toast.error("Xatolik");
      throw new Error();
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    const id = deleteTarget?.id;
    try {
      await api.delete(`/blogs/admin/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
      setTotal(p => p - 1);
      toast.success("O'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handlePage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "'Inter',sans-serif", padding: "28px 32px", background: T.bg, minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.redLight, border: `1.5px solid ${T.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LuBookOpen size={18} style={{ color: T.red }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0 }}>Blog boshqaruvi</h1>
          </div>
          <p style={{ fontSize: 13, color: T.textDim, margin: 0 }}>Barcha bloglar, tasdiqlash va tahrirlash</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", borderRadius: 12, background: `linear-gradient(135deg,${T.red},#B91C1C)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(198,40,40,.3)" }}
          >
            <LuPlus size={15} /> Yangi blog
          </button>
          <button
            onClick={resetViews}
            disabled={resetting}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: `1.5px solid ${T.redBorder}`, borderRadius: 12, background: T.redLight, color: T.red, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: resetting ? 0.6 : 1 }}
          >
            {resetting ? <LuLoader size={13} className="spin" /> : <LuRotateCcw size={13} />}
            Viewlarni tiklash
          </button>
          <button
            onClick={fetchBlogs}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.surface, color: T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <LuRefreshCw size={14} /> Yangilash
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Jami"         value={counts.all}      icon={LuBookOpen}    color={T.textMuted} bg="#F8FAFC"      border={T.border}    />
        <StatCard label="Kutilmoqda"   value={counts.pending}  icon={LuClock3}      color={T.warn}      bg={T.warnBg}     border={T.warnBd}    />
        <StatCard label="Tasdiqlangan" value={counts.approved} icon={LuCircleCheck} color={T.success}   bg={T.successBg}  border={T.successBd} />
        <StatCard label="Rad etilgan"  value={counts.rejected} icon={LuCircleX}     color={T.red}       bg={T.redLight}   border={T.redBorder} />
      </div>

      {/* ── Status Tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {STATUS_TABS.map(t => {
          const active = statusTab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => { setStatusTab(t.value); setPage(1); }}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 15px",
                border: active ? `1.5px solid ${t.color}44` : `1.5px solid ${T.border}`,
                borderRadius: 10,
                background: active ? t.color + "12" : T.surface,
                color: active ? t.color : T.textMuted,
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
              }}
            >
              <t.icon size={13} />
              {t.label}
              <span style={{
                background: active ? t.color + "20" : T.surfaceUp,
                color: active ? t.color : T.textDim,
                padding: "1px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
              }}>
                {t.value === "" ? counts.all : counts[t.value] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ background: T.surface, borderRadius: 14, border: `1.5px solid ${T.border}`, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <LuSearch size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <input
            type="text"
            value={searchInput}
            onChange={e => handleSearchInput(e.target.value)}
            placeholder="Sarlavha yoki muallif qidirish..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: T.text, background: T.surfaceUp }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <LuTag size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            style={{ padding: "9px 30px 9px 32px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.textMuted, outline: "none", background: T.surfaceUp, appearance: "none", cursor: "pointer", fontWeight: 600 }}
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <LuChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
        </div>
        <div style={{ position: "relative" }}>
          <LuArrowUpDown size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            style={{ padding: "9px 30px 9px 32px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.textMuted, outline: "none", background: T.surfaceUp, appearance: "none", cursor: "pointer", fontWeight: 600 }}
          >
            <option value="-createdAt">Eng yangi</option>
            <option value="createdAt">Eng eski</option>
            <option value="-views">Ko'p ko'rilgan</option>
          </select>
          <LuChevronDown size={12} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.textDim, pointerEvents: "none" }} />
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12.5, color: T.textDim, fontWeight: 600, background: T.surfaceUp, padding: "6px 12px", borderRadius: 8, border: `1px solid ${T.border}` }}>
          {total} ta natija
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: T.surface, borderRadius: 16, border: `1.5px solid ${T.border}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>

        {/* Table Head */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "44px minmax(200px,3fr) minmax(140px,1.5fr) 120px 90px 120px 130px",
          padding: "11px 20px", background: T.surfaceUp, borderBottom: `1px solid ${T.border}`,
        }}>
          {["#", "Maqola", "Muallif", "Kategoriya", "Sana", "Status", "Amallar"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 20px", gap: 14 }}>
            <LuLoader size={32} className="spin" style={{ color: T.red }} />
            <p style={{ color: T.textDim, fontSize: 13.5, margin: 0, fontWeight: 600 }}>Yuklanmoqda...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📝</div>
            <p style={{ color: T.textMuted, fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>Blog topilmadi</p>
            <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Filtr yoki qidiruv shartlarini o'zgartiring</p>
          </div>
        ) : (
          blogs.map((blog, idx) => {
            const authorName = blog.author ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim() : "—";
            const isActing = actionLoading[blog._id];

            return (
              <div
                key={blog._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px minmax(200px,3fr) minmax(140px,1.5fr) 120px 90px 120px 130px",
                  padding: "14px 20px",
                  borderBottom: idx < blogs.length - 1 ? `1px solid ${T.border}` : "none",
                  alignItems: "center",
                  transition: "background .12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceUp}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Number */}
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.textDim, textAlign: "center" }}>
                  {(page - 1) * PER_PAGE + idx + 1}
                </div>

                {/* Title */}
                <div style={{ minWidth: 0, paddingRight: 12, display: "flex", gap: 11, alignItems: "center" }}>
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: `1px solid ${T.border}` }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: T.surfaceUp, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <LuBookOpen size={16} style={{ color: T.textDim }} />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", marginBottom: 4 }}>
                      {blog.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: T.textDim }}>
                        <LuView size={10} /> {blog.views || 0}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: T.textDim }}>
                        <LuHeart size={10} /> {blog.likesCount || 0}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: T.textDim }}>
                        <LuClock size={10} /> {blog.readTime || 1} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <Avatar user={blog.author} size={30} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {authorName}
                    </div>
                    {blog.author?.email && (
                      <div style={{ fontSize: 10.5, color: T.textDim, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {blog.author.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <CatBadge category={blog.category} />

                {/* Date */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <LuCalendar size={11} style={{ color: T.textDim, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: T.textDim, whiteSpace: "nowrap" }}>{fmtDate(blog.createdAt)}</span>
                </div>

                {/* Status */}
                <StatusBadge status={blog.status || "pending"} />

                {/* Actions */}
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => setViewBlog(blog)}
                    title="Ko'rish"
                    style={{ width: 32, height: 32, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, transition: "all .12s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.infoBg; e.currentTarget.style.borderColor = T.infoBd; e.currentTarget.style.color = T.info; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                  >
                    <LuEye size={14} />
                  </button>

                  {blog.status !== "approved" && (
                    <button
                      onClick={() => changeStatus(blog._id, "approved")}
                      disabled={isActing}
                      title="Tasdiqlash"
                      style={{ width: 32, height: 32, border: `1.5px solid ${T.successBd}`, borderRadius: 8, background: T.successBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.success }}
                    >
                      {isActing ? <LuLoader size={12} className="spin" /> : <LuCheck size={14} />}
                    </button>
                  )}

                  {blog.status !== "rejected" && (
                    <button
                      onClick={() => changeStatus(blog._id, "rejected")}
                      disabled={isActing}
                      title="Rad etish"
                      style={{ width: 32, height: 32, border: `1.5px solid ${T.redBorder}`, borderRadius: 8, background: T.redLight, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.red }}
                    >
                      <LuX size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => setEditBlog(blog)}
                    title="Tahrirlash"
                    style={{ width: 32, height: 32, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, transition: "all .12s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.purpleBg; e.currentTarget.style.borderColor = T.purpleBd; e.currentTarget.style.color = T.purple; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                  >
                    <LuPencil size={13} />
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: blog._id, title: blog.title })}
                    title="O'chirish"
                    style={{ width: 32, height: 32, border: `1.5px solid ${T.border}`, borderRadius: 8, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, transition: "all .12s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.borderColor = T.redBorder; e.currentTarget.style.color = T.red; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
                  >
                    <LuTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12.5, color: T.textDim, margin: 0 }}>
            Sahifa <strong style={{ color: T.textMuted }}>{page}</strong> / {totalPages} · Jami <strong style={{ color: T.textMuted }}>{total}</strong> ta
          </p>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}
            >
              <LuChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === "..." ? (
                <span key={`d${i}`} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim }}>…</span>
              ) : (
                <button key={p} onClick={() => handlePage(p)} style={{
                  width: 36, height: 36, borderRadius: 10, fontSize: 13, fontWeight: 700,
                  border: page === p ? `1.5px solid ${T.redMid}` : `1.5px solid ${T.border}`,
                  background: page === p ? T.red : T.surface,
                  color: page === p ? "#fff" : T.textMuted,
                  cursor: "pointer",
                }}>{p}</button>
              ))}

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface, cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}
            >
              <LuChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={(newBlog) => {
            setBlogs(prev => [newBlog, ...prev]);
            setTotal(p => p + 1);
            setCounts(p => ({ ...p, all: p.all + 1, [newBlog.status || "pending"]: (p[newBlog.status || "pending"] || 0) + 1 }));
          }}
        />
      )}
      {viewBlog && (
        <ViewModal
          blog={viewBlog}
          onClose={() => setViewBlog(null)}
          onApprove={id => changeStatus(id, "approved")}
          onReject={id => changeStatus(id, "rejected")}
          actionLoading={actionLoading}
        />
      )}
      {editBlog && (
        <EditModal
          blog={editBlog}
          onClose={() => setEditBlog(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
