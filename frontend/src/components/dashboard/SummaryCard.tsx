import type { Summary } from "../../types";

export function SummaryCard({ summary }: { summary: Summary }) {
  return (
    <div className="relative overflow-hidden border border-slate-200 bg-white/70 hover:shadow-md transition-all duration-300 hover:scale-[1.01] dark:border-zinc-850 dark:bg-zinc-900/40 p-5 rounded-2xl backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-violet-655 dark:text-purple-400">{summary.topicCluster}</p>
      <p className="mt-3 text-sm leading-6 text-slate-655 dark:text-zinc-400">{summary.summary}</p>
    </div>
  );
}
