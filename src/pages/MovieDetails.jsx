import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import AddToCollectionModal from "../components/AddToCollectionModal";
import { getMovieDetails, getPosterUrl } from "../services/tmdb";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCollectionModal, setShowCollectionModal] =
  useState(false);

  useEffect(() => {
    loadMovie();
  }, [id]);

  async function loadMovie() {
    try {
      setLoading(true);
      setError("");

      const data = await getMovieDetails(id);

      setMovie(data);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load this movie. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <h1 className="text-2xl font-bold">
          Movie not found
        </h1>

        <p className="mt-3 text-gray-500">
          We couldn't load this movie.
        </p>

        <Link
          to="/discover"
          className="mt-6 inline-block text-red-500 hover:text-red-400"
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  const posterUrl = getPosterUrl(
    movie.poster_path,
    "w500"
  );

  return (
    <div className="mx-auto max-w-6xl">

      <Link
        to="/discover"
        className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Discover
      </Link>

      <div className="grid gap-10 md:grid-cols-[280px_1fr]">

        <div>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center rounded-2xl bg-white/5 text-gray-500">
              No Poster
            </div>
          )}
        </div>

        <div className="py-2">

          <p className="text-sm font-medium uppercase tracking-wider text-red-500">
            Movie Details
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="mt-4 text-lg italic text-gray-500">
              "{movie.tagline}"
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-gray-400">

            {movie.release_date && (
              <span className="flex items-center gap-2">
                <Calendar size={17} />
                {movie.release_date.substring(0, 4)}
              </span>
            )}

            {movie.vote_average > 0 && (
              <span className="flex items-center gap-2">
                <Star
                  size={17}
                  className="fill-yellow-500 text-yellow-500"
                />

                {movie.vote_average.toFixed(1)}
              </span>
            )}

            {movie.runtime && (
              <span>
                {movie.runtime} min
              </span>
            )}

          </div>

          {movie.genres?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              Overview
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-gray-400">
              {movie.overview ||
                "No overview is available for this movie."}
            </p>
          </div>

          <div className="mt-10">
            <Button
              onClick={() => setShowCollectionModal(true)

              }
            >
              Add to Collection
            </Button>
          </div>

        </div>

      </div>
        {showCollectionModal && (
          <AddToCollectionModal
            movie={movie}
            onClose={() =>
              setShowCollectionModal(false)
            }
          />
        )}
    </div>
  );
}

export default MovieDetails;