import { useEffect, useState } from "react";
import {
  User,
  Library,
  Film,
  MessageSquare,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

function Profile() {
  const {
    user,
    signOut,
  } = useAuth();

  const [stats, setStats] = useState({
    collections: 0,
    movies: 0,
    reviews: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  async function loadStats() {
    try {
      setLoading(true);

      const [
        collectionsResult,
        moviesResult,
        reviewsResult,
      ] = await Promise.all([
        supabase
          .from("collections")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),

        supabase
          .from("collection_movies")
          .select(
            "id, collections!inner(user_id)",
            {
              count: "exact",
              head: true,
            }
          )
          .eq("collections.user_id", user.id),

        supabase
          .from("movie_reviews")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),
      ]);

      setStats({
        collections:
          collectionsResult.count || 0,
        movies:
          moviesResult.count || 0,
        reviews:
          reviewsResult.count || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    const { error } = await signOut();

    if (error) {
      console.error(error);
      return;
    }

    window.location.href = "/login";
  }

  const displayName =
    user?.user_metadata?.display_name ||
    "Movie Lover";

  return (
    <div className="mx-auto max-w-4xl">

      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-red-500">
          Profile
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Your account
        </h1>
      </div>

      {/* Profile card */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-red-600/10 text-red-500">
            <User size={36} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              {displayName}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {user?.email}
            </p>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="mt-6">

        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Library className="text-red-500" size={22} />

            <p className="mt-5 text-3xl font-bold">
              {loading ? "—" : stats.collections}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Collections
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Film className="text-red-500" size={22} />

            <p className="mt-5 text-3xl font-bold">
              {loading ? "—" : stats.movies}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Movies saved
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <MessageSquare className="text-red-500" size={22} />

            <p className="mt-5 text-3xl font-bold">
              {loading ? "—" : stats.reviews}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Reviews
            </p>
          </div>

        </div>
      </section>

      {/* Account */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <h2 className="text-lg font-semibold">
          Account
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Your account is private. Your collections,
          saved movies, and reviews belong only to you.
        </p>

        <div className="mt-6">
          <Button
            variant="danger"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut size={17} />
            Sign Out
          </Button>
        </div>
      </section>

    </div>
  );
}

export default Profile;