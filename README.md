# R22Ek025 – Client-only URL Shortener

A responsive React app that shortens URLs and shows basic analytics, implemented entirely on the client (no backend).

## Features
- Generate short links fully in-browser (unique codes, optional custom code, expiry).
- Client-side redirect at `/s/:code` with a visible fallback link.
- Stats stored in `localStorage` (click counts + simple event log).
- Material UI styling and React Router navigation (Home, Stats).
- Optional logging via the included minimal log helper.

## Tech
- React 18, Vite, React Router, Material UI.
- Data persistence: `localStorage` only.

## Run (Windows PowerShell)
1. `cd "Frontend Test Submission"`
2. `npm install`
3. `npm run start`  → open http://localhost:3000

Build & preview:
- `npm run build`
- `npm run preview` → http://localhost:3000

## Usage
- On Home, enter up to 5 URLs (optionally a custom shortcode and TTL minutes) and click Create.
- See created links on the Stats page; click a link to navigate via `/s/:code`.
- In the Home page, you can save a logging token (optional) that’s used for log calls.

## Notes
- All functionality runs in the browser—no server required.
- Redirect normalizes missing protocols (e.g., `example.com` → `https://example.com`).

## Repo layout
- `Frontend Test Submission/` – React app (client-only URL shortener).
- `Logging Middleware/` – Minimal log client (standalone), kept for reference.

