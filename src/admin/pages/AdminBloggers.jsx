import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "../../components/ui/toast";
import { adminBloggersService } from "../../services/adminService";
import {
  LuSearch, LuRefreshCw, LuEye, LuLoader,
  LuChevronLeft, LuChevronRight,
} from "react-icons/lu";
import { FiInstagram, FiYoutube, FiTv } from "react-icons/fi";
import { BsTiktok } from "react-icons/bs";

const STATUS_META = {
  true:  { bg: "#dcfce7", c: "#166534", bd: "#86efac", label: "Tasdiqlangan" },
  false: { bg: "#fef9c3", c: "#854d0e", bd: "#fde68a", label: "Kutilmoqda" },
};

const PLT_ICON = { instagram: FiInstagram, youtube: FiYoutube, tiktok: BsTiktok, telegram: FiTv };
const PLT_COLOR = { instagram: "#e1306c", youtube: "#ff0000", tiktok: "#69c9d0", telegram: "#229ed9" };

const PER = 10;

function ini(u) {
  if (!u) return "?";
  return `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() || "?";
}

function Ava({ user, size = 40 }) {
  const colors = ["#6366f1","#f43f5e","#f97316","#10b981","#8b5cf6","#0ea5e9"];
  const color = colors[((user?.firstName || "?").charCodeAt(0)) % colors.length];
  if (user?.avatar) return (
    <img src={user.avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: color + "22", border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800, color,
    }}>{ini(user)}</div>
  );
}

function Pill({ verified }) {
  const m = STATUS_META[verified];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: m.bg, color: m.c, border: `1px solid ${m.bd}`,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.c, flexShrink: 0 }} />
      {m.label}
    </span>
  );
}

function ViewModal({ blogger, onClose, onVerify }) {
  const u = blogger?.user;
  const [saving, setSaving] = useState(false);

  const toggleVerify = async () => {
    setSaving(true);
    try {
      await adminBloggersService.verify(blogger._id, !blogger.isVerified);
      toast.success(blogger.isVerified ? "Tasdiq bekor qilindi" : "Blogger tasdiqlandi");
      onVerify();
      onClose();
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  if (!blogger) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>Blogger ma'lumotlari</span>
          <button onClick={onClose} style={{ fontSize: 22, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <Ava user={u} size={56} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
                {u ? `${u.firstName} ${u.lastName}` : "—"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{u?.email || "—"}</div>
              <div style={{ marginTop: 6 }}><Pill verified={blogger.isVerified} /></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              ["Handle", blogger.handle || "—"],
              ["Followers", blogger.followers?.toLocaleString() || "—"],
              ["Engagement", blogger.engagementRate ? `${blogger.engagementRate}%` : "—"],
              ["Joylashuv", blogger.location || "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 14px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{v}</div>
              </div>
            ))}
          </div>
          <button
            onClick={toggleVerify}
            disabled={saving}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 12, border: "none", cursor: saving ? "not-allowed" : "pointer",
              background: blogger.isVerified ? "#fee2e2" : "#dcfce7",
              color: blogger.isVerified ? "#991b1b" : "#166534",
              fontWeight: 800, fontSize: 14,
            }}
          >
            {saving ? "Saqlanmoqda…" : blogger.isVerified ? "Tasdiqni bekor qilish" : "Tasdiqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBloggers() {
  const [bloggers, setBloggers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchBloggers = useCallback(async () => {
    setLoading(true);
    try {
      // Hammasini olib kelamiz — frontend da filter qilamiz
      const res = await adminBloggersService.getAll({ page: 1, limit: 9999 });
      setBloggers(res.data || []);
      setTotal(res.total || 0);
    } catch {
      toast.error("Bloggerlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBloggers(); }, [fetchBloggers]);

  // Frontend qidiruv
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bloggers;
    return bloggers.filter(b =>
      b.handle?.toLowerCase().includes(q) ||
      b.user?.firstName?.toLowerCase().includes(q) ||
      b.user?.lastName?.toLowerCase().includes(q) ||
      b.user?.email?.toLowerCase().includes(q) ||
      `${b.user?.firstName ?? ""} ${b.user?.lastName ?? ""}`.toLowerCase().includes(q)
    );
  }, [bloggers, search]);

  const pages = Math.ceil(filtered.length / PER) || 1;
  const pageData = filtered.slice((page - 1) * PER, page * PER);

  const stats = {
    total: bloggers.length,
    verified: bloggers.filter(b => b.isVerified).length,
    pending: bloggers.filter(b => !b.isVerified).length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", padding: "28px 32px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>Bloggerlar</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Jami: {bloggers.length} ta blogger</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { l: "Jami", v: stats.total, c: "#111827" },
            { l: "Tasdiqlangan", v: stats.verified, c: "#166534" },
            { l: "Kutilmoqda", v: stats.pending, c: "#854d0e" },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: c, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Search & refresh */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <LuSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 16 }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Handle, ism, email bo'yicha qidirish…"
              style={{ width: "100%", paddingLeft: 38, paddingRight: 14, height: 40, border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13, color: "#111827", background: "#fff", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button onClick={fetchBloggers} disabled={loading} style={{ width: 40, height: 40, border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LuRefreshCw style={{ fontSize: 16, color: "#6b7280", animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                  {["#", "Blogger", "Handle", "Followers", "Platformalar", "Holat", "Amallar"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
                    <LuLoader style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "block", margin: "0 auto 8px" }} />
                    Yuklanmoqda…
                  </td></tr>
                ) : pageData.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>Blogger topilmadi</td></tr>
                ) : pageData.map((b, index) => (
                  <tr key={b._id} style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Tartib raqam */}
                    <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>
                      {(page - 1) * PER + index + 1}
                    </td>

                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Ava user={b.user} size={36} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                            {b.user ? `${b.user.firstName} ${b.user.lastName}` : "—"}
                          </div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{b.user?.email || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "#374151", fontWeight: 600 }}>{b.handle || "—"}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "#111827" }}>
                      {b.followers ? b.followers.toLocaleString() : "—"}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {(b.platforms || []).slice(0, 3).map(p => {
                          const Icon = PLT_ICON[p.toLowerCase()] || FiTv;
                          const color = PLT_COLOR[p.toLowerCase()] || "#6b7280";
                          return (
                            <span key={p} style={{ width: 24, height: 24, borderRadius: 6, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon style={{ fontSize: 12, color }} />
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px" }}><Pill verified={b.isVerified} /></td>
                    <td style={{ padding: "11px 14px" }}>
                      <button
                        onClick={() => setSelected(b)}
                        style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Ko'rish / Tasdiqlash"
                      >
                        <LuEye style={{ fontSize: 15, color: "#3b82f6" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{(page - 1) * PER + 1}–{Math.min(page * PER, filtered.length)} / {filtered.length}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: page <= 1 ? "#f9fafb" : "#fff", cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuChevronLeft style={{ fontSize: 15, color: page <= 1 ? "#d1d5db" : "#374151" }} />
                </button>
                <span style={{ padding: "0 12px", height: 32, display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, color: "#374151" }}>{page} / {pages}</span>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: page >= pages ? "#f9fafb" : "#fff", cursor: page >= pages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuChevronRight style={{ fontSize: 15, color: page >= pages ? "#d1d5db" : "#374151" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <ViewModal blogger={selected} onClose={() => setSelected(null)} onVerify={fetchBloggers} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}