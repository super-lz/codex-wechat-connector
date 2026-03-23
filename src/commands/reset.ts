import { existsSync, rmSync } from "node:fs";

import { DEFAULT_WORK_ROOT, STATE_DIR } from "../config.js";

export function handleResetCommand(args: string[]): void {
  const scope = args[0] ?? "state";

  if (scope === "state") {
    removeIfExists(STATE_DIR);
    process.stdout.write(`removed state: ${STATE_DIR}\n`);
    return;
  }

  if (scope === "all") {
    removeIfExists(STATE_DIR);
    removeIfExists(DEFAULT_WORK_ROOT);
    process.stdout.write(`removed state: ${STATE_DIR}\n`);
    process.stdout.write(`removed workspaces: ${DEFAULT_WORK_ROOT}\n`);
    return;
  }

  throw new Error(`unknown reset scope: ${scope}`);
}

function removeIfExists(target: string): void {
  if (!existsSync(target)) {
    return;
  }
  rmSync(target, { recursive: true, force: true });
}
