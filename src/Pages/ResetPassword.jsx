import { useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  sending data to backend
      await api.post(`/auth/reset-password/${token}`, { password });
      // Success
      toast.success("Password updated");
      navigate("/login");
    } catch (err) {
      // Error
      toast.error(
        err.response?.data?.message || "Reset link expired or invalid"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <h1 className="text-lg font-semibold text-white mb-8">
          Set new password
        </h1>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              New password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-md
                         text-neutral-200 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md
                       font-semibold tracking-wide transition disabled:opacity-60"
          >
            {loading ? "Updating…" : "Confirm password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

