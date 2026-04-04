import { useState } from "react";

export default function AddInstitutionModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) { setError("Institution name is required"); return; }
    if (!code.trim()) { setError("Short code is required"); return; }
    if (code.trim().length > 10) { setError("Code must be 10 chars or less"); return; }
    onAdd(name.trim(), code.trim());
  }

  const inputStyle = {
    width: "100%", background: "#ffffff08", border: "0.5px solid #ffffff18",
    color: "#f0f0f5", borderRadius: 8, padding: "10px 14px",
    fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0fcc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fade-in" style={{ background: "#111118", border: "0.5px solid #ffffff18", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#f0f0f5", marginBottom: 6 }}>
          Add Institution
        </div>
        <div style={{ color: "#55556a", fontSize: 13, marginBottom: 24 }}>
          All 35 integration tasks will be initialised as Pending.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "#9999aa", fontFamily: "var(--font-mono)", display: "block", marginBottom: 6 }}>INSTITUTION NAME</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. First Bank of Nigeria"
              style={inputStyle}
              autoFocus
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#9999aa", fontFamily: "var(--font-mono)", display: "block", marginBottom: 6 }}>SHORT CODE</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. FBN"
              style={{ ...inputStyle, fontFamily: "var(--font-mono)", letterSpacing: 2 }}
              maxLength={10}
            />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, color: "#ef4444", fontSize: 12, fontFamily: "var(--font-mono)" }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "0.5px solid #ffffff18", color: "#9999aa", borderRadius: 8, padding: "10px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14 }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ flex: 2, background: "#6366f1", border: "none", color: "#fff", borderRadius: 8, padding: "10px", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>
            Add Institution
          </button>
        </div>
      </div>
    </div>
  );
}
