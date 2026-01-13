import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
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
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
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
            Account Request
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            RBAC Dashboard
          </h1>
          <p className="mt-4 text-gray-300 max-w-sm leading-relaxed">
            All new accounts are reviewed and role-assigned by administrators.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Internal systems access
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Register
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Request an account
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Standard access is granted by default
          </p>

          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="John Doe"
              />
            </div>

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
                placeholder="john@company.com"
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
              {loading ? "Submitting…" : "Request access"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Already have access?{" "}
            <Link
              to="/login"
              className="text-gray-900 underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-xs text-gray-400 mt-8 leading-relaxed">
            Role assignment is handled by administrators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
