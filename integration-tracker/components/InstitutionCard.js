import ScoreRing from "./ScoreRing";
import { getInstitutionScore, getStatusCounts, getScoreLabel, getScoreColor } from "../lib/store";

export default function InstitutionCard({ institution, onClick }) {
  const score = getInstitutionScore(institution);
  const counts = getStatusCounts(institution);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div
      onClick={onClick}
      className="fade-in"
      style={{
        background: "#111118",
        border: "0.5px solid #ffffff12",
        borderRadius: 12,
        padding: "20px 22px",
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f140";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#ffffff12";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* accent top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}80, transparent)` }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6366f1", letterSpacing: 1, marginBottom: 4 }}>
            {institution.code}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "#f0f0f5", lineHeight: 1.3, marginBottom: 8 }}>
            {institution.name}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Pass", value: counts.pass, color: "#22c55e" },
              { label: "Fail", value: counts.fail, color: "#ef4444" },
              { label: "Blocked", value: counts.blocked, color: "#f59e0b" },
              { label: "Pending", value: counts.pending, color: "#334155" },
            ].map(({ label, value, color }) => (
              value > 0 && (
                <span key={label} style={{ fontSize: 11, color: "#9999aa", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
                  {value} {label}
                </span>
              )
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ position: "relative" }}>
            <ScoreRing score={score} size={60} stroke={4} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color }}>
              {score}%
            </div>
          </div>
          <span style={{ fontSize: 10, color: "#9999aa", fontFamily: "var(--font-mono)" }}>{label}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 16, height: 3, background: "#ffffff0d", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}
