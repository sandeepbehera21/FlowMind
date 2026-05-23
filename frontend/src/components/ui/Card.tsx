import { forwardRef, type ReactNode } from "react";
import { clsx } from "clsx";

export const Card = forwardRef<HTMLElement, { children: ReactNode; className?: string }>(function Card({ children, className, ...props }, ref) {
  return (
    <section ref={ref} className={clsx("rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/90", className)} {...props}>
      {children}
    </section>
  );
});
