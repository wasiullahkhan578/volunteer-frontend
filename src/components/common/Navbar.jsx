import { Bell, Search, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // --- MILESTONE 3: Fetch Unread Notifications ---
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/users/notifications/unread`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.length);
        }
      } catch (err) {
        console.error("Notification sync failed", err);
      }
    };

    if (user) fetchNotifications();
  }, [user]);

  // --- MILESTONE 2: Real-Time Search Logic ---
  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    // Only search if user is a Volunteer (matches VolunteerController @GetMapping("/search"))
    if (user?.role === "VOLUNTEER" && e.target.value.length > 2) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/volunteer/search?query=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("volunteer_token")}`,
            },
          },
        );
        const results = await res.json();
        console.log("Search Results:", results);
        // Note: You can pass these results to a global state or search context
      } catch (err) {
        console.error("Search failed", err);
      }
    }
  };

  return (
    <nav className="w-full h-20 flex items-center justify-between px-12 border-b border-white/5 bg-classic-900/50 backdrop-blur-md sticky top-0 z-10">
      {/* Search Bar Linked to VolunteerController */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={
            user?.role === "VOLUNTEER"
              ? "Search missions or locations..."
              : "Search records..."
          }
          className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Hub with Dynamic Badge */}
        <button className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-classic-900"></span>
          )}
        </button>

        {/* User Profile Quick Access */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white uppercase tracking-tighter">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-teal-400 font-medium lowercase italic">
              {user?.role?.toLowerCase()}_session_active
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center border border-white/10">
            {/* Display first letter of user name if available */}
            <span className="text-white font-bold text-sm">
              {user?.firstName?.charAt(0) || (
                <UserCircle className="text-slate-400" size={24} />
              )}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
