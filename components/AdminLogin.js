import { useState } from "react";
import { loginAdmin } from "../lib/auth";

export default function AdminLogin({ onSuccess, onCancel }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (loginAdmin(password)) {
      onSuccess();
    } else {
      setError("Incorrect password.");
      setPassword("");
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0fcc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111118", border: "0.5px solid #6366f140", borderRadius: 16, padding: 32, width: "100%", maxWidth: 380 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#f0f0f5", marginBottom: 6 }}>
          Admin Access
        </div>
        <div style={{ color: "#55556a", fontSize: 13, marginBottom: 24 }}>
          Enter the admin password to continue.
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Password"
          autoFocus
          style={{ width: "100%", background: "#ffffff08", border: "0.5px solid #ffffff18", color: "#f0f0f5", borderRadius: 8, padding: "10px 14px", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", marginBottom: 12 }}
        />

        {error && (
          <div style={{ color: "#ef4444", fontSize: 12, fontFamily: "var(--font-mono)", marginBottom: 12 }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, background: "transparent", border: "0.5px solid #ffffff18", color: "#9999aa", borderRadius: 8, padding: "10px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ flex: 2, background: "#6366f1", border: "none", color: "#fff", borderRadius: 8, padding: "10px", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600 }}>
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}