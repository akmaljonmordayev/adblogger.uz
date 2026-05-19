import { useState, useEffect, useCallback } from "react";
import { toast } from "../../components/ui/toast";
import { adminUsersService } from "../../services/adminService";
import { LuSearch, LuRefreshCw, LuEye, LuLoader, LuChevronLeft, LuChevronRight, LuTrash2 } from "react-icons/lu";

const ROLE_LABELS = { user: "Foydalanuvchi", blogger: "Blogger", business: "Biznesmen", admin: "Admin" };
const ROLE_COLORS = {
  user:     { bg: "#eff6ff", c: "#1e40af", bd: "#bfdbfe" },
  blogger:  { bg: "#f0fdf4", c: "#166534", bd: "#bbf7d0" },
  business: { bg: "#fefce8", c: "#854d0e", bd: "#fde68a" },
  admin:    { bg: "#fdf2f8", c: "#9d174d", bd: "#fbcfe8" },
};
const AVATAR_COLORS = ["#6366f1","#f43f5e","#f97316","#10b981","#8b5cf6","#0ea5e9","#ec4899","#14b8a6"];

const PER = 10;

function ini(u) {
  return `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.toUpperCase() || "?";
}
function avaColor(u) {
  const code = (u?.email || u?.firstName || "?").charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function Ava({ user, size = 36 }) {
  const c = avaColor(user);
  if (user?.avatar) return (
    <img src={user.avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: c + "22", border: `1.5px solid ${c}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800, color: c,
    }}>{ini(user)}</div>
  );
}

