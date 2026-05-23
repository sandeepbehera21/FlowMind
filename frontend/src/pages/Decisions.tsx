import { DecisionLog } from "../components/dashboard/DecisionLog";
import { PageHero } from "../components/layout/PageHero";
import { usePipeline } from "../hooks/usePipeline";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

export default function Decisions() {
  const { dashboard } = usePipeline();
  const decisions = dashboard?.decisions ?? [];

  const handleExport = () => {
    if (decisions.length === 0) {
      toast.error("No decisions to export.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(decisions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `flowmind_decisions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Decisions exported successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Agreed Outcomes</h2>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-microsoft hover:bg-microsoft/90 text-white px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200"
        >
          <Download className="h-4 w-4" />
          Export Decisions
        </button>
      </div>
      <PageHero
        eyebrow="Decisions"
        title="Timeline of agreed outcomes"
        description="Track choices as a chronological log with context, participants, and timestamps so the narrative is easy to explain on stage."
        aside={
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Decisions captured</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">{decisions.length}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Use this page to show how FlowMind preserves team alignment.</p>
          </div>
        }
      />
      <DecisionLog decisions={decisions} />
    </div>
  );
}

