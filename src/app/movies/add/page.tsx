import { MovieSearch } from "@/components/movie-search";

export default function AddMoviePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Add Movie</h1>
      <MovieSearch />
    </div>
  );
}
