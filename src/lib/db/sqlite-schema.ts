import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// Movies table
export const movies = sqliteTable(
  "movies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tmdbId: integer("tmdb_id").notNull(),
    title: text("title").notNull(),
    year: integer("year"),
    overview: text("overview"),
    posterPath: text("poster_path"),
    backdropPath: text("backdrop_path"),
    genres: text("genres"), // comma-separated
    director: text("director"),
    cast: text("cast"), // comma-separated
    archived: integer("archived", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("movies_tmdb_id_idx").on(table.tmdbId),
    index("movies_archived_idx").on(table.archived),
  ],
);

// Tournaments table
export const tournaments = sqliteTable(
  "tournaments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    status: text("status", { enum: ["active", "finished", "ended"] })
      .default("active")
      .notNull(),
    winnerMovieId: integer("winner_movie_id").references(() => movies.id),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    endedAt: integer("ended_at", { mode: "timestamp" }),
  },
  (table) => [index("tournaments_status_idx").on(table.status)],
);

// Matches table
export const matches = sqliteTable(
  "matches",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tournamentId: integer("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    round: integer("round").notNull(), // 1-4
    position: integer("position").notNull(), // 0-indexed within round
    movie1Id: integer("movie1_id").references(() => movies.id),
    movie2Id: integer("movie2_id").references(() => movies.id),
    winnerId: integer("winner_id").references(() => movies.id),
    playedAt: integer("played_at", { mode: "timestamp" }),
  },
  (table) => [index("matches_tournament_id_idx").on(table.tournamentId)],
);

// Relations
export const moviesRelations = relations(movies, ({ many }) => ({
  tournamentsWon: many(tournaments),
  matchesAsMovie1: many(matches, { relationName: "movie1" }),
  matchesAsMovie2: many(matches, { relationName: "movie2" }),
  matchesWon: many(matches, { relationName: "winner" }),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  winnerMovie: one(movies, {
    fields: [tournaments.winnerMovieId],
    references: [movies.id],
  }),
  matches: many(matches),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id],
  }),
  movie1: one(movies, {
    fields: [matches.movie1Id],
    references: [movies.id],
    relationName: "movie1",
  }),
  movie2: one(movies, {
    fields: [matches.movie2Id],
    references: [movies.id],
    relationName: "movie2",
  }),
  winner: one(movies, {
    fields: [matches.winnerId],
    references: [movies.id],
    relationName: "winner",
  }),
}));

// Type exports
export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;
export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
