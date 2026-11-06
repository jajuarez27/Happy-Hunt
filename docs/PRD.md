# Happy Hunt — Product Requirements Document

## 1. Overview

Happy Hunt is a mobile-first web app that aggregates local happy hour deals,
food specials, and drink specials so budget-conscious users can quickly find
and compare deals near them.

## 2. Goals

- Help users discover deals within walking/short-distance range.
- Show at a glance whether a deal is **live right now**, its schedule, and its price hint.
- Keep data fresh and trustworthy via community verification.

## 3. Users

| Persona | Need |
|---------|------|
| Budget-conscious local | "Where can I get cheap drinks/food in the next hour?" |
| Planner | "What deals run on Fridays near my office?" |
| Venue owner (future) | Submit and manage their own specials. |

## 4. Features (MVP)

### Client (React PWA)
- Deal feed sorted by distance, filterable by category (happy hour / food / drinks) and "live now".
- Radius selector (miles) and geolocation-based "near me".
- Deal detail: venue info, schedule, price hint, directions link, verification status.
- Place detail: all deals at a venue.
- Installable PWA (manifest + service worker via vite-plugin-pwa).
- Map view and saved deals (placeholders in nav; post-MVP).

### API (Express)
- `GET /api/deals` — geo-filtered, category-filtered deal search.
- `GET /api/deals/:id` — deal detail.
- `GET /api/places/:id` — place + its deals.
- `GET /api/health` — liveness probe.

### Data (Supabase/Postgres)
- `places` — venues with name, category, address, lat/lng.
- `deals` — title, description, category, `days_of_week[]`, `start_time`/`end_time`, price hint, validity window, verification flag.

## 5. Non-goals (MVP)

- User accounts, submissions, and moderation workflows.
- Push notifications ("deal starts in 30 min").
- Payment/ordering integration.
- Real-time updates (polling is sufficient at MVP scale).

## 6. Success metrics

- % of sessions where a user views a deal detail.
- Deals marked verified per venue.
- Weekly active users returning for "live now" deals.

## 7. Future considerations

- PostGIS for scalable geo queries (current MVP uses bounding-box + haversine in app code).
- Admin/moderation dashboard; venue self-service portal.
- Crowdsourced "deal expired" reports and freshness scoring.
- iOS/Android wrappers via Capacitor if app-store presence is desired.
