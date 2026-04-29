import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Award,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ParticipationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("volunteer_token");
    try {
      // Milestone 3: Updated endpoint to fetch detailed participation including attendance
      const response = await fetch("http://localhost:8080/api/events/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to withdraw? The organizer will be notified.",
      )
    )
      return;

    setCancellingId(eventId);
    const token = localStorage.getItem("volunteer_token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/events/cancel/${eventId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        setHistory((prev) =>
          prev.map((item) =>
            item.event.id === eventId ? { ...item, status: "CANCELLED" } : item,
          ),
        );
      } else {
        const errorMsg = await response.text();
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Cancellation error:", error);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACCEPTED":
      case "ATTENDED":
        return "text-teal-400 bg-teal-500/10 border-teal-500/20";
      case "CANCELLED":
      case "DENIED":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "PENDING":
        return "text-gold-500 bg-gold-500/10 border-gold-500/20";
      default:
        return "text-slate-400 bg-white/5 border-white/10";
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-teal-400" size={32} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
          Retrieving Records...
        </p>
      </div>
    );

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Quest Log
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Track your community engagement and certification eligibility.
          </p>
        </div>
        <div className="bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <Award className="w-4 h-4 text-teal-400" />
          <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">
            Verified History
          </span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="px-6 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                Mission
              </th>
              <th className="px-6 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                Timeline
              </th>
              <th className="px-6 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-center">
                Attendance
              </th>
              <th className="px-6 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                Status
              </th>
              <th className="px-6 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="group transition-all">
                <td className="bg-white/5 first:rounded-l-2xl px-6 py-5 border-y border-l border-white/5 group-hover:bg-white/[0.08] group-hover:border-white/10 transition-colors">
                  <div className="font-bold text-sm text-white group-hover:text-teal-400 transition-colors">
                    {item.event.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">
                    {item.event.location}
                  </div>
                </td>
                <td className="bg-white/5 px-6 py-5 border-y border-white/5 group-hover:bg-white/[0.08] group-hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <Calendar size={12} className="text-slate-500" />
                    {new Date(item.event.eventDate).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )}
                  </div>
                </td>
                <td className="bg-white/5 px-6 py-5 border-y border-white/5 group-hover:bg-white/[0.08] group-hover:border-white/10 transition-colors">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.attendanceRate || 0}%` }}
                        className={`h-full ${(item.attendanceRate || 0) >= 75 ? "bg-teal-500" : "bg-gold-500"}`}
                      />
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase ${(item.attendanceRate || 0) >= 75 ? "text-teal-400" : "text-slate-500"}`}
                    >
                      {item.attendanceRate || 0}% Score
                    </span>
                  </div>
                </td>
                <td className="bg-white/5 px-6 py-5 border-y border-white/5 group-hover:bg-white/[0.08] group-hover:border-white/10 transition-colors">
                  <span
                    className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-tighter ${getStatusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="bg-white/5 last:rounded-r-2xl px-6 py-5 border-y border-r border-white/5 text-right group-hover:bg-white/[0.08] group-hover:border-white/10 transition-colors">
                  {item.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(item.event.id)}
                      disabled={cancellingId === item.event.id}
                      className="text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {cancellingId === item.event.id
                        ? "SYNCING..."
                        : "WITHDRAW"}
                    </button>
                  )}
                  {item.status === "ACCEPTED" && (
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest cursor-default">
                      Committed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && (
          <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/5 mt-4">
            <Clock className="mx-auto mb-4 text-slate-700" size={32} />
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              No active quests found in your history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
