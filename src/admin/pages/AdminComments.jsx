import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminCommentsService,
  adminReviewsService,
  adminSiteReviewsService,
} from "../../services/adminService";
import {
  PiChatCircleDuotone,
  PiStarDuotone,
  PiGlobeDuotone,
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
  PiArrowDownDuotone,
  PiArrowUpDuotone,
  PiXBold,
  PiWarningDuotone,
  PiCheckCircleDuotone,
  PiProhibitDuotone,
} from "react-icons/pi";

/* ── tokens ── */
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

const PAGE_SIZE = 20;

/* ── helpers ── */
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("uz-UZ", { year: "numeric", month: "short", day: "numeric" });
}
function fmtFull(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("uz-UZ", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
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
];
function avatarGrad(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return GRAD[Math.abs(h) % GRAD.length];
}

/* ── small components ── */
function Avatar({ user, size = 34 }) {
  const name = `${user?.firstName || ""}${user?.lastName || ""}`;
  return user?.avatar ? (
    <img src={user.avatar} alt={name}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
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

function Stars({ rating, size = 13 }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <PiStarDuotone key={i} size={size}
          style={{ color: i <= rating ? "#f59e0b" : "#d1d5db" }} />
      ))}
    </div>
  );
}

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
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1 }}>{value ?? "—"}</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, title, color, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 7, cursor: "pointer",
        border: `1px solid ${hov ? color : T.border}`,
        background: hov ? `${color}15` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hov ? color : T.textMuted, transition: "all .15s",
      }}>
      {children}
    </button>
  );
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      minWidth: 32, height: 32, borderRadius: 8, padding: "0 8px",
      border: `1px solid ${active ? T.accent : T.border}`,
      background: active ? T.accent : T.card,
      color: active ? "#fff" : disabled ? T.textLight : T.textMuted,
      fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s", opacity: disabled ? 0.5 : 1,
    }}>
      {children}
    </button>
  );
}

/* ── Toolbar ── */
function Toolbar({ inputVal, setInput, onSearch, onClear, search, sort, toggleSort, refetch, isFetching }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: "14px 18px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    }}>
      <form onSubmit={onSearch} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <PiMagnifyingGlassDuotone size={16} style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.textLight,
          }} />
          <input value={inputVal} onChange={e => setInput(e.target.value)}
            placeholder="Matn bo'yicha qidirish..."
            style={{
              width: "100%", paddingLeft: 32, paddingRight: 12, height: 36,
              border: `1px solid ${T.border}`, borderRadius: 8,
              fontSize: 13, color: T.text, outline: "none",
              background: T.bg, boxSizing: "border-box",
            }} />
        </div>
        <button type="submit" style={{
          height: 36, padding: "0 16px", borderRadius: 8, border: "none",
          background: T.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Qidirish</button>
        {search && (
          <button type="button" onClick={onClear} style={{
            height: 36, padding: "0 12px", borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.bg,
            fontSize: 12, color: T.textMuted, cursor: "pointer",
          }}>Tozalash</button>
        )}
      </form>
      <button onClick={toggleSort} style={{
        height: 36, padding: "0 14px", borderRadius: 8,
        border: `1px solid ${T.border}`, background: T.bg,
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 12, fontWeight: 600, color: T.textMuted, cursor: "pointer",
      }}>
        {sort === "newest"
          ? <><PiArrowDownDuotone size={14} /> Yangi avval</>
          : <><PiArrowUpDuotone size={14} /> Eski avval</>}
      </button>
      <button onClick={refetch} title="Yangilash" style={{
        width: 36, height: 36, borderRadius: 8,
        border: `1px solid ${T.border}`, background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: T.textMuted,
      }}>
        <PiArrowsClockwiseDuotone size={15} style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }} />
      </button>
    </div>
  );
}

