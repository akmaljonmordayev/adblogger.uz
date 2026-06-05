import { Link } from "react-router-dom";

const Icons = {
  Verified: (
    <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Tech:      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M20 18l2-2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12l2 2H0v2h24v-2h-4zM4 4h16v10H4V4z"/></svg>,
  Lifestyle: <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
  Beauty:    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
  Food:      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>,
  Sports:    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/></svg>,
  Travel:    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>,
  Education: <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>,
  Business:  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.48 0 12.36 0c-1.73 0-3.24.86-4.23 2.17L12 6H4C2.9 6 2 6.9 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>,
  Gaming:    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/></svg>,
  Music:     <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  Other:     <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>,
  Instagram: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  YouTube:   <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  Telegram:  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M9.04 15.47l-.39 3.73c.56 0 .8-.24 1.08-.52l2.6-2.47 5.39 3.94c.99.55 1.7.26 1.97-.91l3.57-16.73.01-.01c.32-1.48-.53-2.06-1.5-1.7L1.52 9.27c-1.43.56-1.41 1.36-.24 1.72l5.6 1.75L19.4 4.5c.59-.39 1.13-.17.69.22"/></svg>,
  TikTok:    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.22-.32-2.57-.17-3.64.49-.99.59-1.62 1.62-1.77 2.74-.06.53-.02 1.05.12 1.57.25.99 1.01 1.87 1.96 2.24.5.21 1.05.31 1.59.29.98-.01 1.93-.41 2.61-1.12.56-.58.89-1.35.94-2.15.02-4.1.01-8.21.01-12.31z"/></svg>,
};

const platformBadge = {
  Instagram: { bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743)", text: "#fff" },
  YouTube:   { bg: "#ff0000",  text: "#fff" },
  Telegram:  { bg: "#2aabee",  text: "#fff" },
  TikTok:    { bg: "#010101",  text: "#fff" },
};

const BloggerCard = ({
  _id,
  avatarIcon,
  avatar,
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
  const badge = platformBadge[platform] ?? { bg: "#64748b", text: "#fff" };

  return (
    <Link to={_id ? `/blogerlar/${_id}` : "#"} style={{ textDecoration: "none", display: "block", width: 300 }}>
      <div style={{
        width: 300,
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #f1f5f9",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        transition: "transform 0.28s cubic-bezier(.4,0,.2,1), box-shadow 0.28s cubic-bezier(.4,0,.2,1)",
        cursor: "pointer",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 20px 52px rgba(220,38,38,0.16)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
        }}
      >
        {/* Header */}
        <div style={{
          height: 118,
          position: "relative",
          background: headerGradient,
          flexShrink: 0,
        }}>
          {/* Shimmer overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.08) 100%)",
            pointerEvents: "none",
          }} />

          {/* Platform badge */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            display: "flex", alignItems: "center", gap: 5,
            background: badge.bg, color: badge.text,
            fontSize: 10, fontWeight: 700,
            padding: "4px 10px", borderRadius: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}>
            {Icons[platform]}
            {platform}
          </div>

          {/* Verified badge */}
          {isVerified && (
            <div style={{
              position: "absolute", top: 12, right: 12,
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
              color: "#059669", fontSize: 10, fontWeight: 700,
              padding: "4px 10px", borderRadius: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
              <span style={{
                background: "#10b981", color: "#fff", borderRadius: "50%",
                width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {Icons.Verified}
              </span>
              Tasdiqlangan
            </div>
          )}

          {/* Avatar */}
          <div style={{
            position: "absolute", bottom: -26, left: 20,
            width: 60, height: 60,
            borderRadius: "50%",
            border: "3px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            background: "#fff",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {avatar ? (
              <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {avatarIcon || Icons[platform]}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ paddingTop: 38, paddingLeft: 20, paddingRight: 20, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Name */}
          <div style={{ marginBottom: 10 }}>
            <div style={{
              fontSize: 15.5, fontWeight: 800, color: "#0f172a",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              lineHeight: 1.3,
            }}>
              {name || "—"}
            </div>
            <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {username}
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 14 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "#fef2f2", color: "#dc2626",
              fontSize: 11, fontWeight: 700,
              padding: "4px 10px", borderRadius: 8,
              border: "1px solid #fecaca",
            }}>
              {Icons[categoryType]}
              {categoryText}
            </span>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 8, marginTop: "auto", marginBottom: 4 }}>
            <div style={{
              flex: 1, background: "#fafafa", borderRadius: 12,
              padding: "10px 12px", border: "1px solid #f1f5f9",
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#dc2626", lineHeight: 1 }}>{followers}</div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 600, marginTop: 3 }}>Followers</div>
            </div>
            <div style={{
              flex: 1, background: "#fafafa", borderRadius: 12,
              padding: "10px 12px", border: "1px solid #f1f5f9",
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#374151", lineHeight: 1 }}>{engagement}</div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 600, marginTop: 3 }}>Engagement</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px",
          borderTop: "1px solid #f1f5f9",
          background: "#fafafa",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>Narx</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
              {price}
              <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginLeft: 3 }}>so'm</span>
            </div>
          </div>

          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onBronClick?.(); }}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "9px 18px",
              fontSize: 12, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#b91c1c"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#dc2626"; }}
          >
            Ko'rish
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BloggerCard;
