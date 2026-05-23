import axios, { type AxiosInstance } from "axios";
import { randomUUID } from "node:crypto";
import type { CachedMessage } from "../types/domain.js";
import { env } from "../utils/env.js";
import { withRetry } from "../utils/retry.js";

interface GraphMailMessage {
  id: string;
  subject?: string;
  bodyPreview?: string;
  from?: { emailAddress?: { name?: string; address?: string } };
  receivedDateTime?: string;
}

interface GraphChat {
  id: string;
  topic?: string;
}

interface GraphChatMessage {
  id: string;
  body?: { content?: string };
  from?: { user?: { displayName?: string; userIdentityType?: string } };
  createdDateTime?: string;
}

interface GraphResponse<T> {
  value: T[];
  "@odata.nextLink"?: string;
}

export class GraphService {
  private client(token: string): AxiosInstance {
    return axios.create({
      baseURL: env.GRAPH_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async fetchOutlookMessages(token: string, userId: string, top = 25): Promise<CachedMessage[]> {
    const client = this.client(token);
    const response = await withRetry(
      () => client.get<GraphResponse<GraphMailMessage>>(`/me/messages?$top=${top}&$orderby=receivedDateTime desc&$select=id,subject,bodyPreview,from,receivedDateTime`),
      { retries: 2, delayMs: 600 }
    );
    return response.data.value.map((message) => ({
      id: `${userId}:email:${message.id}`,
      userId,
      source: "email",
      externalId: message.id,
      subject: message.subject ?? "Untitled email",
      body: message.bodyPreview ?? "",
      sender: message.from?.emailAddress?.name ?? message.from?.emailAddress?.address ?? "Unknown sender",
      timestamp: message.receivedDateTime ?? new Date().toISOString(),
      processed: false
    }));
  }

  async fetchTeamsMessages(token: string, userId: string, top = 10): Promise<CachedMessage[]> {
    const client = this.client(token);
    const chats = await withRetry(() => client.get<GraphResponse<GraphChat>>(`/me/chats?$top=${Math.min(top, 20)}`), { retries: 2, delayMs: 600 });
    const batches = await Promise.all(
      chats.data.value.slice(0, 5).map(async (chat) => {
        const messages = await withRetry(
          () => client.get<GraphResponse<GraphChatMessage>>(`/me/chats/${chat.id}/messages?$top=10`),
          { retries: 2, delayMs: 600 }
        );
        return messages.data.value.map((message) => ({
          id: `${userId}:teams:${message.id || randomUUID()}`,
          userId,
          source: "teams" as const,
          externalId: message.id,
          subject: chat.topic ?? "Teams conversation",
          body: message.body?.content ?? "",
          sender: message.from?.user?.displayName ?? "Teams participant",
          timestamp: message.createdDateTime ?? new Date().toISOString(),
          processed: false
        }));
      })
    );
    return batches.flat();
  }
}

export const graphService = new GraphService();
