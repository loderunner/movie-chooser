# Task 09 — Winner Page & End-to-End Polish

## Goal

Build `/tournament/winner` and verify the complete tournament lifecycle.

## Winner page

**Layout**: Large Phosphor `TrophyIcon` (fill, amber, 64px+) + "The Winner Is..." + `MovieCard` (winner variant: amber glow, trophy badge). Optional lightweight confetti animation.

**Buttons**: "We watched it! 🎬" (amber, calls `endTournament(true)`) and "Not yet" (outlined, calls `endTournament(false)`). Note below: "If you watched it, the movie will be moved to your Watched list." After either → toast + redirect to `/movies`.

## Nav badge

When a tournament is "finished", show a small amber dot on the Tournament tab in nav.

## End-to-end verification

Walk through the complete flow:

1. `/movies` → 16+ movies → "New tournament"
2. `/tournament` → bracket shown → "Play next match"
3. `/tournament/match` → pick winner → next match loads
4. Repeat all 15 matches
5. → `/tournament/winner` → celebration → "We watched it!"
6. → `/movies` → movie in "Watched" tab
7. → `/tournament` → "No tournament" state

Also verify:

- New tournament while one is active → ends old one (with confirm)
- Bracket shows all past match results correctly
- Nav badge clears after tournament ends
- All pages work at 375px
- No console errors

## Done when

- [ ] Winner page with celebration
- [ ] "We watched it!" archives movie + ends tournament
- [ ] "Not yet" ends tournament without archiving
- [ ] Nav badge appears/clears correctly
- [ ] Full E2E flow works
- [ ] All pages work on mobile (375px)
- [ ] `npm run check` passes
- [ ] No console errors
