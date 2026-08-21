"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { SmallMovieCard } from "@/components/SmallMovieCard";
import { Loader } from "@/components/loader";

import { useMovieStore } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { getAllMovies } from "@/hooks/useMoviesServices";
import { Movie } from "@/types/movie";

const getCreatedAtTime = (movie: Movie) => {
  if (
    movie &&
    typeof movie === "object" &&
    "createdAt" in movie &&
    typeof (movie as { createdAt?: unknown }).createdAt === "string"
  ) {
    return new Date((movie as { createdAt: string }).createdAt).getTime();
  }
  return 0;
};

export default function HomePage() {
  const [categoryFilter, setategoryFilter] = useState<"all" | "wantToWatch" | "watched">("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<("movie" | "tv")[]>([]);

  const toggleMediaType = (type: "movie" | "tv") => {
    setMediaTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const { userID } = useAuth();

  const setSavedMovies = useMovieStore((state) => state.setSavedMovies);

  const { data: savedMovies = [], isLoading: moviesLoading } = useQuery({
    queryKey: ["movies", userID],
    queryFn: () => getAllMovies(userID),
    enabled: !!userID,
    staleTime: 2 * 60 * 1000,
  });

  const filteredMovies = useMemo(() => {
    let result = savedMovies;

    if (categoryFilter === "wantToWatch") {
      result = result?.filter((movie) => movie.watched !== true);
    } else if (categoryFilter === "watched") {
      result = result?.filter((movie) => movie.watched === true);
    }

    if (mediaTypeFilter.length > 0) {
      result = result?.filter((movie) =>
        mediaTypeFilter.includes(movie.media_type || "movie")
      );
    }

    return result?.sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a)) ?? [];
  }, [categoryFilter, mediaTypeFilter, savedMovies]);

  useEffect(() => {
    if (savedMovies) {
      setSavedMovies(savedMovies);
    }
  }, [savedMovies]);

  if (moviesLoading) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="w-full py-5 px-4 md:pl-6 flex items-center overflow-x-auto gap-2 md:gap-4 scrollbar-hide">
        <button className={`${categoryFilter === "all" ? "bg-black text-white" : "bgtransparent text-gray-900"} text-sm md:text-base rounded-full px-4 xl:px-6 py-2 border border-gray-300 shadow-md font-semibold transition-all duration-300 cursor-pointer`}
          onClick={() => setategoryFilter("all")}>
          All
        </button>
        <button className={`${categoryFilter === "wantToWatch" ? "bg-black text-white" : "bgtransparent text-gray-900"} text-sm md:text-base rounded-full px-4 xl:px-6 py-2 border border-gray-300 shadow-md font-semibold transition-all duration-300 cursor-pointer`}
          onClick={() => setategoryFilter("wantToWatch")}>
          Want to Watch
        </button >
        <button className={`${categoryFilter === "watched" ? "bg-black text-white" : "bgtransparent text-gray-900"} text-sm md:text-base rounded-full px-4 xl:px-6 py-2 border border-gray-300 shadow-md font-semibold transition-all duration-300 cursor-pointer`}
          onClick={() => setategoryFilter("watched")}>
          Watched
        </button >
        <button className={`${mediaTypeFilter.includes("movie") ? "bg-black text-white" : "bgtransparent text-gray-900"} text-sm md:text-base rounded-full px-4 xl:px-6 py-2 border border-gray-300 shadow-md font-semibold transition-all duration-300 cursor-pointer`}
          onClick={() => toggleMediaType("movie")}>
          Movie
        </button >
        <button className={`${mediaTypeFilter.includes("tv") ? "bg-black text-white" : "bgtransparent text-gray-900"} text-sm md:text-base rounded-full px-4 xl:px-6 py-2 border border-gray-300 shadow-md font-semibold transition-all duration-300 cursor-pointer`}
          onClick={() => toggleMediaType("tv")}>
          Tv Series
        </button >
      </div >

      {
        filteredMovies.length > 0 ? (
          <div className="w-full grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-0.5 md:gap-2 px-2 md:px-4">
            {filteredMovies?.map((movie, index) => (
              <SmallMovieCard
                key={index || movie.tmdbId || movie.id}
                movie={movie}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="w-full pt-15 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-600">No saved movies found!</h1>
            <p className="text-sm text-gray-400">Try
              <Link href="/search" className="text-blue-500 hover:underline pl-1">
                logging in
              </Link> for saved movies.
            </p>
          </div>
        )
      }
    </>
  );
}
