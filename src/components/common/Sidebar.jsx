import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  Settings,
  LogOut,
  Heart,
  ClipboardCheck,
  Bell,
} from "lucide-react";

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  handleLogout,
  unreadCount = 0,
}) {
  const themes = {
    VOLUNTEER: {
      text: "text-teal-400",
      bg: "bg-teal-500",
      activeBg: "bg-teal-500/10",
    },
    ORGANIZER: {
      text: "text-gold-500",
      bg: "bg-gold-500",
      activeBg: "bg-gold-500/10",
    },
    ADMIN: {
      text: "text-purple-400",
      bg: "bg-purple-500",
      activeBg: "bg-purple-500/10",
    },
  };

  const currentTheme = themes[user?.role] || themes.VOLUNTEER;

  // Primary "Home" for Admins is now the Admin Panel
  const getHomeTab = () => {
    if (user?.role === "ADMIN") return "admin";
    return "overview";
  };

  return (
    <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col p-8 z-20 h-screen fixed left-0 shadow-2xl">
      {/* Brand Logo - Redirects to role-specific Home */}
      <div
        className="flex items-center gap-3 mb-12 px-2 cursor-pointer"
        onClick={() => setActiveTab(getHomeTab())}
      >
        <div
          className={`w-10 h-10 ${currentTheme.bg} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Heart className="w-6 h-6 text-black fill-current" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Volunteer<span className={currentTheme.text}>Hub</span>.
        </span>
      </div>

      <nav className="flex-1 space-y-3">
        {/* --- 1. ADMIN PRIMARY: Admin Panel --- */}
        {user?.role === "ADMIN" && (
          <SidebarItem
            icon={<ShieldCheck size={20} />}
            label="Admin Panel"
            active={activeTab === "admin"}
            onClick={() => setActiveTab("admin")}
            theme={currentTheme}
          />
        )}

        {/* --- 2. OTHERS PRIMARY: Overview --- */}
        {user?.role !== "ADMIN" && (
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            theme={currentTheme}
          />
        )}

        {/* --- 3. SECONDARY: Notifications (Universal) --- */}
        <SidebarItem
          icon={<Bell size={20} />}
          label="Notifications"
          active={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
          theme={currentTheme}
          badge={unreadCount}
        />

        {/* --- 4. ROLE SPECIFIC TOOLS --- */}
        {user?.role === "ORGANIZER" && (
          <>
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Manage Events"
              active={activeTab === "manage-events"}
              onClick={() => setActiveTab("manage-events")}
              theme={currentTheme}
            />
            <SidebarItem
              icon={<ClipboardCheck size={20} />}
              label="Attendance"
              active={activeTab === "attendance"}
              onClick={() => setActiveTab("attendance")}
              theme={currentTheme}
            />
          </>
        )}

        {user?.role === "VOLUNTEER" && (
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Find Events"
            active={activeTab === "find-events"}
            onClick={() => setActiveTab("find-events")}
            theme={currentTheme}
          />
        )}
      </nav>

      {/* Profile & Settings Footer */}
      <div className="pt-8 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
            {user?.firstName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {user?.firstName}
            </p>
            <p
              className={`text-[9px] uppercase font-black tracking-widest ${currentTheme.text}`}
            >
              {user?.role}
            </p>
          </div>
        </div>
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          active={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
          theme={currentTheme}
        />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-all text-sm font-bold"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick, theme, badge }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all border ${
        active
          ? `${theme.activeBg} ${theme.text} border-white/10 shadow-lg`
          : "text-slate-400 border-transparent hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="relative">
        {icon}
        {badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-black animate-bounce">
            {badge}
          </span>
        )}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  );
}
