"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { Loader } from "@/components/loader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addMovie, updateMovie } from "@/utils/db/connectDB";
import { useLocalStorage, useMovieStore } from "@/store/store";
import { getMovieDetails, getPosterURL } from "@/api/tmdb";

export function SeparateMoviePage({
  selectedMovieId,
  setSelectedMovieId,
  isShowingMovies,
  setIsShowingMovies,
}) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const userID = useLocalStorage((state) => state.userID);
  const savedMovies = useMovieStore((state) => state.savedMovies);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (!selectedMovieId) return;

    let savedMovie = savedMovies.find(
      (m) => m.tmdbId === Number(selectedMovieId),
    );
    if (savedMovie) {
      setMovie(savedMovie);
      setLoading(false);
      return;
    }

    getMovieDetails(selectedMovieId)
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedMovieId]);

  async function handleAddToWatchlist() {
    if (!userID) {
      toast.error("Please login to add to watchlist");
      router.push("/login");
      return;
    }

    let existingMovie = savedMovies.find(
      (m) => m.tmdbId === Number(selectedMovieId),
    );

    if (existingMovie && existingMovie.watched === false) {
      toast.error("Movie already added to watchlist");
      return;
    }

    try {
      setIsLoading(true);
      if (existingMovie) {
        const movieData = { ...existingMovie, watched: false };
        const { success, message } = await updateMovie(
          selectedMovieId,
          movieData,
          userID,
        );
        if (success) {
          toast.success(message);
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

    let existingMovie = savedMovies.find(
      (m) => m.tmdbId === Number(selectedMovieId),
    );

    if (existingMovie && existingMovie.watched === true) {
      toast.error("Movie already added to watched list");
      return;
    }

    try {
      setIsLoading2(true);
      if (existingMovie) {
        const movieData = { ...existingMovie, watched: true };
        const { success, message } = await updateMovie(
          selectedMovieId,
          movieData,
          userID,
        );
        if (success) {
          toast.success(message);
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

  const posterURL = getPosterURL(movie.poster_path, "w500");
  const year = movie.release_date?.substring(0, 4) || "N/A";
  const genres = movie.genres?.map((g) => g.name).join(", ") || "N/A";
  const director =
    movie.credits?.crew?.find((c) => c.job === "Director")?.name || "N/A";

  return (
    <div className="relative my-4 p-2 md:p-3 w-[95%] md:w-[60%] lg:w-[50%] mx-auto rounded-lg bg-white text-gray-500 flex flex-col items-center justify-between shadow-md">
      {loading && (
        <div className="h-full w-full grid place-items-center">
          <Loader />
        </div>
      )}
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
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-between"
        >
          {posterURL && (
            <Image
              height={200}
              width={250}
              src={posterURL}
              alt={movie.title}
              className="rounded-md object-cover aspect-auto"
            />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 text-gray-500 py-2 lg:py-4 mx-auto flex flex-col gap-2 items-center justify-center text-base"
          >
            <h1 className="text-2xl lg:text-3xl text-gray-600 font-nunito font-bold">
              {movie.title}
            </h1>
            <div className="w-full flex gap-6">
              <div className="flex-1 text-right">
                <span>
                  ⭐{movie.vote_average?.toFixed(1) || "N/A"}
                </span>
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-justify lg:px-4 xl:px-6"
            >
              {movie.overview}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex gap-8 md:gap-10 text-gray-700"
          >
            <button
              className={`px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-300 transition-colors duration-500 ${movie?.watched === false
                  ? "bg-gray-300 cursor-not-allowed "
                  : ""
                }`}
              onClick={handleAddToWatchlist}
            >
              {isLoading ? "Adding..." : "Want to Watch ?"}
            </button>
            <button
              className={`px-6 py-2.5 border border-gray-300 rounded-full hover:bg-gray-300 transition-colors duration-500 ${movie?.watched === true
                  ? "bg-gray-300 cursor-not-allowed"
                  : ""
                }`}
              onClick={handleAddToWatched}
            >
              {isLoading2 ? "Adding..." : "Watched ?"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
