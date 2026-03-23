export function printUsage(): void {
  process.stderr.write(
    [
      "Usage:",
      "  npm run login",
      "  npm run smoke",
      "  npm run wechat",
      "  npm run access -- <subcommand>",
      "  npm run reset -- <state|all>",
      "  npm run dev -- install-launchd"
    ].join("\n") + "\n"
  );
}
