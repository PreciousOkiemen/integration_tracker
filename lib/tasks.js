export const TASKS = [
  // ── 4% tasks (19 tasks = 76%) ──────────────────────────────────────────
  { id: "t01", group: "Connectivity", label: "Bi-Directional Connectivity", direction: null, messageType: null, scenario: "setup", weight: 4 },
  { id: "t02", group: "ACMT / PACS Basic", label: "ACMT023 – FI → NIBSS", direction: "FI→NIBSS", messageType: "ACMT023", scenario: "positive", weight: 4 },
  { id: "t03", group: "ACMT / PACS Basic", label: "PACS008 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PACS008", scenario: "positive", weight: 4 },
  { id: "t04", group: "ACMT / PACS Basic", label: "PACS028 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PACS028", scenario: "positive", weight: 4 },
  { id: "t05", group: "ACMT / PACS Basic", label: "GetParticipant", direction: "FI→NIBSS", messageType: "GETPARTICIPANT", scenario: "positive", weight: 4 },
  { id: "t06", group: "ACMT / PACS Basic", label: "ACMT023 – NIBSS → FI", direction: "NIBSS→FI", messageType: "ACMT023", scenario: "positive", weight: 4 },
  { id: "t07", group: "ACMT / PACS Basic", label: "PACS008 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PACS008", scenario: "positive", weight: 4 },
  { id: "t08", group: "ACMT / PACS Negative", label: "ACMT023 – FI → NIBSS (negative)", direction: "FI→NIBSS", messageType: "ACMT023", scenario: "negative", weight: 4 },
  { id: "t09", group: "ACMT / PACS Negative", label: "ACMT023 – NIBSS → FI (negative)", direction: "NIBSS→FI", messageType: "ACMT023", scenario: "negative", weight: 4 },
  { id: "t10", group: "ACMT / PACS Negative", label: "PACS008 – NIBSS → FI (negative)", direction: "NIBSS→FI", messageType: "PACS008", scenario: "negative", weight: 4 },
  { id: "t11", group: "ACMT / PACS Negative", label: "PACS008 – FI → NIBSS (negative)", direction: "FI→NIBSS", messageType: "PACS008", scenario: "negative", weight: 4 },
  { id: "t12", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "PAIN009 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PAIN009", scenario: "positive", weight: 4 },
  { id: "t13", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "PAIN010 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PAIN010", scenario: "positive", weight: 4 },
  { id: "t14", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "PAIN011 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PAIN011", scenario: "positive", weight: 4 },
  { id: "t15", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "PAIN013 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PAIN013", scenario: "positive", weight: 4 },
  { id: "t16", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "PACS003 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PACS003", scenario: "positive", weight: 4 },
  { id: "t17", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "CAMT060 – FI → NIBSS", direction: "FI→NIBSS", messageType: "CAMT060", scenario: "positive", weight: 4 },
  { id: "t36", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "PAIN001 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PAIN001", scenario: "positive", weight: 4 },
  { id: "t37", group: "PAIN / PACS / CAMT – FI→NIBSS", label: "PAIN008 – FI → NIBSS", direction: "FI→NIBSS", messageType: "PAIN008", scenario: "positive", weight: 4 },

  // ── 3% tasks (8 tasks = 24%) ───────────────────────────────────────────
  { id: "t18", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "PAIN009 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PAIN009", scenario: "positive", weight: 3 },
  { id: "t19", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "PAIN010 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PAIN010", scenario: "positive", weight: 3 },
  { id: "t20", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "PAIN011 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PAIN011", scenario: "positive", weight: 3 },
  { id: "t21", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "PAIN013 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PAIN013", scenario: "positive", weight: 3 },
  { id: "t22", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "PACS003 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PACS003", scenario: "positive", weight: 3 },
  { id: "t23", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "CAMT060 – NIBSS → FI", direction: "NIBSS→FI", messageType: "CAMT060", scenario: "positive", weight: 3 },
  { id: "t38", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "PAIN001 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PAIN001", scenario: "positive", weight: 3 },
  { id: "t39", group: "PAIN / PACS / CAMT – NIBSS→FI", label: "PAIN008 – NIBSS → FI", direction: "NIBSS→FI", messageType: "PAIN008", scenario: "positive", weight: 3 },
];

export const TOTAL_WEIGHT = TASKS.reduce((s, t) => s + t.weight, 0); // 100

export const TASK_GROUPS = [...new Set(TASKS.map((t) => t.group))];

export function computeScore(taskStatuses) {
  const total = TASKS.reduce((s, t) => s + t.weight, 0);
  const earned = TASKS.reduce((score, task) => {
    const status = taskStatuses[task.id] || "pending";
    // pass AND n/a both count as earned
    return (status === "pass" || status === "na") ? score + task.weight : score;
  }, 0);
  return Math.round((earned / total) * 100);
}

export function groupedTasks() {
  return TASK_GROUPS.map((group) => ({
    group,
    tasks: TASKS.filter((t) => t.group === group),
    totalWeight: TASKS.filter((t) => t.group === group).reduce((s, t) => s + t.weight, 0),
  }));
}