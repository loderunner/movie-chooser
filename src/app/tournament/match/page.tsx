import { redirect } from "next/navigation";

import { MatchupClient } from "@/components/matchup-client";
import { getNextMatch, getTournamentState } from "@/lib/actions";

export default async function MatchPage() {
  const state = await getTournamentState();

  // No active tournament
  if (state.tournament === null || state.tournament.status !== "active") {
    redirect("/tournament");
  }

  const nextMatch = await getNextMatch(state.tournament.id);

  // No match to play
  if (nextMatch === null) {
    redirect("/tournament");
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <MatchupClient match={nextMatch} />
    </div>
  );
}
