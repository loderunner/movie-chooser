import type { TMDBMovieDetails, TMDBSearchResult } from "@/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// Mock data for development when TMDB_API_KEY is not available
const MOCK_MOVIES: TMDBSearchResult[] = [
  {
    id: 603,
    title: "The Matrix",
    release_date: "1999-03-30",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    overview:
      "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
  },
  {
    id: 604,
    title: "The Matrix Reloaded",
    release_date: "2003-05-15",
    poster_path: "/9TGHDvWrqKBzwDxDodHYXEmOE6J.jpg",
    overview:
      "Six months after the events depicted in The Matrix, Neo has proved to be a good omen for the free humans.",
  },
  {
    id: 155,
    title: "The Dark Knight",
    release_date: "2008-07-16",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    overview:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
  },
  {
    id: 238,
    title: "The Godfather",
    release_date: "1972-03-14",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    overview:
      "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    release_date: "1994-09-23",
    poster_path: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    release_date: "1994-09-10",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    overview:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
  },
  {
    id: 13,
    title: "Forrest Gump",
    release_date: "1994-06-23",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    overview:
      "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
  },
  {
    id: 550,
    title: "Fight Club",
    release_date: "1999-10-15",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    overview:
      "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
  },
  {
    id: 11,
    title: "Star Wars",
    release_date: "1977-05-25",
    poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    overview:
      "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire.",
  },
  {
    id: 27205,
    title: "Inception",
    release_date: "2010-07-15",
    poster_path: "/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    overview:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.",
  },
];

const MOCK_MOVIE_DETAILS: Record<number, TMDBMovieDetails> = {
  603: {
    tmdbId: 603,
    title: "The Matrix",
    year: 1999,
    overview:
      "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    posterPath: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropPath: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    genres: "Action, Science Fiction",
    director: "The Wachowskis",
    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving",
  },
  604: {
    tmdbId: 604,
    title: "The Matrix Reloaded",
    year: 2003,
    overview:
      "Six months after the events depicted in The Matrix, Neo has proved to be a good omen for the free humans.",
    posterPath: "/9TGHDvWrqKBzwDxDodHYXEmOE6J.jpg",
    backdropPath: "/jxFSXSYMJDYzHjHYnS7YNEUuRJh.jpg",
    genres: "Action, Science Fiction",
    director: "The Wachowskis",
    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving",
  },
  155: {
    tmdbId: 155,
    title: "The Dark Knight",
    year: 2008,
    overview:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropPath: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    genres: "Drama, Action, Crime, Thriller",
    director: "Christopher Nolan",
    cast: "Christian Bale, Heath Ledger, Michael Caine, Gary Oldman",
  },
  238: {
    tmdbId: 238,
    title: "The Godfather",
    year: 1972,
    overview:
      "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
    posterPath: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdropPath: "/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg",
    genres: "Drama, Crime",
    director: "Francis Ford Coppola",
    cast: "Marlon Brando, Al Pacino, James Caan, Robert Duvall",
  },
  278: {
    tmdbId: 278,
    title: "The Shawshank Redemption",
    year: 1994,
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    posterPath: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    backdropPath: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    genres: "Drama, Crime",
    director: "Frank Darabont",
    cast: "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler",
  },
  680: {
    tmdbId: 680,
    title: "Pulp Fiction",
    year: 1994,
    overview:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    posterPath: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropPath: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    genres: "Thriller, Crime",
    director: "Quentin Tarantino",
    cast: "John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis",
  },
  13: {
    tmdbId: 13,
    title: "Forrest Gump",
    year: 1994,
    overview:
      "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
    posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdropPath: "/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
    genres: "Comedy, Drama, Romance",
    director: "Robert Zemeckis",
    cast: "Tom Hanks, Robin Wright, Gary Sinise, Sally Field",
  },
  550: {
    tmdbId: 550,
    title: "Fight Club",
    year: 1999,
    overview:
      "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropPath: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    genres: "Drama",
    director: "David Fincher",
    cast: "Edward Norton, Brad Pitt, Helena Bonham Carter, Meat Loaf",
  },
  11: {
    tmdbId: 11,
    title: "Star Wars",
    year: 1977,
    overview:
      "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire.",
    posterPath: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    backdropPath: "/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg",
    genres: "Adventure, Action, Science Fiction",
    director: "George Lucas",
    cast: "Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing",
  },
  27205: {
    tmdbId: 27205,
    title: "Inception",
    year: 2010,
    overview:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.",
    posterPath: "/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    backdropPath: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    genres: "Action, Science Fiction, Adventure",
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Ken Watanabe",
  },
};

