import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Calendar, User, GripVertical, CheckCircle2 } from "lucide-react";
import type { ActionItem, ActionStatus, Priority } from "../../types";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatDate";

const columns: { id: ActionStatus; title: string }[] = [
  { id: "todo", title: "To do" },
  { id: "in_progress", title: "In progress" },
  { id: "complete", title: "Complete" }
];

const columnHeaderStyles: Record<ActionStatus, { text: string; border: string; bg: string; dot: string }> = {
  todo: { text: "text-violet-600 dark:text-violet-400 font-extrabold", border: "border-t-violet-500", bg: "bg-violet-500/5 dark:bg-violet-550/10 border border-violet-500/10 dark:border-violet-500/5", dot: "bg-violet-500" },
  in_progress: { text: "text-fuchsia-600 dark:text-fuchsia-400 font-extrabold", border: "border-t-fuchsia-500", bg: "bg-fuchsia-500/5 dark:bg-fuchsia-550/10 border border-fuchsia-500/10 dark:border-fuchsia-500/5", dot: "bg-fuchsia-500" },
  complete: { text: "text-emerald-600 dark:text-emerald-400 font-extrabold", border: "border-t-emerald-500", bg: "bg-emerald-500/5 dark:bg-emerald-550/10 border border-emerald-500/10 dark:border-emerald-500/5", dot: "bg-emerald-500" }
};

const priorityBorderLeft: Record<Priority, string> = {
  high: "border-l-4 border-l-rose-500/80",
  medium: "border-l-4 border-l-amber-500/80",
  low: "border-l-4 border-l-indigo-500/80"
};

const priorityColors: Record<Priority, string> = {
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20 dark:bg-rose-950/30 dark:ring-rose-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 dark:bg-amber-950/30 dark:ring-amber-500/20",
  low: "bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 ring-1 ring-indigo-500/20 dark:bg-indigo-950/30 dark:ring-indigo-500/20"
};

const getInitials = (name: string) => {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export function ActionBoard({ 
  items, 
  onMove,
  isFullPage = false
}: { 
  items: ActionItem[]; 
  onMove: (id: string, status: ActionStatus) => void;
  isFullPage?: boolean;
}) {
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [ownerSearch, setOwnerSearch] = useState<string>("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onMove(result.draggableId, result.destination.droppableId as ActionStatus);
  };

  const filteredItems = items.filter((item) => {
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    const matchesOwner = item.owner.toLowerCase().includes(ownerSearch.toLowerCase());
    return matchesPriority && matchesOwner;
  });

  const activeColumns = columns.filter((col) => statusTab === "all" || col.id === statusTab);

  return (
    <div className="space-y-4">
      {isFullPage && (
        <div className="flex flex-wrap gap-4 items-end justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40 backdrop-blur shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Priority Dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Priority Filter</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white dark:bg-zinc-900/60 dark:border-zinc-800 px-3 py-1.5 text-sm text-slate-750 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Owner Search */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-550">Owner Name</span>
              <input
                type="text"
                placeholder="Search owner..."
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white dark:bg-zinc-900/60 dark:border-zinc-800 px-3 py-1.5 text-sm text-slate-750 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-zinc-550">Kanban Lane</span>
            <div className="flex rounded-lg bg-slate-150 dark:bg-zinc-950 p-1 border border-slate-200/40 dark:border-zinc-800">
              {[{ id: "all", title: "All Lanes" }, ...columns].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusTab(tab.id)}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    statusTab === tab.id
                      ? "bg-white text-slate-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-zinc-350"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={`grid gap-4 ${isFullPage && statusTab !== "all" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
          {activeColumns.map((column) => {
            const columnItems = filteredItems.filter((item) => item.status === column.id);
            const style = columnHeaderStyles[column.id];
            
            return (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps} 
                    className={`min-h-[420px] rounded-2xl border border-t-4 border-slate-200/85 bg-white/70 p-4 shadow-soft backdrop-blur-md dark:border-zinc-850 dark:bg-zinc-950/40 ${style.border}`}
                  >
                    <div className={`mb-4 flex items-center justify-between rounded-xl px-3 py-2 ${style.bg}`}>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                        <h2 className={`font-extrabold text-sm ${style.text}`}>{column.title}</h2>
                      </div>
                      <Badge className="bg-white text-slate-700 ring-slate-200/50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800">{columnItems.length}</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {columnItems.map((item, index) => (
                        <Draggable draggableId={item.id} index={index} key={item.id}>
                          {(dragProvided) => (
                            <div
                              className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.015] hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/50 hover:dark:border-zinc-700 hover:dark:bg-zinc-900/70 hover:shadow-md ${
                                isFullPage ? priorityBorderLeft[item.priority] : ""
                              }`}
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...(!isFullPage ? dragProvided.dragHandleProps : {})}
                            >
                              <div className="flex items-start gap-2">
                                {isFullPage && (
                                  <div 
                                    {...dragProvided.dragHandleProps} 
                                    className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab shrink-0"
                                  >
                                    <GripVertical size={16} />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-sm font-bold leading-5 text-slate-950 dark:text-white font-outfit">{item.title}</h3>
                                    {!isFullPage && (
                                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${priorityColors[item.priority]}`}>
                                        {item.priority}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap gap-2 items-center">
                                      {isFullPage ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-zinc-350 border border-zinc-200/10">
                                          <User size={12} className="text-violet-500" />
                                          {item.owner}
                                        </span>
                                      ) : (
                                        <div 
                                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-650 to-indigo-650 text-[9px] font-extrabold text-white shadow-sm border border-violet-550/10"
                                          title={`Owner: ${item.owner}`}
                                        >
                                          {getInitials(item.owner)}
                                        </div>
                                      )}
                                      
                                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 dark:bg-zinc-800/40 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 border border-zinc-200/5 dark:border-zinc-800/40">
                                        <Calendar size={12} className="text-indigo-500" />
                                        {formatDate(item.dueDate)}
                                      </span>

                                      <span 
                                        className="inline-flex items-center gap-1.5 rounded-md bg-violet-500/5 dark:bg-purple-950/20 px-2 py-0.5 text-xs font-semibold text-violet-600 dark:text-purple-400 border border-violet-500/10 dark:border-purple-500/10 cursor-help"
                                        title="Automatically extracted from Microsoft 365 signals with high confidence based on topic cluster analysis."
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                                        AI Extracted
                                      </span>
                                    </div>
                                    
                                    {isFullPage && item.status !== "complete" && (
                                      <button
                                        onClick={() => onMove(item.id, "complete")}
                                        className="inline-flex items-center gap-1 rounded-md border border-emerald-600 px-2 py-0.5 text-[10px] font-bold text-emerald-650 dark:text-emerald-450 hover:bg-emerald-500/10 transition-colors"
                                        title="Quick resolve"
                                      >
                                        <CheckCircle2 size={10} />
                                        Complete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columnItems.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-350 dark:border-zinc-800 p-6 text-center text-sm text-slate-400 dark:text-zinc-600">
                          No items here
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
