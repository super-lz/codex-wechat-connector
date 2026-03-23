import { resolve } from "node:path";

import { createLaunchdPlist } from "../launchd.js";

export function runInstallLaunchdCommand(): void {
  const scriptPath = resolve(process.cwd(), "scripts/run.sh");
  const plist = createLaunchdPlist({
    programArguments: ["/bin/zsh", scriptPath],
    workingDirectory: process.cwd()
  });
  process.stdout.write(
    [
      `wrote ${plist.plistPath}`,
      `load with: launchctl load -w ${plist.plistPath}`,
      `unload with: launchctl unload -w ${plist.plistPath}`
    ].join("\n") + "\n"
  );
}
