import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Star,
  Edit3,
  X,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

import { supabase } from "../lib/supabase";
import { getMovieDetails, getPosterUrl } from "../services/tmdb";

function CollectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collection, setCollection] = useState(null);
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingCollection, setEditingCollection] =
    useState(false);

  const [collectionName, setCollectionName] =
    useState("");

  const [collectionDescription, setCollectionDescription] =
    useState("");

  const [reviewMovie, setReviewMovie] = useState(null);

  const [deleteMovie, setDeleteMovie] =
    useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCollection();
  }, [id]);

  async function loadCollection() {
    try {
      setLoading(true);
      setError("");

      const {
        data: collectionData,
        error: collectionError,
      } = await supabase
        .from("collections")
        .select(
          "id, name, description, created_at"
        )
        .eq("id", id)
        .single();

      if (collectionError) {
        throw collectionError;
      }

      setCollection(collectionData);

      setCollectionName(collectionData.name);
      setCollectionDescription(
        collectionData.description || ""
      );

      const {
        data: collectionMovies,
        error: moviesError,
      } = await supabase
        .from("collection_movies")
        .select(`
          id,
          tmdb_movie_id,
          added_at,
          movie_reviews (
            id,
            rating,
            review,
            created_at,
            updated_at
          )
        `)
        .eq("collection_id", id)
        .order("added_at", {
          ascending: false,
        });

      if (moviesError) {
        throw moviesError;
      }

      const movieDetails = await Promise.all(
        (collectionMovies || []).map(
          async (item) => {
            try {
              const movie =
                await getMovieDetails(
                  item.tmdb_movie_id
                );

              return {
                ...item,
                movie,
                review:
                  item.movie_reviews?.[0] || null,
              };
            } catch (error) {
              console.error(
                `Failed to load movie ${item.tmdb_movie_id}`,
                error
              );

              return {
                ...item,
                movie: null,
                review:
                  item.movie_reviews?.[0] || null,
              };
            }
          }
        )
      );

      setMovies(movieDetails);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load this collection."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCollection(event) {
    event.preventDefault();

    if (!collectionName.trim()) {
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from("collections")
        .update({
          name: collectionName.trim(),
          description:
            collectionDescription.trim() || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCollection(data);
      setEditingCollection(false);
    } catch (error) {
      console.error(error);
      alert(
        "Unable to update the collection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCollection() {
    const confirmed = window.confirm(
      `Delete "${collection.name}"? This will also remove the movies saved in this collection.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      navigate("/collections");
    } catch (error) {
      console.error(error);

      alert(
        "Unable to delete the collection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMovie() {
    if (!deleteMovie) {
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("collection_movies")
        .delete()
        .eq("id", deleteMovie.id);

      if (error) {
        throw error;
      }

      setMovies((current) =>
        current.filter(
          (item) =>
            item.id !== deleteMovie.id
        )
      );

      setDeleteMovie(null);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to remove this movie."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !collection) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h1 className="text-2xl font-bold">
          Collection not found
        </h1>

        <p className="mt-3 text-gray-500">
          This collection may have been deleted.
        </p>

        <Link
          to="/collections"
          className="mt-6 inline-block text-red-500"
        >
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      <Link
        to="/collections"
        className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to Collections
      </Link>

      <div className="mt-10 flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-red-500">
            Collection
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
              {collection.description}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-500">
            {movies.length}{" "}
            {movies.length === 1
              ? "movie"
              : "movies"}
          </p>
        </div>

        <div className="flex gap-3">

          <Button
            variant="secondary"
            onClick={() =>
              setEditingCollection(true)
            }
          >
            <Edit3
              size={17}
              className="mr-2 inline"
            />
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteCollection}
          >
            <Trash2
              size={17}
              className="mr-2 inline"
            />
            Delete
          </Button>

        </div>

      </div>

      {movies.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">

          <h2 className="text-xl font-semibold">
            This collection is empty
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Discover movies and add them to this
            collection to start building your library.
          </p>

          <Link
            to="/discover"
            className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium transition hover:bg-red-700"
          >
            Discover Movies
          </Link>

        </div>
      ) : (

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {movies.map((item) => (
            <CollectionMovieCard
              key={item.id}
              item={item}
              onReview={() =>
                setReviewMovie(item)
              }
              onDelete={() =>
                setDeleteMovie(item)
              }
            />
          ))}

        </div>

      )}

      {editingCollection && (
        <EditCollectionModal
          name={collectionName}
          description={collectionDescription}
          setName={setCollectionName}
          setDescription={
            setCollectionDescription
          }
          onClose={() =>
            setEditingCollection(false)
          }
          onSave={handleSaveCollection}
          saving={saving}
        />
      )}

      {reviewMovie && (
        <ReviewModal
          item={reviewMovie}
          onClose={() =>
            setReviewMovie(null)
          }
          onSaved={() => {
            setReviewMovie(null);
            loadCollection();
          }}
        />
      )}

      {deleteMovie && (
        <ConfirmModal
          title="Remove Movie?"
          description={`Remove "${deleteMovie.movie?.title}" from this collection?`}
          onCancel={() =>
            setDeleteMovie(null)
          }
          onConfirm={handleDeleteMovie}
          saving={saving}
        />
      )}

    </div>
  );
}

function CollectionMovieCard({
  item,
  onReview,
  onDelete,
}) {
  const movie = item.movie;

  if (!movie) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm text-gray-500">
          Movie information unavailable.
        </p>

        <button
          onClick={onDelete}
          className="mt-4 text-sm text-red-500"
        >
          Remove
        </button>
      </div>
    );
  }

  const posterUrl = getPosterUrl(
    movie.poster_path
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#181818]">

      <Link to={`/movie/${movie.id}`}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="aspect-[2/3] w-full object-cover transition duration-500 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-[2/3] items-center justify-center bg-white/5 text-gray-500">
            No Poster
          </div>
        )}
      </Link>

      <div className="p-5">

        <Link to={`/movie/${movie.id}`}>
          <h2 className="truncate font-semibold text-white hover:text-red-500">
            {movie.title}
          </h2>
        </Link>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">

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

        <div className="mt-5 border-t border-white/10 pt-4">

          {item.review ? (
            <button
              onClick={onReview}
              className="w-full text-left"
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={15}
                      className={
                        star <=
                        item.review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-700"
                      }
                    />
                  )
                )}
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                {item.review.review ||
                  "No written review."}
              </p>

              <p className="mt-2 text-xs text-red-500">
                Edit review
              </p>
            </button>
          ) : (
            <button
              onClick={onReview}
              className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-gray-400 transition hover:border-red-600/50 hover:text-white"
            >
              <Star size={16} />
              Add Review
            </button>
          )}

        </div>

        <button
          onClick={onDelete}
          className="mt-4 flex w-full items-center justify-center gap-2 text-xs text-gray-600 transition hover:text-red-500"
        >
          <Trash2 size={14} />
          Remove from collection
        </button>

      </div>

    </div>
  );
}

function ReviewModal({
  item,
  onClose,
  onSaved,
}) {
  const [rating, setRating] = useState(
    item.review?.rating || 0
  );

  const [review, setReview] = useState(
    item.review?.review || ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (rating === 0) {
      setError(
        "Please choose a rating from 1 to 5 stars."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (item.review) {
        const { error } = await supabase
          .from("movie_reviews")
          .update({
            rating,
            review: review.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.review.id);

        if (error) {
          throw error;
        }
      } else {
        const { data: userData } =
          await supabase.auth.getUser();

        const user = userData.user;

        const { error } = await supabase
          .from("movie_reviews")
          .insert({
            collection_movie_id: item.id,
            user_id: user.id,
            rating,
            review: review.trim() || null,
          });

        if (error) {
          throw error;
        }
      }

      onSaved();
    } catch (error) {
      console.error(error);

      setError(
        "Unable to save your review. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteReview() {
    if (!item.review) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("movie_reviews")
        .delete()
        .eq("id", item.review.id);

      if (error) {
        throw error;
      }

      onSaved();
    } catch (error) {
      console.error(error);

      setError(
        "Unable to delete the review."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl">

        <div className="flex items-start justify-between">

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-red-500">
              Your Review
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {item.movie?.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        <div className="mt-8">

          <p className="text-sm font-medium text-gray-300">
            Your rating
          </p>

          <div className="mt-3 flex gap-2">

            {[1, 2, 3, 4, 5].map(
              (star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  className="transition hover:scale-110"
                  aria-label={`${star} stars`}
                >
                  <Star
                    size={30}
                    className={
                      star <= rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-600"
                    }
                  />
                </button>
              )
            )}

          </div>

        </div>

        <div className="mt-7">

          <label
            htmlFor="movie-review"
            className="text-sm font-medium text-gray-300"
          >
            Your review
          </label>

          <textarea
            id="movie-review"
            value={review}
            onChange={(event) =>
              setReview(event.target.value)
            }
            maxLength={1000}
            rows={6}
            placeholder="What did you think about this movie?"
            className="
              mt-2
              w-full
              resize-none
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              text-white
              placeholder-gray-600
              outline-none
              transition
              focus:border-red-600
              focus:ring-1
              focus:ring-red-600
            "
          />

          <p className="mt-2 text-right text-xs text-gray-600">
            {review.length}/1000
          </p>

        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">

          {item.review ? (
            <Button
              variant="danger"
              onClick={handleDeleteReview}
              disabled={saving}
            >
              <Trash2
                size={16}
                className="mr-2 inline"
              />
              Delete Review
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">

            <Button
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Review"}
            </Button>

          </div>

        </div>

      </div>

    </div>
  );
}

function EditCollectionModal({
  name,
  description,
  setName,
  setDescription,
  onClose,
  onSave,
  saving,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <form
        onSubmit={onSave}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl"
      >

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Edit Collection
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            <X />
          </button>

        </div>

        <div className="mt-7 space-y-5">

          <div>
            <label className="text-sm text-gray-300">
              Collection name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={80}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={250}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

        </div>

        <div className="mt-7 flex justify-end gap-3 border-t border-white/10 pt-6">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>

        </div>

      </form>

    </div>
  );
}

function ConfirmModal({
  title,
  description,
  onCancel,
  onConfirm,
  saving,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-2xl">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {description}
        </p>

        <div className="mt-7 flex justify-end gap-3 border-t border-white/10 pt-6">

          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={saving}
          >
            {saving
              ? "Removing..."
              : "Remove"}
          </Button>

        </div>

      </div>

    </div>
  );
}

export default CollectionDetails;