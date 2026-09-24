import { useState } from "react";
import { Film } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10">
            <Film className="text-red-500" size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to continue to ReelRed.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-gray-400">
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
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
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
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-red-600"
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
              className="text-red-500 hover:text-red-400"
            >
              Create one
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;