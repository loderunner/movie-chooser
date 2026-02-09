# Task 05 — Movie List Page

## Goal

Build `/movies` with infinite scroll, watchlist/watched toggle, delete, and "New tournament" button.

## Layout

Header: "My Movies" title, count badge, Watchlist/Watched toggle, "New tournament" button (disabled if < 16 non-archived movies with tooltip).

List: `MovieCard` (list variant), sorted by created_at desc. Delete button (`TrashIcon`, red) on each card opens confirmation dialog. Cannot delete a movie in an active tournament.

## Infinite scroll

Cursor-based pagination. Server component renders first 20, client component (`MovieListClient`) loads more via `IntersectionObserver`. Server action `getMovies({ cursor?, archived, limit })` returns `{ movies, nextCursor }`.

Remember: `searchParams` must be `await`ed in Next.js 16.

## Server actions

`getMovies(params)` — cursor-based fetch. `deleteMovie(movieId)` — prevents deletion if in active tournament, otherwise deletes + revalidates.

## Empty states

- Zero movies: icon + "No movies yet" + CTA to `/movies/add`.
- Zero archived: "You haven't watched any tournament winners yet."
- < 16 movies: "Add N more movies to start a tournament!"

## Done when

- [ ] Infinite scroll works
- [ ] Toggle between watchlist/watched
- [ ] Delete works with confirmation
- [ ] Empty states display correctly
- [ ] `npm run check` passes
