export type Priority = "high" | "medium" | "low";
export type ActionStatus = "todo" | "in_progress" | "complete";
export type PipelineStatus = "queued" | "running" | "completed" | "failed";
export type MessageSource = "email" | "teams";

export interface User {
  id: string;
  microsoftId: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface CachedMessage {
  id: string;
  userId: string;
  source: MessageSource;
  externalId: string;
  subject: string;
  body: string;
  sender: string;
  timestamp: string;
  processed: boolean;
}

export interface PipelineRun {
  id: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  status: PipelineStatus;
  messageCount: number;
  error?: string;
  metrics?: {
    clusterDurationMs: number;
    extractDurationMs: number;
    totalDurationMs: number;
  };
}

export interface ActionItem {
  id: string;
  userId: string;
  pipelineRunId: string;
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
  userId: string;
  pipelineRunId: string;
  title: string;
  context: string;
  participants: string[];
  createdAt: string;
}

export interface Blocker {
  id: string;
  userId: string;
  pipelineRunId: string;
  title: string;
  description: string;
  severity: Priority;
  status: "open" | "resolved";
  createdAt: string;
}

export interface Summary {
  id: string;
  userId: string;
  pipelineRunId: string;
  topicCluster: string;
  summary: string;
  createdAt: string;
}

export interface AuthenticatedUser {
  microsoftId: string;
  email: string;
  name: string;
}
