import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  const appError = error instanceof AppError ? error : new AppError("INTERNAL_ERROR", "Something went wrong", 500);
  logger.error("request.failed", error, { path: req.path, statusCode: appError.statusCode });
  res.status(appError.statusCode).json({ ok: false, error: { code: appError.code, message: appError.message } });
}
