"use client";
import { SmallMovieCard } from "@/components/SmallMovieCard";
import { Loader } from "@/components/loader";
import { useSearchMovies } from "@/hooks/useSearchMovies";

export default function SearchPage() {
  const { searchQuery, setSearchQuery, searchedMovies, searchLoading, searchError } =
    useSearchMovies();

  return (
    <div className="w-full">
      <div className="w-full px-4 md:px-10 lg:px-15 xl:px-20 py-4">
        <div className="relative w-full max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="w-full h-12 rounded-full border border-gray-400 focus:outline focus:outline-blue-400 px-5 pr-12 text-gray-700 placeholder:text-gray-400"
            autoFocus
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
        </div>
      </div>

      {searchLoading && (
        <div className="w-full h-[calc(100vh-70px-76px)] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {searchError && (
        <div className="w-full flex items-center justify-center py-8">
          <h1 className="text-xl font-semibold text-red-400">
            Error: {searchError}
          </h1>
        </div>
      )}

      {!searchLoading && !searchError && searchQuery.trim() && searchedMovies.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl font-semibold text-gray-600">No results found</h1>
          <p className="text-sm text-gray-400">
            Try searching for a different movie.
          </p>
        </div>
      )}

      {!searchLoading && !searchError && searchedMovies.length > 0 && (
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-2 px-4 my-2">
          {searchedMovies.map((movie, index) => (
            <SmallMovieCard
              key={movie.tmdbId || movie.id || index}
              movie={movie}
              index={index}
            />
          ))}
        </div>
      )}

      {!searchQuery.trim() && (
        <div className="w-full flex flex-col items-center justify-center py-16">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
            search
          </span>
          <h1 className="text-2xl font-semibold text-gray-600">
            Search for movies
          </h1>
          <p className="text-sm text-gray-400">
            Find your favorite movies from millions of titles.
          </p>
        </div>
      )}
    </div>
  );
}
