export type Movie = {
    id: string;
    title: string;
    description: string;
    releaseDate: string;
    genre: string;
    director: string;
    rating: number;
    posterUrl: string;
    tmdbId?: string;
    media_type?: "movie" | "tv";
    first_air_date?: string;
    poster_path?: string;
    backdrop_path?: string;
    overview?: string;
    vote_average?: number;
    release_date?: string;
    watched?: boolean;
};
