"use client";
import { useEffect, useRef } from "react";
import { useMovieStore } from "@/store/store";
import { searchMovies } from "@/api/tmdb";
import { normalizeMovieForCard } from "@/api/tmdb";

export function useSearchMovies() {
  const searchQuery = useMovieStore((state) => state.searchQuery);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const searchedMovies = useMovieStore((state) => state.searchedMovies);
  const setSearchedMovies = useMovieStore((state) => state.setSearchedMovies);
  const searchLoading = useMovieStore((state) => state.searchLoading);
  const setSearchLoading = useMovieStore((state) => state.setSearchLoading);
  const searchError = useMovieStore((state) => state.searchError);
  const setSearchError = useMovieStore((state) => state.setSearchError);
  const searchPage = useMovieStore((state) => state.searchPage);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);
  const setSearchTotalPages = useMovieStore((state) => state.setSearchTotalPages);

  const controllerRef = useRef(null);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    async function doSearch() {
      if (!searchQuery.trim()) {
        setSearchError(null);
        setSearchedMovies([]);
        setSearchLoading(false);
        setSearchPage(1);
        return;
      }

      try {
        setSearchLoading(true);
        setSearchError(null);
        const data = await searchMovies(searchQuery, searchPage);
        if (!controller.signal.aborted) {
          const normalized = data.results.map(normalizeMovieForCard);
          setSearchedMovies(normalized);
          setSearchTotalPages(data.total_pages);
          if (normalized.length === 0) {
            setSearchError("No movies found");
          }
        }
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          setSearchError(error.message);
          setSearchedMovies([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }

    const timer = setTimeout(doSearch, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, searchPage]);

  const searchForMovies = (query) => {
    setSearchQuery(query);
    setSearchPage(1);
  };

  return {
    query: searchQuery,
    setQuery: searchForMovies,
    searchedMovies,
    searchLoading,
    searchError,
    searchPage,
    setSearchPage,
  };
}
