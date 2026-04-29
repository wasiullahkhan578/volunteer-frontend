import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("volunteer_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Required for JwtAuthenticationFilter
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- API Endpoints Synchronized with Spring Boot Controllers ---

export const authAPI = {
  login: (credentials) => apiClient.post("/auth/login", credentials), // Matches AuthController
  register: (userData) => apiClient.post("/auth/register", userData),
  verify: (token) => apiClient.get(`/auth/verify?token=${token}`),
  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (data) => apiClient.post("/auth/reset-password", data), // Matches ResetPasswordRequest DTO
};

export const eventAPI = {
  // Volunteer: Mission Board Logic
  getAllEvents: () => apiClient.get("/events/all"),
  searchEvents: (query) => apiClient.get(`/volunteer/search?query=${query}`), // Matches VolunteerController
  joinEvent: (eventId) => apiClient.post(`/events/join/${eventId}`), // Triggers PENDING status
  getHistory: () => apiClient.get("/events/history"),
  cancelParticipation: (eventId) => apiClient.post(`/events/cancel/${eventId}`),

  // Organizer: Management
  createEvent: (eventData) => apiClient.post("/events/create", eventData),
  closeRegistration: (eventId) =>
    apiClient.put(`/organizer/event/${eventId}/close-registration`),
  completeEvent: (eventId) =>
    apiClient.put(`/organizer/event/${eventId}/complete`), // Triggers Certificate eligibility
  updateJoinRequest: (id, status) =>
    apiClient.put(`/organizer/participation/${id}/status?status=${status}`),
};

export const attendanceAPI = {
  // Milestone 3: 75% Threshold Attendance
  markAttendance: (attendanceData) =>
    apiClient.post("/attendance/mark", attendanceData), // Matches AttendanceRequest DTO
  checkEligibility: (participationId) =>
    apiClient.get(`/volunteer/participation/${participationId}/eligibility`), // Matches VolunteerController
};

export const adminAPI = {
  // Superior Admin: Najma Parween Session
  getGlobalStats: () => apiClient.get("/users/admin/stats"), // Matches UserController & AdminStats DTO
  getUsersByRole: (role) => apiClient.get(`/users/admin/users/${role}`), // Role must be uppercase
  approveOrganizer: (userId) => apiClient.put(`/users/admin/approve/${userId}`), // Unlocks Organizer Login
  getPendingOrganizers: () => apiClient.get("/users/admin/pending-organizers"),
  getMe: () => apiClient.get("/users/me"), // Fetches specific profile impact metrics
};

export default apiClient;
