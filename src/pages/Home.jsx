import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Library, Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

import CollectionCard from "../components/CollectionCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCollections();
    }
  }, [user]);

  async function loadCollections() {
    try {
      setLoading(true);

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
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedCollections = (data || []).map(
        (collection) => ({
          ...collection,
          movieCount:
            collection.collection_movies?.length || 0,
        })
      );

      setCollections(formattedCollections);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const firstName =
    user?.user_metadata?.display_name?.split(" ")[0] ||
    "there";

  return (
    <div className="mx-auto max-w-7xl">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/40 via-[#181818] to-[#111111] px-8 py-20 md:px-14 md:py-28">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />

        <div className="relative max-w-3xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            <Sparkles size={15} />
            Your personal movie space
          </div>

          <p className="text-sm font-medium uppercase tracking-wider text-red-500">
            Welcome back, {firstName}
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            Find something
            <span className="text-red-600"> worth watching.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            Discover movies, build collections, save your favourites,
            and get recommendations based on what you already love.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/discover">
              <Button className="w-full sm:w-auto">
                Discover Movies
                <ArrowRight className="ml-2 inline" size={17} />
              </Button>
            </Link>

            <Link to="/collections">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Library className="mr-2 inline" size={17} />
                My Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mt-20">

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-red-500">
              Your library
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Your Collections
            </h2>

            <p className="mt-2 text-gray-400">
              Keep your movies organised your way.
            </p>
          </div>

          <Link
            to="/collections"
            className="hidden items-center gap-2 text-sm text-gray-400 transition hover:text-white sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : collections.length === 0 ? (
          <EmptyState
            title="Your library is empty"
            description="Create your first collection and start adding movies you want to remember."
            buttonText="Create Collection"
            onButtonClick={() => {
              navigate("/collections");
            }}
          />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {collections.slice(0, 3).map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={() =>
                    navigate(`/collections/${collection.id}`)
                  }
                />
          ))}
            </div>

            {collections.length > 3 && (
              <div className="mt-6 text-center">
                <Link
                  to="/collections"
                  className="text-sm text-red-500 hover:text-red-400"
                >
                  View all {collections.length} collections →
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Quick links */}
      <section className="mt-20 grid gap-5 md:grid-cols-2">

        <Link
          to="/discover"
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.05]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
            <Sparkles size={22} />
          </div>

          <h3 className="mt-5 text-xl font-semibold">
            Explore movies
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Search TMDB for movies, explore popular titles,
            and add them to your collections.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-red-500">
            Start discovering
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          to="/recommendations"
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.05]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
            <Library size={22} />
          </div>

          <h3 className="mt-5 text-xl font-semibold">
            Get recommendations
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Discover movies related to the titles already
            saved in your personal library.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-red-500">
            See recommendations
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

      </section>
    </div>
  );
}

export default Home;