import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuBell, LuCheck, LuCheckCheck, LuMegaphone,
  LuUserCheck, LuBriefcase, LuStar, LuInfo, LuMail,
  LuTrash2,
} from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import SEO from "../components/SEO";
import api from "../services/api";
import { toast } from "../components/ui/toast";

const TYPE_CONFIG = {
  contact_reply: { icon: LuMail,       iconBg: "#fef2f2", iconColor: "#dc2626" },
  campaign:      { icon: LuBriefcase,  iconBg: "#dbeafe", iconColor: "#1d4ed8" },
  ad_approved:   { icon: LuMegaphone,  iconBg: "#dcfce7", iconColor: "#15803d" },
  ad_rejected:   { icon: LuMegaphone,  iconBg: "#fff7ed", iconColor: "#c2410c" },
  review:        { icon: LuStar,       iconBg: "#fef9c3", iconColor: "#92400e" },
  verify:        { icon: LuUserCheck,  iconBg: "#ede9fe", iconColor: "#6d28d9" },
  info:          { icon: LuInfo,       iconBg: "#f0f9ff", iconColor: "#0369a1" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Hozirgina";
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d} kun oldin`;
  return new Date(dateStr).toLocaleDateString("uz-UZ", { day: "2-digit", month: "long" });
}

export default function Notifications() {
  const { token } = useAuthStore();
  const { decrement: decrementStore, clearAll: clearAllStore } = useNotificationStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
    } catch {
      toast.error("Bildirishnomalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, [token, navigate, fetchNotifications]);

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    decrementStore();
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: false } : n));
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    clearAllStore();
    try {
      await api.patch("/notifications/read-all");
    } catch {
      toast.error("Xatolik yuz berdi");
      fetchNotifications();
    }
  };

  const deleteNotification = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n._id !== id));
    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 80, borderRadius: 14, background: "#f1f5f9",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", maxWidth: 700, margin: "0 auto", padding: "0 20px 60px" }}>
      <SEO title="Bildirishnomalar" noindex />
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
            <LuBell size={22} style={{ color: "#dc2626" }} />
            Bildirishnomalar
            {unreadCount > 0 && (
              <span style={{
                background: "#dc2626", color: "#fff",
                fontSize: 12, fontWeight: 700, padding: "2px 8px",
                borderRadius: 20, minWidth: 22, textAlign: "center",
              }}>{unreadCount}</span>
            )}
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Barcha yangiliklar shu yerda</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", border: "1.5px solid #e2e8f0",
            borderRadius: 10, background: "#fff", color: "#374151",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <LuCheckCheck size={14} /> Barchasini o'qildi
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{
        display: "flex", background: "#f8fafc",
        borderRadius: 10, padding: 3, marginBottom: 20,
        border: "1px solid #f1f5f9", width: "fit-content",
      }}>
        {[
          { id: "all",    label: `Hammasi (${notifications.length})` },
          { id: "unread", label: `O'qilmagan (${unreadCount})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: "7px 18px", borderRadius: 8, border: "none",
            background: filter === f.id ? "#fff" : "transparent",
            color:      filter === f.id ? "#dc2626" : "#94a3b8",
            fontWeight: filter === f.id ? 700 : 500,
            fontSize: 13, cursor: "pointer",
            boxShadow: filter === f.id ? "0 1px 6px rgba(0,0,0,.07)" : "none",
            fontFamily: "inherit",
          }}>{f.label}</button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🔔</div>
          <p style={{ fontSize: 16, color: "#94a3b8" }}>
            {filter === "unread" ? "O'qilmagan bildirishnoma yo'q" : "Hozircha bildirishnoma yo'q"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            const IconComp = cfg.icon;
            return (
              <Link
                key={n._id}
                to={n.link || "/notifications"}
                onClick={() => !n.read && markRead(n._id)}
                style={{
                  display: "flex", gap: 14, padding: "16px 18px",
                  background: n.read ? "#fff" : "#fef2f2",
                  border: `1.5px solid ${n.read ? "#e2e8f0" : "#fecaca"}`,
                  borderRadius: 14, textDecoration: "none",
                  transition: "box-shadow .2s, transform .2s",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.08)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: cfg.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconComp size={18} style={{ color: cfg.iconColor }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: n.read ? 600 : 700, color: "#0f172a" }}>
                    {n.title}
                  </p>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>
                    {n.body}
                  </p>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{timeAgo(n.createdAt)}</span>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#dc2626", flexShrink: 0, alignSelf: "center",
                  }} />
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignSelf: "center" }}>
                  {!n.read && (
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); markRead(n._id); }}
                      title="O'qildi deb belgilash"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#94a3b8", padding: 4, borderRadius: 6,
                        display: "flex", alignItems: "center",
                      }}
                    >
                      <LuCheck size={13} />
                    </button>
                  )}
                  <button
                    onClick={(e) => deleteNotification(n._id, e)}
                    title="O'chirish"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#cbd5e1", padding: 4, borderRadius: 6,
                      display: "flex", alignItems: "center",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={e => e.currentTarget.style.color = "#cbd5e1"}
                  >
                    <LuTrash2 size={13} />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
