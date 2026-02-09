# Task 04 — Add Movie Page

## Goal

Build `/movies/add` — search TMDB, preview, add to watchlist.

## UX Flow

1. User types in search input → debounced (300ms) fetch to `/api/tmdb/search?q=...`.
2. Dropdown shows results (poster thumb + title + year).
3. Click result → preview card appears (poster, title, year, genres, overview).
4. Click "Add to watchlist" → server action → redirect to `/movies`.
5. Duplicate `tmdb_id` → error toast.

## Implement

**Search input** (client component): `MagnifyingGlassIcon`, debounced fetch, dropdown with results, close on Escape/click-outside.

**Server action** `addMovie(tmdbId)`: calls `getMovieDetails`, checks for duplicate, inserts into DB, revalidates `/movies`.

## Done when

- [ ] Search, select, add flow works end-to-end
- [ ] Duplicate detection shows error toast
- [ ] Mobile-friendly (375px)
- [ ] `npm run check` passes
