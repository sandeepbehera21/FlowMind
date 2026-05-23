import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { actionsRouter } from "./routes/actions.js";
import { authRouter } from "./routes/auth.js";
import { messagesRouter } from "./routes/messages.js";
import { pipelineRouter } from "./routes/pipeline.js";
import { decisionsRouter } from "./routes/decisions.js";
import { blockersRouter } from "./routes/blockers.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { loggerMiddleware } from "./middleware/loggerMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { env, isProduction } from "./utils/env.js";
import { dbService } from "./services/dbService.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(loggerMiddleware);
if (!isProduction) app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true, data: { service: "flowmind-api" } }));

app.get("/api/health/detailed", (_req, res) => {
  const dbConnected = dbService.isConnected();
  res.json({
    ok: true,
    data: {
      status: dbConnected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: dbConnected ? "connected" : "disconnected",
        api: "running"
      }
    }
  });
});

app.use("/api/auth", authMiddleware, authRouter);
app.use("/api/messages", authMiddleware, messagesRouter);
app.use("/api/pipeline", authMiddleware, pipelineRouter);

app.use("/api/actions", authMiddleware, actionsRouter);
app.use("/api/decisions", authMiddleware, decisionsRouter);
app.use("/api/blockers", authMiddleware, blockersRouter);

app.use(errorHandler);
