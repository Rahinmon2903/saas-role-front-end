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
      await api.post("/auth/forgot-password", { email });
      toast.success("If the email exists, a reset link has been sent");
    } catch {
      toast.success("If the email exists, a reset link has been sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Reset password
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          A reset link will be sent if the email is registered
        </p>

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

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-400">
          <Link to="/login" className="hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
