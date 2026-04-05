import { useState, useEffect } from "react";
import Head from "next/head";
import {
  loadInstitutions, saveInstitution, deleteInstitution,
  createInstitution, getOverallStats, getInstitutionScore, getScoreColor,
} from "../lib/store";
import { TASKS } from "../lib/tasks";
import { isAdmin, logoutAdmin } from "../lib/auth";
import InstitutionCard from "../components/InstitutionCard";
import InstitutionDetail from "../components/InstitutionDetail";
import AddInstitutionModal from "../components/AddInstitutionModal";
import AdminLogin from "../components/AdminLogin";

export default function Home() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    setAdminUnlocked(isAdmin());
    loadInstitutions().then((data) => {
      setInstitutions(data);
      setLoading(false);
    });
  }, []);

  async function handleAdd(name, code) {
    const inst = createInstitution(name, code);
    await saveInstitution(inst);
    setInstitutions((prev) => [...prev, inst]);
    setShowAdd(false);
  }

  async function handleUpdate(updated) {
    await saveInstitution(updated);
    setInstitutions((prev) => prev.map((i) => i.id === updated.id ? updated : i));
    setSelected(updated);
  }

  async function handleDelete(id) {
    await deleteInstitution(id);
    setInstitutions((prev) => prev.filter((i) => i.id !== id));
    setDeleteConfirm(null);
    if (selected?.id === id) setSelected(null);
  }

  const stats = getOverallStats(institutions);

  const filtered = institutions
    .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.code.includes(search.toUpperCase()))
    .sort((a, b) => {
      if (sortBy === "score") return getInstitutionScore(b) - getInstitutionScore(a);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "updated") return new Date(b.updatedAt) - new Date(a.updatedAt);
      return 0;
    });

  if (selected) {
    return (
      <InstitutionDetail
        institution={selected}
        onUpdate={handleUpdate}
        onClose={() => setSelected(null)}
      />
    );
  }

  return (
    <>
      <Head>
        <title>NIBSS Integration Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
        {/* Nav */}
        <nav style={{ borderBottom: "0.5px solid #ffffff0d", padding: "0 28px", height: 56, display: "flex", alignItems: "center", gap: 16, background: "#0d0d14" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "#f0f0f5", letterSpacing: -0.5 }}>
            <span style={{ color: "#6366f1" }}>NIBSS</span> Integration Tracker
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#334155" }}>
            {TASKS.length} tasks · weighted 100%
          </div>
          {adminUnlocked ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#22c55e" }}>● Admin</span>
              <button
                onClick={() => setShowAdd(true)}
                style={{ background: "#6366f1", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}
              >+ Add Institution</button>
              <button
                onClick={() => { logoutAdmin(); setAdminUnlocked(false); }}
                style={{ background: "transparent", border: "0.5px solid #ffffff18", color: "#9999aa", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12 }}
              >Lock</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminLogin(true)}
              style={{ background: "transparent", border: "0.5px solid #ffffff18", color: "#55556a", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12 }}
            >Admin</button>
          )}
        </nav>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 28px" }}>

          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#334155", fontFamily: "var(--font-mono)", fontSize: 13 }}>
              Loading institutions...
            </div>
          )}

          {!loading && (
            <>
              {/* Stats row */}
              {institutions.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
                  {[
                    { label: "Institutions", value: institutions.length, mono: true },
                    { label: "Avg. Score", value: `${stats.avg}%`, mono: true, color: getScoreColor(stats.avg) },
                    { label: "Complete", value: stats.complete, color: "#22c55e" },
                    { label: "In Progress", value: stats.inProgress, color: "#f59e0b" },
                    { label: "Not Started", value: stats.notStarted, color: "#334155" },
                  ].map(({ label, value, color, mono }) => (
                    <div key={label} style={{ background: "#111118", border: "0.5px solid #ffffff0a", borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ fontSize: 11, color: "#55556a", fontFamily: "var(--font-mono)", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 24, fontWeight: 600, fontFamily: mono ? "var(--font-mono)" : "var(--font-display)", color: color || "#f0f0f5" }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Overall progress bar */}
              {institutions.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#55556a", fontFamily: "var(--font-mono)" }}>
                    <span>Overall portfolio progress</span>
                    <span>{stats.avg}%</span>
                  </div>
                  <div style={{ height: 6, background: "#ffffff08", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${stats.avg}%`, background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 3, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              )}

              {/* Toolbar */}
              {institutions.length > 0 && (
                <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search institutions..."
                    style={{ flex: 1, minWidth: 200, background: "#111118", border: "0.5px solid #ffffff14", color: "#f0f0f5", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ background: "#111118", border: "0.5px solid #ffffff14", color: "#9999aa", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-mono)", fontSize: 12, cursor: "pointer", outline: "none" }}
                  >
                    <option value="name">Sort: Name</option>
                    <option value="score">Sort: Score</option>
                    <option value="updated">Sort: Recently Updated</option>
                  </select>
                </div>
              )}

              {/* Institution grid */}
              {filtered.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                  {filtered.map((inst) => (
                    <div key={inst.id} style={{ position: "relative" }}>
                      <InstitutionCard institution={inst} onClick={() => setSelected(inst)} />
                      {adminUnlocked && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm(inst.id); }}
                          style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: "#334155", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 4, zIndex: 2 }}
                          title="Delete"
                        >✕</button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⬡</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#55556a", marginBottom: 8 }}>
                    {institutions.length === 0 ? "No institutions yet" : "No results found"}
                  </div>
                  <div style={{ color: "#334155", fontSize: 13, marginBottom: 24 }}>
                    {institutions.length === 0
                      ? "Add your first institution to start tracking integration progress."
                      : "Try a different search term."}
                  </div>
                  {institutions.length === 0 && adminUnlocked && (
                    <button
                      onClick={() => setShowAdd(true)}
                      style={{ background: "#6366f1", border: "none", color: "#fff", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}
                    >+ Add First Institution</button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAdd && <AddInstitutionModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}

      {showAdminLogin && (
        <AdminLogin
          onSuccess={() => { setAdminUnlocked(true); setShowAdminLogin(false); }}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "#0a0a0fcc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#111118", border: "0.5px solid #ef444440", borderRadius: 14, padding: 28, maxWidth: 360, width: "90%" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "#f0f0f5", marginBottom: 8 }}>Delete Institution?</div>
            <div style={{ color: "#9999aa", fontSize: 13, marginBottom: 24 }}>This will permanently remove the institution and all task progress. This cannot be undone.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "transparent", border: "0.5px solid #ffffff18", color: "#9999aa", borderRadius: 8, padding: "9px", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, background: "#ef444420", border: "0.5px solid #ef444460", color: "#ef4444", borderRadius: 8, padding: "9px", cursor: "pointer", fontWeight: 500 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}