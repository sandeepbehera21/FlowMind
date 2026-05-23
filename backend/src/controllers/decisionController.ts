import type { Request, Response } from "express";
import { decisionRepository } from "../services/repositories.js";

export async function listDecisions(req: Request, res: Response): Promise<void> {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  
  const result = await decisionRepository.listPaginated(req.user!.microsoftId, page, limit);
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
