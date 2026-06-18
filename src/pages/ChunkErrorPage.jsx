import { useRouteError, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const CHUNK_ERR = /failed to fetch dynamically imported module|loading chunk|loading css chunk|dynamically imported module/i;

export default function ChunkErrorPage() {
  const error     = useRouteError();
  const navigate  = useNavigate();
  const reloaded  = useRef(false);

  const isChunk = CHUNK_ERR.test(error?.message || "");

  useEffect(() => {
    if (!isChunk || reloaded.current) return;
    // Auto-reload bir marta — yangi chunk larni yuklab oladi
    reloaded.current = true;
    const timer = setTimeout(() => window.location.reload(), 800);
    return () => clearTimeout(timer);
  }, [isChunk]);

  if (isChunk) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#f8f9fb", fontFamily: "sans-serif", gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(239,68,68,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
        }}>⟳</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
          Sahifa yangilanmoqda...
        </div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Iltimos kuting
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#f8f9fb", fontFamily: "sans-serif", gap: 16, padding: 24,
    }}>
      <div style={{ fontSize: 48 }}>😕</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
        Xatolik yuz berdi
      </div>
      <div style={{
        fontSize: 13, color: "#6b7280", textAlign: "center", maxWidth: 400,
      }}>
        {error?.message || "Kutilmagan xatolik. Sahifani yangilang yoki qaytadan urinib ko'ring."}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: "#ef4444", color: "#fff",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          Yangilash
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 24px", borderRadius: 10,
            border: "1px solid #e5e7eb", background: "#fff",
            fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer",
          }}
        >
          Bosh sahifa
        </button>
      </div>
    </div>
  );
}
