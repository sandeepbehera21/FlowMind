import { Router } from "express";
import { ingestMessages } from "../controllers/messageController.js";
import { withAsync } from "../utils/withAsync.js";

export const messagesRouter = Router();
messagesRouter.post("/ingest", withAsync(ingestMessages));
