"use client";
import { useState, useEffect, useMemo } from "react";
import { useMovieStore } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SmallMovieCard } from "@/components/SmallMovieCard";
import { Loader } from "@/components/loader";

import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllMovies } from "@/hooks/useMoviesServices";
import Link from "next/link";

export default function HomePage() {
  const [category, setCategory] = useState("all");

  const { userID } = useAuth();

  const queryClient = useQueryClient();
  const setSavedMovies = useMovieStore((state) => state.setSavedMovies);

  const { data: savedMovies = [], isLoading: moviesLoading } = useQuery({
    queryKey: ["movies", userID],
    queryFn: () => getAllMovies(userID),
    enabled: !!userID,
    staleTime: 2 * 60 * 1000,
  });

  const filteredMovies = useMemo(() => {
    if (category === "wantToWatch")
      return savedMovies?.filter((movie) => movie.watched === false).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (category === "watched")
      return savedMovies?.filter((movie) => movie.watched === true).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return savedMovies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [category, savedMovies]);

  useEffect(() => {
    if (savedMovies) {
      setSavedMovies(savedMovies);
    }
  }, [savedMovies, setSavedMovies]);

  if (moviesLoading) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="w-full py-3 px-4 md:pl-6 flex items-center">
        <span className="material-symbols-outlined text-gray-400 text-lg">
          filter_alt
        </span>
        <Select
          onValueChange={(value) => setCategory(value)}
          defaultValue={category}
        >
          <SelectTrigger className="bg-white w-[150px] border-gray-400 text-gray-600 rounded-full font-medium text-sm">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Catagory</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="watched">Watched</SelectItem>
              <SelectItem value="wantToWatch">Want to watch</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="w-full grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-0.5 md:gap-2 px-2 md:px-4 my-2">
          {filteredMovies?.map((movie, index) => (
            <SmallMovieCard
              key={movie.tmdbId || movie.id || index}
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
      )}
    </>
  );
}
