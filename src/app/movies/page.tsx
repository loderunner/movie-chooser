import { FilmStrip, Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { MovieListClient } from "@/components/movie-list-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMovieCount, getMovies } from "@/lib/actions";

interface MoviesPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const archived = params.tab === "watched";

  const [{ movies, nextCursor }, totalCount, watchedCount] = await Promise.all([
    getMovies({ archived }),
    getMovieCount(false),
    getMovieCount(true),
  ]);

  const currentCount = archived ? watchedCount : totalCount;
  const canStartTournament = totalCount >= 16;
  const moviesNeeded = 16 - totalCount;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">My Movies</h1>
          <Badge variant="secondary">{currentCount}</Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Watchlist/Watched toggle */}
          <div className="flex rounded-lg border bg-muted p-1">
            <Link
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                !archived
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              href="/movies"
            >
              Watchlist
            </Link>
            <Link
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                archived ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              href="/movies?tab=watched"
            >
              Watched
            </Link>
          </div>

          {/* New tournament button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    asChild={canStartTournament}
                    disabled={!canStartTournament}
                    variant="default"
                  >
                    {canStartTournament ? (
                      <Link href="/tournament">New Tournament</Link>
                    ) : (
                      "New Tournament"
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {!canStartTournament && (
                <TooltipContent>
                  <p>Add {moviesNeeded} more movies to start a tournament</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Movie list or empty state */}
      {movies.length > 0 ? (
        <MovieListClient archived={archived} initialCursor={nextCursor} initialMovies={movies} />
      ) : (
        <EmptyState archived={archived} moviesNeeded={moviesNeeded} totalCount={totalCount} />
      )}
    </div>
  );
}

interface EmptyStateProps {
  archived: boolean;
  totalCount: number;
  moviesNeeded: number;
}

function EmptyState({ archived, totalCount, moviesNeeded }: EmptyStateProps) {
  if (archived) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FilmStrip className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">No watched movies yet</h2>
        <p className="text-muted-foreground">
          Movies will appear here after you watch tournament winners.
        </p>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FilmStrip className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">No movies yet</h2>
        <p className="mb-6 text-muted-foreground">Add movies to your watchlist to get started.</p>
        <Button asChild>
          <Link href="/movies/add">
            <Plus className="mr-2 h-4 w-4" />
            Add your first movie
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FilmStrip className="mb-4 h-16 w-16 text-muted-foreground" />
      <h2 className="mb-2 text-xl font-semibold">Almost there!</h2>
      <p className="mb-6 text-muted-foreground">
        Add {moviesNeeded} more movie{moviesNeeded !== 1 ? "s" : ""} to start a tournament.
      </p>
      <Button asChild>
        <Link href="/movies/add">
          <Plus className="mr-2 h-4 w-4" />
          Add movies
        </Link>
      </Button>
    </div>
  );
}
