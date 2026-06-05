import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuSend, LuLoader, LuInbox, LuSendHorizontal,
  LuMessageCircle, LuCheck, LuCheckCheck, LuX,
  LuChevronLeft, LuRefreshCw, LuSmile, LuPencil,
  LuTrash2, LuBan, LuBriefcase,
} from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "../components/ui/toast";
import applicationService from "../services/applicationService";
import orderService from "../services/orderService";
import { getSocket, connectSocket } from "../utils/socket";
import { useLocation } from "react-router-dom";

/* ─── Design tokens ───────────────────────────────────────────── */
const C = {
  red:      "#E53935",
  redDark:  "#B71C1C",
  redLight: "#FFEBEE",
  redBd:    "#FFCDD2",
  bg:       "#F0F2F5",
  surface:  "#FFFFFF",
  border:   "#E4E6EB",
  text:     "#050505",
  muted:    "#65676B",
  dim:      "#BCC0C4",
  mine:     "#E53935",
  mineTxt:  "#FFFFFF",
  their:    "#F0F2F5",
  theirTxt: "#050505",
  green:    "#31A24C",
  blue:     "#1877F2",
};

/* ─── Stickers ────────────────────────────────────────────────── */
const STICKER_ROWS = [
  ["😊","😄","😂","🤣","😍","🥰","😎","🤩","🥳","😜"],
  ["👍","👎","❤️","🔥","✅","❌","⭐","💯","🙏","👏"],
  ["💪","🤝","💰","🎉","🚀","💎","⚡","✨","🎯","💬"],
  ["😢","😡","😱","🤔","😴","🤗","🫡","💀","👻","🤖"],
];

/* ─── helpers ─────────────────────────────────────────────────── */
function timeAgo(d) {
  if (!d) return "";
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)     return "hozir";
  if (s < 3600)   return `${Math.floor(s/60)} daq`;
  if (s < 86400)  return `${Math.floor(s/3600)} soat`;
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

const ST = {
  pending:    { label:"Yangi",          bg:"#E8F4FD", color:"#1877F2" },
  read:       { label:"Ko'rilgan",      bg:"#F0F2F5", color:"#65676B" },
  accepted:   { label:"✓ Qabul",        bg:"#E6F4EA", color:"#31A24C" },
  rejected:   { label:"✗ Rad etildi",   bg:"#FFEBEE", color:"#E53935" },
  in_progress:{ label:"⚡ Jarayonda",   bg:"#FFF8E1", color:"#F57F17" },
  completed:  { label:"✓ Tugallandi",   bg:"#E8F5E9", color:"#2E7D32" },
};

