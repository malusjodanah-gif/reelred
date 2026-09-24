import { Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { getPosterUrl } from "../services/tmdb";

function MovieCard({
  movie,
  onAdd,
}) {
  const posterUrl = getPosterUrl(
    movie?.poster_path
  );

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#181818] transition duration-300 hover:-translate-y-1 hover:border-red-600/50">

      <Link to={`/movie/${movie.id}`}>

        <div className="relative aspect-[2/3] overflow-hidden bg-white/5">

          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-600">
              No Poster
            </div>
          )}

        </div>

        <div className="p-4">

          <h3 className="truncate font-semibold text-white">
            {movie.title}
          </h3>

          <div className="mt-2 flex items-center justify-between text-sm text-gray-400">

            <span>
              {movie.release_date
                ? movie.release_date.substring(0, 4)
                : "Unknown"}
            </span>

            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <Star
                  size={14}
                  className="fill-yellow-500 text-yellow-500"
                />

                {movie.vote_average.toFixed(1)}
              </span>
            )}

          </div>

        </div>

      </Link>

      {onAdd && (
        <button
          onClick={() => onAdd(movie)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-red-600"
          title="Add to collection"
        >
          <Plus size={18} />
        </button>
      )}

    </div>
  );
}

export default MovieCard;