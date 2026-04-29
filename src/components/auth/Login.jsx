import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Heart,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("VOLUNTEER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const query = new URLSearchParams(location.search);
  const isVerified = query.get("verified") === "true";

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Synchronizing role case for Java Enum
        body: JSON.stringify({ ...formData, role: role.toUpperCase() }),
      });

      // Handle non-200 responses safely to avoid JSON parse errors
      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = "Invalid credentials";

        try {
          const parsed = JSON.parse(errorData);
          errorMessage = parsed.message || errorMessage;
        } catch (e) {
          errorMessage = errorData || `Error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // 1. Critical: Securely store the token
      localStorage.setItem("volunteer_token", data.token);

      // 2. Feedback for users
      setMessage({
        type: "success",
        text: `Welcome back, ${data.firstName}! Initializing ${data.role} Dashboard...`,
      });

      // 3. The "Hard Redirect" Fix:
      // Using window.location.href ensures App.jsx starts fresh and reads the new token.
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error);
      setMessage({
        type: "error",
        text:
          error.message === "Failed to fetch"
            ? "Unable to connect to the security gateway.!"
            : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );
      if (response.ok) {
        setMessage({ type: "success", text: "Reset link sent to your email!" });
        setShowForgotModal(false);
      } else {
        const err = await response.text();
        alert(err);
      }
    } catch (error) {
      alert("System error. Try again later.");
    } finally {
      setForgotLoading(false);
    }
  };

  const themes = {
    VOLUNTEER: {
      hex: "#2dd4bf",
      glow: "shadow-[0_0_20px_rgba(45,212,191,0.3)]",
      btn: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 shadow-teal-500/20",
      border: "focus:border-teal-500 focus:ring-teal-500",
      text: "text-teal-400",
    },
    ORGANIZER: {
      hex: "#ed9d47",
      glow: "shadow-[0_0_20px_rgba(237,157,71,0.3)]",
      btn: "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:shadow-[0_0_20px_#ed9d47] shadow-gold-500/20",
      border: "focus:border-gold-500 focus:ring-gold-500",
      text: "text-gold-500",
    },
    ADMIN: {
      hex: "#a855f7",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      btn: "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 shadow-purple-500/20",
      border: "focus:border-purple-500 focus:ring-purple-500",
      text: "text-purple-400",
    },
  };

  const currentTheme = themes[role];

  return (
    <div className="flex h-screen w-full bg-classic-900 font-sans text-white relative overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-30 transition-colors duration-1000"
          style={{ backgroundColor: currentTheme.hex }}
        ></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Logo */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 group cursor-pointer"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Heart className="w-5 h-5 text-white fill-current" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Volunteer<span className="text-teal-400">Hub</span>
          <span className="text-gold-500">.</span>
        </span>
      </Link>

      <div className="w-full flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div
            className={`bg-classic-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl transition-all duration-500 ${currentTheme.glow}`}
          >
            {/* Feedback Alerts */}
            <AnimatePresence>
              {(isVerified || message.text) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-2xl text-center border ${message.type === "error" ? "bg-red-500/10 border-red-500/30" : "bg-teal-500/10 border-teal-500/30"}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {message.type === "error" ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-teal-400" />
                    )}
                    <p
                      className={`text-sm font-bold ${message.type === "error" ? "text-red-400" : "text-teal-400"}`}
                    >
                      {isVerified && !message.text
                        ? "Email Verified!"
                        : message.text}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Login to access your dashboard
              </p>
            </div>

            {/* Role Toggle */}
            <div className="grid grid-cols-3 bg-black/40 rounded-2xl mb-8 border border-white/5 p-1 relative">
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(33.33%-4px)] rounded-xl z-0"
                style={{ backgroundColor: currentTheme.hex }}
                animate={{
                  x:
                    role === "VOLUNTEER"
                      ? 0
                      : role === "ORGANIZER"
                        ? "100%"
                        : "200%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {["VOLUNTEER", "ORGANIZER", "ADMIN"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="relative z-10 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-white transition-colors"
                >
                  {r === "VOLUNTEER" ? (
                    <Heart className="w-3 h-3" />
                  ) : r === "ORGANIZER" ? (
                    <Briefcase className="w-3 h-3" />
                  ) : (
                    <ShieldCheck className="w-3 h-3" />
                  )}
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block ${currentTheme.text}`}
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-white transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 transition-all ${currentTheme.border}`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className={`text-[10px] font-bold tracking-[0.2em] uppercase block ${currentTheme.text}`}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10px] text-slate-300 hover:text-white uppercase font-bold tracking-tighter transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-white transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 transition-all ${currentTheme.border}`}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className={`w-full font-bold py-4 rounded-2xl shadow-lg mt-4 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white ${currentTheme.btn}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Sign In to Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {role !== "ADMIN" && (
              <p className="text-center text-xs text-slate-500 mt-8 font-medium">
                New to VolunteerHub? <br />
                <Link
                  to="/register"
                  state={{ role }}
                  className={`font-bold hover:underline transition-colors mt-2 inline-block ${currentTheme.text}`}
                >
                  Create a new {role.toLowerCase()} account
                </Link>
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal Overlay */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-classic-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
              <p className="text-sm text-slate-400 mb-6">
                Enter your email and we'll send you a recovery link.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-teal-500 outline-none transition-all"
                  />
                </div>
                <button
                  disabled={forgotLoading}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {forgotLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