/* ─── Avatar ──────────────────────────────────────────────────── */
function Av({ user, size=40, online=false }) {
  return (
    <div style={{ position:"relative", flexShrink:0, width:size, height:size }}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:`linear-gradient(135deg,${C.red},${C.redDark})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*0.38, fontWeight:700, color:"#fff", overflow:"hidden",
      }}>
        {user?.avatar
          ? <img src={user.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          : initials(user)}
      </div>
      {online && (
        <span style={{
          position:"absolute", bottom:1, right:1,
          width:size*0.28, height:size*0.28, borderRadius:"50%",
          background:C.green, border:`2px solid ${C.surface}`,
        }}/>
      )}
    </div>
  );
}

/* ─── AppRow ──────────────────────────────────────────────────── */
function AppRow({ app, myId, isActive, onClick }) {
  const other   = otherUser(app, myId);
  const isOwner = String(app.adOwner?._id||app.adOwner) === myId;
  const unread  = isOwner ? (app.ownerUnread||0) : (app.applicantUnread||0);
  const st      = ST[app.status] || ST.read;

  return (
    <div onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:11,
      padding:"11px 16px", cursor:"pointer",
      background: isActive ? "#FFF0F0" : "transparent",
      borderLeft: `3px solid ${isActive ? C.red : "transparent"}`,
      transition:"background .12s",
    }}
      onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background="#F9FAFB"; }}
      onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}
    >
      <Av user={other} size={46}/>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:1}}>
          <span style={{fontSize:13.5, fontWeight:700, color:C.text, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", maxWidth:140}}>
            {other?.firstName} {other?.lastName}
          </span>
          <span style={{fontSize:11, color:C.dim, flexShrink:0}}>{timeAgo(app.lastMessageAt||app.updatedAt)}</span>
        </div>
        <div style={{fontSize:11.5, color:C.muted, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", marginBottom:3}}>
          {adTitle(app)}
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:4}}>
          <span style={{fontSize:12, color:C.dim, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", flex:1}}>
            {app.lastMessage || "Xabar yo'q"}
          </span>
          <div style={{display:"flex", gap:4, alignItems:"center", flexShrink:0}}>
            {unread>0 && (
              <span style={{minWidth:18, height:18, borderRadius:99, background:C.red, color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px"}}>
                {unread>9?"9+":unread}
              </span>
            )}
            <span style={{fontSize:10, fontWeight:700, color:st.color, background:st.bg, padding:"2px 6px", borderRadius:6}}>
              {st.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MessageBubble ───────────────────────────────────────────── */
function Bubble({ msg, myId, appId, onEdited, onDeleted, service=applicationService }) {
  const isMine   = String(msg.sender?._id||msg.sender) === myId;
  const [hover,  setHover]  = useState(false);
  const [editing,setEditing]= useState(false);
  const [editTxt,setEditTxt]= useState(msg.text);
  const [saving, setSaving] = useState(false);
  const editRef    = useRef(null);
  const leaveTimer = useRef(null);

  const onEnter = () => { clearTimeout(leaveTimer.current); setHover(true); };
  const onLeave = () => { leaveTimer.current = setTimeout(() => setHover(false), 180); };

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

  if (msg.deleted) {
    return (
      <div style={{display:"flex", justifyContent:isMine?"flex-end":"flex-start", padding:"1px 0"}}>
        <span style={{
          fontSize:12.5, color:C.dim, fontStyle:"italic",
          padding:"7px 14px", borderRadius:18,
          background:"#F0F2F5", border:"1px dashed #DDD",
          display:"flex", alignItems:"center", gap:6,
        }}>
          <LuBan size={12}/> Xabar o'chirildi
        </span>
      </div>
    );
  }

  return (
    <div
      style={{display:"flex", justifyContent:isMine?"flex-end":"flex-start", padding:"2px 0", gap:8, alignItems:"flex-end"}}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {!isMine && <Av user={msg.sender} size={30}/>}

      {/* Action buttons — left of bubble for mine messages */}
      {isMine && hover && !editing && !msg._pending && !msg.deleted && (
        <div
          style={{
            display:"flex", gap:3, alignItems:"center", flexShrink:0,
            background:"#fff", borderRadius:10, padding:"3px 5px",
            boxShadow:"0 2px 10px rgba(0,0,0,.13)", border:`1px solid ${C.border}`,
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <button type="button" onClick={()=>{ setEditing(true); setEditTxt(msg.text); }}
            title="Tahrirlash"
            style={{width:26,height:26,border:"none",background:"none",cursor:"pointer",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#F0F2F5";e.currentTarget.style.color=C.blue;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.muted;}}
          ><LuPencil size={13}/></button>
          <button type="button" onClick={doDelete}
            title="O'chirish"
            style={{width:26,height:26,border:"none",background:"none",cursor:"pointer",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#FFEBEE";e.currentTarget.style.color=C.red;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.muted;}}
          ><LuTrash2 size={13}/></button>
        </div>
      )}

      <div style={{maxWidth:"68%", position:"relative"}}>

        {editing ? (
          <div style={{background:"#fff",border:`2px solid ${C.red}`,borderRadius:14,overflow:"hidden",minWidth:200}}>
            <textarea
              ref={editRef}
              value={editTxt}
              onChange={e=>setEditTxt(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();saveEdit();} if(e.key==="Escape") setEditing(false); }}
              rows={2}
              style={{width:"100%",padding:"10px 12px",border:"none",outline:"none",resize:"none",fontSize:13.5,fontFamily:"inherit",boxSizing:"border-box"}}
            />
            <div style={{display:"flex",gap:6,padding:"6px 10px",borderTop:`1px solid ${C.border}`,background:"#FAFAFA"}}>
              <button onClick={saveEdit} disabled={saving}
                style={{flex:1,padding:"5px",borderRadius:8,border:"none",background:C.red,color:"#fff",fontSize:12,fontWeight:700,cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                {saving?<LuLoader size={11} style={{animation:"spin .8s linear infinite"}}/>:<LuCheck size={11}/>} Saqlash
              </button>
              <button onClick={()=>setEditing(false)}
                style={{flex:1,padding:"5px",borderRadius:8,border:`1px solid ${C.border}`,background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",color:C.muted}}>
                Bekor
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            padding:"9px 13px",
            borderRadius: isMine?"18px 18px 4px 18px":"18px 18px 18px 4px",
            background: isMine ? `linear-gradient(135deg,${C.red},${C.redDark})` : C.their,
            color: isMine ? C.mineTxt : C.theirTxt,
            fontSize:13.5, lineHeight:1.55, wordBreak:"break-word",
            boxShadow: isMine ? "0 1px 4px rgba(229,57,53,.3)" : "0 1px 2px rgba(0,0,0,.06)",
            opacity: msg._pending ? 0.6 : 1,
          }}>
            {/* sticker — big */}
            {/^[\u{1F300}-\u{1FAFF}]{1,3}$/u.test(msg.text.trim()) ? (
              <span style={{fontSize:36, lineHeight:1}}>{msg.text}</span>
            ) : (
              <span style={{whiteSpace:"pre-wrap"}}>{msg.text}</span>
            )}
            <div style={{fontSize:10, marginTop:4, textAlign:"right", opacity:0.72, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:3}}>
              {msg.edited && <span style={{fontStyle:"italic"}}>tahrirlangan</span>}
              {fmtTime(msg.createdAt)}
              {isMine && !msg._pending && (msg.isRead ? <LuCheckCheck size={11}/> : <LuCheck size={11}/>)}
              {msg._pending && <LuLoader size={10} style={{animation:"spin .8s linear infinite"}}/>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ChatPanel ───────────────────────────────────────────────── */
function ChatPanel({ app, myId, onStatusChange, onBack, type="application", service=applicationService }) {
  // Socket event/room names differ for orders vs applications
  const isOrder   = type === "order";
  const joinEvt   = isOrder ? "join_order_room"  : "join_chat_room";
  const leaveEvt  = isOrder ? "leave_order_room" : "leave_chat_room";
  const newMsgEvt = isOrder ? "new_order_message"         : "new_chat_message";
  const editedEvt = isOrder ? "order_message_edited"      : "message_edited";
  const deletedEvt= isOrder ? "order_message_deleted"     : "message_deleted";
  const readEvt   = isOrder ? "order_messages_read"       : "messages_read";
  const statusEvt = isOrder ? "order_status_changed"      : "application_status_changed";
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

  /* scroll to bottom — only within the messages container */
  const scrollDown = useCallback((instant=false) => {
    if(!msgsRef.current) return;
    msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  },[]);

  /* fetch */
  const fetchMessages = useCallback(async () => {
    try {
      const res = await service.messages(app._id);
      setMessages(res.data||[]);
      setIBlockedThem(res.iBlockedThem||false);
      setTheyBlockedMe(res.theyBlockedMe||false);
    } catch { toast.error("Xabarlarni yuklashda xatolik"); }
    finally { setLoading(false); }
  },[app._id, service]);

  /* block / unblock */
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

  /* socket */
  useEffect(()=>{
    const s = getSocket();
    s.emit(joinEvt, app._id);

    const idKey = isOrder ? "orderId" : "applicationId";
    const onNewMsg = (payload)=>{
      if(String(payload[idKey])!==String(app._id)) return;
      const message = payload.message;
      setMessages(p=>{ if(p.some(m=>m._id===message._id)) return p; return [...p, message]; });
      setTimeout(scrollDown, 60);
    };
    const onEdited = (payload)=>{
      if(String(payload[idKey])!==String(app._id)) return;
      setMessages(p=>p.map(m=>m._id===payload.messageId?{...m,text:payload.text,edited:true}:m));
    };
    const onDeleted = (payload)=>{
      if(String(payload[idKey])!==String(app._id)) return;
      setMessages(p=>p.map(m=>m._id===payload.messageId?{...m,deleted:true}:m));
    };
    const onStatus = (payload)=>{
      const cid = payload[idKey] || payload.applicationId || payload.orderId;
      if(String(cid)===String(app._id)) onStatusChange(app._id, payload.status);
    };
    const onRead = (payload)=>{
      const cid = payload[idKey] || payload.applicationId || payload.orderId;
      if(String(cid)!==String(app._id)) return;
      setMessages(p=>p.map(m=>String(m.sender?._id||m.sender)===myId?{...m,isRead:true}:m));
    };
    const onUserBlocked = (payload)=>{
      const cid = payload.applicationId||payload.orderId;
      if(String(cid)===String(app._id)) setTheyBlockedMe(true);
    };
    const onUserUnblocked = (payload)=>{
      const cid = payload.applicationId||payload.orderId;
      if(String(cid)===String(app._id)) setTheyBlockedMe(false);
    };

    s.on(newMsgEvt,  onNewMsg);
    s.on(editedEvt,  onEdited);
    s.on(deletedEvt, onDeleted);
    s.on(statusEvt,  onStatus);
    s.on(readEvt,    onRead);
    s.on('user_blocked',   onUserBlocked);
    s.on('user_unblocked', onUserUnblocked);

    return ()=>{
      s.emit(leaveEvt, app._id);
      s.off(newMsgEvt,  onNewMsg);
      s.off(editedEvt,  onEdited);
      s.off(deletedEvt, onDeleted);
      s.off(statusEvt,  onStatus);
      s.off(readEvt,    onRead);
      s.off('user_blocked',   onUserBlocked);
      s.off('user_unblocked', onUserUnblocked);
    };
  },[app._id, onStatusChange, scrollDown, isOrder, newMsgEvt, editedEvt, deletedEvt, statusEvt, readEvt, joinEvt, leaveEvt]);

  /* optimistic send */
  const sendMessage = useCallback(async (txt) => {
    const trimmed = (txt??text).trim();
    if(!trimmed || sending) return;
    setText("");
    setShowStk(false);
    // reset textarea height
    if(inputRef.current){ inputRef.current.style.height="auto"; }

    const tempId = `tmp-${Date.now()}`;
    const tempMsg = {
      _id:       tempId,
      text:      trimmed,
      sender:    { _id:myId, firstName:user?.firstName, lastName:user?.lastName, avatar:user?.avatar },
      createdAt: new Date().toISOString(),
      isRead:    false,
      _pending:  true,
    };
    setMessages(p=>[...p, tempMsg]);
    setTimeout(scrollDown, 50);

    try {
      const res = await service.send(app._id, trimmed);
      setMessages(p => {
        const filtered = p.filter(m => m._id !== tempId);
        if (filtered.some(m => m._id === res.data._id)) return filtered;
        return [...filtered, res.data];
      });
    } catch {
      setMessages(p=>p.filter(m=>m._id!==tempId));
      setText(trimmed);
      toast.error("Xabar yuborishda xatolik");
    }
  },[text, sending, myId, user, app._id, scrollDown]);

  const handleKey = (e)=>{
    if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(); }
  };

  const handleStatus = async (status) => {
    try {
      await service.status(app._id, status);
      onStatusChange(app._id, status);
      const msgs = { accepted:"Qabul qilindi", rejected:"Rad etildi", in_progress:"Jarayonda", completed:"Tugallandi" };
      toast.success(msgs[status] || "Status yangilandi");
    } catch { toast.error("Xatolik"); }
  };

  const handleEdited  = (id,txt) => setMessages(p=>p.map(m=>m._id===id?{...m,text:txt,edited:true}:m));
  const handleDeleted = (id)     => setMessages(p=>p.map(m=>m._id===id?{...m,deleted:true,text:''}:m));

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:C.surface,position:"relative"}}>

      {/* ── Header ── */}
      <div style={{
        padding:"13px 16px", borderBottom:`1px solid ${C.border}`,
        display:"flex", alignItems:"center", gap:10, flexShrink:0,
        background:C.surface, zIndex:2,
      }}>
        <button type="button" onClick={onBack}
          style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:4,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <LuChevronLeft size={22}/>
        </button>
        <Av user={other} size={42} online/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text}}>{other?.firstName} {other?.lastName}</div>
          <div style={{fontSize:11.5,color:C.muted,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{adTitle(app)}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:11,fontWeight:700,color:st.color,background:st.bg,padding:"3px 9px",borderRadius:99,border:`1px solid ${st.color}22`}}>
            {st.label}
          </span>
          {isOwner && !["accepted","rejected","completed"].includes(app.status) && (
            <div style={{display:"flex",gap:5}}>
              {app.status !== "in_progress" && <>
                <button onClick={()=>handleStatus("accepted")}
                  style={{padding:"5px 11px",fontSize:11.5,fontWeight:700,borderRadius:8,border:"1.5px solid #A5D6A7",background:"#E8F5E9",color:C.green,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <LuCheck size={12}/> Qabul
                </button>
                <button onClick={()=>handleStatus("rejected")}
                  style={{padding:"5px 11px",fontSize:11.5,fontWeight:700,borderRadius:8,border:`1.5px solid ${C.redBd}`,background:C.redLight,color:C.red,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <LuX size={12}/> Rad
                </button>
              </>}
              {isOrder && app.status === "accepted" && (
                <button onClick={()=>handleStatus("in_progress")}
                  style={{padding:"5px 11px",fontSize:11.5,fontWeight:700,borderRadius:8,border:"1.5px solid #FFC107",background:"#FFF8E1",color:"#F57F17",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  ⚡ Boshlash
                </button>
              )}
              {isOrder && app.status === "in_progress" && (
                <button onClick={()=>handleStatus("completed")}
                  style={{padding:"5px 11px",fontSize:11.5,fontWeight:700,borderRadius:8,border:"1.5px solid #A5D6A7",background:"#E8F5E9",color:C.green,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  ✓ Tugatish
                </button>
              )}
            </div>
          )}
          {/* Block / Unblock tugmasi */}
          <button
            onClick={handleBlock}
            disabled={blockLoading || theyBlockedMe}
            title={iBlockedThem ? "Blokdan chiqarish" : "Bloklash"}
            style={{
              width:32, height:32, borderRadius:8, border:"none", cursor: theyBlockedMe ? "not-allowed" : "pointer",
              background: iBlockedThem ? "#FFF3E0" : theyBlockedMe ? "#F5F5F5" : C.redLight,
              color: iBlockedThem ? "#E65100" : theyBlockedMe ? C.dim : C.red,
              display:"flex", alignItems:"center", justifyContent:"center",
              opacity: blockLoading ? 0.6 : 1, flexShrink:0, transition:"all .15s",
            }}
          >
            {blockLoading
              ? <LuLoader size={14} style={{animation:"spin .8s linear infinite"}}/>
              : <LuBan size={14}/>
            }
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={msgsRef} style={{
        flex:1, overflowY:"auto", overflowX:"hidden",
        padding:"16px 18px", display:"flex", flexDirection:"column", gap:4,
        background: "#F8F9FA",
        scrollbarWidth:"thin", scrollbarColor:`${C.dim} transparent`,
      }}>
        {loading ? (
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:100}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <LuLoader size={26} style={{color:C.red,animation:"spin 1s linear infinite"}}/>
              <span style={{fontSize:12,color:C.muted}}>Yuklanmoqda...</span>
            </div>
          </div>
        ) : messages.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:C.redLight,border:`2px solid ${C.redBd}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:30}}>
              💬
            </div>
            <p style={{fontSize:14,fontWeight:700,color:C.text,margin:"0 0 4px"}}>Suhbatni boshlang</p>
            <p style={{fontSize:12.5,color:C.muted,margin:0}}>Birinchi xabarni yuboring</p>
          </div>
        ) : (
          <>
            {messages.map(msg=>(
              <Bubble
                key={msg._id}
                msg={msg}
                myId={myId}
                appId={app._id}
                onEdited={handleEdited}
                onDeleted={handleDeleted}
                service={service}
              />
            ))}
          </>
        )}
      </div>

      {/* ── Sticker panel ── */}
      {showStk && (
        <div style={{
          position:"absolute", bottom:72, left:0, right:0,
          background:C.surface, borderTop:`1px solid ${C.border}`,
          padding:"12px 14px", zIndex:10,
          boxShadow:"0 -4px 20px rgba(0,0,0,.08)",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:700,color:C.muted}}>Stikerlar</span>
            <button type="button" onClick={()=>setShowStk(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,display:"flex"}}>
              <LuX size={14}/>
            </button>
          </div>
          {STICKER_ROWS.map((row,i)=>(
            <div key={i} style={{display:"flex",gap:4,marginBottom:4}}>
              {row.map(em=>(
                <button type="button" key={em} onClick={()=>sendMessage(em)}
                  style={{
                    width:38,height:38,fontSize:20,border:`1px solid ${C.border}`,
                    borderRadius:10,background:C.surface,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"transform .1s, background .1s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.redLight;e.currentTarget.style.transform="scale(1.18)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.surface;e.currentTarget.style.transform="scale(1)";}}
                >{em}</button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Blocked banner ── */}
      {isBlocked && (
        <div style={{
          padding:"10px 16px", borderTop:`1px solid ${C.border}`,
          background: iBlockedThem ? "#FFF3E0" : "#FAFAFA",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8, flexShrink:0,
        }}>
          <LuBan size={15} style={{color: iBlockedThem ? "#E65100" : C.dim, flexShrink:0}}/>
          <span style={{fontSize:12.5, fontWeight:600, color: iBlockedThem ? "#E65100" : C.muted}}>
            {iBlockedThem
              ? `Siz ${other?.firstName}ni bloklagan siz. Xabar yubora olmaysiz.`
              : `${other?.firstName} sizni bloklagan. Xabar yubora olmaysiz.`
            }
          </span>
          {iBlockedThem && (
            <button onClick={handleBlock} disabled={blockLoading}
              style={{padding:"4px 10px",fontSize:11.5,fontWeight:700,borderRadius:8,border:"1.5px solid #E65100",background:"#FFF3E0",color:"#E65100",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              Blokdan chiqar
            </button>
          )}
        </div>
      )}

      {/* ── Input ── */}
      {!isBlocked && <div style={{
        padding:"10px 14px", borderTop:`1px solid ${C.border}`,
        display:"flex", gap:8, alignItems:"flex-end", flexShrink:0,
        background:C.surface, zIndex:2,
      }}>
        {/* Sticker toggle */}
        <button type="button" onClick={()=>setShowStk(v=>!v)}
          title="Stikerlar"
          style={{
            width:40, height:40, borderRadius:12, border:`1.5px solid ${showStk ? C.red : C.border}`,
            background: showStk ? C.redLight : C.surface, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            color: showStk ? C.red : C.muted, flexShrink:0, transition:"all .15s",
          }}>
          <LuSmile size={18}/>
        </button>

        {/* Textarea */}
        <div style={{flex:1,position:"relative"}}>
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
              width:"100%", padding:"10px 14px",
              border:`1.5px solid ${C.border}`, borderRadius:22,
              fontSize:13.5, outline:"none", resize:"none",
              fontFamily:"inherit", lineHeight:1.5, maxHeight:120,
              background:"#F0F2F5", color:C.text,
              transition:"border-color .2s, background .2s",
              boxSizing:"border-box", display:"block",
            }}
            onFocus={e=>{ e.target.style.borderColor=C.red; e.target.style.background=C.surface; }}
            onBlur={e=>{ e.target.style.borderColor=C.border; e.target.style.background="#F0F2F5"; }}
          />
        </div>

        {/* Send */}
        <button type="button"
          onClick={()=>sendMessage()}
          disabled={!text.trim()}
          style={{
            width:40, height:40, borderRadius:12, border:"none", flexShrink:0,
            background: text.trim() ? `linear-gradient(135deg,${C.red},${C.redDark})` : "#F0F2F5",
            color: text.trim() ? "#fff" : C.dim,
            cursor: text.trim() ? "pointer" : "not-allowed",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all .15s",
            boxShadow: text.trim() ? "0 3px 10px rgba(229,57,53,.4)" : "none",
          }}
        >
          <LuSend size={16}/>
        </button>
      </div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function MyApplications() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams   = new URLSearchParams(location.search);
  const defaultTab     = searchParams.get("tab") === "orders" ? "orders" : "received";
  const initialOrderId = searchParams.get("orderId") || null;

  const [tab,      setTab]      = useState(defaultTab);
  const [received, setReceived] = useState([]);
  const [sent,     setSent]     = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState("application"); // "application" | "order"
  const [showChat, setShowChat] = useState(false);
  const autoSelectedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(()=>{
    const h = ()=>setIsMobile(window.innerWidth<=640);
    window.addEventListener('resize',h);
    return ()=>window.removeEventListener('resize',h);
  },[]);

  useEffect(()=>{ if(!token) navigate("/kirish"); },[token,navigate]);

  const loadReceived = useCallback(async ()=>{
    try { const r=await applicationService.received(); setReceived(r.data||[]); } catch{}
  },[]);
  const loadSent = useCallback(async ()=>{
    try { const r=await applicationService.sent(); setSent(r.data||[]); } catch{}
  },[]);
  const loadOrders = useCallback(async ()=>{
    try { const r=await orderService.myOrders(); setOrders(r.data||[]); } catch{}
  },[]);

  useEffect(()=>{
    if(!user?._id) return;
    const s = connectSocket(user._id);
    const onLastMsg = ({applicationId, message})=>{
      const update = arr => arr.map(a =>
        a._id===applicationId
          ? { ...a, lastMessage:message?.text||'', lastMessageAt:message?.createdAt }
          : a
      );
      setReceived(p=>update(p));
      setSent(p=>update(p));
    };
    const onOrderMsg = ({orderId, message})=>{
      setOrders(p=>p.map(a=>
        a._id===orderId
          ? { ...a, lastMessage:message?.text||'', lastMessageAt:message?.createdAt }
          : a
      ));
    };
    s.on('new_application', loadReceived);
    s.on('new_chat_message', onLastMsg);
    s.on('new_order', loadOrders);
    s.on('new_order_message', onOrderMsg);
    return ()=>{
      s.off('new_application', loadReceived);
      s.off('new_chat_message', onLastMsg);
      s.off('new_order', loadOrders);
      s.off('new_order_message', onOrderMsg);
    };
  },[user?._id, loadReceived, loadOrders]);

  useEffect(()=>{
    if(!token) return;
    setLoading(true);
    Promise.all([loadReceived(),loadSent(),loadOrders()]).finally(()=>setLoading(false));
  },[token,loadReceived,loadSent,loadOrders]);

  /* Normalize order → app-like object for ChatPanel */
  const normalizeOrder = useCallback((order)=>({
    ...order,
    adOwner:        order.blogger,
    applicant:      order.business,
    ownerUnread:    order.bloggerUnread,
    applicantUnread:order.businessUnread,
    _isOrder:       true,
    _projectName:   order.projectName,
  }),[]);

  const handleSelect = (app)=>{
    setSelected(app); setSelectedType("application"); setShowChat(true);
    const myId = String(user._id);
    const isOwner = String(app.adOwner?._id||app.adOwner)===myId;
    if(isOwner){
      setReceived(p=>p.map(a=>a._id===app._id?{...a,ownerUnread:0,status:a.status==='pending'?'read':a.status}:a));
    } else {
      setSent(p=>p.map(a=>a._id===app._id?{...a,applicantUnread:0}:a));
    }
  };

  const handleSelectOrder = (order)=>{
    const norm = normalizeOrder(order);
    setSelected(norm); setSelectedType("order"); setShowChat(true);
    const myId = String(user._id);
    const isBlogger = String(order.blogger?._id||order.blogger)===myId;
    if(isBlogger){
      setOrders(p=>p.map(a=>a._id===order._id?{...a,bloggerUnread:0,status:a.status==='pending'?'read':a.status}:a));
    } else {
      setOrders(p=>p.map(a=>a._id===order._id?{...a,businessUnread:0}:a));
    }
  };

  const handleStatusChange = useCallback((id,status)=>{
    const f = a=>a._id===id?{...a,status}:a;
    setReceived(p=>p.map(f)); setSent(p=>p.map(f)); setOrders(p=>p.map(f));
    setSelected(p=>p?._id===id?{...p,status}:p);
  },[]);

  /* ── Auto-select order from URL ?orderId=... ── */
  useEffect(()=>{
    if (!initialOrderId || autoSelectedRef.current || orders.length === 0) return;
    const order = orders.find(o => o._id === initialOrderId);
    if (order) {
      autoSelectedRef.current = true;
      setTab("orders");
      handleSelectOrder(order);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[orders, initialOrderId]);

  const myId = String(user?._id||"");
  const ordersUnread = orders.reduce((s,o)=>{
    const isBlogger = String(o.blogger?._id||o.blogger)===myId;
    return s+(isBlogger?(o.bloggerUnread||0):(o.businessUnread||0));
  },0);
  const list = tab==="received" ? received : tab==="sent" ? sent : orders;
  const totalUnread = received.reduce((s,a)=>s+(a.ownerUnread||0),0)
                    + sent.reduce((s,a)=>s+(a.applicantUnread||0),0)
                    + ordersUnread;

  if(!token||!user) return null;

  return (
    <div style={{fontFamily:"'Inter',sans-serif",height:"calc(100vh - 130px)",display:"flex",flexDirection:"column",gap:0}}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Page header ── */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,flexShrink:0}}>
        <div style={{width:40,height:40,borderRadius:12,background:C.redLight,border:`1.5px solid ${C.redBd}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <LuMessageCircle size={20} style={{color:C.red}}/>
        </div>
        <div>
          <h1 style={{fontSize:20,fontWeight:800,color:C.text,margin:0,display:"flex",alignItems:"center",gap:8}}>
            Mening Zayavkalarim
            {totalUnread>0 && (
              <span style={{minWidth:22,height:22,borderRadius:99,background:C.red,color:"#fff",fontSize:11,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"0 6px"}}>
                {totalUnread}
              </span>
            )}
          </h1>
          <p style={{fontSize:12,color:C.muted,margin:0}}>Kelgan va yuborgan zayavkalaringiz</p>
        </div>
        <button onClick={()=>{loadReceived();loadSent();}}
          style={{marginLeft:"auto",width:36,height:36,border:`1.5px solid ${C.border}`,borderRadius:10,background:C.surface,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>
          <LuRefreshCw size={15}/>
        </button>
      </div>

      {/* ── Layout ── */}
      <div style={{
        flex:1, display:"flex", minHeight:0,
        flexDirection: isMobile ? "column" : "row",
        background:C.surface,
        border:`1.5px solid ${C.border}`,
        borderRadius:18, overflow:"hidden",
        boxShadow:"0 2px 20px rgba(0,0,0,.06)",
      }}>

        {/* Sidebar */}
        <div style={{
          width: isMobile ? "100%" : 320,
          borderRight: isMobile ? "none" : `1px solid ${C.border}`,
          display: isMobile && showChat ? "none" : "flex",
          flexDirection:"column", flexShrink:0,
          background:C.surface,
        }}>
          {/* Tabs */}
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0,padding:"0 4px",paddingTop:8,gap:2}}>
            {[
              {key:"received",label:"Kelgan",    Icon:LuInbox,         cnt:received.reduce((s,a)=>s+(a.ownerUnread||0),0),   len:received.length},
              {key:"sent",    label:"Yuborgan",  Icon:LuSendHorizontal,cnt:sent.reduce((s,a)=>s+(a.applicantUnread||0),0),    len:sent.length},
              {key:"orders",  label:"Buyurtma",  Icon:LuBriefcase,     cnt:ordersUnread, len:orders.length},
            ].map(({key,label,Icon,cnt,len})=>(
              <button key={key} onClick={()=>setTab(key)} style={{
                flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:4,
                padding:"9px 4px 10px", border:"none", background:"none", cursor:"pointer",
                fontSize:12, fontWeight:tab===key?700:500,
                color:tab===key?C.red:C.muted,
                borderBottom:tab===key?`2.5px solid ${C.red}`:"2.5px solid transparent",
                borderRadius:"8px 8px 0 0", transition:"color .15s",
              }}>
                <Icon size={13}/>
                {label}
                <span style={{fontSize:10,color:C.dim,fontWeight:500}}>({len})</span>
                {cnt>0 && (
                  <span style={{minWidth:16,height:16,borderRadius:99,background:C.red,color:"#fff",fontSize:9,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>
                    {cnt>9?"9+":cnt}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{flex:1,overflowY:"auto",scrollbarWidth:"thin",scrollbarColor:`${C.dim} transparent`}}>
            {loading ? (
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:120}}>
                <LuLoader size={24} style={{color:C.red,animation:"spin 1s linear infinite"}}/>
              </div>
            ) : list.length===0 ? (
              <div style={{textAlign:"center",padding:"52px 20px",color:C.muted}}>
                <div style={{fontSize:44,marginBottom:12}}>{tab==="received"?"📥":tab==="orders"?"📋":"📤"}</div>
                <p style={{fontSize:13.5,fontWeight:700,color:C.text,margin:"0 0 5px"}}>
                  {tab==="received"?"Kelgan zayavka yo'q":tab==="orders"?"Buyurtma yo'q":"Yuborgan zayavka yo'q"}
                </p>
                <p style={{fontSize:12.5,margin:0,lineHeight:1.5}}>
                  {tab==="received"
                    ? "E'lonlaringizga zayavka kelganida bu yerda ko'rasiz"
                    : tab==="orders"
                    ? <><Link to="/blogerlar" style={{color:C.red,fontWeight:600}}>Bloggerlar</Link> sahifasidan buyurtma bering</>
                    : <><Link to="/elonlar" style={{color:C.red,fontWeight:600}}>E'lonlar</Link> sahifasidan zayavka yuboring</>}
                </p>
              </div>
            ) : tab==="orders" ? (
              orders.map(order=>{
                const norm = normalizeOrder(order);
                const isBlogger = String(order.blogger?._id||order.blogger)===myId;
                const unread = isBlogger?(order.bloggerUnread||0):(order.businessUnread||0);
                return (
                  <AppRow
                    key={order._id}
                    app={{
                      ...norm,
                      ownerUnread: isBlogger ? unread : 0,
                      applicantUnread: !isBlogger ? unread : 0,
                    }}
                    myId={myId}
                    isActive={selected?._id===order._id}
                    onClick={()=>handleSelectOrder(order)}
                  />
                );
              })
            ) : (
              list.map(app=>(
                <AppRow
                  key={app._id}
                  app={app}
                  myId={myId}
                  isActive={selected?._id===app._id}
                  onClick={()=>handleSelect(app)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat */}
        <div style={{
          flex:1, display: isMobile && !showChat ? "none" : "flex",
          flexDirection:"column", minWidth:0,
        }}>
          {selected ? (
            <ChatPanel
              key={selected._id}
              app={selected}
              myId={myId}
              onStatusChange={handleStatusChange}
              onBack={()=>{ setShowChat(false); setSelected(null); }}
              type={selectedType}
              service={selectedType==="order" ? orderService : applicationService}
            />
          ) : (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:40,background:"#F8F9FA"}}>
              <div style={{width:80,height:80,borderRadius:"50%",background:C.redLight,border:`2px solid ${C.redBd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>
                💬
              </div>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:15,fontWeight:700,color:C.text,margin:"0 0 5px"}}>Chat tanlang</p>
                <p style={{fontSize:13,color:C.muted,margin:0}}>Chap tarafdan zayavka tanlab muloqot boshlang</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
