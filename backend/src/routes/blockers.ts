import { Router } from "express";
import { listBlockers, updateBlocker } from "../controllers/blockerController.js";
import { withAsync } from "../utils/withAsync.js";

export const blockersRouter = Router();
blockersRouter.get("/", withAsync(listBlockers));
blockersRouter.patch("/:id", withAsync(updateBlocker));
