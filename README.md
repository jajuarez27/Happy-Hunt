# Happy Hunt

A mobile-first web app that aggregates local happy hour deals, food specials,
and drink specials so budget-conscious users can find and compare deals nearby.

## Repository layout

```
/
├── client/     # React PWA (Vite)
├── api/        # Express API
├── supabase/   # SQL migrations + seeds
├── docs/       # PRD, site map, OpenAPI spec, deployment notes
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- A Supabase project (URL + anon/service role keys)

## Getting started

### 1. Database

Apply migrations and seed data to your Supabase project:

```bash
# Using the Supabase CLI (link your project first):
supabase link --project-ref <your-project-ref>
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seeds/seed.sql
```

Or paste the SQL files into the Supabase SQL editor.

### 2. API

```bash
cd api
cp .env.example .env   # fill in your Supabase credentials
npm install
npm run dev            # http://localhost:4000
```

### 3. Client

```bash
cd client
cp .env.example .env   # set VITE_API_URL=http://localhost:4000
npm install
npm run dev            # http://localhost:5173
```

Open the client on your phone (same Wi-Fi) via the Vite network URL — the app is
mobile-first and can request geolocation to show nearby deals.

## Scripts

| Package | Command       | Description          |
|---------|---------------|----------------------|
| api     | `npm run dev` | Start dev server     |
| api     | `npm start`   | Start production     |
| client  | `npm run dev` | Vite dev server      |
| client  | `npm run build` | Production PWA build |
| client  | `npm run preview` | Preview the build  |

## Documentation

See `docs/` for the product requirements (`PRD.md`), site map (`SITEMAP.md`),
API contract (`openapi.yaml`), and deployment guide (`DEPLOYMENT.md`).
