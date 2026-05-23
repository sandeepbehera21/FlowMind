export type Priority = "high" | "medium" | "low";
export type ActionStatus = "todo" | "in_progress" | "complete";

export interface User {
  id: string;
  microsoftId: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  owner: string;
  dueDate?: string;
  priority: Priority;
  status: ActionStatus;
  source_messageIds: string[];
  createdAt: string;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  participants: string[];
  createdAt: string;
}

export interface Blocker {
  id: string;
  title: string;
  description: string;
  severity: Priority;
  status: "open" | "resolved";
  createdAt: string;
}

export interface Summary {
  id: string;
  topicCluster: string;
  summary: string;
  createdAt: string;
}

export interface DashboardData {
  actions: ActionItem[];
  decisions: Decision[];
  blockers: Blocker[];
  summaries: Summary[];
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  error?: { code: string; message: string };
}

export interface PipelineRunStats {
  durationMs: number;
  messagesProcessed: number;
  actionsExtracted: number;
  decisionsExtracted: number;
  blockersExtracted: number;
  summariesExtracted: number;
  model: string;
  ranAt: string;
}

