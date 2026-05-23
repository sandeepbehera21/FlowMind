import sanitizeHtml from "sanitize-html";
import { z } from "zod";

export const actionUpdateSchema = z.object({
  status: z.enum(["todo", "in_progress", "complete"]).optional(),
  owner: z.string().trim().min(1).max(120).optional()
});

export const blockerUpdateSchema = z.object({
  status: z.enum(["open", "resolved"])
});

export const sanitizeText = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
