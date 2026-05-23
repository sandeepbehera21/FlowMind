import { ActionBoard } from "../components/dashboard/ActionBoard";
import { BlockerList } from "../components/dashboard/BlockerList";
import { DecisionLog } from "../components/dashboard/DecisionLog";
import { SummaryCard } from "../components/dashboard/SummaryCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useActionItems } from "../hooks/useActionItems";
import { usePipeline } from "../hooks/usePipeline";
import { 
  CheckSquare, 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  MessageSquare,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { dashboard, loading, lastRunStats } = usePipeline();
  const { moveAction } = useActionItems();
  
  if (loading && !dashboard) return <div className="p-8"><Skeleton className="h-[520px]" /></div>;
  const data = dashboard ?? { actions: [], decisions: [], blockers: [], summaries: [] };
  
  const counts = {
    actions: data.actions.filter((action) => action.status !== "complete").length,
    decisions: data.decisions.length,
    blockers: data.blockers.length,
    summaries: data.summaries.length
  };

  // Dynamic stats trends
  const getTrend = (type: "actions" | "decisions" | "blockers" | "summaries") => {
    if (lastRunStats) {
      if (type === "actions") {
        const diff = counts.actions - lastRunStats.actionsExtracted;
        return {
          value: diff >= 0 ? `+${diff}` : `${diff}`,
          up: diff >= 0
        };
      } else if (type === "decisions") {
        const diff = counts.decisions - lastRunStats.decisionsExtracted;
        return {
          value: diff >= 0 ? `+${diff}` : `${diff}`,
          up: diff >= 0
        };
      } else if (type === "blockers") {
        const diff = counts.blockers - lastRunStats.blockersExtracted;
        return {
          value: diff >= 0 ? `+${diff}` : `${diff}`,
          up: diff <= 0 // reduction/same amount of blockers is positive (green)
        };
      } else {
        const diff = counts.summaries - lastRunStats.summariesExtracted;
        return {
          value: diff >= 0 ? `+${diff}` : `${diff}`,
          up: diff >= 0
        };
      }
    }

    // Default trends when no run stats exist
    switch (type) {
      case "actions":
        return { value: counts.actions > 0 ? `+${Math.min(3, counts.actions)}` : "0", up: true };
      case "decisions":
        return { value: counts.decisions > 0 ? `+${Math.min(2, counts.decisions)}` : "0", up: true };
      case "blockers":
        return { value: "-1", up: true }; // less blockers is positive
      default:
        return { value: counts.summaries > 0 ? `+${Math.min(1, counts.summaries)}` : "0", up: true };
    }
  };

  const actionTrend = getTrend("actions");
  const decisionTrend = getTrend("decisions");
  const blockerTrend = getTrend("blockers");
  const summaryTrend = getTrend("summaries");

  const statsCards = [
    { 
      label: "Open Actions", 
      value: counts.actions, 
      icon: CheckSquare, 
      tone: "border-l-violet-500", 
      iconColor: "text-violet-550 dark:text-purple-400 bg-violet-500/10",
      trend: "vs last run", 
      trendValue: actionTrend.value, 
      trendUp: actionTrend.up 
    },
    { 
      label: "Decisions Logged", 
      value: counts.decisions, 
      icon: FileText, 
      tone: "border-l-indigo-500", 
      iconColor: "text-indigo-550 dark:text-indigo-400 bg-indigo-500/10",
      trend: "vs last run", 
      trendValue: decisionTrend.value, 
      trendUp: decisionTrend.up 
    },
    { 
      label: "Active Blockers", 
      value: counts.blockers, 
      icon: ShieldAlert, 
      tone: "border-l-rose-500", 
      iconColor: "text-rose-550 dark:text-rose-400 bg-rose-500/10",
      trend: "vs last run", 
      trendValue: blockerTrend.value, 
      trendUp: blockerTrend.up 
    },
    { 
      label: "Topic Summaries", 
      value: counts.summaries, 
      icon: Sparkles, 
      tone: "border-l-fuchsia-500", 
      iconColor: "text-fuchsia-550 dark:text-fuchsia-400 bg-fuchsia-500/10",
      trend: "vs last run", 
      trendValue: summaryTrend.value, 
      trendUp: summaryTrend.up 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-soft backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/60 text-slate-900 dark:text-white">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[300px] h-[300px] rounded-full bg-violet-500/10 dark:bg-violet-600/15 blur-[80px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[250px] h-[250px] rounded-full bg-indigo-500/5 dark:bg-indigo-650/10 blur-[70px] pointer-events-none -z-10" />
        
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-violet-600 dark:text-purple-400">Live Status</p>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight font-outfit bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">Microsoft 365 Intelligence Layer</h2>
            <p className="mt-3 text-sm leading-6 text-slate-650 dark:text-zinc-400 max-w-xl">
              FlowMind turns scattered work conversations into owned tasks, clear decisions, visible blockers, and executive-ready summaries.
            </p>
          </div>
          <div className="grid min-w-[240px] gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4.5 text-sm shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-zinc-550">Pipeline Status</p>
              <p className="mt-1 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                Graph Pipeline Active
              </p>
            </div>
            <div className="h-px bg-slate-200 dark:bg-zinc-800" />
            <p className="text-xs leading-5 text-slate-600 dark:text-zinc-400">Drag actions through the board, process fresh signals, and show the digest flow in one pass.</p>
          </div>
        </div>
      </section>

      {lastRunStats && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-800 dark:text-emerald-300 dark:bg-emerald-500/10 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Zap size={20} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-outfit">AI Work-Intelligence Pipeline Executed Successfully</h4>
              <p className="text-xs opacity-90 mt-0.5">
                Processed <strong className="font-bold">{lastRunStats.messagesProcessed}</strong> messages using <strong className="font-bold">{lastRunStats.model}</strong>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1 bg-white/40 dark:bg-zinc-900/40 px-2.5 py-1.5 rounded-md border border-slate-200/50 dark:border-zinc-800/50">
              <Clock size={13} className="text-slate-500 dark:text-zinc-400" />
              <span>{(lastRunStats.durationMs / 1000).toFixed(2)}s execution</span>
            </div>
            <div className="flex items-center gap-1 bg-white/40 dark:bg-zinc-900/40 px-2.5 py-1.5 rounded-md border border-slate-200/50 dark:border-zinc-800/50">
              <MessageSquare size={13} className="text-slate-500 dark:text-zinc-400" />
              <span>{lastRunStats.actionsExtracted} Actions • {lastRunStats.decisionsExtracted} Decisions • {lastRunStats.blockersExtracted} Blockers • {lastRunStats.summariesExtracted} Summaries</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div className={`rounded-2xl border border-slate-200 border-l-4 ${card.tone} bg-white/80 p-5 shadow-soft backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/40 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-zinc-300 dark:hover:border-zinc-700`} key={idx}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-zinc-550">{card.label}</p>
                  <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white font-outfit">{card.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.iconColor}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs">
                {card.trendUp ? (
                  <span className="flex items-center gap-0.5 font-extrabold text-emerald-600 dark:text-emerald-450">
                    <ArrowUpRight size={14} />
                    {card.trendValue}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 font-extrabold text-rose-600 dark:text-rose-450">
                    <ArrowDownRight size={14} />
                    {card.trendValue}
                  </span>
                )}
                <span className="text-slate-500 dark:text-zinc-500 font-medium">{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <ActionBoard items={data.actions} onMove={moveAction} isFullPage={false} />

      {/* Decisions & Blockers Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-bold font-outfit text-slate-950 dark:text-white">Recent decisions</h2>
          <DecisionLog decisions={data.decisions.slice(0, 4)} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold font-outfit text-slate-950 dark:text-white">Active blockers</h2>
          <BlockerList blockers={data.blockers.slice(0, 4)} />
        </section>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        {data.summaries.slice(0, 3).map((summary) => (
          <SummaryCard summary={summary} key={summary.id} />
        ))}
      </section>
    </div>
  );
}
