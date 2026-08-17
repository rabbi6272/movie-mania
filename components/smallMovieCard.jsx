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
      className="h-auto w-full mx-auto rounded-lg border border-gray-200 flex flex-col cursor-pointer bg-white transition-colors duration-300 shadow-md hover:shadow-lg overflow-hidden group animate-fadeIn"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => {
        setSelectedMovieId(movie.tmdbId || movie.id);
        setIsShowingMovies(true);
      }}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden">
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
          <div className="absolute top-0.5 lg:top-1.5 right-0.5 lg:right-1.5 bg-black/70 text-white text-[10px] lg:text-[12px] font-semibold px-1.5 py-0.5 rounded-full flex items-center justify-center gap-0.5">
            <span className="text-yellow-400">★</span>
            {movie.vote_average.toFixed(1)}
          </div>
        )}
        {movie.watched === true && (
          <div className="absolute top-0.5 lg:top-1.5 left-0.5 lg:left-1.5 bg-green-500/80 text-white rounded-full p-0.5">
            <svg className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-2 w-full">
        <h3 className="text-gray-700 text-sm lg:text-base font-semibold line-clamp-2 leading-tight text-nowrap">
          {movie.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{year}</p>
      </div>
    </div>
  );
});
