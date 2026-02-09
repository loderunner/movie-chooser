import { TournamentClient } from "@/components/tournament-client";
import { getMovieCount, getNextMatch, getTournamentState } from "@/lib/actions";

export default async function TournamentPage() {
  const [state, movieCount] = await Promise.all([getTournamentState(), getMovieCount(false)]);

  const nextMatch =
    state.tournament !== null && state.tournament.status === "active"
      ? await getNextMatch(state.tournament.id)
      : null;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Tournament</h1>
      <TournamentClient movieCount={movieCount} nextMatch={nextMatch} state={state} />
    </div>
  );
}
