import { useEffect, useState } from "react";
import { Plus, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

import CollectionCard from "../components/CollectionCard";
import CollectionModal from "../components/CollectionModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

function Collections() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadCollections();
    }
  }, [user]);

  async function loadCollections() {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("collections")
        .select(`
          id,
          name,
          description,
          created_at,
          collection_movies (
            id
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Collections error:", error);
        throw error;
      }

      const formatted = (data || []).map(
        (collection) => ({
          id: collection.id,
          name: collection.name,
          description: collection.description,
          created_at: collection.created_at,
          movieCount:
            collection.collection_movies?.length || 0,
        })
      );

      setCollections(formatted);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to load your collections."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCollection(formData) {
    try {
      setError("");

      const { error } = await supabase
        .from("collections")
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          description:
            formData.description?.trim() || null,
        });

      if (error) {
        throw error;
      }

      setShowModal(false);

      await loadCollections();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to create the collection."
      );
    }
  }

  function handleCollectionClick(collection) {
    navigate(`/collections/${collection.id}`);
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-red-500">
            <Library size={15} />
            Your library
          </div>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Collections
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
            Organise the movies you love into personal
            collections.
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 self-start"
        >
          <Plus size={18} />
          Create Collection
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <p className="font-medium">
            Something went wrong
          </p>

          <p className="mt-1 break-words">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <LoadingSpinner />
      ) : collections.length === 0 ? (
        /* Empty state */
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
            <Library
              size={30}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            No collections yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
            Create your first collection and start
            building your personal movie library.
          </p>

          <Button
            onClick={() => setShowModal(true)}
            className="mt-6"
          >
            Create Your First Collection
          </Button>
        </div>
      ) : (
        /* Collection grid */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onClick={() =>
                handleCollectionClick(collection)
              }
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <CollectionModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateCollection}
        />
      )}

    </div>
  );
}

export default Collections;