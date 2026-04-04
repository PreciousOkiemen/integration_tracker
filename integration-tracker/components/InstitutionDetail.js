import { useState } from "react";
import { TASKS, groupedTasks } from "../lib/tasks";
import { getInstitutionScore, getScoreColor, getScoreLabel } from "../lib/store";
import ScoreRing from "./ScoreRing";

const STATUS_OPTIONS = ["pending", "pass", "fail", "blocked"];

const STATUS_STYLE = {
  pass:    { bg: "#22c55e18", border: "#22c55e40", text: "#22c55e", label: "Pass" },
  fail:    { bg: "#ef444418", border: "#ef444440", text: "#ef4444", label: "Fail" },
  blocked: { bg: "#f59e0b18", border: "#f59e0b40", text: "#f59e0b", label: "Blocked" },
  pending: { bg: "#ffffff08", border: "#ffffff14", text: "#55556a", label: "Pending" },
};

export default function InstitutionDetail({ institution, onUpdate, onClose }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const score = getInstitutionScore(institution);
  const color = getScoreColor(score);
  const groups = groupedTasks();

  function setTaskStatus(taskId, status) {
    const updated = {
      ...institution,
      taskStatuses: { ...institution.taskStatuses, [taskId]: status },
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updated);
  }

  function cycleStatus(taskId) {
    const current = institution.taskStatuses[taskId] || "pending";
    const idx = STATUS_OPTIONS.indexOf(current);
    const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    setTaskStatus(taskId, next);
  }

  function setAllInGroup(groupTasks, status) {
    const updated = { ...institution.taskStatuses };
    groupTasks.forEach((t) => (updated[t.id] = status));
    onUpdate({ ...institution, taskStatuses: updated, updatedAt: new Date().toISOString() });
  }

  const filteredGroups = groups.map((g) => ({
    ...g,
    tasks: g.tasks.filter((t) => {
      const statusMatch = filter === "all" || (institution.taskStatuses[t.id] || "pending") === filter;
      const searchMatch = !search || t.label.toLowerCase().includes(search.toLowerCase());
      return statusMatch && searchMatch;
    }),
  })).filter((g) => g.tasks.length > 0);

  const groupScore = (tasks) => {
    const earned = tasks.reduce((s, t) => (institution.taskStatuses[t.id] === "pass" ? s + t.weight : s), 0);
    const max = tasks.reduce((s, t) => s + t.weight, 0);
    return { earned, max, pct: max ? Math.round((earned / max) * 100) : 0 };
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#0a0a0fee", zIndex: 50,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ background: "#111118", borderBottom: "0.5px solid #ffffff12", padding: "16px 24px", display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: "#ffffff0d", border: "0.5px solid #ffffff18", color: "#9999aa", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12 }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6366f1", letterSpacing: 1 }}>{institution.code}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#f0f0f5" }}>{institution.name}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "pending", "pass", "fail", "blocked"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? "#6366f120" : "transparent",
                border: `0.5px solid ${filter === f ? "#6366f1" : "#ffffff14"}`,
                color: filter === f ? "#818cf8" : "#55556a",
                borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "capitalize",
              }}>{f}</button>
            ))}
          </div>

          {/* Score ring */}
          <div style={{ position: "relative", width: 56, height: 56 }}>
            <ScoreRing score={score} size={56} stroke={4} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color }}>
              {score}%
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "12px 24px", background: "#0e0e15", borderBottom: "0.5px solid #ffffff0a" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          style={{ width: "100%", maxWidth: 360, background: "#ffffff08", border: "0.5px solid #ffffff14", color: "#f0f0f5", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
        />
      </div>

      {/* Task groups */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {filteredGroups.map(({ group, tasks }) => {
          const gs = groupScore(tasks);
          return (
            <div key={group} style={{ background: "#111118", border: "0.5px solid #ffffff0d", borderRadius: 12, overflow: "hidden" }}>
              {/* Group header */}
              <div style={{ padding: "12px 18px", background: "#ffffff04", borderBottom: "0.5px solid #ffffff0a", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "#c0c0d0" }}>{group}</span>
                  <span style={{ marginLeft: 10, fontFamily: "var(--font-mono)", fontSize: 11, color: "#55556a" }}>
                    {gs.earned}/{gs.max}% earned
                  </span>
                </div>
                {/* Mini progress */}
                <div style={{ width: 80, height: 4, background: "#ffffff0d", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${gs.pct}%`, background: getScoreColor(gs.pct), borderRadius: 2, transition: "width 0.4s" }} />
                </div>
                {/* Bulk actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setAllInGroup(tasks, "pass")} style={{ background: "#22c55e15", border: "0.5px solid #22c55e30", color: "#22c55e", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontFamily: "var(--font-mono)" }}>All pass</button>
                  <button onClick={() => setAllInGroup(tasks, "pending")} style={{ background: "#ffffff08", border: "0.5px solid #ffffff14", color: "#55556a", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontFamily: "var(--font-mono)" }}>Reset</button>
                </div>
              </div>

              {/* Tasks */}
              <div>
                {tasks.map((task, i) => {
                  const status = institution.taskStatuses[task.id] || "pending";
                  const ss = STATUS_STYLE[status];
                  return (
                    <div key={task.id} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "11px 18px",
                      borderBottom: i < tasks.length - 1 ? "0.5px solid #ffffff06" : "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#ffffff04"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Status button */}
                      <button onClick={() => cycleStatus(task.id)} style={{
                        minWidth: 72, padding: "3px 0", borderRadius: 6, cursor: "pointer",
                        border: `0.5px solid ${ss.border}`, background: ss.bg,
                        color: ss.text, fontFamily: "var(--font-mono)", fontSize: 11,
                        textAlign: "center", transition: "all 0.15s",
                      }}>{ss.label}</button>

                      {/* Label */}
                      <div style={{ flex: 1, fontSize: 13, color: status === "pass" ? "#c0c0d0" : "#9999aa" }}>
                        {task.label}
                      </div>

                      {/* Direction badge */}
                      {task.direction && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#55556a", background: "#ffffff06", borderRadius: 4, padding: "2px 8px", whiteSpace: "nowrap" }}>
                          {task.direction}
                        </span>
                      )}

                      {/* Scenario badge */}
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: task.scenario === "negative" ? "#f59e0b80" : "#22c55e60", background: "#ffffff04", borderRadius: 4, padding: "2px 8px" }}>
                        {task.scenario}
                      </span>

                      {/* Weight */}
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6366f1", minWidth: 32, textAlign: "right" }}>
                        {task.weight}%
                      </span>

                      {/* Status selector */}
                      <select
                        value={status}
                        onChange={(e) => setTaskStatus(task.id, e.target.value)}
                        style={{ background: "#ffffff08", border: "0.5px solid #ffffff14", color: "#9999aa", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "var(--font-mono)", cursor: "pointer", outline: "none" }}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
