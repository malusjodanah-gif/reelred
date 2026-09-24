import { useEffect, useState } from "react";
import { FolderPlus, Plus, X } from "lucide-react";

import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function AddToCollectionModal({
  movie,
  onClose,
  onAdded,
}) {
  const { user } = useAuth();

  const [collections, setCollections] =
    useState([]);

  const [selectedCollection, setSelectedCollection] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("collections")
        .select(`
          id,
          name,
          collection_movies (
            id
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const formattedCollections =
        (data || []).map((collection) => ({
          ...collection,
          movieCount:
            collection.collection_movies?.length || 0,
        }));

      setCollections(formattedCollections);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load your collections."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMovie() {
    if (!selectedCollection) {
      setError(
        "Please choose a collection first."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const { error } = await supabase
        .from("collection_movies")
        .insert({
          collection_id:
            Number(selectedCollection),
          tmdb_movie_id: movie.id,
        });

      if (error) {
        if (error.code === "23505") {
          setError(
            "This movie is already in that collection."
          );
          return;
        }

        throw error;
      }

      setSuccess(
        `"${movie.title}" was added to your collection.`
      );

      if (onAdded) {
        onAdded();
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to add this movie. Please try again."
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
              Save Movie
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Add to Collection
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose where you would like to save{" "}
              <span className="text-gray-300">
                {movie.title}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>

        </div>

        <div className="mt-8">

          {loading ? (
            <LoadingSpinner />
          ) : collections.length === 0 ? (

            <div className="rounded-xl border border-dashed border-white/10 px-5 py-8 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10">
                <FolderPlus
                  size={22}
                  className="text-red-500"
                />
              </div>

              <h3 className="mt-4 font-semibold">
                No collections yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create a collection before adding
                movies to your library.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {collections.map(
                (collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() =>
                      setSelectedCollection(
                        String(collection.id)
                      )
                    }
                    className={`
                      w-full
                      rounded-xl
                      border
                      p-4
                      text-left
                      transition
                      ${
                        selectedCollection ===
                        String(collection.id)
                          ? "border-red-600 bg-red-600/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }
                    `}
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="font-medium text-white">
                          {collection.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {collection.movieCount}{" "}
                          {collection.movieCount === 1
                            ? "movie"
                            : "movies"}
                        </p>
                      </div>

                      <div
                        className={`
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded-full
                          border
                          ${
                            selectedCollection ===
                            String(collection.id)
                              ? "border-red-500 bg-red-600"
                              : "border-white/20"
                          }
                        `}
                      >
                        {selectedCollection ===
                          String(collection.id) && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>

                    </div>

                  </button>
                )
              )}

            </div>

          )}

        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleAddMovie}
            disabled={
              saving ||
              loading ||
              collections.length === 0
            }
          >
            <Plus
              size={17}
              className="mr-2 inline"
            />

            {saving
              ? "Adding..."
              : "Add Movie"}
          </Button>

        </div>

      </div>

    </div>
  );
}

export default AddToCollectionModal;