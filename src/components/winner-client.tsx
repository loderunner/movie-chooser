"use client";

import { Trophy } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { MovieCard, type MovieData } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { endTournament } from "@/lib/actions";
import type { Movie } from "@/lib/db";

interface WinnerClientProps {
  winnerMovie: Movie;
}

export function WinnerClient({ winnerMovie }: WinnerClientProps) {
  const router = useRouter();
  const [isEnding, setIsEnding] = useState(false);

  const movieData: MovieData = {
    id: winnerMovie.id,
    title: winnerMovie.title,
    year: winnerMovie.year,
    posterPath: winnerMovie.posterPath,
    genres: winnerMovie.genres,
    director: winnerMovie.director,
    cast: winnerMovie.cast,
    overview: winnerMovie.overview,
  };

  async function handleEnd(watched: boolean) {
    setIsEnding(true);
    try {
      const result = await endTournament(watched);
      if (result.error !== undefined) {
        toast.error(result.error);
        setIsEnding(false);
        return;
      }

      if (watched) {
        toast.success(`"${winnerMovie.title}" has been moved to your Watched list!`);
      } else {
        toast.success("Tournament ended. Movie stays on your watchlist.");
      }
      router.push("/movies");
    } catch {
      toast.error("Failed to end tournament");
      setIsEnding(false);
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      {/* Celebration header */}
      <div className="mb-8 animate-bounce">
        <Trophy className="h-20 w-20 text-amber-500" weight="fill" />
      </div>

      <h1 className="mb-2 text-3xl font-bold">The Winner Is...</h1>
      <p className="mb-8 text-lg text-muted-foreground">Tonight&apos;s movie has been decided!</p>

      {/* Winner card */}
      <div className="mb-8 w-full max-w-sm">
        <MovieCard movie={movieData} variant="winner" />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="bg-amber-500 hover:bg-amber-600"
          disabled={isEnding}
          onClick={() => handleEnd(true)}
        >
          We watched it! 🎬
        </Button>
        <Button disabled={isEnding} variant="outline" onClick={() => handleEnd(false)}>
          Not yet
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        If you watched it, the movie will be moved to your Watched list.
      </p>
    </div>
  );
}
