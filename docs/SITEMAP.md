# Happy Hunt — Site Map

```
/                        Deals feed (default, mobile-first)
├── Filters: category chips (All / Happy Hour / Food / Drinks), "Live now" toggle, radius (mi)
├── DealCard → tap →
│   /deals/:id           Deal detail
│   ├── Venue block → /places/:id
│   ├── Schedule (days + time window, live-now badge)
│   └── "Get directions" → Google Maps (external)
└── PlacePage
    /places/:id          Place detail — venue info + all active deals

Navigation
├── BottomNav: Deals (active) | Map (placeholder) | Saved (placeholder)
└── PWA: installable, standalone display
```

## Planned routes (post-MVP)

| Route | Purpose |
|-------|---------|
| `/map` | Interactive map of deals (Mapbox/Leaflet) |
| `/saved` | Bookmarked deals (localStorage → user accounts later) |
| `/submit` | Community deal submission form |
| `/admin` | Moderation / venue management |
| `/login`, `/settings` | Accounts, preferences, notification settings |
