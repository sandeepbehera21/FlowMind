import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { flowmindApi } from "../services/api";
import { useAppStore } from "../store/useAppStore";
import type { DashboardData } from "../types";

export function usePipeline(options: { autoRefresh?: boolean } = {}) {
  const { autoRefresh = true } = options;
  const { dashboard, setDashboard, lastRunStats, setLastRunStats } = useAppStore();
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await flowmindApi.dashboard();
      setDashboard(data);
    } catch {
      if (!dashboard) {
        toast.error("Unable to load the dashboard. Check the backend and database connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [dashboard, setDashboard]);

  const processNow = useCallback(async () => {
    const id = toast.loading("Collecting latest work signals...");
    const startTime = Date.now();
    try {
      const ingestResult = await flowmindApi.ingest();
      const messagesProcessed = (ingestResult as { cached?: number })?.cached ?? 0;

      toast.loading("Running AI work-intelligence pipeline...", { id });
      const result = await flowmindApi.runPipeline();
      const durationMs = Date.now() - startTime;

      setDashboard(result as DashboardData);

      const data = result as DashboardData;
      setLastRunStats({
        durationMs,
        messagesProcessed,
        actionsExtracted: data.actions?.length ?? 0,
        decisionsExtracted: data.decisions?.length ?? 0,
        blockersExtracted: data.blockers?.length ?? 0,
        summariesExtracted: data.summaries?.length ?? 0,
        model: "Groq Llama-3.3-70b",
        ranAt: new Date().toISOString()
      });

      toast.success(`Pipeline complete in ${(durationMs / 1000).toFixed(1)}s`, { id });
    } catch {
      toast.error("Pipeline failed. Check backend, MongoDB, and Groq settings.", { id });
    }
  }, [setDashboard, setLastRunStats]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    void refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, refresh]);

  return { dashboard, loading, refresh, processNow, lastRunStats };
}
