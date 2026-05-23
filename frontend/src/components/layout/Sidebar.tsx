import { CheckSquare, FileText, GitBranch, LayoutDashboard, ShieldAlert, Sparkles, Users, Activity } from "lucide-react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/actions", label: "Actions", icon: CheckSquare },
  { to: "/decisions", label: "Decisions", icon: FileText },
  { to: "/blockers", label: "Blockers", icon: ShieldAlert },
  { to: "/digest", label: "Digest", icon: Sparkles },
  { to: "/standup", label: "Standup Hub", icon: Users },
  { to: "/architecture", label: "Architecture", icon: GitBranch }
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/60 bg-white/70 px-5 py-6 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70 lg:block select-none">
      {/* Brand Header */}
      <div className="mb-10 flex items-center gap-3.5 px-3">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_8px_16px_rgba(99,102,241,0.3)] dark:shadow-[0_8px_20px_rgba(124,58,237,0.15)]">
          <Activity size={20} className="animate-pulse" />
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-[4px] opacity-30 -z-10" />
        </div>
        <div>
          <p className="text-base font-extrabold tracking-wider text-slate-900 dark:text-white font-outfit">FlowMind</p>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Workspace Layer</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="space-y-1.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "group relative flex items-center gap-3 rounded-xl px-4.5 py-3 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-violet-600/10 text-violet-600 border border-violet-500/20 shadow-[0_2px_8px_-4px_rgba(124,58,237,0.1)] dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/15"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200 border border-transparent"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={clsx(
                  "transition-colors duration-300",
                  isActive ? "text-violet-600 dark:text-purple-300" : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-350"
                )} />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <span className="absolute left-0 top-1/3 bottom-1/3 w-1 rounded-r bg-violet-600 dark:bg-purple-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mini Hackathon Badge in Footer */}
      <div className="absolute bottom-6 left-5 right-5 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Build AI 2026</span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-450 dark:text-zinc-500">
          Centurion University entry by Sandeep Kumar Behera.
        </p>
      </div>
    </aside>
  );
}
