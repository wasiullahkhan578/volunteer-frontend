import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Loader2,
  CheckCircle,
  ArrowRight,
  Info,
  Clock,
  Heart,
  Sparkles,
  Lock,
  X,
  ShieldCheck,
} from "lucide-react";

export default function FindEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joiningId, setJoiningId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // --- Real-Time Search Logic ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) {
        performSearch();
      } else if (searchTerm.length === 0) {
        fetchEvents();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // INTEGRATED: Authenticated Fetch
  const fetchEvents = async () => {
    setLoading(true);
    const token = localStorage.getItem("volunteer_token");
    try {
      const response = await fetch("http://localhost:8080/api/events/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Server responded with error status:", response.status);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/volunteer/search?query=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Search fetch failed:", error);
    }
  };

  const handleJoin = async (eventId) => {
    setJoiningId(eventId);
    const token = localStorage.getItem("volunteer_token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/events/join/${eventId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.text();
      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Application sent! The Organizer will review your mission request.",
        });
        setSelectedEvent(null);
      } else {
        setStatusMessage({ type: "error", text: data });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Connection to mission control failed.",
      });
    } finally {
      setJoiningId(null);
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-teal-400 w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-500/80">
              Active Quest Board
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tighter text-white uppercase italic">
            Global <span className="text-teal-400">Initiatives</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-md">
            Maintain 75% attendance for multi-day missions to unlock your
            verified impact certificate.
          </p>
        </div>

        <div className="relative group flex-1 max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-all" />
          <input
            type="text"
            placeholder="Search by mission, city, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-3xl py-4 pl-14 pr-8 outline-none focus:border-teal-500/50 w-full transition-all backdrop-blur-xl shadow-2xl placeholder:text-slate-600 text-white"
          />
        </div>
      </header>

      <AnimatePresence>
        {statusMessage.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-5 rounded-3xl border flex items-center gap-4 font-bold text-sm shadow-2xl ${
              statusMessage.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-teal-500/10 border-teal-500/30 text-teal-400"
            }`}
          >
            {statusMessage.type === "error" ? (
              <Info size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 gap-6">
          <Loader2 className="animate-spin text-teal-400" size={64} />
          <p className="text-slate-500 animate-pulse uppercase tracking-[0.5em] text-[10px] font-black">
            Syncing Global Database...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer bg-white/5 border border-white/10 rounded-[3rem] p-8 backdrop-blur-md flex flex-col group transition-all hover:border-teal-500/30 shadow-xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-black transition-all duration-500">
                    <Heart size={32} />
                  </div>
                  <div className="bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 flex items-center gap-2">
                    <Users size={16} className="text-teal-500" />
                    <span className="text-xs font-black text-white uppercase tracking-tighter">
                      {event.requiredVolunteers || 0} Slots
                    </span>
                  </div>
                </div>

                <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-teal-400 transition-colors">
                  {event.title}
                </h4>

                <p className="text-slate-400 text-sm mb-8 line-clamp-3 font-light">
                  {event.description ||
                    "Join this mission to contribute to community development."}
                </p>

                <div className="mt-auto space-y-6">
                  <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-8">
                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <MapPin size={16} className="text-teal-400" />
                      <span className="font-bold">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <Calendar size={16} className="text-teal-400" />
                      <span className="font-bold">
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString()
                          : "Date TBD"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Clock size={12} className="text-teal-500" />
                      {event.totalDays || 0} Days
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Sparkles size={12} className="text-teal-500" />
                      {event.category || "General"}
                    </div>
                  </div>

                  <button
                    disabled={!event.registrationOpen}
                    className={`w-full font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all uppercase text-xs tracking-widest ${
                      event.registrationOpen
                        ? "bg-white text-black group-hover:bg-teal-400"
                        : "bg-white/5 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {event.registrationOpen ? (
                      <>
                        View Details <ArrowRight size={18} />
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        Full / Closed <Lock size={14} />
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500 uppercase tracking-widest text-sm">
                No Missions Available
              </p>
            </div>
          )}
        </div>
      )}

      {/* MISSION DETAIL MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-8 lg:p-12 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>

              <div className="flex items-center gap-3 text-teal-400 mb-6">
                <ShieldCheck size={20} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">
                  Verified Mission
                </span>
              </div>

              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tighter">
                {selectedEvent.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-teal-400">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">
                        Location
                      </p>
                      <p className="text-white font-bold">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-teal-400">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">
                        Date & Time
                      </p>
                      <p className="text-white font-bold">
                        {new Date(selectedEvent.eventDate).toLocaleDateString(
                          "en-US",
                          { dateStyle: "full" },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-teal-400">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">
                        Squad Size
                      </p>
                      <p className="text-white font-bold">
                        {selectedEvent.requiredVolunteers} Volunteers needed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-teal-400">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black">
                        Duration
                      </p>
                      <p className="text-white font-bold">
                        {selectedEvent.totalDays} Consecutive Days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                <h5 className="text-lg font-bold text-white">
                  Mission Briefing
                </h5>
                <p className="text-slate-400 leading-relaxed font-light">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleJoin(selectedEvent.id)}
                  disabled={
                    joiningId === selectedEvent.id ||
                    !selectedEvent.registrationOpen
                  }
                  className="flex-1 bg-teal-500 text-black font-black py-5 rounded-2xl uppercase text-xs tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3"
                >
                  {joiningId === selectedEvent.id ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Commit to Mission <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-8 py-5 border border-white/10 text-white rounded-2xl font-bold text-xs uppercase hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
