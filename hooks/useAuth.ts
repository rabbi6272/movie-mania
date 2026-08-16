"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore, useMovieStore } from "@/store/store";
import { auth } from "@/utils/db/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AUTH_STORAGE_KEY = "userID";

function getStoredUserID() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

function setStoredUserID(uid: string | null) {
  if (uid) {
    localStorage.setItem(AUTH_STORAGE_KEY, uid);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const userID = useAuthStore((state) => state.userID);
  const setUserID = useAuthStore((state) => state.setUserID);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setSearchQuery = useMovieStore((state) => state.setSearchQuery);
  const setSearchPage = useMovieStore((state) => state.setSearchPage);
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredUserID();
    if (stored && stored !== userID) {
      setUserID(stored);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const savedUser = await signInWithEmailAndPassword(auth, email, password);
    if (!savedUser) {
      toast.error("Login failed");
      return;
    }
    const uid = savedUser.user.uid;
    setUser(savedUser.user);
    setStoredUserID(uid);
    setIsAuthenticated(true);
    setUserID(uid);
  };

  const signup = async (email: string, password: string) => {
    const savedUser = await createUserWithEmailAndPassword(auth, email, password);
    if (!savedUser) {
      toast.error("Signup failed");
      return;
    }
    const userID = savedUser.user.uid;
    setUser(savedUser.user);
    setStoredUserID(userID);
    setIsAuthenticated(true);
    setUserID(userID);
  };

  const logout = () => {
    setUser(null);
    setStoredUserID(null);
    setUserID(null);
    setIsAuthenticated(false);
    setSearchQuery("");
    setSearchPage(1);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return {
    userID,
    isAuthenticated,
    signup,
    login,
    logout,
  };
}
