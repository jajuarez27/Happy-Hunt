# Happy Hunt — Task List

Tasks are organized by user story. Each acceptance criterion is mapped to the
corresponding layer of **Garrett's Elements of UX**:

| Layer | Concern | Legend |
|-------|---------|--------|
| **Strategy** | User needs & product goals | `[S]` |
| **Scope** | Functional & content requirements | `[Sc]` |
| **Structure** | Interaction design & info architecture | `[St]` |
| **Skeleton** | Layout, navigation, component design | `[Sk]` |
| **Surface** | Visual design, branding, polish | `[Su]` |

---

## US-1: Discover deals near me

**Story:** As a budget-conscious user, I want to see deals near my current
location so I can quickly decide where to go.

**Acceptance criteria**

- [ ] `[S]` App requests geolocation on first load and falls back to a default
      location when denied/unavailable.
- [ ] `[Sc]` Deals are returned sorted by distance with an adjustable radius
      (0.5–25 mi).
- [ ] `[St]` Category filter (All / Happy Hour / Food / Drinks) and "Live now"
      toggle compose with the radius filter.
- [ ] `[Sk]` Each deal card shows venue name, distance, title, category badge,
      schedule, and a "Live now" badge when applicable.
- [ ] `[Su]` Empty state explains how to widen the search when no deals match.

**Tasks**

- [ ] API: `GET /api/deals` geo filter + haversine distance sort — done (MVP)
- [ ] Client: `DealsPage` with geolocation, radius input, category chips — done (MVP)
- [ ] Client: `DealCard` component + `isLiveNow` overnight-window logic — done (MVP)
- [ ] API: Replace bounding-box scan with PostGIS `ST_DWithin` at scale
- [ ] Client: Persist last-known location; "Use my location" recenter button
- [ ] Client: Skeleton loading cards instead of text spinner

---

## US-2: Evaluate a deal

**Story:** As a user comparing options, I want deal details (schedule, price,
venue info, directions) so I can judge whether it's worth going.

**Acceptance criteria**

- [ ] `[Sc]` Deal detail shows title, description, schedule, price hint,
      verification status, and distance.
- [ ] `[St]` Venue name links through to the place page; "Get directions"
      deep-links to maps.
- [ ] `[Sk]` Schedule renders human-readable ("Mon–Fri · 4:00–7:00 PM"),
      handling overnight windows (e.g. 10 PM–2 AM).
- `[Su]` Category badges use consistent color coding across feed and detail.

**Tasks**

- [ ] API: `GET /api/deals/:id` with embedded place — done (MVP)
- [ ] Client: `DealDetailPage` — done (MVP)
- [ ] Client: 12-hour time formatting; relative "starts in X" / "ended X ago" labels
- [ ] API: Expose `price_hint` on card/detail (currently fetched, not displayed)
- [ ] Client: Photo support per place/deal (Supabase Storage)

---

## US-3: Browse a venue's deals

**Story:** As a user who found a venue I like, I want to see everything it
offers so I can plan a visit.

**Acceptance criteria**

- [ ] `[Sc]` Place page lists all active deals for the venue.
- [ ] `[St]` Reachable from deal detail; breadcrumb back to feed.
- `[Sk]` Venue address/neighborhood/city and directions link displayed.

**Tasks**

- [ ] API: `GET /api/places/:id` returns place + active deals — done (MVP)
- [ ] Client: `PlacePage` — done (MVP)
- [ ] API: Filter expired deals via `valid_from`/`valid_until` — done (MVP)

---

## US-4: Trust the data

**Story:** As a user, I want to know deals are current and accurate so I don't
show up to a closed happy hour.

**Acceptance criteria**

- [ ] `[S]` Verified deals are visually distinguished from unverified ones.
- [ ] `[Sc]` Expired deals (`valid_until` passed) never appear in results.
- [ ] `[St]` "Live now" filter is computed server-side against venue-local time.
- [ ] `[Sk]` Verified badge + last-updated timestamp visible on detail page.

**Tasks**

- [ ] DB: `is_verified`, `valid_from`, `valid_until` columns — done (MVP)
- [ ] API: `live=true` filter (currently server-local time — add `timezone`
      column per place and compute in venue-local time)
- [ ] Client: Show verification badge on `DealCard` — done (MVP)
- [ ] Future: Community "deal expired" reporting + freshness scoring
- [ ] Future: Admin moderation queue for submissions

---

## US-5: Install & use on mobile

**Story:** As a mobile user, I want Happy Hunt installable like a native app
so I can get to deals fast.

**Acceptance criteria**

- [ ] `[Sc]` PWA manifest with name, icons, theme color, standalone display.
- [ ] `[St]` Bottom navigation on mobile; collapses gracefully on desktop.
- `[Sk]` Layout is mobile-first (single column, touch-friendly targets ≥44px).
- `[Su]` Dark theme, consistent brand accent color.

**Tasks**

- [ ] `vite-plugin-pwa` configured with manifest — done (MVP)
- [ ] `BottomNav` component — done (MVP)
- [ ] Replace SVG icon with 192px + 512px PNG maskable icons
- [ ] Add `robots.txt`, OG meta tags, custom 404
- [ ] Future: Map tab (Leaflet/Mapbox) and Saved tab (localStorage → accounts)

---

## US-6: Submit & manage deals (post-MVP)

**Story:** As a venue owner or community member, I want to add and keep deals
up to date so listings stay fresh.

**Acceptance criteria**

- [ ] `[Sc]` Submission form: venue, title, category, schedule, price hint.
- [ ] `[St]` Submissions enter a moderation queue before going live.
- `[Sk]` Owners can edit/deactivate their own deals.

**Tasks**

- [ ] Auth (Supabase Auth) + venue-owner role
- [ ] `POST /api/deals` (service-role or owner-scoped writes)
- [ ] Client: `/submit` and `/admin` routes per SITEMAP
- [ ] Moderation workflow + audit log

---

## Cross-cutting tasks

- [ ] `[St]` Loading, empty, and error states on every data-fetching view
- [ ] `[Sk]` Responsive breakpoints verified at 360px / 768px / 1280px
- [ ] `[Su]` Accessibility pass: aria labels, contrast ≥4.5:1, keyboard nav
- [ ] API: Rate limiting + tightened CORS for production
- [ ] API: OpenAPI spec kept in sync (`docs/openapi.yaml`)
- [ ] CI: lint + build checks for client and api on PR
