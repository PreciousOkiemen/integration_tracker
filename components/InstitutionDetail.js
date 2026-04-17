import { useState } from "react";
import { TASKS, groupedTasks } from "../lib/tasks";
import { getInstitutionScore, getScoreColor } from "../lib/store";
import ScoreRing from "./ScoreRing";

const STATUS_OPTIONS = ["pending", "pass", "na", "blocked"];

const STATUS_STYLE = {
  pass:    { bg: "#22c55e18", border: "#22c55e50", text: "#22c55e", label: "Pass" },
  na:    { bg: "#ef444418", border: "#ef444450", text: "#ef4444", label: "Fail" },
  blocked: { bg: "#f59e0b18", border: "#f59e0b50", text: "#f59e0b", label: "Blocked" },
  pending: { bg: "#ffffff0a", border: "#ffffff20", text: "#666680", label: "Pending" },
};

export default function InstitutionDetail({ institution, onUpdate, onClose }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const score = getInstitutionScore(institution);
  const color = getScoreColor(score);
  const allGroups = groupedTasks();

  function setTaskStatus(taskId, status) {
    onUpdate({
      ...institution,
      taskStatuses: { ...institution.taskStatuses, [taskId]: status },
      updatedAt: new Date().toISOString(),
    });
  }

  function cycleStatus(taskId) {
    const current = institution.taskStatuses[taskId] || "pending";
    const next = STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(current) + 1) % STATUS_OPTIONS.length];
    setTaskStatus(taskId, next);
  }

  function setAllInGroup(groupTasks, status) {
    const updated = { ...institution.taskStatuses };
    groupTasks.forEach((t) => (updated[t.id] = status));
    onUpdate({ ...institution, taskStatuses: updated, updatedAt: new Date().toISOString() });
  }

  function toggleGroup(group) {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }

  function groupScore(tasks) {
    const earned = tasks.reduce((s, t) => (institution.taskStatuses[t.id] === "pass" ? s + t.weight : s), 0);
    const max = tasks.reduce((s, t) => s + t.weight, 0);
    return { earned, max, pct: max ? Math.round((earned / max) * 100) : 0 };
  }

  const counts = { all: TASKS.length };
  STATUS_OPTIONS.forEach((s) => {
    counts[s] = TASKS.filter((t) => (institution.taskStatuses[t.id] || "pending") === s).length;
  });

  const visibleGroups = allGroups.map((g) => ({
    ...g,
    visibleTasks: g.tasks.filter((t) => {
      const status = institution.taskStatuses[t.id] || "pending";
      const statusMatch = filter === "all" || status === filter;
      const searchMatch =
        !search ||
        t.label.toLowerCase().includes(search.toLowerCase()) ||
        (t.messageType && t.messageType.toLowerCase().includes(search.toLowerCase()));
      return statusMatch && searchMatch;
    }),
  })).filter((g) => g.visibleTasks.length > 0);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "#0a0a0f", fontFamily: "var(--font-body)" }}>

      {/* HEADER */}
      <div style={{ background: "#0d0d14", borderBottom: "0.5px solid #ffffff12", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: "#ffffff0d", border: "0.5px solid #ffffff18", color: "#9999aa", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12 }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6366f1", letterSpacing: 1, marginBottom: 2 }}>{institution.code}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#f0f0f5", lineHeight: 1.2 }}>{institution.name}</div>
        </div>
        <div style={{ position: "relative", width: 54, height: 54, flexShrink: 0 }}>
          <ScoreRing score={score} size={54} stroke={4} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color }}>{score}%</div>
        </div>
      </div>

      {/* FILTER + SEARCH */}
      <div style={{ background: "#0e0e15", borderBottom: "0.5px solid #ffffff0a", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", flexShrink: 0 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          style={{ width: 200, background: "#ffffff08", border: "0.5px solid #ffffff14", color: "#f0f0f5", borderRadius: 8, padding: "6px 12px", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", ...STATUS_OPTIONS].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "#6366f120" : "transparent", border: `0.5px solid ${filter === f ? "#6366f1" : "#ffffff14"}`, color: filter === f ? "#818cf8" : "#55556a", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "capitalize" }}>
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* TASK GROUPS — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {visibleGroups.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#334155", fontFamily: "var(--font-mono)", fontSize: 13 }}>No tasks match the current filter.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {visibleGroups.map(({ group, tasks: allGroupTasks, visibleTasks }) => {
              const gs = groupScore(allGroupTasks);
              const collapsed = !!collapsedGroups[group];
              return (
                <div key={group} style={{ border: "0.5px solid #ffffff12", borderRadius: 12, background: "#111118" }}>

                  {/* Group header */}
                  <div
                    onClick={() => toggleGroup(group)}
                    style={{ padding: "12px 18px", background: "#ffffff05", borderBottom: collapsed ? "none" : "0.5px solid #ffffff0a", borderRadius: collapsed ? 12 : "12px 12px 0 0", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ color: "#55556a", fontSize: 11, display: "inline-block", transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, color: "#d0d0e0", flex: 1 }}>{group}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#55556a" }}>{gs.earned}/{gs.max}% earned</span>
                    <div style={{ width: 64, height: 4, background: "#ffffff0d", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${gs.pct}%`, background: getScoreColor(gs.pct), borderRadius: 2 }} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setAllInGroup(allGroupTasks, "pass")} style={{ background: "#22c55e15", border: "0.5px solid #22c55e30", color: "#22c55e", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontFamily: "var(--font-mono)" }}>All pass</button>
                      <button onClick={() => setAllInGroup(allGroupTasks, "pending")} style={{ background: "#ffffff08", border: "0.5px solid #ffffff14", color: "#55556a", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontFamily: "var(--font-mono)" }}>Reset</button>
                    </div>
                  </div>

                  {/* Task rows — visible by default */}
                  {!collapsed && (
                    <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                      {visibleTasks.map((task, i) => {
                        const status = institution.taskStatuses[task.id] || "pending";
                        const ss = STATUS_STYLE[status];
                        return (
                          <div
                            key={task.id}
                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: i < visibleTasks.length - 1 ? "0.5px solid #ffffff06" : "none", background: "transparent" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#ffffff04")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {/* Cycle button */}
                            <button
                              onClick={() => cycleStatus(task.id)}
                              title="Click to cycle: pending → pass → fail → blocked"
                              style={{ minWidth: 68, padding: "4px 0", borderRadius: 6, cursor: "pointer", border: `0.5px solid ${ss.border}`, background: ss.bg, color: ss.text, fontFamily: "var(--font-mono)", fontSize: 11, textAlign: "center" }}
                            >{ss.label}</button>

                            {/* Task name */}
                            <div style={{ flex: 1, fontSize: 13, color: status === "pass" ? "#e0e0f0" : "#a0a0b8", lineHeight: 1.4 }}>{task.label}</div>

                            {/* Direction */}
                            {task.direction && (
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#6366f180", background: "#6366f110", borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap" }}>{task.direction}</span>
                            )}

                            {/* Scenario */}
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: task.scenario === "negative" ? "#f59e0b90" : "#22c55e70", background: "#ffffff05", borderRadius: 4, padding: "2px 7px" }}>{task.scenario}</span>

                            {/* Weight */}
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#6366f1", minWidth: 30, textAlign: "right" }}>{task.weight}%</span>

                            {/* Dropdown */}
                            <select
                              value={status}
                              onChange={(e) => setTaskStatus(task.id, e.target.value)}
                              style={{ background: "#0d0d14", border: "0.5px solid #ffffff18", color: "#9999aa", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "var(--font-mono)", cursor: "pointer", outline: "none" }}
                            >
                              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOTTOM SCORE BAR */}
      <div style={{ background: "#0d0d14", borderTop: "0.5px solid #ffffff0a", padding: "10px 24px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#55556a" }}>Cumulative score</span>
        <div style={{ flex: 1, height: 4, background: "#ffffff08", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, color, minWidth: 40, textAlign: "right" }}>{score}%</span>
      </div>

    </div>
  );
}