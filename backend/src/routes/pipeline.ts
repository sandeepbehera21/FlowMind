import { Router } from "express";
import { dashboard, generateDigest, runPipeline, pipelineHistory, demoPipelineSeeder } from "../controllers/pipelineController.js";
import { pipelineRateLimiter } from "../middleware/rateLimiter.js";
import { withAsync } from "../utils/withAsync.js";

export const pipelineRouter = Router();
pipelineRouter.get("/dashboard", withAsync(dashboard));
pipelineRouter.post("/run", pipelineRateLimiter, withAsync(runPipeline));
pipelineRouter.post("/digest", withAsync(generateDigest));
pipelineRouter.get("/history", withAsync(pipelineHistory));
pipelineRouter.post("/demo", withAsync(demoPipelineSeeder));

