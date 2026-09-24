import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";

import {
  searchMovies,
  getPopularMovies,
} from "../services/tmdb";

function Discover() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPopularMovies();
  }, []);

  async function loadPopularMovies() {
    try {
      setLoading(true);
      setError("");

      const data = await getPopularMovies();

      setMovies(data.results || []);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    if (!search.trim()) {
      loadPopularMovies();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchMovies(search.trim());

      setMovies(data.results || []);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to search for movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-red-500">
          Discover
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Find your next movie
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
          Search through thousands of movies, explore
          what's popular, and build your personal
          collections.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-3xl gap-3"
      >
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search for a movie..."
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              py-3.5
              pl-12
              pr-4
              text-white
              placeholder-gray-500
              outline-none
              transition
              focus:border-red-600
              focus:ring-1
              focus:ring-red-600
            "
          />
        </div>

        <button
          type="submit"
          className="
            rounded-xl
            bg-red-600
            px-6
            font-medium
            text-white
            transition
            hover:bg-red-700
          "
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="mt-12">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="mt-10 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold">
            No movies found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try searching for another movie.
          </p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <section className="mt-16">

          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              {search.trim()
                ? "Search Results"
                : "Popular Movies"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {search.trim()
                ? `Movies matching "${search}"`
                : "Currently popular movies"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>

        </section>
      )}

    </div>
  );
}

export default Discover;