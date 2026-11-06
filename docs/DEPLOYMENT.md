# Happy Hunt — Deployment Notes

## Architecture

```
React PWA (static)  ──►  Express API  ──►  Supabase (Postgres)
   Vercel/Netlify          Railway/Render/Fly    supabase.com
```

The client is a static build — host it anywhere. The API is a long-running
Node process — use a platform with a persistent process (Railway, Render,
Fly.io) or a serverless wrapper (not configured in MVP).

## Supabase

1. Create a project at https://supabase.com.
2. Apply `supabase/migrations/0001_init.sql` via the SQL editor or CLI:
   `supabase db push`
3. Load sample data: `psql "$DB_URL" -f supabase/seeds/seed.sql`
   (optional — remove before production if you don't want demo venues).
4. Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` into API env vars.
   The API uses the anon key for reads (RLS allows public `select`).
   Add `SUPABASE_SERVICE_ROLE_KEY` only if write/admin routes are added —
   never expose it to the client.

## API (Express)

Environment variables (`api/.env` locally, platform env vars in prod):

| Var | Required | Notes |
|-----|----------|-------|
| `SUPABASE_URL` | yes | e.g. `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | yes | public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | no | bypasses RLS; keep secret |
| `PORT` | no | defaults to 4000 |

Deploy:

```bash
cd api
npm ci --omit=dev
npm start
```

Set the platform's health check to `GET /api/health`.

## Client (PWA)

```bash
cd client
cp .env.example .env.production   # set VITE_API_URL to your deployed API
npm ci
npm run build                     # outputs client/dist
```

Deploy `client/dist` to Vercel/Netlify/any static host.

- `VITE_API_URL` is baked in at build time — rebuild when the API URL changes.
- For production, ensure the API has CORS open to your client origin
  (currently `cors()` allows all origins; tighten before launch).
- HTTPS is required for geolocation and PWA install on mobile.
- `vite-plugin-pwa` generates the service worker automatically in the build.

## Local development

```bash
npm run install:all   # root
npm run dev:api       # terminal 1 → :4000
npm run dev:client    # terminal 2 → :5173 (LAN-exposed for phone testing)
```

## Scaling notes / TODO before real users

- Replace bounding-box + in-app haversine with PostGIS `ST_DWithin`.
- Add caching (Redis or HTTP cache headers) on `/api/deals`.
- Add rate limiting on the API.
- Replace placeholder Map/Saved tabs.
