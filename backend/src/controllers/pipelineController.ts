import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { azureOpenAIService } from "../services/azureOpenAI.js";
import { pipelineService } from "../services/pipelineService.js";
import { insightRepository, pipelineRepository } from "../services/repositories.js";
import { dbService } from "../services/dbService.js";
import { collections } from "../models/collections.js";

export async function runPipeline(req: Request, res: Response): Promise<void> {
  const result = await pipelineService.run(req.user!.microsoftId);
  res.json({ ok: true, data: result });
}

export async function dashboard(req: Request, res: Response): Promise<void> {
  const result = await insightRepository.dashboard(req.user!.microsoftId);
  res.json({ ok: true, data: result });
}

export async function generateDigest(req: Request, res: Response): Promise<void> {
  const result = await insightRepository.dashboard(req.user!.microsoftId);
  try {
    const draft = await azureOpenAIService.generateDigest({
      actions: result.actions.map(({ title, owner, dueDate, priority, source_messageIds }) => ({ title, owner, dueDate, priority, source_messageIds })),
      decisions: result.decisions.map(({ title, context, participants }) => ({ title, context, participants })),
      blockers: result.blockers.map(({ title, description, severity }) => ({ title, description, severity })),
      summaries: result.summaries.map(({ topicCluster, summary }) => ({ topicCluster, summary }))
    });
    res.json({ ok: true, data: { draft } });
  } catch (error) {
    console.warn("Failed to generate AI digest, using fallback template:", error);
    const actionsText = result.actions.map(a => `- [${a.priority.toUpperCase()}] ${a.title} (Owner: ${a.owner})`).join("\n");
    const decisionsText = result.decisions.map(d => `- ${d.title} (Context: ${d.context})`).join("\n");
    const blockersText = result.blockers.map(b => `- [${b.severity.toUpperCase()}] ${b.title}: ${b.description}`).join("\n");
    
    const draft = `Subject: FlowMind Executive Daily Digest - ${new Date().toLocaleDateString()}

Dear Team,

Here is your daily workspace synthesis containing active updates from your Outlook and Teams signals.

### 📋 ACTION ITEMS
${actionsText || "No new action items."}

### 🤝 DECISIONS LOGGED
${decisionsText || "No new decisions logged."}

### ⚠️ ACTIVE BLOCKERS
${blockersText || "No active blockers."}

Best regards,
FlowMind Workspace Layer`;
    res.json({ ok: true, data: { draft } });
  }
}

export async function pipelineHistory(req: Request, res: Response): Promise<void> {
  const userId = req.user!.microsoftId;
  const history = await pipelineRepository.listHistory(userId, 10);
  res.json({ ok: true, data: history });
}

