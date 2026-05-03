import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import api from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import {
  LuArrowLeft, LuCalendar, LuClock, LuEye, LuHeart, LuMessageCircle,
  LuShare2, LuCheck, LuSend, LuTrash2, LuUser,
  LuChevronRight, LuTrendingUp, LuCircleAlert,
} from "react-icons/lu";

/* ── helpers ──────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}
function fmtDateShort(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
}
function fmtNum(n = 0) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
function getInitials(u) {
  if (!u) return "AD";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "AD";
}
function getAvatarGrad(name = "") {
  const grads = [
    "135deg,#dc2626,#b91c1c", "135deg,#2563eb,#1d4ed8", "135deg,#7c3aed,#6d28d9",
    "135deg,#16a34a,#15803d", "135deg,#d97706,#b45309", "135deg,#0891b2,#0e7490",
  ];
  const idx = name.charCodeAt(0) % grads.length;
  return grads[idx] || grads[0];
}

const CAT_STYLE = {
  Tech:      { bg: "#eff6ff", tc: "#2563eb" },
  Lifestyle: { bg: "#fdf4ff", tc: "#a21caf" },
  Beauty:    { bg: "#fff1f2", tc: "#e11d48" },
  Food:      { bg: "#fffbeb", tc: "#d97706" },
  Sports:    { bg: "#f0fdf4", tc: "#16a34a" },
  Travel:    { bg: "#f0fdfa", tc: "#0d9488" },
  Education: { bg: "#f0f9ff", tc: "#0891b2" },
  Business:  { bg: "#f5f3ff", tc: "#7c3aed" },
  Gaming:    { bg: "#fff7ed", tc: "#ea580c" },
  Music:     { bg: "#fdf4ff", tc: "#9333ea" },
  Other:     { bg: "#f8fafc", tc: "#64748b" },
};

/* ── Skeleton ──────────────────────────────────────────────────────────── */
function Skeleton({ w = "100%", h = 16, r = 8, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
    }} />
  );
}

