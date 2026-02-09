# Task 06 — Tournament Engine

## Goal

Implement tournament business logic (no UI). 16-movie single-elimination bracket, 4 rounds, 15 matches.

## Bracket structure

| Round | Name          | Matches           |
| ----- | ------------- | ----------------- |
| 1     | Round of 16   | 8 (positions 0–7) |
| 2     | Quarterfinals | 4 (positions 0–3) |
| 3     | Semifinals    | 2 (positions 0–1) |
| 4     | Final         | 1 (position 0)    |

**Advancement formula**: Winner of (round R, position P) → (round R+1, floor(P/2)). If P is even → movie1, if P is odd → movie2.

## Server actions

### `createTournament()`

- Require ≥ 16 non-archived movies.
- End any existing active/finished tournament.
- Pick 16 random movies, create tournament + all 15 matches (round 1 seeded, rounds 2–4 with null movie IDs).

### `pickWinner(matchId, winnerId)`

- Validate match belongs to active tournament, not yet played, winnerId is valid.
- Set winner_id + played_at, advance winner to next round.
- If final → set tournament winner_movie_id, status = "finished".

### `getNextMatch(tournamentId)`

- First unplayed match (ordered by round ASC, position ASC) where both movie IDs are set.

### `getTournamentState()`

- Current active/finished tournament with all matches + movie data.

### `endTournament(watched: boolean)`

- If watched → archive the winning movie.
- Set status = "ended", ended_at = now().

## Types

Add `MatchWithMovies` to `src/types/index.ts`.

## Test

Create a tournament via temporary script/page, verify 15 matches in DB, pick a Round 1 winner, confirm advancement to Round 2.

## Done when

- [ ] Full bracket creation + advancement logic works
- [ ] `npm run check` passes
