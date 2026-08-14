"use client";
import { useState } from "react";

import { ttTrailers } from "@/app/ui/fonts";

import { useSearchMovies } from "@/hooks/useSearchMovies";
import { useLocalStorage, useMovieStore } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { query, setQuery } = useSearchMovies();
  return (
    <>
      <SmallNavbar query={query} setQuery={setQuery} />
      <LargeNavbar query={query} setQuery={setQuery} />
    </>
  );
}

function SmallNavbar({ query, setQuery }) {
  const [isOpen, setIsOpen] = useState(false);
  const userID = useLocalStorage((state) => state.userID);
  const setUserID = useLocalStorage((state) => state.setUserID);
  const setSearchedMovies = useMovieStore((state) => state.setSearchedMovies);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);
  const router = useRouter();

  const handleLogout = () => {
    setUserID(null);
    setSearchQuery("");
    setSearchedMovies([]);
    setSearchPage(1);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="sticky top-0 z-50 md:hidden bg-white shadow-md">
      <nav className="relative h-[70px]  w-full flex items-center justify-between px-4 md:px-8 lg:px-14 ">
        <h1
          className={`${ttTrailers.className} italic font-extrabold text-gray-800 text-3xl `}
        >
          <Link href="/">MoviesHub</Link>
        </h1>
        <div className="flex items-center gap-3 text-gray-800">
          {userID ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-white text-[20px]">
                person
              </span>
            </button>
          ) : (
            <Link
              href="/login"
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              title="Login"
            >
              <span className="material-symbols-outlined text-gray-600 text-[20px]">
                person
              </span>
            </Link>
          )}
          <span
            className="material-symbols-outlined "
            onClick={() => setIsOpen(!isOpen)}
          >
            menu
          </span>
        </div>
      </nav>
      {isOpen && (
        <div
          className={`relative w-full pb-2 px-4 ${isOpen ? "show" : "hide"}`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
            className="w-full h-12 rounded-full border border-gray-400 focus:outline focus:outline-blue-400 px-5 text-gray-700 placeholder:text-gray-400"
          />
        </div>
      )}
    </div>
  );
}

function LargeNavbar({ query, setQuery }) {
  const userID = useLocalStorage((state) => state.userID);
  const setUserID = useLocalStorage((state) => state.setUserID);
  const setSearchedMovies = useMovieStore((state) => state.setSearchedMovies);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);
  const router = useRouter();

  const handleLogout = () => {
    setUserID(null);
    setSearchQuery("");
    setSearchedMovies([]);
    setSearchPage(1);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="hidden md:sticky top-0 z-20 h-[70px] bg-white w-full md:flex items-center justify-between md:px-10 lg:px-15 xl:px-20 shadow-md">
      <h1
        className={`${ttTrailers.className} italic font-extrabold text-gray-800 text-3xl `}
      >
        <Link href="/">MoviesHub</Link>
      </h1>
      <div className="flex items-center gap-4 relative w-full justify-end">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="md:w-1/2 lg:w-[45%] xl:w-[35%] h-12 rounded-full border border-gray-400 focus:outline focus:outline-blue-400 px-5 text-gray-700 placeholder:text-gray-400"
        />

        {userID ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-white text-[20px]">
              person
            </span>
          </button>
        ) : (
          <Link
            href="/login"
            className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            title="Login"
          >
            <span className="material-symbols-outlined text-gray-600 text-[20px]">
              person
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
