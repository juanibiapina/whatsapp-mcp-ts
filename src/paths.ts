import { join } from "node:path";
import { homedir } from "node:os";
import { mkdirSync } from "node:fs";

export const DATA_DIR = join(homedir(), ".local", "share", "whatsapp-mcp");
export const AUTH_DIR = join(DATA_DIR, "auth");
export const DB_PATH = join(DATA_DIR, "whatsapp.db");
export const WA_LOG_PATH = join(DATA_DIR, "wa-logs.txt");
export const MCP_LOG_PATH = join(DATA_DIR, "mcp-logs.txt");

export function ensureDataDir(): void {
  mkdirSync(DATA_DIR, { recursive: true });
}