// Add more mock movies for testing (need 16+ for tournaments)
const ADDITIONAL_MOCK_MOVIES: TMDBSearchResult[] = [
  {
    id: 120,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    release_date: "2001-12-18",
    poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    overview:
      "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo.",
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    release_date: "2003-12-01",
    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    overview: "Aragorn is revealed as the heir to the ancient kings.",
  },
  {
    id: 807,
    title: "Se7en",
    release_date: "1995-09-22",
    poster_path: "/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    overview: "Two homicide detectives are on a desperate hunt for a serial killer.",
  },
  {
    id: 157336,
    title: "Interstellar",
    release_date: "2014-11-05",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    overview: "Interstellar chronicles the adventures of a group of explorers.",
  },
  {
    id: 389,
    title: "12 Angry Men",
    release_date: "1957-04-10",
    poster_path: "/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
    overview: "The defense and the prosecution have rested.",
  },
  {
    id: 129,
    title: "Spirited Away",
    release_date: "2001-07-20",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world.",
  },
  {
    id: 424,
    title: "Schindler's List",
    release_date: "1993-11-30",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    overview: "The true story of how businessman Oskar Schindler saved over a thousand lives.",
  },
  {
    id: 497,
    title: "The Green Mile",
    release_date: "1999-12-10",
    poster_path: "/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
    overview: "A tale set on death row in a Southern prison.",
  },
];

// Combine mock movies
const ALL_MOCK_MOVIES = [...MOCK_MOVIES, ...ADDITIONAL_MOCK_MOVIES];

// Add details for additional movies
MOCK_MOVIE_DETAILS[120] = {
  tmdbId: 120,
  title: "The Lord of the Rings: The Fellowship of the Ring",
  year: 2001,
  overview: "Young hobbit Frodo Baggins inherits a ring from his uncle Bilbo.",
  posterPath: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
  backdropPath: "/vRQnzOn4HjIMX4LBq9nHhFXbsSu.jpg",
  genres: "Adventure, Fantasy, Action",
  director: "Peter Jackson",
  cast: "Elijah Wood, Ian McKellen, Viggo Mortensen, Orlando Bloom",
};
MOCK_MOVIE_DETAILS[122] = {
  tmdbId: 122,
  title: "The Lord of the Rings: The Return of the King",
  year: 2003,
  overview: "Aragorn is revealed as the heir to the ancient kings.",
  posterPath: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
  backdropPath: "/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg",
  genres: "Adventure, Fantasy, Action",
  director: "Peter Jackson",
  cast: "Elijah Wood, Ian McKellen, Viggo Mortensen, Orlando Bloom",
};
MOCK_MOVIE_DETAILS[807] = {
  tmdbId: 807,
  title: "Se7en",
  year: 1995,
  overview: "Two homicide detectives are on a desperate hunt for a serial killer.",
  posterPath: "/6yoghtyTpznpBik8EngEmJskVUO.jpg",
  backdropPath: "/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
  genres: "Crime, Mystery, Thriller",
  director: "David Fincher",
  cast: "Morgan Freeman, Brad Pitt, Gwyneth Paltrow, Kevin Spacey",
};
MOCK_MOVIE_DETAILS[157336] = {
  tmdbId: 157336,
  title: "Interstellar",
  year: 2014,
  overview: "Interstellar chronicles the adventures of a group of explorers.",
  posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  backdropPath: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
  genres: "Adventure, Drama, Science Fiction",
  director: "Christopher Nolan",
  cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine",
};
MOCK_MOVIE_DETAILS[389] = {
  tmdbId: 389,
  title: "12 Angry Men",
  year: 1957,
  overview: "The defense and the prosecution have rested.",
  posterPath: "/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
  backdropPath: "/qqHQsStV6exghCM7zbObuYBiYxw.jpg",
  genres: "Drama",
  director: "Sidney Lumet",
  cast: "Henry Fonda, Lee J. Cobb, Martin Balsam, Ed Begley",
};
MOCK_MOVIE_DETAILS[129] = {
  tmdbId: 129,
  title: "Spirited Away",
  year: 2001,
  overview: "A young girl, Chihiro, becomes trapped in a strange new world.",
  posterPath: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  backdropPath: "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg",
  genres: "Animation, Family, Fantasy",
  director: "Hayao Miyazaki",
  cast: "Rumi Hiiragi, Miyu Irino, Mari Natsuki, Takashi Naitō",
};
MOCK_MOVIE_DETAILS[424] = {
  tmdbId: 424,
  title: "Schindler's List",
  year: 1993,
  overview: "The true story of how businessman Oskar Schindler saved over a thousand lives.",
  posterPath: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
  backdropPath: "/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
  genres: "Drama, History, War",
  director: "Steven Spielberg",
  cast: "Liam Neeson, Ben Kingsley, Ralph Fiennes, Caroline Goodall",
};
MOCK_MOVIE_DETAILS[497] = {
  tmdbId: 497,
  title: "The Green Mile",
  year: 1999,
  overview: "A tale set on death row in a Southern prison.",
  posterPath: "/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
  backdropPath: "/Rlt20sEbOQKPVjia7lUilFm49W.jpg",
  genres: "Fantasy, Drama, Crime",
  director: "Frank Darabont",
  cast: "Tom Hanks, Michael Clarke Duncan, David Morse, Bonnie Hunt",
};

