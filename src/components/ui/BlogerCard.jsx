import { Link } from "react-router-dom";

const Icons = {
  Verified: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Tech:      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 18l2-2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12l2 2H0v2h24v-2h-4zM4 4h16v10H4V4z"/></svg>,
  Lifestyle: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
  Beauty:    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
  Food:      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>,
  Instagram: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  YouTube:   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  Sports:    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/></svg>,
  Telegram:  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.04 15.47l-.39 3.73c.56 0 .8-.24 1.08-.52l2.6-2.47 5.39 3.94c.99.55 1.7.26 1.97-.91l3.57-16.73.01-.01c.32-1.48-.53-2.06-1.5-1.7L1.52 9.27c-1.43.56-1.41 1.36-.24 1.72l5.6 1.75L19.4 4.5c.59-.39 1.13-.17.69.22"/></svg>,
  TikTok:    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.22-.32-2.57-.17-3.64.49-.99.59-1.62 1.62-1.77 2.74-.06.53-.02 1.05.12 1.57.25.99 1.01 1.87 1.96 2.24.5.21 1.05.31 1.59.29.98-.01 1.93-.41 2.61-1.12.56-.58.89-1.35.94-2.15.02-4.1.01-8.21.01-12.31z"/></svg>,
};

// Brand colors — platform identity, not card accent
const platformBadge = {
  Instagram: { bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]", text: "text-white" },
  YouTube:   { bg: "bg-[#ff0000]",  text: "text-white" },
  Telegram:  { bg: "bg-[#2aabee]",  text: "text-white" },
  TikTok:    { bg: "bg-[#010101]",  text: "text-white" },
};

const BloggerCard = ({
  _id,
  avatarIcon,
  name,
  username,
  categoryType,
  categoryText,
  platform,
  followers,
  engagement,
  price,
  headerGradient,
  isVerified = true,
  onBronClick,
}) => {
  const badge = platformBadge[platform] ?? { bg: "bg-gray-700", text: "text-white" };

  return (
    <Link
      to={_id ? `/bloggers/${_id}` : "#"}
      style={{ textDecoration: "none", display: "block" }}
    >
    <div className="group relative bg-white rounded-2xl w-full border border-gray-100 overflow-hidden flex flex-col h-[390px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(220,38,38,0.18)] hover:-translate-y-2 transition-all duration-300 cursor-pointer">

      {/* ── Header strip ── */}
      <div className="h-22 relative shrink-0" style={{ background: headerGradient }}>
        {/* Top-to-bottom fade for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-white/15 to-black/10 pointer-events-none" />

        {/* Platform badge — top-left */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${badge.bg} ${badge.text}`}>
          {Icons[platform]}
          {platform}
        </div>

        {/* Verified — top-right */}
        {isVerified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-emerald-600 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            <span className="bg-emerald-500 text-white rounded-full p-0.5 flex items-center justify-center">
              {Icons.Verified}
            </span>
            Tasdiqlangan
          </div>
        )}

        {/* Avatar */}
        <div className="absolute -bottom-8 left-5 w-15.5 h-15.5 rounded-full ring-[3px] ring-white shadow-md bg-white flex items-center justify-center group-hover:ring-[#fecaca] group-hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center text-gray-600">
            {avatarIcon || Icons[platform]}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="pt-11 px-5 flex-1 flex flex-col">

        {/* Name & username */}
        <div className="mb-3">
          <h3 className="text-[1.05rem] font-bold text-[#111827] truncate leading-snug group-hover:text-[#dc2626] transition-colors duration-200">
            {name}
          </h3>
          <p className="text-[12px] text-gray-400 truncate mt-0.5">{username}</p>
        </div>

        {/* Category tag */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 bg-[#fef2f2] text-[#dc2626] text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#fecaca]">
            {Icons[categoryType]}
            {categoryText}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-2 mt-auto mb-1">
          <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 group-hover:border-[#fecaca] transition-colors">
            <p className="font-bold text-[#dc2626] text-[15px] leading-tight">{followers}</p>
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">Followers</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 group-hover:border-[#fecaca] transition-colors">
            <p className="font-bold text-[#374151] text-[15px] leading-tight">{engagement}</p>
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">Engagement</p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">Narx</p>
          <p className="text-[1.15rem] font-black text-[#111827] leading-none">
            {price}
            <span className="text-[10px] font-semibold text-gray-400 ml-1">so'm</span>
          </p>
        </div>

        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); onBronClick?.(); }}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[12px] font-bold px-5 py-2.5 rounded-xl shadow-md shadow-red-200 hover:shadow-red-300 active:scale-95 transition-all duration-200"
        >
          Ko'rish
        </button>
      </div>
    </div>
    </Link>
  );
};

export default BloggerCard;
