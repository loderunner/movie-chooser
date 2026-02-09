import Database from "better-sqlite3";

const sqlite = new Database("local.db");

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    year INTEGER,
    overview TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    genres TEXT,
    director TEXT,
    cast TEXT,
    archived INTEGER DEFAULT 0 NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE UNIQUE INDEX IF NOT EXISTS movies_tmdb_id_idx ON movies(tmdb_id);
  CREATE INDEX IF NOT EXISTS movies_archived_idx ON movies(archived);

  CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT DEFAULT 'active' NOT NULL CHECK(status IN ('active', 'finished', 'ended')),
    winner_movie_id INTEGER REFERENCES movies(id),
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    ended_at INTEGER
  );

  CREATE INDEX IF NOT EXISTS tournaments_status_idx ON tournaments(status);

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    round INTEGER NOT NULL,
    position INTEGER NOT NULL,
    movie1_id INTEGER REFERENCES movies(id),
    movie2_id INTEGER REFERENCES movies(id),
    winner_id INTEGER REFERENCES movies(id),
    played_at INTEGER
  );

  CREATE INDEX IF NOT EXISTS matches_tournament_id_idx ON matches(tournament_id);
`);

console.log("Database migration completed successfully!");
sqlite.close();
