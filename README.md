# Threat Intelligence Dashboard

An interactive bot-detection and traffic-analysis dashboard built with React, TypeScript and Vite. It takes a
labelled session dataset and turns it into something an analyst can actually work with: anomaly plots, geographic
and traffic-source breakdowns, per-session drill-downs, and exportable reports.

**Live demo:** deployed on Render (free tier, so the first request may take ~50s while the instance wakes up).

## What it does

- **KPI overview** — total sessions, detected bots, average anomaly score and conversion rate at a glance.
- **Anomaly scatter plot** — sessions plotted by threat score against behavioural metrics, so outliers separate
  visually instead of hiding in a table.
- **Geographic distribution** — where suspicious traffic is coming from.
- **Traffic source and distribution charts** — which channels carry the highest bot ratio.
- **Behavioural comparison** — bot vs. human sessions across page views, session duration, bounce rate and
  clicks per second.
- **Suspicious sessions table** — sortable, filterable, with a detail modal per session showing the specific
  risk factors that flagged it (for example high click velocity, or very short sessions consistent with
  inventory hoarding).
- **Natural-language query bar** — filter the dataset with plain-language input rather than building filters
  by hand.
- **Threat summary panel** — a rule-based analysis layer that surfaces the highest-risk traffic source and
  the dominant risk patterns in the current filtered view.
- **Report export** — export the current view to PDF (jsPDF + html2canvas) or the underlying rows to CSV.
- **Light and dark themes**, and a live-simulation mode that streams sessions in to demonstrate the dashboard
  under moving data.

## Honest notes on the data

This is a portfolio/analysis project, not a production security tool, and the README should say so:

- The dataset is a **labelled bot-detection CSV** (`public/bot_detection_results.csv`) with real behavioural
  columns — page views, session duration, bounce rate, traffic source, time on page, previous visits,
  conversion rate, clicks per second and an `is_bot` label.
- **Session IDs, IP addresses and countries are synthesised at load time** for demonstration purposes. They are
  not real network observations.
- The **anomaly score is derived from the `is_bot` label**, not computed by a live model inside the app.
- The threat summary is **rule-based**, not an LLM.

Everything the dashboard *displays* is computed from the dataset; the framing above is to make clear which
fields are genuine measurements and which are illustrative.

## Tech stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · Recharts · PapaParse · jsPDF · html2canvas · lucide-react

Deployment: Docker, with `render.yaml` for Render and `vercel.json` for Vercel.

## Running locally

```bash
npm install
npm run dev
```

The app starts on `http://localhost:5173`.

Other scripts:

```bash
npm run build     # type-check and produce a production build
npm run preview   # serve the production build locally
npm run lint      # eslint
```

### Docker

```bash
docker build -t threat-intel-dashboard .
docker run -p 8080:80 threat-intel-dashboard
```

## Project structure

```
src/
├── components/
│   ├── AI/            # rule-based threat summary panel
│   ├── Charts/        # anomaly scatter, geo map, traffic, conversion, behavioural comparison
│   ├── Filters/       # filter sidebar
│   ├── KPI/           # stat cards
│   ├── Layout/        # dashboard shell
│   ├── Live/          # threat leaderboard
│   ├── Reporting/     # PDF report exporter
│   ├── Search/        # natural-language query bar
│   ├── Table/         # suspicious sessions table
│   └── UI/            # session detail modal, export button, theme toggle
├── context/           # data and theme providers
├── hooks/             # real-time simulation, report export
├── types/             # shared TypeScript types
└── utils/             # CSV loading and parsing
```

## Using your own data

Replace `public/bot_detection_results.csv` with a CSV carrying the same headers — `Page Views`,
`Session Duration`, `Bounce Rate`, `Traffic Source`, `Time on Page`, `Previous Visits`, `Conversion Rate`,
`clicks_per_second`, `is_bot` — and the dashboard will pick it up on reload. The parsing and risk-factor rules
live in `src/utils/csvLoader.ts`.

## Author

**Arnav Mishra** — [GitHub](https://github.com/Arnavmishra002) · [Portfolio](https://arnavmishra002.github.io/)
