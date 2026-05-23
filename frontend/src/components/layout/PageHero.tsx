import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-soft backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_30%)]" />
      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-violet-600 dark:text-purple-400">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white font-outfit">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-650 dark:text-zinc-400">{description}</p>
        </div>
        {aside ? (
          <div className="min-w-[220px] rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/60 backdrop-blur-md">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}