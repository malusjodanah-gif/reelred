import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await signIn(
      email,
      password
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-red-950/20 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/90 shadow-2xl shadow-black/40 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-gradient-to-br from-red-950/80 via-[#171010] to-[#0d0d0d] p-10 lg:flex">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-red-500/20 bg-red-500/10 blur-2xl" />
          <div className="relative">
            <img
              src="/ReelRed-icon.png"
              alt="ReelRed"
              className="h-24 w-24 rounded-3xl object-cover shadow-xl shadow-red-950/40"
            />
            <p className="mt-10 max-w-xs text-4xl font-semibold leading-tight text-white">
              Your next great story starts here.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              Keep track of the films you love and discover something new to watch.
            </p>
          </div>
          <p className="relative text-xs uppercase tracking-[0.24em] text-red-400/80">
            Your personal movie space
          </p>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8 lg:hidden">
            <img
              src="/ReelRed-icon.png"
              alt="ReelRed"
              className="h-16 w-16 rounded-2xl object-cover shadow-lg shadow-red-950/30"
            />
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Sign in to ReelRed
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Pick up where you left off and keep your watchlist growing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm leading-5 text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-white placeholder:text-gray-600 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-white placeholder:text-gray-600 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-red-500 transition hover:text-red-400"
            >
              Create one
            </Link>
          </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;