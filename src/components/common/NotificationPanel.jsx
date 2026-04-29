import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  UserPlus,
  Zap,
  ShieldAlert,
  Info,
  Clock,
  Trash2,
  Check,
} from "lucide-react";

export default function NotificationPanel({ user, onRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("volunteer_token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/notifications/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        if (onRead) onRead();
      }
    } catch (err) {
      console.error("Notification sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("volunteer_token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/notifications/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        // Optimistic UI update: remove from state immediately
        setNotifications(notifications.filter((note) => note.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "SIGNUP":
        return <UserPlus className="text-teal-400" />;
      case "UPDATE":
        return <Zap className="text-gold-500" />;
      case "SYSTEM":
        return <ShieldAlert className="text-purple-400" />;
      case "REMINDER":
        return <Clock className="text-blue-400" />;
      default:
        return <Info className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 text-slate-500">
          Communications Hub
        </p>
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          System <span className="text-slate-500">Alerts</span>
        </h1>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-slate-500 animate-pulse">
            Syncing encrypted alerts...
          </div>
        ) : notifications.length > 0 ? (
          <AnimatePresence>
            {notifications.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group p-6 rounded-[2rem] border flex items-start gap-6 transition-all relative ${
                  note.priority
                    ? "bg-purple-500/5 border-purple-500/20"
                    : "bg-white/5 border-white/10 shadow-xl"
                }`}
              >
                <div className="p-3 bg-white/5 rounded-2xl">
                  {getIcon(note.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-white tracking-tight">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black text-slate-600 uppercase">
                        {formatNotificationDate(note.createdAt)}
                      </span>
                      {/* Trash Button - Visible on hover/touch */}
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pr-8">
                    {note.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
            <Bell className="mx-auto mb-4 text-slate-800" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              Infrastructure is silent. No new alerts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Logical Date Helper Function
const formatNotificationDate = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime()) || date.getFullYear() < 2000) return "Recently";

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
