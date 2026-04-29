import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Heart,
} from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            newPassword: formData.password,
          }),
        },
      );

      const data = await response.json(); // Matches your Updated AuthController

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Security credentials updated! Redirecting to login...",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Link expired or invalid.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Connection failed. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-classic-900 items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-teal-400" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter">
            New Credentials
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">
            Secure Your Account
          </p>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-2 ${
                message.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-teal-500/10 border-teal-500/30 text-teal-400"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle size={16} />
              ) : (
                <CheckCircle size={16} />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              New Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400"
                size={18}
              />
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-teal-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400"
                size={18}
              />
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-teal-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Update Credentials"
            )}
          </button>
        </form>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-slate-500 hover:text-white mt-8 text-xs font-bold transition-all uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </motion.div>
    </div>
  );
}
