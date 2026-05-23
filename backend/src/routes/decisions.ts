import { Router } from "express";
import { listDecisions } from "../controllers/decisionController.js";
import { withAsync } from "../utils/withAsync.js";

export const decisionsRouter = Router();
decisionsRouter.get("/", withAsync(listDecisions));
