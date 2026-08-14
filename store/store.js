import { create } from "zustand";

export const useMovieStore = create((set) => ({
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

  trendingMovies: [],
  setTrendingMovies: (trendingMovies) => set({ trendingMovies }),

  trendingLoading: false,
  setTrendingLoading: (trendingLoading) => set({ trendingLoading }),

  popularMovies: [],
  setPopularMovies: (popularMovies) => set({ popularMovies }),

  popularLoading: false,
  setPopularLoading: (popularLoading) => set({ popularLoading }),

  popularPage: 1,
  setPopularPage: (popularPage) => set({ popularPage }),

  popularTotalPages: 1,
  setPopularTotalPages: (popularTotalPages) => set({ popularTotalPages }),

  genres: [],
  setGenres: (genres) => set({ genres }),

  activeTab: "trending",
  setActiveTab: (activeTab) => set({ activeTab }),

  selectedMovieId: null,
  setSelectedMovieId: (selectedMovieId) => set({ selectedMovieId }),

  isShowingMovies: false,
  setIsShowingMovies: (isShowingMovies) => set({ isShowingMovies }),

  filters: {
    genreIds: [],
    sortBy: "popularity.desc",
    year: null,
    minRating: null,
    maxRating: null,
  },
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
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

  filteredMovies: [],
  setFilteredMovies: (filteredMovies) => set({ filteredMovies }),
  filteredLoading: false,
  setFilteredLoading: (filteredLoading) => set({ filteredLoading }),
  filteredPage: 1,
  setFilteredPage: (filteredPage) => set({ filteredPage }),
  filteredTotalPages: 1,
  setFilteredTotalPages: (filteredTotalPages) => set({ filteredTotalPages }),
}));

export const useLocalStorage = create((set) => ({
  userID: null,
  setUserID: (userID) => {
    if (userID) {
      localStorage.setItem("userID", userID);
    } else {
      localStorage.removeItem("userID");
    }
    set({ userID });
  },
}));
