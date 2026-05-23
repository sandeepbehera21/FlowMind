import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Layers,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Layout,
  BookOpen,
  ShieldAlert,
  Mail,
  Plug,
  GitBranch,
  ArrowRight,
  Github,
  Brain,
  Check,
  Server,
  Database,
  Lock,
  Sparkles,
  Zap,
  Cpu,
  Activity,
  Sun,
  Moon,
  ChevronRight,
  AlertOctagon
} from "lucide-react";
import toast from "react-hot-toast";
import { flowmindApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useAppStore } from "../store/useAppStore";

// Microsoft Logo component in SVG
const MicrosoftIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 23 23" fill="none" width="16" height="16">
    <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
    <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
    <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
    <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
  </svg>
);

// Mouse coordinates hook for spotlight effects
function useMouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ref.current.style.setProperty("--mouse-x", `${x}px`);
      ref.current.style.setProperty("--mouse-y", `${y}px`);
    };
    const el = ref.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (el) {
        el.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);
  return ref;
}

// Reusable Bento Grid Card
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: string;
}

function BentoCard({ children, className = "", colSpan = "md:col-span-1" }: BentoCardProps) {
  const ref = useMouseGlow();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`group mouse-glow-card border border-slate-200/50 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/40 p-8 rounded-2xl hover-lift ${colSpan} ${className}`}
    >
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}

