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
      toast.success("Authenticated");
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-white mb-6">
          Authenticate
        </h1>

        {error && (
          <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-md
                       text-neutral-200 focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-md
                       text-neutral-200 focus:ring-2 focus:ring-blue-600"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
          >
            {loading ? "Verifying…" : "Authenticate"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm text-neutral-400">
          <Link to="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
          <Link to="/" className="text-blue-400 hover:underline">
            Request access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


