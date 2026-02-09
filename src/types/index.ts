// TMDB API types
export interface TMDBSearchResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
}

export interface TMDBMovieDetails {
  tmdbId: number;
  title: string;
  year: number | null;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  genres: string; // comma-separated
  director: string | null;
  cast: string; // comma-separated (top 4)
}

// Match with movie data for UI
export interface MatchWithMovies {
  id: number;
  tournamentId: number;
  round: number;
  position: number;
  movie1Id: number | null;
  movie2Id: number | null;
  winnerId: number | null;
  playedAt: Date | null;
  movie1: {
    id: number;
    title: string;
    year: number | null;
    posterPath: string | null;
    genres: string | null;
    director: string | null;
    cast: string | null;
    overview: string | null;
  } | null;
  movie2: {
    id: number;
    title: string;
    year: number | null;
    posterPath: string | null;
    genres: string | null;
    director: string | null;
    cast: string | null;
    overview: string | null;
  } | null;
}
