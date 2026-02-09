import { z } from "zod/v4";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  TMDB_API_KEY: z.string().min(1, "TMDB_API_KEY is required"),
});

function validateEnv() {
  // In development, allow missing env vars for initial setup
  if (process.env.NODE_ENV === "development") {
    return {
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      TMDB_API_KEY: process.env.TMDB_API_KEY ?? "",
    };
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();
