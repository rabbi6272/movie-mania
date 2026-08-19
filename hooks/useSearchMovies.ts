"use client";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMulti, normalizeMovieForCard } from "@/api/tmdb";
import { useMovieStore } from "@/store/store";

export function useSearchMovies() {
  const searchQuery = useMovieStore((state) => state.searchQuery);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const searchPage = useMovieStore((state) => state.searchPage);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);

  const {
    data: searchedMovies = [],
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search", searchQuery, searchPage],
    queryFn: async ({ signal }) => {
      if (!searchQuery.trim()) return [];
      const data = await searchMulti(searchQuery, searchPage, signal);
      return data.results
        .filter((item) => item.media_type === "movie" || item.media_type === "tv")
        .map(normalizeMovieForCard);
    },
    enabled: !!searchQuery.trim(),
    placeholderData: (prev) => prev,
  });

  const searchForMovies = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setSearchPage(1);
    },
    [setSearchQuery, setSearchPage],
  );

  return {
    searchQuery,
    setSearchQuery: searchForMovies,
    searchedMovies,
    searchLoading,
    searchError: searchError?.message || null,
    searchPage,
    setSearchPage,
  };
}
