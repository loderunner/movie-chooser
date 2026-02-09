import { redirect } from "next/navigation";

import { WinnerClient } from "@/components/winner-client";
import { getTournamentState } from "@/lib/actions";

export default async function WinnerPage() {
  const state = await getTournamentState();

  // No finished tournament with winner
  if (
    state.tournament === null ||
    state.tournament.status !== "finished" ||
    state.winnerMovie === null
  ) {
    redirect("/tournament");
  }

  return <WinnerClient winnerMovie={state.winnerMovie} />;
}
