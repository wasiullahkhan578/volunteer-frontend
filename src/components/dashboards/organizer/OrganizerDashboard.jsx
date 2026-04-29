import { useState, useEffect } from "react";
import {
  Briefcase,
  Activity,
  CheckCircle,
  Users,
  XCircle,
  MapPin,
  Lock,
  UserCheck,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EventDrillDown from "../admin/EventDrillDown";

export default function OrganizerDashboard({ onMarkAttendance }) {
  // --- States for Stats and Lists ---
  const [stats, setStats] = useState({
    totalEvents: 0,
    liveEvents: 0,
    completed: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeMissions, setActiveMissions] = useState([]);

  // --- States for Full-Screen Drilldown ---
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    title: "",
    data: [],
  });

  const theme = {
    text: "text-gold-500",
    bg: "bg-gold-500",
    activeBg: "bg-gold-500/10",
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const fetchOrganizerData = async () => {
    const token = localStorage.getItem("volunteer_token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // 1. Fetch Organizer-Specific Stats
      const statsRes = await fetch(
        "http://localhost:8080/api/events/organizer/stats",
        { headers },
      );
      const statsData = await statsRes.json();
      setStats({
        totalEvents: statsData.totalEvents || 0,
        liveEvents: statsData.liveEvents || 0,
        completed: statsData.completedCount || 0,
      });

      // 2. Fetch Pending Volunteer Sign-ups for YOUR missions only
      const requestsRes = await fetch(
        "http://localhost:8080/api/events/organizer/pending-volunteers",
        { headers },
      );
      if (requestsRes.ok) setPendingRequests(await requestsRes.json());

      // 3. Fetch INDIVIDUAL Organizer Missions for Lifecycle
      // Changed from /api/events/all to /api/events/my-missions for security
      const liveRes = await fetch(
        "http://localhost:8080/api/events/my-missions",
        {
          headers,
        },
      );
      if (liveRes.ok) {
        const myMissions = await liveRes.json();
        setActiveMissions(myMissions.filter((e) => !e.completed));
      }
    } catch (e) {
      console.error("Data fetch error", e);
    }
  };

  // --- Stats Drilldown Logic ---
  const openStatsDrillDown = async (type) => {
    const token = localStorage.getItem("volunteer_token");
    const endpoint =
      type === "TOTAL"
        ? "http://localhost:8080/api/events/my-missions"
        : "http://localhost:8080/api/events/my-missions?status=active";

    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDetailModal({
      isOpen: true,
      title: type === "TOTAL" ? "Your Total Missions" : "Your Active Quests",
      data,
    });
  };

  const handleParticipation = async (participationId, action) => {
    const token = localStorage.getItem("volunteer_token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/events/participation/${participationId}/${action}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) fetchOrganizerData();
    } catch (e) {
      console.error("Selection update failed", e);
    }
  };

  const handleLifecycle = async (id, action) => {
    const endpoint =
      action === "close"
        ? `/api/organizer/event/${id}/close-registration`
        : `/api/organizer/event/${id}/complete`;

    const res = await fetch(`http://localhost:8080${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
      },
    });
    if (res.ok) fetchOrganizerData();
  };

  return (
    <div className="space-y-12 pb-20">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 text-gold-500">
          Mission Management
        </p>
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Organizer Control Center
        </h1>
      </header>

      {/* GLOBAL STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Missions"
          value={stats.totalEvents}
          icon={<Briefcase />}
          theme={theme}
          onClick={() => openStatsDrillDown("TOTAL")}
        />
        <StatCard
          title="Live Quests"
          value={stats.liveEvents}
          icon={<Activity />}
          theme={theme}
          onClick={() => openStatsDrillDown("LIVE")}
        />
        <StatCard
          title="Success Rate"
          value={`${stats.completed}%`}
          icon={<CheckCircle />}
          theme={theme}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VOLUNTEER SIGN-UPS */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-white">
            <Users className="text-gold-500" /> Track Sign-ups
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center transition-all hover:border-gold-500/30"
                >
                  <div>
                    <p className="font-bold text-white">
                      {req.user?.firstName} {req.user?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {req.user?.email} • for{" "}
                      <span className="text-gold-500">{req.event?.title}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleParticipation(req.id, "approve")}
                      className="p-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500 hover:text-black transition-all"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleParticipation(req.id, "deny")}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-black transition-all"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-sm italic py-4">
                No pending sign-ups currently active.
              </p>
            )}
          </div>
        </div>

        {/* MISSION LIFECYCLE (Filtered to individual organizer) */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-white">
            <CheckCircle className="text-gold-500" /> Mission Lifecycle
          </h3>
          <div className="space-y-4">
            {activeMissions.map((mission) => (
              <div
                key={mission.id}
                className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-gold-500/20 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-bold text-lg text-white block">
                      {mission.title}
                    </span>
                    <div className="flex gap-4 mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {mission.location}
                      </span>
                      <span className="flex items-center gap-1 text-gold-500">
                        <Users size={12} /> {mission.requiredVolunteers} Slots
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onMarkAttendance(mission.id)}
                      className="p-2 bg-gold-500/10 text-gold-500 rounded-xl hover:bg-gold-500 hover:text-black transition-all border border-gold-500/20"
                      title="Verify Daily Attendance"
                    >
                      <UserCheck size={18} />
                    </button>
                    {mission.registrationOpen && (
                      <button
                        onClick={() => handleLifecycle(mission.id, "close")}
                        className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-black transition-all"
                        title="Lock Registration"
                      >
                        <Lock size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleLifecycle(mission.id, "complete")}
                      className="p-2 bg-teal-500/20 text-teal-400 rounded-xl hover:bg-teal-500 hover:text-black transition-all"
                      title="Mark as Success"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FULL SCREEN OVERLAYS --- */}

      {/* 1. DRILLDOWN LIST (Stats Cards) */}
      <AnimatePresence>
        {detailModal.isOpen && (
          <div className="fixed inset-0 z-[150] bg-black flex flex-col m-0 p-0 top-0 left-0">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-zinc-950">
              <h2 className="text-3xl font-bold text-white uppercase italic">
                {detailModal.title}
              </h2>
              <button
                onClick={() =>
                  setDetailModal({ ...detailModal, isOpen: false })
                }
                className="text-white bg-white/10 p-3 rounded-2xl hover:bg-red-500/20"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 bg-zinc-950">
              <div className="max-w-7xl mx-auto space-y-4">
                {detailModal.data.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-gold-500/50 cursor-pointer flex justify-between items-center transition-all"
                  >
                    <div>
                      <p className="text-white font-bold text-2xl tracking-tight">
                        {event.title}
                      </p>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                        {event.location}
                      </p>
                    </div>
                    <span className="text-gold-500 text-[10px] font-black uppercase tracking-widest">
                      View Mission Intel →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. EVENT DETAILS (When clicking from List) */}
      <AnimatePresence>
        {selectedEventId && (
          <EventDrillDown
            eventId={selectedEventId}
            onClose={() => setSelectedEventId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, theme, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`absolute top-0 right-0 p-8 opacity-10 ${theme.text} group-hover:opacity-30 transition-opacity`}
      >
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
        {title}
      </p>
      <h3 className="text-4xl font-bold tracking-tighter text-white italic">
        {value}
      </h3>
    </motion.div>
  );
}
