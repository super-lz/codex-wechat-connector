import { CodexAppServerClient } from "../codex/app-server-client.js";
import { log } from "../logger.js";

export async function runSmokeCommand(): Promise<void> {
  const codex = new CodexAppServerClient();
  await codex.start();
  const thread = await codex.createThread({ cwd: process.cwd() });
  log("codex-smoke", `thread created: ${thread.thread.id}`);
  await codex.stop();
}
