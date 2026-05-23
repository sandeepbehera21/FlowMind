import type { Request, Response } from "express";
import { userRepository } from "../services/repositories.js";

export async function me(req: Request, res: Response): Promise<void> {
  const principal = req.user!;
  const user = await userRepository.upsertFromMicrosoft({
    microsoftId: principal.microsoftId,
    email: principal.email,
    name: principal.name
  });
  res.json({ ok: true, data: user });
}
