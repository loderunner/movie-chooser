import { Nav } from "@/components/nav";
import { hasFinishedTournament } from "@/lib/actions";

export async function NavWrapper() {
  const hasFinished = await hasFinishedTournament();

  return <Nav hasFinishedTournament={hasFinished} />;
}
