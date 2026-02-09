import { Trophy } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTMDBImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

export interface MovieData {
  id: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  genres: string | null;
  director: string | null;
  cast: string | null;
  overview: string | null;
}

interface MovieCardProps {
  movie: MovieData;
  variant: "list" | "matchup" | "winner";
  onClick?: () => void;
  actions?: ReactNode;
}

export function MovieCard({ movie, variant, onClick, actions }: MovieCardProps) {
  const posterUrl = getTMDBImageUrl(movie.posterPath);
  const genreList = movie.genres?.split(", ").filter(Boolean) ?? [];

  if (variant === "list") {
    return (
      <Card
        className={cn(
          "overflow-hidden transition-shadow hover:shadow-md",
          onClick !== undefined && "cursor-pointer",
        )}
        onClick={onClick}
      >
        <CardContent className="flex gap-4 p-3">
          {/* Poster thumbnail */}
          <div className="relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-md bg-muted">
            {posterUrl !== null ? (
              <Image alt={movie.title} className="object-cover" fill sizes="80px" src={posterUrl} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <span className="text-xs">No poster</span>
              </div>
            )}
          </div>

          {/* Movie info */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <h3 className="truncate text-base font-semibold">{movie.title}</h3>
              <p className="text-sm text-muted-foreground">
                {movie.year ?? "Unknown year"}
                {movie.director !== null && ` • ${movie.director}`}
              </p>
              {genreList.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {genreList.slice(0, 2).map((genre) => (
                    <Badge key={genre} className="text-xs" variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {actions !== undefined && <div className="mt-2">{actions}</div>}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "matchup") {
    return (
      <Card
        className={cn(
          "overflow-hidden transition-shadow hover:shadow-md",
          onClick !== undefined && "cursor-pointer",
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          {/* Large poster */}
          <div className="relative mx-auto mb-4 aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg bg-muted">
            {posterUrl !== null ? (
              <Image
                alt={movie.title}
                className="object-cover"
                fill
                sizes="200px"
                src={posterUrl}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No poster
              </div>
            )}
          </div>

          {/* Movie details */}
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-bold">{movie.title}</h3>
            <p className="text-sm text-muted-foreground">
              {movie.year ?? "Unknown year"}
              {movie.director !== null && ` • Directed by ${movie.director}`}
            </p>
            {movie.cast !== null && movie.cast.length > 0 && (
              <p className="text-sm text-muted-foreground">Starring: {movie.cast}</p>
            )}
            {genreList.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1">
                {genreList.map((genre) => (
                  <Badge key={genre} className="text-xs" variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
            {movie.overview !== null && movie.overview.length > 0 && (
              <p className="line-clamp-3 text-sm text-muted-foreground">{movie.overview}</p>
            )}
          </div>

          {actions !== undefined && <div className="mt-4">{actions}</div>}
        </CardContent>
      </Card>
    );
  }

  // Winner variant
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-2 border-amber-500 shadow-lg shadow-amber-500/20",
        onClick !== undefined && "cursor-pointer",
      )}
      onClick={onClick}
    >
      {/* Trophy badge */}
      <div className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
        <Trophy className="h-6 w-6" weight="fill" />
      </div>

      <CardContent className="p-4">
        {/* Large poster with glow effect */}
        <div className="relative mx-auto mb-4 aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg bg-muted ring-4 ring-amber-500/30">
          {posterUrl !== null ? (
            <Image alt={movie.title} className="object-cover" fill sizes="200px" src={posterUrl} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No poster
            </div>
          )}
        </div>

        {/* Movie details */}
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">
            {movie.year ?? "Unknown year"}
            {movie.director !== null && ` • Directed by ${movie.director}`}
          </p>
          {movie.cast !== null && movie.cast.length > 0 && (
            <p className="text-sm text-muted-foreground">Starring: {movie.cast}</p>
          )}
          {genreList.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {genreList.map((genre) => (
                <Badge key={genre} className="text-xs" variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {actions !== undefined && <div className="mt-4">{actions}</div>}
      </CardContent>
    </Card>
  );
}