/* ── Comment component ──────────────────────────────────────────────────── */
function CommentItem({ comment, currentUserId, blogAuthorId, onDelete, onLike }) {
  const [liking, setLiking] = useState(false);
  const name = comment.user ? `${comment.user.firstName || ""} ${comment.user.lastName || ""}`.trim() : "Foydalanuvchi";
  const grad = getAvatarGrad(name);
  const canDelete = currentUserId && (
    comment.user?._id?.toString() === currentUserId?.toString() ||
    blogAuthorId?.toString() === currentUserId?.toString()
  );

  const handleLike = async () => {
    if (!currentUserId || liking) return;
    setLiking(true);
    await onLike(comment._id);
    setLiking(false);
  };

  return (
    <div style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: "1px solid #f8fafc" }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: comment.user?.avatar ? `url(${comment.user.avatar}) center/cover` : `linear-gradient(${grad})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color: "#fff",
      }}>
        {!comment.user?.avatar && getInitials(comment.user)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{name}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{fmtDateShort(comment.createdAt)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleLike}
              style={{
                display: "flex", alignItems: "center", gap: 4, padding: "3px 8px",
                borderRadius: 6, border: "1px solid",
                borderColor: comment.isLiked ? "#fecaca" : "#e2e8f0",
                background: comment.isLiked ? "#fef2f2" : "transparent",
                color: comment.isLiked ? "#dc2626" : "#94a3b8",
                fontSize: 11, fontWeight: 600, cursor: currentUserId ? "pointer" : "default",
                transition: "all .2s",
              }}
            >
              <LuHeart size={11} fill={comment.isLiked ? "#dc2626" : "none"} />
              {comment.likesCount > 0 && comment.likesCount}
            </button>
            {canDelete && (
              <button onClick={() => onDelete(comment._id)} style={{
                padding: "3px 6px", borderRadius: 6, border: "1px solid #e2e8f0",
                background: "transparent", color: "#94a3b8", cursor: "pointer",
                transition: "all .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "#dc2626"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                <LuTrash2 size={11} />
              </button>
            )}
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65, margin: 0 }}>{comment.text}</p>
      </div>
    </div>
  );
}

/* ── Related card ──────────────────────────────────────────────────────── */
function RelatedCard({ post }) {
  const cs = CAT_STYLE[post.category] || CAT_STYLE.Other;
  const slug = post.slug || post._id;
  return (
    <Link to={`/blog/${slug}`} style={{ textDecoration: "none" }}>
      <div className="related-card" style={{
        background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 16,
        padding: "16px", transition: "all .25s",
      }}>
        <span style={{ background: cs.bg, color: cs.tc, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 5, display: "inline-block", marginBottom: 8 }}>
          {post.category}
        </span>
        <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.45, margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.title}
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#94a3b8" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><LuClock size={9} />{post.readTime} min</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><LuEye size={9} />{fmtNum(post.views)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [related, setRelated]     = useState([]);

  const [liked, setLiked]         = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments]   = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [copied, setCopied]       = useState(false);

  const { user: authUser } = useAuthStore();
  const currentUserId = authUser?._id || null;

  /* ── fetch blog ── */
  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/blogs/${id}`);
      const data = res.data.data;
      setPost(data);
      setLiked(data.isLiked || false);
      setLikesCount(data.likesCount || 0);
      setComments(data.comments || []);
      setCommentsCount(data.commentsCount || 0);

      // fetch related
      if (data.category) {
        try {
          const rel = await api.get("/blogs", {
            params: { category: data.category, limit: 4, sort: "-views" },
          });
          setRelated((rel.data.data || []).filter(p => p._id !== data._id).slice(0, 3));
        } catch {}
      }
    } catch (err) {
      setError(err.response?.data?.message || "Blog topilmadi.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  /* ── like ── */
  const handleLike = async () => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    // optimistic
    setLiked(v => !v);
    setLikesCount(v => liked ? v - 1 : v + 1);
    try {
      const res = await api.post(`/blogs/${post._id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch {
      // revert
      setLiked(v => !v);
      setLikesCount(v => liked ? v + 1 : v - 1);
    } finally {
      setLikeLoading(false);
    }
  };

  /* ── add comment ── */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUserId) { navigate("/login"); return; }
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const res = await api.post(`/blogs/${post._id}/comments`, { text: commentText.trim() });
      setComments(prev => [...prev, res.data.data]);
      setCommentsCount(res.data.commentsCount);
      setCommentText("");
    } catch {}
    setCommentLoading(false);
  };

  /* ── delete comment ── */
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await api.delete(`/blogs/${post._id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
      setCommentsCount(res.data.commentsCount);
    } catch {}
  };

  /* ── like comment ── */
  const handleLikeComment = async (commentId) => {
    if (!currentUserId) { navigate("/login"); return; }
    try {
      const res = await api.post(`/blogs/${post._id}/comments/${commentId}/like`);
      setComments(prev => prev.map(c =>
        c._id === commentId
          ? { ...c, liked: res.data.liked, likesCount: res.data.likesCount, isLiked: res.data.liked }
          : c
      ));
    } catch {}
  };

  /* ── copy link ── */
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── loading ── */
  if (loading) {
    return (
      <div style={{ fontFamily: "'Inter',sans-serif", maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
        <Skeleton w={80} h={14} r={8} mb={32} />
        <Skeleton w="60%" h={36} r={10} mb={12} />
        <Skeleton w="40%" h={14} r={8} mb={32} />
        <Skeleton h={280} r={20} mb={32} />
        <Skeleton h={14} r={8} mb={10} />
        <Skeleton h={14} r={8} mb={10} />
        <Skeleton w="80%" h={14} r={8} mb={10} />
        <Skeleton h={14} r={8} mb={10} />
        <Skeleton w="60%" h={14} r={8} />
      </div>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <div style={{ fontFamily: "'Inter',sans-serif", maxWidth: 860, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <LuCircleAlert size={48} style={{ color: "#dc2626", marginBottom: 16 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Blog topilmadi</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>{error}</p>
        <Link to="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", background: "#dc2626", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
          <LuArrowLeft size={14} /> Bloglarga qaytish
        </Link>
      </div>
    );
  }

  if (!post) return null;

  const cs = CAT_STYLE[post.category] || CAT_STYLE.Other;
  const authorName = post.author ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() : "ADBlogger";
  const grad = getAvatarGrad(authorName);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        canonical={`/blog/${id}`}
        isArticle
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.coverImage,
          "author": { "@type": "Person", "name": authorName },
          "publisher": { "@type": "Organization", "name": "ADBlogger", "logo": { "@type": "ImageObject", "url": "https://adblogger.uz/favicon.svg" } },
          "datePublished": post.createdAt,
          "url": `https://adblogger.uz/blog/${id}`,
        }}
      />

      {/* ── breadcrumb ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Bosh sahifa</Link>
          <LuChevronRight size={12} />
          <Link to="/blog" style={{ color: "#94a3b8", textDecoration: "none" }}>Blog</Link>
          <LuChevronRight size={12} />
          <span style={{ color: "#374151", fontWeight: 500 }}>{post.category}</span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ background: cs.bg, color: cs.tc, fontSize: 11, fontWeight: 700, letterSpacing: "1px", padding: "4px 12px", borderRadius: 8, display: "inline-block", marginBottom: 16 }}>
            {post.category?.toUpperCase()}
          </span>

          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.2, margin: "0 0 20px" }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, margin: "0 0 24px", fontStyle: "italic", borderLeft: "3px solid #fecaca", paddingLeft: 16 }}>
              {post.excerpt}
            </p>
          )}

          {/* author + meta */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, padding: "20px", background: "#fff", borderRadius: 16, border: "1.5px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: post.author?.avatar ? `url(${post.author.avatar}) center/cover` : `linear-gradient(${grad})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {!post.author?.avatar && getInitials(post.author)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{authorName}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LuCalendar size={11} />{fmtDate(post.createdAt)}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LuClock size={11} />{post.readTime} daqiqa</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                  <LuEye size={14} />{fmtNum(post.views)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                  <LuHeart size={14} />{fmtNum(likesCount)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                  <LuMessageCircle size={14} />{fmtNum(commentsCount)}
                </span>
              </div>
              <button onClick={handleCopy} style={{
                display: "flex", alignItems: "center", gap: 5, padding: "8px 14px",
                border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff",
                fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", transition: "all .2s",
              }}>
                {copied ? <LuCheck size={13} style={{ color: "#16a34a" }} /> : <LuShare2 size={13} />}
                {copied ? "Nusxalandi" : "Ulashish"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Cover ── */}
        {post.coverImage ? (
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 40, boxShadow: "0 8px 32px rgba(0,0,0,.1)" }}>
            <img src={post.coverImage} alt={post.title} style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }} />
          </div>
        ) : (
          <div style={{
            height: 280, borderRadius: 20, marginBottom: 40,
            background: `linear-gradient(135deg,${post.category === "Tech" ? "#1e3a5f,#2563eb" : post.category === "Gaming" ? "#7c2d12,#ea580c" : "#7f1d1d,#dc2626"})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 12, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.06) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
            <div style={{ fontSize: 48, position: "relative", zIndex: 1 }}>📝</div>
            <span style={{ color: "rgba(255,255,255,.5)", fontSize: 12, fontWeight: 500, position: "relative", zIndex: 1 }}>
              {authorName}
            </span>
          </div>
        )}

        {/* ── Article content ── */}
        <article style={{
          background: "#fff", borderRadius: 20, padding: "40px 44px",
          border: "1.5px solid #f1f5f9", marginBottom: 32,
          boxShadow: "0 2px 16px rgba(0,0,0,.04)",
        }}>
          <div
            className="blog-content"
            style={{ fontSize: 16, lineHeight: 1.9, color: "#374151" }}
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {/* tags */}
          {post.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 36, paddingTop: 28, borderTop: "1px solid #f1f5f9" }}>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  padding: "4px 12px", borderRadius: 20, fontSize: 12, color: "#64748b",
                }}>#{tag}</span>
              ))}
            </div>
          )}
        </article>

        {/* ── Like button (big) ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 36px",
              borderRadius: 16, border: "2px solid",
              borderColor: liked ? "#dc2626" : "#e2e8f0",
              background: liked ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "#fff",
              color: liked ? "#fff" : "#374151",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              transition: "all .25s", transform: likeLoading ? "scale(.97)" : "scale(1)",
              boxShadow: liked ? "0 8px 24px rgba(220,38,38,.3)" : "0 2px 8px rgba(0,0,0,.06)",
            }}
          >
            <LuHeart
              size={20}
              fill={liked ? "#fff" : "none"}
              style={{ transition: "transform .2s", transform: liked ? "scale(1.2)" : "scale(1)" }}
            />
            {liked ? "Yoqdi!" : currentUserId ? "Yoqtirish" : "Yoqtirish uchun kiring"}
            <span style={{
              background: liked ? "rgba(255,255,255,.2)" : "#f1f5f9",
              color: liked ? "#fff" : "#374151",
              padding: "2px 10px", borderRadius: 20, fontSize: 13, fontWeight: 800,
            }}>
              {fmtNum(likesCount)}
            </span>
          </button>
        </div>

        {/* ── Comments ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <LuMessageCircle size={22} style={{ color: "#dc2626" }} />
            Izohlar
            <span style={{ background: "#fef2f2", color: "#dc2626", padding: "2px 10px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{commentsCount}</span>
          </h2>

          {/* add comment form */}
          <form onSubmit={handleAddComment} style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 16, padding: "20px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
            {currentUserId ? (
              <>
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Fikringizni yozing..."
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: "1.5px solid #e2e8f0", fontSize: 14, lineHeight: 1.65,
                    resize: "vertical", outline: "none", boxSizing: "border-box",
                    fontFamily: "'Inter',sans-serif", color: "#374151",
                    transition: "border-color .2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#dc2626"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                  <button
                    type="submit"
                    disabled={!commentText.trim() || commentLoading}
                    style={{
                      display: "flex", alignItems: "center", gap: 7, padding: "9px 22px",
                      background: commentText.trim() ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "#f1f5f9",
                      color: commentText.trim() ? "#fff" : "#94a3b8",
                      border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13.5,
                      cursor: commentText.trim() ? "pointer" : "not-allowed", transition: "all .2s",
                    }}
                  >
                    <LuSend size={14} />
                    {commentLoading ? "Yuborilmoqda..." : "Izoh qoldirish"}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
                <LuUser size={20} style={{ color: "#94a3b8" }} />
                <span style={{ fontSize: 14, color: "#64748b" }}>
                  Izoh qoldirish uchun{" "}
                  <Link to="/login" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "none" }}>kiring</Link>
                </span>
              </div>
            )}
          </form>

          {/* comments list */}
          {comments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
              <LuMessageCircle size={36} style={{ marginBottom: 12, opacity: .4 }} />
              <p style={{ fontSize: 14, margin: 0 }}>Hali izohlar yo'q. Birinchi bo'lib fikr qoldiring!</p>
            </div>
          ) : (
            <div>
              {comments.map(c => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  currentUserId={currentUserId}
                  blogAuthorId={post.author?._id || post.author}
                  onDelete={handleDeleteComment}
                  onLike={handleLikeComment}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <LuTrendingUp size={20} style={{ color: "#dc2626" }} />
                O'xshash maqolalar
              </h2>
              <Link to={`/blog?category=${post.category}`} style={{ fontSize: 13, color: "#dc2626", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Hammasi <LuChevronRight size={14} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="related-grid">
              {related.map(r => <RelatedCard key={r._id} post={r} />)}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .blog-content h1,.blog-content h2,.blog-content h3,.blog-content h4 {
          font-family: 'Syne',sans-serif; font-weight: 800; color: #0f172a; margin: 28px 0 12px; line-height: 1.25;
        }
        .blog-content h1 { font-size: 28px; }
        .blog-content h2 { font-size: 22px; border-left: 3px solid #dc2626; padding-left: 14px; }
        .blog-content h3 { font-size: 18px; }
        .blog-content p  { margin: 0 0 18px; }
        .blog-content a  { color: #dc2626; font-weight: 600; }
        .blog-content img { width: 100%; border-radius: 12px; margin: 8px 0 18px; }
        .blog-content ul,.blog-content ol { padding-left: 20px; margin: 0 0 18px; }
        .blog-content li { margin-bottom: 8px; line-height: 1.75; }
        .blog-content blockquote {
          border-left: 4px solid #dc2626; margin: 24px 0;
          padding: 16px 20px; background: #fef2f2; border-radius: 0 12px 12px 0;
          font-style: italic; color: #374151;
        }
        .blog-content pre {
          background: #1e293b; color: #e2e8f0; padding: 20px 24px; border-radius: 12px;
          overflow-x: auto; font-size: 14px; line-height: 1.65; margin: 0 0 18px;
        }
        .blog-content code {
          background: #f1f5f9; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-size: 13px;
        }
        .blog-content pre code { background: none; color: inherit; padding: 0; }
        .blog-content strong { font-weight: 700; color: #0f172a; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 0 0 18px; }
        .blog-content th,.blog-content td { padding: 10px 14px; border: 1px solid #e2e8f0; text-align: left; }
        .blog-content th { background: #f8fafc; font-weight: 700; color: #0f172a; }

        .related-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); border-color: #fecaca !important; transform: translateY(-2px); }
        @media(max-width:640px) {
          .related-grid { grid-template-columns: 1fr !important; }
          article { padding: 24px 20px !important; }
        }
      `}</style>
    </div>
  );
}
