import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCommentsService } from "../../services/adminService";
import {
  PiChatCircleDuotone,
  PiTrashDuotone,
  PiEyeDuotone,
  PiMagnifyingGlassDuotone,
  PiArrowsClockwiseDuotone,
  PiHeartDuotone,
  PiNewspaperDuotone,
  PiUserDuotone,
  PiCalendarDuotone,
  PiCaretLeftDuotone,
  PiCaretRightDuotone,
  PiArrowUpDuotone,
  PiArrowDownDuotone,
  PiXBold,
  PiWarningDuotone,
} from "react-icons/pi";

/* ── design tokens ── */
const T = {
  bg:        "#f8f9fb",
  card:      "#ffffff",
  border:    "#e5e7eb",
  text:      "#111827",
  textMuted: "#6b7280",
  textLight: "#9ca3af",
  accent:    "#ef4444",
  accentBg:  "rgba(239,68,68,0.08)",
  radius:    12,
};

/* ── helpers ── */
function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("uz-UZ", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtShort(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("uz-UZ", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function initials(u) {
  if (!u) return "?";
  return ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")).toUpperCase() || "?";
}

const GRAD = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
];
function avatarGrad(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return GRAD[Math.abs(h) % GRAD.length];
}

/* ── Avatar ── */
function Avatar({ user, size = 34 }) {
  const name = `${user?.firstName || ""}${user?.lastName || ""}`;
  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={name}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: avatarGrad(name),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: "#fff",
    }}>
      {initials(user)}
    </div>
  );
}

/* ── StatCard ── */
function StatCard({ icon: Icon, label, value, color = T.accent, bg = T.accentBg }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── View Modal ── */
function ViewModal({ comment, onClose }) {
  if (!comment) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.card, borderRadius: 16, width: "100%", maxWidth: 520,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{
          padding: "18px 24px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PiChatCircleDuotone size={20} style={{ color: T.accent }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Izoh tafsiloti</span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, border: `1px solid ${T.border}`,
              background: "transparent", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", color: T.textMuted,
            }}
          >
            <PiXBold size={14} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: 24 }}>
          {/* user */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Avatar user={comment.user} size={44} />
            <div>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 15 }}>
                {comment.user?.firstName} {comment.user?.lastName}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                {comment.user?.role || "user"}
              </div>
            </div>
          </div>

          {/* comment text */}
          <div style={{
            background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
            padding: "14px 16px", marginBottom: 16,
            fontSize: 14, color: T.text, lineHeight: 1.6,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {comment.text}
          </div>

          {/* meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Row icon={PiNewspaperDuotone} label="Blog" value={comment.blogTitle} />
            <Row icon={PiHeartDuotone} label="Like" value={comment.likesCount} />
            <Row icon={PiCalendarDuotone} label="Sana" value={fmt(comment.createdAt)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <Icon size={16} style={{ color: T.accent, marginTop: 1, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: T.textMuted, minWidth: 60, flexShrink: 0 }}>{label}:</span>
      <span style={{ fontSize: 13, color: T.text, fontWeight: 500, wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ comment, onClose, onConfirm, loading }) {
  if (!comment) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1001,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.card, borderRadius: 16, width: "100%", maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 28,
          textAlign: "center",
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "rgba(239,68,68,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <PiWarningDuotone size={28} style={{ color: T.accent }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 8 }}>
          Izohni o'chirishni tasdiqlang
        </div>
        <div style={{
          fontSize: 13, color: T.textMuted, marginBottom: 8, lineHeight: 1.5,
        }}>
          Ushbu amal qaytarib bo'lmaydi.
        </div>
        <div style={{
          background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "10px 14px", marginBottom: 20,
          fontSize: 13, color: T.text, lineHeight: 1.5,
          maxHeight: 80, overflow: "hidden",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
        }}>
          "{comment.text}"
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.bg,
              cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.textMuted,
            }}
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 8,
              border: "none", background: T.accent,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 13, fontWeight: 600, color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ── Main Component ── */
const PAGE_SIZE = 20;

const AdminComments = () => {
  const qc = useQueryClient();

  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [inputVal, setInput]  = useState("");
  const [sort, setSort]       = useState("newest");

  const [viewComment, setViewComment]     = useState(null);
  const [deleteComment, setDeleteComment] = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-comments", page, search, sort],
    queryFn: () =>
      adminCommentsService.getAll({ page, limit: PAGE_SIZE, search, sort }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const comments   = data?.data        || [];
  const total      = data?.total       || 0;
  const totalPages = data?.totalPages  || 1;

  /* delete mutation */
  const deleteMut = useMutation({
    mutationFn: ({ blogId, commentId }) =>
      adminCommentsService.remove(blogId, commentId),
    onSuccess: () => {
      qc.invalidateQueries(["admin-comments"]);
      setDeleteComment(null);
    },
  });

  /* search with debounce-like submit */
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearch(inputVal.trim());
    setPage(1);
  }, [inputVal]);

  const toggleSort = () => {
    setSort(s => s === "newest" ? "oldest" : "newest");
    setPage(1);
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "24px 28px" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: T.accentBg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PiChatCircleDuotone size={22} style={{ color: T.accent }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>Izohlar</h1>
            <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>
              Jami {total} ta izoh
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 12, marginBottom: 24,
      }}>
        <StatCard icon={PiChatCircleDuotone} label="Jami izohlar" value={total} />
        <StatCard
          icon={PiHeartDuotone} label="Sahifadagi"
          value={comments.length}
          color="#10b981" bg="rgba(16,185,129,0.08)"
        />
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
        padding: "14px 18px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        {/* search */}
        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <PiMagnifyingGlassDuotone
              size={16}
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.textLight }}
            />
            <input
              value={inputVal}
              onChange={e => setInput(e.target.value)}
              placeholder="Izoh matni bo'yicha qidirish..."
              style={{
                width: "100%", paddingLeft: 32, paddingRight: 12, height: 36,
                border: `1px solid ${T.border}`, borderRadius: 8,
                fontSize: 13, color: T.text, outline: "none",
                background: T.bg, boxSizing: "border-box",
              }}
            />
          </div>
          <button type="submit" style={{
            height: 36, padding: "0 16px", borderRadius: 8, border: "none",
            background: T.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            Qidirish
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setInput(""); setPage(1); }}
              style={{
                height: 36, padding: "0 12px", borderRadius: 8,
                border: `1px solid ${T.border}`, background: T.bg,
                fontSize: 12, color: T.textMuted, cursor: "pointer",
              }}
            >
              Tozalash
            </button>
          )}
        </form>

        {/* sort */}
        <button
          onClick={toggleSort}
          style={{
            height: 36, padding: "0 14px", borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.bg,
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: T.textMuted, cursor: "pointer",
          }}
        >
          {sort === "newest"
            ? <><PiArrowDownDuotone size={14} /> Yangi avval</>
            : <><PiArrowUpDuotone size={14} /> Eski avval</>
          }
        </button>

        {/* refresh */}
        <button
          onClick={() => refetch()}
          style={{
            width: 36, height: 36, borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: T.textMuted,
          }}
          title="Yangilash"
        >
          <PiArrowsClockwiseDuotone size={15} style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }} />
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
        overflow: "hidden",
      }}>
        {/* table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "44px 1fr 200px 100px 130px 90px",
          padding: "10px 18px",
          borderBottom: `1px solid ${T.border}`,
          background: T.bg,
        }}>
          {["#", "FOYDALANUVCHI / IZOH", "BLOG", "LIKE", "SANA", "AMALLAR"].map((h, i) => (
            <div key={i} style={{
              fontSize: 11, fontWeight: 700, color: T.textMuted,
              letterSpacing: "0.8px", textTransform: "uppercase",
              textAlign: i === 3 || i === 5 ? "center" : "left",
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* rows */}
        {isLoading ? (
          <div style={{ padding: 60, textAlign: "center", color: T.textMuted, fontSize: 14 }}>
            Yuklanmoqda...
          </div>
        ) : comments.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <PiChatCircleDuotone size={48} style={{ color: T.textLight, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMuted }}>Izohlar topilmadi</div>
            {search && (
              <div style={{ fontSize: 13, color: T.textLight, marginTop: 4 }}>
                "{search}" bo'yicha natija yo'q
              </div>
            )}
          </div>
        ) : (
          comments.map((c, idx) => (
            <CommentRow
              key={c._id}
              comment={c}
              num={(page - 1) * PAGE_SIZE + idx + 1}
              onView={() => setViewComment(c)}
              onDelete={() => setDeleteComment(c)}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 16, flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ fontSize: 13, color: T.textMuted }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total} ta izoh
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <PageBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <PiCaretLeftDuotone size={13} />
            </PageBtn>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <PageBtn key={p} active={p === page} onClick={() => setPage(p)}>
                  {p}
                </PageBtn>
              );
            })}
            <PageBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <PiCaretRightDuotone size={13} />
            </PageBtn>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <ViewModal comment={viewComment} onClose={() => setViewComment(null)} />
      <DeleteModal
        comment={deleteComment}
        onClose={() => setDeleteComment(null)}
        loading={deleteMut.isLoading}
        onConfirm={() =>
          deleteMut.mutate({ blogId: deleteComment.blogId, commentId: deleteComment._id })
        }
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

