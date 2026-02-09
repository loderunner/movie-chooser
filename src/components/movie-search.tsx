"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addMovie } from "@/lib/actions";
import { getTMDBImageUrl } from "@/lib/tmdb";
import type { TMDBSearchResult } from "@/types";

interface MoviePreview {
  id: number;
  title: string;
  year: string;
  posterPath: string | null;
  overview: string;
}

export function MovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MoviePreview | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const searchMovies = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tmdb/search?q=${encodeURIComponent(searchQuery)}`);
      const data = (await response.json()) as TMDBSearchResult[];
      setResults(data);
      setIsOpen(data.length > 0);
    } catch {
      toast.error("Failed to search movies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      void searchMovies(query);
    }, 300);

    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchMovies]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current !== null && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSelect(movie: TMDBSearchResult) {
    const year = movie.release_date.length >= 4 ? movie.release_date.substring(0, 4) : "Unknown";
    setSelectedMovie({
      id: movie.id,
      title: movie.title,
      year,
      posterPath: movie.poster_path,
      overview: movie.overview,
    });
    setIsOpen(false);
    setQuery("");
  }

  async function handleAddMovie() {
    if (selectedMovie === null) {
      return;
    }

    setIsAdding(true);
    try {
      const result = await addMovie(selectedMovie.id);
      if (result.error !== undefined) {
        toast.error(result.error);
        setIsAdding(false);
      }
      // Redirect happens in server action on success
    } catch {
      toast.error("Failed to add movie");
      setIsAdding(false);
    }
  }

  function clearSelection() {
    setSelectedMovie(null);
  }

  const posterUrl = selectedMovie !== null ? getTMDBImageUrl(selectedMovie.posterPath) : null;

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            className="pl-10"
            placeholder="Search for a movie..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>

        {/* Dropdown results */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-lg border bg-popover shadow-lg">
            {results.map((movie) => {
              const moviePosterUrl = getTMDBImageUrl(movie.poster_path);
              const year =
                movie.release_date.length >= 4 ? movie.release_date.substring(0, 4) : "Unknown";

              return (
                <button
                  key={movie.id}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent"
                  type="button"
                  onClick={() => handleSelect(movie)}
                >
                  <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded bg-muted">
                    {moviePosterUrl !== null ? (
                      <Image
                        alt={movie.title}
                        className="object-cover"
                        fill
                        sizes="44px"
                        src={moviePosterUrl}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{movie.title}</p>
                    <p className="text-sm text-muted-foreground">{year}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview card */}
      {selectedMovie !== null && (
        <Card className="relative overflow-hidden">
          <button
            className="absolute right-3 top-3 z-10 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            type="button"
            onClick={clearSelection}
          >
            <X className="h-5 w-5" />
          </button>

          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Poster */}
              <div className="relative mx-auto aspect-[2/3] w-[150px] shrink-0 overflow-hidden rounded-lg bg-muted sm:mx-0">
                {posterUrl !== null ? (
                  <Image
                    alt={selectedMovie.title}
                    className="object-cover"
                    fill
                    sizes="150px"
                    src={posterUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    No poster
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col">
                <h2 className="text-xl font-bold">{selectedMovie.title}</h2>
                <p className="text-muted-foreground">{selectedMovie.year}</p>
                {selectedMovie.overview.length > 0 && (
                  <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                    {selectedMovie.overview}
                  </p>
                )}

                <div className="mt-4 flex-1" />

                <Button
                  className="mt-4 w-full sm:w-auto"
                  disabled={isAdding}
                  onClick={handleAddMovie}
                >
                  {isAdding ? "Adding..." : "Add to watchlist"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
