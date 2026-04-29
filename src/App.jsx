import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

// Auth & Public Components
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ResetPassword from "./components/auth/ResetPassword";

// Admin Components
import AdminDashboard from "./components/dashboards/admin/AdminDashboard";
import SystemAnalytics from "./components/dashboards/admin/SystemAnalytics";

// Organizer Components
import OrganizerDashboard from "./components/dashboards/organizer/OrganizerDashboard";
import CreateEvent from "./components/dashboards/organizer/CreateEvent";
import AttendanceMarker from "./components/dashboards/organizer/AttendanceMarker";

// Volunteer Components
import VolunteerDashboard from "./components/dashboards/volunteer/VolunteerDashboard";
import FindEvents from "./components/dashboards/volunteer/FindEvents";

// Common Components
import Settings from "./components/common/ProfileSettings";
import Sidebar from "./components/common/Sidebar";
import NotificationPanel from "./components/common/NotificationPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [auth, setAuth] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // State for passing data between Organizer components
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("volunteer_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setAuth(decoded);

          // SET DEFAULT TAB BASED ON ROLE
          // Ensures Admin starts on 'admin' and others on 'overview'
          setActiveTab(decoded.role === "ADMIN" ? "admin" : "overview");

          fetchUnreadCount(token);
        } else {
          localStorage.removeItem("volunteer_token");
        }
      } catch (err) {
        localStorage.removeItem("volunteer_token");
        setAuth(null);
      }
    }
    setIsInitializing(false);
  }, []);

  const fetchUnreadCount = async (token) => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/users/notifications/unread-count",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const count = await res.json();
        setUnreadCount(count);
      }
    } catch (e) {
      console.error("Notification sync error:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("volunteer_token");
    setAuth(null);
    window.location.href = "/login";
  };

  const renderDashboardContent = () => {
    if (!auth) return null;

    // Common Global Tabs
    if (activeTab === "notifications")
      return <NotificationPanel user={auth} onRead={() => setUnreadCount(0)} />;
    if (activeTab === "settings") return <Settings userData={auth} />;

    switch (auth.role) {
      case "ADMIN":
        // Maps to Sidebar 'Admin Panel'
        if (activeTab === "analytics") return <SystemAnalytics />;
        return <AdminDashboard />;

      case "ORGANIZER":
        const isApproved = auth.approved;

        // Navigation: Create Event
        if (activeTab === "manage-events" && isApproved)
          return (
            <CreateEvent onEventCreated={() => setActiveTab("overview")} />
          );

        // Navigation: Attendance Marking (requires eventId)
        if (activeTab === "attendance" && isApproved)
          return (
            <AttendanceMarker
              eventId={selectedEventId}
              onComplete={() => setActiveTab("overview")}
            />
          );

        // Default: Organizer Overview
        return (
          <OrganizerDashboard
            user={auth}
            isApproved={isApproved}
            onMarkAttendance={(id) => {
              setSelectedEventId(id);
              setActiveTab("attendance");
            }}
          />
        );

      case "VOLUNTEER":
        if (activeTab === "find-events") return <FindEvents />;
        return <VolunteerDashboard />;

      default:
        return <Navigate to="/login" />;
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-classic-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- PROTECTED DASHBOARD LAYOUT --- */}
      <Route
        path="/dashboard"
        element={
          auth ? (
            <div className="flex bg-classic-900 min-h-screen overflow-hidden">
              <Sidebar
                user={auth}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                unreadCount={unreadCount}
              />
              <div className="flex-1 ml-72 flex flex-col h-screen">
                <main className="p-12 overflow-y-auto custom-scrollbar">
                  {renderDashboardContent()}
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
