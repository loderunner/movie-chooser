# Task 08 — Match-Up Page

## Goal

Build `/tournament/match` — two movies face-to-face, user picks the winner.

## Behavior

Load `getTournamentState()`, get next match. If no active tournament or no match → redirect to `/tournament`.

## Layout

**Header**: Round label ("Round of 16 — Match 3 of 8", "Semifinal", "🏆 The Final") + back link (`ArrowLeftIcon`).

**Mobile (<768px)**: Cards stacked vertically with ⚡ VS ⚡ divider between them.

**Desktop (≥768px)**: Cards side by side with VS divider in center.

Each card: `MovieCard` (matchup variant) showing large poster, title, year, director, cast, genre pills, synopsis (truncatable). "Pick this one" button at bottom.

## Pick interaction

1. Click "Pick this one" → confirmation dialog ("Advance _Title_? This cannot be undone.")
2. On confirm → `pickWinner(matchId, winnerId)`.
3. Brief win animation (winner card glows, loser fades).
4. After ~1s: if `tournamentFinished` → navigate to `/tournament/winner`. Otherwise → reload to show next match.

## Edge cases

No tournament → redirect. Match already played → show result + link to next.

## Done when

- [ ] Full matchup flow works through multiple rounds
- [ ] Confirmation dialog prevents accidental picks
- [ ] Post-pick transition feels smooth
- [ ] `npm run check` passes
