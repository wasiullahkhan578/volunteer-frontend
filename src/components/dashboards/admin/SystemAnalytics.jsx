import { useState, useEffect } from "react";
import { Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SystemAnalytics() {
  const [data, setData] = useState({
    totalVolunteers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Correctly mapped to UserController @GetMapping("/admin/stats")
        const res = await fetch("http://localhost:8080/api/users/admin/stats", {
          headers: {
            // Required by your JwtAuthenticationFilter
            Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
          },
        });
        const result = await res.json();
        // Result matches your AdminStats.java DTO
        setData(result);
      } catch (error) {
        console.error("Analytics fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return null; // Prevents layout jump

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      <header>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Command Center
        </h2>
        <p className="text-slate-500 text-sm">
          Global infrastructure distribution and growth metrics.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sector Distribution Card */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-purple-500" size={20} /> Sector
            Distribution
          </h3>
          <div className="space-y-6">
            <ProgressBar
              label="Volunteers"
              value={data.totalVolunteers}
              max={100} // Adjusted max for better visual scale
              color="bg-teal-500"
            />
            <ProgressBar
              label="Organizers"
              value={data.totalOrganizers}
              max={50}
              color="bg-purple-500"
            />
            <ProgressBar
              label="Events"
              value={data.totalEvents}
              max={50}
              color="bg-gold-500"
            />
          </div>
        </div>

        {/* System Integrity Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-10 rounded-[3rem]">
          <Zap className="text-purple-500 mb-4" size={32} />
          <h3 className="text-2xl font-black text-white mb-2 uppercase">
            System Integrity
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Infrastructure is currently synchronized across all sectors. All
            2026 security protocols are active for user **Najma Parween**.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-classic-900 bg-slate-800"
                />
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              + Live System Monitoring
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, value, max, color }) {
  // Logic to ensure the bar never exceeds 100%
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{value} Units</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
