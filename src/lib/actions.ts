"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db, movies } from "@/lib/db";
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
