"use client";

import Image from "next/image";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getTMDBImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import type { MatchWithMovies } from "@/types";

interface BracketProps {
  matches: MatchWithMovies[];
  nextMatchId?: number;
}

export function Bracket({ matches, nextMatchId }: BracketProps) {
  // Group matches by round
  const rounds = [
    matches.filter((m) => m.round === 1),
    matches.filter((m) => m.round === 2),
    matches.filter((m) => m.round === 3),
    matches.filter((m) => m.round === 4),
  ];

  const roundNames = ["Round of 16", "Quarterfinals", "Semifinals", "Final"];

  return (
    <div className="relative">
      <p className="mb-4 text-sm text-muted-foreground md:hidden">
        Scroll horizontally to view the full bracket
      </p>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[800px] gap-4">
          {rounds.map((roundMatches, roundIndex) => (
            <div key={roundIndex} className="flex flex-1 flex-col">
              <h3 className="mb-4 text-center text-sm font-semibold text-muted-foreground">
                {roundNames[roundIndex]}
              </h3>
              <div
                className="flex flex-1 flex-col justify-around gap-4"
                style={{
                  paddingTop: roundIndex > 0 ? `${Math.pow(2, roundIndex - 1) * 30}px` : 0,
                  paddingBottom: roundIndex > 0 ? `${Math.pow(2, roundIndex - 1) * 30}px` : 0,
                }}
              >
                {roundMatches.map((match) => (
                  <MatchNode key={match.id} isNext={match.id === nextMatchId} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MatchNodeProps {
  match: MatchWithMovies;
  isNext: boolean;
}

function MatchNode({ match, isNext }: MatchNodeProps) {
  const isPlayed = match.winnerId !== null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-2 shadow-sm transition-all",
        isNext && "ring-2 ring-amber-500 ring-offset-2",
        isNext && "animate-pulse",
        !isPlayed && !isNext && "opacity-60",
      )}
    >
      <MovieSlot
        isWinner={match.winnerId === match.movie1Id}
        movie={match.movie1}
        showWinnerHighlight={isPlayed}
      />
      <div className="my-1 border-t border-border" />
      <MovieSlot
        isWinner={match.winnerId === match.movie2Id}
        movie={match.movie2}
        showWinnerHighlight={isPlayed}
      />
    </div>
  );
}

interface MovieSlotProps {
  movie: MatchWithMovies["movie1"];
  isWinner: boolean;
  showWinnerHighlight: boolean;
}

function MovieSlot({ movie, isWinner, showWinnerHighlight }: MovieSlotProps) {
  if (movie === null) {
    return (
      <div className="flex h-10 items-center gap-2 px-1 text-muted-foreground">
        <div className="h-8 w-6 rounded bg-muted" />
        <span className="text-xs">TBD</span>
      </div>
    );
  }

  const posterUrl = getTMDBImageUrl(movie.posterPath);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex h-10 items-center gap-2 rounded px-1 transition-colors",
              showWinnerHighlight && isWinner && "bg-amber-500/20 text-amber-700",
              showWinnerHighlight && !isWinner && "opacity-50",
            )}
          >
            <div className="relative h-8 w-6 shrink-0 overflow-hidden rounded bg-muted">
              {posterUrl !== null ? (
                <Image
                  alt={movie.title}
                  className="object-cover"
                  fill
                  sizes="24px"
                  src={posterUrl}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[8px] text-muted-foreground">
                  ?
                </div>
              )}
            </div>
            <span className="truncate text-xs font-medium">{movie.title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{movie.title}</p>
          {movie.year !== null && <p className="text-xs text-muted-foreground">{movie.year}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
