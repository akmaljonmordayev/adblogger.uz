import { useState, useEffect, useCallback, useRef } from "react";
import {
  LuSearch, LuEye, LuPencil, LuTrash2, LuCheck, LuX,
  LuLoader, LuChevronLeft, LuChevronRight, LuRefreshCw,
  LuBookOpen, LuClock, LuCalendar, LuTriangleAlert,
  LuCircleCheck, LuCircleX, LuClock3,
} from "react-icons/lu";
import { toast } from "../../components/ui/toast";
import api from "../../services/api";

/* ── constants ─────────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: "",           label: "Barchasi" },
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
  { value: "",         label: "Barchasi",  Icon: LuBookOpen,    color: "#374151" },
  { value: "pending",  label: "Kutilmoqda", Icon: LuClock3,      color: "#d97706" },
  { value: "approved", label: "Tasdiqlangan", Icon: LuCircleCheck, color: "#16a34a" },
  { value: "rejected", label: "Rad etilgan", Icon: LuCircleX,     color: "#dc2626" },
];

const CAT_COLOR = {
  Tech: "#2563eb", Lifestyle: "#a21caf", Beauty: "#e11d48", Food: "#d97706",
  Sports: "#16a34a", Travel: "#0d9488", Education: "#0891b2", Business: "#7c3aed",
  Gaming: "#ea580c", Music: "#9333ea", Other: "#64748b",
};

const STATUS_META = {
  pending:  { bg: "#fef9c3", c: "#854d0e", bd: "#fde68a", t: "Kutilmoqda",    icon: "⏳" },
  approved: { bg: "#dcfce7", c: "#166534", bd: "#86efac", t: "Tasdiqlangan",  icon: "✅" },
  rejected: { bg: "#fee2e2", c: "#991b1b", bd: "#fca5a5", t: "Rad etilgan",   icon: "❌" },
};

const PER_PAGE = 10;

/* ── helpers ───────────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
}
function getInitials(u) {
  if (!u) return "AD";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "AD";
}

/* ── StatusBadge ───────────────────────────────────────────────────── */
function StatusBadge({ s }) {
  const x = STATUS_META[s] || STATUS_META.pending;
  return (
    <span style={{ background: x.bg, color: x.c, border: `1px solid ${x.bd}`,
      fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
      display: "inline-flex", alignItems: "center", gap: 4 }}>
      {x.icon} {x.t}
    </span>
  );
}

