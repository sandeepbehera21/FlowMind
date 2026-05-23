import type { Blocker } from "../../types";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export function BlockerList({ blockers, onToggle }: { blockers: Blocker[]; onToggle?: (id: string) => void }) {
  if (blockers.length === 0) {
    return (
      <Card className="text-center text-slate-500 py-12 dark:border-slate-800">
        No blockers surfaced. Nice quiet board.
      </Card>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {blockers.map((blocker) => {
        const isOpen = blocker.status === "open";
        
        let severityLabel = "Low";
        let severityBadgeClass = "bg-zinc-100 text-zinc-650 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700";
        let leftBorderColor = "border-l-zinc-450 dark:border-l-zinc-700";
        let Icon = Info;
        
        if (isOpen) {
          if (blocker.severity === "high") {
            severityLabel = "Critical";
            severityBadgeClass = "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:bg-rose-950/30 dark:text-rose-450 dark:ring-rose-500/20";
            leftBorderColor = "border-l-rose-500";
            Icon = AlertCircle;
          } else if (blocker.severity === "medium") {
            severityLabel = "High";
            severityBadgeClass = "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:bg-amber-950/30 dark:text-amber-450 dark:ring-amber-500/20";
            leftBorderColor = "border-l-amber-500";
            Icon = AlertTriangle;
          }
        } else {
          severityLabel = "Resolved";
          severityBadgeClass = "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-450 dark:ring-emerald-500/20";
          leftBorderColor = "border-l-emerald-500";
          Icon = CheckCircle2;
        }

        return (
          <div
            key={blocker.id}
            className={`relative overflow-hidden border-l-4 ${leftBorderColor} border-t border-r border-b border-slate-200 bg-white/70 hover:shadow-md transition-all duration-300 hover:scale-[1.01] dark:border-zinc-850 dark:bg-zinc-900/40 p-5 rounded-2xl backdrop-blur-md ${
              !isOpen ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 min-w-0 flex-1">
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${
                  isOpen 
                    ? blocker.severity === "high" 
                      ? "text-rose-500" 
                      : blocker.severity === "medium" 
                        ? "text-amber-500" 
                        : "text-slate-400" 
                    : "text-emerald-500"
                }`} />
                <div className="min-w-0 flex-1">
                  <h3 className={`text-base font-bold tracking-tight text-slate-900 dark:text-white font-outfit ${!isOpen ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>
                    {blocker.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-650 dark:text-zinc-400">
                    {blocker.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3 shrink-0">
                <Badge className={severityBadgeClass}>
                  {severityLabel}
                </Badge>
                <Button
                  variant={isOpen ? "secondary" : "ghost"}
                  className={`!min-h-8 h-8 px-3 text-xs font-bold ${
                    isOpen ? "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:bg-emerald-950/20" : ""
                  }`}
                  onClick={() => onToggle && onToggle(blocker.id)}
                >
                  {isOpen ? "Resolve" : "Re-open"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
