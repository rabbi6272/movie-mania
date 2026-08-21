import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

import { Movie } from "@/types/movie";

import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

function handleFirebaseError(error: unknown, operation: string) {
  console.error(error);
  const message = error instanceof Error ? error.message : "Unknown error";
  throw new Error(`${operation} failed: ${message}`);
}

// Get all movies
export async function getAllMovies(userID: string) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    const querySnapshot = await getDocs(collection(db, userID));
    const movies: Movie[] = [];
    querySnapshot.forEach((doc) => {
      movies.push({ ...doc.data() as Omit<Movie, "id">, id: doc.id });
    });
    return movies;
  } catch (error) {
    handleFirebaseError(error, "getting movies");
  }
}

// Add a new movie
export async function addMovie(movieData: Omit<Movie, "id">, userID: string) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    await addDoc(collection(db, userID), movieData);
    queryClient.invalidateQueries({ queryKey: ["savedMovies", userID] });
    return {
      success: true,
      message: "Movie added successfully",
    };
  } catch (error) {
    handleFirebaseError(error, "adding movie");
  }
}

// Update movie by ID
export async function updateMovie(movieId: string, updateData: Partial<Movie>, userID: string) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    const movieRef = doc(db, userID, movieId);
    await updateDoc(movieRef, updateData);
    queryClient.invalidateQueries({ queryKey: ["savedMovies", userID] });
    return {
      success: true,
      message: "Movie updated successfully"
    };
  } catch (error) {
    handleFirebaseError(error, "updating movie");
  }
}

// Delete movie by ID
export async function deleteMovie(movieId: string, userID: string) {
  if (!userID) {
    throw new Error("User ID is required");
  }
  try {
    await deleteDoc(doc(db, userID, movieId));
    queryClient.invalidateQueries({ queryKey: ["savedMovies", userID] });
    return {
      success: true,
      message: "Movie deleted successfully",
    };
  } catch (error) {
    handleFirebaseError(error, "deleting movie");
  }
}
