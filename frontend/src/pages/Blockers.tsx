import { BlockerList } from "../components/dashboard/BlockerList";
import { PageHero } from "../components/layout/PageHero";
import { usePipeline } from "../hooks/usePipeline";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { flowmindApi } from "../services/api";
import { useAppStore } from "../store/useAppStore";

export default function Blockers() {
  const { dashboard } = usePipeline();
  const { setDashboard } = useAppStore();
  const [blockers, setBlockers] = useState(dashboard?.blockers ?? []);

  useEffect(() => {
    if (dashboard?.blockers) {
      setBlockers(dashboard.blockers);
    }
  }, [dashboard?.blockers]);

  const openCount = blockers.filter((blocker) => blocker.status === "open").length;
  
  // Calculate specific risk levels for open blockers
  const criticalCount = blockers.filter((b) => b.severity === "high" && b.status === "open").length;
  const highCount = blockers.filter((b) => b.severity === "medium" && b.status === "open").length;
  const lowCount = blockers.filter((b) => b.severity === "low" && b.status === "open").length;

  const handleToggle = async (id: string) => {
    const blocker = blockers.find((b) => b.id === id);
    if (!blocker) return;
    
    const newStatus = blocker.status === "open" ? "resolved" : "open";
    
    // Optimistic local update
    setBlockers((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: newStatus } : b
      )
    );
    
    try {
      const updated = await flowmindApi.updateBlocker(id, { status: newStatus });
      if (dashboard) {
        setDashboard({
          ...dashboard,
          blockers: dashboard.blockers.map((b) => (b.id === id ? updated : b))
        });
      }
      toast.success(`Blocker marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update blocker status");
      // Revert optimistic update
      setBlockers((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: blocker.status } : b
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Blockers"
        title="Risk signal board"
        description="Surface unresolved blockers with severity cues and clear language so executives can see what is stopping progress at a glance."
        aside={
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Open blockers</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">{openCount}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Severity color-coding keeps the risk story immediate.</p>
          </div>
        }
      />

      {/* Summary Count Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/10">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold text-red-900 dark:text-red-300">Critical (High)</span>
          </div>
          <span className="text-2xl font-bold text-red-700 dark:text-red-400">{criticalCount}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/10">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-amber-900 dark:text-amber-300">High Risk (Med)</span>
          </div>
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">{highCount}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/20">
          <div className="flex items-center gap-2.5">
            <Info className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Low Risk</span>
          </div>
          <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">{lowCount}</span>
        </div>
      </div>

      <BlockerList blockers={blockers} onToggle={handleToggle} />
    </div>
  );
}

