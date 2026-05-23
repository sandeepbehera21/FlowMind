import type { Request, Response } from "express";
import { blockerRepository } from "../services/repositories.js";
import { blockerUpdateSchema } from "../utils/validators.js";
import { BadRequestError } from "../utils/errors.js";

export async function listBlockers(req: Request, res: Response): Promise<void> {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  
  const result = await blockerRepository.listPaginated(req.user!.microsoftId, page, limit);
  res.json({
    ok: true,
    data: {
      items: result.items,
      total: result.total,
      page,
      limit
    }
  });
}

export async function updateBlocker(req: Request, res: Response): Promise<void> {
  const parsed = blockerUpdateSchema.safeParse(req.body);
  if (!parsed.success) throw new BadRequestError("Invalid blocker update payload");
  
  const blocker = await blockerRepository.update(req.user!.microsoftId, req.params.id, parsed.data);
  if (!blocker) throw new BadRequestError("Blocker not found");
  
  res.json({ ok: true, data: blocker });
}
