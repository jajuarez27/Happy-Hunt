# Happy Hunt — Workspace Rules

Rules for anyone (human or agent) working in this repository.

## Directory structure

```
/
├── client/     # React PWA — all UI lives here. No API code.
├── api/        # Express API — all server/data-access code lives here.
├── supabase/   # migrations/ (numbered, append-only) + seeds/
├── docs/       # PRD.md, SITEMAP.md, tasks.md, openapi.yaml, DEPLOYMENT.md
└── README.md, .gitignore, package.json (root convenience scripts only)
```

- **Never** put shared code at the root — if client and api both need it,
  duplicate the small helper or extract a `shared/` package deliberately.
- DB schema changes go in `supabase/migrations/` as a new numbered file
  (`NNNN_description.sql`). Never edit an already-applied migration.
- Seed data changes go in `supabase/seeds/`.
- API docs changes go in `docs/openapi.yaml` in the same PR as the endpoint.

## Code style

- **JavaScript/JSX**, ES modules (`"type": "module"`). No TypeScript yet —
  revisit if the codebase grows.
- React: function components + hooks only. Keep components in
  `client/src/components/`, pages in `client/src/pages/`, pure helpers in
  `client/src/utils.js`, fetch wrappers in `client/src/api.js`.
- Express: routes in `api/src/routes/`, external clients/helpers in
  `api/src/lib/`. Entry point is `api/src/server.js`.
- Formatting: 2-space indent, single quotes, semicolons, ~100 col limit.
  Match the surrounding file when in doubt.
- Naming: camelCase for JS, snake_case for DB columns, kebab-case for
  filenames and CSS classes.
- Comments: sparse — explain *why*, not *what*. Do not add comments unless
  asked; do not remove existing comments.
- No new npm dependencies without checking `package.json` first and
  preferring versions published >7 days ago. Pin exact-ish ranges (`^x.y.z`).

## Secrets & env

- `.env` files are gitignored — commit only `.env.example` with placeholder
  values and comments.
- Never log or commit Supabase service-role keys, API keys, or tokens.
  The client may only ever see `VITE_*` public config.

## Git branching

- `main` is always deployable. Never commit directly to `main`.
- Branch naming: `feat/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`,
  `docs/<short-desc>`.
- Keep PRs small and focused; one concern per branch.
- Rebase or merge `main` before opening a PR; resolve conflicts locally.

## Commit messages

Conventional Commits format:

```
<type>(<scope>): <subject>

<body — why, not what>
```

- **Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`
- **Scopes:** `client`, `api`, `supabase`, `docs`
- Subject: imperative mood, ≤72 chars, no trailing period.
- Examples:
  - `feat(api): add live-now filter to deals endpoint`
  - `fix(client): handle overnight happy hour windows`
  - `docs: add workspace rules and task list`

## Definition of done

Before marking work complete:

1. Relevant acceptance criteria in `docs/tasks.md` checked off.
2. `npm run build` (client) and `node --check` / server boots (api) pass.
3. `docs/openapi.yaml` updated if endpoints changed.
4. Migrations are additive; seeds remain idempotent where practical.
