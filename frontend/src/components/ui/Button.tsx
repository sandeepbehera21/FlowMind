import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-microsoft/40 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-microsoft text-white shadow-[0_12px_30px_rgba(0,120,212,0.24)] hover:bg-[#106EBE] hover:shadow-[0_16px_36px_rgba(0,120,212,0.3)]",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
