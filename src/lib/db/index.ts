import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";

import * as sqliteSchema from "./sqlite-schema";

// For local development, use SQLite
// In production with DATABASE_URL, you would use Neon PostgreSQL
const sqlite = new Database("local.db");
export const db = drizzleSqlite(sqlite, { schema: sqliteSchema });

// Re-export schema types
export * from "./sqlite-schema";
