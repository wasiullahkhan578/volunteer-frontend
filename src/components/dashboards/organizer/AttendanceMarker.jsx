import { useState, useEffect } from "react";
import {
  Check,
  Loader2,
  Save,
  Users,
  CalendarCheck,
  CheckCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AttendanceMarker({ eventId, eventTitle, onComplete }) {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchVolunteers = async () => {
      const token = localStorage.getItem("volunteer_token");
      try {
        // OPTIMIZED: Fetching specific event data instead of all events
        const response = await fetch(
          `http://localhost:8080/api/events/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          const currentEvent = await response.json();

          if (currentEvent && currentEvent.participations) {
            // Map participation status (e.g., APPROVED only)
            setVolunteers(
              currentEvent.participations.map((p) => ({
                participationId: p.id,
                user: p.user,
                present: false, // Default state for daily marking
              })),
            );
          }
        }
      } catch (error) {
        console.error("Backbone Sync Error:", error);
        setStatusMessage({ type: "error", text: "Failed to load squad data." });
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchVolunteers();
  }, [eventId]);

  const toggleAttendance = (pId) => {
    setVolunteers((prev) =>
      prev.map((v) =>
        v.participationId === pId ? { ...v, present: !v.present } : v,
      ),
    );
  };

  const selectAll = () => {
    const allPresent = volunteers.every((v) => v.present);
    setVolunteers(volunteers.map((v) => ({ ...v, present: !allPresent })));
  };

  const submitAttendance = async () => {
    setSaving(true);
    const token = localStorage.getItem("volunteer_token");

    const payload = {
      eventId: eventId,
      records: volunteers.map((v) => ({
        participationId: v.participationId,
        present: v.present,
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/attendance/mark",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Infrastructure synced. Daily records committed.",
        });
        // Delay to allow user to see success message
        setTimeout(() => onComplete(), 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: "Protocol Error. Verification denied.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Connection to system backbone lost.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-gold-500" size={40} />
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          Initializing Squad Data...
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Navigation Row */}
      <button
        onClick={onComplete}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarCheck className="text-gold-500 w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500/80">
                Daily Verification Gate
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
              {eventTitle || "Mission Attendance"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-tight">
              Session Date:{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={selectAll}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-slate-400"
            >
              Toggle Entire Squad
            </button>
            <button
              onClick={submitAttendance}
              disabled={saving || volunteers.length === 0}
              className="flex items-center gap-2 bg-gold-500 text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gold-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-gold-500/20"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Commit Records
            </button>
          </div>
        </div>

        <AnimatePresence>
          {statusMessage.text && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-2xl border flex items-center gap-3 font-bold text-sm ${
                statusMessage.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-gold-500/10 border-gold-500/30 text-gold-500"
              }`}
            >
              {statusMessage.type === "error" ? (
                <Info size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              {statusMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {volunteers.map((vol) => (
            <motion.div
              key={vol.participationId}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleAttendance(vol.participationId)}
              className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex justify-between items-center group ${
                vol.present
                  ? "bg-gold-500/10 border-gold-500/40 shadow-inner"
                  : "bg-white/5 border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                    vol.present
                      ? "bg-gold-500 text-black shadow-lg"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {vol.user.firstName[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-base tracking-tight truncate max-w-[150px]">
                    {vol.user.firstName} {vol.user.lastName}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold truncate max-w-[150px]">
                    {vol.user.email}
                  </p>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${
                  vol.present
                    ? "bg-gold-500 border-gold-500 shadow-lg shadow-gold-500/20"
                    : "border-white/10"
                }`}
              >
                {vol.present && (
                  <Check className="w-5 h-5 text-black stroke-[3px]" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {volunteers.length === 0 && (
          <div className="text-center py-20 bg-black/20 rounded-[2rem] border border-dashed border-white/5">
            <Users className="mx-auto mb-4 text-slate-700" size={40} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              No participation records found for this sector.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