/* ── Pagination ── */
function Pagination({ page, totalPages, total, setPage }) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
      <div style={{ fontSize: 13, color: T.textMuted }}>{from}–{to} / {total} ta</div>
      <div style={{ display: "flex", gap: 6 }}>
        <PageBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}><PiCaretLeftDuotone size={13} /></PageBtn>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
          <PageBtn key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>{i + 1}</PageBtn>
        ))}
        <PageBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><PiCaretRightDuotone size={13} /></PageBtn>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ text, onClose, onConfirm, loading }) {
  if (!text && text !== 0) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1001,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.card, borderRadius: 16, width: "100%", maxWidth: 400,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 28, textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: "rgba(239,68,68,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        }}>
          <PiWarningDuotone size={28} style={{ color: T.accent }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>O'chirishni tasdiqlang</div>
        {text && (
          <div style={{
            background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8,
            padding: "10px 14px", marginBottom: 20, fontSize: 13, color: T.text,
            lineHeight: 1.5, maxHeight: 80, overflow: "hidden",
          }}>
            "{String(text).slice(0, 120)}{String(text).length > 120 ? "…" : ""}"
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px 0", borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.bg,
            cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.textMuted,
          }}>Bekor qilish</button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, padding: "10px 0", borderRadius: 8,
            border: "none", background: T.accent,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13, fontWeight: 600, color: "#fff", opacity: loading ? 0.7 : 1,
          }}>{loading ? "O'chirilmoqda..." : "O'chirish"}</button>
        </div>
      </div>
    </div>
  );
}

