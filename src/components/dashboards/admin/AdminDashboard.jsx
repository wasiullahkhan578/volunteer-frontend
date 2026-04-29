import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Heart,
  Award,
  X,
  Mail,
  CheckCircle,
  Trash2,
  Zap,
  AlertCircle,
  Phone,
  ShieldCheck,
  Star,
  Activity,
  UserCheck,
  MapPin,
} from "lucide-react";

import UserDrillDown from "./UserDrillDown";
import EventDrillDown from "./EventDrillDown";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    organizers: 0,
    volunteers: 0,
    events: 0,
  });
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null); // Tracks specific event details
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    title: "",
    data: [],
    roleType: "",
  });
  const theme = { text: "text-purple-400", bg: "bg-purple-500" };

  useEffect(() => {
    fetchStats();
    fetchPendingAudits();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
        },
      });
      const data = await res.json();
      setStats({
        organizers: data.totalOrganizers,
        volunteers: data.totalVolunteers,
        events: data.totalEvents,
      });
    } catch (error) {
      console.error("Stats sync failed", error);
    }
  };

  const fetchPendingAudits = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/users/admin/users/ORGANIZER",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
          },
        },
      );
      const data = await res.json();
      setPendingOrganizers(data.filter((user) => !user.approved));
    } catch (error) {
      console.error("Pending fetch failed", error);
    }
  };

  const openDrillDown = async (roleType) => {
    try {
      // Integration: If roleType is EVENT, fetch from events endpoint
      const endpoint =
        roleType === "EVENT"
          ? "http://localhost:8080/api/events/all"
          : `http://localhost:8080/api/users/admin/users/${roleType}`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
        },
      });
      const data = await res.json();
      setDetailModal({
        isOpen: true,
        title: roleType === "EVENT" ? "System-Wide Missions" : `${roleType}s`,
        data,
        roleType,
      });
    } catch (error) {
      console.error("Drill-down failed", error);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Authorize this Organizer for system access?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/admin/approve/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
          },
        },
      );
      if (res.ok) {
        fetchStats();
        fetchPendingAudits();
        if (detailModal.isOpen) openDrillDown(detailModal.roleType);
      }
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 text-purple-400">
            Superior Access
          </p>
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Admin Panel
          </h1>
        </div>
      </header>

      {/* PRIMARY SECTION: PENDING ORGANIZER APPROVALS */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
          <UserCheck className="text-purple-400" size={24} />
          Organizer Approval Requests
          <span className="text-[10px] bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full uppercase tracking-widest">
            {pendingOrganizers.length} Pending
          </span>
        </h3>

        {pendingOrganizers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingOrganizers.map((org) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedUserId(org.id)}
                className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all flex justify-between items-center group shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">
                    {org.firstName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">
                      {org.firstName} {org.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                      <Mail size={12} /> {org.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(org.id);
                  }}
                  className="bg-purple-500 text-black px-5 py-2 rounded-xl font-bold text-[10px] uppercase hover:bg-white transition-all shadow-lg shadow-purple-500/20"
                >
                  Authorize
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl">
            <CheckCircle className="mx-auto mb-4 text-slate-800" size={40} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              All organizer accounts are currently verified.
            </p>
          </div>
        )}
      </div>

      {/* SECONDARY SECTION: GLOBAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Authorized Organizers"
          value={stats.organizers}
          icon={<ShieldCheck />}
          theme={theme}
          onClick={() => openDrillDown("ORGANIZER")}
        />
        <StatCard
          title="Verified Volunteers"
          value={stats.volunteers}
          icon={<Heart />}
          theme={theme}
          onClick={() => openDrillDown("VOLUNTEER")}
        />
        <StatCard
          title="System-Wide Missions"
          value={stats.events}
          icon={<Activity />}
          theme={theme}
          onClick={() => openDrillDown("EVENT")} // Integration Point
        />
      </div>

      {/* MAIN OVERLAY: Lists (Z-100) */}
      <AnimatePresence>
        {detailModal.isOpen && (
          <DrillDownModal
            title={detailModal.title}
            data={detailModal.data}
            roleType={detailModal.roleType}
            onApprove={handleApprove}
            onUserClick={(id) => {
              // If it's the Mission list, open Event details. Else open User details.
              if (detailModal.roleType === "EVENT") setSelectedEventId(id);
              else setSelectedUserId(id);
            }}
            onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
          />
        )}
      </AnimatePresence>

      {/* TOP OVERLAY: Specific Details (Z-110) */}
      <AnimatePresence>
        {selectedUserId && (
          <UserDrillDown
            userId={selectedUserId}
            onClose={() => setSelectedUserId(null)}
          />
        )}
      </AnimatePresence>

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
      className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group cursor-pointer hover:bg-white/[0.08] transition-all shadow-xl"
    >
      <div
        className={`absolute top-0 right-0 p-8 opacity-10 ${theme.text} group-hover:opacity-30 transition-opacity group-hover:rotate-12`}
      >
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
        {title}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-bold tracking-tighter text-white">
          {value}
        </h3>
        <Zap size={14} className="text-purple-500 animate-pulse" />
      </div>
    </motion.div>
  );
}

function DrillDownModal({
  title,
  data,
  onClose,
  onApprove,
  onUserClick,
  roleType,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-0 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-classic-900 border border-white/10 w-full h-full max-w-7xl rounded-none md:rounded-[3rem] p-10 overflow-hidden flex flex-col relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-tighter flex items-center gap-3">
          {title}{" "}
          <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-slate-400">
            {data.length}
          </span>
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => onUserClick(item.id)}
              className="p-6 bg-white/5 rounded-3xl border border-white/5 transition-all group hover:border-purple-500/30 cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">
                  {roleType === "EVENT" ? (
                    <Activity size={20} />
                  ) : (
                    item.firstName?.[0]
                  )}
                </div>
                <div>
                  <p className="font-bold text-xl text-white">
                    {roleType === "EVENT"
                      ? item.title
                      : `${item.firstName} ${item.lastName}`}
                  </p>
                  <div className="flex gap-4 mt-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      {roleType === "EVENT" ? (
                        <MapPin size={12} />
                      ) : (
                        <Mail size={12} />
                      )}
                      {roleType === "EVENT" ? item.location : item.email}
                    </span>
                    {roleType !== "EVENT" && (
                      <span
                        className={`flex items-center gap-1 ${item.approved ? "text-teal-400" : "text-amber-500"}`}
                      >
                        {item.approved ? "Verified" : "Pending Audit"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {roleType === "ORGANIZER" && !item.approved && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove(item.id);
                  }}
                  className="bg-purple-500 text-black px-6 py-2 rounded-xl font-bold text-[10px] uppercase hover:bg-white transition-all shadow-lg"
                >
                  Authorize Access
                </button>
              )}

              {roleType === "EVENT" && (
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                  View Mission details →
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
