import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Briefcase,
  Save,
  Loader2,
  CheckCircle,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSettings({ userData, themeColor, themeBg }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    mobile: userData?.mobile || "",
    skills: userData?.skills || "",
    volunteerExperience: userData?.volunteerExperience || "",
    organizerExperience: userData?.organizerExperience || "",
    aadhar: userData?.aadhar || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("volunteer_token");

    try {
      const response = await fetch("http://localhost:8080/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Profile credentials synchronized successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: "Update failed. Check your connection.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "System error. Try again later." });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const isVolunteer = userData?.role === "VOLUNTEER";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tighter text-white">
          Account Architecture
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage your professional identity and sector-specific credentials.
        </p>
      </header>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* --- GENERAL IDENTITY --- */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            <User className={themeColor} size={20} /> Core Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              icon={<User />}
              themeColor={themeColor}
            />
            <InputGroup
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              icon={<User />}
              themeColor={themeColor}
            />
            <InputGroup
              label="Email (Static)"
              name="email"
              value={userData?.email}
              icon={<Mail />}
              themeColor={themeColor}
              disabled
            />
            <InputGroup
              label="Mobile Connection"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              icon={<Phone />}
              themeColor={themeColor}
            />
          </div>
        </div>

        {/* --- SECTOR SPECIFIC DATA --- */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            {isVolunteer ? (
              <Star className={themeColor} size={20} />
            ) : (
              <ShieldCheck className={themeColor} size={20} />
            )}
            {isVolunteer ? "Volunteer Portfolio" : "Organizer Credentials"}
          </h3>

          <div className="space-y-6">
            {isVolunteer ? (
              <>
                <InputGroup
                  label="Expertise & Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  icon={<Star />}
                  themeColor={themeColor}
                  placeholder="e.g. Teaching, Logistics, Medical"
                />
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                    Mission History Overview
                  </label>
                  <textarea
                    name="volunteerExperience"
                    value={formData.volunteerExperience}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-1 transition-all resize-none min-h-[120px]"
                    placeholder="Briefly describe your previous community contributions..."
                  />
                </div>
              </>
            ) : (
              <>
                <InputGroup
                  label="Aadhar Verification"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleChange}
                  icon={<CreditCard />}
                  themeColor={themeColor}
                  maxLength={12}
                />
                <InputGroup
                  label="Operational Experience"
                  name="organizerExperience"
                  value={formData.organizerExperience}
                  onChange={handleChange}
                  icon={<Briefcase />}
                  themeColor={themeColor}
                  placeholder="Years in operation..."
                />
              </>
            )}
          </div>
        </div>

        {/* --- SUBMIT ACTIONS --- */}
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`flex items-center gap-2 font-bold text-sm ${message.type === "error" ? "text-red-400" : themeColor}`}
              >
                <CheckCircle size={18} /> {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={loading}
            className={`${themeBg} text-black font-black py-4 px-10 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl ml-auto`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            Synchronize Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function InputGroup({
  label,
  name,
  value,
  onChange,
  icon,
  themeColor,
  disabled,
  maxLength,
  placeholder,
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:${themeColor} transition-colors`}
        >
          {icon}
        </div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-1 transition-all ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  );
}
