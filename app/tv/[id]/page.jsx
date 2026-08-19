"use client";

import { useParams } from "next/navigation";
import { SeparateMoviePage } from "@/components/SeparateMoviePage";

export default function TVDetailPage() {
  const params = useParams();
  const tvId = params.id;

  return <SeparateMoviePage contentId={tvId} mediaType="tv" />;
}
