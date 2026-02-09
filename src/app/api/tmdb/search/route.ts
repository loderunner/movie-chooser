import { type NextRequest, NextResponse } from "next/server";

import { searchMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") ?? "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchMovies(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
  }
}
