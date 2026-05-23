import { app } from "./app.js";
import { dbService } from "./services/dbService.js";
import { env } from "./utils/env.js";
import { logger } from "./utils/logger.js";

async function main(): Promise<void> {
  await dbService.connect();
  const server = app.listen(env.PORT, () => logger.info("server.started", { port: env.PORT }));
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      logger.error("server.port_in_use", error, { port: env.PORT });
      process.exit(1);
    }
    logger.error("server.listen_failed", error, { port: env.PORT });
    process.exit(1);
  });
}

main().catch((error) => {
  logger.error("server.boot_failed", error);
  process.exit(1);
});
