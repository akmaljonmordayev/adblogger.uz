import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiUsers,
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiAlertCircle,
  FiStar,
  FiRefreshCw,
  FiSend,
  FiX,
  FiChevronDown,
  FiInbox,
  FiFlag,
  FiMoreHorizontal,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiChevronRight,
  FiZap,
  FiArrowUpRight,
  FiMenu,
} from "react-icons/fi";
import { BsStarFill, BsStar, BsCheckAll } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";

// ═══════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════
const MOCK = [
  {
    id: 1,
    name: "Alexander Ivanov",
    email: "alex.ivanov@mail.ru",
    subject: "Question about order #4821",
    message:
      "Hello! I wanted to clarify the status of my order. It's been 5 days since payment, but the item has not arrived yet. Can you specify the delivery times? The order was paid by Visa card, I am attaching the receipt to the letter.",
    date: "2026-04-18T09:23:00",
    status: "new",
    starred: true,
    priority: "high",
    avatar: "AI",
    category: "Delivery",
    read: false,
    replies: [],
  },
  {
    id: 2,
    name: "Maria Petrova",
    email: "maria.p@gmail.com",
    subject: "Suggestion for website improvement",
    message:
      "Good afternoon! I have been using your service for over a year. I want to suggest adding a product comparison function — this would really help when choosing. It would also be convenient to add filtering by color. Thanks for your attention!",
    date: "2026-04-17T14:05:00",
    status: "read",
    starred: false,
    priority: "low",
    avatar: "MP",
    category: "Suggestion",
    read: true,
    replies: [
      {
        author: "Support",
        text: "Maria, thanks for the suggestion! We have passed it on to the development team.",
        date: "2026-04-17T15:30:00",
      },
    ],
  },
  {
    id: 3,
    name: "Dmitry Kozlov",
    email: "d.kozlov@yandex.ru",
    subject: "Product return — urgent",
    message:
      "Please process a product return. I received the wrong size, although I specified the correct one in the order. Ready to send a photo of the defect. Please contact me by phone during business hours. Waiting for a reply within 24 hours.",
    date: "2026-04-17T11:30:00",
    status: "pending",
    starred: true,
    priority: "high",
    avatar: "DK",
    category: "Return",
    read: true,
    replies: [],
  },
  {
    id: 4,
    name: "Anna Sidorova",
    email: "anna.sid@outlook.com",
    subject: "Partnership cooperation",
    message:
      "Good day! I represent TechBridge company. We are interested in long-term partnership and are ready to discuss terms of joint work on favorable conditions for both parties. We await your reply.",
    date: "2026-04-16T16:48:00",
    status: "answered",
    starred: false,
    priority: "normal",
    avatar: "AS",
    category: "Partnership",
    read: true,
    replies: [
      {
        author: "Manager",
        text: "Anna, we have sent your proposal to the director. We will reply within 3 business days.",
        date: "2026-04-16T18:00:00",
      },
    ],
  },
  {
    id: 5,
    name: "Igor Fedorov",
    email: "igor.fed@mail.ru",
    subject: "Technical glitch during payment",
    message:
      "When trying to pay for the order, the money was debited, but the order was not created. Amount: 3,450 rubles. Transaction #TX-8821-FEED. Please resolve this and refund the funds or confirm the order as soon as possible.",
    date: "2026-04-16T08:12:00",
    status: "new",
    starred: true,
    priority: "high",
    avatar: "IF",
    category: "Payment",
    read: false,
    replies: [],
  },
  {
    id: 6,
    name: "Elena Volkova",
    email: "e.volkova@rambler.ru",
    subject: "Gratitude for support work",
    message:
      "I want to express my gratitude to your support service! Employee Mikhail solved my problem in literally 10 minutes. It is very pleasant to work with such a team. I will definitely recommend you to my friends!",
    date: "2026-04-15T19:55:00",
    status: "read",
    starred: false,
    priority: "low",
    avatar: "EV",
    category: "Feedback",
    read: true,
    replies: [],
  },
  {
    id: 7,
    name: "Sergey Morozov",
    email: "morozov.s@corp.ru",
    subject: "Wholesale purchase — price request",
    message:
      "Hello! Interested in a wholesale purchase of 500 units or more of goods in the 'Electronics' category. Please provide a price list and terms of work with legal entities.",
    date: "2026-04-15T12:20:00",
    status: "pending",
    starred: false,
    priority: "normal",
    avatar: "SM",
    category: "Wholesale",
    read: false,
    replies: [],
  },
  {
    id: 8,
    name: "Tatiana Belova",
    email: "t.belova@yandex.ru",
    subject: "Promo code for discount did not arrive",
    message:
      "Registered on the site and was supposed to receive a promo code for a 15% discount, but the letter never arrived. Checked the 'Spam' folder — also empty. Help, please!",
    date: "2026-04-14T17:10:00",
    status: "answered",
    starred: false,
    priority: "normal",
    avatar: "TB",
    category: "Promotions",
    read: true,
    replies: [
      {
        author: "Support",
        text: "Tatiana, your promo code is: WELCOME15. We apologize for the delay!",
        date: "2026-04-14T17:45:00",
      },
    ],
  },
];