// Hero pipeline animation graphic
const PipelineGraphic = () => {
  return (
    <div className="relative w-full h-[360px] md:h-[420px] flex items-center justify-center overflow-hidden border border-slate-200/40 dark:border-zinc-850/60 rounded-3xl bg-slate-50/50 dark:bg-zinc-950/20 backdrop-blur-xl">
      {/* Central Neural AI Sphere */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 40px 10px rgba(139, 92, 246, 0.15)",
            "0 0 60px 25px rgba(139, 92, 246, 0.35)",
            "0 0 40px 10px rgba(139, 92, 246, 0.15)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border border-violet-400/30 shadow-2xl"
      >
        <Brain className="h-10 w-10 text-white" />
        <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl -z-10 animate-pulse" />
      </motion.div>

      {/* Floating Incoming Nodes (Left) */}
      <motion.div
        initial={{ x: -180, y: -80, opacity: 0, scale: 0.8 }}
        animate={{
          x: [-180, 0, 0],
          y: [-80, 0, 0],
          opacity: [0, 1, 0],
          scale: [0.8, 1, 0.6]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          times: [0, 0.4, 0.65],
          ease: "easeInOut"
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg"
      >
        <Mail size={12} className="text-blue-500" />
        <span className="text-[10px] font-bold font-mono text-slate-800 dark:text-zinc-200">Outlook: approval requested</span>
      </motion.div>

      <motion.div
        initial={{ x: -160, y: 70, opacity: 0, scale: 0.8 }}
        animate={{
          x: [-160, 0, 0],
          y: [70, 0, 0],
          opacity: [0, 1, 0],
          scale: [0.8, 1, 0.6]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 2.2,
          times: [0, 0.4, 0.65],
          ease: "easeInOut"
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg"
      >
        <Plug size={12} className="text-emerald-500" />
        <span className="text-[10px] font-bold font-mono text-slate-800 dark:text-zinc-200">Teams: sandeep: database blocker</span>
      </motion.div>

      {/* Floating Structured Output Nodes (Right) */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
        animate={{
          x: [0, 0, 160],
          y: [0, 0, 40],
          opacity: [0, 1, 1],
          scale: [0.6, 1, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          times: [0, 0.45, 0.8],
          ease: "easeInOut"
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 p-3 rounded-xl border border-violet-500/20 bg-white/95 dark:bg-zinc-900/95 shadow-xl w-44"
      >
        <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded w-max">Action Item</span>
        <span className="text-[9px] font-extrabold leading-tight text-slate-800 dark:text-zinc-200">Fix MSAL configuration settings</span>
      </motion.div>

      <motion.div
        initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
        animate={{
          x: [0, 0, 150],
          y: [0, 0, -80],
          opacity: [0, 1, 1],
          scale: [0.6, 1, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 2.5,
          times: [0, 0.45, 0.8],
          ease: "easeInOut"
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 p-3 rounded-xl border border-rose-500/20 bg-white/95 dark:bg-zinc-900/95 shadow-xl w-44"
      >
        <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded w-max">Blocker Log</span>
        <span className="text-[9px] font-extrabold leading-tight text-slate-800 dark:text-zinc-200">Sandbox Quota Exhaustion Alert</span>
      </motion.div>

      {/* SVG Connecting lines in background */}
      <svg className="absolute inset-0 w-full h-full stroke-slate-200 dark:stroke-zinc-800/40" strokeWidth="1" strokeDasharray="4 4" fill="none">
        <line x1="20%" y1="30%" x2="50%" y2="50%" />
        <line x1="25%" y1="65%" x2="50%" y2="50%" />
        <line x1="50%" y1="50%" x2="80%" y2="60%" />
        <line x1="50%" y1="50%" x2="78%" y2="30%" />
      </svg>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // App Theme Switcher States
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  // Navbar Stickiness & Direction
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active step state for the interactive 5-Step Pipeline
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  // 3D Parallax Rotation for the dashboard preview
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleParallaxMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rX = -(mouseY / height) * 15;
    const rY = (mouseX / width) * 15;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleParallaxLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Demo loading steps
  useEffect(() => {
    if (!loadingDemo) return;
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 4);
    }, 900);
    return () => clearInterval(interval);
  }, [loadingDemo]);

  const handleTryDemo = async () => {
    setLoadingDemo(true);
    setDemoStep(0);
    try {
      sessionStorage.setItem("flowmind_demo_mode", "true");
      await flowmindApi.demo();
      await new Promise((resolve) => setTimeout(resolve, 3600));
      toast.success("FlowMind Demo sandbox active!");
      navigate("/dashboard");
    } catch (err) {
      sessionStorage.removeItem("flowmind_demo_mode");
      toast.error("Failed to spin up demo workspace. Please try again.");
      console.error(err);
      setLoadingDemo(false);
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  // Pipeline step descriptions
  const pipelineSteps = [
    {
      title: "Message Ingestion",
      icon: <Inbox className="h-6 w-6" />,
      tag: "Graph API Summary",
      desc: "Establishes a real-time secure listener to capture email threads from Outlook and channel rooms in Microsoft Teams."
    },
    {
      title: "Topic Clustering",
      icon: <Layers className="h-6 w-6" />,
      tag: "Semantic Indexing",
      desc: "Azure OpenAI groups scattered discussions logically by feature tags, projects, and active tasks dynamically."
    },
    {
      title: "Action Extraction",
      icon: <CheckSquare className="h-6 w-6" />,
      tag: "LLM Parsing",
      desc: "Leverages structured JSON output parsing to identify task owners, deadlines, priority flags, and description lists."
    },
    {
      title: "Decision & Blocker Identification",
      icon: <AlertTriangle className="h-6 w-6" />,
      tag: "Contextual Audits",
      desc: "Captures critical sprint decisions and team blockers before they cause delays in your active cycles."
    },
    {
      title: "Dashboard Sync",
      icon: <BarChart3 className="h-6 w-6" />,
      tag: "Real-time Update",
      desc: "Populates stats, logs, and a fully interactive Kanban board directly, keeping the entire workspace aligned instantly."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-800 bg-slate-50 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300">
      {/* Noise Texture layer */}
      <div className="absolute inset-0 bg-noise pointer-events-none -z-40" />

      {/* Shifting Aurora Backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-50">
        {/* Aurora Circle 1 (Purple) */}
        <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-violet-600/10 dark:bg-purple-600/15 blur-[120px] animate-aurora-1" />
        {/* Aurora Circle 2 (Blue) */}
        <div className="absolute top-[30%] right-[-10%] w-[700px] h-[700px] rounded-full bg-blue-600/10 dark:bg-indigo-650/15 blur-[140px] animate-aurora-2" />
        {/* Aurora Circle 3 (Fuchsia) */}
        <div className="absolute bottom-[15%] left-[10%] w-[550px] h-[550px] rounded-full bg-fuchsia-500/5 dark:bg-fuchsia-600/10 blur-[130px] animate-aurora-3" />
      </div>

      {/* Background Grids */}
      <div className="absolute inset-0 -z-50 bg-grid-pattern-light dark:bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Demo Loading Overlay */}
      <AnimatePresence>
        {loadingDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xl text-white p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative flex flex-col items-center max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="relative mb-8 h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-indigo-500/25 animate-pulse" />
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white animate-bounce" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold tracking-tight mb-1 font-outfit">Creating Demo Sandbox</h3>
              <p className="text-zinc-400 text-xs mb-6 font-medium">Initializing mock database & workspace pipelines...</p>
              
              {/* Dynamic steps indicator */}
              <div className="w-full text-left space-y-4 mb-2 px-2">
                {["Connecting to Mock Microsoft Graph API", "Seeding Outlook emails & Teams threads", "Processing 5-Step Azure OpenAI pipeline", "Synthesizing Kanban board items"].map((stepText, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${demoStep >= idx ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-500 border border-zinc-700/50"}`}>
                      {demoStep > idx ? <Check className="h-3 w-3" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-semibold ${demoStep === idx ? "text-purple-400" : demoStep > idx ? "text-zinc-400" : "text-zinc-650"}`}>
                      {stepText}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="w-full h-1 bg-zinc-850 rounded-full overflow-hidden mt-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: 3.6, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav
        animate={{ y: isNavVisible ? 0 : -90 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b bg-white/70 border-slate-200/50 dark:bg-zinc-950/70 dark:border-zinc-900/80 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo brand */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Activity size={18} className="animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-[3px] opacity-35 -z-10" />
            </div>
            <span className="text-lg font-extrabold tracking-wider font-outfit bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-350 bg-clip-text text-transparent">
              FlowMind
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            {/* View on Github */}
            <a
              href="https://github.com/sandeepbehera21/CodeNexus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900/55 transition-all duration-200"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>

            {/* Theme switcher button */}
            <button
              onClick={toggleDarkMode}
              className="relative h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition duration-200 shadow-sm"
              title="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0, scale: darkMode ? 0 : 1 }}
                transition={{ duration: 0.25 }}
                className="absolute"
              >
                <Sun size={16} />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 0 : -180, scale: darkMode ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="absolute"
              >
                <Moon size={16} />
              </motion.div>
            </button>

            {/* Main Auth Switcher */}
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 text-white px-4 text-xs font-extrabold tracking-wider uppercase shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Dashboard
                </button>
                <button
                  onClick={auth.logout}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 px-3.5 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200/50 dark:hover:border-rose-900/50 transition-all"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTryDemo}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900/80 px-4 text-xs font-extrabold tracking-wider uppercase transition-all"
                >
                  Try Demo
                </button>
                <button
                  onClick={handleSignIn}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-850 dark:hover:bg-white px-4 text-xs font-extrabold tracking-wider uppercase shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MicrosoftIcon />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400"
            >
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-zinc-450 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-6 pt-2 pb-6 border-t border-slate-200/50 bg-white/95 dark:bg-zinc-950/95 dark:border-zinc-900/80 space-y-4 shadow-xl"
          >
            <a
              href="https://github.com/sandeepbehera21/CodeNexus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-350"
            >
              <Github size={18} />
              <span>View on GitHub</span>
            </a>
            {auth.isAuthenticated ? (
              <div className="flex flex-col gap-3.5 pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full text-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 text-xs font-extrabold tracking-wider uppercase shadow-md"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    auth.logout();
                  }}
                  className="w-full text-center rounded-xl border border-rose-500/20 text-rose-500 py-3 text-xs font-extrabold tracking-wider uppercase"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleTryDemo();
                  }}
                  className="w-full text-center rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-250 py-3 text-xs font-extrabold tracking-wider uppercase"
                >
                  Try Demo Sandbox
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignIn();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 text-xs font-extrabold tracking-wider uppercase shadow-md"
                >
                  <MicrosoftIcon />
                  <span>Login with Microsoft</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.nav>

      <section className="pt-32 lg:pt-40 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
        {/* Left side: Offset Headings & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-left"
        >
          {/* Hackathon Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/50 bg-violet-500/5 px-4 py-1.5 text-xs font-bold text-violet-700 dark:border-purple-500/20 dark:bg-purple-950/20 dark:text-purple-300 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-ping" />
            🏆 Microsoft Build AI 2026 Hackathon
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] font-outfit">
            Turn scattered <br className="hidden sm:inline" />
            messages into <br />
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-indigo-500 bg-clip-text text-transparent font-black">
              structured execution
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-sm sm:text-base text-slate-650 dark:text-zinc-450 max-w-xl leading-relaxed">
            FlowMind hooks directly into your Microsoft 365 Outlook and Teams workspaces. Our 5-stage Azure OpenAI pipeline automatically transforms chaotic project chats into structured Kanban board cards, active blocker logs, and daily timeline logs.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            {auth.isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_8px_24px_-8px_rgba(99,102,241,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>Enter Work Dashboard</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleTryDemo}
                  className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_8px_24px_-8px_rgba(99,102,241,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Launch Demo Sandbox</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={handleSignIn}
                  className="flex-1 inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white/70 text-slate-800 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900/80 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MicrosoftIcon />
                  <span>Microsoft Sign In</span>
                </button>
              </>
            )}
          </div>

          {/* Details Row */}
          <div className="mt-7 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Secure MSAL OAuth</span>
            <span className="text-slate-300 dark:text-zinc-800">•</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Azure OpenAI Integration</span>
            <span className="text-slate-300 dark:text-zinc-800">•</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Cosmos DB Storage</span>
          </div>

          {/* Market Size / ROI Stats Banner */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200/60 dark:border-zinc-800/80 pt-6 max-w-xl">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-violet-600 dark:text-purple-400 font-outfit">6.2 Hours</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase mt-1 leading-4">Wasted per user weekly on manual task tracking</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-outfit">40%</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase mt-1 leading-4">Faster blocker resolution cycles</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-fuchsia-600 dark:text-fuchsia-400 font-outfit">95%</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase mt-1 leading-4">AI extraction precision rate</p>
            </div>
          </div>
        </motion.div>

        {/* Right side: Interactive Pipeline Flow Graphic */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <PipelineGraphic />
        </motion.div>
      </section>

      {/* SECTION 2 — INTERACTIVE PARALLAX DASHBOARD PREVIEW */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-violet-500 dark:text-purple-400">Immersive Dashboard Mockup</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1.5 font-outfit">Interact with our 3D Workspace Shell</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-450 mt-1 max-w-md mx-auto">Hover over the board to tilt the perspective and explore structured data layers.</p>
        </div>

        {/* 3D Wrapper */}
        <div 
          className="relative w-full max-w-5xl mx-auto"
          style={{ perspective: 1200 }}
        >
          <motion.div
            onMouseMove={handleParallaxMove}
            onMouseLeave={handleParallaxLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            style={{ transformStyle: "preserve-3d" }}
            className="border border-slate-200 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-colors"
          >
            {/* Header controls bar */}
            <div className="h-11 border-b border-slate-200/50 bg-slate-50/50 dark:border-zinc-800/60 dark:bg-zinc-950/40 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/30 border border-rose-500/45" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/30 border border-amber-500/45" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/45" />
              </div>
              <div className="h-6 w-72 rounded-lg bg-slate-100 dark:bg-zinc-950/65 flex items-center justify-center text-[10px] text-slate-400 dark:text-zinc-550 font-mono border border-slate-200/20 dark:border-zinc-900">
                flowmind.ai/workspace/demo-sandbox
              </div>
              <div className="w-8" />
            </div>

            {/* Content layout */}
            <div className="grid grid-cols-[60px_1fr] md:grid-cols-[180px_1fr] min-h-[380px] text-left">
              {/* Fake Sidebar */}
              <div className="border-r border-slate-200/50 dark:border-zinc-900/60 bg-slate-50/10 p-4 space-y-5 hidden sm:block">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Activity size={14} />
                  </div>
                  <span className="text-xs font-extrabold tracking-wider font-outfit">FlowMind</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-8 rounded-lg bg-violet-500/10 text-violet-650 dark:bg-purple-500/10 dark:text-purple-300 border border-violet-500/15 dark:border-purple-500/10 flex items-center gap-2 px-2.5 text-xs font-bold">
                    <Layout size={13} />
                    <span>Dashboard</span>
                  </div>
                  <div className="h-8 rounded-lg text-slate-500 dark:text-zinc-400 flex items-center gap-2 px-2.5 text-xs font-semibold hover:bg-slate-100/50 dark:hover:bg-zinc-800/30">
                    <CheckSquare size={13} />
                    <span>Action Items</span>
                  </div>
                  <div className="h-8 rounded-lg text-slate-500 dark:text-zinc-400 flex items-center gap-2 px-2.5 text-xs font-semibold hover:bg-slate-100/50 dark:hover:bg-zinc-800/30">
                    <BookOpen size={13} />
                    <span>Decisions</span>
                  </div>
                  <div className="h-8 rounded-lg text-slate-500 dark:text-zinc-400 flex items-center gap-2 px-2.5 text-xs font-semibold hover:bg-slate-100/50 dark:hover:bg-zinc-800/30">
                    <ShieldAlert size={13} />
                    <span>Blockers</span>
                  </div>
                </div>
              </div>

              {/* Main Panel */}
              <div className="p-5 sm:p-7 bg-slate-50/10 dark:bg-zinc-950/20 flex-1 relative" style={{ transformStyle: "preserve-3d" }}>
                {/* Top indicator bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-250/50 dark:border-emerald-900/40">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      M365 Account Sandbox
                    </div>
                    <h3 className="text-base font-bold mt-1.5 font-outfit">Sandeep's Task Hub</h3>
                  </div>
                  <div className="h-8 px-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold gap-1 cursor-pointer">
                    <Zap size={11} className="animate-spin" style={{ animationDuration: "3s" }} />
                    <span>Sync Graph</span>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
                  {[
                    { label: "Messages Summary", count: "128", tag: "Inbox", color: "text-slate-800 dark:text-zinc-200" },
                    { label: "Action Extract", count: "29", tag: "OpenAI", color: "text-violet-500" },
                    { label: "Key Decisions", count: "14", tag: "Resolved", color: "text-emerald-500" },
                    { label: "Blocker Logs", count: "4", tag: "Critical", color: "text-rose-500" }
                  ].map((stat, i) => (
                    <div key={i} className="border border-slate-200/40 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/50 p-3 rounded-xl">
                      <p className="text-[8px] text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider">{stat.label}</p>
                      <p className={`text-lg font-extrabold mt-0.5 ${stat.color}`}>{stat.count}</p>
                    </div>
                  ))}
                </div>

                {/* Mock Kanban rows */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ transformStyle: "preserve-3d" }}>
                  {/* Column 1 */}
                  <div className="rounded-xl bg-slate-100/50 dark:bg-zinc-900/40 p-3 border border-slate-200/10">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-bold text-slate-450 dark:text-zinc-400">To Do</span>
                      <span className="text-[8px] font-bold bg-slate-200 dark:bg-zinc-800 px-1 rounded text-slate-500">2</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/80 p-2.5 rounded-lg shadow-sm">
                      <span className="inline-block text-[8px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-450 rounded px-1 py-0.5 mb-1.5">High Priority</span>
                      <p className="text-[10px] font-bold">Validate Cosmos DB partitions</p>
                      <div className="flex justify-between items-center mt-3 text-[9px] text-slate-400">
                        <span>Sandeep B.</span>
                        <span>May 25</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="rounded-xl bg-slate-100/50 dark:bg-zinc-900/40 p-3 border border-slate-200/10">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-bold text-violet-500">In Progress</span>
                      <span className="text-[8px] font-bold bg-violet-100 dark:bg-purple-950/40 px-1 rounded text-violet-500">1</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/80 p-2.5 rounded-lg shadow-sm">
                      <span className="inline-block text-[8px] font-bold bg-violet-500/10 text-violet-500 rounded px-1.5 py-0.5 mb-1.5">AI Synthesis</span>
                      <p className="text-[10px] font-bold">Extract blockers from Teams chat</p>
                      <div className="flex justify-between items-center mt-3 text-[9px] text-slate-400">
                        <span>OpenAI Agent</span>
                        <span>May 23</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="rounded-xl bg-slate-100/50 dark:bg-zinc-900/40 p-3 border border-slate-200/10">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-bold text-emerald-500">Completed</span>
                      <span className="text-[8px] font-bold bg-emerald-100/40 dark:bg-emerald-950/30 px-1 rounded text-emerald-500">4</span>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/80 p-2.5 rounded-lg shadow-sm opacity-55">
                      <p className="text-[10px] font-bold line-through">Draft architecture schematic</p>
                      <div className="flex justify-between items-center mt-3 text-[9px] text-slate-400">
                        <span>System DB</span>
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layer 3: Floating Parallax overlay widget (simulating layered depth) */}
                <div 
                  className="absolute right-[-15px] bottom-[30px] z-30 p-4 w-60 rounded-xl bg-white/95 dark:bg-zinc-900/95 border border-purple-500/25 dark:border-purple-500/35 shadow-2xl backdrop-blur-md hidden lg:block"
                  style={{ transform: "translateZ(60px) scale(0.95)" }}
                >
                  <div className="flex items-center gap-2 mb-2 text-violet-500">
                    <Sparkles size={14} className="animate-spin" style={{ animationDuration: "5s" }} />
                    <span className="text-[9px] font-bold uppercase tracking-wider">AI Event Extraction</span>
                  </div>
                  <div className="text-[10px] font-bold leading-relaxed mb-2">
                    "Meeting consensus achieved: deploy to Azure App Service by May 28."
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-2 text-[9px] text-slate-400">
                    <span className="font-semibold text-emerald-500">Extracting Decision...</span>
                    <span>100% Match</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — INTERACTIVE 5-STEP PIPELINE */}
      <section className="py-24 border-t border-slate-200/50 bg-slate-100/20 dark:border-zinc-900/50 dark:bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold text-violet-500 dark:text-purple-400 uppercase tracking-[0.25em]">The AI Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1.5 font-outfit bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 dark:from-white dark:to-zinc-350 bg-clip-text text-transparent">
              5 Steps from raw messages to structured work
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-450 mt-2 max-w-xl mx-auto">
              How FlowMind ingests, refines, clusters, and outputs Microsoft Graph resources into clean Kanban actions.
            </p>
          </div>

          {/* Step layout selector */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-center">
            {/* Interactive display details */}
            <div className="space-y-4">
              {pipelineSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-6 rounded-2xl cursor-pointer border text-left transition-all duration-300 ${
                    activePipelineStep === idx
                      ? "bg-white border-violet-500/30 shadow-lg dark:bg-zinc-900/80 dark:border-purple-500/30"
                      : "bg-transparent border-transparent hover:bg-slate-100/60 dark:hover:bg-zinc-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors ${
                        activePipelineStep === idx ? "bg-violet-600 text-white" : "bg-slate-200/50 text-slate-600 dark:bg-zinc-900 dark:text-zinc-400"
                      }`}>
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">Step 0{idx + 1}</span>
                        <h4 className="text-sm font-extrabold mt-0.5">{step.title}</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-violet-500 dark:text-purple-400">{step.tag}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Preview detail window */}
            <div className="p-8 rounded-3xl border border-slate-200/50 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-900/50 backdrop-blur-xl h-[340px] flex flex-col justify-between text-left relative overflow-hidden shadow-xl">
              {/* Background gradient orb inside preview */}
              <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePipelineStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center">
                      {pipelineSteps[activePipelineStep].icon}
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-violet-500 tracking-widest">Active Step</span>
                      <h4 className="text-base font-extrabold">{pipelineSteps[activePipelineStep].title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-650 dark:text-zinc-400 leading-relaxed font-medium">
                    {pipelineSteps[activePipelineStep].desc}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">System Diagnostics</span>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-500">Pipeline Status: ACTIVE</span>
                      <span className="text-slate-500 dark:text-zinc-400">Response 200 OK</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-550 mt-4">
                <span>Microservices orchestrator</span>
                <span className="font-bold">v1.2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — ASYMMETRICAL BENTO GRID */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold text-violet-500 dark:text-purple-400 uppercase tracking-[0.25em]">Features Matrix</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1.5 font-outfit">Platform Features</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-450 mt-1 max-w-md mx-auto">Custom engineering tailored for teams requiring structured clarity.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 (Kanban - Span 2) */}
          <BentoCard colSpan="md:col-span-2" className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-left flex-1">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-650 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center mb-4">
                <Layout size={18} />
              </div>
              <h3 className="text-lg font-bold mb-2 font-outfit">Kanban Action Board</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed font-medium">
                Drag and drop synthesised actions easily across stages. Priority rules sync directly with model clusters, making execution seamless and organized.
              </p>
            </div>
            
            {/* Visual preview */}
            <div className="w-full md:w-56 shrink-0 p-3.5 border border-slate-200/50 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/40 rounded-xl flex flex-col gap-2">
              <span className="text-[8px] font-bold text-slate-450 uppercase block">Sprint Cards</span>
              <div className="p-2 border border-violet-500/20 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                <span className="text-[8px] font-bold text-violet-500 uppercase">Task #1</span>
                <p className="text-[10px] font-extrabold mt-0.5">Integrate MS Graph scopes</p>
              </div>
              <div className="p-2 border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg shadow-sm opacity-60">
                <p className="text-[10px] font-bold line-through">Configure CORS parameters</p>
              </div>
            </div>
          </BentoCard>

          {/* Card 2 (Daily Digest - Span 1) */}
          <BentoCard colSpan="md:col-span-1" className="flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-650 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center mb-4">
                <Mail size={18} />
              </div>
              <h3 className="text-base font-bold mb-2 font-outfit">Daily Digest Summary</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed font-medium">
                Aggregates teams chat updates and files into a daily executive layout, draftable in one click.
              </p>
            </div>

            <div className="mt-6 border border-slate-150 bg-white dark:border-zinc-850 dark:bg-zinc-950/60 rounded-xl p-3 text-left">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-4 w-4 rounded bg-violet-500 flex items-center justify-center text-white text-[8px] font-bold">F</div>
                <span className="text-[9px] font-bold">Daily Digest Output</span>
              </div>
              <p className="text-[8px] text-slate-500 dark:text-zinc-400 leading-normal">
                - Captured 3 decisions on API scope limits.<br />
                - Blocked: Sandeep's key quota limits reached.
              </p>
            </div>
          </BentoCard>

          {/* Card 3 (Blocker Detection - Span 1) */}
          <BentoCard colSpan="md:col-span-1" className="flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-650 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center mb-4">
                <ShieldAlert size={18} />
              </div>
              <h3 className="text-base font-bold mb-2 font-outfit">Active Blocker Alerts</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed font-medium">
                AI flags project blockages before they derail sprints. Flags backend latency, credential issues, and rate quotas.
              </p>
            </div>

            <div className="mt-6 p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-450 flex items-center gap-2">
              <AlertOctagon size={16} className="animate-bounce" />
              <div className="text-[9px] text-left">
                <span className="font-extrabold block">BLOCKER FOUND</span>
                <span>OpenAI tokens quota limit reached</span>
              </div>
            </div>
          </BentoCard>

          {/* Card 4 (Decision Log - Span 2) */}
          <BentoCard colSpan="md:col-span-2" className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-left flex-1">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-650 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center mb-4">
                <BookOpen size={18} />
              </div>
              <h3 className="text-lg font-bold mb-2 font-outfit">Decision Chronicles</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed font-medium">
                Capture consensus statements and resolution summaries from Slack/Teams chats. Connects participants automatically to maintain clear accountability history.
              </p>
            </div>

            {/* Mini diagram */}
            <div className="w-full md:w-56 shrink-0 p-3.5 border border-slate-200/50 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/40 rounded-xl space-y-2 text-left">
              <span className="text-[8px] font-bold text-slate-400 block uppercase">Decisions timeline</span>
              <div className="flex gap-2.5 items-start">
                <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30 text-[9px] font-bold">✓</div>
                <div>
                  <span className="text-[9px] font-bold block leading-none">Database Schema Approved</span>
                  <span className="text-[7px] text-slate-400 block mt-0.5">Sandeep B. • May 21</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 5 (Graph Integration - Span 2) */}
          <BentoCard colSpan="md:col-span-2" className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-left flex-1">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-650 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center mb-4">
                <Plug size={18} />
              </div>
              <h3 className="text-lg font-bold mb-2 font-outfit">Microsoft Graph Integration</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed font-medium">
                FlowMind streams Outlook inbox emails and Teams conversations using official Microsoft Graph APIs under robust corporate MSAL scopes.
              </p>
            </div>

            <div className="flex items-center gap-3.5 px-4 py-3 bg-slate-50/50 dark:bg-zinc-950/30 rounded-xl border border-slate-200/40 dark:border-zinc-850">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Mail size={16} /></div>
              <ChevronRight size={14} className="text-slate-400" />
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-650 flex items-center justify-center text-white"><Brain size={16} /></div>
              <ChevronRight size={14} className="text-slate-400" />
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Layout size={16} /></div>
            </div>
          </BentoCard>

          {/* Card 6 (Architecture - Span 1) */}
          <BentoCard colSpan="md:col-span-1" className="flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-650 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center mb-4">
                <GitBranch size={18} />
              </div>
              <h3 className="text-base font-bold mb-2 font-outfit">System Architecture</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed font-medium">
                Transparent blueprint visualization tracing data pipeline paths from backend endpoints to Azure services.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[9px] text-violet-500 font-bold justify-end cursor-pointer" onClick={() => navigate("/architecture")}>
              <span>View System Architecture</span>
              <ArrowRight size={12} />
            </div>
          </BentoCard>

        </div>
      </section>

      {/* SECTION 5 — MICROSOFT AZURE POWERED BY ROW */}
      <section className="py-20 bg-slate-100/50 border-y border-slate-200/50 dark:bg-zinc-900/20 dark:border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-450 dark:text-zinc-550 uppercase tracking-[0.25em] mb-10">
            Powered by Microsoft Enterprise Stack
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {[
              { title: "Azure OpenAI", icon: <Cpu size={14} />, gradient: "from-violet-600 to-indigo-650" },
              { title: "Microsoft Graph API", icon: <Plug size={14} />, gradient: "from-sky-500 to-indigo-500" },
              { title: "MSAL Authentication", icon: <Lock size={14} />, gradient: "from-blue-700 to-indigo-600" },
              { title: "Azure App Service", icon: <Server size={14} />, gradient: "from-indigo-600 to-indigo-500" },
              { title: "Azure Cosmos DB", icon: <Database size={14} />, gradient: "from-cyan-600 to-teal-500" },
              { title: "GitHub Copilot", icon: <Github size={14} />, gradient: "from-slate-800 to-slate-700" }
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex items-center gap-3 border border-slate-200/40 bg-white p-3.5 rounded-2xl shadow-sm dark:border-zinc-850 dark:bg-zinc-900/60 hover:border-violet-500/10 transition-colors"
              >
                <div className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${badge.gradient} flex items-center justify-center text-white shadow-sm`}>
                  {badge.icon}
                </div>
                <span className="text-xs font-bold">{badge.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — STATS BAR */}
      <section className="bg-zinc-950 text-white py-16 border-b border-zinc-900 relative">
        <div className="absolute inset-0 bg-noise opacity-0.05 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
            {[
              { val: "5-Step", label: "AI Pipeline Stages" },
              { val: "Native", label: "Microsoft 365 OAuth" },
              { val: "Real-Time", label: "Kanban Board Synced" },
              { val: "Zero Setup", label: "Seeder Bypass Sandbox" }
            ].map((stat, i) => (
              <div key={i} className="pt-4 md:pt-0">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent font-outfit">
                  {stat.val}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1.5 tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — FINAL CALL TO ACTION */}
      <section className="py-28 relative flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
        <div className="absolute -inset-10 rounded-full bg-violet-600/5 blur-3xl opacity-40 -z-10" />
        
        <div className="mb-6 h-11 w-11 rounded-xl bg-violet-500/10 text-violet-650 flex items-center justify-center dark:bg-purple-500/20 dark:text-purple-400 shadow-sm animate-bounce">
          <Sparkles size={22} className="animate-pulse" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-outfit bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-350 bg-clip-text text-transparent">
          Experience FlowMind in 30 Seconds
        </h2>
        <p className="mt-4 text-sm sm:text-base text-slate-650 dark:text-zinc-400 max-w-xl leading-relaxed font-medium">
          No MSAL configuration or credentials needed. Spin up our pre-seeded hackathon demo database sandbox to test Kanban pipelines instantly.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <button
            onClick={handleTryDemo}
            className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 text-white text-xs font-extrabold uppercase tracking-wider shadow-[0_8px_24px_-8px_rgba(99,102,241,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <span>Launch Demo Workspace</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={handleSignIn}
            className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 text-slate-800 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MicrosoftIcon />
            <span>Connect Live MSAL</span>
          </button>
        </div>
      </section>

      {/* SECTION 8 — FOOTER */}
      <footer className="border-t border-slate-200 bg-white/40 dark:border-zinc-900/80 dark:bg-zinc-950/20 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-center md:text-left">
            {/* Left Column */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Activity size={14} />
                </div>
                <span className="text-base font-bold font-outfit">FlowMind</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-550 mt-1 font-semibold">Microsoft Build AI 2026 Submission</p>
            </div>

            {/* Center Column */}
            <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              <button onClick={() => navigate("/dashboard")} className="hover:text-violet-600 dark:hover:text-purple-400 transition">
                Dashboard
              </button>
              <button onClick={() => navigate("/architecture")} className="hover:text-violet-600 dark:hover:text-purple-400 transition">
                Architecture
              </button>
              <a href="https://github.com/sandeepbehera21/CodeNexus" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-purple-400 transition">
                GitHub Repo
              </a>
            </div>

            {/* Right Column */}
            <div className="text-slate-500 dark:text-zinc-550 text-xs md:text-right flex flex-col gap-1">
              <p className="font-extrabold text-slate-700 dark:text-zinc-350">Sandeep Kumar Behera</p>
              <p className="font-semibold text-[10px]">Centurion University, Odisha</p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200/50 dark:border-zinc-900/60 text-center text-[10px] text-slate-450 dark:text-zinc-650 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} FlowMind. Custom Built for Microsoft Build AI Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}
