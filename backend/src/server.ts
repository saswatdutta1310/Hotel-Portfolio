import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

let isShuttingDown = false;

function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received: closing HTTP server and finishing in-flight requests...`);

  // Stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error("Error while closing server:", err);
      process.exit(1);
    }
    console.log("HTTP server closed gracefully. Exiting process.");
    process.exit(0);
  });

  // Force shutdown after 10 seconds if in-flight requests hang
  const timer = setTimeout(() => {
    console.error("Graceful shutdown timeout: forcefully exiting.");
    process.exit(1);
  }, 10000);
  timer.unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