export async function demoPipelineSeeder(req: Request, res: Response): Promise<void> {
  const userId = "demo-user-id";
  const pipelineRunId = "demo-pipeline-run-id";
  
  // 1. Delete all legacy demo-user-id data in all collections
  await Promise.all([
    dbService.collection(collections.users).deleteOne({ microsoftId: userId }),
    dbService.collection(collections.pipelineRuns).deleteMany({ userId }),
    dbService.collection(collections.actionItems).deleteMany({ userId }),
    dbService.collection(collections.decisions).deleteMany({ userId }),
    dbService.collection(collections.blockers).deleteMany({ userId }),
    dbService.collection(collections.summaries).deleteMany({ userId })
  ]);
  
  // 2. Insert mock User
  await dbService.collection(collections.users).insertOne({
    id: randomUUID(),
    microsoftId: userId,
    email: "demo@flowmind.ai",
    name: "Demo Account",
    createdAt: new Date().toISOString()
  });
  
  // 3. Insert mock PipelineRun (completed)
  await dbService.collection(collections.pipelineRuns).insertOne({
    id: pipelineRunId,
    userId,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: "completed",
    messageCount: 12,
    metrics: {
      clusterDurationMs: 420,
      extractDurationMs: 980,
      totalDurationMs: 1400
    }
  });
  
  // 4. Insert mock ActionItems
  await dbService.collection(collections.actionItems).insertMany([
    {
      id: "demo-action-1",
      userId,
      pipelineRunId,
      title: "Verify Azure OpenAI endpoint keys and rates limit limits",
      owner: "Sandeep Kumar Behera",
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "high",
      status: "in_progress",
      source_messageIds: ["demo-msg-1"],
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-action-2",
      userId,
      pipelineRunId,
      title: "Draft security compliance document for Microsoft 365 Graph access",
      owner: "Security Team",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "medium",
      status: "todo",
      source_messageIds: ["demo-msg-2"],
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-action-3",
      userId,
      pipelineRunId,
      title: "Implement new dashboard components using custom tailwind class style config",
      owner: "Frontend Lead",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "high",
      status: "complete",
      source_messageIds: ["demo-msg-3"],
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-action-4",
      userId,
      pipelineRunId,
      title: "Setup Cosmos DB connection indexes and failover groups in Azure portal",
      owner: "Sandeep Kumar Behera",
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "high",
      status: "todo",
      source_messageIds: ["demo-msg-1"],
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-action-5",
      userId,
      pipelineRunId,
      title: "Schedule review meeting with Microsoft Build AI Hackathon panel",
      owner: "Product Manager",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "medium",
      status: "complete",
      source_messageIds: ["demo-msg-4"],
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-action-6",
      userId,
      pipelineRunId,
      title: "Update API rate limit parameters in rateLimiter.ts middleware",
      owner: "Backend Dev",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "low",
      status: "in_progress",
      source_messageIds: ["demo-msg-5"],
      createdAt: new Date().toISOString()
    }
  ]);
  
  // 5. Insert mock Decisions
  await dbService.collection(collections.decisions).insertMany([
    {
      id: "demo-decision-1",
      userId,
      pipelineRunId,
      title: "Migrate database from local storage to Azure Cosmos DB",
      context: "Agreed during technical sync. Cosmos DB provides the required scaling and global replication matching FlowMind requirements.",
      participants: ["Sandeep", "Architecture Lead"],
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-decision-2",
      userId,
      pipelineRunId,
      title: "Adopt TailwindCSS for all future style layouts",
      context: "Will keep design files consistent, support dark mode out of the box, and reduce stylesheet bundle size to less than 50KB.",
      participants: ["UX Designer", "Frontend Lead"],
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-decision-3",
      userId,
      pipelineRunId,
      title: "Use Azure OpenAI GPT-4o for pipeline analysis",
      context: "Agreed that GPT-4o provides the optimal trade-off between semantic extraction quality, response times, and cost limits.",
      participants: ["Sandeep", "AI Scientist"],
      createdAt: new Date().toISOString()
    }
  ]);
  
  // 6. Insert mock Blockers
  await dbService.collection(collections.blockers).insertMany([
    {
      id: "demo-blocker-1",
      userId,
      pipelineRunId,
      title: "MSAL token expiry issue on Safari private browsing",
      description: "Vite dev server token refreshes fail silently under strict iframe cookie blocking rules on Safari private mode.",
      severity: "high",
      status: "open",
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-blocker-2",
      userId,
      pipelineRunId,
      title: "Azure subscription quota limits reached for gpt-4o",
      description: "Azure OpenAI gpt-4o deployments capped. Requesting quota increase to 150k TPM.",
      severity: "medium",
      status: "resolved",
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-blocker-3",
      userId,
      pipelineRunId,
      title: "Microsoft Graph webhook latency for Teams chat subscriptions",
      description: "Webhook notifications for new messages in Teams chat show a delay of up to 45 seconds under load.",
      severity: "high",
      status: "open",
      createdAt: new Date().toISOString()
    }
  ]);
  
  // 7. Insert mock Summaries
  await dbService.collection(collections.summaries).insertMany([
    {
      id: "demo-summary-1",
      userId,
      pipelineRunId,
      topicCluster: "Infrastructure Migration",
      summary: "Discussed migrating the main backend storage to Azure Cosmos DB. Shared keys and connections details. Set up actions to confirm scale rates.",
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-summary-2",
      userId,
      pipelineRunId,
      topicCluster: "MSAL & Security Flow",
      summary: "Identified a blocker where cookie restrictions block MSAL token retrieval on Safari. Agreed to fallback to popup flows when silent requests fail.",
      createdAt: new Date().toISOString()
    },
    {
      id: "demo-summary-3",
      userId,
      pipelineRunId,
      topicCluster: "Microsoft Hackathon Timeline",
      summary: "Reviewed the milestones for Microsoft Build AI 2026 Hackathon submission. Sandeep is leading the presentation prep and architecture layouts design.",
      createdAt: new Date().toISOString()
    }
  ]);
  
  res.json({ ok: true, data: { status: "seeded" } });
}
