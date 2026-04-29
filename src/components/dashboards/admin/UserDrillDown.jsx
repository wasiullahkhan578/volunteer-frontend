import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
  Award,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Zap,
} from "lucide-react";

export default function UserDrillDown({ userId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("volunteer_token");
    try {
      // Endpoint updated to match UserController @GetMapping("/user/{id}/details")
      const res = await fetch(
        `http://localhost:8080/api/admin/user/${userId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setDetails(data);
    } catch (error) {
      console.error("Drill-down fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !details) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-classic-900 border border-white/10 w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full z-20"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* --- Profile Summary: Matching User.java Fields --- */}
          <div className="lg:w-1/3 bg-white/5 p-10 border-r border-white/5">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <div className="w-24 h-24 rounded-3xl bg-purple-500/20 flex items-center justify-center text-3xl font-bold text-purple-400 border border-purple-500/30">
                {details.firstName?.[0]}
                {details.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {details.firstName} {details.lastName}
                </h2>
                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                  {details.role} Access
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <InfoRow
                icon={<Mail size={14} />}
                label="Email"
                value={details.email}
              />
              <InfoRow
                icon={<Phone size={14} />}
                label="Mobile"
                value={details.mobile}
              />
              <InfoRow
                icon={<ShieldCheck size={14} />}
                label="Authorization"
                value={
                  details.approved ? "Infrastructure Verified" : "Pending Audit"
                }
              />
              {/* Role-Specific Fields from Backend */}
              {details.role === "VOLUNTEER" && (
                <InfoRow
                  icon={<Zap size={14} />}
                  label="Skills"
                  value={details.skills || "None Listed"}
                />
              )}
            </div>
          </div>

          {/* --- Activity Log: Matching Participation Repository --- */}
          <div className="lg:w-2/3 p-10 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tighter">
              <Award className="text-purple-400" /> System Track Record
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Total Impact
                </p>
                <p className="text-2xl font-bold text-white">
                  {details.totalEventsAttended || 0} Missions
                </p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {details.averageAttendanceRate || 0}%
                </p>
              </div>
            </div>

            {/* Participation History from eventService.getVolunteerHistory */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Real-Time Participation Log
              </p>
              {/* Assuming the backend returns 'participations' list in details */}
              {details.participations?.length > 0 ? (
                details.participations.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all"
                  >
                    <div>
                      <p className="font-bold text-white">
                        {item.event?.title}
                      </p>
                      <div className="flex gap-3 mt-1 text-[10px] text-slate-500 font-bold uppercase">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {item.event?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {item.status}
                        </span>
                      </div>
                    </div>
                    {/* Attendance logic check for 75% */}
                    {item.daysAttended >= item.event?.totalDays * 0.75 ? (
                      <CheckCircle className="text-teal-400" size={20} />
                    ) : (
                      <AlertTriangle className="text-gold-500" size={20} />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No mission data available for this user session.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-2">
        {icon} {label}
      </span>
      <span className="text-sm text-white font-medium truncate">
        {value || "---"}
      </span>
    </div>
  );
}
