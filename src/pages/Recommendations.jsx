import { useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

import {
  getMovieDetails,
  getMovieRecommendations,
} from "../services/tmdb";

import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

function Recommendations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [sourceMovies, setSourceMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      generateRecommendations();
    }
  }, [user]);

  async function generateRecommendations() {
    try {
      setLoading(true);
      setError("");

      /*
       * Get all movies saved in the user's collections.
       */
      const { data: savedMovies, error: savedMoviesError } =
        await supabase
          .from("collection_movies")
          .select(`
            tmdb_movie_id,
            collections!inner (
              user_id
            )
          `)
          .eq("collections.user_id", user.id);

      if (savedMoviesError) {
        throw savedMoviesError;
      }

      if (!savedMovies || savedMovies.length === 0) {
        setRecommendations([]);
        setSourceMovies([]);
        return;
      }

      /*
       * Remove duplicate movie IDs.
       */
      const uniqueMovieIds = [
        ...new Set(
          savedMovies.map(
            (movie) => movie.tmdb_movie_id
          )
        ),
      ];

      /*
       * Limit the number of source movies.
       * This keeps API requests reasonable.
       */
      const sourceIds = uniqueMovieIds.slice(0, 5);

      /*
       * Get details for the movies that influenced
       * the recommendations.
       */
      const sourceDetails = await Promise.all(
        sourceIds.map(async (movieId) => {
          try {
            return await getMovieDetails(movieId);
          } catch {
            return null;
          }
        })
      );

      const validSourceMovies = sourceDetails.filter(Boolean);

      setSourceMovies(validSourceMovies);

      /*
       * Get TMDB recommendations for each source movie.
       */
      const recommendationResults =
        await Promise.all(
          sourceIds.map(async (movieId) => {
            try {
              return await getMovieRecommendations(
                movieId
              );
            } catch {
              return { results: [] };
            }
          })
        );

      /*
       * Combine recommendations and count how many
       * source movies recommend each title.
       */
      const recommendationMap = new Map();

      recommendationResults.forEach((result) => {
        (result.results || []).forEach((movie) => {
          if (!movie?.id) return;

          /*
           * Don't recommend something the user already
           * has in their library.
           */
          if (uniqueMovieIds.includes(movie.id)) {
            return;
          }

          if (!recommendationMap.has(movie.id)) {
            recommendationMap.set(movie.id, {
              ...movie,
              recommendationCount: 1,
            });
          } else {
            const existing =
              recommendationMap.get(movie.id);

            recommendationMap.set(movie.id, {
              ...existing,
              recommendationCount:
                existing.recommendationCount + 1,
            });
          }
        });
      });

      /*
       * Convert Map to array and rank results.
       *
       * First priority:
       * how many saved movies led to this recommendation.
       *
       * Second priority:
       * TMDB vote average.
       */
      const rankedRecommendations = [
        ...recommendationMap.values(),
      ]
        .sort((a, b) => {
          if (
            b.recommendationCount !==
            a.recommendationCount
          ) {
            return (
              b.recommendationCount -
              a.recommendationCount
            );
          }

          return (
            (b.vote_average || 0) -
            (a.vote_average || 0)
          );
        })
        .slice(0, 20);

      setRecommendations(rankedRecommendations);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to generate recommendations right now."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-red-500">
            Recommendations
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Finding movies for you...
          </h1>
        </div>

        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">

        <div>
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-red-500">
            <Sparkles size={15} />
            Recommendations
          </div>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Movies you might love
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
            Recommendations are based on movies saved in
            your collections.
          </p>
        </div>

        {sourceMovies.length > 0 && (
          <Button
            variant="secondary"
            onClick={generateRecommendations}
            className="flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCw size={17} />
            Refresh
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty */}
      {sourceMovies.length === 0 ? (
        <EmptyState
          title="Build your library first"
          description="Add some movies to your collections and we'll use them to find recommendations for you."
          buttonText="Discover Movies"
          onButtonClick={() => {
            navigate("/discover");
          }}
        />
      ) : (
        <>
          {/* Based on */}
          <section className="mb-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
                <Sparkles size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Based on your library
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  We used these saved movies to find
                  related recommendations:
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sourceMovies.map((movie) => (
                    <span
                      key={movie.id}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                    >
                      {movie.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Recommendations */}
          {recommendations.length === 0 ? (
            <EmptyState
              title="No recommendations yet"
              description="Try adding a few more movies to your collections. More saved movies give the recommendation system more to work with."
              buttonText="Discover Movies"
              onButtonClick={() => {
                navigate("/discover");
              }}
            />
          ) : (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  Suggested for you
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {recommendations.length} movies found
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {recommendations.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Recommendations;