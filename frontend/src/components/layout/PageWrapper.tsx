import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.main
      className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 -z-10 h-40 rounded-[2rem] bg-gradient-to-r from-microsoft/10 via-emerald-400/10 to-transparent blur-3xl sm:inset-x-6" />
      {children}
    </motion.main>
  );
}
