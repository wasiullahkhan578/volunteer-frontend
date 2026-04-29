import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  Shield,
  Sparkles,
  Users,
  Briefcase,
  Play,
  Trophy,
  User,
  Star,
} from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-classic-900 font-sans text-white relative selection:bg-teal-500 selection:text-white overflow-x-hidden">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[100px] animate-blob"></div>
        <div
          className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[100px] animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-teal-600/20 blur-[100px] animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto bg-classic-900/50 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Volunteer<span className="text-teal-400">Hub</span>
              <span className="text-gold-500">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-400">
            <a
              href="#about"
              className="hover:text-teal-400 transition-colors cursor-pointer"
            >
              About
            </a>
            <a
              href="#gallery"
              className="hover:text-gold-500 transition-colors cursor-pointer"
            >
              Gallery
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="hidden md:block text-sm font-bold text-white hover:text-teal-400 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-white text-classic-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-500 hover:text-white transition-all shadow-lg flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- SECTION 1: HERO (100vh) --- */}
      <section className="h-screen w-full flex items-center justify-center relative z-10 px-6 pt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-sm font-bold mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
              <span className="flex h-2 w-2 rounded-full bg-gold-500 animate-ping"></span>
              <span>Platform for Social Impact</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-white"
            >
              Turn Your Empathy <br />
              Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-white to-gold-400">
                Real Action.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg font-light"
            >
              A modern way to manage and track volunteers while certifying
              impact. Join 1,000+ changemakers building a better tomorrow.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/register"
                state={{ role: "VOLUNTEER" }}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-white"
              >
                Join the Force
              </Link>
              <Link
                to="/register"
                state={{ role: "ORGANIZER" }}
                className="px-8 py-4 bg-classic-800 border border-gold-500/30 text-gold-400 rounded-xl font-bold text-lg hover:bg-gold-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Briefcase className="w-5 h-5" /> Be the Change
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT VISUAL  */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:flex items-center justify-center h-[550px]"
          >
            {/* Moving Rings */}
            <div className="absolute w-[450px] h-[450px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute w-[300px] h-[300px] border border-teal-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

            <div className="relative w-full h-full">
              {/* CARD 1: HOURS */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 left-10 bg-classic-800/90 backdrop-blur-2xl border border-gold-500/30 p-5 rounded-2xl shadow-2xl w-60 z-30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-gold-500" />
                  <div className="text-lg font-bold text-white">
                    12,450 <span className="text-gold-500 text-xs">Hrs</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 w-[85%]"></div>
                </div>
              </motion.div>

              {/* CARD 2: NEW MISSION */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/3 right-10 bg-classic-800/80 border border-white/10 p-4 rounded-2xl shadow-2xl w-64 z-20"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-teal-400 font-bold uppercase">
                      New Quest
                    </div>
                    <div className="text-sm font-bold text-white">
                      Tree Plantation Drive
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CARD 3: SQUAD ACTIVITY */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-20 left-20 bg-classic-900/90 border border-teal-500/20 p-4 rounded-2xl shadow-2xl w-56 z-10"
              >
                <div className="text-[10px] text-teal-400 font-bold uppercase mb-2">
                  Live Squads
                </div>
                <div className="flex -space-x-2 mb-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      className="w-6 h-6 rounded-full border-2 border-classic-900"
                      alt="Avatar"
                    />
                  ))}
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-[8px] font-bold">
                    +12
                  </div>
                </div>
                <div className="text-xs font-bold text-white">45 Joined</div>
              </motion.div>

              {/* SUCCESS BADGE */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-40 right-16 bg-gradient-to-br from-teal-400 to-teal-600 p-4 rounded-3xl shadow-xl flex flex-col items-center gap-1 z-40"
              >
                <CheckCircle className="w-8 h-8 text-white mb-1" />
                <div className="text-[10px] text-white/80 font-bold uppercase tracking-tighter">
                  Impact
                </div>
                <div className="text-xl font-black text-white leading-none">
                  VERIFIED
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: ABOUT --- */}
      <section
        id="about"
        className="h-screen w-full flex items-center justify-center relative z-10 px-6"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Simple. <span className="text-gold-500">Powerful.</span> Verified.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg font-light">
              The complete ecosystem for community impact management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative text-white">
            {[
              {
                icon: <User className="text-teal-400" />,
                title: "Create Identity",
                desc: "Sign up as a Volunteer or Organizer. Set your skills to get matched.",
                step: "01",
              },
              {
                icon: <Briefcase className="text-gold-400" />,
                title: "Execute Missions",
                desc: "Browse the Quest Board. Join squads, coordinate in real-time, and make your impact.",
                step: "02",
              },
              {
                icon: <Shield className="text-purple-400" />,
                title: "Certify Impact",
                desc: "Hours are instantly verified by Organizers and recorded permanently.",
                step: "03",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center group"
              >
                <div className="w-16 h-16 bg-classic-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: GALLERY --- */}
      <section
        id="gallery"
        className="h-screen w-full flex items-center justify-center relative z-10 px-6 bg-classic-900/50"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-10 text-white">
            <h2 className="text-4xl font-bold tracking-tight">
              Missions <span className="text-gold-500">in Motion</span>
            </h2>
            {/* <div className="px-6 py-2 rounded-full border border-white/10 text-xs font-bold uppercase text-slate-500">
              Verified community feed
            </div> */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[450px]">
            <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden border border-white/10 group bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=2070"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Outreach"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
              <div className="absolute bottom-6 left-6 font-bold text-xl text-white">
                Community Outreach
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt="Support"
              />
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt="Helping"
              />
            </div>
            <div className="col-span-2 relative rounded-3xl overflow-hidden border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Tree Plantation"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-8 text-xl font-bold text-white">
                Urban Forestry Drive <br />
                <span className="text-teal-400 text-sm font-bold">
                  +120 Volunteers Joined
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: FOOTER --- */}
      <footer className="h-screen w-full flex flex-col items-center justify-center relative z-10 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              Ready to make an <span className="text-teal-400">impact?</span>
            </h2>
            <Link
              to="/register"
              className="px-12 py-5 bg-white text-classic-900 font-bold rounded-2xl hover:bg-teal-500 hover:text-white transition-all shadow-2xl text-xl inline-block"
            >
              Register Now
            </Link>
          </div>
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16 text-white text-left">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Heart className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Volunteer<span className="text-teal-400">Hub</span>
                  <span className="text-gold-500">.</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                The modern platform for managing community service and verified
                impact.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">
                Platform
              </h4>
              <ul className="space-y-3 text-sm text-slate-400 font-light">
                <li>Find Events</li>
                <li>Organizations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-slate-400 font-light">
                <li>Success Stories</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">
                Community
              </h4>
              <div className="flex gap-4 mt-2 text-slate-400">
                <span className="hover:text-teal-400 cursor-pointer transition-colors">
                  Twitter
                </span>
                <span className="hover:text-gold-500 cursor-pointer transition-colors">
                  LinkedIn
                </span>
              </div>
            </div>
          </div> */}
          <div className="mt-16 text-center text-[10px] uppercase tracking-widest text-slate-600 font-bold">
            &copy; 2026 VolunteerHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}