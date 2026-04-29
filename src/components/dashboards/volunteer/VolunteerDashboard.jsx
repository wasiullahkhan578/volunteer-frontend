import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Activity,
  Award,
  Star,
  Clock,
  MapPin,
  Download,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

export default function VolunteerDashboard() {
  const [userStats, setUserStats] = useState({
    totalEvents: 0,
    totalHours: 0,
    avgAttendance: 0,
  });
  const [myMissions, setMyMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const fetchVolunteerData = async () => {
    const token = localStorage.getItem("volunteer_token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // 1. Fetch Impact Stats (requires /api/users/me endpoint)
      const statsRes = await fetch("http://localhost:8080/api/users/me", {
        headers,
      });
      if (statsRes.ok) {
        const userData = await statsRes.json();
        setUserStats({
          totalEvents: userData.totalEventsAttended || 0,
          totalHours: userData.totalHoursContributed || 0,
          avgAttendance: userData.averageAttendanceRate || 0,
        });
      }

      // 2. Fetch History (requires calculated attendanceRate from backend)
      const historyRes = await fetch(
        "http://localhost:8080/api/events/history",
        {
          headers,
        },
      );
      if (historyRes.ok) {
        setMyMissions(await historyRes.json());
      }
    } catch (e) {
      console.error("Data Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // INTEGRATED: Updated handleFeedback with JSON Body
  const handleFeedback = async (eventId) => {
    const rating = prompt("Rate this mission (1-5 stars):");
    const comment = prompt("Enter your comments:");

    if (!rating || !comment) return;

    const token = localStorage.getItem("volunteer_token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/feedback/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: eventId,
            rating: parseInt(rating),
            comment: comment,
          }),
        },
      );

      if (response.ok) {
        alert("Feedback submitted successfully! Thank you for your input.");
      } else {
        alert("Failed to submit feedback. Ensure the mission is completed.");
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase font-bold text-teal-400">
            Volunteer Portal
          </p>
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Your Community Impact
          </h1>
        </div>
        {/* <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
          <Star className="w-4 h-4 text-gold-500 fill-current" />
          <span className="text-sm font-bold text-white uppercase italic">
            Sector Contributor
          </span>
        </div> */}
      </header>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Missions Joined"
          value={userStats.totalEvents}
          icon={<Heart />}
          theme={{ text: "text-teal-400" }}
        />
        <StatCard
          title="Hours Contributed"
          value={`${userStats.totalHours}h`}
          icon={<Clock />}
          theme={{ text: "text-teal-400" }}
        />
        <StatCard
          title="Avg. Attendance"
          value={`${userStats.avgAttendance}%`}
          icon={<Activity />}
          theme={{ text: "text-teal-400" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MISSION HISTORY SECTION */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-white">
            <Award className="text-teal-400" /> Mission History
          </h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {myMissions.length > 0 ? (
              myMissions.map((part) => (
                <div
                  key={part.id}
                  className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-teal-500/30 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {part.event?.title}
                      </h4>
                      <div className="flex gap-3 mt-1 text-[10px] text-slate-500 font-bold uppercase">
                        <span>
                          <MapPin
                            size={12}
                            className="inline mr-1 text-teal-400"
                          />
                          {part.event?.location}
                        </span>
                        <span className="text-teal-400">
                          <CheckCircle size={12} className="inline mr-1" />
                          {part.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {part.event?.completed && (
                        <button
                          onClick={() => handleFeedback(part.event.id)}
                          className="p-2 bg-gold-500/20 text-gold-500 rounded-lg hover:bg-gold-500 hover:text-black transition-all"
                          title="Rate Event"
                        >
                          <MessageSquare size={16} />
                        </button>
                      )}
                      <CertificationBadge participation={part} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-sm italic">
                No mission records found.
              </p>
            )}
          </div>
        </div>

        {/* SIDEBAR: PROGRESS TRACKER */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-teal-500/20 to-transparent border border-teal-500/20 rounded-[2.5rem] p-8">
            <h4 className="font-bold text-white mb-4">
              Certification Threshold
            </h4>
            <p className="text-xs text-slate-400 mb-6">
              Maintain 75% attendance in multi-day missions to unlock verified
              certificates.
            </p>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${userStats.avgAttendance}%` }}
                className="h-full bg-teal-500 shadow-[0_0_10px_#2dd4bf]"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-right font-bold uppercase tracking-widest">
              Global Avg: {userStats.avgAttendance}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS

function CertificationBadge({ participation }) {
  const isCompleted = participation.event?.completed;
  // logic checks daysAttended vs event.totalDays (Milestone 3 logic)
  const isEligible =
    participation.daysAttended / (participation.event?.totalDays || 1) >= 0.75;

  if (!isCompleted)
    return (
      <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-white/5 text-slate-500 border border-white/10 uppercase tracking-tighter">
        In Progress
      </span>
    );

  return isEligible ? (
    <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-black rounded-xl font-bold text-xs hover:bg-white transition-colors">
      <Download size={14} /> Certificate
    </button>
  ) : (
    <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-400 uppercase tracking-tighter">
      Ineligible
    </span>
  );
}

function StatCard({ title, value, icon, theme }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl"
    >
      <div
        className={`absolute top-0 right-0 p-8 opacity-10 ${theme.text} group-hover:opacity-30 transition-opacity`}
      >
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
        {title}
      </p>
      <h3 className="text-4xl font-bold tracking-tighter text-white">
        {value}
      </h3>
    </motion.div>
  );
}