/* ── ViewModal ────────────────────────────────────────────────────── */
function ViewModal({ blog, onClose, onApprove, onReject }) {
  if (!blog) return null;
  const cc = CAT_COLOR[blog.category] || "#64748b";
  const authorName = blog.author ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim() : "—";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:740,
        maxHeight:"90vh", overflow:"auto", boxShadow:"0 24px 64px rgba(0,0,0,.2)" }}>
        {/* header */}
        <div style={{ padding:"18px 24px", borderBottom:"1px solid #f1f5f9",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, background:"#fff", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ background: cc + "15", color: cc, border: `1px solid ${cc}30`,
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>
              {blog.category}
            </span>
            <StatusBadge s={blog.status || "pending"} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {blog.status !== "approved" && (
              <button onClick={() => onApprove(blog._id)} style={{
                display:"flex", alignItems:"center", gap:5, padding:"7px 14px",
                background:"#16a34a", color:"#fff", border:"none", borderRadius:8,
                fontSize:12, fontWeight:700, cursor:"pointer" }}>
                <LuCheck size={13} /> Tasdiqlash
              </button>
            )}
            {blog.status !== "rejected" && (
              <button onClick={() => onReject(blog._id)} style={{
                display:"flex", alignItems:"center", gap:5, padding:"7px 14px",
                background:"#dc2626", color:"#fff", border:"none", borderRadius:8,
                fontSize:12, fontWeight:700, cursor:"pointer" }}>
                <LuX size={13} /> Rad etish
              </button>
            )}
            <button onClick={onClose} style={{ width:32, height:32, border:"1.5px solid #e2e8f0",
              borderRadius:8, background:"#fff", cursor:"pointer", display:"flex",
              alignItems:"center", justifyContent:"center" }}>
              <LuX size={14} />
            </button>
          </div>
        </div>
        {/* body */}
        <div style={{ padding:"24px 28px" }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#0f172a", margin:"0 0 14px", lineHeight:1.3 }}>
            {blog.title}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
                background: blog.author?.avatar ? `url(${blog.author.avatar}) center/cover` : "#dc2626",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:700, color:"#fff" }}>
                {!blog.author?.avatar && getInitials(blog.author)}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{authorName}</span>
              {blog.author?.role && (
                <span style={{ fontSize:11, background:"#f1f5f9", color:"#64748b", padding:"2px 7px", borderRadius:5 }}>
                  {blog.author.role}
                </span>
              )}
            </div>
            <span style={{ fontSize:12, color:"#94a3b8", display:"flex", alignItems:"center", gap:4 }}>
              <LuCalendar size={11} />{fmtDate(blog.createdAt)}
            </span>
            <span style={{ fontSize:12, color:"#94a3b8", display:"flex", alignItems:"center", gap:4 }}>
              <LuClock size={11} />{blog.readTime} min
            </span>
            <span style={{ fontSize:12, color:"#94a3b8" }}>👁 {blog.views || 0}</span>
            <span style={{ fontSize:12, color:"#94a3b8" }}>❤️ {blog.likesCount || 0}</span>
          </div>
          {blog.excerpt && (
            <p style={{ fontSize:14, color:"#64748b", fontStyle:"italic",
              borderLeft:"3px solid #fecaca", paddingLeft:12, marginBottom:20, lineHeight:1.65 }}>
              {blog.excerpt}
            </p>
          )}
          {blog.coverImage && (
            <img src={blog.coverImage} alt="" style={{ width:"100%", borderRadius:12, marginBottom:20, maxHeight:280, objectFit:"cover" }} />
          )}
          <div style={{ fontSize:14, lineHeight:1.85, color:"#374151", whiteSpace:"pre-wrap" }}>
            {blog.content?.replace(/<[^>]*>/g, "") || "Kontent yo'q"}
          </div>
          {blog.tags?.length > 0 && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:20, paddingTop:16, borderTop:"1px solid #f1f5f9" }}>
              {blog.tags.map(t => (
                <span key={t} style={{ background:"#f1f5f9", color:"#64748b", padding:"3px 10px", borderRadius:20, fontSize:12 }}>
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

/* ── EditModal ────────────────────────────────────────────────────── */
function EditModal({ blog, onClose, onSave }) {
  const [form, setForm] = useState({
    title:    blog?.title    || "",
    category: blog?.category || "",
    excerpt:  blog?.excerpt  || "",
    content:  blog?.content  || "",
    tags:     (blog?.tags || []).join(", "),
    isPublished: blog?.isPublished || false,
    status:   blog?.status   || "pending",
  });
  const [saving, setSaving] = useState(false);

  const inp = (extra = {}) => ({
    width:"100%", padding:"10px 13px", fontSize:13.5,
    border:"1.5px solid #e2e8f0", borderRadius:9, outline:"none",
    background:"#fff", color:"#0f172a", boxSizing:"border-box",
    fontFamily:"inherit", ...extra,
  });

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
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:640,
        maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ padding:"18px 22px", borderBottom:"1px solid #f1f5f9",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          position:"sticky", top:0, background:"#fff", zIndex:1 }}>
          <span style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>Blogni tahrirlash</span>
          <button onClick={onClose} style={{ width:30, height:30, border:"1.5px solid #e2e8f0",
            borderRadius:8, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LuX size={13} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding:"22px" }}>
          {[
            { label:"Sarlavha *", key:"title", type:"input", required:true },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12.5, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>{f.label}</label>
              <input style={inp()} value={form[f.key]}
                onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                required={f.required} />
            </div>
          ))}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={{ fontSize:12.5, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>Kategoriya</label>
              <select style={inp()} value={form.category}
                onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                {CATEGORIES.slice(1).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12.5, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>Status</label>
              <select style={inp()} value={form.status}
                onChange={e => setForm(p => ({
                  ...p,
                  status: e.target.value,
                  isPublished: e.target.value === "approved",
                }))}>
                <option value="pending">Kutilmoqda</option>
                <option value="approved">Tasdiqlangan</option>
                <option value="rejected">Rad etilgan</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12.5, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>Qisqacha tavsif</label>
            <textarea style={{...inp(), resize:"vertical"}} rows={2} value={form.excerpt}
              onChange={e => setForm(p => ({...p, excerpt: e.target.value}))} />
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12.5, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>Kontent *</label>
            <textarea style={{...inp(), resize:"vertical"}} rows={8} value={form.content}
              onChange={e => setForm(p => ({...p, content: e.target.value}))} required />
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12.5, fontWeight:700, color:"#374151", display:"block", marginBottom:5 }}>Teglar (vergul bilan)</label>
            <input style={inp()} value={form.tags}
              onChange={e => setForm(p => ({...p, tags: e.target.value}))}
              placeholder="marketing, reklama" />
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button type="button" onClick={onClose} style={{ padding:"9px 20px", border:"1.5px solid #e2e8f0", borderRadius:9, background:"#fff", color:"#374151", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Bekor
            </button>
            <button type="submit" disabled={saving} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 22px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              {saving ? <LuLoader size={13} className="spin"/> : <LuCheck size={13}/>} Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── DeleteConfirm ────────────────────────────────────────────────── */
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:400,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:32, maxWidth:380, width:"100%", textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:"#fef2f2",
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <LuTriangleAlert size={26} style={{ color:"#dc2626" }} />
        </div>
        <h3 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:"0 0 8px" }}>O'chirishni tasdiqlang</h3>
        <p style={{ fontSize:13.5, color:"#64748b", margin:"0 0 24px", lineHeight:1.6 }}>
          Bu blogni o'chirsangiz, qaytarib bo'lmaydi.
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px", border:"1.5px solid #e2e8f0", borderRadius:10, background:"#fff", fontSize:13.5, fontWeight:600, cursor:"pointer" }}>
            Bekor
          </button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", color:"#fff", border:"none", borderRadius:10, fontSize:13.5, fontWeight:700, cursor:"pointer" }}>
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminBlogs() {
  const [blogs,      setBlogs]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts,     setCounts]     = useState({ all:0, pending:0, approved:0, rejected:0 });

  const [statusTab,  setStatusTab]  = useState("");
  const [category,   setCategory]   = useState("");
  const [search,     setSearch]     = useState("");
  const [searchInput,setSearchInput]= useState("");
  const [sort,       setSort]       = useState("-createdAt");
  const [page,       setPage]       = useState(1);

  const [viewBlog,   setViewBlog]   = useState(null);
  const [editBlog,   setEditBlog]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const debRef = useRef(null);

  /* ── fetch ── */
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

  /* ── search debounce ── */
  const handleSearchInput = (val) => {
    setSearchInput(val);
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => { setSearch(val); setPage(1); }, 400);
  };

  /* ── status change ── */
  const changeStatus = async (id, status) => {
    setActionLoading(p => ({...p, [id]: true}));
    try {
      const res = await api.patch(`/blogs/admin/${id}/status`, { status });
      setBlogs(prev => prev.map(b => b._id === id ? { ...b, status, isPublished: status === "approved" } : b));
      setCounts(p => {
        const old = blogs.find(b => b._id === id)?.status || "pending";
        return { ...p, [old]: Math.max(0, (p[old]||0)-1), [status]: (p[status]||0)+1 };
      });
      toast.success(status === "approved" ? "Tasdiqlandi ✅" : status === "rejected" ? "Rad etildi" : "Yangilandi");
      if (viewBlog?._id === id) setViewBlog(p => ({...p, status, isPublished: status === "approved"}));
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setActionLoading(p => ({...p, [id]: false}));
    }
  };

  /* ── edit save ── */
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

  /* ── delete ── */
  const handleDelete = async () => {
    try {
      await api.delete(`/blogs/admin/${deleteId}`);
      setBlogs(prev => prev.filter(b => b._id !== deleteId));
      setTotal(p => p - 1);
      toast.success("O'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDeleteId(null);
    }
  };

  const handlePage = (p) => { setPage(p); window.scrollTo({ top:0, behavior:"smooth" }); };

  /* ── render ── */
  return (
    <div style={{ fontFamily:"'Inter',sans-serif", padding:"28px 32px", background:"#f8fafc", minHeight:"100vh" }}>

      {/* header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Blog boshqaruvi</h1>
          <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>Barcha bloglar, tasdiqlash va tahrirlash</p>
        </div>
        <button onClick={fetchBlogs} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px", border:"1.5px solid #e2e8f0", borderRadius:10, background:"#fff", color:"#374151", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          <LuRefreshCw size={14} /> Yangilash
        </button>
      </div>

      {/* status tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {STATUS_TABS.map(t => (
          <button key={t.value} onClick={() => { setStatusTab(t.value); setPage(1); }} style={{
            display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
            border: statusTab === t.value ? `1.5px solid ${t.color}` : "1.5px solid #e2e8f0",
            borderRadius:10, background: statusTab === t.value ? t.color + "12" : "#fff",
            color: statusTab === t.value ? t.color : "#374151",
            fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s",
          }}>
            <t.Icon size={14} />
            {t.label}
            <span style={{ background: statusTab === t.value ? t.color + "20" : "#f1f5f9",
              color: statusTab === t.value ? t.color : "#64748b",
              padding:"1px 7px", borderRadius:20, fontSize:11, fontWeight:700 }}>
              {t.value === "" ? counts.all : counts[t.value] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* filters */}
      <div style={{ background:"#fff", borderRadius:14, border:"1.5px solid #f1f5f9",
        padding:"16px 18px", marginBottom:20, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
        {/* search */}
        <div style={{ position:"relative", flex:"1", minWidth:200 }}>
          <LuSearch size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }} />
          <input type="text" value={searchInput}
            onChange={e => handleSearchInput(e.target.value)}
            placeholder="Sarlavha yoki muallif qidirish..."
            style={{ width:"100%", padding:"9px 12px 9px 34px", border:"1.5px solid #e2e8f0", borderRadius:9,
              fontSize:13, outline:"none", boxSizing:"border-box", color:"#374151" }} />
        </div>
        {/* category */}
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
          style={{ padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:9, fontSize:13, color:"#374151", outline:"none", background:"#fff" }}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {/* sort */}
        <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
          style={{ padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:9, fontSize:13, color:"#374151", outline:"none", background:"#fff" }}>
          <option value="-createdAt">Eng yangi</option>
          <option value="createdAt">Eng eski</option>
          <option value="-views">Ko'p ko'rilgan</option>
        </select>
        <span style={{ fontSize:12, color:"#94a3b8" }}>{total} ta natija</span>
      </div>

      {/* table */}
      <div style={{ background:"#fff", borderRadius:16, border:"1.5px solid #f1f5f9", overflow:"hidden" }}>
        {/* table header */}
        <div style={{ display:"grid", gridTemplateColumns:"2.5fr 1.2fr 1fr 1fr 1fr 120px",
          padding:"12px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
          {["Maqola", "Muallif", "Kategoriya", "Sana", "Status", "Amallar"].map(h => (
            <span key={h} style={{ fontSize:11.5, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:"60px 20px" }}>
            <LuLoader size={28} className="spin" style={{ color:"#dc2626" }} />
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📝</div>
            <p style={{ color:"#94a3b8", fontSize:14, margin:0 }}>Blog topilmadi</p>
          </div>
        ) : (
          blogs.map((blog, idx) => {
            const cc = CAT_COLOR[blog.category] || "#64748b";
            const authorName = blog.author ? `${blog.author.firstName||""} ${blog.author.lastName||""}`.trim() : "—";
            const isActing = actionLoading[blog._id];

            return (
              <div key={blog._id} style={{
                display:"grid", gridTemplateColumns:"2.5fr 1.2fr 1fr 1fr 1fr 120px",
                padding:"14px 18px", borderBottom: idx < blogs.length-1 ? "1px solid #f8fafc" : "none",
                alignItems:"center", transition:"background .15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* title */}
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:"#0f172a", lineHeight:1.4,
                    overflow:"hidden", display:"-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical" }}>
                    {blog.title}
                  </div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:3, display:"flex", gap:8 }}>
                    <span>👁 {blog.views||0}</span>
                    <span>❤️ {blog.likesCount||0}</span>
                    <span>⏱ {blog.readTime||1} min</span>
                  </div>
                </div>

                {/* author */}
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                    background: blog.author?.avatar ? `url(${blog.author.avatar}) center/cover` : "#dc2626",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:9, fontWeight:700, color:"#fff" }}>
                    {!blog.author?.avatar && getInitials(blog.author)}
                  </div>
                  <span style={{ fontSize:12.5, color:"#374151", fontWeight:500,
                    overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                    {authorName}
                  </span>
                </div>

                {/* category */}
                <span style={{ background: cc + "15", color: cc, border:`1px solid ${cc}30`,
                  fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:6, display:"inline-block" }}>
                  {blog.category}
                </span>

                {/* date */}
                <span style={{ fontSize:12, color:"#94a3b8" }}>{fmtDate(blog.createdAt)}</span>

                {/* status */}
                <StatusBadge s={blog.status || "pending"} />

                {/* actions */}
                <div style={{ display:"flex", gap:5 }}>
                  {/* view */}
                  <button onClick={() => setViewBlog(blog)} title="Ko'rish"
                    style={{ width:30, height:30, border:"1.5px solid #e2e8f0", borderRadius:7,
                      background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b" }}>
                    <LuEye size={13} />
                  </button>
                  {/* approve */}
                  {blog.status !== "approved" && (
                    <button onClick={() => changeStatus(blog._id, "approved")} title="Tasdiqlash"
                      disabled={isActing}
                      style={{ width:30, height:30, border:"1.5px solid #bbf7d0", borderRadius:7,
                        background:"#f0fdf4", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#16a34a" }}>
                      {isActing ? <LuLoader size={11} className="spin"/> : <LuCheck size={13} />}
                    </button>
                  )}
                  {/* reject */}
                  {blog.status !== "rejected" && (
                    <button onClick={() => changeStatus(blog._id, "rejected")} title="Rad etish"
                      disabled={isActing}
                      style={{ width:30, height:30, border:"1.5px solid #fecaca", borderRadius:7,
                        background:"#fef2f2", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                      <LuX size={13} />
                    </button>
                  )}
                  {/* edit */}
                  <button onClick={() => setEditBlog(blog)} title="Tahrirlash"
                    style={{ width:30, height:30, border:"1.5px solid #e2e8f0", borderRadius:7,
                      background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b" }}>
                    <LuPencil size={13} />
                  </button>
                  {/* delete */}
                  <button onClick={() => setDeleteId(blog._id)} title="O'chirish"
                    style={{ width:30, height:30, border:"1.5px solid #fecaca", borderRadius:7,
                      background:"#fef2f2", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#dc2626" }}>
                    <LuTrash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginTop:24 }}>
          <button onClick={() => handlePage(page-1)} disabled={page===1}
            style={{ width:34, height:34, borderRadius:8, border:"1.5px solid #e2e8f0", background:"#fff",
              cursor:page===1?"not-allowed":"pointer", opacity:page===1?.4:1,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LuChevronLeft size={14} />
          </button>
          {Array.from({length:totalPages},(_, i)=>i+1)
            .filter(p => p===1||p===totalPages||Math.abs(p-page)<=1)
            .reduce((acc,p,idx,arr) => { if(idx>0&&p-arr[idx-1]>1) acc.push("..."); acc.push(p); return acc; },[])
            .map((p,i) => p==="..." ? (
              <span key={`d${i}`} style={{ padding:"0 4px", color:"#94a3b8" }}>…</span>
            ) : (
              <button key={p} onClick={() => handlePage(p)} style={{
                width:34, height:34, borderRadius:8, fontSize:13, fontWeight:600,
                border:page===p?"1.5px solid #dc2626":"1.5px solid #e2e8f0",
                background:page===p?"#dc2626":"#fff",
                color:page===p?"#fff":"#374151", cursor:"pointer",
              }}>{p}</button>
            ))}
          <button onClick={() => handlePage(page+1)} disabled={page===totalPages}
            style={{ width:34, height:34, borderRadius:8, border:"1.5px solid #e2e8f0", background:"#fff",
              cursor:page===totalPages?"not-allowed":"pointer", opacity:page===totalPages?.4:1,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LuChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Modals */}
      {viewBlog && (
        <ViewModal
          blog={viewBlog}
          onClose={() => setViewBlog(null)}
          onApprove={id => changeStatus(id, "approved")}
          onReject={id => changeStatus(id, "rejected")}
        />
      )}
      {editBlog && (
        <EditModal
          blog={editBlog}
          onClose={() => setEditBlog(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteId && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
