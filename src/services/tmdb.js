const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function tmdbRequest(endpoint, params = {}) {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}?${searchParams}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data from TMDB.");
  }

  return response.json();
}

export async function searchMovies(query, page = 1) {
  return tmdbRequest("/search/movie", {
    query,
    page,
    include_adult: false,
    language: "en-US",
  });
}

export async function getMovieDetails(movieId) {
  return tmdbRequest(`/movie/${movieId}`, {
    language: "en-US",
  });
}

export async function getMovieRecommendations(
  movieId,
  page = 1
) {
  return tmdbRequest(`/movie/${movieId}/recommendations`, {
    language: "en-US",
    page,
  });
}

export async function getPopularMovies(page = 1) {
  return tmdbRequest("/movie/popular", {
    language: "en-US",
    page,
  });
}

export function getPosterUrl(
  posterPath,
  size = "w500"
) {
  if (!posterPath) {
    return null;
  }

  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}