"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SmallMovieCard } from "@/components/smallMovieCard";
import { Loader } from "@/components/loader";
import { SeparateMoviePage } from "../components/SeparateMoviePage";

import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllMovies } from "@/utils/db/connectDB";

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const [isShowingMovies, setIsShowingMovies] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");

  const { userID } = useAuth();

  const queryClient = useQueryClient();

  const { data: savedMovies = [], isLoading: moviesLoading } = useQuery({
    queryKey: ["movies", userID],
    queryFn: () => getAllMovies(userID),
    enabled: !!userID,
    staleTime: 2 * 60 * 1000,
  });

  const filteredMovies = (() => {
    if (category === "wantToWatch")
      return savedMovies?.filter((movie) => movie.watched === false);
    if (category === "watched")
      return savedMovies?.filter((movie) => movie.watched === true);
    return savedMovies;
  })();

  useEffect(() => {
    if (!isShowingMovies && userID) {
      queryClient.invalidateQueries({ queryKey: ["movies", userID] });
    }
  }, [isShowingMovies, userID, queryClient]);

  if (moviesLoading) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isShowingMovies) {
    return (
      <SeparateMoviePage
        isShowingMovies={isShowingMovies}
        setIsShowingMovies={setIsShowingMovies}
        selectedMovieId={selectedMovieId}
        setSelectedMovieId={setSelectedMovieId}
      />
    );
  }

  if (!isShowingMovies) {
    return (
      <>
        <div className="w-full h-auto py-2 pl-2 md:pl-6 flex items-center">
          {" "}
          <span className="material-symbols-outlined text-gray-400 text-lg">
            filter_alt
          </span>
          <Select
            onValueChange={(value) => setCategory(value)}
            defaultValue={category}
          >
            <SelectTrigger className="w-[100px] lg:w-[150px] 2xl:w-[200px] border-gray-400 text-gray-600">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Movies</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="wantToWatch">Want to watch</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-2 px-4 my-2">
          {filteredMovies.length > 0 ? ( filteredMovies?.map((movie, index) => (
            <SmallMovieCard
              key={movie.tmdbId || movie.id || index}
              movie={movie}
              index={index}
              setSelectedMovieId={setSelectedMovieId}
              setIsShowingMovies={setIsShowingMovies}
            />
          )) : (
<div className="w-full h-[calc(100vh-70px)] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-600">No movies saved</h1>
      <p className="text-sm text-gray-400">Try searching for a movie.</p>
    </div>

)}
        </div>
      </>
    );
  }

}
