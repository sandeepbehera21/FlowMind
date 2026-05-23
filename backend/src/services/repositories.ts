import { randomUUID } from "node:crypto";
import { collections } from "../models/collections.js";
import type { ActionItem, Blocker, CachedMessage, Decision, PipelineRun, Summary, User } from "../types/domain.js";
import { dbService } from "./dbService.js";

export const userRepository = {
  async upsertFromMicrosoft(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const existing = await dbService.collection<User>(collections.users).findOne({ microsoftId: user.microsoftId });
    const saved: User = existing ?? { id: randomUUID(), createdAt: new Date().toISOString(), ...user };
    await dbService.upsert<User>(collections.users, saved.id, { ...saved, ...user });
    return { ...saved, ...user };
  }
};

export const messageRepository = {
  async cache(messages: CachedMessage[]): Promise<void> {
    await Promise.all(messages.map((message) => dbService.upsert<CachedMessage>(collections.messages, message.id, message)));
  },
  async latestUnprocessed(userId: string, limit = 50): Promise<CachedMessage[]> {
    return dbService.collection<CachedMessage>(collections.messages).find({ userId, processed: false }).sort({ timestamp: -1 }).limit(limit).toArray();
  },
  async markProcessed(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await dbService.collection<CachedMessage>(collections.messages).updateMany({ id: { $in: ids } }, { $set: { processed: true } });
  }
};

export const pipelineRepository = {
  async create(userId: string, messageCount: number): Promise<PipelineRun> {
    const run: PipelineRun = { id: randomUUID(), userId, messageCount, status: "running", startedAt: new Date().toISOString() };
    await dbService.upsert<PipelineRun>(collections.pipelineRuns, run.id, run);
    return run;
  },
  async complete(
    run: PipelineRun,
    status: PipelineRun["status"],
    error?: string,
    metrics?: PipelineRun["metrics"]
  ): Promise<PipelineRun> {
    const updated: PipelineRun = {
      ...run,
      status,
      error,
      metrics,
      completedAt: new Date().toISOString()
    };
    await dbService.upsert<PipelineRun>(collections.pipelineRuns, updated.id, updated);
    return updated;
  },
  async latestCompleted(userId: string): Promise<PipelineRun | null> {
    return dbService.collection<PipelineRun>(collections.pipelineRuns).findOne({ userId, status: "completed" }, { sort: { completedAt: -1 } });
  },
  async listHistory(userId: string, limit = 10): Promise<PipelineRun[]> {
    return dbService
      .collection<PipelineRun>(collections.pipelineRuns)
      .find({ userId })
      .sort({ startedAt: -1 })
      .limit(limit)
      .toArray();
  }
};

export const actionRepository = {
  async list(userId: string, pipelineRunId?: string): Promise<ActionItem[]> {
    return dbService
      .collection<ActionItem>(collections.actionItems)
      .find(pipelineRunId ? { userId, pipelineRunId } : { userId })
      .sort({ createdAt: -1 })
      .toArray();
  },
  async listPaginated(userId: string, page = 1, limit = 10): Promise<{ items: ActionItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      dbService
        .collection<ActionItem>(collections.actionItems)
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      dbService.collection<ActionItem>(collections.actionItems).countDocuments({ userId })
    ]);
    return { items, total };
  },
  async update(userId: string, id: string, patch: Partial<Pick<ActionItem, "owner" | "status">>): Promise<ActionItem | null> {
    await dbService.collection<ActionItem>(collections.actionItems).updateOne({ id, userId }, { $set: patch });
    return dbService.collection<ActionItem>(collections.actionItems).findOne({ id, userId });
  },
  async insertMany(items: ActionItem[]): Promise<void> {
    await dbService.insertMany<ActionItem>(collections.actionItems, items);
  }
};

export const decisionRepository = {
  async listPaginated(userId: string, page = 1, limit = 10): Promise<{ items: Decision[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      dbService
        .collection<Decision>(collections.decisions)
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      dbService.collection<Decision>(collections.decisions).countDocuments({ userId })
    ]);
    return { items, total };
  }
};

export const blockerRepository = {
  async listPaginated(userId: string, page = 1, limit = 10): Promise<{ items: Blocker[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      dbService
        .collection<Blocker>(collections.blockers)
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      dbService.collection<Blocker>(collections.blockers).countDocuments({ userId })
    ]);
    return { items, total };
  },
  async update(userId: string, id: string, patch: Partial<Pick<Blocker, "status">>): Promise<Blocker | null> {
    await dbService.collection<Blocker>(collections.blockers).updateOne({ id, userId }, { $set: patch });
    return dbService.collection<Blocker>(collections.blockers).findOne({ id, userId });
  }
};

export const insightRepository = {
  async dashboard(userId: string) {
    const latestRun = await pipelineRepository.latestCompleted(userId);
    const filter = latestRun ? { userId, pipelineRunId: latestRun.id } : { userId };
    const [actions, decisions, blockers, summaries] = await Promise.all([
      actionRepository.list(userId, latestRun?.id),
      dbService.collection<Decision>(collections.decisions).find(filter).sort({ createdAt: -1 }).limit(25).toArray(),
      dbService.collection<Blocker>(collections.blockers).find(filter).sort({ createdAt: -1 }).limit(25).toArray(),
      dbService.collection<Summary>(collections.summaries).find(filter).sort({ createdAt: -1 }).limit(10).toArray()
    ]);
    return { actions, decisions, blockers, summaries };
  },
  async insert(decisions: Decision[], blockers: Blocker[], summaries: Summary[]): Promise<void> {
    await Promise.all([
      dbService.insertMany<Decision>(collections.decisions, decisions),
      dbService.insertMany<Blocker>(collections.blockers, blockers),
      dbService.insertMany<Summary>(collections.summaries, summaries)
    ]);
  }
};