/* ── Table Row ── */
function CommentRow({ comment, num, onView, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr 200px 100px 130px 90px",
        padding: "12px 18px",
        borderBottom: `1px solid ${T.border}`,
        alignItems: "center",
        background: hovered ? "#fafafa" : T.card,
        transition: "background .12s",
      }}
    >
      {/* # */}
      <div style={{ fontSize: 13, color: T.textLight, fontWeight: 600 }}>{num}</div>

      {/* user + comment */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
        <Avatar user={comment.user} size={34} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
            {comment.user?.firstName} {comment.user?.lastName}
          </div>
          <div style={{
            fontSize: 12.5, color: T.textMuted, marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            maxWidth: 320,
          }}>
            {comment.text}
          </div>
        </div>
      </div>

      {/* blog */}
      <div style={{
        fontSize: 12, color: T.textMuted,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <PiNewspaperDuotone size={13} style={{ color: T.textLight, flexShrink: 0 }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{comment.blogTitle || "—"}</span>
      </div>

      {/* likes */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <PiHeartDuotone size={13} style={{ color: "#f87171" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: T.textMuted }}>{comment.likesCount}</span>
      </div>

      {/* date */}
      <div style={{ fontSize: 12, color: T.textLight }}>{fmtShort(comment.createdAt)}</div>

      {/* actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <ActionBtn onClick={onView} title="Ko'rish" color="#3b82f6">
          <PiEyeDuotone size={15} />
        </ActionBtn>
        <ActionBtn onClick={onDelete} title="O'chirish" color={T.accent}>
          <PiTrashDuotone size={15} />
        </ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, title, color, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 7,
        border: `1px solid ${hov ? color : T.border}`,
        background: hov ? `${color}15` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: hov ? color : T.textMuted,
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, borderRadius: 8, padding: "0 8px",
        border: `1px solid ${active ? T.accent : T.border}`,
        background: active ? T.accent : T.card,
        color: active ? "#fff" : disabled ? T.textLight : T.textMuted,
        fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .15s", opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

export default AdminComments;
