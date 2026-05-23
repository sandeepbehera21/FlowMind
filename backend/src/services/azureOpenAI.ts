/* eslint-disable @typescript-eslint/no-explicit-any */
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { z } from "zod";
import type { CachedMessage } from "../types/domain.js";
import { env } from "../utils/env.js";
import { UpstreamError } from "../utils/errors.js";
import { withRetry } from "../utils/retry.js";

const clusterSchema = z.object({
  clusters: z.array(z.object({ topic: z.string(), messageIds: z.array(z.string()), summaryHint: z.string() }))
});

const insightSchema = z.object({
  actions: z.array(
    z.object({
      title: z.string(),
      owner: z.string(),
      dueDate: z.string().optional(),
      priority: z.enum(["high", "medium", "low"]),
      source_messageIds: z.array(z.string())
    })
  ),
  decisions: z.array(z.object({ title: z.string(), context: z.string(), participants: z.array(z.string()) })),
  blockers: z.array(z.object({ title: z.string(), description: z.string(), severity: z.enum(["high", "medium", "low"]) })),
  summaries: z.array(z.object({ topicCluster: z.string(), summary: z.string() }))
});

export type ClusterOutput = z.infer<typeof clusterSchema>;
export type InsightOutput = z.infer<typeof insightSchema>;

function preprocessInsights(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  const cleanActions = Array.isArray(obj.actions)
    ? obj.actions.map((act: any) => {
        if (!act || typeof act !== "object") return act;
        return {
          ...act,
          owner: act.owner ?? "Unassigned",
          dueDate: act.dueDate === null ? undefined : act.dueDate
        };
      })
    : [];

  const cleanDecisions = Array.isArray(obj.decisions)
    ? obj.decisions.map((dec: any) => {
        if (!dec || typeof dec !== "object") return dec;
        return {
          ...dec,
          participants: Array.isArray(dec.participants)
            ? dec.participants.filter((p: any) => typeof p === "string")
            : []
        };
      })
    : [];

  return {
    ...obj,
    actions: cleanActions,
    decisions: cleanDecisions
  };
}

const systemPrompt = "You are FlowMind, a deterministic work-intelligence extraction engine. Return only valid JSON matching the requested schema. Do not include markdown.";

export class AzureOpenAIService {
  private client?: OpenAIClient;

  private getClient(): OpenAIClient {
    if (!env.AZURE_OPENAI_ENDPOINT || !env.AZURE_OPENAI_KEY) {
      throw new UpstreamError("Azure OpenAI is not configured");
    }
    this.client ??= new OpenAIClient(env.AZURE_OPENAI_ENDPOINT, new AzureKeyCredential(env.AZURE_OPENAI_KEY));
    return this.client;
  }

