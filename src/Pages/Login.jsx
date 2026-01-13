import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

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
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between px-16 py-12 bg-gray-900 text-gray-100">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">
            Production · Internal Access
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            RBAC Dashboard
          </h1>
          <p className="mt-4 text-gray-300 max-w-sm leading-relaxed">
            Secure system for managing users, roles, and approvals.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Authorized personnel only
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Sign in
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Continue to dashboard
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Use your assigned credentials
          </p>

          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-md
                         font-medium hover:bg-gray-800 transition
                         disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Proceed"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Need access?{" "}
            <Link
              to="/"
              className="text-gray-900 underline"
            >
              Request an account
            </Link>
          </p>

          <p className="text-xs text-gray-400 mt-8 leading-relaxed">
            Access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

