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
      await api.post("/auth/register", { name, email, password });
      toast.success("Access request submitted");
      navigate("/login");
    } catch {
      setError("Unable to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-neutral-950">
      {/* LEFT — SYSTEM PANEL */}
      <div className="hidden lg:flex flex-col px-20 py-16 bg-neutral-900 border-r border-neutral-800">
        <div className="space-y-14">
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-600/20 text-blue-400 font-semibold flex items-center justify-center">
              RB
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-200">
                RBAC Control
              </p>
              <p className="text-xs text-neutral-500">
                Authorization System
              </p>
            </div>
          </div>

          <div className="h-px bg-neutral-800 w-28" />

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-semibold text-neutral-100 tracking-tight">
              Access Request
            </h1>
            <p className="mt-3 text-sm text-neutral-500 max-w-sm">
              Administrative approval required
            </p>
          </div>
        </div>

        {/* FOOTER META */}
        <div className="mt-auto pt-8 border-t border-neutral-800 text-xs text-neutral-600">
          Requests are logged · Reviewed by administrators
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
            <h2 className="text-lg font-semibold text-white mb-8">
              Request access
            </h2>

            {error && (
              <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              {/* NAME */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-md
                             text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Work email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-md
                             text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-md
                             text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md
                           font-semibold tracking-wide transition disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit for approval"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-sm text-neutral-500 text-center">
            Already approved?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Authenticate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


