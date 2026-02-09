"use server";

import { and, asc, count, desc, eq, inArray, isNull, lt, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type Movie, type Tournament, db, matches, movies, tournaments } from "@/lib/db";
import { getMovieDetails } from "@/lib/tmdb";
import type { MatchWithMovies } from "@/types";

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

// Tournament Engine

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function createTournament(): Promise<{ error?: string }> {
  // Check for 16+ non-archived movies
  const movieList = await db.select().from(movies).where(eq(movies.archived, false));

  if (movieList.length < 16) {
    return { error: `Need at least 16 movies. Currently have ${movieList.length}.` };
  }

  // End any existing active or finished tournament
  await db
    .update(tournaments)
    .set({ status: "ended", endedAt: new Date() })
    .where(or(eq(tournaments.status, "active"), eq(tournaments.status, "finished")));

  // Pick 16 random movies
  const selectedMovies = shuffleArray(movieList).slice(0, 16);

  // Create tournament
  const tournamentResult = await db
    .insert(tournaments)
    .values({ status: "active" })
    .returning({ id: tournaments.id });

  const tournament = tournamentResult[0];

  // Create all 15 matches
  // Round 1: 8 matches (positions 0-7), seeded with movies
  // Round 2: 4 matches (positions 0-3)
  // Round 3: 2 matches (positions 0-1)
  // Round 4: 1 match (position 0)

  const matchesToCreate: Array<{
    tournamentId: number;
    round: number;
    position: number;
    movie1Id: number | null;
    movie2Id: number | null;
  }> = [];

  // Round 1: Seed with movies
  for (let i = 0; i < 8; i++) {
    matchesToCreate.push({
      tournamentId: tournament.id,
      round: 1,
      position: i,
      movie1Id: selectedMovies[i * 2].id,
      movie2Id: selectedMovies[i * 2 + 1].id,
    });
  }

  // Rounds 2-4: Empty matches
  for (let round = 2; round <= 4; round++) {
    const matchCount = Math.pow(2, 4 - round);
    for (let position = 0; position < matchCount; position++) {
      matchesToCreate.push({
        tournamentId: tournament.id,
        round,
        position,
        movie1Id: null,
        movie2Id: null,
      });
    }
  }

  await db.insert(matches).values(matchesToCreate);

  revalidatePath("/tournament");
  revalidatePath("/movies");

  return {};
}

export async function pickWinner(
  matchId: number,
  winnerId: number,
): Promise<{ tournamentFinished: boolean; error?: string }> {
  // Get match
  const matchResult = await db.select().from(matches).where(eq(matches.id, matchId));
  const match = matchResult.at(0);

  if (match === undefined) {
    return { tournamentFinished: false, error: "Match not found" };
  }

  // Validate match belongs to active tournament
  const tournamentResult = await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.id, match.tournamentId));
  const tournament = tournamentResult.at(0);

  if (tournament === undefined || tournament.status !== "active") {
    return { tournamentFinished: false, error: "No active tournament" };
  }

  // Validate match not already played
  if (match.winnerId !== null) {
    return { tournamentFinished: false, error: "Match already played" };
  }

  // Validate winnerId is valid
  if (winnerId !== match.movie1Id && winnerId !== match.movie2Id) {
    return { tournamentFinished: false, error: "Invalid winner" };
  }

  // Update match with winner
  await db.update(matches).set({ winnerId, playedAt: new Date() }).where(eq(matches.id, matchId));

  // Check if this is the final
  if (match.round === 4) {
    // Tournament finished - set winner
    await db
      .update(tournaments)
      .set({ winnerMovieId: winnerId, status: "finished" })
      .where(eq(tournaments.id, match.tournamentId));

    revalidatePath("/tournament");
    return { tournamentFinished: true };
  }

  // Advance winner to next round
  const nextRound = match.round + 1;
  const nextPosition = Math.floor(match.position / 2);
  const isEvenPosition = match.position % 2 === 0;

  // Find the next match
  const nextMatchResult = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.tournamentId, match.tournamentId),
        eq(matches.round, nextRound),
        eq(matches.position, nextPosition),
      ),
    );
  const nextMatch = nextMatchResult.at(0);

  if (nextMatch !== undefined) {
    // Update the appropriate slot
    if (isEvenPosition) {
      await db.update(matches).set({ movie1Id: winnerId }).where(eq(matches.id, nextMatch.id));
    } else {
      await db.update(matches).set({ movie2Id: winnerId }).where(eq(matches.id, nextMatch.id));
    }
  }

  revalidatePath("/tournament");
  return { tournamentFinished: false };
}

