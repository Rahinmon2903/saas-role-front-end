import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("auth", JSON.stringify(res.data));
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl p-8">
        {/* BRAND */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-md bg-blue-600/15 text-blue-400 font-bold flex items-center justify-center">
              RB
            </div>
            <span className="text-sm font-semibold text-neutral-200">
              RBAC Control Panel
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-white">
            Sign in
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Restricted internal access
          </p>
        </div>

        {error && (
          <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md
                         text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="your.work@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md
                         text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md
                       font-medium transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-sm text-neutral-400">
          Need access?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Request an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

