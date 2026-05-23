import { create } from "zustand";
import type { DashboardData, PipelineRunStats } from "../types";

interface AppState {
  darkMode: boolean;
  dashboard?: DashboardData;
  lastRunStats?: PipelineRunStats;
  setDashboard: (dashboard: DashboardData) => void;
  setLastRunStats: (stats: PipelineRunStats) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  darkMode: true,
  setDashboard: (dashboard) => set({ dashboard }),
  setLastRunStats: (lastRunStats) => set({ lastRunStats }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode }))
}));
