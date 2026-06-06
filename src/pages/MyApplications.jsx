import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LuSend, LuLoader, LuInbox, LuSendHorizontal,
  LuMessageCircle, LuCheck, LuCheckCheck, LuX,
  LuChevronLeft, LuRefreshCw, LuSmile, LuPencil,
  LuTrash2, LuBan, LuBriefcase, LuSearch,
  LuPhone, LuUser, LuFileText, LuLock, LuCircleCheck, LuCircleX,
  LuHandshake, LuDollarSign, LuCalendar, LuPackage,
} from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "../components/ui/toast";
import applicationService from "../services/applicationService";
import orderService from "../services/orderService";
import { getSocket, connectSocket } from "../utils/socket";

/* ─── tokens ─────────────────────────────────────────────────────── */
const C = {
  red:      "#E53935",
  redDark:  "#B71C1C",
  redLight: "#FFF5F5",
  redBd:    "#FFCDD2",
  bg:       "#F7F8FA",
  surface:  "#FFFFFF",
  border:   "#EDEEF0",
  text:     "#0D0D0D",
  sub:      "#5C5F6B",
  dim:      "#B0B3BF",
  green:    "#22C55E",
  blue:     "#3B82F6",
  mine:     "#E53935",
  their:    "#F0F1F4",
};

const ST = {
  pending:    { label:"Yangi",        color:"#3B82F6", bg:"#EFF6FF" },
  read:       { label:"Ko'rilgan",    color:"#6B7280", bg:"#F3F4F6" },
  accepted:   { label:"Qabul",        color:"#16A34A", bg:"#F0FDF4" },
  rejected:   { label:"Rad etildi",   color:"#DC2626", bg:"#FEF2F2" },
  in_progress:{ label:"Jarayonda",    color:"#D97706", bg:"#FFFBEB" },
  completed:  { label:"Tugallandi",   color:"#15803D", bg:"#F0FDF4" },
};

const STICKER_ROWS = [
  ["😊","😄","😂","🤣","😍","🥰","😎","🤩","🥳","😜"],
  ["👍","👎","❤️","🔥","✅","❌","⭐","💯","🙏","👏"],
  ["💪","🤝","💰","🎉","🚀","💎","⚡","✨","🎯","💬"],
  ["😢","😡","😱","🤔","😴","🤗","🫡","💀","👻","🤖"],
];

/* ─── helpers ─────────────────────────────────────────────────────── */
function timeAgo(d) {
  if (!d) return "";
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)    return "Hozir";
  if (s < 3600)  return `${Math.floor(s/60)} daq`;
  if (s < 86400) return `${Math.floor(s/3600)} soat`;
  return new Date(d).toLocaleDateString("uz-UZ", { day:"2-digit", month:"short" });
}
function fmtTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("uz-UZ", { hour:"2-digit", minute:"2-digit" });
}
function initials(u) {
  if (!u) return "?";
  return ((u.firstName?.[0]||"")+(u.lastName?.[0]||"")).toUpperCase()||"?";
}
function adTitle(app) {
  if (app._isOrder) return app._projectName || "Buyurtma";
  const a = app.ad;
  return a?.title || a?.companyName || a?.productName || "E'lon";
}
function otherUser(app, myId) {
  return String(app.adOwner?._id||app.adOwner) === myId ? app.applicant : app.adOwner;
}

/* ─── Avatar ──────────────────────────────────────────────────────── */
function Av({ user, size=40, online=false }) {
  return (
    <div style={{ position:"relative", flexShrink:0, width:size, height:size }}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:`linear-gradient(135deg,${C.red} 0%,${C.redDark} 100%)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*0.36, fontWeight:700, color:"#fff", overflow:"hidden",
        boxShadow:`0 2px 8px rgba(229,57,53,0.25)`,
      }}>
        {user?.avatar
          ? <img src={user.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          : initials(user)}
      </div>
      {online && (
        <span style={{
          position:"absolute", bottom:1, right:1,
          width:size*0.27, height:size*0.27, borderRadius:"50%",
          background:C.green, border:`2.5px solid #fff`,
          boxShadow:"0 0 0 1px rgba(34,197,94,0.3)",
        }}/>
      )}
    </div>
  );
}

