import { useState } from "react";
import { flowmindApi } from "../services/api";
import { useAppStore } from "../store/useAppStore";
import type { ActionItem, ActionStatus } from "../types";

export function useActionItems() {
  const { dashboard, setDashboard } = useAppStore();
  const [saving, setSaving] = useState(false);

  const updateAction = async (id: string, patch: Partial<Pick<ActionItem, "owner" | "status">>) => {
    setSaving(true);
    try {
      const updated = await flowmindApi.updateAction(id, patch);
      if (dashboard) {
        setDashboard({ ...dashboard, actions: dashboard.actions.map((item) => (item.id === id ? updated : item)) });
      }
    } finally {
      setSaving(false);
    }
  };

  const moveAction = (id: string, status: ActionStatus) => updateAction(id, { status });
  return { actions: dashboard?.actions ?? [], saving, updateAction, moveAction };
}
