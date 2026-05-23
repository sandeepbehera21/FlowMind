import { randomUUID } from "node:crypto";
import type { ActionItem, Blocker, Decision, Summary } from "../types/domain.js";
import { azureOpenAIService } from "./azureOpenAI.js";
import { actionRepository, insightRepository, messageRepository, pipelineRepository } from "./repositories.js";

export class PipelineService {
  async run(userId: string) {
    const messages = await messageRepository.latestUnprocessed(userId, 75);
    const run = await pipelineRepository.create(userId, messages.length);
    const startMs = Date.now();
    
    console.log(`[Pipeline] Starting run ${run.id} for user ${userId} with ${messages.length} unprocessed messages.`);
    
    try {
      const clusterStartMs = Date.now();
      const clusters = await azureOpenAIService.clusterMessages(messages);
      const clusterDurationMs = Date.now() - clusterStartMs;
      console.log(`[Pipeline] Completed clustering in ${clusterDurationMs}ms.`);

      const extractStartMs = Date.now();
      const insights = await azureOpenAIService.extractInsights(messages, clusters);
      const extractDurationMs = Date.now() - extractStartMs;
      console.log(`[Pipeline] Completed insights extraction in ${extractDurationMs}ms.`);

      const totalDurationMs = Date.now() - startMs;
      console.log(`[Pipeline] Success! Total pipeline execution time: ${totalDurationMs}ms.`);

      const now = new Date().toISOString();

      const actions: ActionItem[] = insights.actions.map((item) => ({
        id: randomUUID(),
        userId,
        pipelineRunId: run.id,
        title: item.title,
        owner: item.owner,
        dueDate: item.dueDate,
        priority: item.priority,
        status: "todo",
        source_messageIds: item.source_messageIds,
        createdAt: now
      }));
      
      const decisions: Decision[] = insights.decisions.map((item) => ({
        id: randomUUID(),
        userId,
        pipelineRunId: run.id,
        createdAt: now,
        ...item
      }));
      
      const blockers: Blocker[] = insights.blockers.map((item) => ({
        id: randomUUID(),
        userId,
        pipelineRunId: run.id,
        status: "open",
        createdAt: now,
        ...item
      }));
      
      const summaries: Summary[] = insights.summaries.map((item) => ({
        id: randomUUID(),
        userId,
        pipelineRunId: run.id,
        createdAt: now,
        ...item
      }));

      await Promise.all([
        actionRepository.insertMany(actions),
        insightRepository.insert(decisions, blockers, summaries),
        messageRepository.markProcessed(messages.map((m) => m.id))
      ]);
      
      const completedRun = await pipelineRepository.complete(run, "completed", undefined, {
        clusterDurationMs,
        extractDurationMs,
        totalDurationMs
      });
      
      return { run: completedRun, actions, decisions, blockers, summaries };
    } catch (error) {
      console.error(`[Pipeline] Run ${run.id} failed:`, error);
      const totalDurationMs = Date.now() - startMs;
      await pipelineRepository.complete(run, "failed", error instanceof Error ? error.message : "Unknown pipeline error", {
        clusterDurationMs: 0,
        extractDurationMs: 0,
        totalDurationMs
      });
      throw error;
    }
  }
}

export const pipelineService = new PipelineService();