function RolePill({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.user;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.bg, color: c.c, border: `1px solid ${c.bd}`, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

function StatusDot({ active }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: active ? "#166534" : "#991b1b" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
      {active ? "Faol" : "Nofaol"}
    </span>
  );
}

function ViewModal({ user, onClose, onToggle }) {
  const [saving, setSaving] = useState(false);
  if (!user) return null;

  const toggle = async () => {
    setSaving(true);
    try {
      await adminUsersService.update(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? "Foydalanuvchi bloklandi" : "Foydalanuvchi faollashtirildi");
      onToggle();
      onClose();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>Foydalanuvchi</span>
          <button onClick={onClose} style={{ fontSize: 22, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <Ava user={user} size={52} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{user.email}</div>
              <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                <RolePill role={user.role} />
                <StatusDot active={user.isActive} />
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[
              ["Telefon", user.phone || "—"],
              ["Ro'yxatdan o'tgan", new Date(user.createdAt).toLocaleDateString("uz-UZ")],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: 13 }}>{v}</div>
              </div>
            ))}
          </div>
          <button
            onClick={toggle}
            disabled={saving}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 10, border: "none", cursor: saving ? "not-allowed" : "pointer",
              background: user.isActive ? "#fee2e2" : "#dcfce7",
              color: user.isActive ? "#991b1b" : "#166534",
              fontWeight: 800, fontSize: 13,
            }}
          >
            {saving ? "Saqlanmoqda…" : user.isActive ? "Bloklash" : "Faollashtirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PER };
      if (role) params.role = role;
      const res = await adminUsersService.getAll(params);
      // filter by search client-side (backend doesn't have search for users)
      let data = res.data || [];
      if (search.trim()) {
        const q = search.toLowerCase();
        data = data.filter(u =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
        );
      }
      setUsers(data);
      setTotal(res.results || data.length);
    } catch {
      toast.error("Foydalanuvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [page, role, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminUsersService.remove(deleteTarget._id);
      toast.success(`${deleteTarget.firstName} ${deleteTarget.lastName} o'chirildi`);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      toast.error("O'chirishda xatolik yuz berdi");
    } finally {
      setDeleting(false);
    }
  };

  const pages = Math.ceil(total / PER) || 1;

  const stats = [
    { l: "Jami", v: total, c: "#111827" },
    { l: "Faol", v: users.filter(u => u.isActive).length, c: "#166534" },
    { l: "Blogger", v: users.filter(u => u.role === "blogger").length, c: "#1e40af" },
    { l: "Biznesmen", v: users.filter(u => u.role === "business").length, c: "#854d0e" },
  ];

  const BASE = { minHeight: "100vh", padding: "28px 32px", fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#f4f6fb" };
  const CARD = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14 };
  const INP  = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 9, height: 36, padding: "0 12px", fontSize: 13, color: "#111827", fontFamily: "inherit", outline: "none" };
  const TH   = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap" };
  const TD   = { padding: "11px 14px", borderBottom: "1px solid #f9fafb", verticalAlign: "middle" };

  return (
    <div style={BASE}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Foydalanuvchilar</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>Platformadagi barcha foydalanuvchilar</div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
          {stats.map(s => (
            <div key={s.l} style={{ ...CARD, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>{s.l}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ ...INP, display: "flex", alignItems: "center", gap: 8, width: 220, padding: "0 12px" }}>
            <LuSearch style={{ color: "#9ca3af", fontSize: 15, flexShrink: 0 }} />
            <input
              placeholder="Ism, email bo'yicha qidirish…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ background: "none", border: "none", outline: "none", color: "#111827", fontSize: 13, fontFamily: "inherit", width: "100%" }}
            />
          </div>
          <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }} style={INP}>
            <option value="">Barcha rollar</option>
            <option value="user">Foydalanuvchi</option>
            <option value="blogger">Blogger</option>
            <option value="business">Biznesmen</option>
          </select>
          <button onClick={fetchUsers} disabled={loading} style={{ width: 36, height: 36, border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LuRefreshCw style={{ fontSize: 15, color: "#6b7280", animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{total} ta natija</span>
        </div>

        {/* Table */}
        <div style={CARD}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Foydalanuvchi", "Email", "Rol", "Holat", "Ro'yxat sanasi", "Amallar"].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
                    <LuLoader style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "block", margin: "0 auto 8px" }} />
                    Yuklanmoqda…
                  </td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>Foydalanuvchi topilmadi</td></tr>
                ) : users.map(u => (
                  <tr key={u._id}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Ava user={u} size={34} />
                        <span style={{ fontWeight: 700, color: "#111827" }}>{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td style={{ ...TD, color: "#6b7280", fontSize: 12 }}>{u.email}</td>
                    <td style={TD}><RolePill role={u.role} /></td>
                    <td style={TD}><StatusDot active={u.isActive} /></td>
                    <td style={{ ...TD, fontSize: 12, color: "#9ca3af" }}>{new Date(u.createdAt).toLocaleDateString("uz-UZ")}</td>
                    <td style={TD}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => setSelected(u)}
                          title="Ko'rish"
                          style={{ width: 30, height: 30, borderRadius: 8, background: "#eff6ff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <LuEye style={{ fontSize: 14, color: "#3b82f6" }} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          title="O'chirish"
                          style={{ width: 30, height: 30, borderRadius: 8, background: "#fef2f2", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <LuTrash2 style={{ fontSize: 14, color: "#ef4444" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{(page - 1) * PER + 1}–{Math.min(page * PER, total)} / {total}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: page <= 1 ? "#f9fafb" : "#fff", cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuChevronLeft style={{ fontSize: 14, color: page <= 1 ? "#d1d5db" : "#374151" }} />
                </button>
                <span style={{ padding: "0 10px", height: 30, display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, color: "#374151" }}>{page} / {pages}</span>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: page >= pages ? "#f9fafb" : "#fff", cursor: page >= pages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuChevronRight style={{ fontSize: 14, color: page >= pages ? "#d1d5db" : "#374151" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <ViewModal user={selected} onClose={() => setSelected(null)} onToggle={fetchUsers} />
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>Foydalanuvchini o'chirish</span>
              <button onClick={() => setDeleteTarget(null)} style={{ fontSize: 22, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, padding: "12px 14px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}>
                <Ava user={deleteTarget} size={40} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{deleteTarget.firstName} {deleteTarget.lastName}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{deleteTarget.email}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#374151", marginBottom: 20, lineHeight: 1.6 }}>
                Ushbu foydalanuvchi <b>butunlay o'chiriladi</b>. Bu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setDeleteTarget(null)}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 13, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1 }}
                >
                  {deleting ? "O'chirilmoqda…" : "O'chirish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
