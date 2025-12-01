#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const child = spawn(
  process.execPath,
  ["--import", "tsx", join(__dirname, "src/main.ts"), ...process.argv.slice(2)],
  { stdio: "inherit" }
);

child.on("error", (err) => {
  console.error("Failed to start process:", err.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});

// Forward signals to child
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
