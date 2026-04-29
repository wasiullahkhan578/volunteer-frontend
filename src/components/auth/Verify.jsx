import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Heart } from "lucide-react";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        navigate("/register?error=missing_token");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/auth/verify?token=${token}`,
        );

        if (response.ok) {
          // Milestone 3: Redirect to login with success flag handled by Login.jsx
          navigate("/login?verified=true");
        } else {
          // Redirect to register with an error flag
          navigate("/register?error=invalid_token");
        }
      } catch (err) {
        console.error("Verification connection failed", err);
        navigate("/register?error=server_error");
      }
    };

    // Short delay to allow the animation to play
    const timeout = setTimeout(verifyAccount, 2000);
    return () => clearTimeout(timeout);
  }, [token, navigate]);

  return (
    <div className="h-screen bg-classic-900 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Aesthetic to match Home/Login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-[120px] opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/20 animate-pulse">
          <Heart className="w-8 h-8 text-white fill-current" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tighter mb-2">
            Authenticating Portal
          </h2>
          <div className="flex items-center justify-center gap-3 text-slate-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
            <p className="text-sm uppercase tracking-widest">
              Verifying your identity...
            </p>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 text-[10px] uppercase tracking-[0.4em] text-slate-600 font-bold">
        Volunteer<span className="text-teal-500/50">Hub</span> Secure
        Verification
      </div>
    </div>
  );
}
