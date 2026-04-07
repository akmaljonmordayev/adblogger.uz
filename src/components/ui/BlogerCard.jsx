import React from "react";

const Icons = {
  Verified: (
    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Tech: <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M20 18l2-2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12l2 2H0v2h24v-2h-4zM4 4h16v10H4V4z"/></svg>,
  Lifestyle: <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
  Beauty: <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
  Food: <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>,
  Instagram: <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0 3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  YouTube: <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  TikTok: <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.22-.32-2.57-.17-3.64.49-.99.59-1.62 1.62-1.77 2.74-.06.53-.02 1.05.12 1.57.25.99 1.01 1.87 1.96 2.24.5.21 1.05.31 1.59.29.98-.01 1.93-.41 2.61-1.12.56-.58.89-1.35.94-2.15.02-4.1.01-8.21.01-12.31z"/></svg>
};

const BloggerCard = ({
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
  return (
    <div className="group  bg-white rounded-2xl max-h-[380px] w-full max-w-[285px] border border-gray-100 overflow-hidden text-gray-900 flex flex-col h-[400px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_80px_rgba(239,68,68,0.35)] hover:translate-y-[-8px] hover:border-[#ef4444]/60 transition-all duration-300">
      
      <div className="h-[80px] relative flex justify-end p-3 "  style={{ background: headerGradient }}>
        {isVerified && (
          <span className="bg-white text-green-600 text-[11px] font-bold px-3 py-1 rounded-full flex items-center h-fit border border-gray-100 shadow-sm">
            {Icons.Verified} Tasdiqlangan
          </span>
        )}

       <div className="absolute -bottom-8 left-5 w-[65px] h-[65px] bg-gray-50 rounded-full flex items-center justify-center border-[4px] border-white shadow-lg group-hover:scale-105 transition-all duration-300">
  <div className="w-42 h-12 flex items-center justify-center">
    {avatarIcon || Icons[platform]}
  </div>
</div>
      </div>

      <div className="pt-12 px-5 flex-grow">
        <h3 className="text-[1.1rem] sm:text-[1.2rem] font-bold tracking-tight truncate group-hover:text-[#ef4444] transition-colors text-gray-900">{name}</h3>
        
        <div className="flex items-center text-[13px] text-gray-500 mb-4 gap-1">
          <span className="text-gray-400 group-hover:text-[#ef4444] transition-colors">{Icons[platform]}</span>
          {username}
        </div>

        <div className="inline-flex items-center bg-[#b91c1c1a] text-[#ef4444] px-3 py-1 rounded-md text-[12px] font-bold mb-6">
          {Icons[categoryType]}
          {categoryText}
        </div>

        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1 bg-gray-50 rounded-xl p-2 sm:p-3 flex flex-col items-center border border-gray-100 group-hover:border-[#ef4444]/40 transition-all">
            <span className="font-bold text-[#ef4444] text-base sm:text-lg">{followers}</span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-medium text-center">Followers</span>
          </div>

          <div className="flex-1 bg-gray-50 rounded-xl p-2 sm:p-3 flex flex-col items-center border border-gray-100 group-hover:border-[#22c55e]/40 transition-all">
            <span className="font-bold text-[#22c55e] text-base sm:text-lg">{engagement}</span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-medium text-center">Engagement</span>
          </div>
        </div>
      </div>
          
      <div className="px-5 py-5 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-[1.3rem] font-black text-[#ef4444] tracking-tight">{price}</span>
          <span className="text-[10px] text-gray-500 font-medium uppercase">so'm</span>
        </div>

        <button
          onClick={onBronClick}
          className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-4 sm:px-6 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 hover:shadow-[#b91c1c]/20 hover:shadow-xl"
        >
          Bron
        </button>
      </div>
    </div>
  );
};

export default BloggerCard;