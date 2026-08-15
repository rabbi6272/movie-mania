import { create } from "zustand";

export const useMovieStore = create((set) => ({
  userID: null,
  setUserID: (userID) => set({ userID }),

  savedMovies: [],
  setSavedMovies: (savedMovies) => set({ savedMovies }),

  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  searchedMovies: [],
  setSearchedMovies: (searchedMovies) => set({ searchedMovies }),

  searchLoading: false,
  setSearchLoading: (searchLoading) => set({ searchLoading }),

  searchError: null,
  setSearchError: (searchError) => set({ searchError }),

  searchPage: 1,
  setSearchPage: (searchPage) => set({ searchPage }),

  searchTotalPages: 1,
  setSearchTotalPages: (searchTotalPages) => set({ searchTotalPages }),

  genres: [],
  setGenres: (genres) => set({ genres }),

  filters: {
    genreIds: [],
    sortBy: "popularity.desc",
    year: null,
    minRating: null,
    maxRating: null,
  },
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () =>
    set({
      filters: {
        genreIds: [],
        sortBy: "popularity.desc",
        year: null,
        minRating: null,
        maxRating: null,
      },
    }),
}));