export async function getNextMatch(tournamentId: number): Promise<MatchWithMovies | null> {
  // Find first unplayed match where both movies are set
  const result = await db
    .select()
    .from(matches)
    .where(and(eq(matches.tournamentId, tournamentId), isNull(matches.winnerId)))
    .orderBy(asc(matches.round), asc(matches.position));

  // Find first match where both movies are set
  for (const match of result) {
    if (match.movie1Id !== null && match.movie2Id !== null) {
      // Get movie data
      const movie1Result = await db.select().from(movies).where(eq(movies.id, match.movie1Id));
      const movie2Result = await db.select().from(movies).where(eq(movies.id, match.movie2Id));
      const movie1 = movie1Result.at(0);
      const movie2 = movie2Result.at(0);

      return {
        id: match.id,
        tournamentId: match.tournamentId,
        round: match.round,
        position: match.position,
        movie1Id: match.movie1Id,
        movie2Id: match.movie2Id,
        winnerId: match.winnerId,
        playedAt: match.playedAt,
        movie1:
          movie1 !== undefined
            ? {
                id: movie1.id,
                title: movie1.title,
                year: movie1.year,
                posterPath: movie1.posterPath,
                genres: movie1.genres,
                director: movie1.director,
                cast: movie1.cast,
                overview: movie1.overview,
              }
            : null,
        movie2:
          movie2 !== undefined
            ? {
                id: movie2.id,
                title: movie2.title,
                year: movie2.year,
                posterPath: movie2.posterPath,
                genres: movie2.genres,
                director: movie2.director,
                cast: movie2.cast,
                overview: movie2.overview,
              }
            : null,
      };
    }
  }

  return null;
}

export interface TournamentState {
  tournament: Tournament | null;
  matches: MatchWithMovies[];
  winnerMovie: Movie | null;
}

export async function getTournamentState(): Promise<TournamentState> {
  // Get active or finished tournament
  const tournamentResult = await db
    .select()
    .from(tournaments)
    .where(or(eq(tournaments.status, "active"), eq(tournaments.status, "finished")))
    .orderBy(desc(tournaments.createdAt))
    .limit(1);
  const tournament = tournamentResult.at(0);

  if (tournament === undefined) {
    return { tournament: null, matches: [], winnerMovie: null };
  }

  // Get all matches for this tournament
  const matchList = await db
    .select()
    .from(matches)
    .where(eq(matches.tournamentId, tournament.id))
    .orderBy(asc(matches.round), asc(matches.position));

  // Get all movie IDs
  const movieIds = new Set<number>();
  for (const match of matchList) {
    if (match.movie1Id !== null) {
      movieIds.add(match.movie1Id);
    }
    if (match.movie2Id !== null) {
      movieIds.add(match.movie2Id);
    }
  }

  // Fetch all movies
  const movieData =
    movieIds.size > 0
      ? await db
          .select()
          .from(movies)
          .where(inArray(movies.id, Array.from(movieIds)))
      : [];

  const movieMap = new Map(movieData.map((m) => [m.id, m]));

  // Build matches with movie data
  const matchesWithMovies: MatchWithMovies[] = matchList.map((match) => {
    const movie1 = match.movie1Id !== null ? movieMap.get(match.movie1Id) : undefined;
    const movie2 = match.movie2Id !== null ? movieMap.get(match.movie2Id) : undefined;

    return {
      id: match.id,
      tournamentId: match.tournamentId,
      round: match.round,
      position: match.position,
      movie1Id: match.movie1Id,
      movie2Id: match.movie2Id,
      winnerId: match.winnerId,
      playedAt: match.playedAt,
      movie1:
        movie1 !== undefined
          ? {
              id: movie1.id,
              title: movie1.title,
              year: movie1.year,
              posterPath: movie1.posterPath,
              genres: movie1.genres,
              director: movie1.director,
              cast: movie1.cast,
              overview: movie1.overview,
            }
          : null,
      movie2:
        movie2 !== undefined
          ? {
              id: movie2.id,
              title: movie2.title,
              year: movie2.year,
              posterPath: movie2.posterPath,
              genres: movie2.genres,
              director: movie2.director,
              cast: movie2.cast,
              overview: movie2.overview,
            }
          : null,
    };
  });

  // Get winner movie if tournament is finished
  let winnerMovie: Movie | null = null;
  if (tournament.status === "finished" && tournament.winnerMovieId !== null) {
    const winnerResult = await db
      .select()
      .from(movies)
      .where(eq(movies.id, tournament.winnerMovieId));
    winnerMovie = winnerResult.at(0) ?? null;
  }

  return {
    tournament,
    matches: matchesWithMovies,
    winnerMovie,
  };
}

export async function endTournament(watched: boolean): Promise<{ error?: string }> {
  // Get finished tournament
  const tournamentResult = await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.status, "finished"))
    .limit(1);
  const tournament = tournamentResult.at(0);

  if (tournament === undefined) {
    return { error: "No finished tournament" };
  }

  if (tournament.winnerMovieId === null) {
    return { error: "Tournament has no winner" };
  }

  // If watched, archive the winning movie
  if (watched) {
    await db.update(movies).set({ archived: true }).where(eq(movies.id, tournament.winnerMovieId));
  }

  // End the tournament
  await db
    .update(tournaments)
    .set({ status: "ended", endedAt: new Date() })
    .where(eq(tournaments.id, tournament.id));

  revalidatePath("/tournament");
  revalidatePath("/movies");

  return {};
}

export async function hasFinishedTournament(): Promise<boolean> {
  const result = await db
    .select({ count: count() })
    .from(tournaments)
    .where(eq(tournaments.status, "finished"));

  return (result[0]?.count ?? 0) > 0;
}
