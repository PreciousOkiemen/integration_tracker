import { computeScore, TASKS } from "./tasks";

const STORAGE_KEY = "nibss_tracker_v1";

export function loadData() {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultData();
  } catch {
    return defaultData();
  }
}

export function saveData(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function defaultData() {
  return { institutions: [], lastUpdated: null };
}

export function createInstitution(name, code) {
  const taskStatuses = {};
  TASKS.forEach((t) => (taskStatuses[t.id] = "pending"));
  return {
    id: `inst_${Date.now()}`,
    name,
    code: code.toUpperCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    taskStatuses,
    notes: {},
  };
}

export function getInstitutionScore(institution) {
  return computeScore(institution.taskStatuses);
}

export function getStatusCounts(institution) {
  const counts = { pass: 0, fail: 0, pending: 0, blocked: 0 };
  TASKS.forEach((t) => {
    const s = institution.taskStatuses[t.id] || "pending";
    counts[s] = (counts[s] || 0) + 1;
  });
  return counts;
}

export function getOverallStats(institutions) {
  if (!institutions.length)
    return { avg: 0, complete: 0, inProgress: 0, notStarted: 0 };
  const scores = institutions.map(getInstitutionScore);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  return {
    avg,
    complete: institutions.filter((i) => getInstitutionScore(i) === 100).length,
    inProgress: institutions.filter((i) => {
      const s = getInstitutionScore(i);
      return s > 0 && s < 100;
    }).length,
    notStarted: institutions.filter((i) => getInstitutionScore(i) === 0).length,
  };
}

export function getScoreColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  if (score >= 20) return "#f97316";
  return "#ef4444";
}

export function getScoreLabel(score) {
  if (score === 100) return "Complete";
  if (score >= 80) return "Near Complete";
  if (score >= 50) return "In Progress";
  if (score > 0) return "Started";
  return "Not Started";
}
