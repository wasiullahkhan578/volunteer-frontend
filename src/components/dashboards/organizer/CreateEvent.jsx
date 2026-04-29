import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  AlignLeft,
  Send,
  Loader2,
  Clock,
} from "lucide-react";

export default function CreateEvent({ onEventCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    endDate: "",
    requiredVolunteers: 5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(formData.eventDate);
    const end = new Date(formData.endDate);

    if (end <= start) {
      alert("End Date must be after the Start Date.");
      return;
    }

    // --- MILESTONE 3: Calculate Total Days for Certification Logic ---
    // This ensures the backend knows the denominator for the 75% rule
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    setLoading(true);
    const token = localStorage.getItem("volunteer_token");

    try {
      const response = await fetch("http://localhost:8080/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // We spread the formData and append totalDays
        body: JSON.stringify({ ...formData, totalDays }),
      });

      if (response.ok) {
        alert("Mission published successfully!");
        setFormData({
          title: "",
          description: "",
          location: "",
          eventDate: "",
          endDate: "",
          requiredVolunteers: 5,
        });
        if (onEventCreated) onEventCreated();
      }
    } catch (error) {
      console.error("Error creating mission:", error);
      alert("Failed to publish mission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md max-w-2xl mx-auto shadow-2xl">
      <header className="mb-8">
        <h3 className="text-2xl font-bold text-gold-500 uppercase tracking-tighter">
          Post New Community Mission
        </h3>
        <p className="text-slate-400 text-sm mt-2 font-light">
          Fill in the details below to recruit volunteers for your initiative.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500/80 mb-2 block">
            Mission Title
          </label>
          <input
            required
            placeholder="e.g. Urban Forestry Drive"
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 outline-none focus:border-gold-500 transition-all text-white placeholder-slate-600"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500/80 mb-2 block">
              Start Date & Time
            </label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gold-500 transition-colors" />
              <input
                type="datetime-local"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-gold-500 text-white transition-all"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500/80 mb-2 block">
              End Date & Time
            </label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gold-500 transition-colors" />
              <input
                type="datetime-local"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-gold-500 text-white transition-all"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500/80 mb-2 block">
              Squad Size
            </label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gold-500 transition-colors" />
              <input
                type="number"
                min="1"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-gold-500 text-white transition-all"
                value={formData.requiredVolunteers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiredVolunteers: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500/80 mb-2 block">
              Location
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-gold-500 transition-colors" />
              <input
                required
                placeholder="City, Area or Meeting Link"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-gold-500 text-white transition-all placeholder-slate-600"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500/80 mb-2 block">
            Mission Briefing
          </label>
          <div className="relative group">
            <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-slate-500 group-focus-within:text-gold-500 transition-colors" />
            <textarea
              required
              rows="4"
              placeholder="Describe the goals, tasks, and community impact of this mission..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-gold-500 text-white resize-none transition-all placeholder-slate-600"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        <button
          disabled={loading}
          className={`w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black font-extrabold py-4 rounded-2xl shadow-xl shadow-gold-500/20 transition-all flex items-center justify-center gap-2 group ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Send
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
              PUBLISH MISSION
            </>
          )}
        </button>
      </form>
    </div>
  );
}
