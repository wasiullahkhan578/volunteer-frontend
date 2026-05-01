import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Heart,
  ArrowRight,
  Loader2,
  Sparkles,
  Globe,
  Phone,
  CreditCard,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Register() {
  const location = useLocation();
  const [role, setRole] = useState("VOLUNTEER");
  const [loading, setLoading] = useState(false);
  // FIX: Initialize as object to prevent rendering errors
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    skills: "",
    volunteerExperience: "",
    aadhar: "",
    organizerExperience: "",
  });

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        "https://volunteer-backend-production-2364.up.railway.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            role: role,
          }),
        },
      );

      // --- UPDATED: Expecting JSON response for Milestone 3 synchronization ---
      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text:
            role === "ORGANIZER"
              ? "Registration received. Verify your email and wait for admin authorization."
              : "Success! Please verify your email to activate your account.",
        });

        // Reset form after successful sync
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          skills: "",
          volunteerExperience: "",
          aadhar: "",
          organizerExperience: "",
        });
      } else {
        // Use the error message sent from AuthService.java
        setMessage({
          type: "error",
          text: data.message || "Registration encountered an error.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Could not establish a connection to the security gateway.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const inputClass = `w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all shadow-inner ${
    role === "VOLUNTEER"
      ? "focus:border-teal-500 focus:ring-teal-500"
      : "focus:border-gold-500 focus:ring-gold-500"
  }`;

  const labelClass = `text-[11px] font-bold tracking-widest uppercase mb-1 block ${
    role === "VOLUNTEER" ? "text-teal-400" : "text-gold-500"
  }`;

  return (
    <div className="flex h-screen w-full bg-classic-900 font-sans text-white relative overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* --- HOME BUTTON (LOGO) --- */}
      <Link
        to="/"
        className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-2 group cursor-pointer"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
          <Heart className="w-4 h-4 text-white fill-current" />
        </div>
        <div className="text-lg font-bold text-white tracking-tight hidden md:block">
          Volunteer<span className="text-teal-400">Hub</span>
          <span className="text-gold-500">.</span>
        </div>
      </Link>

      {/* --- BACKGROUND BLOBS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-[5%] -left-[5%] w-[400px] h-[400px] rounded-full filter blur-[80px] opacity-40 animate-blob mix-blend-screen transition-colors duration-1000 ${role === "VOLUNTEER" ? "bg-teal-500" : "bg-gold-500"}`}
        ></div>
        <div
          className={`absolute top-[20%] -right-[5%] w-[300px] h-[300px] rounded-full filter blur-[80px] opacity-30 animate-blob mix-blend-screen transition-colors duration-1000 ${role === "VOLUNTEER" ? "bg-teal-600" : "bg-gold-400"}`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute -bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full filter blur-[80px] opacity-40 animate-blob mix-blend-screen transition-colors duration-1000 ${role === "VOLUNTEER" ? "bg-teal-700" : "bg-gold-600"}`}
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

      {/* --- LEFT SIDE: Brand Story --- */}
      <div className="hidden lg:flex w-1/2 relative z-10 flex-col justify-center p-12 h-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto"
        >
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border bg-opacity-10 backdrop-blur-md text-sm font-bold mb-8 shadow-[0_0_20px_rgba(23,133,130,0.3)] transition-colors duration-500 ${
              role === "VOLUNTEER"
                ? "border-teal-500/30 bg-teal-500/10 text-teal-300"
                : "border-gold-500/30 bg-gold-500/10 text-gold-300"
            }`}
          >
            <Sparkles
              className={`w-4 h-4 ${role === "VOLUNTEER" ? "text-teal-400" : "text-gold-500"}`}
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={role}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {role === "VOLUNTEER" ? "Join the Force" : "Be The Change"}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <h1 className="text-6xl font-bold leading-tight mb-4 tracking-tight text-white">
            {role === "VOLUNTEER" ? "Become a" : "Register as"} <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r animate-pulse transition-all duration-500 ${role === "VOLUNTEER" ? "from-teal-300 via-white to-teal-500" : "from-gold-300 via-white to-gold-500"}`}
            >
              {role === "VOLUNTEER" ? "Volunteer." : "Organizer."}
            </span>
          </h1>

          <p
            className="text-lg text-slate-300 mb-8 leading-relaxed font-light border-l-4 pl-6 transition-colors duration-500"
            style={{
              borderColor: role === "VOLUNTEER" ? "#2dd4bf" : "#ed9d47",
            }}
          >
            {role === "VOLUNTEER"
              ? "Join the platform that powers the next generation of community leaders. Real-time tracking, verified hours, and global impact."
              : "Streamline your mission with smart event tools, instant volunteer verification, and real-time impact analytics."}
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Globe
                className={`w-6 h-6 mb-2 transition-colors duration-500 ${role === "VOLUNTEER" ? "text-teal-400" : "text-gold-500"}`}
              />
              <span className="text-2xl font-bold text-white block">
                {role === "VOLUNTEER" ? "400+" : "50+"}
              </span>
              <span className="text-xs text-slate-400">
                {role === "VOLUNTEER" ? "Active Volunteers" : "Partner NGOs"}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Heart
                className={`w-6 h-6 mb-2 transition-colors duration-500 ${role === "VOLUNTEER" ? "text-teal-400" : "text-gold-500"}`}
              />
              <span className="text-2xl font-bold text-white block">
                {role === "VOLUNTEER" ? "1k+" : "500+"}
              </span>
              <span className="text-xs text-slate-400">
                {role === "VOLUNTEER" ? "Lives Impacted" : "Events Hosted"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: The Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10 h-full text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          <div className="bg-classic-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl relative overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-2xl">
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-sm text-slate-400">
                Join the elite community of helpers.
              </p>
            </div>

            {/* TOGGLE BUTTONS */}
            <div className="grid grid-cols-2 bg-black/40 rounded-xl mb-8 border border-white/5 p-1 relative shrink-0">
              <motion.div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-lg z-0 ${role === "VOLUNTEER" ? "bg-teal-600 left-1" : "bg-gradient-to-r from-gold-400 to-gold-600 left-[calc(50%+2px)] shadow-[0_0_15px_#ed9d47]"}`}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setRole("VOLUNTEER")}
                className="relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors"
              >
                <Heart className="w-4 h-4" /> Volunteer
              </button>
              <button
                onClick={() => setRole("ORGANIZER")}
                className="relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors"
              >
                <Briefcase className="w-4 h-4" /> Organizer
              </button>
            </div>

            {/* FIX: Improved Alert Rendering */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-xl text-sm font-medium text-center border ${
                    message.type === "error"
                      ? "bg-red-500/10 border-red-500 text-red-400"
                      : "bg-teal-500/10 border-teal-500 text-teal-400"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {message.type === "error" ? (
                      <AlertCircle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {message.text}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <div className="relative group">
                    <User
                      className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${role === "VOLUNTEER" ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-500 group-focus-within:text-gold-500"}`}
                    />
                    <input
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <div className="relative group">
                    <User
                      className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${role === "VOLUNTEER" ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-500 group-focus-within:text-gold-500"}`}
                    />
                    <input
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative group">
                  <Mail
                    className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${role === "VOLUNTEER" ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-500 group-focus-within:text-gold-500"}`}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Mobile Number</label>
                <div className="relative group">
                  <Phone
                    className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${role === "VOLUNTEER" ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-500 group-focus-within:text-gold-500"}`}
                  />
                  <input
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {role === "VOLUNTEER" ? (
                  <motion.div
                    key="vol"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5 overflow-hidden"
                  >
                    <div>
                      <label className={labelClass}>Skills (optional)</label>
                      <div className="relative group">
                        <Star className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-teal-400" />
                        <input
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Teaching, First Aid..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Experience (optional)
                      </label>
                      <div className="relative group">
                        <Globe className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-teal-400" />
                        <input
                          name="volunteerExperience"
                          value={formData.volunteerExperience}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Previous volunteering..."
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="org"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5 overflow-hidden"
                  >
                    <div>
                      <label className={labelClass}>
                        Aadhar Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative group">
                        <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-gold-500" />
                        <input
                          name="aadhar"
                          required
                          value={formData.aadhar}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="XXXX-XXXX-XXXX"
                          maxLength={12}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Org Experience (optional)
                      </label>
                      <div className="relative group">
                        <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-gold-500" />
                        <input
                          name="organizerExperience"
                          value={formData.organizerExperience}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Years of operation..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${role === "VOLUNTEER" ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-500 group-focus-within:text-gold-500"}`}
                    />
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${role === "VOLUNTEER" ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-500 group-focus-within:text-gold-500"}`}
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className={`w-full font-bold py-4 rounded-xl shadow-lg mt-6 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${role === "VOLUNTEER" ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white" : "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-white shadow-[0_0_15px_#ed9d47]"}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {role === "VOLUNTEER"
                      ? "Sign Up as Volunteer"
                      : "Register as Organizer"}{" "}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* --- LOG IN BUTTON --- */}
            <p className="text-center text-xs text-slate-500 mt-6 relative z-10">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ role: role }}
                className={`font-bold hover:underline transition-colors ${
                  role === "VOLUNTEER" ? "text-teal-400" : "text-gold-500"
                }`}
              >
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
