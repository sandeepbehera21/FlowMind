import rateLimit from "express-rate-limit";

export const pipelineRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.microsoftId ?? req.ip ?? "anonymous",
  message: { ok: false, error: { code: "RATE_LIMITED", message: "Pipeline can run 10 times per hour per user." } }
});
