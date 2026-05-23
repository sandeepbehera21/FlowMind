import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset", className)}>{children}</span>;
}
