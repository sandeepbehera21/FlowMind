import { Router } from "express";
import { listActions, updateAction } from "../controllers/actionController.js";
import { withAsync } from "../utils/withAsync.js";

export const actionsRouter = Router();
actionsRouter.get("/", withAsync(listActions));
actionsRouter.patch("/:id", withAsync(updateAction));
