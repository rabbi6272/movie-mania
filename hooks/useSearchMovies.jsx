"use client";
import { useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/api/tmdb";
import { normalizeMovieForCard } from "@/api/tmdb";

export function useSearchMovies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const controllerRef = useRef(null);

  const {
    data: searchedMovies = [],
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search", searchQuery, searchPage],
    queryFn: async ({ signal }) => {
      if (!searchQuery.trim()) return [];
      const data = await searchMovies(searchQuery, searchPage, signal);
      return data.results.map(normalizeMovieForCard);
    },
    enabled: !!searchQuery.trim(),
    placeholderData: (prev) => prev,
  });

  const searchForMovies = useCallback((query) => {
    setSearchQuery(query);
    setSearchPage(1);
  }, []);

  return {
    query: searchQuery,
    setQuery: searchForMovies,
    searchedMovies,
    searchLoading,
    searchError: searchError?.message || null,
    searchPage,
    setSearchPage,
  };
}
