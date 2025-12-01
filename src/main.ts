import { existsSync } from "node:fs";
import { join } from "node:path";
import { pino } from "pino";
import { ensureDataDir, AUTH_DIR, WA_LOG_PATH, MCP_LOG_PATH } from "./paths.ts";
import { initializeDatabase } from "./database.ts";
import { startWhatsAppConnection, type WhatsAppSocket } from "./whatsapp.ts";
import { startMcpServer } from "./mcp.ts";

const authMode = process.argv.includes("--auth");

ensureDataDir();

const waLogger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(WA_LOG_PATH)
);

const mcpLogger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(MCP_LOG_PATH)
);

async function runAuthMode() {
  console.log("Starting WhatsApp authentication...");
  console.log("Scan the QR code with your WhatsApp app.");
  console.log("");

  try {
    await startWhatsAppConnection(waLogger, true);
  } catch (error: any) {
    console.error("Authentication failed:", error.message);
    process.exit(1);
  }
}

async function runMcpMode() {
  const credsPath = join(AUTH_DIR, "creds.json");
  if (!existsSync(credsPath)) {
    console.error("Error: Not authenticated with WhatsApp.");
    console.error("");
    console.error("Run with --auth flag first to authenticate:");
    console.error("  npx github:juanibiapina/whatsapp-mcp-ts --auth");
    process.exit(1);
  }

  mcpLogger.info("Starting WhatsApp MCP Server...");

  let whatsappSocket: WhatsAppSocket | null = null;

  try {
    mcpLogger.info("Initializing database...");
    initializeDatabase();
    mcpLogger.info("Database initialized successfully.");

    mcpLogger.info("Attempting to connect to WhatsApp...");
    whatsappSocket = await startWhatsAppConnection(waLogger, false);
    mcpLogger.info("WhatsApp connection process initiated.");
  } catch (error: any) {
    mcpLogger.fatal(
      { err: error },
      "Failed during initialization or WhatsApp connection attempt"
    );

    process.exit(1);
  }

  try {
    mcpLogger.info("Starting MCP server...");
    await startMcpServer(whatsappSocket, mcpLogger, waLogger);
    mcpLogger.info("MCP Server started and listening.");
  } catch (error: any) {
    mcpLogger.fatal({ err: error }, "Failed to start MCP server");
    process.exit(1);
  }

  mcpLogger.info("Application setup complete. Running...");
}

async function shutdown(signal: string) {
  mcpLogger.info(`Received ${signal}. Shutting down gracefully...`);

  waLogger.flush();
  mcpLogger.flush();

  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

(authMode ? runAuthMode() : runMcpMode()).catch((error) => {
  mcpLogger.fatal({ err: error }, "Unhandled error during application startup");
  waLogger.flush();
  mcpLogger.flush();
  process.exit(1);
});
