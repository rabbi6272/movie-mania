"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@heroui/react";
import { Loader } from "@/components/loader";

import { addMovie, updateMovie, deleteMovie } from "@/hooks/useMoviesServices";
import { useMovieStore } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { getMovieDetails, getPosterURL } from "@/api/tmdb";

export function SeparateMoviePage({
  selectedMovieId,
  setSelectedMovieId,
  isShowingMovies,
  setIsShowingMovies,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const { userID } = useAuth();
  const savedMovies = useMovieStore((state) => state.savedMovies);
  const removeSavedMovie = useMovieStore((state) => state.removeSavedMovie);
  const router = useRouter();
  const queryClient = useQueryClient();

  const savedMovie = savedMovies.find(
    (m) => m.tmdbId === Number(selectedMovieId),
  );

  const { data: movie = savedMovie || {}, isLoading: loading } = useQuery({
    queryKey: ["movie", selectedMovieId],
    queryFn: () => getMovieDetails(selectedMovieId),
    enabled: !!selectedMovieId && !savedMovie,
    staleTime: 30 * 60 * 1000,
  });

  const posterURL = getPosterURL(movie.poster_path, "w500");
  const year = movie.release_date?.substring(0, 4) || "N/A";
  const genres = movie.genres?.map((g) => g.name).join(", ") || "N/A";
  const director =
    movie.credits?.crew?.find((c) => c.job === "Director")?.name || "N/A";

  async function handleAddToWatchlist() {
    if (!userID) {
      toast.error("Please login to add to watchlist");
      router.push("/login");
      return;
    }

    if (savedMovie && savedMovie.watched === false) {
      toast.error("Movie already added to watchlist");
      return;
    }

    try {
      setIsLoading(true);
      if (savedMovie) {
        const movieData = { ...savedMovie, watched: false };
        const { success, message } = await updateMovie(
          savedMovie.id,
          movieData,
          userID,
        );
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
          setSelectedMovieId("");
          setIsShowingMovies(!isShowingMovies);
        } else {
          toast.error(message);
        }
      } else {
        const movieData = {
          tmdbId: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          watched: false,
        };
        const { success, message } = await addMovie(movieData, userID);
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
          setSelectedMovieId("");
          setIsShowingMovies(!isShowingMovies);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddToWatched() {
    if (!userID) {
      toast.error("Please login to add to watched list");
      router.push("/login");
      return;
    }

    if (savedMovie && savedMovie.watched === true) {
      toast.error("Movie already added to watched list");
      return;
    }

    try {
      setIsLoading2(true);
      if (savedMovie) {
        const movieData = { ...savedMovie, watched: true };
        const { success, message } = await updateMovie(
          savedMovie.id,
          movieData,
          userID,
        );
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
          setSelectedMovieId("");
          setIsShowingMovies(!isShowingMovies);
        } else {
          toast.error(message);
        }
      } else {
        const movieData = {
          tmdbId: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          watched: true,
        };
        const { success, message } = await addMovie(movieData, userID);
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
          setSelectedMovieId("");
          setIsShowingMovies(!isShowingMovies);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading2(false);
    }
  }

  async function handleDelete() {
    if (!userID) {
      toast.error("Please login to delete movie");
      router.push("/login");
      return;
    }

    if (!savedMovie) {
      toast.error("No movie selected");
      return;
    }

    try {
      const { success, message } = await deleteMovie(savedMovie.id, userID);
      if (success) {
        toast.success(message);
        removeSavedMovie(savedMovie.id);
        queryClient.invalidateQueries({ queryKey: ["movies", userID] });
        setSelectedMovieId("");
        setIsShowingMovies(!isShowingMovies);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) {
    return (
      <div className="h-full w-full grid place-items-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="relative my-4 p-2 md:p-3 w-[95%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] mx-auto rounded-lg bg-white text-gray-500 flex flex-col items-center justify-between shadow-md">
     
      <button
        className="absolute top-[5px] left-[5px] md:top-[10px] md:left-[10px] h-[40px] w-[40px] rounded-full bg-gray-100 active:scale-95 transition duration-300 grid place-items-center cursor-pointer z-10"
        onClick={() => {
          setSelectedMovieId("");
          setIsShowingMovies(!isShowingMovies);
        }}
      >
        <span className="material-symbols-outlined text-gray-700">
          arrow_back
        </span>
      </button>
     
      {savedMovie && (
        <button
          className="absolute top-[5px] right-[5px] md:top-[10px] md:right-[10px] h-[40px] w-[40px] rounded-full bg-gray-100 active:scale-95 transition duration-300 grid place-items-center cursor-pointer z-10"
          onClick={handleDelete}
        >
          <span className="material-symbols-outlined text-red-500">
            delete
          </span>
        </button>
      )}

        <div className="animate-fadeIn pt-10 flex flex-col items-center justify-between">
          {posterURL && (
            <Image
              height={200}
              width={250}
              src={posterURL}
              alt={movie.title}
              className="rounded-md object-cover aspect-auto"
            />
          )}

          <div className="flex-1 text-gray-500 py-2 lg:py-4 mx-auto flex flex-col gap-2 items-center justify-center text-base animate-fadeIn">
            <h1 className="text-2xl lg:text-3xl text-gray-700 font-nunito font-bold">
              {movie.title}
            </h1>
            <div className="w-full flex gap-6">
              <div className="flex-1 text-right">
                <span>⭐{movie.vote_average?.toFixed(1) || "N/A"}</span>
                <br />
                <span>Year: {year}</span>
                <br />
                <span>Runtime: {movie.runtime || "N/A"} min</span>
                <br />
                <span>Director: {director}</span>
                <br />
              </div>
              <div className="flex-1 text-left">
                <span>Released: {movie.release_date || "N/A"}</span>
                <br />
                <span>Genre: {genres}</span>
                <br />
                <span>Language: {movie.original_language || "N/A"}</span>
                <br />
              </div>
            </div>

            <p className="text-justify lg:px-4 xl:px-6 animate-fadeIn animation-delay-200">
              {movie.overview}
            </p>
          </div>

          <div className="flex gap-4 md:gap-8 animate-fadeIn animation-delay-400">
            <Button varient="outline" size="lg"
              className={`font-semibold px-6 py-2.5 border border-gray-300 rounded-full
                ${movie?.watched === false
                  ? "bg-black text-white cursor-not-allowed "
                  : ""
                }`}
              onClick={handleAddToWatchlist}
            >
              {isLoading ? "Adding..." : "Want to Watch ?"}
            </Button>
            <Button varient="outline" size="lg"
              className={`font-semibold px-6 py-2.5 border border-gray-300 rounded-full
                ${movie?.watched === true
                  ? "bg-black text-white cursor-not-allowed "
                  : ""
                }`}
              onClick={handleAddToWatched}
            >
              {isLoading2 ? "Adding..." : "Watched ?"}
            </Button>
          </div>
        </div>
    </div>
  );
}
