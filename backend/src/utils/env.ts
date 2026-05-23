import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const envPaths = [resolve(process.cwd(), ".env"), resolve(process.cwd(), "../.env")];
for (const path of envPaths) {
  if (existsSync(path)) {
    dotenv.config({ path, override: false });
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/flowmind"),
  COSMOS_DB_CONNECTION_STRING: z.string().optional(),
  COSMOS_DB_DATABASE: z.string().default("flowmind"),
  MSAL_TENANT_ID: z.string().default("common"),
  MSAL_CLIENT_ID: z.string().min(1).default("local-client-id"),
  JWT_AUDIENCE: z.string().optional(),
  GRAPH_BASE_URL: z.string().url().default("https://graph.microsoft.com/v1.0"),
  AI_PROVIDER: z.enum(["azure", "groq"]).default("azure"),
  AZURE_OPENAI_ENDPOINT: z.string().url().optional(),
  AZURE_OPENAI_KEY: z.string().optional(),
  AZURE_OPENAI_DEPLOYMENT: z.string().default("gpt-4o"),
  AZURE_OPENAI_API_VERSION: z.string().default("2024-02-15-preview"),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default("llama-3.3-70b-versatile")
});

export const env = envSchema.parse(process.env);
export const isProduction = env.NODE_ENV === "production";
