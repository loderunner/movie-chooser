"use client";

import { Trash } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { deleteMovie, getMovies } from "@/lib/actions";
import type { Movie } from "@/lib/db";

interface MovieListClientProps {
  initialMovies: Movie[];
  initialCursor: number | null;
  archived: boolean;
}

export function MovieListClient({ initialMovies, initialCursor, archived }: MovieListClientProps) {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
  const [cursor, setCursor] = useState<number | null>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset when archived changes
  useEffect(() => {
    setMovieList(initialMovies);
    setCursor(initialCursor);
  }, [initialMovies, initialCursor, archived]);

  const loadMore = useCallback(async () => {
    if (isLoading || cursor === null) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await getMovies({ cursor, archived });
      setMovieList((prev) => [...prev, ...result.movies]);
      setCursor(result.nextCursor);
    } catch {
      toast.error("Failed to load more movies");
    } finally {
      setIsLoading(false);
    }
  }, [cursor, archived, isLoading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor !== null) {
          void loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current !== null) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [cursor, loadMore]);

  async function handleDelete() {
    if (movieToDelete === null) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteMovie(movieToDelete.id);
      if (result.error !== undefined) {
        toast.error(result.error);
      } else {
        toast.success(`"${movieToDelete.title}" removed from your list`);
        setMovieList((prev) => prev.filter((m) => m.id !== movieToDelete.id));
      }
    } catch {
      toast.error("Failed to delete movie");
    } finally {
      setIsDeleting(false);
      setMovieToDelete(null);
    }
  }

  function toMovieData(movie: Movie): MovieData {
    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      posterPath: movie.posterPath,
      genres: movie.genres,
      director: movie.director,
      cast: movie.cast,
      overview: movie.overview,
    };
  }

  return (
    <>
      <div className="space-y-3">
        {movieList.map((movie) => (
          <MovieCard
            key={movie.id}
            actions={
              <Button
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setMovieToDelete(movie);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            }
            movie={toMovieData(movie)}
            variant="list"
          />
        ))}

        {/* Infinite scroll trigger */}
        <div ref={observerRef} className="h-4" />

        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={movieToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setMovieToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Movie</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{movieToDelete?.title}&quot; from your list?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isDeleting} variant="outline" onClick={() => setMovieToDelete(null)}>
              Cancel
            </Button>
            <Button disabled={isDeleting} variant="destructive" onClick={handleDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
