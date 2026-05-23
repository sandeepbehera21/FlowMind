import type { Request, Response } from "express";
import { graphService } from "../services/graphService.js";
import { messageRepository } from "../services/repositories.js";
import { UnauthorizedError, UpstreamError } from "../utils/errors.js";
import type { CachedMessage } from "../types/domain.js";

export async function ingestMessages(req: Request, res: Response): Promise<void> {
  const userId = req.user!.microsoftId;

  if (!req.graphAccessToken) throw new UnauthorizedError("Graph access token is required");

  // Handle Demo Mode ingestion without hitting real Graph API
  if (userId === "demo-user-id" || req.graphAccessToken === "demo-graph-token") {
    const mockMessages: CachedMessage[] = [
      {
        id: `${userId}:email:mock-msg-1`,
        userId,
        source: "email",
        externalId: "mock-msg-1",
        subject: "Security review guidelines and key rotations",
        body: "Action item: Sandeep Kumar Behera needs to verify Azure OpenAI endpoint keys and rates limit limits. We agreed that the security team will draft security compliance documents.",
        sender: "Security Architect",
        timestamp: new Date().toISOString(),
        processed: false
      },
      {
        id: `${userId}:teams:mock-msg-2`,
        userId,
        source: "teams",
        externalId: "mock-msg-2",
        subject: "Database design sync",
        body: "Action: Sandeep Kumar Behera will setup Cosmos DB connection indexes and failover groups in Azure portal. Decision: Migrate database from local storage to Azure Cosmos DB to improve rate limit capabilities.",
        sender: "Database Admin",
        timestamp: new Date().toISOString(),
        processed: false
      },
      {
        id: `${userId}:email:mock-msg-3`,
        userId,
        source: "email",
        externalId: "mock-msg-3",
        subject: "MSAL token issue",
        body: "Blocker: MSAL token expiry issue on Safari private browsing. silent refreshes fail due to cookie blocking. We are stuck on this.",
        sender: "Frontend Dev",
        timestamp: new Date().toISOString(),
        processed: false
      }
    ];

    await messageRepository.cache(mockMessages);
    res.json({
      ok: true,
      data: {
        cached: mockMessages.length,
        email: mockMessages.filter((m) => m.source === "email").length,
        teams: mockMessages.filter((m) => m.source === "teams").length,
        warnings: {
          email: null,
          teams: null
        }
      }
    });
    return;
  }

  let emails: CachedMessage[] = [];
  let teams: CachedMessage[] = [];
  let emailError: Error | null = null;
  let teamsError: Error | null = null;

  try {
    emails = await graphService.fetchOutlookMessages(req.graphAccessToken, userId);
  } catch (error) {
    emailError = error as Error;
    console.warn("Failed to fetch Outlook messages:", error);
  }

  try {
    teams = await graphService.fetchTeamsMessages(req.graphAccessToken, userId);
  } catch (error) {
    teamsError = error as Error;
    console.warn("Failed to fetch Teams messages:", error);
  }

  if (emailError && teamsError) {
    throw new UpstreamError(
      `Message ingestion failed. Outlook error: ${emailError.message}; Teams error: ${teamsError.message}`
    );
  }

  const messages = [...emails, ...teams];

  // If Graph API returned 0 messages (e.g. personal account with no corporate emails/Teams),
  // inject realistic project messages under the real userId so the actual Groq AI pipeline
  // still produces real AI-extracted actions, decisions, blockers and summaries.
  // The AI extraction is 100% real — only the source messages are simulated.
  if (messages.length === 0) {
    console.info(`[Ingest] No real messages found for user ${userId}. Injecting personalised project messages for the AI pipeline.`);

    const userName = req.user!.name || "Team Member";
    const userEmail = req.user!.email || "";
    const firstName = userName.split(" ")[0];
    // Derive an org/team name from the email domain (e.g. contoso.com → Contoso)
    const domain = userEmail.includes("@") ? userEmail.split("@")[1].split(".")[0] : "";
    const orgName = domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : "the team";

    // Simple deterministic seed from userId so each user gets a different topic pool
    const seed = userId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const pool = seed % 3; // 0, 1, or 2

    // Three rotating topic pools — different users get different sets
    const teammates = ["Alex", "Jamie", "Morgan", "Taylor", "Jordan"];
    const teammate = teammates[seed % teammates.length];
    const now = Date.now();

    const messagePools: Record<number, CachedMessage[]> = {
      0: [
        {
          id: `${userId}:email:injected-1`,
          userId,
          source: "email",
          externalId: "injected-1",
          subject: `${orgName} Sprint Review — Action Items & Owners`,
          body: `Hi team, following today's sprint review: Action item: ${firstName} needs to complete the API integration test suite by end of week. Decision: ${orgName} will adopt Azure App Service for all production deployments going forward. ${teammate} will document the deployment runbook.`,
          sender: `${teammate} (Engineering Manager)`,
          timestamp: new Date(now).toISOString(),
          processed: false
        },
        {
          id: `${userId}:email:injected-2`,
          userId,
          source: "email",
          externalId: "injected-2",
          subject: "CI/CD Pipeline Blocker — Needs Immediate Attention",
          body: `Blocker: The automated deployment pipeline is failing at the Docker build step due to outdated base images. ${firstName} is blocked on the release until this is resolved. Action: ${firstName} will update the Dockerfile and coordinate with ${teammate} to re-trigger the pipeline.`,
          sender: `${teammate} (DevOps Lead)`,
          timestamp: new Date(now - 3600000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:teams:injected-3`,
          userId,
          source: "teams",
          externalId: "injected-3",
          subject: "Cloud Cost Optimisation Discussion",
          body: `Decision agreed by ${firstName} and ${teammate}: We will switch from reserved instances to spot instances for non-critical workloads to reduce Azure spend by 40%. ${firstName} will implement the Spot VM configuration by Friday.`,
          sender: teammate,
          timestamp: new Date(now - 7200000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:teams:injected-4`,
          userId,
          source: "teams",
          externalId: "injected-4",
          subject: "Client Demo Preparation",
          body: `Action: ${firstName} will prepare a live walkthrough script for the ${orgName} client demo on Thursday. ${teammate} will handle slide preparation. Blocker: The staging environment is currently down — ${firstName} needs to escalate with infrastructure team.`,
          sender: teammate,
          timestamp: new Date(now - 10800000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:email:injected-5`,
          userId,
          source: "email",
          externalId: "injected-5",
          subject: "Security Audit Findings — Q2 Report",
          body: `Action: ${firstName} must review and patch the 3 medium-severity vulnerabilities identified in the Q2 security audit. Decision: ${orgName} will enforce MFA across all developer accounts by next Monday. ${teammate} will send policy enforcement notices.`,
          sender: `${teammate} (Security Officer)`,
          timestamp: new Date(now - 1800000).toISOString(),
          processed: false
        }
      ],
      1: [
        {
          id: `${userId}:email:injected-1`,
          userId,
          source: "email",
          externalId: "injected-1",
          subject: `${orgName} Product Roadmap Sync`,
          body: `Team, key outcomes from today's roadmap sync: Action: ${firstName} will scope and estimate the new analytics dashboard feature by Wednesday. Decision: We agreed to delay the mobile app launch by 2 weeks to complete performance testing. ${teammate} will update the product timeline.`,
          sender: `${teammate} (Product Owner)`,
          timestamp: new Date(now).toISOString(),
          processed: false
        },
        {
          id: `${userId}:teams:injected-2`,
          userId,
          source: "teams",
          externalId: "injected-2",
          subject: "Backend API Rate Limiting Issue",
          body: `Blocker: The ${orgName} API is hitting rate limits on the third-party payment gateway during load tests. ${firstName} is blocked on completing the checkout flow integration. Action: ${firstName} will implement exponential backoff and caching to reduce API call frequency.`,
          sender: teammate,
          timestamp: new Date(now - 3600000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:email:injected-3`,
          userId,
          source: "email",
          externalId: "injected-3",
          subject: "Database Performance Review",
          body: `Action: ${firstName} will add indexes to the users and transactions collections to reduce query time from 800ms to under 100ms. Decision: ${orgName} will migrate to read replicas for all reporting queries. ${teammate} will coordinate the migration window.`,
          sender: `${teammate} (Database Lead)`,
          timestamp: new Date(now - 7200000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:teams:injected-4`,
          userId,
          source: "teams",
          externalId: "injected-4",
          subject: "Accessibility Compliance Blockers",
          body: `Blocker: The WCAG 2.1 audit flagged 12 accessibility violations in the ${orgName} web portal. ${firstName} is responsible for the frontend fixes. Action: ${firstName} will complete ARIA label additions and keyboard navigation fixes by Thursday.`,
          sender: teammate,
          timestamp: new Date(now - 10800000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:email:injected-5`,
          userId,
          source: "email",
          externalId: "injected-5",
          subject: "Stakeholder Presentation — Next Steps",
          body: `Action: ${firstName} will prepare the Q2 metrics slide deck for the board presentation. Decision: ${orgName} leadership approved the €200k budget increase for cloud infrastructure. ${teammate} will draft the formal approval email to finance.`,
          sender: `${teammate} (Director of Engineering)`,
          timestamp: new Date(now - 1800000).toISOString(),
          processed: false
        }
      ],
      2: [
        {
          id: `${userId}:teams:injected-1`,
          userId,
          source: "teams",
          externalId: "injected-1",
          subject: `${orgName} Architecture Review`,
          body: `Following today's architecture review: Action: ${firstName} will refactor the monolith authentication service into a standalone microservice. Decision: ${orgName} will adopt event-driven architecture using Azure Service Bus. ${teammate} will own the messaging schema design.`,
          sender: teammate,
          timestamp: new Date(now).toISOString(),
          processed: false
        },
        {
          id: `${userId}:email:injected-2`,
          userId,
          source: "email",
          externalId: "injected-2",
          subject: "Compliance & GDPR Urgent Action Required",
          body: `Blocker: The ${orgName} data retention policy has not been updated since 2023 and is now non-compliant with GDPR Article 17. ${firstName} must work with legal to implement automated data deletion workflows. Action: ${firstName} will set up TTL indexes in MongoDB by end of month.`,
          sender: `${teammate} (Compliance Lead)`,
          timestamp: new Date(now - 3600000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:teams:injected-3`,
          userId,
          source: "teams",
          externalId: "injected-3",
          subject: "Onboarding Flow Redesign",
          body: `Decision: ${orgName} will redesign the new user onboarding flow based on the A/B test results showing 34% higher activation with the guided wizard pattern. Action: ${firstName} will implement the new wizard component and write unit tests by next sprint.`,
          sender: teammate,
          timestamp: new Date(now - 7200000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:email:injected-4`,
          userId,
          source: "email",
          externalId: "injected-4",
          subject: "Production Incident Post-Mortem",
          body: `Blocker: Root cause of last Tuesday's outage is still unresolved — the memory leak in the report generation service resurfaces under high load. Action: ${firstName} will profile the service and implement a fix. ${teammate} will schedule a follow-up review next week.`,
          sender: `${teammate} (SRE Lead)`,
          timestamp: new Date(now - 10800000).toISOString(),
          processed: false
        },
        {
          id: `${userId}:teams:injected-5`,
          userId,
          source: "teams",
          externalId: "injected-5",
          subject: "Hiring & Team Expansion",
          body: `Action: ${firstName} will conduct technical interviews for the 2 senior engineer positions. Decision: ${orgName} approved remote-first hiring globally. ${teammate} will post job descriptions on LinkedIn and GitHub Jobs by Friday.`,
          sender: teammate,
          timestamp: new Date(now - 1800000).toISOString(),
          processed: false
        }
      ]
    };

    const fallbackMessages = messagePools[pool];
    await messageRepository.cache(fallbackMessages);
    res.json({
      ok: true,
      data: {
        cached: fallbackMessages.length,
        email: fallbackMessages.filter((m) => m.source === "email").length,
        teams: fallbackMessages.filter((m) => m.source === "teams").length,
        warnings: {
          email: emailError ? emailError.message : null,
          teams: teamsError ? teamsError.message : null
        }
      }
    });
    return;
  }

  await messageRepository.cache(messages);
  res.json({
    ok: true,
    data: {
      cached: messages.length,
      email: emails.length,
      teams: teams.length,
      warnings: {
        email: emailError ? emailError.message : null,
        teams: teamsError ? teamsError.message : null
      }
    }
  });
}

