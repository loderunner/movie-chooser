"use server";

import { and, count, desc, eq, inArray, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type Movie, db, matches, movies, tournaments } from "@/lib/db";
import { getMovieDetails } from "@/lib/tmdb";

export async function addMovie(tmdbId: number): Promise<{ error?: string }> {
  // Check for duplicate
  const existing = await db.select().from(movies).where(eq(movies.tmdbId, tmdbId)).limit(1);

  if (existing.length > 0) {
    return { error: "This movie is already in your watchlist" };
  }

  // Get movie details from TMDB
  const details = await getMovieDetails(tmdbId);

  if (details === null) {
    return { error: "Movie not found" };
  }

  // Insert into database
  await db.insert(movies).values({
    tmdbId: details.tmdbId,
    title: details.title,
    year: details.year,
    overview: details.overview,
    posterPath: details.posterPath,
    backdropPath: details.backdropPath,
    genres: details.genres,
    director: details.director,
    cast: details.cast,
  });

  revalidatePath("/movies");
  redirect("/movies");
}

interface GetMoviesParams {
  cursor?: number;
  archived?: boolean;
  limit?: number;
}

interface GetMoviesResult {
  movies: Movie[];
  nextCursor: number | null;
}

export async function getMovies(params: GetMoviesParams = {}): Promise<GetMoviesResult> {
  const { cursor, archived = false, limit = 20 } = params;

  const conditions = [eq(movies.archived, archived)];

  if (cursor !== undefined) {
    conditions.push(lt(movies.id, cursor));
  }

  const result = await db
    .select()
    .from(movies)
    .where(and(...conditions))
    .orderBy(desc(movies.id))
    .limit(limit + 1);

  const hasMore = result.length > limit;
  const movieList = hasMore ? result.slice(0, limit) : result;
  const nextCursor = hasMore && movieList.length > 0 ? movieList[movieList.length - 1].id : null;

  return {
    movies: movieList,
    nextCursor,
  };
}

export async function getMovieCount(archived: boolean = false): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(movies)
    .where(eq(movies.archived, archived));

  return result[0]?.count ?? 0;
}

export async function deleteMovie(movieId: number): Promise<{ error?: string }> {
  // Check if movie is in an active tournament
  const activeTournament = await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.status, "active"))
    .limit(1);

  if (activeTournament.length > 0) {
    // Check if this movie is in the active tournament
    const movieInTournament = await db
      .select()
      .from(matches)
      .where(
        and(eq(matches.tournamentId, activeTournament[0].id), inArray(matches.movie1Id, [movieId])),
      )
      .limit(1);

    const movieInTournament2 = await db
      .select()
      .from(matches)
      .where(
        and(eq(matches.tournamentId, activeTournament[0].id), inArray(matches.movie2Id, [movieId])),
      )
      .limit(1);

    if (movieInTournament.length > 0 || movieInTournament2.length > 0) {
      return { error: "Cannot delete a movie that is in an active tournament" };
    }
  }

  await db.delete(movies).where(eq(movies.id, movieId));
  revalidatePath("/movies");

  return {};
}
