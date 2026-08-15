"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMovieStore } from "@/store/store";

const AUTH_STORAGE_KEY = "userID";

function getStoredUserID() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

function setStoredUserID(uid) {
  if (uid) {
    localStorage.setItem(AUTH_STORAGE_KEY, uid);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function useAuth() {
  const userID = useMovieStore((state) => state.userID);
  const setUserID = useMovieStore((state) => state.setUserID);
  const setSearchedMovies = useMovieStore((state) => state.setSearchedMovies);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredUserID();
    if (stored && stored !== userID) {
      setUserID(stored);
    }
  }, []);

  const login = (uid) => {
    setStoredUserID(uid);
    setUserID(uid);
  };

  const logout = () => {
    setStoredUserID(null);
    setUserID(null);
    setSearchQuery("");
    setSearchedMovies([]);
    setSearchPage(1);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return {
    userID,
    isAuthenticated: !!userID,
    login,
    logout,
  };
}