function getApiKey(): string {
  return process.env.TMDB_API_KEY ?? "";
}

function shouldUseMockData(): boolean {
  const apiKey = getApiKey();
  return apiKey.length === 0;
}

export async function searchMovies(query: string): Promise<TMDBSearchResult[]> {
  if (query.length < 2) {
    return [];
  }

  // Use mock data if no API key
  if (shouldUseMockData()) {
    const lowerQuery = query.toLowerCase();
    return ALL_MOCK_MOVIES.filter(
      (movie) => movie.title.toLowerCase().includes(lowerQuery) && movie.poster_path !== null,
    ).slice(0, 10);
  }

  // Real TMDB API call
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  const data = (await response.json()) as { results: TMDBSearchResult[] };

  // Filter to only include results with poster_path and return top 10
  return data.results.filter((movie) => movie.poster_path !== null).slice(0, 10);
}

export async function getMovieDetails(tmdbId: number): Promise<TMDBMovieDetails | null> {
  // Use mock data if no API key
  if (shouldUseMockData()) {
    return MOCK_MOVIE_DETAILS[tmdbId] ?? null;
  }

  // Real TMDB API call
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${tmdbId}?append_to_response=credits&language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`TMDB API error: ${response.status}`);
  }

  interface TMDBDetailResponse {
    id: number;
    title: string;
    release_date?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    genres: Array<{ id: number; name: string }>;
    credits?: {
      crew: Array<{ job: string; name: string }>;
      cast: Array<{ name: string }>;
    };
  }

  const data = (await response.json()) as TMDBDetailResponse;

  // Extract director from crew
  const director = data.credits?.crew.find((person) => person.job === "Director")?.name ?? null;

  // Get top 4 cast members
  const cast =
    data.credits?.cast
      .slice(0, 4)
      .map((person) => person.name)
      .join(", ") ?? "";

  // Parse year from release_date
  const year =
    data.release_date !== undefined && data.release_date.length > 0
      ? parseInt(data.release_date.substring(0, 4), 10)
      : null;

  return {
    tmdbId: data.id,
    title: data.title,
    year: isNaN(year ?? NaN) ? null : year,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    genres: data.genres.map((g) => g.name).join(", "),
    director,
    cast,
  };
}

export function getTMDBImageUrl(path: string | null): string | null {
  if (path === null) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}${path}`;
}
