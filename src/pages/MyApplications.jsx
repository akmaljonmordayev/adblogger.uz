import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuArrowLeft, LuSend, LuLoader, LuInbox, LuSendHorizonal,
  LuMessageCircle, LuUser, LuCheck, LuCheckCheck, LuX,
  LuBuilding2, LuUsers, LuChevronLeft, LuRefreshCw,
  LuBell, LuClock,
} from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "../components/ui/toast";
import applicationService from "../services/applicationService";
import { getSocket, connectSocket } from "../utils/socket";

/* ─── helpers ─────────────────────────────────────────────────── */
function timeAgo(date) {
  if (!date) return "";
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)     return "hozir";
  if (diff < 3600)   return `${Math.floor(diff / 60)} daq`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} soat`;
  return new Date(date).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
}
function fmtTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}
function initials(u) {
  if (!u) return "?";
  return ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")).toUpperCase() || "?";
}
function adTitle(app, mode) {
  const ad = app.ad;
  if (!ad) return "E'lon";
  return ad.title || ad.companyName || ad.productName || "E'lon";
}
function otherUser(app, myId) {
  if (String(app.adOwner?._id || app.adOwner) === myId) return app.applicant;
  return app.adOwner;
}

const STATUS_LABELS = {
  pending:  { label: "Yangi",         color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  read:     { label: "Ko'rilgan",     color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  accepted: { label: "Qabul qilindi", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  rejected: { label: "Rad etildi",    color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

/* ─── Avatar ────────────────────────────────────────────────────── */
function Avatar({ user, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "#fef2f2", border: "2px solid #fecaca",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: "#dc2626", overflow: "hidden",
    }}>
      {user?.avatar
        ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initials(user)
      }
    </div>
  );
}

/* ─── ApplicationRow ────────────────────────────────────────────── */
function ApplicationRow({ app, myId, isActive, onClick }) {
  const other    = otherUser(app, myId);
  const isOwner  = String(app.adOwner?._id || app.adOwner) === myId;
  const unread   = isOwner ? (app.ownerUnread || 0) : (app.applicantUnread || 0);
  const st       = STATUS_LABELS[app.status] || STATUS_LABELS.read;

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "13px 16px", cursor: "pointer",
        background: isActive ? "#fef2f2" : "transparent",
        borderLeft: isActive ? "3px solid #dc2626" : "3px solid transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f9fafb"; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <Avatar user={other} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {other?.firstName} {other?.lastName}
          </span>
          <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0, marginLeft: 6 }}>
            {timeAgo(app.lastMessageAt || app.updatedAt)}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 3 }}>
          {adTitle(app)} · {isOwner ? "Kelgan" : "Yuborgan"}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>
            {app.lastMessage || app.message || "Xabar yo'q"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 6 }}>
            {unread > 0 && (
              <span style={{ minWidth: 18, height: 18, borderRadius: 99, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
            <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, padding: "2px 6px", borderRadius: 6, whiteSpace: "nowrap" }}>
              {st.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ChatPanel ─────────────────────────────────────────────────── */
function ChatPanel({ app, myId, onStatusChange, onBack }) {
  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState("");
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const isOwner   = String(app.adOwner?._id || app.adOwner) === myId;
  const other     = otherUser(app, myId);
  const st        = STATUS_LABELS[app.status] || STATUS_LABELS.read;

  /* Fetch messages */
  const fetchMessages = useCallback(async () => {
    try {
      const res = await applicationService.messages(app._id);
      setMessages(res.data || []);
    } catch {
      toast.error("Xabarlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, [app._id]);

  useEffect(() => {
    setLoading(true);
    fetchMessages();
  }, [fetchMessages]);

  /* Socket.io real-time */
  useEffect(() => {
    const socket = getSocket();
    socket.emit('join_chat_room', app._id);

    const handler = ({ applicationId, message }) => {
      if (String(applicationId) !== String(app._id)) return;
      setMessages(prev => {
        const exists = prev.some(m => m._id === message._id);
        return exists ? prev : [...prev, message];
      });
    };
    socket.on('new_chat_message', handler);

    const statusHandler = ({ applicationId, status }) => {
      if (String(applicationId) === String(app._id)) {
        onStatusChange(app._id, status);
      }
    };
    socket.on('application_status_changed', statusHandler);

    return () => {
      socket.emit('leave_chat_room', app._id);
      socket.off('new_chat_message', handler);
      socket.off('application_status_changed', statusHandler);
    };
  }, [app._id, onStatusChange]);

  /* Scroll to bottom when new messages arrive */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    try {
      const res = await applicationService.send(app._id, trimmed);
      setMessages(prev => {
        const exists = prev.some(m => m._id === res.data._id);
        return exists ? prev : [...prev, res.data];
      });
    } catch {
      setText(trimmed);
      toast.error("Xabar yuborishda xatolik");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleStatus = async (status) => {
    try {
      await applicationService.status(app._id, status);
      onStatusChange(app._id, status);
      toast.success(status === "accepted" ? "Qabul qilindi" : "Rad etildi");
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} className="chat-back-btn" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4 }}>
          <LuChevronLeft size={22} />
        </button>
        <Avatar user={other} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{other?.firstName} {other?.lastName}</div>
          <div style={{ fontSize: 11.5, color: "#6b7280", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {adTitle(app)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: st.color, background: st.bg, border: `1px solid ${st.border}`, padding: "3px 8px", borderRadius: 6 }}>
            {st.label}
          </span>
          {isOwner && app.status !== "accepted" && app.status !== "rejected" && (
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => handleStatus("accepted")} title="Qabul qilish"
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", fontSize: 11.5, fontWeight: 700, borderRadius: 8, border: "1.5px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", cursor: "pointer" }}>
                <LuCheck size={12} /> Qabul
              </button>
              <button onClick={() => handleStatus("rejected")} title="Rad etish"
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", fontSize: 11.5, fontWeight: 700, borderRadius: 8, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}>
                <LuX size={12} /> Rad
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 80 }}>
            <LuLoader size={22} style={{ color: "#dc2626", animation: "spin 1s linear infinite" }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
            <LuMessageCircle size={36} style={{ marginBottom: 10, opacity: 0.4 }} />
            <p style={{ fontSize: 13.5 }}>Hali xabar yo'q</p>
            <p style={{ fontSize: 12 }}>Birinchi xabarni yuboring</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = String(msg.sender?._id || msg.sender) === myId;
            return (
              <div key={msg._id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                {!isMine && (
                  <Avatar user={msg.sender} size={28} />
                )}
                <div style={{
                  maxWidth: "70%", padding: "10px 14px", borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: isMine ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "#f3f4f6",
                  color: isMine ? "#fff" : "#111827",
                  fontSize: 13.5, lineHeight: 1.55, wordBreak: "break-word",
                  marginLeft: !isMine ? 8 : 0,
                }}>
                  {msg.text}
                  <div style={{ fontSize: 10, marginTop: 4, textAlign: "right", opacity: 0.7, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                    {fmtTime(msg.createdAt)}
                    {isMine && (msg.isRead ? <LuCheckCheck size={11} /> : <LuCheck size={11} />)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={e => { setText(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          onKeyDown={handleKey}
          placeholder="Xabar yozing... (Enter — yuborish)"
          style={{
            flex: 1, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13.5,
            outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5, maxHeight: 120,
            background: "#f9fafb", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "#dc2626"}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          style={{
            width: 42, height: 42, borderRadius: 12, border: "none", flexShrink: 0,
            background: text.trim() && !sending ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "#f3f4f6",
            color: text.trim() && !sending ? "#fff" : "#9ca3af",
            cursor: text.trim() && !sending ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s",
          }}
        >
          {sending ? <LuLoader size={15} style={{ animation: "spin 1s linear infinite" }} /> : <LuSend size={15} />}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function MyApplications() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab]         = useState("received"); // 'received' | 'sent'
  const [received, setReceived] = useState([]);
  const [sent, setSent]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null); // selected application
  const [showChat, setShowChat] = useState(false); // mobile: show chat panel

  /* Auth guard */
  useEffect(() => {
    if (!token) { navigate("/login"); }
  }, [token, navigate]);

  /* Connect socket */
  useEffect(() => {
    if (!user?._id) return;
    const s = connectSocket(user._id);

    // Yangi zayavka notification → received listni yangilash
    s.on('new_application', () => {
      loadReceived();
    });
    s.on('new_chat_message', ({ applicationId }) => {
      // last message ni yangilash (silent)
      setReceived(prev => prev.map(a =>
        a._id === applicationId ? { ...a, ownerUnread: (a.ownerUnread || 0) + 1 } : a
      ));
      setSent(prev => prev.map(a =>
        a._id === applicationId ? { ...a, applicantUnread: (a.applicantUnread || 0) + 1 } : a
      ));
    });

    return () => {
      s.off('new_application');
      s.off('new_chat_message');
    };
  }, [user?._id]);

  const loadReceived = useCallback(async () => {
    try {
      const res = await applicationService.received();
      setReceived(res.data || []);
    } catch {}
  }, []);

  const loadSent = useCallback(async () => {
    try {
      const res = await applicationService.sent();
      setSent(res.data || []);
    } catch {}
  }, []);

  /* Initial load */
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([loadReceived(), loadSent()]).finally(() => setLoading(false));
  }, [token, loadReceived, loadSent]);

  const handleSelect = (app) => {
    setSelected(app);
    setShowChat(true);
    // Unread ni nollaymiz (optimistic)
    const myId = user._id;
    const isOwner = String(app.adOwner?._id || app.adOwner) === String(myId);
    if (isOwner) {
      setReceived(prev => prev.map(a => a._id === app._id ? { ...a, ownerUnread: 0, status: a.status === 'pending' ? 'read' : a.status } : a));
    } else {
      setSent(prev => prev.map(a => a._id === app._id ? { ...a, applicantUnread: 0 } : a));
    }
  };

  const handleStatusChange = useCallback((appId, status) => {
    const update = a => a._id === appId ? { ...a, status } : a;
    setReceived(prev => prev.map(update));
    setSent(prev => prev.map(update));
    setSelected(prev => prev?._id === appId ? { ...prev, status } : prev);
  }, []);

  const handleBack = () => setShowChat(false);

  const myId = String(user?._id || "");
  const list = tab === "received" ? received : sent;

  const totalUnread = received.reduce((s, a) => s + (a.ownerUnread || 0), 0)
    + sent.reduce((s, a) => s + (a.applicantUnread || 0), 0);

  if (!token || !user) return null;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @media(max-width:640px) {
          .chat-layout { flex-direction: column !important; }
          .chat-sidebar { display: ${showChat ? "none" : "flex"} !important; width: 100% !important; border-right: none !important; border-bottom: 1px solid #f3f4f6 !important; height: 100% !important; }
          .chat-main { display: ${showChat ? "flex" : "none"} !important; width: 100% !important; }
          .chat-back-btn { display: flex !important; }
        }
      `}</style>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef2f2", border: "1.5px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LuMessageCircle size={18} style={{ color: "#dc2626" }} />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>
            Mening Zayavkalarim
            {totalUnread > 0 && (
              <span style={{ marginLeft: 8, minWidth: 22, height: 22, borderRadius: 99, background: "#dc2626", color: "#fff", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>
                {totalUnread}
              </span>
            )}
          </h1>
          <p style={{ fontSize: 12.5, color: "#9ca3af", margin: 0 }}>E'lonlarga yuborilgan va kelgan zayavkalar</p>
        </div>
        <button onClick={() => { loadReceived(); loadSent(); }} title="Yangilash"
          style={{ marginLeft: "auto", width: 34, height: 34, border: "1.5px solid #e5e7eb", borderRadius: 9, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
          <LuRefreshCw size={14} />
        </button>
      </div>

      {/* Layout */}
      <div className="chat-layout" style={{ flex: 1, display: "flex", background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 16, overflow: "hidden", minHeight: 0 }}>

        {/* Sidebar */}
        <div className="chat-sidebar" style={{ width: 340, borderRight: "1px solid #f3f4f6", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
            {[
              { key: "received", label: "Kelgan",  Icon: LuInbox,         count: received.reduce((s,a) => s+(a.ownerUnread||0),0) },
              { key: "sent",     label: "Yuborgan", Icon: LuSendHorizonal, count: sent.reduce((s,a) => s+(a.applicantUnread||0),0) },
            ].map(({ key, label, Icon, count }) => (
              <button key={key} onClick={() => setTab(key)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "13px 8px", border: "none", background: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: tab === key ? 700 : 500,
                  color: tab === key ? "#dc2626" : "#6b7280",
                  borderBottom: tab === key ? "2px solid #dc2626" : "2px solid transparent",
                  transition: "color 0.15s",
                }}>
                <Icon size={14} />
                {label}
                {count > 0 && (
                  <span style={{ minWidth: 18, height: 18, borderRadius: 99, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                    {count}
                  </span>
                )}
                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
                  ({tab === "received" ? received.length : sent.length})
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <LuLoader size={24} style={{ color: "#dc2626", animation: "spin 1s linear infinite" }} />
              </div>
            ) : list.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{tab === "received" ? "📥" : "📤"}</div>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>
                  {tab === "received" ? "Kelgan zayavka yo'q" : "Yuborgan zayavka yo'q"}
                </p>
                <p style={{ fontSize: 12, margin: 0 }}>
                  {tab === "received"
                    ? "E'lonlaringizga zayavka kelganida bu yerda ko'rasiz"
                    : <><Link to="/ads" style={{ color: "#dc2626" }}>E'lonlar</Link> sahifasiga o'ting va zayavka yuboring</>
                  }
                </p>
              </div>
            ) : (
              list.map(app => (
                <ApplicationRow
                  key={app._id}
                  app={app}
                  myId={myId}
                  isActive={selected?._id === app._id}
                  onClick={() => handleSelect(app)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat main area */}
        <div className="chat-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {selected ? (
            <ChatPanel
              key={selected._id}
              app={selected}
              myId={myId}
              onStatusChange={handleStatusChange}
              onBack={handleBack}
            />
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", padding: 40 }}>
              <LuMessageCircle size={52} style={{ marginBottom: 14, opacity: 0.25 }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 6px" }}>Chat tanlang</p>
              <p style={{ fontSize: 13, margin: 0, textAlign: "center" }}>
                Chap tarafdan zayavkani tanlab muloqot boshlang
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
