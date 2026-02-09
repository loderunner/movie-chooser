"use client";

import { Trophy } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Bracket } from "@/components/bracket";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type TournamentState, createTournament, endTournament } from "@/lib/actions";
import type { MatchWithMovies } from "@/types";

interface TournamentClientProps {
  state: TournamentState;
  movieCount: number;
  nextMatch: MatchWithMovies | null;
}

export function TournamentClient({ state, movieCount, nextMatch }: TournamentClientProps) {
  const router = useRouter();
  const [showNewTournamentDialog, setShowNewTournamentDialog] = useState(false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const canStartTournament = movieCount >= 16;
  const moviesNeeded = 16 - movieCount;

  async function handleCreateTournament() {
    setIsCreating(true);
    try {
      const result = await createTournament();
      if (result.error !== undefined) {
        toast.error(result.error);
      } else {
        toast.success("Tournament created!");
        router.refresh();
      }
    } catch {
      toast.error("Failed to create tournament");
    } finally {
      setIsCreating(false);
      setShowNewTournamentDialog(false);
    }
  }

  async function handleAbandonTournament() {
    setIsCreating(true);
    try {
      const result = await createTournament();
      if (result.error !== undefined) {
        toast.error(result.error);
      } else {
        toast.success("Previous tournament ended. New tournament created!");
        router.refresh();
      }
    } catch {
      toast.error("Failed to create tournament");
    } finally {
      setIsCreating(false);
      setShowAbandonDialog(false);
    }
  }

  async function handleEndTournament(watched: boolean) {
    setIsEnding(true);
    try {
      const result = await endTournament(watched);
      if (result.error !== undefined) {
        toast.error(result.error);
      } else {
        if (watched) {
          toast.success("Movie marked as watched!");
        } else {
          toast.success("Tournament ended");
        }
        router.push("/movies");
      }
    } catch {
      toast.error("Failed to end tournament");
    } finally {
      setIsEnding(false);
    }
  }

  // No tournament state
  if (state.tournament === null) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Trophy className="mb-4 h-20 w-20 text-muted-foreground" weight="duotone" />
        <h2 className="mb-2 text-xl font-semibold">No tournament in progress</h2>
        <p className="mb-6 text-muted-foreground">
          {canStartTournament
            ? "Start a tournament to pick your next movie to watch!"
            : `Add ${moviesNeeded} more movie${moviesNeeded !== 1 ? "s" : ""} to start a tournament.`}
        </p>
        <Button
          disabled={!canStartTournament || isCreating}
          onClick={() => setShowNewTournamentDialog(true)}
        >
          {isCreating ? "Creating..." : "New Tournament"}
        </Button>

        <Dialog open={showNewTournamentDialog} onOpenChange={setShowNewTournamentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Tournament</DialogTitle>
              <DialogDescription>
                This will randomly select 16 movies from your watchlist for a bracket-style
                tournament. Ready to begin?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={isCreating}
                variant="outline"
                onClick={() => setShowNewTournamentDialog(false)}
              >
                Cancel
              </Button>
              <Button disabled={isCreating} onClick={handleCreateTournament}>
                {isCreating ? "Creating..." : "Start Tournament"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Finished tournament state
  if (state.tournament.status === "finished" && state.winnerMovie !== null) {
    return (
      <div className="space-y-6">
        {/* Winner banner */}
        <div className="rounded-lg border-2 border-amber-500 bg-amber-500/10 p-6 text-center">
          <Trophy className="mx-auto mb-2 h-12 w-12 text-amber-500" weight="fill" />
          <h2 className="text-2xl font-bold">{state.winnerMovie.title} wins!</h2>
          <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
            <Button disabled={isEnding} onClick={() => handleEndTournament(true)}>
              {isEnding ? "Saving..." : "We watched it!"}
            </Button>
            <Button
              disabled={isEnding}
              variant="outline"
              onClick={() => handleEndTournament(false)}
            >
              Not yet
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            If you watched it, the movie will be moved to your Watched list.
          </p>
        </div>

        {/* Full bracket */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Final Bracket</h3>
          <Bracket matches={state.matches} />
        </div>
      </div>
    );
  }

  // Active tournament state
  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild className="bg-amber-500 hover:bg-amber-600">
          <Link href="/tournament/match">Play next match</Link>
        </Button>

        <button
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          type="button"
          onClick={() => setShowAbandonDialog(true)}
        >
          Abandon tournament
        </button>
      </div>

      {/* Bracket */}
      <Bracket matches={state.matches} nextMatchId={nextMatch?.id} />

      {/* Abandon dialog */}
      <Dialog open={showAbandonDialog} onOpenChange={setShowAbandonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abandon Tournament</DialogTitle>
            <DialogDescription>
              This will end the current tournament and start a new one. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isCreating}
              variant="outline"
              onClick={() => setShowAbandonDialog(false)}
            >
              Cancel
            </Button>
            <Button disabled={isCreating} variant="destructive" onClick={handleAbandonTournament}>
              {isCreating ? "Creating..." : "Abandon & Start New"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