/* ─── ConvRow ─────────────────────────────────────────────────────── */
function ConvRow({ app, myId, isActive, onClick }) {
  const other  = otherUser(app, myId);
  const isOwner = String(app.adOwner?._id||app.adOwner) === myId;
  const unread  = isOwner ? (app.ownerUnread||0) : (app.applicantUnread||0);
  const st      = ST[app.status] || ST.read;

  return (
    <div
      onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:12,
        padding:"14px 16px", cursor:"pointer",
        background: isActive
          ? "linear-gradient(90deg,#FFF5F5 0%,#FFF8F8 100%)"
          : "transparent",
        borderLeft:`3px solid ${isActive ? C.red : "transparent"}`,
        transition:"all .15s",
        position:"relative",
      }}
      onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.background="#FAFBFC"; e.currentTarget.style.borderLeftColor=C.redBd; } }}
      onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderLeftColor="transparent"; } }}
    >
      <Av user={other} size={48} online={false}/>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3}}>
          <span style={{
            fontSize:13.5, fontWeight: unread>0 ? 700 : 600,
            color: C.text, overflow:"hidden", whiteSpace:"nowrap",
            textOverflow:"ellipsis", maxWidth:140,
          }}>
            {other?.firstName} {other?.lastName}
          </span>
          <span style={{fontSize:11, color:C.dim, flexShrink:0, fontWeight:500}}>
            {timeAgo(app.lastMessageAt||app.updatedAt)}
          </span>
        </div>
        <div style={{
          fontSize:12, color:C.sub, overflow:"hidden",
          whiteSpace:"nowrap", textOverflow:"ellipsis", marginBottom:5,
          fontWeight:500,
        }}>
          {adTitle(app)}
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:6}}>
          <span style={{
            fontSize:12, color: unread>0 ? C.sub : C.dim,
            overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
            flex:1, fontWeight: unread>0 ? 500 : 400,
          }}>
            {app.lastMessage || "Xabar yo'q"}
          </span>
          <div style={{display:"flex", gap:5, alignItems:"center", flexShrink:0}}>
            <span style={{
              fontSize:10.5, fontWeight:600, color:st.color,
              background:st.bg, padding:"2px 7px", borderRadius:99,
            }}>
              {st.label}
            </span>
            {unread>0 && (
              <span style={{
                minWidth:19, height:19, borderRadius:99,
                background:C.red, color:"#fff", fontSize:10, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 5px", boxShadow:`0 2px 6px rgba(229,57,53,0.35)`,
              }}>
                {unread>9?"9+":unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Bubble ──────────────────────────────────────────────────────── */
function Bubble({ msg, myId, appId, onEdited, onDeleted, service=applicationService }) {
  const isMine   = String(msg.sender?._id||msg.sender) === myId;
  const [hover,   setHover]   = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTxt, setEditTxt] = useState(msg.text);
  const [saving,  setSaving]  = useState(false);
  const editRef    = useRef(null);
  const leaveTimer = useRef(null);

  const onEnter = () => { clearTimeout(leaveTimer.current); setHover(true); };
  const onLeave = () => { leaveTimer.current = setTimeout(()=>setHover(false), 180); };

  useEffect(()=>{ if(editing) editRef.current?.focus(); },[editing]);

  const saveEdit = async () => {
    if(!editTxt.trim()||editTxt.trim()===msg.text){ setEditing(false); return; }
    setSaving(true);
    try {
      await service.editMsg(appId, msg._id, editTxt.trim());
      onEdited(msg._id, editTxt.trim());
      setEditing(false);
    } catch { toast.error("Tahrirda xatolik"); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    try {
      await service.deleteMsg(appId, msg._id);
      onDeleted(msg._id);
    } catch { toast.error("O'chirishda xatolik"); }
  };

  if (msg.deleted) return null;

  const isSticker = /^[\u{1F300}-\u{1FAFF}]{1,3}$/u.test((msg.text||"").trim());

  return (
    <div
      style={{display:"flex", justifyContent:isMine?"flex-end":"flex-start", padding:"2px 0", gap:8, alignItems:"flex-end"}}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {!isMine && <Av user={msg.sender} size={28}/>}

      {/* Actions */}
      {isMine && hover && !editing && !msg._pending && !msg.deleted && (
        <div
          style={{
            display:"flex", gap:2, alignItems:"center",
            background:"#fff", borderRadius:10, padding:"3px 4px",
            boxShadow:"0 4px 16px rgba(0,0,0,.10)", border:`1px solid ${C.border}`,
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <button type="button" onClick={()=>{ setEditing(true); setEditTxt(msg.text); }}
            style={{width:28,height:28,border:"none",background:"none",cursor:"pointer",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",color:C.dim,transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#EFF6FF";e.currentTarget.style.color=C.blue;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.dim;}}
          ><LuPencil size={13}/></button>
          <button type="button" onClick={doDelete}
            style={{width:28,height:28,border:"none",background:"none",cursor:"pointer",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",color:C.dim,transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#FEF2F2";e.currentTarget.style.color=C.red;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.dim;}}
          ><LuTrash2 size={13}/></button>
        </div>
      )}

      <div style={{maxWidth:"66%"}}>
        {editing ? (
          <div style={{background:"#fff",border:`2px solid ${C.red}`,borderRadius:16,overflow:"hidden",minWidth:200,boxShadow:`0 4px 20px rgba(229,57,53,.15)`}}>
            <textarea
              ref={editRef}
              value={editTxt}
              onChange={e=>setEditTxt(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();saveEdit();} if(e.key==="Escape") setEditing(false); }}
              rows={2}
              style={{width:"100%",padding:"10px 14px",border:"none",outline:"none",resize:"none",fontSize:13.5,fontFamily:"inherit",boxSizing:"border-box",background:"#FAFAFA"}}
            />
            <div style={{display:"flex",gap:6,padding:"8px 10px",borderTop:`1px solid ${C.border}`,background:"#fff"}}>
              <button onClick={saveEdit} disabled={saving}
                style={{flex:1,padding:"6px",borderRadius:9,border:"none",background:C.red,color:"#fff",fontSize:12,fontWeight:700,cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                {saving?<LuLoader size={11} style={{animation:"spin .8s linear infinite"}}/>:<LuCheck size={11}/>} Saqlash
              </button>
              <button onClick={()=>setEditing(false)}
                style={{flex:1,padding:"6px",borderRadius:9,border:`1.5px solid ${C.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:C.sub}}>
                Bekor
              </button>
            </div>
          </div>
        ) : isSticker ? (
          <div style={{
            padding:"4px 8px",
            display:"flex", alignItems:"center", justifyContent: isMine?"flex-end":"flex-start",
          }}>
            <span style={{fontSize:42, lineHeight:1.1}}>{msg.text}</span>
          </div>
        ) : (
          <div style={{
            padding:"10px 14px",
            borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            background: isMine
              ? `linear-gradient(135deg,${C.red} 0%,${C.redDark} 100%)`
              : C.their,
            color: isMine ? "#fff" : C.text,
            fontSize:13.5, lineHeight:1.6, wordBreak:"break-word",
            boxShadow: isMine
              ? "0 3px 12px rgba(229,57,53,.28)"
              : "0 1px 3px rgba(0,0,0,.06)",
            opacity: msg._pending ? 0.65 : 1,
            transition:"opacity .2s",
          }}>
            <span style={{whiteSpace:"pre-wrap"}}>{msg.text}</span>
            <div style={{
              fontSize:10.5, marginTop:4,
              textAlign:"right", opacity:0.7,
              display:"flex", alignItems:"center",
              justifyContent:"flex-end", gap:4,
              color: isMine ? "rgba(255,255,255,0.85)" : C.dim,
            }}>
              {msg.edited && <span style={{fontStyle:"italic"}}>tahrirlangan ·</span>}
              {fmtTime(msg.createdAt)}
              {isMine && !msg._pending && (msg.isRead
                ? <LuCheckCheck size={12}/>
                : <LuCheck size={12}/>
              )}
              {msg._pending && <LuLoader size={10} style={{animation:"spin .8s linear infinite"}}/>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ChatPanel ───────────────────────────────────────────────────── */
/* ─── ApplicationCard ─────────────────────────────────────────────── */
function ApplicationCard({ app, myId, onStatusChange, service }) {
  const isOwner  = String(app.adOwner?._id||app.adOwner) === myId;
  const st       = ST[app.status] || ST.read;
  const isPending = ["pending","read"].includes(app.status);
  const [acting, setActing] = useState(null); // "accepted" | "rejected"

  const handleStatus = async (status) => {
    setActing(status);
    try {
      await service.status(app._id, status);
      onStatusChange(app._id, status);
      toast.success(status === "accepted" ? "Qabul qilindi ✓" : "Rad etildi");
    } catch { toast.error("Xatolik yuz berdi"); }
    finally { setActing(null); }
  };

  // card data: from application fields or first message
  const name    = app.applicantName    || app.applicant?.firstName + " " + (app.applicant?.lastName||"");
  const phone   = app.applicantPhone   || app.phone   || "";
  const message = app.applicantMessage || app.message || app.brief || "";

  return (
    <div style={{
      margin:"20px auto", maxWidth:440, width:"100%",
      borderRadius:18, overflow:"hidden",
      border:`1.5px solid ${C.border}`,
      boxShadow:"0 6px 28px rgba(0,0,0,.08)",
      background:"#fff",
    }}>
      {/* Card header */}
      <div style={{
        padding:"14px 18px",
        background:`linear-gradient(135deg,${C.red} 0%,${C.redDark} 100%)`,
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <LuFileText size={16} style={{color:"#fff"}}/>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>Hamkorlik zayavkasi</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:1}}>
              {new Date(app.createdAt).toLocaleDateString("uz-UZ",{day:"2-digit",month:"long",year:"numeric"})}
            </div>
          </div>
        </div>
        <span style={{
          fontSize:11,fontWeight:700,
          color: app.status==="accepted" ? "#16A34A" : app.status==="rejected" ? C.red : "#D97706",
          background: app.status==="accepted" ? "#F0FDF4" : app.status==="rejected" ? "#FEF2F2" : "#FFFBEB",
          padding:"4px 10px",borderRadius:99,
          border:`1px solid ${app.status==="accepted"?"#BBF7D0":app.status==="rejected"?C.redBd:"#FDE68A"}`,
        }}>
          {st.label}
        </span>
      </div>

      {/* Card body */}
      <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
        {/* Name */}
        {name?.trim() && (
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:"#F0F4FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <LuUser size={14} style={{color:"#3B82F6"}}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.dim,fontWeight:600,marginBottom:1}}>Ism</div>
              <div style={{fontSize:13.5,fontWeight:600,color:C.text}}>{name}</div>
            </div>
          </div>
        )}
        {/* Phone */}
        {phone && (
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <LuPhone size={14} style={{color:"#16A34A"}}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.dim,fontWeight:600,marginBottom:1}}>Telefon</div>
              <a href={`tel:${phone}`} style={{fontSize:13.5,fontWeight:600,color:"#16A34A",textDecoration:"none"}}>{phone}</a>
            </div>
          </div>
        )}
        {/* Message */}
        {message && (
          <div style={{
            padding:"12px 14px",borderRadius:12,
            background:"#F7F8FA",border:`1px solid ${C.border}`,
          }}>
            <div style={{fontSize:11,color:C.dim,fontWeight:600,marginBottom:6}}>Murojaat matni</div>
            <div style={{fontSize:13.5,color:C.text,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{message}</div>
          </div>
        )}

        {/* Actions — only for owner when pending */}
        {isOwner && isPending && (
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button
              onClick={()=>handleStatus("accepted")}
              disabled={!!acting}
              style={{
                flex:1,padding:"11px",borderRadius:12,border:"none",
                background:`linear-gradient(135deg,#22C55E,#16A34A)`,
                color:"#fff",fontWeight:700,fontSize:13,cursor:acting?"not-allowed":"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                boxShadow:"0 4px 14px rgba(34,197,94,.3)",
                opacity:acting?0.7:1,transition:"opacity .2s",
              }}
            >
              {acting==="accepted"
                ? <LuLoader size={14} style={{animation:"spin .8s linear infinite"}}/>
                : <LuCircleCheck size={15}/>
              }
              Qabul qilish
            </button>
            <button
              onClick={()=>handleStatus("rejected")}
              disabled={!!acting}
              style={{
                flex:1,padding:"11px",borderRadius:12,
                border:`1.5px solid ${C.redBd}`,
                background:C.redLight,color:C.red,
                fontWeight:700,fontSize:13,cursor:acting?"not-allowed":"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                opacity:acting?0.7:1,transition:"opacity .2s",
              }}
            >
              {acting==="rejected"
                ? <LuLoader size={14} style={{animation:"spin .8s linear infinite"}}/>
                : <LuCircleX size={15}/>
              }
              Rad etish
            </button>
          </div>
        )}

        {/* Accepted info */}
        {app.status==="accepted" && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:12,background:"#F0FDF4",border:"1px solid #BBF7D0"}}>
            <LuCircleCheck size={16} style={{color:"#16A34A",flexShrink:0}}/>
            <span style={{fontSize:13,fontWeight:600,color:"#15803D"}}>Zayavka qabul qilindi — endi chat ochiq!</span>
          </div>
        )}
        {/* Rejected info */}
        {app.status==="rejected" && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:12,background:"#FEF2F2",border:`1px solid ${C.redBd}`}}>
            <LuCircleX size={16} style={{color:C.red,flexShrink:0}}/>
            <span style={{fontSize:13,fontWeight:600,color:C.red}}>Zayavka rad etildi.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ChatPanel ───────────────────────────────────────────────────── */
function ChatPanel({ app, myId, onStatusChange, onBack, type="application", service=applicationService }) {
  const isOrder   = type === "order";
  const joinEvt   = isOrder ? "join_order_room"        : "join_chat_room";
  const leaveEvt  = isOrder ? "leave_order_room"       : "leave_chat_room";
  const newMsgEvt = isOrder ? "new_order_message"      : "new_chat_message";
  const editedEvt = isOrder ? "order_message_edited"   : "message_edited";
  const deletedEvt= isOrder ? "order_message_deleted"  : "message_deleted";
  const readEvt   = isOrder ? "order_messages_read"    : "messages_read";
  const statusEvt = isOrder ? "order_status_changed"   : "application_status_changed";

  const { user } = useAuthStore();
  const [messages,      setMessages]      = useState([]);
  const [text,          setText]          = useState("");
  const [loading,       setLoading]       = useState(true);
  const [sending,       setSending]       = useState(false);
  const [showStk,       setShowStk]       = useState(false);
  const [iBlockedThem,  setIBlockedThem]  = useState(false);
  const [theyBlockedMe, setTheyBlockedMe] = useState(false);
  const [blockLoading,  setBlockLoading]  = useState(false);
  const msgsRef  = useRef(null);
  const inputRef = useRef(null);
  const isOwner  = String(app.adOwner?._id||app.adOwner) === myId;
  const other    = otherUser(app, myId);
  const st       = ST[app.status] || ST.read;
  const isBlocked = iBlockedThem || theyBlockedMe;

  const scrollDown = useCallback(()=>{
    if(!msgsRef.current) return;
    msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  },[]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await service.messages(app._id);
      setMessages(res.data||[]);
      setIBlockedThem(res.iBlockedThem||false);
      setTheyBlockedMe(res.theyBlockedMe||false);
    } catch { toast.error("Xabarlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  },[app._id, service]);

  const handleBlock = useCallback(async () => {
    setBlockLoading(true);
    try {
      if (iBlockedThem) {
        await service.unblock(app._id);
        setIBlockedThem(false);
        toast.success("Blokdan chiqarildi");
      } else {
        await service.block(app._id);
        setIBlockedThem(true);
        toast.success(`${other?.firstName} bloklandi`);
      }
    } catch { toast.error("Xatolik"); }
    setBlockLoading(false);
  }, [app._id, iBlockedThem, other?.firstName, service]);

  useEffect(()=>{ setLoading(true); fetchMessages(); },[fetchMessages]);
  useEffect(()=>{ if(!loading) scrollDown(); },[loading, scrollDown]);

  useEffect(()=>{
    const s = getSocket();
    s.emit(joinEvt, app._id);
    const idKey = isOrder ? "orderId" : "applicationId";

    const onNewMsg   = p=>{ if(String(p[idKey])!==String(app._id)) return; setMessages(prev=>{ if(prev.some(m=>m._id===p.message._id)) return prev; return [...prev,p.message]; }); setTimeout(scrollDown,60); };
    const onEdited   = p=>{ if(String(p[idKey])!==String(app._id)) return; setMessages(prev=>prev.map(m=>m._id===p.messageId?{...m,text:p.text,edited:true}:m)); };
    const onDeleted  = p=>{ if(String(p[idKey])!==String(app._id)) return; setMessages(prev=>prev.map(m=>m._id===p.messageId?{...m,deleted:true}:m)); };
    const onStatus   = p=>{ const cid=p[idKey]||p.applicationId||p.orderId; if(String(cid)===String(app._id)) onStatusChange(app._id,p.status); };
    const onRead     = p=>{ const cid=p[idKey]||p.applicationId||p.orderId; if(String(cid)!==String(app._id)) return; setMessages(prev=>prev.map(m=>String(m.sender?._id||m.sender)===myId?{...m,isRead:true}:m)); };
    const onBlocked  = p=>{ const cid=p.applicationId||p.orderId; if(String(cid)===String(app._id)) setTheyBlockedMe(true); };
    const onUnblocked= p=>{ const cid=p.applicationId||p.orderId; if(String(cid)===String(app._id)) setTheyBlockedMe(false); };

    s.on(newMsgEvt,onNewMsg); s.on(editedEvt,onEdited); s.on(deletedEvt,onDeleted);
    s.on(statusEvt,onStatus); s.on(readEvt,onRead);
    s.on('user_blocked',onBlocked); s.on('user_unblocked',onUnblocked);
    return ()=>{
      s.emit(leaveEvt,app._id);
      s.off(newMsgEvt,onNewMsg); s.off(editedEvt,onEdited); s.off(deletedEvt,onDeleted);
      s.off(statusEvt,onStatus); s.off(readEvt,onRead);
      s.off('user_blocked',onBlocked); s.off('user_unblocked',onUnblocked);
    };
  },[app._id,onStatusChange,scrollDown,isOrder,newMsgEvt,editedEvt,deletedEvt,statusEvt,readEvt,joinEvt,leaveEvt]);

  const sendMessage = useCallback(async (txt) => {
    const trimmed = (txt??text).trim();
    if(!trimmed||sending) return;
    setText(""); setShowStk(false);
    if(inputRef.current) inputRef.current.style.height="auto";
    const tempId  = `tmp-${Date.now()}`;
    const tempMsg = { _id:tempId, text:trimmed, sender:{ _id:myId, firstName:user?.firstName, lastName:user?.lastName, avatar:user?.avatar }, createdAt:new Date().toISOString(), isRead:false, _pending:true };
    setMessages(p=>[...p,tempMsg]);
    setTimeout(scrollDown,50);
    try {
      const res = await service.send(app._id,trimmed);
      setMessages(p=>{ const f=p.filter(m=>m._id!==tempId); if(f.some(m=>m._id===res.data._id)) return f; return [...f,res.data]; });
    } catch {
      setMessages(p=>p.filter(m=>m._id!==tempId));
      setText(trimmed);
      toast.error("Xabar yuborishda xatolik");
    }
  },[text,sending,myId,user,app._id,scrollDown,service]);

  const handleKey = e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); } };

  const handleStatus = async (status) => {
    try {
      await service.status(app._id,status);
      onStatusChange(app._id,status);
      const msgs={accepted:"Qabul qilindi",rejected:"Rad etildi",in_progress:"Jarayonda",completed:"Tugallandi"};
      toast.success(msgs[status]||"Status yangilandi");
    } catch { toast.error("Xatolik"); }
  };

  const handleEdited  = (id,txt) => setMessages(p=>p.map(m=>m._id===id?{...m,text:txt,edited:true}:m));
  const handleDeleted = (id)     => setMessages(p=>p.map(m=>m._id===id?{...m,deleted:true,text:''}:m));

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#FAFBFC",position:"relative"}}>

      {/* Header */}
      <div style={{
        padding:"12px 18px", background:C.surface,
        borderBottom:`1px solid ${C.border}`,
        display:"flex", alignItems:"center", gap:12,
        flexShrink:0, zIndex:2,
        boxShadow:"0 1px 0 rgba(0,0,0,.04)",
      }}>
        <button type="button" onClick={onBack} style={{
          background:"none",border:"none",cursor:"pointer",
          color:C.sub, padding:5, borderRadius:8,
          display:"flex",alignItems:"center",justifyContent:"center",
          transition:"background .15s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
          onMouseLeave={e=>e.currentTarget.style.background="none"}
        >
          <LuChevronLeft size={22}/>
        </button>

        <Av user={other} size={42} online/>

        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14.5,fontWeight:700,color:C.text,marginBottom:1}}>
            {other?.firstName} {other?.lastName}
          </div>
          <div style={{fontSize:11.5,color:C.sub,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
            {adTitle(app)}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {/* Status badge */}
          <span style={{
            fontSize:11, fontWeight:700, color:st.color, background:st.bg,
            padding:"4px 10px", borderRadius:99,
            border:`1px solid ${st.color}22`,
          }}>
            {st.label}
          </span>

          {/* Owner actions */}
          {isOwner && !["accepted","rejected","completed"].includes(app.status) && (
            <div style={{display:"flex",gap:5}}>
              {app.status !== "in_progress" && <>
                <button onClick={()=>handleStatus("accepted")} style={{
                  padding:"5px 12px",fontSize:12,fontWeight:700,borderRadius:9,
                  border:"1.5px solid #BBF7D0",background:"#F0FDF4",color:"#16A34A",
                  cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all .15s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#DCFCE7";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#F0FDF4";}}
                >
                  <LuCheck size={12}/> Qabul
                </button>
                <button onClick={()=>handleStatus("rejected")} style={{
                  padding:"5px 12px",fontSize:12,fontWeight:700,borderRadius:9,
                  border:`1.5px solid ${C.redBd}`,background:C.redLight,color:C.red,
                  cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all .15s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#FFE4E4";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.redLight;}}
                >
                  <LuX size={12}/> Rad
                </button>
              </>}
              {isOrder && app.status==="accepted" && (
                <button onClick={()=>handleStatus("in_progress")} style={{
                  padding:"5px 12px",fontSize:12,fontWeight:700,borderRadius:9,
                  border:"1.5px solid #FDE68A",background:"#FFFBEB",color:"#D97706",
                  cursor:"pointer",display:"flex",alignItems:"center",gap:4,
                }}>⚡ Boshlash</button>
              )}
              {isOrder && app.status==="in_progress" && (
                <button onClick={()=>handleStatus("completed")} style={{
                  padding:"5px 12px",fontSize:12,fontWeight:700,borderRadius:9,
                  border:"1.5px solid #BBF7D0",background:"#F0FDF4",color:"#16A34A",
                  cursor:"pointer",display:"flex",alignItems:"center",gap:4,
                }}><LuCheck size={12}/> Tugatish</button>
              )}
            </div>
          )}

          {/* Block button */}
          <button onClick={handleBlock} disabled={blockLoading||theyBlockedMe}
            title={iBlockedThem?"Blokdan chiqarish":"Bloklash"}
            style={{
              width:34,height:34,borderRadius:9,border:`1.5px solid ${C.border}`,
              cursor:theyBlockedMe?"not-allowed":"pointer",
              background:iBlockedThem?"#FFF7ED":theyBlockedMe?"#F9FAFB":C.surface,
              color:iBlockedThem?"#EA580C":theyBlockedMe?C.dim:C.sub,
              display:"flex",alignItems:"center",justifyContent:"center",
              opacity:blockLoading?0.6:1,flexShrink:0,transition:"all .15s",
            }}
            onMouseEnter={e=>{ if(!theyBlockedMe) e.currentTarget.style.borderColor=C.red; }}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
          >
            {blockLoading
              ? <LuLoader size={14} style={{animation:"spin .8s linear infinite"}}/>
              : <LuBan size={14}/>
            }
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={msgsRef} style={{
        flex:1, overflowY:"auto", overflowX:"hidden",
        padding:"20px 20px", display:"flex", flexDirection:"column", gap:6,
        scrollbarWidth:"thin", scrollbarColor:`${C.dim} transparent`,
      }}>
        {/* Always show application card first */}
        {!app._isOrder && (
          <ApplicationCard
            app={app}
            myId={myId}
            onStatusChange={onStatusChange}
            service={service}
          />
        )}

        {/* Chat locked state */}
        {!app._isOrder && ["pending","read"].includes(app.status) ? (
          <div style={{
            display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",gap:12,padding:"32px 20px",
          }}>
            <div style={{
              width:52,height:52,borderRadius:"50%",
              background:"#F7F8FA",border:`1.5px solid ${C.border}`,
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <LuLock size={22} style={{color:C.dim}}/>
            </div>
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:14,fontWeight:700,color:C.sub,margin:"0 0 5px"}}>
                {isOwner ? "Zayavkani qabul qiling" : "Javob kutilmoqda..."}
              </p>
              <p style={{fontSize:12.5,color:C.dim,margin:0,lineHeight:1.5}}>
                {isOwner
                  ? "Qabul qilganingizdan keyin chat ochiladi"
                  : "Qabul qilingandan so'ng chat ochiladi"
                }
              </p>
            </div>
          </div>
        ) : loading ? (
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:120}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <LuLoader size={28} style={{color:C.red,animation:"spin 1s linear infinite"}}/>
              <span style={{fontSize:12,color:C.dim,fontWeight:500}}>Yuklanmoqda...</span>
            </div>
          </div>
        ) : messages.length===0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:40}}>
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:14,fontWeight:700,color:C.sub,margin:"0 0 5px"}}>Xabarlar yo'q</p>
              <p style={{fontSize:12.5,color:C.dim,margin:0}}>Birinchi xabarni yuboring</p>
            </div>
          </div>
        ) : (
          messages.map(msg=>(
            <Bubble key={msg._id} msg={msg} myId={myId} appId={app._id}
              onEdited={handleEdited} onDeleted={handleDeleted} service={service}/>
          ))
        )}
      </div>

      {/* Sticker panel */}
      {showStk && (
        <div style={{
          position:"absolute",bottom:70,left:0,right:0,
          background:C.surface,borderTop:`1px solid ${C.border}`,
          padding:"14px 16px",zIndex:10,
          boxShadow:"0 -8px 32px rgba(0,0,0,.08)",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:700,color:C.sub}}>Stikerlar</span>
            <button type="button" onClick={()=>setShowStk(false)}
              style={{background:"none",border:"none",cursor:"pointer",color:C.dim,display:"flex",padding:3}}>
              <LuX size={14}/>
            </button>
          </div>
          {STICKER_ROWS.map((row,i)=>(
            <div key={i} style={{display:"flex",gap:4,marginBottom:4}}>
              {row.map(em=>(
                <button type="button" key={em} onClick={()=>sendMessage(em)}
                  style={{width:38,height:38,fontSize:20,border:`1px solid ${C.border}`,borderRadius:10,background:"#FAFBFC",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .1s,background .1s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.redLight;e.currentTarget.style.transform="scale(1.2)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#FAFBFC";e.currentTarget.style.transform="scale(1)";}}
                >{em}</button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Blocked */}
      {isBlocked && (
        <div style={{
          padding:"12px 18px",borderTop:`1px solid ${C.border}`,
          background:iBlockedThem?"#FFF7ED":"#F9FAFB",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexShrink:0,
        }}>
          <LuBan size={15} style={{color:iBlockedThem?"#EA580C":C.dim,flexShrink:0}}/>
          <span style={{fontSize:12.5,fontWeight:600,color:iBlockedThem?"#EA580C":C.sub}}>
            {iBlockedThem
              ? `Siz ${other?.firstName}ni bloklagan siz.`
              : `${other?.firstName} sizni bloklagan.`
            }
          </span>
          {iBlockedThem && (
            <button onClick={handleBlock} disabled={blockLoading}
              style={{padding:"4px 12px",fontSize:11.5,fontWeight:700,borderRadius:8,border:"1.5px solid #EA580C",background:"#FFF7ED",color:"#EA580C",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              Blokdan chiqar
            </button>
          )}
        </div>
      )}

      {/* Input — only when accepted (or order type) */}
      {!isBlocked && (app._isOrder || ["accepted","in_progress","completed"].includes(app.status)) && (
        <div style={{
          padding:"10px 14px",borderTop:`1px solid ${C.border}`,
          display:"flex",gap:8,alignItems:"flex-end",flexShrink:0,
          background:C.surface, zIndex:2,
        }}>
          <button type="button" onClick={()=>setShowStk(v=>!v)}
            style={{
              width:40,height:40,borderRadius:12,flexShrink:0,
              border:`1.5px solid ${showStk?C.red:C.border}`,
              background:showStk?C.redLight:C.surface,
              color:showStk?C.red:C.sub,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all .15s",
            }}>
            <LuSmile size={18}/>
          </button>

          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={e=>{
              setText(e.target.value);
              e.target.style.height="auto";
              e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";
            }}
            onKeyDown={handleKey}
            placeholder="Xabar yozing..."
            style={{
              flex:1,padding:"10px 16px",border:`1.5px solid ${C.border}`,
              borderRadius:22,fontSize:13.5,outline:"none",resize:"none",
              fontFamily:"inherit",lineHeight:1.55,maxHeight:120,
              background:C.bg,color:C.text,
              transition:"border-color .2s,background .2s",
              boxSizing:"border-box",display:"block",
            }}
            onFocus={e=>{ e.target.style.borderColor=C.red; e.target.style.background="#fff"; }}
            onBlur={e=>{  e.target.style.borderColor=C.border; e.target.style.background=C.bg; }}
          />

          <button type="button" onClick={()=>sendMessage()} disabled={!text.trim()}
            style={{
              width:40,height:40,borderRadius:12,border:"none",flexShrink:0,
              background:text.trim()?`linear-gradient(135deg,${C.red},${C.redDark})`:"#F0F1F4",
              color:text.trim()?"#fff":C.dim,
              cursor:text.trim()?"pointer":"not-allowed",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all .2s",
              boxShadow:text.trim()?"0 4px 14px rgba(229,57,53,.35)":"none",
              transform:text.trim()?"scale(1)":"scale(0.95)",
            }}>
            <LuSend size={16}/>
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function MyApplications() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams   = new URLSearchParams(location.search);
  const defaultTab     = searchParams.get("tab")==="orders" ? "orders" : searchParams.get("tab")==="sent" ? "sent" : "received";
  const initialOrderId = searchParams.get("orderId") || null;
  const initialAppId   = searchParams.get("appId")   || null;

  const [tab,      setTab]      = useState(defaultTab);
  const [received, setReceived] = useState([]);
  const [sent,     setSent]     = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState("application");
  const [showChat, setShowChat] = useState(false);
  const [search,   setSearch]   = useState("");
  const autoSelectedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth<=768);

  useEffect(()=>{
    const h=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener('resize',h);
    return ()=>window.removeEventListener('resize',h);
  },[]);

  useEffect(()=>{ if(!token) navigate("/kirish"); },[token,navigate]);

  const loadReceived = useCallback(async()=>{ try{ const r=await applicationService.received(); setReceived(r.data||[]); }catch{} },[]);
  const loadSent     = useCallback(async()=>{ try{ const r=await applicationService.sent();     setSent(r.data||[]);     }catch{} },[]);
  const loadOrders   = useCallback(async()=>{ try{ const r=await orderService.myOrders();       setOrders(r.data||[]);   }catch{} },[]);

  useEffect(()=>{
    if(!user?._id) return;
    const s = connectSocket(user._id);
    const onLastMsg  = ({applicationId,message})=>{ const upd=arr=>arr.map(a=>a._id===applicationId?{...a,lastMessage:message?.text||'',lastMessageAt:message?.createdAt}:a); setReceived(p=>upd(p)); setSent(p=>upd(p)); };
    const onOrderMsg = ({orderId,message})=>setOrders(p=>p.map(a=>a._id===orderId?{...a,lastMessage:message?.text||'',lastMessageAt:message?.createdAt}:a));
    s.on('new_application',loadReceived);
    s.on('new_chat_message',onLastMsg);
    s.on('new_order',loadOrders);
    s.on('new_order_message',onOrderMsg);
    return ()=>{ s.off('new_application',loadReceived); s.off('new_chat_message',onLastMsg); s.off('new_order',loadOrders); s.off('new_order_message',onOrderMsg); };
  },[user?._id,loadReceived,loadOrders]);

  useEffect(()=>{
    if(!token) return;
    setLoading(true);
    Promise.all([loadReceived(),loadSent(),loadOrders()]).finally(()=>setLoading(false));
  },[token,loadReceived,loadSent,loadOrders]);

  const normalizeOrder = useCallback(order=>({
    ...order,
    adOwner:order.blogger, applicant:order.business,
    ownerUnread:order.bloggerUnread, applicantUnread:order.businessUnread,
    _isOrder:true, _projectName:order.projectName,
  }),[]);

  const handleSelect = app=>{
    setSelected(app); setSelectedType("application"); setShowChat(true);
    const isOwner = String(app.adOwner?._id||app.adOwner)===String(user._id);
    if(isOwner) setReceived(p=>p.map(a=>a._id===app._id?{...a,ownerUnread:0,status:a.status==='pending'?'read':a.status}:a));
    else setSent(p=>p.map(a=>a._id===app._id?{...a,applicantUnread:0}:a));
  };

  const handleSelectOrder = order=>{
    const norm=normalizeOrder(order);
    setSelected(norm); setSelectedType("order"); setShowChat(true);
    const isBlogger=String(order.blogger?._id||order.blogger)===String(user._id);
    if(isBlogger) setOrders(p=>p.map(a=>a._id===order._id?{...a,bloggerUnread:0,status:a.status==='pending'?'read':a.status}:a));
    else setOrders(p=>p.map(a=>a._id===order._id?{...a,businessUnread:0}:a));
  };

  const handleStatusChange = useCallback((id,status)=>{
    const f=a=>a._id===id?{...a,status}:a;
    setReceived(p=>p.map(f)); setSent(p=>p.map(f)); setOrders(p=>p.map(f));
    setSelected(p=>p?._id===id?{...p,status}:p);
  },[]);

  const handleDeleteOrder = useCallback(async(orderId, e)=>{
    e.stopPropagation();
    try {
      await orderService.deleteOrder(orderId);
      setOrders(p=>p.filter(o=>o._id!==orderId));
      if(selected?._id===orderId){ setSelected(null); setShowChat(false); }
      toast.success("Buyurtma o'chirildi");
    } catch { toast.error("O'chirishda xatolik"); }
  },[selected]);

  useEffect(()=>{
    if(!initialOrderId||autoSelectedRef.current||orders.length===0) return;
    const order=orders.find(o=>o._id===initialOrderId);
    if(order){ autoSelectedRef.current=true; setTab("orders"); handleSelectOrder(order); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[orders,initialOrderId]);

  const autoAppRef = useRef(false);
  useEffect(()=>{
    if(!initialAppId||autoAppRef.current) return;
    const app = sent.find(a=>a._id===initialAppId) || received.find(a=>a._id===initialAppId);
    if(app){ autoAppRef.current=true; handleSelect(app); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sent,received,initialAppId]);

  const myId = String(user?._id||"");
  const receivedUnread = received.reduce((s,a)=>s+(a.ownerUnread||0),0);
  const sentUnread     = sent.reduce((s,a)=>s+(a.applicantUnread||0),0);
  const ordersUnread   = orders.reduce((s,o)=>{
    const isBlogger=String(o.blogger?._id||o.blogger)===myId;
    return s+(isBlogger?(o.bloggerUnread||0):(o.businessUnread||0));
  },0);
  const totalUnread = receivedUnread+sentUnread+ordersUnread;

  const rawList = tab==="received" ? received : tab==="sent" ? sent : orders;
  const list = search.trim()
    ? rawList.filter(app=>{
        const other = tab==="orders"
          ? (String((app.blogger?._id||app.blogger))===myId ? app.business : app.blogger)
          : otherUser(app,myId);
        const name=`${other?.firstName||""} ${other?.lastName||""}`.toLowerCase();
        return name.includes(search.toLowerCase());
      })
    : rawList;

  if(!token||!user) return null;

  const TABS = [
    { key:"received", label:"Kelgan",   Icon:LuInbox,          cnt:receivedUnread, len:received.length },
    { key:"sent",     label:"Yuborgan", Icon:LuSendHorizontal, cnt:sentUnread,     len:sent.length },
    { key:"orders",   label:"Buyurtma", Icon:LuBriefcase,      cnt:ordersUnread,   len:orders.length },
  ];

  return (
    <div style={{fontFamily:"'Inter',sans-serif",height:"calc(100vh - 72px)",display:"flex",flexDirection:"column"}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#DDD;border-radius:99px}
      `}</style>

      <div style={{
        flex:1, display:"flex",
        flexDirection:isMobile?"column":"row",
        background:C.surface,
        border:`1px solid ${C.border}`,
        borderRadius:20, overflow:"hidden",
        boxShadow:"0 4px 32px rgba(0,0,0,.07)",
      }}>

        {/* ── Sidebar ── */}
        <div style={{
          width:isMobile?"100%":320,
          borderRight:isMobile?"none":`1px solid ${C.border}`,
          display:isMobile&&showChat?"none":"flex",
          flexDirection:"column", flexShrink:0,
          background:C.surface,
        }}>

          {/* Sidebar header */}
          <div style={{padding:"18px 16px 12px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{
                  width:36,height:36,borderRadius:10,
                  background:`linear-gradient(135deg,${C.red},${C.redDark})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:`0 4px 12px rgba(229,57,53,.3)`,
                }}>
                  <LuMessageCircle size={18} style={{color:"#fff"}}/>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:C.text,display:"flex",alignItems:"center",gap:6}}>
                    Xabarlar
                    {totalUnread>0 && (
                      <span style={{minWidth:20,height:20,borderRadius:99,background:C.red,color:"#fff",fontSize:10,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"0 5px"}}>
                        {totalUnread}
                      </span>
                    )}
                  </div>
                  <div style={{fontSize:11,color:C.dim,fontWeight:500}}>Zayavkalaringiz</div>
                </div>
              </div>
              <button onClick={()=>{loadReceived();loadSent();loadOrders();}}
                style={{width:32,height:32,border:`1.5px solid ${C.border}`,borderRadius:9,background:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.dim,transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;e.currentTarget.style.background=C.redLight;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.dim;e.currentTarget.style.background="none";}}>
                <LuRefreshCw size={13}/>
              </button>
            </div>

            {/* Search */}
            <div style={{position:"relative"}}>
              <LuSearch size={14} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:C.dim,pointerEvents:"none"}}/>
              <input
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Qidirish..."
                style={{
                  width:"100%",padding:"8px 12px 8px 32px",
                  border:`1.5px solid ${C.border}`,borderRadius:11,
                  fontSize:13,outline:"none",background:C.bg,
                  color:C.text,fontFamily:"inherit",boxSizing:"border-box",
                  transition:"border-color .2s",
                }}
                onFocus={e=>e.target.style.borderColor=C.red}
                onBlur={e=>e.target.style.borderColor=C.border}
              />
            </div>

            {/* Tabs */}
            <div style={{display:"flex",gap:4,marginTop:12}}>
              {TABS.map(({key,label,Icon,cnt,len})=>(
                <button key={key} onClick={()=>setTab(key)} style={{
                  flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                  gap:3,padding:"8px 4px",border:"none",cursor:"pointer",
                  borderRadius:12,transition:"all .15s",
                  background:tab===key?`linear-gradient(135deg,${C.red},${C.redDark})`:C.bg,
                  color:tab===key?"#fff":C.sub,
                  boxShadow:tab===key?`0 4px 12px rgba(229,57,53,.3)`:"none",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <Icon size={13}/>
                    <span style={{fontSize:12,fontWeight:700}}>{label}</span>
                    {cnt>0 && (
                      <span style={{
                        minWidth:16,height:16,borderRadius:99,
                        background:tab===key?"rgba(255,255,255,0.3)":C.red,
                        color:"#fff",fontSize:9,fontWeight:800,
                        display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"0 4px",
                      }}>{cnt>9?"9+":cnt}</span>
                    )}
                  </div>
                  <span style={{fontSize:10,opacity:0.75,fontWeight:500}}>{len} ta</span>
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{flex:1,overflowY:"auto"}}>
            {loading ? (
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:140}}>
                <LuLoader size={26} style={{color:C.red,animation:"spin 1s linear infinite"}}/>
              </div>
            ) : list.length===0 ? (
              <div style={{textAlign:"center",padding:"48px 24px"}}>
                <div style={{fontSize:48,marginBottom:12}}>{tab==="received"?"📥":tab==="orders"?"📋":"📤"}</div>
                <p style={{fontSize:14,fontWeight:700,color:C.text,margin:"0 0 6px"}}>
                  {search ? "Topilmadi" : tab==="received"?"Kelgan zayavka yo'q":tab==="orders"?"Buyurtma yo'q":"Yuborgan zayavka yo'q"}
                </p>
                <p style={{fontSize:12.5,color:C.sub,margin:0,lineHeight:1.6}}>
                  {search ? "Boshqa ism bilan qidiring" : tab==="received"
                    ? "E'lonlaringizga zayavka kelganida bu yerda ko'rasiz"
                    : tab==="orders"
                    ? <><Link to="/blogerlar" style={{color:C.red,fontWeight:600}}>Bloggerlar</Link> sahifasidan buyurtma bering</>
                    : <><Link to="/elonlar"   style={{color:C.red,fontWeight:600}}>E'lonlar</Link>   sahifasidan zayavka yuboring</>}
                </p>
              </div>
            ) : tab==="orders" ? (
              orders
                .filter(order=>{
                  if(!search.trim()) return true;
                  const isBlogger=String(order.blogger?._id||order.blogger)===myId;
                  const other=isBlogger?order.business:order.blogger;
                  return `${other?.firstName||""} ${other?.lastName||""}`.toLowerCase().includes(search.toLowerCase());
                })
                .map(order=>{
                  const norm=normalizeOrder(order);
                  const isBlogger=String(order.blogger?._id||order.blogger)===myId;
                  const unread=isBlogger?(order.bloggerUnread||0):(order.businessUnread||0);
                  return (
                    <div key={order._id} style={{position:"relative"}}
                      onMouseEnter={e=>{ const btn=e.currentTarget.querySelector('.order-del-btn'); if(btn) btn.style.opacity="1"; }}
                      onMouseLeave={e=>{ const btn=e.currentTarget.querySelector('.order-del-btn'); if(btn) btn.style.opacity="0"; }}
                    >
                      <ConvRow
                        app={{...norm,ownerUnread:isBlogger?unread:0,applicantUnread:!isBlogger?unread:0}}
                        myId={myId}
                        isActive={selected?._id===order._id}
                        onClick={()=>handleSelectOrder(order)}
                      />
                      <button
                        className="order-del-btn"
                        onClick={e=>handleDeleteOrder(order._id, e)}
                        title="O'chirish"
                        style={{
                          position:"absolute",top:10,right:10,
                          width:26,height:26,borderRadius:7,border:"none",
                          background:"#FEF2F2",color:C.red,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          opacity:0,transition:"opacity .15s",zIndex:2,
                        }}
                      >
                        <LuTrash2 size={12}/>
                      </button>
                    </div>
                  );
                })
            ) : (
              list.map(app=>(
                <ConvRow key={app._id} app={app} myId={myId}
                  isActive={selected?._id===app._id}
                  onClick={()=>handleSelect(app)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div style={{
          flex:1,display:isMobile&&!showChat?"none":"flex",
          flexDirection:"column",minWidth:0,
        }}>
          {selected ? (
            <ChatPanel
              key={selected._id}
              app={selected}
              myId={myId}
              onStatusChange={handleStatusChange}
              onBack={()=>{ setShowChat(false); setSelected(null); }}
              type={selectedType}
              service={selectedType==="order"?orderService:applicationService}
            />
          ) : (
            <div style={{
              flex:1,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",
              gap:16,padding:40,background:"#FAFBFC",
            }}>
              <div style={{
                width:88,height:88,borderRadius:"50%",
                background:"linear-gradient(135deg,#FFF5F5,#FFEBEB)",
                border:`2px solid ${C.redBd}`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,
                boxShadow:"0 12px 32px rgba(229,57,53,.12)",
              }}>💬</div>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:16,fontWeight:800,color:C.text,margin:"0 0 8px"}}>
                  Suhbat tanlang
                </p>
                <p style={{fontSize:13.5,color:C.sub,margin:0,lineHeight:1.6,maxWidth:240}}>
                  Chap tarafdan zayavka tanlang va muloqotni boshlang
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
