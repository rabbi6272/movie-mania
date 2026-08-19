"use client";

import { useParams } from "next/navigation";
import { SeparateMoviePage } from "@/components/SeparateMoviePage";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id;

  return <SeparateMoviePage contentId={movieId} mediaType="movie" />;
}
