# Task 01 — Database Schema

## Goal

Define the Drizzle schema and push it to Neon Postgres.

## Tables

### `movies`

id (serial PK), tmdb_id (integer, unique, not null), title (text, not null), year (integer), overview (text), poster_path (text), backdrop_path (text), genres (text, comma-separated), director (text), cast (text, comma-separated), archived (boolean, default false), created_at (timestamp, default now).

### `tournaments`

id (serial PK), status (text: "active" | "finished" | "ended"), winner_movie_id (integer FK → movies, nullable), created_at (timestamp, default now), ended_at (timestamp, nullable).

### `matches`

id (serial PK), tournament_id (integer FK → tournaments, not null), round (integer, 1–4), position (integer, 0-indexed within round), movie1_id (integer FK → movies, nullable), movie2_id (integer FK → movies, nullable), winner_id (integer FK → movies, nullable), played_at (timestamp, nullable).

## Steps

1. Implement in `src/lib/db/schema.ts` with `pgTable`. Add indexes on tmdb_id (unique), archived, status, tournament_id.
2. Define Drizzle `relations` for type-safe queries.
3. Run `npx drizzle-kit push`.
4. Verify tables in Neon console.
5. `npm run check`.

## Done when

- [ ] All three tables exist in DB with correct columns
- [ ] `npm run check` passes
