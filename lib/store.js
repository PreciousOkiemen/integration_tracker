import { computeScore, TASKS } from "./tasks";
import { supabase } from "./supabase";

// ── helpers that don't touch the DB (keep as-is) ──────────────────────────

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
  const counts = { pass: 0, na: 0, pending: 0, blocked: 0 };
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

// ── Supabase DB functions (replacing localStorage) ────────────────────────

// row from DB uses snake_case — convert to camelCase for the app
function rowToInstitution(row) {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    taskStatuses: row.task_statuses,
    notes: row.notes || {},
  };
}

export async function loadInstitutions() {
  const { data, error } = await supabase
    .from("institutions")
    .select("*")
    .order("name", { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(rowToInstitution);
}

export async function saveInstitution(institution) {
  const { error } = await supabase
    .from("institutions")
    .upsert({
      id: institution.id,
      name: institution.name,
      code: institution.code,
      created_at: institution.createdAt,
      updated_at: institution.updatedAt,
      task_statuses: institution.taskStatuses,
      notes: institution.notes || {},
    });
  if (error) console.error(error);
}

export async function deleteInstitution(id) {
  const { error } = await supabase
    .from("institutions")
    .delete()
    .eq("id", id);
  if (error) console.error(error);
}