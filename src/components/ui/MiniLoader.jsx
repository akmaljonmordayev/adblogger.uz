const BRAND = "oklch(0.6 0.25 260)";

/**
 * MiniLoader — kichik brendlangan yuklanish animatsiyasi.
 * Sahifa ichidagi seksiyalar, jadvallar, kartalar uchun.
 */
export default function MiniLoader({ height = 140, text = "Yuklanmoqda..." }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height, gap:10,
    }}>
      {/* Progress bar */}
      <div style={{ width:140, height:3, borderRadius:99, background:"oklch(0.6 0.25 260 / 0.12)", overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:99,
          background:`linear-gradient(90deg,${BRAND},#dc2626,${BRAND})`,
          backgroundSize:"200% 100%",
          animation:"mlBar 1.8s linear infinite",
        }}/>
      </div>

      {/* Dots */}
      <div style={{ display:"flex", gap:6 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            width:7, height:7, borderRadius:"50%",
            background: i===1 ? "#dc2626" : BRAND,
            animation:`mlDot 0.9s ease-in-out ${i*0.25}s infinite`,
          }}/>
        ))}
      </div>

      {text && (
        <span style={{ fontSize:12, color:"#94a3b8", fontWeight:500, letterSpacing:0.3 }}>
          {text}
        </span>
      )}

      <style>{`
        @keyframes mlBar{0%{background-position:100% 0}100%{background-position:-100% 0}}
        @keyframes mlDot{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-6px);opacity:1}}
      `}</style>
    </div>
  );
}