  private parseJsonSchema<T>(raw: string, schema: z.ZodSchema<T>): T {
    const cleaned = raw.replace(/^```json/i, "").replace(/```$/i, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      const preprocessed = (schema as any) === insightSchema ? preprocessInsights(parsed) : parsed;
      return schema.parse(preprocessed);
    } catch (err) {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start >= 0 && end > start) {
        const parsed = JSON.parse(cleaned.slice(start, end + 1));
        const preprocessed = (schema as any) === insightSchema ? preprocessInsights(parsed) : parsed;
        return schema.parse(preprocessed);
      }
      throw err;
    }
  }

  private async completeAndValidate<T>(
    initialMessages: { role: "system" | "user"; content: string }[],
    schema: z.ZodSchema<T>,
    fallback: T
  ): Promise<T> {
    let rawResponse = "";
    try {
      rawResponse = await this.completeJson(initialMessages);
      return this.parseJsonSchema(rawResponse, schema);
    } catch (firstError) {
      console.warn("[AzureOpenAI] JSON parsing/validation failed on first attempt. Trying repair prompt...", firstError);
      
      const repairMessages = [
        ...initialMessages,
        { role: "user" as const, content: rawResponse || "(No response received)" },
        {
          role: "user" as const,
          content: `Your previous response was invalid JSON or did not match the required schema. Return ONLY a valid, raw JSON object matching the requested schema. Do not include any explanations, markdown block markers, or extra text. Schema to match: ${JSON.stringify((schema as any).shape || schema)}`
        }
      ];

      try {
        const repairResponse = await this.completeJson(repairMessages);
        return this.parseJsonSchema(repairResponse, schema);
      } catch (repairError) {
        console.error("[AzureOpenAI] JSON repair failed. Returning fallback.", repairError);
        return fallback;
      }
    }
  }

  async clusterMessages(messages: CachedMessage[]): Promise<ClusterOutput> {
    const payload = messages.map(({ id, source, subject, body, sender, timestamp }) => ({ id, source, subject, body, sender, timestamp }));
    const initialMessages = [
      { role: "system" as const, content: systemPrompt },
      {
        role: "user" as const,
        content: `Prompt version: cluster-v1. Group related work messages by topic. Schema: {"clusters":[{"topic":"string","messageIds":["id"],"summaryHint":"string"}]}. Messages: ${JSON.stringify(payload)}`
      }
    ];
    return this.completeAndValidate(
      initialMessages,
      clusterSchema,
      { clusters: messages.map((message) => ({ topic: message.subject, messageIds: [message.id], summaryHint: message.body.slice(0, 160) })) }
    );
  }

  async extractInsights(messages: CachedMessage[], clusters: ClusterOutput): Promise<InsightOutput> {
    const payload = messages.map(({ id, source, subject, body, sender, timestamp }) => ({ id, source, subject, body, sender, timestamp }));
    const initialMessages = [
      { role: "system" as const, content: systemPrompt },
      {
        role: "user" as const,
        content: `Prompt version: insights-v1. Run these steps: action item extraction, decision extraction, blocker detection, priority scoring high/medium/low, and concise topic summaries. Use ISO dates when due dates are explicit. Schema: {"actions":[{"title":"string","owner":"string","dueDate":"optional ISO date","priority":"high|medium|low","source_messageIds":["id"]}],"decisions":[{"title":"string","context":"string","participants":["name"]}],"blockers":[{"title":"string","description":"string","severity":"high|medium|low"}],"summaries":[{"topicCluster":"string","summary":"string"}]}. Clusters: ${JSON.stringify(clusters)} Messages: ${JSON.stringify(payload)}`
      }
    ];
    
    const fallbackVal = this.fallbackInsights(messages);
    const parsed = await this.completeAndValidate(
      initialMessages,
      insightSchema,
      fallbackVal
    );
    
    if (parsed.actions.length === 0 && parsed.decisions.length === 0 && parsed.blockers.length === 0 && parsed.summaries.length === 0 && messages.length > 0) {
      return fallbackVal;
    }
    return parsed;
  }

  async generateDigest(insights: InsightOutput): Promise<string> {
    return this.completeJson([
      { role: "system", content: "You draft executive daily digest emails. Return a plain email draft, not JSON." },
      { role: "user", content: `Create a concise daily digest from these FlowMind insights: ${JSON.stringify(insights)}` }
    ]);
  }

  private async completeJson(messages: { role: "system" | "user"; content: string }[]): Promise<string> {
    if (env.AI_PROVIDER === "groq") {
      return this.completeWithGroq(messages);
    }

    const response = await withRetry(
      () =>
        this.getClient().getChatCompletions(env.AZURE_OPENAI_DEPLOYMENT, messages, {
          temperature: 0.2,
          maxTokens: 1800
        }),
      { retries: 2, delayMs: 1000 }
    );
    const content = response.choices[0]?.message?.content;
    if (!content) throw new UpstreamError("Azure OpenAI returned an empty response");
    return content;
  }

  private async completeWithGroq(messages: { role: "system" | "user"; content: string }[]): Promise<string> {
    if (!env.GROQ_API_KEY) throw new UpstreamError("Groq API key is not configured");
    const response = await withRetry(
      () =>
        fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: env.GROQ_MODEL,
            messages,
            temperature: 0.2,
            max_tokens: 1800
          })
        }),
      { retries: 2, delayMs: 1000 }
    );
    if (!response.ok) throw new UpstreamError(`Groq request failed with status ${response.status}`);
    const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = body.choices?.[0]?.message?.content;
    if (!content) throw new UpstreamError("Groq returned an empty response");
    return content;
  }

  private parseWithFallback<T>(raw: string, schema: z.ZodSchema<T>, fallback: T): T {
    const cleaned = raw.replace(/^```json/i, "").replace(/```$/i, "").trim();
    try {
      return schema.parse(JSON.parse(cleaned));
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start >= 0 && end > start) {
        try {
          return schema.parse(JSON.parse(cleaned.slice(start, end + 1)));
        } catch {
          return fallback;
        }
      }
      return fallback;
    }
  }

  private fallbackInsights(messages: CachedMessage[]): InsightOutput {
    const sentenceEntries = messages.flatMap((message) =>
      message.body
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean)
        .map((sentence) => ({ message, sentence }))
    );

    const ownerFromSentence = (sentence: string, fallback: string) => {
      const actionMatch = /(?:Action(?: item)?:\s*)?([A-Z][a-z]+)\s+(?:will|needs to|owns|is blocked|confirmed|noticed)/.exec(sentence);
      const forMatch = /for\s+([A-Z][a-z]+)/.exec(sentence);
      return actionMatch?.[1] ?? forMatch?.[1] ?? fallback;
    };

    const priorityFromSentence = (sentence: string) => {
      const lower = sentence.toLowerCase();
      if (lower.includes("blocked") || lower.includes("security") || lower.includes("deployment")) return "high" as const;
      if (lower.includes("tomorrow") || lower.includes("friday") || lower.includes("needs")) return "medium" as const;
      return "low" as const;
    };

    const actionSentences = sentenceEntries.filter(({ sentence }) => /action|will|needs to|owns/i.test(sentence));
    const decisionSentences = sentenceEntries.filter(({ sentence }) => /decision|agreed|confirmed/i.test(sentence));
    const blockerSentences = sentenceEntries.filter(({ sentence }) => /blocker|blocked|waiting|stuck/i.test(sentence));

    return {
      actions: actionSentences.slice(0, 8).map(({ message, sentence }) => ({
        title: sentence.replace(/^Action(?: item)?:\s*/i, ""),
        owner: ownerFromSentence(sentence, message.sender),
        priority: priorityFromSentence(sentence),
        source_messageIds: [message.id]
      })),
      decisions: decisionSentences.slice(0, 8).map(({ message, sentence }) => ({
        title: sentence.replace(/^Decision:\s*/i, ""),
        context: `${message.subject}: ${sentence}`,
        participants: [message.sender]
      })),
      blockers: blockerSentences.slice(0, 6).map(({ sentence }) => ({
        title: sentence.replace(/^Blocker:\s*/i, ""),
        description: sentence,
        severity: priorityFromSentence(sentence)
      })),
      summaries: messages.slice(0, 6).map((message) => ({
        topicCluster: message.subject,
        summary: message.body.length > 220 ? `${message.body.slice(0, 217)}...` : message.body
      }))
    };
  }
}

export const azureOpenAIService = new AzureOpenAIService();
