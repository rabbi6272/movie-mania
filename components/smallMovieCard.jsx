"use client";
import Image from "next/image";
import { memo } from "react";
import { getPosterURL } from "@/api/tmdb";

export const SmallMovieCard = memo(function SmallMovieCard({
  movie,
  index,
  setSelectedMovieId,
  setIsShowingMovies,
}) {
  const posterURL = getPosterURL(movie.poster_path, "w342");
  const year = movie.release_date?.substring(0, 4) || "N/A";

  return (
    <div
      className="h-auto w-full mx-auto rounded-lg border border-gray-200 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors duration-300 shadow-md overflow-hidden group animate-fadeIn"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => {
        setSelectedMovieId(movie.tmdbId || movie.id);
        setIsShowingMovies(true);
      }}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100">
        {posterURL ? (
          <Image
            fill
            src={posterURL}
            alt={movie.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
        {movie.vote_average > 0 && (
          <div className="absolute top-1 right-1 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span className="text-yellow-400">★</span>
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-2 w-full">
        <h3 className="text-gray-700 text-xs sm:text-sm font-medium line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{year}</p>
      </div>
    </div>
  );
});
