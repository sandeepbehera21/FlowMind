import { useState, useRef, useEffect } from "react";
import { Activity, Moon, Play, Sun, LogOut, ChevronDown, Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useAppStore } from "../../store/useAppStore";
import type { User } from "../../types";

interface HeaderProps {
  onProcess: () => void;
  user: User | null;
  onLogout: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Returns a clean first name for greeting — avoids generic org/system names
const GENERIC_NAMES = /^(microsoft|user|admin|account|team|no.?reply|support|alert|notification)$/i;
const getFirstName = (user?: { name?: string; email?: string } | null): string => {
  if (!user) return "";
  const first = (user.name ?? "").split(/\s+/)[0];
  if (first && !GENERIC_NAMES.test(first)) return first;
  // Fall back to email prefix if name is generic
  if (user.email && user.email.includes("@")) {
    const prefix = user.email.split("@")[0].replace(/[._-]/g, " ").split(" ")[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return "";
};

export function Header({ onProcess, user, onLogout }: HeaderProps) {
  const { darkMode, toggleDarkMode } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 bg-white/70 px-4 py-4.5 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/45 sm:px-6">
      <div className="min-w-0">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-450 shadow-[0_2px_8px_-4px_rgba(16,185,129,0.1)]">
          <Activity size={12} className="animate-pulse" />
          Microsoft Graph Connected
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl font-outfit">
          Good to see you{getFirstName(user) ? `, ${getFirstName(user)}` : ""}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
          Actions, decisions, blockers, and summaries from your work stream.
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <Button 
          variant="secondary" 
          onClick={toggleDarkMode} 
          aria-label="Toggle dark mode" 
          className="!min-h-10 !h-10 !w-10 !p-0 border border-slate-200/80 hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 hover:scale-[1.03] transition-all duration-300 rounded-xl"
        >
          {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-indigo-600" />}
        </Button>

        {/* Process Now CTA */}
        <button
          onClick={onProcess}
          className="inline-flex h-10 items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 rounded-xl shadow-[0_4px_12px_-4px_rgba(99,102,241,0.4)] hover:scale-[1.02] transform transition-all duration-300 active:scale-[0.98]"
        >
          <Play size={14} className="fill-current" />
          <span>Process Now</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/50 p-1 pr-3 text-slate-700 transition duration-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-[0_2px_8px_rgba(124,58,237,0.3)]">
              {getInitials(user?.name)}
            </div>
            <span className="hidden text-xs font-bold tracking-wide sm:inline-block max-w-[120px] truncate">
              {user?.name || "Account"}
            </span>
            <ChevronDown size={12} className={`transition-transform duration-250 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-slate-200/60 bg-white p-1.5 shadow-xl dark:border-zinc-850 dark:bg-zinc-900 z-50 backdrop-blur-xl"
              >
                <div className="px-3 py-2.5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">Signed in as</p>
                  <p className="mt-0.5 font-bold text-slate-800 dark:text-zinc-100 text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate flex items-center gap-1 mt-1">
                    <Mail size={12} className="shrink-0 text-slate-400 dark:text-zinc-500" />
                    {user?.email}
                  </p>
                </div>
                
                <div className="mx-1.5 mb-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 p-2 border border-slate-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-zinc-400 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    M365 Integration Active
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-zinc-800 my-1 mx-1.5" />
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50/50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition duration-150"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
