"use client";

import { ArrowLeft, Lightning } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { MovieCard, type MovieData } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pickWinner } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { MatchWithMovies } from "@/types";

interface MatchupClientProps {
  match: MatchWithMovies;
}

function getRoundLabel(round: number, position: number, totalInRound: number): string {
  switch (round) {
    case 1:
      return `Round of 16 — Match ${position + 1} of ${totalInRound}`;
    case 2:
      return `Quarterfinal — Match ${position + 1} of ${totalInRound}`;
    case 3:
      return `Semifinal — Match ${position + 1} of ${totalInRound}`;
    case 4:
      return "🏆 The Final";
    default:
      return `Round ${round}`;
  }
}

function getMatchCount(round: number): number {
  return Math.pow(2, 4 - round);
}

export function MatchupClient({ match }: MatchupClientProps) {
  const router = useRouter();
  const [selectedWinner, setSelectedWinner] = useState<MovieData | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState<number | null>(null);

  const movie1: MovieData | null =
    match.movie1 !== null
      ? {
          id: match.movie1.id,
          title: match.movie1.title,
          year: match.movie1.year,
          posterPath: match.movie1.posterPath,
          genres: match.movie1.genres,
          director: match.movie1.director,
          cast: match.movie1.cast,
          overview: match.movie1.overview,
        }
      : null;

  const movie2: MovieData | null =
    match.movie2 !== null
      ? {
          id: match.movie2.id,
          title: match.movie2.title,
          year: match.movie2.year,
          posterPath: match.movie2.posterPath,
          genres: match.movie2.genres,
          director: match.movie2.director,
          cast: match.movie2.cast,
          overview: match.movie2.overview,
        }
      : null;

  async function handleConfirmPick() {
    if (selectedWinner === null) {
      return;
    }

    setIsPicking(true);
    setShowWinAnimation(selectedWinner.id);

    try {
      const result = await pickWinner(match.id, selectedWinner.id);

      if (result.error !== undefined) {
        toast.error(result.error);
        setShowWinAnimation(null);
        setSelectedWinner(null);
        setIsPicking(false);
        return;
      }

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (result.tournamentFinished) {
        router.push("/tournament/winner");
      } else {
        router.refresh();
        // Reset state for next match
        setShowWinAnimation(null);
        setSelectedWinner(null);
        setIsPicking(false);
      }
    } catch {
      toast.error("Failed to pick winner");
      setShowWinAnimation(null);
      setSelectedWinner(null);
      setIsPicking(false);
    }
  }

  const roundLabel = getRoundLabel(match.round, match.position, getMatchCount(match.round));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-accent"
          href="/tournament"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">{roundLabel}</h1>
      </div>

      {/* Matchup */}
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
        {/* Movie 1 */}
        {movie1 !== null && (
          <div
            className={cn(
              "flex-1 transition-all duration-500",
              showWinAnimation !== null && showWinAnimation !== movie1.id && "scale-95 opacity-30",
              showWinAnimation === movie1.id &&
                "ring-4 ring-amber-500 shadow-lg shadow-amber-500/30",
            )}
          >
            <MovieCard
              actions={
                <Button
                  className="w-full"
                  disabled={isPicking}
                  onClick={() => setSelectedWinner(movie1)}
                >
                  Pick this one
                </Button>
              }
              movie={movie1}
              variant="matchup"
            />
          </div>
        )}

        {/* VS Divider */}
        <div className="flex items-center justify-center py-2 md:py-0">
          <div className="flex items-center gap-1 text-2xl font-bold text-amber-500">
            <Lightning weight="fill" />
            <span>VS</span>
            <Lightning weight="fill" />
          </div>
        </div>

        {/* Movie 2 */}
        {movie2 !== null && (
          <div
            className={cn(
              "flex-1 transition-all duration-500",
              showWinAnimation !== null && showWinAnimation !== movie2.id && "scale-95 opacity-30",
              showWinAnimation === movie2.id &&
                "ring-4 ring-amber-500 shadow-lg shadow-amber-500/30",
            )}
          >
            <MovieCard
              actions={
                <Button
                  className="w-full"
                  disabled={isPicking}
                  onClick={() => setSelectedWinner(movie2)}
                >
                  Pick this one
                </Button>
              }
              movie={movie2}
              variant="matchup"
            />
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      <Dialog
        open={selectedWinner !== null && showWinAnimation === null}
        onOpenChange={(open) => {
          if (!open && !isPicking) {
            setSelectedWinner(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Advance <strong>{selectedWinner?.title}</strong> to the next round? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isPicking} variant="outline" onClick={() => setSelectedWinner(null)}>
              Cancel
            </Button>
            <Button disabled={isPicking} onClick={handleConfirmPick}>
              {isPicking ? "Picking..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
