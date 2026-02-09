# Movie Chooser App

A single-user web app that helps a household pick a movie to watch by running 16-movie bracket-style tournaments on their watchlist.

## Stack

| Layer      | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)            |
| Language   | TypeScript (strict)                           |
| Styling    | Tailwind CSS v4 + shadcn/ui                   |
| Database   | Neon Postgres (via Vercel Marketplace)        |
| ORM        | Drizzle ORM + drizzle-kit                     |
| Movie data | TMDB API v3 (server-side only)                |
| Icons      | @phosphor-icons/react                         |
| Linting    | ESLint flat config + eslint-config-loderunner |
| Formatting | Prettier                                      |
| Deployment | Vercel                                        |

## Build & validate

```bash
npm run dev          # start dev server
npm run check        # must pass after every task
```

`npm run check` runs:

```bash
prettier --check . && eslint --max-warnings=0 && tsc --noEmit
```

Fix formatting with `npx prettier --write .` before committing. Never suppress ESLint warnings with `eslint-disable` unless truly unavoidable.

## Task execution

Tasks live in `tasks/00-project-scaffolding.md` through `tasks/09-winner-page.md`. Execute them **in order**. Each task assumes prior tasks are complete.

For each task:

1. Read the task file completely before writing code.
2. Implement everything described.
3. Run `npm run dev` and verify visually if applicable.
4. Run `npm run check` — fix all issues.
5. `git add -A && git commit -m "feat: <short description>"`.

## Conventions

**Server Components by default.** Only add `"use client"` for interactivity.

**Server Actions** for all mutations. Define in `lib/actions.ts` or co-located files.

**Route Handlers** only for the TMDB search proxy (`app/api/tmdb/search/route.ts`).

**Mobile-first.** Everything must work at 375px. Enhance with breakpoints.

**No auth.** Single-household app.

**No ratings.** No TMDB score, IMDb, or Rotten Tomatoes in the UI anywhere.

### Next.js 16

- Turbopack is the default — no `--turbopack` flag.
- `params` and `searchParams` must be `await`ed in pages/layouts/route handlers.
- React 19.2. `forwardRef` is unnecessary.
- Add `@phosphor-icons/react` to `optimizePackageImports` in `next.config.ts`.

### Tailwind CSS v4

- **No `tailwind.config.ts`.** CSS-first configuration.
- `@import "tailwindcss"` + `@theme inline { ... }` in `globals.css`.
- Install: `npm install tailwindcss @tailwindcss/postcss`, configure `postcss.config.mjs`.

### Phosphor Icons

- Client components: `import { FilmStripIcon } from "@phosphor-icons/react"`
- Server components: `import { FilmStripIcon } from "@phosphor-icons/react/ssr"`
- Nav: `weight="bold"` default, `weight="fill"` for active state.

### ESLint (eslint-config-loderunner)

Modular flat config using subpath imports in `eslint.config.mjs`:

```js
import baseConfig from "eslint-config-loderunner/base";
import typescriptConfig from "eslint-config-loderunner/typescript";
import reactConfig from "eslint-config-loderunner/react";
import importConfig from "eslint-config-loderunner/import";
import formattingConfig from "eslint-config-loderunner/formatting"; // MUST BE LAST
```

Peer deps to install: `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`, `eslint-import-resolver-typescript`.

## Color palette

- **Primary**: Deep indigo (indigo-600/700/900) — nav, headers, primary buttons, bracket lines.
- **Accent**: Warm amber/gold (amber-400/500/600) — highlights, winner badges, active states.
- **Neutrals**: Slate/zinc grays.
- **Danger**: Red for destructive actions only.

## Environment variables

```
DATABASE_URL=          # Neon pooled connection string
TMDB_API_KEY=          # TMDB v3 Bearer token
```

## Project structure

```
src/
  app/
    layout.tsx
    page.tsx                # redirects to /movies
    movies/
      page.tsx              # movie list
      add/page.tsx          # add movie
    tournament/
      page.tsx              # bracket status
      match/page.tsx        # head-to-head
      winner/page.tsx       # winner display
    api/tmdb/search/route.ts
  components/
    ui/                     # shadcn/ui
    movie-card.tsx
    bracket.tsx
    nav.tsx
  lib/
    db/schema.ts
    db/index.ts
    tmdb.ts
    actions.ts
    env.ts
    utils.ts
  types/index.ts
eslint.config.mjs
.prettierrc
```
