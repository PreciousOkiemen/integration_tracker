# NIBSS Integration Tracker

A dashboard for tracking FI integration progress across institutions, using a weighted cumulative scoring system that sums to **100%**.

## Scoring System

| Block | Tasks | Weight Each | Total |
|-------|-------|------------|-------|
| Block 1 (t01–t30) | 30 tasks | 3% | 90% |
| Block 2 (t31–t35) | 5 tasks | 2% | 10% |
| **Total** | **35 tasks** | | **100%** |

## Task Groups

1. **Connectivity** — Bi-Directional Connectivity
2. **ACMT / PACS Basic** — Core outbound messages
3. **ACMT / PACS Negative** — Error-path scenarios
4. **PAIN / PACS / CAMT – FI→NIBSS** — Extended outbound
5. **PAIN / PACS / CAMT – NIBSS→FI** — Extended inbound
6. **PAIN / PACS / CAMT – FI→NIBSS Negative** — Negative outbound
7. **PAIN / PACS / CAMT – NIBSS→FI Negative** — Negative inbound

## Features

- Add unlimited institutions with a short code
- Per-task status: **Pending → Pass → Fail → Blocked** (click to cycle)
- Bulk "All Pass" / "Reset" per group
- Live weighted score, progress rings & bars
- Filter by status, search by name
- Sort by name / score / last updated
- All data persists in browser localStorage
- Fully responsive

## Deploy to Vercel

### Option A — GitHub (recommended)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repo → click **Deploy**

### Option B — Vercel CLI

```bash
npm i -g vercel
cd integration-tracker
vercel
```

### Option C — Drag & Drop

1. Run `npm run build` locally
2. Drag the `.next` folder to [vercel.com/new](https://vercel.com/new)

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```
