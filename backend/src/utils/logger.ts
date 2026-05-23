import { isProduction } from "./env.js";

type LogMeta = Record<string, string | number | boolean | undefined>;

const redact = (meta?: LogMeta): LogMeta | undefined => {
  if (!meta) return undefined;
  return Object.fromEntries(
    Object.entries(meta).filter(([key]) => !["token", "body", "email", "message"].includes(key.toLowerCase()))
  );
};

export const logger = {
  info(event: string, meta?: LogMeta) {
    console.info(JSON.stringify({ level: "info", event, meta: redact(meta), timestamp: new Date().toISOString() }));
  },
  warn(event: string, meta?: LogMeta) {
    console.warn(JSON.stringify({ level: "warn", event, meta: redact(meta), timestamp: new Date().toISOString() }));
  },
  error(event: string, error: unknown, meta?: LogMeta) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(JSON.stringify({ level: "error", event, message, meta: redact(meta), timestamp: new Date().toISOString() }));
    if (!isProduction && error instanceof Error) console.error(error.stack);
  }
};
