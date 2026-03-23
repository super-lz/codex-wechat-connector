import { runGateway } from "./bridge/service.js";
import { handleAccessCommand } from "./commands/access.js";
import { runInstallLaunchdCommand } from "./commands/launchd.js";
import { runLoginCommand } from "./commands/login.js";
import { handleResetCommand } from "./commands/reset.js";
import { runSmokeCommand } from "./commands/smoke.js";
import { printUsage } from "./commands/usage.js";
import { logError } from "./logger.js";

async function main(): Promise<void> {
  const command = process.argv[2] ?? "run";

  if (command === "login") {
    await runLoginCommand();
    return;
  }

  if (command === "codex-smoke") {
    await runSmokeCommand();
    return;
  }

  if (command === "access") {
    handleAccessCommand(process.argv.slice(3));
    return;
  }

  if (command === "install-launchd") {
    runInstallLaunchdCommand();
    return;
  }

  if (command === "reset") {
    handleResetCommand(process.argv.slice(3));
    return;
  }

  if (command !== "run") {
    printUsage();
    process.exitCode = 1;
    return;
  }

  await runGateway();
}

main().catch((error) => {
  logError("main", error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
