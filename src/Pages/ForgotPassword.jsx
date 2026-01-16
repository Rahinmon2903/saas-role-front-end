import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For verifing email and sending data to backend
      await api.post("/auth/forgot-password", { email });
      // Success
      toast.success("If the account exists, a reset link was sent");
    } catch {
      // Error
      toast.success("If the account exists, a reset link was sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <h1 className="text-lg font-semibold text-white mb-2">
          Reset password
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Enter your registered email
        </p>

        <form onSubmit={submit} className="space-y-6">
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
                         text-neutral-200 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md
                       font-semibold tracking-wide transition disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-500 text-center">
          <Link to="/login" className="hover:underline">
            Back to authentication
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

