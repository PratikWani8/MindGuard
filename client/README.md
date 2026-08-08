# MindGuard — Frontend

A complete, runnable React + Vite frontend for **MindGuard**, an AI-powered mental
wellness early-warning and support platform. This is the frontend only — it talks
to the Node/Express + FastAPI backend through a configurable `VITE_API_URL`, and
ships with realistic mock data so every screen is fully interactive out of the box.

## Stack

React · Vite · Tailwind CSS · React Router · Axios · Framer Motion · Recharts · Lucide React

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). Register with any
name/email/password — mock auth accepts anything and logs you straight into the
dashboard.

## Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

- `VITE_API_URL` — base URL of the backend API (default `http://localhost:5000/api`)
- `VITE_USE_MOCKS` — `true` (default) makes every service function resolve with
  local mock data instead of calling the network, so the UI works standalone.
  Set to `false` once your backend is running and reachable at `VITE_API_URL`.

## Connecting the real backend

Every network call lives in `src/services/*.js`. Each function already has the
real `axios` call written — it's just gated behind `USE_MOCKS`. To go live:

1. Set `VITE_USE_MOCKS=false` in `.env`
2. Point `VITE_API_URL` at your Node/Express server
3. Make sure your backend implements the endpoint groups the frontend expects:
   `/api/auth`, `/api/users`, `/api/checkins`, `/api/journals`, `/api/insights`,
   `/api/wellness`, `/api/support`, `/api/chat`

No component code needs to change — the service layer is the only integration point.

## Project structure

```
src/
├── components/
│   ├── layout/       Navbar, Footer, Sidebar, Topbar, DashboardLayout, PublicLayout
│   ├── common/        Button, GlassCard, LoadingSpinner, EmptyState, ProtectedRoute…
│   ├── cards/         StatCard, RiskBadge, InsightCard
│   └── charts/        MoodTrendChart, MultiTrendChart, EmotionDonut, TriggerBarChart
├── pages/
│   ├── public/         Landing, About, HowItWorks, Privacy
│   ├── auth/            Login, Register
│   └── dashboard/     Dashboard, Checkin, Journal(+History/+Entry), Insights,
│                       Trends, WellnessPlan, Assistant, Support, Profile, Settings
├── services/          api.js + one file per domain (auth/checkin/journal/insight/wellness/support/chat)
├── context/           AuthContext (token + user state, protects /dashboard/*)
├── data/              mockData.js — single source of truth for mock content
└── utils/             small helpers (cn, etc.)
```

## Notes

- All wellbeing/risk language is intentionally framed as a **support signal, not a
  diagnosis** — see `RiskBadge` and the copy across Insights/Support pages.
- No AI provider keys or LLM calls happen in the browser — the `Assistant` page
  calls `services/chatApi.js`, which is meant to hit your backend's `/api/chat`.
- Reduced-motion is respected globally (see `index.css`).
- Every async page shows loading/empty/error states rather than blank screens.

## Build for production

```bash
npm run build
```

Output goes to `dist/`.
