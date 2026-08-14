"use client";
import { useState, useEffect } from "react";
import { getGenres } from "@/api/tmdb";
import { useMovieStore } from "@/store/store";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "popularity.asc", label: "Least Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "vote_average.asc", label: "Lowest Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "title.asc", label: "Title A-Z" },
  { value: "title.desc", label: "Title Z-A" },
];

const YEAR_PRESETS = [
  { label: "All Years", min: 1900, max: 2026 },
  { label: "2020s", min: 2020, max: 2026 },
  { label: "2010s", min: 2010, max: 2019 },
  { label: "2000s", min: 2000, max: 2009 },
  { label: "90s", min: 1990, max: 1999 },
  { label: "80s", min: 1980, max: 1989 },
];

export default function FilterPanel({ onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const genres = useMovieStore((state) => state.genres);
  const filters = useMovieStore((state) => state.filters);
  const setFilters = useMovieStore((state) => state.setFilters);
  const resetFilters = useMovieStore((state) => state.resetFilters);

  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  useEffect(() => {
    if (genres.length === 0) {
      getGenres().then((data) => {
        useMovieStore.getState().setGenres(data.genres);
      });
    }
  }, [genres.length]);

  const toggleGenre = (genreId) => {
    const current = localFilters.genreIds || [];
    const updated = current.includes(genreId)
      ? current.filter((id) => id !== genreId)
      : [...current, genreId];
    setLocalFilters({ ...localFilters, genreIds: updated });
  };

  const handleApply = () => {
    setFilters(localFilters);
    onApply?.();
    setIsOpen(false);
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({
      genreIds: [],
      sortBy: "popularity.desc",
      year: null,
      minRating: null,
      maxRating: null,
    });
    onApply?.();
    setIsOpen(false);
  };

  const hasActiveFilters =
    localFilters.genreIds?.length > 0 ||
    localFilters.year ||
    localFilters.minRating ||
    localFilters.maxRating ||
    localFilters.sortBy !== "popularity.desc";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${hasActiveFilters
            ? "border-blue-400 bg-blue-50 text-blue-600"
            : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        Filters
        {hasActiveFilters && (
          <span className="bg-blue-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {(localFilters.genreIds?.length || 0) +
              (localFilters.year ? 1 : 0) +
              (localFilters.minRating ? 1 : 0) +
              (localFilters.sortBy !== "popularity.desc" ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              <button
                onClick={handleReset}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Reset All
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Sort By
              </label>
              <select
                value={localFilters.sortBy}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, sortBy: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Genres
              </label>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${localFilters.genreIds?.includes(genre.id)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Release Year
              </label>
              <div className="flex flex-wrap gap-1.5">
                {YEAR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() =>
                      setLocalFilters({
                        ...localFilters,
                        year:
                          localFilters.year === preset.label
                            ? null
                            : preset.label,
                      })
                    }
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${localFilters.year === preset.label
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Minimum Rating: {localFilters.minRating || 0}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={localFilters.minRating || 0}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    minRating: parseFloat(e.target.value) || null,
                  })
                }
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
