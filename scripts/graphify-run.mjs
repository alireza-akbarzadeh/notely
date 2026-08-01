import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const mode = args[0];

const home = os.homedir();
const candidates =
  mode === "mcp"
    ? [
        path.join(home, ".local", "bin", "graphify-mcp"),
        path.join(home, ".local", "bin", "graphify-mcp.exe"),
      ]
    : [
        path.join(home, ".local", "bin", "graphify"),
        path.join(home, ".local", "bin", "graphify.exe"),
      ];

const bin = candidates.find((file) => existsSync(file));
if (!bin) {
  console.error(
    "graphify CLI not found. Expected under ~/.local/bin/graphify",
  );
  process.exit(1);
}

const env = {
  ...process.env,
  GRAPHIFY_MAX_WORKERS: process.env.GRAPHIFY_MAX_WORKERS ?? "1",
};

const result = spawnSync(bin, args, {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
