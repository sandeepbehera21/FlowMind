import type { Request, Response } from "express";
import { actionRepository } from "../services/repositories.js";
import { BadRequestError } from "../utils/errors.js";
import { actionUpdateSchema, sanitizeText } from "../utils/validators.js";

export async function listActions(req: Request, res: Response): Promise<void> {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

  if (page !== undefined) {
    const result = await actionRepository.listPaginated(req.user!.microsoftId, page, limit);
    res.json({ ok: true, data: { items: result.items, total: result.total, page, limit } });
  } else {
    const actions = await actionRepository.list(req.user!.microsoftId);
    res.json({ ok: true, data: actions });
  }
}

export async function updateAction(req: Request, res: Response): Promise<void> {
  const parsed = actionUpdateSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError("Invalid action update payload");
  const patch = {
    ...parsed.data,
    owner: parsed.data.owner ? sanitizeText(parsed.data.owner) : undefined
  };
  const action = await actionRepository.update(req.user!.microsoftId, req.params.id, patch);
  if (!action) throw new BadRequestError("Action item not found");
  res.json({ ok: true, data: action });
}
