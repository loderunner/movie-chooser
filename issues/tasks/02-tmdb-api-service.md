# Task 02 — TMDB API Service

## Goal

Build the server-side TMDB client and a search proxy route handler.

## TMDB API

- Base: `https://api.themoviedb.org/3`
- Auth: `Authorization: Bearer ${TMDB_API_KEY}`
- Image base: `https://image.tmdb.org/t/p/w500`

## Implement

### `src/lib/tmdb.ts`

`searchMovies(query)` — calls `/search/movie`, returns top 10 results with poster_path (skip items without posters).

`getMovieDetails(tmdbId)` — calls `/movie/{id}?append_to_response=credits`, returns a flat object with: tmdbId, title, year, overview, posterPath, backdropPath, genres (comma-separated), director (from crew), cast (top 4 names).

### `src/types/index.ts`

Define `TMDBSearchResult` and `TMDBMovieDetails` interfaces.

### `src/app/api/tmdb/search/route.ts`

`GET /api/tmdb/search?q=...` — proxies search requests so the API key stays server-side. Returns `[]` if query is < 2 chars.

## Verify

- `http://localhost:3000/api/tmdb/search?q=matrix` returns JSON results.
- `npm run check` passes.
