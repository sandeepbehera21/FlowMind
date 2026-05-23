import type { Decision } from "../../types";
import { formatDate } from "../../utils/formatDate";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "from-violet-600 to-indigo-600 text-white",
  "from-indigo-600 to-purple-600 text-white",
  "from-purple-600 to-fuchsia-600 text-white",
  "from-fuchsia-600 to-rose-600 text-white",
  "from-emerald-500 to-teal-650 text-white",
  "from-amber-500 to-orange-650 text-white",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function DecisionLog({ decisions }: { decisions: Decision[] }) {
  if (decisions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-12 text-center text-slate-500 dark:border-zinc-850 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm">
        No decisions detected yet.
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-200/80 dark:border-zinc-800 ml-4 pl-8 space-y-8">
      {decisions.map((decision) => (
        <div key={decision.id} className="relative">
          {/* Timeline Dot Connector */}
          <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-violet-500 bg-white dark:bg-zinc-950">
            <div className="h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_#8b5cf6]" />
          </div>

          {/* Decision Card */}
          <div className="overflow-hidden border-l-4 border-l-violet-500/80 border-t border-r border-b border-slate-200 bg-white/70 hover:shadow-md transition-all duration-300 hover:scale-[1.01] dark:border-zinc-850 dark:bg-zinc-900/40 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-violet-650 dark:text-purple-400">
                  Decision Outcome
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white font-outfit">
                  {decision.title}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-200/10">
                {formatDate(decision.createdAt)}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-650 dark:text-zinc-400">
              {decision.context}
            </p>

            {/* Participants Avatar Row */}
            {decision.participants && decision.participants.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-150 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-450 dark:text-zinc-500">
                    Participants:
                  </span>
                  <div className="flex -space-x-2 overflow-hidden">
                    {decision.participants.map((participant) => (
                      <div
                        key={participant}
                        title={participant}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ring-2 ring-white dark:ring-zinc-900 bg-gradient-to-br ${getAvatarColor(
                          participant
                        )}`}
                      >
                        {getInitials(participant)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-400 dark:text-zinc-500 italic">
                  Agreed in discussion
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

