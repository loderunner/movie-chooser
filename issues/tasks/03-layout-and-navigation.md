# Task 03 — Layout & Navigation

## Goal

Build the root layout, bottom tab bar, and the reusable `MovieCard` component.

## Navigation

Bottom tab bar on mobile (fixed), top bar on desktop (≥768px). Three tabs:

| Tab        | Phosphor Icon    | Route         | Label      |
| ---------- | ---------------- | ------------- | ---------- |
| Movies     | `FilmStripIcon`  | `/movies`     | Movies     |
| Add        | `PlusCircleIcon` | `/movies/add` | Add        |
| Tournament | `TrophyIcon`     | `/tournament` | Tournament |

Active tab: amber accent color + `weight="fill"`. Inactive: muted gray + `weight="bold"`.

## Implement

### Root layout (`src/app/layout.tsx`)

Metadata, Inter font, `<Nav />`, `<Toaster />` (sonner). Container accounts for bottom nav height on mobile.

### Home redirect (`src/app/page.tsx`)

`redirect("/movies")`.

### `MovieCard` (`src/components/movie-card.tsx`)

Props: movie data + `variant` ("list" | "matchup" | "winner") + optional onClick + optional actions slot.

- **list**: horizontal — poster thumb left (~80px), text right (title, year, genres, director).
- **matchup**: vertical — large poster top, full details below.
- **winner**: like matchup + amber border/glow + trophy badge.

Poster via `next/image` from TMDB. Fallback for missing posters. **No ratings anywhere.**

## Done when

- [ ] Nav works on mobile (375px) and desktop
- [ ] All routes render placeholder content
- [ ] `npm run check` passes
