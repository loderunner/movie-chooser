# Task 07 — Tournament Status Page

## Goal

Build `/tournament` with bracket visualization and tournament lifecycle controls.

## Three states

### No tournament

Phosphor `TrophyIcon` (duotone, large) + "No tournament in progress." + "New tournament" button (disabled if < 16 movies).

### Active tournament

Bracket visualization + "Play next match" button (amber) → `/tournament/match` + subtle "Abandon tournament" text button with confirmation.

### Finished tournament

Full bracket + winner banner ("🏆 _Title_ wins!") + "We watched it!" / "Not yet" buttons → `/tournament/winner`.

## Bracket component (`src/components/bracket.tsx`)

Classic horizontal bracket, left → right, 4 columns (rounds). Each match node: movie titles (truncated with tooltip), small poster thumbnails (32px), winner highlighted in amber, unplayed matches dimmed, next match has pulsing border.

Connecting lines via CSS borders or SVG.

**Mobile**: horizontally scrollable container with hint text.

**Desktop (≥768px)**: full bracket visible.

## "New tournament" button

If a tournament already exists → confirmation dialog ("This will end the current tournament. Continue?") → `createTournament()` → redirect.

## Done when

- [ ] All three states render correctly
- [ ] Bracket shows all 4 rounds with connecting lines
- [ ] Mobile: horizontal scroll works
- [ ] `npm run check` passes
