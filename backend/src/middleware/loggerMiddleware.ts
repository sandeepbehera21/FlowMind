import type { Request, Response, NextFunction } from "express";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const isProduction = process.env.NODE_ENV === "production";
    
    let logMsg = `[Request] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
    
    if (!isProduction && Object.keys(req.body).length > 0) {
      logMsg += ` | Body: ${JSON.stringify(req.body)}`;
    }
    
    console.log(logMsg);
  });
  
  next();
}
