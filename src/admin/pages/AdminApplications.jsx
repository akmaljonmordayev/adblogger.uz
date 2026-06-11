import { useState, useMemo } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import api from "../../services/api";
import { toast } from "../../components/ui/toast";
import { useAdminSocket } from "../../hooks/useSocket";
import {
  LuRefreshCw, LuLoader, LuCheck, LuX, LuClock,
  LuChevronLeft, LuChevronRight, LuSearch, LuTrash2,
} from "react-icons/lu";

const STATUS_TABS = [
  { key: "pending",       label: "Kutilayotgan",      color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  { key: "approved",      label: "Tasdiqlangan",       color: "#166534", bg: "#f0fdf4", border: "#bbf7d0" },
  { key: "profile_review", label: "Profil ko'rib chiqish", color: "#5b21b6", bg: "#f5f3ff", border: "#ddd6fe" },
  { key: "rejected",      label: "Rad etilgan",        color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
];

const ROLE_LABELS = { user: "Foydalanuvchi", blogger: "Blogger", business: "Biznesmen" };
const AVATAR_COLORS = ["#6366f1","#f43f5e","#f97316","#10b981","#8b5cf6","#0ea5e9","#ec4899","#14b8a6"];

function avaColor(u) {
  const code = (u?.email || "?").charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function Ava({ user, size = 36 }) {
  const c = avaColor(user);
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "?";
  if (user?.avatar) return (
    <img src={user.avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: c + "22", border: `1.5px solid ${c}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800, color: c,
    }}>{initials}</div>
  );
}

function RejectModal({ user, onConfirm, onClose, title = "Arizani rad etish", confirmLabel = "Rad etish" }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(user._id, reason);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 440, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>{title}</span>
          <button onClick={onClose} style={{ fontSize: 22, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, padding: "12px 14px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}>
            <Ava user={user} size={40} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{user.email}</div>
            </div>
          </div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Rad etish sababi (ixtiyoriy)
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Masalan: Noto'g'ri ma'lumotlar kiritilgan, yoki shunchaki bo'sh qoldiring..."
            rows={3}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Bekor qilish
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Rad etilmoqda…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ user, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(user._id); }
    finally { setLoading(false); }
  };
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>Foydalanuvchini o'chirish</span>
          <button onClick={onClose} style={{ fontSize: 22, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, padding: "12px 14px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}>
            <Ava user={user} size={40} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{user.firstName} {user.lastName}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{user.email}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#374151", margin: "0 0 18px", lineHeight: 1.6 }}>
            Ushbu foydalanuvchi <strong>butunlay o'chirib tashlanadi</strong>. Bu amalni ortga qaytarib bo'lmaydi.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Bekor qilish
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "O'chirilmoqda…" : "O'chirish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PER = 15;

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectProfileTarget, setRejectProfileTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [liveSteps, setLiveSteps] = useState({}); // { userId: step } — real-time tracking
  const [profileReviewCount, setProfileReviewCount] = useState(0);

  const { data: appsData, isLoading: loading, refetch: fetchApplications } = useQuery({
    queryKey: ["admin-applications", activeTab, page],
    queryFn: async () => {
      const res = await api.get("/admin/applications", { params: { status: activeTab, page, limit: PER } });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["admin-pending-count"],
    queryFn: async () => {
      const res = await api.get("/admin/applications", { params: { status: "pending", limit: 1 } });
      return res.data.pagination?.total || 0;
    },
    staleTime: 2 * 60 * 1000,
  });

  const { data: profileReviewCountFetched = 0 } = useQuery({
    queryKey: ["admin-profile-review-count"],
    queryFn: async () => {
      const res = await api.get("/admin/applications", { params: { status: "profile_review", limit: 1 } });
      return res.data.pagination?.total || 0;
    },
    staleTime: 2 * 60 * 1000,
    onSuccess: (data) => setProfileReviewCount(data),
  });

  const allApplications = appsData?.data || [];
  const total = appsData?.pagination?.total || allApplications.length;

  const applications = useMemo(() => {
    if (!search.trim()) return allApplications;
    const q = search.toLowerCase();
    return allApplications.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }, [allApplications, search]);

  // Real-time: new applications + onboarding step updates + profile review
  useAdminSocket({
    new_application: () => {
      queryClient.setQueryData(["admin-pending-count"], c => (c || 0) + 1);
      if (activeTab === "pending") {
        queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      }
    },
    user_onboarding_step: ({ userId, step, name }) => {
      setLiveSteps(prev => ({ ...prev, [userId]: step }));
      const stepLabel = step === 2 ? "Profil to'ldirmoqda" : step === 3 ? "Profil ko'rib chiqilmoqda ⏳" : "Profil to'ldirildi ✅";
      toast.success(`${name}: ${stepLabel}`, { duration: 4000 });
    },
    new_profile_review: ({ userId, name, role }) => {
      setProfileReviewCount(c => (c || 0) + 1);
      queryClient.invalidateQueries({ queryKey: ["admin-profile-review-count"] });
      toast.success(`${name} profili ko'rib chiqilishi kerak`, { duration: 4000 });
      if (activeTab === "profile_review") {
        queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      }
    },
  });

  const handleApprove = async (userId) => {
    setActionLoading(userId + "_approve");
    try {
      await api.patch(`/admin/applications/${userId}/approve`);
      toast.success("Ariza tasdiqlandi! Foydalanuvchi tizimga kirdi.");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      if (activeTab === "pending") queryClient.setQueryData(["admin-pending-count"], c => Math.max(0, (c || 0) - 1));
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId, reason) => {
    try {
      await api.patch(`/admin/applications/${userId}/reject`, { reason });
      toast.success("Ariza rad etildi.");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      if (activeTab === "pending") queryClient.setQueryData(["admin-pending-count"], c => Math.max(0, (c || 0) - 1));
      setRejectTarget(null);
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleApproveProfile = async (userId) => {
    setActionLoading(userId + "_approve_profile");
    try {
      await api.patch(`/admin/applications/${userId}/approve-profile`);
      toast.success("Profil tasdiqlandi!");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profile-review-count"] });
      setProfileReviewCount(c => Math.max(0, (c || 0) - 1));
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectProfile = async (userId, reason) => {
    try {
      await api.patch(`/admin/applications/${userId}/reject-profile`, { reason });
      toast.success("Profil rad etildi.");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profile-review-count"] });
      setProfileReviewCount(c => Math.max(0, (c || 0) - 1));
      setRejectProfileTarget(null);
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("Foydalanuvchi o'chirildi.");
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      setDeleteTarget(null);
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
  };

  const pages = Math.ceil(total / PER) || 1;

  const BASE = { minHeight: "100vh", padding: "28px 32px", fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#f4f6fb" };
  const CARD = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14 };
  const INP  = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 9, height: 36, padding: "0 12px", fontSize: 13, color: "#111827", fontFamily: "inherit", outline: "none" };
  const TH   = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap" };
  const TD   = { padding: "11px 14px", borderBottom: "1px solid #f9fafb", verticalAlign: "middle" };

  // Determine the count badge for profile_review tab
  const displayProfileReviewCount = profileReviewCount || profileReviewCountFetched || 0;

  return (
    <div style={BASE}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Ro'yxatdan o'tish arizalari</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>Yangi foydalanuvchilar arizalarini ko'rib chiqing va tasdiqlang</div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "#fff", borderRadius: 12, padding: 5, border: "1px solid #e5e7eb", width: "fit-content", flexWrap: "wrap" }}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              style={{
                padding: "7px 16px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: activeTab === tab.key ? tab.bg : "transparent",
                color: activeTab === tab.key ? tab.color : "#9ca3af",
                transition: "all .15s",
                display: "flex", alignItems: "center", gap: 7,
              }}
            >
              {tab.label}
              {tab.key === "pending" && pendingCount > 0 && (
                <span style={{
                  background: "#ef4444", color: "#fff", borderRadius: 99,
                  fontSize: 10, fontWeight: 800, padding: "1px 6px", minWidth: 18, textAlign: "center",
                }}>
                  {pendingCount}
                </span>
              )}
              {tab.key === "profile_review" && displayProfileReviewCount > 0 && (
                <span style={{
                  background: "#7c3aed", color: "#fff", borderRadius: 99,
                  fontSize: 10, fontWeight: 800, padding: "1px 6px", minWidth: 18, textAlign: "center",
                }}>
                  {displayProfileReviewCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ ...INP, display: "flex", alignItems: "center", gap: 8, width: 240, padding: "0 12px" }}>
            <LuSearch style={{ color: "#9ca3af", fontSize: 15, flexShrink: 0 }} />
            <input
              placeholder="Ism, email bo'yicha..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ background: "none", border: "none", outline: "none", color: "#111827", fontSize: 13, fontFamily: "inherit", width: "100%" }}
            />
          </div>
          <button
            onClick={fetchApplications}
            disabled={loading}
            style={{ width: 36, height: 36, border: "1px solid #e5e7eb", borderRadius: 9, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <LuRefreshCw style={{ fontSize: 15, color: "#6b7280", animation: loading ? "spin 1s linear infinite" : "none" }} />
          </button>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{total} ta ariza</span>
        </div>

        {/* Table */}
        <div style={CARD}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Foydalanuvchi", "Email", "Telefon", "Rol", "Ariza sanasi",
                    ...(activeTab === "rejected" ? ["Sabab"] : []),
                    ...(activeTab === "approved" ? ["Onboarding", "Amallar"] : []),
                    ...(activeTab === "profile_review" ? ["Profil holati", "Amallar"] : []),
                    ...(activeTab === "pending" ? ["Amallar"] : [])
                  ].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 48, color: "#6b7280" }}>
                    <LuLoader style={{ fontSize: 28, animation: "spin 1s linear infinite", display: "block", margin: "0 auto 10px" }} />
                    Yuklanmoqda…
                  </td></tr>
                ) : applications.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 56, color: "#9ca3af" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>
                      {activeTab === "pending" ? "⏳" : activeTab === "approved" ? "✅" : activeTab === "profile_review" ? "🔍" : "❌"}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#374151", marginBottom: 4 }}>
                      {activeTab === "pending" ? "Kutilayotgan ariza yo'q"
                        : activeTab === "approved" ? "Tasdiqlangan ariza yo'q"
                        : activeTab === "profile_review" ? "Ko'rib chiqilayotgan profil yo'q"
                        : "Rad etilgan ariza yo'q"}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      {activeTab === "pending" ? "Yangi arizalar kelganda bu yerda ko'rinadi" : ""}
                      {activeTab === "profile_review" ? "Foydalanuvchilar profilini to'ldirganda bu yerda ko'rinadi" : ""}
                    </div>
                  </td></tr>
                ) : applications.map(u => (
                  <tr
                    key={u._id}
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
                    <td style={{ ...TD, color: "#6b7280", fontSize: 12 }}>{u.phone || "—"}</td>
                    <td style={TD}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                        background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe",
                      }}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td style={{ ...TD, fontSize: 12, color: "#9ca3af" }}>
                      {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                      <div style={{ fontSize: 11, color: "#c4c4c4" }}>
                        {new Date(u.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    {/* Rejection reason column */}
                    {activeTab === "rejected" && (
                      <td style={{ ...TD, fontSize: 12, color: "#6b7280", maxWidth: 220 }}>
                        {u.rejectionReason || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>Ko'rsatilmagan</span>}
                      </td>
                    )}

                    {/* Onboarding step column (approved tab) */}
                    {activeTab === "approved" && (() => {
                      const step = liveSteps[String(u._id)] ?? u.onboardingStep ?? 2;
                      const cfg = step >= 4
                        ? { label: "Faol", bg: "#f0fdf4", color: "#166534", dot: "#22c55e" }
                        : step === 3
                        ? { label: "Profil ko'rib chiqilmoqda", bg: "#f5f3ff", color: "#5b21b6", dot: "#7c3aed", pulse: true }
                        : { label: "Profil kutilmoqda", bg: "#fffbeb", color: "#92400e", dot: "#f59e0b", pulse: true };
                      return (
                        <>
                          <td style={TD}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:8, background:cfg.bg, width:"fit-content" }}>
                              <span style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot, flexShrink:0, animation: cfg.pulse ? "pulse 2s infinite" : "none" }} />
                              <span style={{ fontSize:11, fontWeight:700, color:cfg.color, whiteSpace:"nowrap" }}>{cfg.label}</span>
                            </div>
                          </td>
                          <td style={TD}>
                            <button
                              onClick={() => setDeleteTarget(u)}
                              title="O'chirish"
                              style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                                background: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: 12,
                              }}
                            >
                              <LuTrash2 style={{ fontSize: 13 }} />
                              O'chirish
                            </button>
                          </td>
                        </>
                      );
                    })()}

                    {/* Profile review status + actions */}
                    {activeTab === "profile_review" && (
                      <>
                        <td style={TD}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:8, background:"#f5f3ff", width:"fit-content" }}>
                            <span style={{ width:7, height:7, borderRadius:"50%", background:"#7c3aed", flexShrink:0, animation:"pulse 2s infinite" }} />
                            <span style={{ fontSize:11, fontWeight:700, color:"#5b21b6", whiteSpace:"nowrap" }}>Ko'rib chiqilmoqda</span>
                          </div>
                        </td>
                        <td style={TD}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {/* Approve Profile */}
                            <button
                              onClick={() => handleApproveProfile(u._id)}
                              disabled={actionLoading === u._id + "_approve_profile"}
                              title="Profilni tasdiqlash"
                              style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                                background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: 12,
                                opacity: actionLoading === u._id + "_approve_profile" ? 0.6 : 1,
                              }}
                            >
                              {actionLoading === u._id + "_approve_profile" ? (
                                <LuLoader style={{ fontSize: 13, animation: "spin 1s linear infinite" }} />
                              ) : (
                                <LuCheck style={{ fontSize: 13 }} />
                              )}
                              Tasdiqlash
                            </button>

                            {/* Reject Profile */}
                            <button
                              onClick={() => setRejectProfileTarget(u)}
                              title="Profilni rad etish"
                              style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                                background: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: 12,
                              }}
                            >
                              <LuX style={{ fontSize: 13 }} />
                              Rad etish
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                    {/* Actions for pending */}
                    {activeTab === "pending" && (
                      <td style={TD}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {/* Approve */}
                          <button
                            onClick={() => handleApprove(u._id)}
                            disabled={actionLoading === u._id + "_approve"}
                            title="Tasdiqlash"
                            style={{
                              display: "flex", alignItems: "center", gap: 5,
                              padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                              background: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: 12,
                              opacity: actionLoading === u._id + "_approve" ? 0.6 : 1,
                            }}
                          >
                            {actionLoading === u._id + "_approve" ? (
                              <LuLoader style={{ fontSize: 13, animation: "spin 1s linear infinite" }} />
                            ) : (
                              <LuCheck style={{ fontSize: 13 }} />
                            )}
                            Tasdiqlash
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => setRejectTarget(u)}
                            title="Rad etish"
                            style={{
                              display: "flex", alignItems: "center", gap: 5,
                              padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                              background: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: 12,
                            }}
                          >
                            <LuX style={{ fontSize: 13 }} />
                            Rad etish
                          </button>
                        </div>
                      </td>
                    )}
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
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: page <= 1 ? "#f9fafb" : "#fff", cursor: page <= 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuChevronLeft style={{ fontSize: 14, color: page <= 1 ? "#d1d5db" : "#374151" }} />
                </button>
                <span style={{ padding: "0 10px", height: 30, display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, color: "#374151" }}>{page} / {pages}</span>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: page >= pages ? "#f9fafb" : "#fff", cursor: page >= pages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LuChevronRight style={{ fontSize: 14, color: page >= pages ? "#d1d5db" : "#374151" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Reject Modal */}
      {rejectTarget && (
        <RejectModal
          user={rejectTarget}
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
          title="Arizani rad etish"
          confirmLabel="Rad etish"
        />
      )}

      {/* Profile Reject Modal */}
      {rejectProfileTarget && (
        <RejectModal
          user={rejectProfileTarget}
          onConfirm={handleRejectProfile}
          onClose={() => setRejectProfileTarget(null)}
          title="Profilni rad etish"
          confirmLabel="Profilni rad etish"
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onConfirm={handleDeleteUser}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
      `}</style>
    </div>
  );
}
