import { ActionBoard } from "../components/dashboard/ActionBoard";
import { PageHero } from "../components/layout/PageHero";
import { useActionItems } from "../hooks/useActionItems";

export default function ActionItems() {
  const { actions, moveAction } = useActionItems();
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Actions"
        title="Kanban workboard"
        description="Move work through the pipeline with a focused Microsoft-style board designed for live demo walkthroughs and quick status updates."
        aside={
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Active items</p>
            <p className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">{actions.length}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Use drag and drop to show ownership changes and progress states.</p>
          </div>
        }
      />
      <ActionBoard items={actions} onMove={moveAction} isFullPage={true} />
    </div>
  );
}
