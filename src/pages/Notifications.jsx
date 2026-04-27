import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LuBell, LuCheck, LuCheckCheck, LuMegaphone,
  LuUserCheck, LuBriefcase, LuStar, LuInfo,
} from "react-icons/lu";

// Mock notifications — backendga ulaganda api.get("/notifications") bilan almashtiriladi
const MOCK = [
  {
    _id: "1", type: "campaign", read: false,
    title: "Yangi kampaniya taklifi",
    body: "TechShop UZ sizga kampaniya taklifi yubordi",
    link: "/profile?tab=campaigns",
    time: "5 daqiqa oldin",
    icon: LuBriefcase, iconBg: "#dbeafe", iconColor: "#1d4ed8",
  },
  {
    _id: "2", type: "ad_approved", read: false,
    title: "E'loningiz tasdiqlandi",
    body: "\"Instagram post reklamasi\" e'loni admin tomonidan tasdiqlandi",
    link: "/profile?tab=my-ads",
    time: "2 soat oldin",
    icon: LuMegaphone, iconBg: "#dcfce7", iconColor: "#15803d",
  },
  {
    _id: "3", type: "review", read: true,
    title: "Yangi sharh",
    body: "Sardor Aliyev profilingizga 5 yulduz sharh qoldirdi",
    link: "/profile",
    time: "1 kun oldin",
    icon: LuStar, iconBg: "#fef9c3", iconColor: "#92400e",
  },
  {
    _id: "4", type: "verify", read: true,
    title: "Profil tasdiqlandi",
    body: "Blogger profilingiz muvaffaqiyatli tasdiqlandi",
    link: "/profile",
    time: "3 kun oldin",
    icon: LuUserCheck, iconBg: "#ede9fe", iconColor: "#6d28d9",
  },
  {
    _id: "5", type: "info", read: true,
    title: "Yangi funksiyalar qo'shildi",
    body: "ADBlogger platformasida kampaniya boshqaruvi yangilandi",
    link: "/",
    time: "1 hafta oldin",
    icon: LuInfo, iconBg: "#f0f9ff", iconColor: "#0369a1",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", maxWidth: 700, margin: "0 auto", padding: "0 20px 60px" }}>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24,
      }}>
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

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🔔</div>
          <p style={{ fontSize: 16, color: "#94a3b8" }}>Hozircha bildirishnoma yo'q</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(n => {
            const IconComp = n.icon;
            return (
              <Link
                key={n._id}
                to={n.link}
                onClick={() => markRead(n._id)}
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
                  background: n.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconComp size={18} style={{ color: n.iconColor }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: "0 0 3px", fontSize: 14, fontWeight: n.read ? 600 : 700,
                    color: "#0f172a",
                  }}>{n.title}</p>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#64748b", lineHeight: 1.4 }}>{n.body}</p>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{n.time}</span>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#dc2626", flexShrink: 0,
                    alignSelf: "center",
                  }} />
                )}

                {/* Mark read button */}
                {!n.read && (
                  <button
                    onClick={e => { e.preventDefault(); markRead(n._id); }}
                    style={{
                      position: "absolute", top: 10, right: 12,
                      background: "none", border: "none", cursor: "pointer",
                      color: "#94a3b8", padding: 4, borderRadius: 6,
                      display: "flex", alignItems: "center",
                    }}
                    title="O'qildi deb belgilash"
                  >
                    <LuCheck size={13} />
                  </button>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