// ═══════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════
const STATUS_CFG = {
  new: {
    label: "New",
    dot: "bg-red-500",
    pill: "bg-red-50 text-red-600 border-red-200",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  read: {
    label: "Read",
    dot: "bg-slate-400",
    pill: "bg-slate-100 text-slate-500 border-slate-200",
  },
  answered: {
    label: "Answered",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const CAT_COLORS = {
  Delivery: "bg-blue-100 text-blue-700",
  Suggestion: "bg-violet-100 text-violet-700",
  Return: "bg-orange-100 text-orange-700",
  Partnership: "bg-teal-100 text-teal-700",
  Payment: "bg-red-100 text-red-700",
  Feedback: "bg-green-100 text-green-700",
  Wholesale: "bg-indigo-100 text-indigo-700",
  Promotions: "bg-pink-100 text-pink-700",
};

const CAT_DOTS = {
  Delivery: "bg-blue-400",
  Suggestion: "bg-violet-400",
  Return: "bg-orange-400",
  Partnership: "bg-teal-400",
  Payment: "bg-red-400",
  Feedback: "bg-green-400",
  Wholesale: "bg-indigo-400",
  Promotions: "bg-pink-400",
};

const AVATAR_GRADIENTS = [
  "from-red-500 to-rose-600",
  "from-rose-500 to-pink-600",
  "from-red-600 to-red-800",
  "from-pink-500 to-rose-500",
  "from-red-400 to-rose-500",
  "from-rose-600 to-red-700",
  "from-red-700 to-rose-800",
  "from-rose-400 to-pink-500",
];

const getGrad = (id) => AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length];

function fmtShort(iso) {
  const d = new Date(iso),
    diff = Date.now() - d;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h`;
  const days = Math.floor(diff / 86_400_000);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

function fmtFull(iso) {
  return new Date(iso).toLocaleString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ═══════════════════════════════════════════
//  STAT CARD
// ═══════════════════════════════════════════
function StatCard({ icon: Icon, label, value, sub, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-3"
    >
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: accent }}
      />

      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
          style={{ background: accent }}
        >
          <Icon className="text-white text-lg" />
        </div>
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <FiArrowUpRight className="text-[10px]" />
          {sub}
        </span>
      </div>

      <div>
        <p className="text-[24px] md:text-[28px] font-black text-slate-900 tracking-tight leading-none">
          {value}
        </p>
        <p className="text-[11px] text-slate-400 mt-1 font-medium">{label}</p>
      </div>

      <div className="flex items-end gap-0.5 h-7">
        {[35, 60, 45, 80, 55, 90, 65].map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              delay: delay + i * 0.05,
              duration: 0.35,
              ease: "easeOut",
            }}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: accent,
              opacity: 0.12 + i * 0.11,
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
//  MESSAGE ROW
// ═══════════════════════════════════════════
function MsgRow({ msg, active, selected, onSelect, onClick, onStar }) {
  const s = STATUS_CFG[msg.status];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`group relative flex items-start gap-2.5 px-3 py-3 cursor-pointer border-b border-slate-100 transition-all duration-150 select-none
        ${active ? "bg-red-50 border-l-[3px] border-l-red-500" : "hover:bg-slate-50/80 border-l-[3px] border-l-transparent"}
        ${!msg.read ? "" : "opacity-90"}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(msg.id);
        }}
        className={`mt-0.5 shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
          selected
            ? "bg-red-500 border-red-500"
            : "border-slate-200 group-hover:border-slate-400"
        }`}
      >
        {selected && <FiCheck className="text-white text-[9px]" />}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onStar(msg.id);
        }}
        className="mt-0.5 shrink-0 transition-colors"
      >
        {msg.starred ? (
          <BsStarFill className="text-amber-400 text-xs" />
        ) : (
          <BsStar className="text-slate-200 text-xs group-hover:text-slate-400" />
        )}
      </button>

      <div
        className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${getGrad(msg.id)} flex items-center justify-center text-white text-[11px] font-bold shadow-sm`}
      >
        {msg.avatar}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span
            className={`text-[13px] truncate ${!msg.read ? "font-bold text-slate-900" : "font-medium text-slate-600"}`}
          >
            {msg.name}
          </span>
          <span className="shrink-0 text-[10px] text-slate-400 font-medium">
            {fmtShort(msg.date)}
          </span>
        </div>

        <p
          className={`text-[11px] truncate mt-0.5 ${!msg.read ? "font-semibold text-slate-700" : "text-slate-500"}`}
        >
          {msg.subject}
        </p>
        <p className="text-[10px] text-slate-400 truncate mt-0.5">
          {msg.message}
        </p>

        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${s.pill}`}
          >
            <span className={`w-1 h-1 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          {msg.priority === "high" && (
            <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <FiZap className="text-[8px]" />
              Urgent
            </span>
          )}
          <span
            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${CAT_COLORS[msg.category]}`}
          >
            {msg.category}
          </span>
          {msg.replies.length > 0 && (
            <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-0.5">
              <BsCheckAll className="text-emerald-500 text-[10px]" />
              {msg.replies.length}
            </span>
          )}
        </div>
      </div>

      {!msg.read && (
        <div className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" />
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════
//  REPLY MODAL
// ═══════════════════════════════════════════
function ReplyModal({ msg, onClose, onSend }) {
  const [text, setText] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(10,10,20,0.65)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "linear-gradient(135deg,#dc2626,#f43f5e)" }}
        >
          <div>
            <p className="text-sm font-black text-white tracking-tight">
              Reply
            </p>
            <p className="text-xs text-red-200 mt-0.5">
              {msg.name} · {msg.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${getGrad(msg.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
            >
              {msg.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700">{msg.subject}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {msg.message}
              </p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your response..."
            autoFocus
            rows={5}
            className="w-full text-sm text-slate-700 border border-slate-200 rounded-2xl p-4 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none transition-all placeholder:text-slate-300"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {text.length} characters
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (text.trim()) {
                    onSend(text);
                    onClose();
                  }
                }}
                disabled={!text.trim()}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm hover:shadow-md hover:shadow-red-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: text.trim()
                    ? "linear-gradient(135deg,#dc2626,#f43f5e)"
                    : "",
                }}
              >
                <FiSend className="text-xs" />
                Send
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
//  DETAIL PANEL
// ═══════════════════════════════════════════
function DetailPanel({ msg, onClose, onStar, onDelete, onMarkRead, onReply }) {
  const s = STATUS_CFG[msg.status];
  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full bg-white"
    >
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <FiX className="text-sm" />
          </button>

          <span
            className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>

          {msg.priority === "high" && (
            <span className="flex items-center gap-1 text-[11px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              <FiZap className="text-[10px]" />
              Urgent
            </span>
          )}

          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CAT_COLORS[msg.category]}`}
          >
            {msg.category}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMarkRead(msg.id)}
            title={msg.read ? "Unread" : "Read"}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            {msg.read ? (
              <FiEyeOff className="text-sm" />
            ) : (
              <FiEye className="text-sm" />
            )}
          </button>
          <button
            onClick={() => onStar(msg.id)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all"
          >
            {msg.starred ? (
              <BsStarFill className="text-amber-400 text-sm" />
            ) : (
              <BsStar className="text-slate-400 text-sm" />
            )}
          </button>
          <button
            onClick={() => onDelete(msg.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            {msg.subject}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{fmtFull(msg.date)}</p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${getGrad(msg.id)} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}
          >
            {msg.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm">{msg.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{msg.email}</p>
          </div>
          <div className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
            Sender
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-rose-300 rounded-full" />
          <div className="pl-4 py-1">
            <p className="text-sm text-slate-700 leading-relaxed">
              {msg.message}
            </p>
          </div>
        </div>

        {msg.replies.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
                <BsCheckAll className="text-emerald-500 text-xs" />
                Replies · {msg.replies.length}
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {msg.replies.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg,#dc2626,#f43f5e)",
                  }}
                >
                  AD
                </div>
                <div className="flex-1 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl rounded-tl-sm p-3.5 border border-red-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-red-700">
                      {r.author}
                    </span>
                    <span className="text-[10px] text-red-400">
                      {fmtFull(r.date)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {r.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-white">
        <button
          onClick={onReply}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-black text-sm rounded-2xl shadow-sm hover:shadow-lg hover:shadow-red-200 active:scale-[0.99] transition-all duration-200"
          style={{ background: "linear-gradient(135deg,#dc2626,#f43f5e)" }}
        >
          <FiSend className="text-sm" />
          Reply to message
        </button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════
export default function AdminContact() {
  const [msgs, setMsgs] = useState(MOCK);
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [replyOpen, setReplyOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [catFilter, setCatFilter] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (active)
      setActive((prev) => msgs.find((m) => m.id === prev?.id) || null);
  }, [msgs]);

  const counts = {
    all: msgs.length,
    new: msgs.filter((m) => m.status === "new").length,
    unread: msgs.filter((m) => !m.read).length,
    starred: msgs.filter((m) => m.starred).length,
    pending: msgs.filter((m) => m.status === "pending").length,
    answered: msgs.filter((m) => m.status === "answered").length,
  };

  const visible = msgs
    .filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q);
      const matchFilter =
        filter === "all"
          ? true
          : filter === "new"
            ? m.status === "new"
            : filter === "unread"
              ? !m.read
              : filter === "starred"
                ? m.starred
                : filter === "pending"
                  ? m.status === "pending"
                  : filter === "answered"
                    ? m.status === "answered"
                    : true;
      const matchCat = !catFilter || m.category === catFilter;
      return matchSearch && matchFilter && matchCat;
    })
    .sort((a, b) => {
      if (sort === "date") return new Date(b.date) - new Date(a.date);
      if (sort === "name") return a.name.localeCompare(b.name, "en");
      if (sort === "priority") {
        const p = { high: 0, normal: 1, low: 2 };
        return p[a.priority] - p[b.priority];
      }
      return 0;
    });

  const handleStar = (id) =>
    setMsgs((p) =>
      p.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    );
  const handleDelete = (id) => {
    setMsgs((p) => p.filter((m) => m.id !== id));
    if (active?.id === id) setActive(null);
    setSelected((p) => p.filter((x) => x !== id));
  };
  const handleMarkRead = (id) =>
    setMsgs((p) => p.map((m) => (m.id === id ? { ...m, read: !m.read } : m)));
  const handleSelect = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  const handleSelectAll = () =>
    setSelected(
      selected.length === visible.length && visible.length > 0
        ? []
        : visible.map((m) => m.id),
    );
  const handleDeleteSelected = () => {
    setMsgs((p) => p.filter((m) => !selected.includes(m.id)));
    if (active && selected.includes(active.id)) setActive(null);
    setSelected([]);
  };
  const handleMarkAllRead = () => {
    setMsgs((p) =>
      p.map((m) => (selected.includes(m.id) ? { ...m, read: true } : m)),
    );
    setSelected([]);
  };
  const handleClickMsg = (msg) => {
    setActive(msg);
    if (!msg.read) handleMarkRead(msg.id);
  };
  const handleSendReply = (text) => {
    const reply = { author: "Support", text, date: new Date().toISOString() };
    setMsgs((p) =>
      p.map((m) =>
        m.id === active.id
          ? { ...m, status: "answered", replies: [...m.replies, reply] }
          : m,
      ),
    );
  };

  const FILTERS = [
    { key: "all", label: "All", icon: FiInbox, count: counts.all },
    { key: "unread", label: "Unread", icon: FiMail, count: counts.unread },
    { key: "new", label: "New", icon: FiZap, count: counts.new },
    { key: "starred", label: "Starred", icon: FiStar, count: counts.starred },
    { key: "pending", label: "Pending", icon: FiClock, count: counts.pending },
    {
      key: "answered",
      label: "Answered",
      icon: FiCheckCircle,
      count: counts.answered,
    },
  ];

  const SORT_OPTIONS = [
    { key: "date", label: "By Date" },
    { key: "name", label: "By Name" },
    { key: "priority", label: "By Priority" },
  ];

  const STATS_DATA = [
    {
      icon: FiMail,
      label: "Total Messages",
      value: msgs.length,
      sub: "+12%",
      accent: "linear-gradient(135deg,#dc2626,#f43f5e)",
    },
    {
      icon: FiUsers,
      label: "Unique Authors",
      value: msgs.length,
      sub: "+8%",
      accent: "linear-gradient(135deg,#b91c1c,#e11d48)",
    },
    {
      icon: FiAlertCircle,
      label: "New / Pending",
      value: `${counts.new} / ${counts.pending}`,
      sub: "today",
      accent: "linear-gradient(135deg,#991b1b,#dc2626)",
    },
    {
      icon: FiCheckCircle,
      label: "Answered",
      value: counts.answered,
      sub: "+5%",
      accent: "linear-gradient(135deg,#7f1d1d,#b91c1c)",
    },
  ];

  return (
    <div
      className="flex flex-col h-screen bg-[#f7f7f8] overflow-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ════ HEADER ════ */}
      <header className="shrink-0 bg-white border-b border-slate-100 px-4 md:px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebar(true)}
            className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <FiMenu className="text-xl" />
          </button>
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: "linear-gradient(135deg,#dc2626,#f43f5e)" }}
          >
            <FiMail className="text-white text-base" />
          </div>
          <div>
            <h1 className="text-[14px] md:text-[15px] font-black text-slate-900 leading-none tracking-tight">
              Contacts & Appeals
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium mt-0.5">
              Inbox Control Panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {counts.unread > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {counts.unread} unread
            </motion.div>
          )}
          <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <FiRefreshCw className="text-sm" />
          </button>
        </div>
      </header>

      {/* ════ STATS STRIP ════ */}
      <div className="shrink-0 bg-white border-b border-slate-100 px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-red-500 via-red-300 to-transparent" />
          <div className="flex items-center gap-2 shrink-0">
            <HiOutlineSparkles className="text-red-500 text-sm" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500">
              Statistics
            </span>
            <HiOutlineSparkles className="text-red-500 text-sm" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-red-500 via-red-300 to-transparent" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS_DATA.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 0.07} />
          ))}
        </div>
      </div>

      {/* ════ BODY ════ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── SIDEBAR (DESKTOP & MOBILE) ── */}
        <AnimatePresence>
          {mobileSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        <aside
          className={`
          fixed top-0 bottom-0 left-0 z-40 w-56 bg-white border-r border-slate-100 flex flex-col overflow-y-auto transition-transform duration-300
          lg:relative lg:translate-x-0 lg:z-0 lg:w-52
          ${mobileSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex items-center justify-between p-4 lg:hidden border-b">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Menu
            </span>
            <button
              onClick={() => setMobileSidebar(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100"
            >
              <FiX className="text-lg text-slate-500" />
            </button>
          </div>

          <div className="p-3 space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-2">
              Filters
            </p>
            {FILTERS.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(key);
                  setCatFilter(null);
                  setMobileSidebar(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-150 ${
                  filter === key && !catFilter
                    ? "bg-red-50 text-red-600"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`text-sm shrink-0 ${filter === key && !catFilter ? "text-red-500" : ""}`}
                />
                <span className="flex-1 text-left">{label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                      filter === key && !catFilter
                        ? "bg-red-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="h-px bg-slate-100 mx-4 my-1" />

          <div className="p-3 space-y-0.5">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                Categories
              </p>
              {catFilter && (
                <button
                  onClick={() => setCatFilter(null)}
                  className="text-[9px] text-red-500 font-bold hover:text-red-700"
                >
                  Reset
                </button>
              )}
            </div>
            {Object.entries(CAT_COLORS).map(([cat, cls]) => {
              const cnt = msgs.filter((m) => m.category === cat).length;
              if (!cnt) return null;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCatFilter(catFilter === cat ? null : cat);
                    setFilter("all");
                    setMobileSidebar(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium transition-all ${
                    catFilter === cat
                      ? `${cls} font-bold`
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${CAT_DOTS[cat]}`}
                  />
                  <span className="flex-1 text-left truncate">{cat}</span>
                  <span className="text-[9px] font-bold text-slate-400">
                    {cnt}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── MESSAGE LIST ── */}
        <div
          className={`
          flex flex-col bg-white border-r border-slate-100 overflow-hidden transition-all duration-300
          ${active ? "hidden md:flex md:w-[320px] shrink-0" : "flex-1"}
        `}
        >
          <div className="shrink-0 border-b border-slate-100 px-4 py-3 space-y-2.5">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search appeals..."
                className="w-full pl-9 pr-8 py-2 text-[12px] rounded-xl border border-slate-200 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all bg-slate-50 placeholder:text-slate-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  selected.length === visible.length && visible.length > 0
                    ? "bg-red-500 border-red-500"
                    : "border-slate-300 hover:border-red-400"
                }`}
              >
                {selected.length === visible.length && visible.length > 0 && (
                  <FiCheck className="text-white text-[9px]" />
                )}
              </button>

              <AnimatePresence>
                {selected.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-[11px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {selected.length} selected
                    </span>
                    <button
                      onClick={handleMarkAllRead}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                      title="Mark as Read"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 flex-1"
                  >
                    <span className="text-[11px] text-slate-400 font-medium flex-1">
                      {visible.length} of {msgs.length}
                    </span>

                    <div className="relative" ref={sortRef}>
                      <button
                        onClick={() => setSortOpen((p) => !p)}
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg transition-all"
                      >
                        <FiFilter className="text-[9px]" />
                        {SORT_OPTIONS.find((o) => o.key === sort)?.label}
                        <FiChevronDown
                          className={`text-[9px] transition-transform ${sortOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {sortOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 2, scale: 0.98 }}
                            transition={{ duration: 0.14 }}
                            className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-30 w-36"
                          >
                            {SORT_OPTIONS.map((o) => (
                              <button
                                key={o.key}
                                onClick={() => {
                                  setSort(o.key);
                                  setSortOpen(false);
                                }}
                                className={`w-full px-3 py-2.5 text-[11px] text-left font-semibold transition-colors ${
                                  sort === o.key
                                    ? "bg-red-50 text-red-600"
                                    : "text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {catFilter && (
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[catFilter]}`}
                >
                  {catFilter}
                </span>
                <button
                  onClick={() => setCatFilter(null)}
                  className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {visible.length > 0 ? (
                visible.map((m) => (
                  <MsgRow
                    key={m.id}
                    msg={m}
                    active={active?.id === m.id}
                    selected={selected.includes(m.id)}
                    onSelect={handleSelect}
                    onClick={() => handleClickMsg(m)}
                    onStar={handleStar}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-slate-300 gap-2"
                >
                  <FiInbox className="text-4xl" />
                  <p className="text-sm font-bold">Nothing found</p>
                  <p className="text-xs">Try changing filters or search</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── DETAIL ── */}
        <div
          className={`
          flex-1 overflow-hidden bg-white
          ${active ? "flex" : "hidden md:flex"}
        `}
        >
          <AnimatePresence mode="wait">
            {active ? (
              <DetailPanel
                key={active.id}
                msg={active}
                onClose={() => setActive(null)}
                onStar={handleStar}
                onDelete={handleDelete}
                onMarkRead={handleMarkRead}
                onReply={() => setReplyOpen(true)}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center w-full h-full gap-4 text-slate-300"
              >
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
                  }}
                >
                  <FiMail className="text-5xl text-red-200" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-400">
                    Select an appeal
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Click on a message on the left to view details
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
                  <FiMessageSquare className="text-red-400 text-sm" />
                  <span className="text-[11px] font-semibold text-slate-500">
                    {visible.length} appeals available
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ════ REPLY MODAL ════ */}
      <AnimatePresence>
        {replyOpen && active && (
          <ReplyModal
            msg={active}
            onClose={() => setReplyOpen(false)}
            onSend={handleSendReply}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