/* ── View Modal ── */
function ViewModal({ item, fields, onClose }) {
  if (!item) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.card, borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 24px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Tafsilot</span>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, border: `1px solid ${T.border}`,
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted,
          }}><PiXBold size={14} /></button>
        </div>
        <div style={{ padding: 24 }}>
          {/* user row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Avatar user={item._user} size={44} />
            <div>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 15 }}>
                {item._user?.firstName} {item._user?.lastName}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                {item._user?.role || "user"}
              </div>
            </div>
          </div>
          {/* comment text */}
          {item._text && (
            <div style={{
              background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
              padding: "14px 16px", marginBottom: 16,
              fontSize: 14, color: T.text, lineHeight: 1.6,
              whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>{item._text}</div>
          )}
          {/* extra fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fields.map(({ icon: Icon, label, value }) => value != null && (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Icon size={16} style={{ color: T.accent, marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.textMuted, minWidth: 80, flexShrink: 0 }}>{label}:</span>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500, wordBreak: "break-all" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ TAB 1: Blog Izohlar ══════════════ */
function BlogCommentsTab() {
  const qc = useQueryClient();
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [inputVal, setInput]  = useState("");
  const [sort, setSort]       = useState("newest");
  const [viewing, setViewing] = useState(null);
  const [deleting, setDel]    = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-blog-comments", page, search, sort],
    queryFn:  () => adminCommentsService.getAll({ page, limit: PAGE_SIZE, search, sort }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const items      = data?.data       || [];
  const total      = data?.total      || 0;
  const totalPages = data?.totalPages || 1;

  const deleteMut = useMutation({
    mutationFn: ({ blogId, commentId }) => adminCommentsService.remove(blogId, commentId),
    onSuccess:  () => { qc.invalidateQueries(["admin-blog-comments"]); setDel(null); },
  });

  const handleSearch = useCallback(e => {
    e.preventDefault(); setSearch(inputVal.trim()); setPage(1);
  }, [inputVal]);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard icon={PiChatCircleDuotone} label="Jami izohlar" value={total} />
        <StatCard icon={PiChatCircleDuotone} label="Sahifadagi" value={items.length}
          color="#10b981" bg="rgba(16,185,129,0.08)" />
      </div>

      <Toolbar inputVal={inputVal} setInput={setInput} onSearch={handleSearch}
        onClear={() => { setSearch(""); setInput(""); setPage(1); }}
        search={search} sort={sort} toggleSort={() => { setSort(s => s === "newest" ? "oldest" : "newest"); setPage(1); }}
        refetch={refetch} isFetching={isFetching} />

      <TableWrap cols="44px 1fr 200px 80px 120px 80px"
        headers={["#", "FOYDALANUVCHI / IZOH", "BLOG", "LIKE", "SANA", "AMAL"]}>
        {isLoading ? <EmptyRow>Yuklanmoqda...</EmptyRow>
          : items.length === 0 ? <EmptyRow icon={PiChatCircleDuotone}>Izohlar topilmadi</EmptyRow>
          : items.map((c, i) => (
          <Row key={c._id} cols="44px 1fr 200px 80px 120px 80px"
            cells={[
              <Num>{(page - 1) * PAGE_SIZE + i + 1}</Num>,
              <UserCell user={c.user} sub={c.text} />,
              <BlogCell title={c.blogTitle} />,
              <LikeCell count={c.likesCount} />,
              <DateCell date={c.createdAt} />,
              <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                <ActionBtn onClick={() => setViewing({
                  _user: c.user, _text: c.text,
                  extra: [
                    { icon: PiNewspaperDuotone, label: "Blog", value: c.blogTitle },
                    { icon: PiHeartDuotone, label: "Like", value: c.likesCount },
                    { icon: PiCalendarDuotone, label: "Sana", value: fmtFull(c.createdAt) },
                  ],
                })} title="Ko'rish" color="#3b82f6"><PiEyeDuotone size={15} /></ActionBtn>
                <ActionBtn onClick={() => setDel(c)} title="O'chirish" color={T.accent}><PiTrashDuotone size={15} /></ActionBtn>
              </div>,
            ]} />
        ))}
      </TableWrap>

      <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />

      {viewing && (
        <ViewModal item={viewing} fields={viewing.extra} onClose={() => setViewing(null)} />
      )}
      <DeleteModal text={deleting?.text} onClose={() => setDel(null)} loading={deleteMut.isLoading}
        onConfirm={() => deleteMut.mutate({ blogId: deleting.blogId, commentId: deleting._id })} />
    </>
  );
}

/* ══════════════ TAB 2: Blogger Sharhlari ══════════════ */
function BloggerReviewsTab() {
  const qc = useQueryClient();
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [inputVal, setInput]  = useState("");
  const [sort, setSort]       = useState("newest");
  const [viewing, setViewing] = useState(null);
  const [deleting, setDel]    = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-blogger-reviews", page, search, sort],
    queryFn:  () => adminReviewsService.getAll({ page, limit: PAGE_SIZE, search, sort }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const items      = data?.data       || [];
  const total      = data?.total      || 0;
  const totalPages = data?.totalPages || 1;

  const deleteMut = useMutation({
    mutationFn: (id) => adminReviewsService.remove(id),
    onSuccess:  () => { qc.invalidateQueries(["admin-blogger-reviews"]); setDel(null); },
  });

  const handleSearch = useCallback(e => {
    e.preventDefault(); setSearch(inputVal.trim()); setPage(1);
  }, [inputVal]);

  const bloggerName = (r) => {
    const u = r.blogger?.user;
    if (!u) return "—";
    return `${u.firstName || ""} ${u.lastName || ""}`.trim();
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard icon={PiStarDuotone} label="Jami sharhlar" value={total}
          color="#f59e0b" bg="rgba(245,158,11,0.08)" />
        <StatCard icon={PiStarDuotone} label="Sahifadagi" value={items.length}
          color="#10b981" bg="rgba(16,185,129,0.08)" />
      </div>

      <Toolbar inputVal={inputVal} setInput={setInput} onSearch={handleSearch}
        onClear={() => { setSearch(""); setInput(""); setPage(1); }}
        search={search} sort={sort} toggleSort={() => { setSort(s => s === "newest" ? "oldest" : "newest"); setPage(1); }}
        refetch={refetch} isFetching={isFetching} />

      <TableWrap cols="44px 1fr 180px 100px 120px 80px"
        headers={["#", "FOYDALANUVCHI / SHARH", "BLOGGER", "BAHO", "SANA", "AMAL"]}>
        {isLoading ? <EmptyRow>Yuklanmoqda...</EmptyRow>
          : items.length === 0 ? <EmptyRow icon={PiStarDuotone}>Sharhlar topilmadi</EmptyRow>
          : items.map((r, i) => (
          <Row key={r._id} cols="44px 1fr 180px 100px 120px 80px"
            cells={[
              <Num>{(page - 1) * PAGE_SIZE + i + 1}</Num>,
              <UserCell user={r.reviewer} sub={r.comment || "—"} />,
              <span style={{ fontSize: 12, color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {bloggerName(r)}
              </span>,
              <Stars rating={r.rating} />,
              <DateCell date={r.createdAt} />,
              <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                <ActionBtn onClick={() => setViewing({
                  _user: r.reviewer, _text: r.comment,
                  extra: [
                    { icon: PiUserDuotone,     label: "Blogger", value: bloggerName(r) },
                    { icon: PiStarDuotone,     label: "Baho",    value: `${r.rating}/5` },
                    { icon: PiHeartDuotone,    label: "Like",    value: r.likes?.length || 0 },
                    { icon: PiCalendarDuotone, label: "Sana",    value: fmtFull(r.createdAt) },
                  ],
                })} title="Ko'rish" color="#3b82f6"><PiEyeDuotone size={15} /></ActionBtn>
                <ActionBtn onClick={() => setDel(r)} title="O'chirish" color={T.accent}><PiTrashDuotone size={15} /></ActionBtn>
              </div>,
            ]} />
        ))}
      </TableWrap>

      <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />

      {viewing && (
        <ViewModal item={viewing} fields={viewing.extra} onClose={() => setViewing(null)} />
      )}
      <DeleteModal text={deleting?.comment} onClose={() => setDel(null)} loading={deleteMut.isLoading}
        onConfirm={() => deleteMut.mutate(deleting._id)} />
    </>
  );
}

/* ══════════════ TAB 3: Sayt Sharhlari ══════════════ */
function SiteReviewsTab() {
  const qc = useQueryClient();
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [inputVal, setInput]  = useState("");
  const [sort, setSort]       = useState("newest");
  const [viewing, setViewing] = useState(null);
  const [deleting, setDel]    = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-site-reviews", page, search, sort],
    queryFn:  () => adminSiteReviewsService.getAll({ page, limit: PAGE_SIZE, search, sort }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const items      = data?.data       || [];
  const total      = data?.total      || 0;
  const totalPages = data?.totalPages || 1;

  const deleteMut = useMutation({
    mutationFn: (id) => adminSiteReviewsService.remove(id),
    onSuccess:  () => { qc.invalidateQueries(["admin-site-reviews"]); setDel(null); },
  });

  const statusMut = useMutation({
    mutationFn: ({ id, isApproved }) => adminSiteReviewsService.updateStatus(id, isApproved),
    onSuccess:  () => qc.invalidateQueries(["admin-site-reviews"]),
  });

  const handleSearch = useCallback(e => {
    e.preventDefault(); setSearch(inputVal.trim()); setPage(1);
  }, [inputVal]);

  const displayName = (r) => {
    if (r.user) return `${r.user.firstName || ""} ${r.user.lastName || ""}`.trim();
    return r.displayName || "Noma'lum";
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatCard icon={PiGlobeDuotone} label="Jami sharhlar" value={total}
          color="#8b5cf6" bg="rgba(139,92,246,0.08)" />
        <StatCard icon={PiCheckCircleDuotone} label="Tasdiqlangan"
          value={items.filter(r => r.isApproved).length}
          color="#10b981" bg="rgba(16,185,129,0.08)" />
        <StatCard icon={PiProhibitDuotone} label="Tasdiqlanmagan"
          value={items.filter(r => !r.isApproved).length}
          color="#f59e0b" bg="rgba(245,158,11,0.08)" />
      </div>

      <Toolbar inputVal={inputVal} setInput={setInput} onSearch={handleSearch}
        onClear={() => { setSearch(""); setInput(""); setPage(1); }}
        search={search} sort={sort} toggleSort={() => { setSort(s => s === "newest" ? "oldest" : "newest"); setPage(1); }}
        refetch={refetch} isFetching={isFetching} />

      <TableWrap cols="44px 1fr 100px 120px 100px 100px"
        headers={["#", "FOYDALANUVCHI / SHARH", "BAHO", "SANA", "HOLAT", "AMAL"]}>
        {isLoading ? <EmptyRow>Yuklanmoqda...</EmptyRow>
          : items.length === 0 ? <EmptyRow icon={PiGlobeDuotone}>Sayt sharhlari topilmadi</EmptyRow>
          : items.map((r, i) => (
          <Row key={r._id} cols="44px 1fr 100px 120px 100px 100px"
            cells={[
              <Num>{(page - 1) * PAGE_SIZE + i + 1}</Num>,
              <UserCell user={r.user || { firstName: displayName(r) }} sub={r.comment || "—"} />,
              <Stars rating={r.rating} />,
              <DateCell date={r.createdAt} />,
              <StatusBadge approved={r.isApproved} />,
              <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                <ActionBtn
                  onClick={() => statusMut.mutate({ id: r._id, isApproved: !r.isApproved })}
                  title={r.isApproved ? "Bekor qilish" : "Tasdiqlash"}
                  color={r.isApproved ? "#f59e0b" : "#10b981"}>
                  {r.isApproved
                    ? <PiProhibitDuotone size={15} />
                    : <PiCheckCircleDuotone size={15} />}
                </ActionBtn>
                <ActionBtn onClick={() => setViewing({
                  _user: r.user || { firstName: displayName(r) }, _text: r.comment,
                  extra: [
                    { icon: PiStarDuotone,      label: "Baho",    value: `${r.rating}/5` },
                    { icon: PiCheckCircleDuotone,label: "Holat",   value: r.isApproved ? "Tasdiqlangan" : "Kutmoqda" },
                    { icon: PiCalendarDuotone,   label: "Sana",    value: fmtFull(r.createdAt) },
                  ],
                })} title="Ko'rish" color="#3b82f6"><PiEyeDuotone size={15} /></ActionBtn>
                <ActionBtn onClick={() => setDel(r)} title="O'chirish" color={T.accent}><PiTrashDuotone size={15} /></ActionBtn>
              </div>,
            ]} />
        ))}
      </TableWrap>

      <Pagination page={page} totalPages={totalPages} total={total} setPage={setPage} />

      {viewing && (
        <ViewModal item={viewing} fields={viewing.extra} onClose={() => setViewing(null)} />
      )}
      <DeleteModal text={deleting?.comment} onClose={() => setDel(null)} loading={deleteMut.isLoading}
        onConfirm={() => deleteMut.mutate(deleting._id)} />
    </>
  );
}

/* ── Shared table primitives ── */
function TableWrap({ cols, headers, children }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, padding: "10px 18px", borderBottom: `1px solid ${T.border}`, background: T.bg }}>
        {headers.map((h, i) => (
          <div key={i} style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</div>
        ))}
      </div>
      {children}
    </div>
  );
}

function Row({ cols, cells }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: cols,
        padding: "12px 18px", borderBottom: `1px solid ${T.border}`,
        alignItems: "center", background: hov ? "#fafafa" : T.card, transition: "background .12s",
      }}>
      {cells.map((c, i) => <div key={i}>{c}</div>)}
    </div>
  );
}

function EmptyRow({ icon: Icon = PiChatCircleDuotone, children }) {
  return (
    <div style={{ padding: 60, textAlign: "center" }}>
      <Icon size={48} style={{ color: T.textLight, marginBottom: 12 }} />
      <div style={{ fontSize: 15, fontWeight: 600, color: T.textMuted }}>{children}</div>
    </div>
  );
}

function Num({ children }) {
  return <span style={{ fontSize: 13, color: T.textLight, fontWeight: 600 }}>{children}</span>;
}
function UserCell({ user, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
      <Avatar user={user} size={34} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
          {user?.firstName} {user?.lastName}
        </div>
        <div style={{ fontSize: 12, color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>
          {sub}
        </div>
      </div>
    </div>
  );
}
function BlogCell({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
      <PiNewspaperDuotone size={13} style={{ color: T.textLight, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title || "—"}</span>
    </div>
  );
}
function LikeCell({ count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <PiHeartDuotone size={13} style={{ color: "#f87171" }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: T.textMuted }}>{count}</span>
    </div>
  );
}
function DateCell({ date }) {
  return <span style={{ fontSize: 12, color: T.textLight }}>{fmtDate(date)}</span>;
}
function StatusBadge({ approved }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: approved ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
      color: approved ? "#10b981" : "#f59e0b",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
      {approved ? "Tasdiqlangan" : "Kutmoqda"}
    </span>
  );
}

/* ══════════════ MAIN PAGE ══════════════ */
const TABS = [
  { key: "blog",    label: "Blog izohlar",      Icon: PiChatCircleDuotone },
  { key: "blogger", label: "Blogger sharhlari", Icon: PiStarDuotone       },
  { key: "site",    label: "Sayt sharhlari",    Icon: PiGlobeDuotone      },
];

export default function AdminComments() {
  const [activeTab, setActiveTab] = useState("blog");

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "24px 28px" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PiChatCircleDuotone size={22} style={{ color: T.accent }} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>Izohlar va Sharhlar</h1>
          <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>Blog, Blogger va Sayt sharhlari</p>
        </div>
      </div>

      {/* tabs */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 24,
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: 4, width: "fit-content",
      }}>
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 18px", borderRadius: 9, border: "none",
            background: activeTab === key ? T.accent : "transparent",
            color: activeTab === key ? "#fff" : T.textMuted,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            transition: "all .15s",
          }}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* tab content */}
      {activeTab === "blog"    && <BlogCommentsTab />}
      {activeTab === "blogger" && <BloggerReviewsTab />}
      {activeTab === "site"    && <SiteReviewsTab />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
