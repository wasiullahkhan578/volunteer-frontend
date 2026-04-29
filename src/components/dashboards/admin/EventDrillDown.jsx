import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  MapPin,
  Users,
  Calendar,
  Info,
  ShieldCheck,
  User,
  CheckCircle2,
} from "lucide-react";

export default function EventDrillDown({ eventId, onClose }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
          },
        });
        const data = await res.json();
        setEvent(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [eventId]);

  if (loading || !event) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black p-0 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-classic-900 border border-white/10 w-full h-full max-w-6xl rounded-none md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-10 right-10 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full"
        >
          <X size={24} />
        </button>

        <header className="mb-10">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">
            Mission Intelligence Report
          </span>
          <h2 className="text-5xl font-bold text-white tracking-tighter mt-2 italic uppercase">
            {event.title}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT COLUMN: MISSION DATA */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                  <Info size={14} /> Mission Briefing
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="space-y-6 px-2">
                <DataRow
                  icon={<MapPin size={18} />}
                  label="Deployment Sector"
                  value={event.location}
                />
                <DataRow
                  icon={<Calendar size={18} />}
                  label="Timeline"
                  value={`${new Date(event.eventDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`}
                />
                <DataRow
                  icon={<ShieldCheck size={18} />}
                  label="Status"
                  value={
                    event.completed ? "Mission Secured" : "Active Operation"
                  }
                  isStatus
                  completed={event.completed}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: PERSONNEL (SQUAD & ORGANIZER) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Organizer Section */}
              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={14} /> Mission Lead (Organizer)
                </h4>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-black font-bold">
                    {event.organizer?.firstName?.[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold">
                      {event.organizer?.firstName} {event.organizer?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">
                      {event.organizer?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Volunteers Squad Section */}
              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Users size={14} /> Assigned Squad (
                  {event.participations?.length || 0} /{" "}
                  {event.requiredVolunteers})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.participations && event.participations.length > 0 ? (
                    event.participations.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                            {p.user?.firstName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {p.user?.firstName} {p.user?.lastName}
                            </p>
                            <p className="text-[9px] text-slate-500 uppercase">
                              {p.user?.email}
                            </p>
                          </div>
                        </div>
                        {p.status === "APPROVED" && (
                          <CheckCircle2 size={16} className="text-teal-400" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 text-center border border-dashed border-white/10 rounded-3xl">
                      <p className="text-slate-600 text-xs uppercase font-bold tracking-widest">
                        No volunteers have joined this squad yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DataRow({ icon, label, value, isStatus, completed }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-purple-400 mt-1">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`text-sm font-medium mt-0.5 ${isStatus ? (completed ? "text-teal-400" : "text-purple-400") : "text-white"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
