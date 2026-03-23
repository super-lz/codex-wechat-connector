import {
  allowSender,
  approvePairing,
  denyPairing,
  formatAccessStatus,
  removeSender,
  setPolicy
} from "../wechat/access.js";

export function handleAccessCommand(args: string[]): void {
  const subcommand = args[0] ?? "status";

  if (subcommand === "status") {
    process.stdout.write(formatAccessStatus() + "\n");
    return;
  }

  if (subcommand === "pair") {
    const code = args[1];
    if (!code) {
      throw new Error("missing pairing code");
    }
    const senderId = approvePairing(code);
    if (!senderId) {
      throw new Error(`pairing code not found: ${code}`);
    }
    process.stdout.write(`approved ${senderId}\n`);
    return;
  }

  if (subcommand === "deny") {
    const code = args[1];
    if (!code) {
      throw new Error("missing pairing code");
    }
    if (!denyPairing(code)) {
      throw new Error(`pairing code not found: ${code}`);
    }
    process.stdout.write(`denied ${code}\n`);
    return;
  }

  if (subcommand === "allow") {
    const senderId = args[1];
    if (!senderId) {
      throw new Error("missing senderId");
    }
    allowSender(senderId);
    process.stdout.write(`allowed ${senderId}\n`);
    return;
  }

  if (subcommand === "remove") {
    const senderId = args[1];
    if (!senderId) {
      throw new Error("missing senderId");
    }
    removeSender(senderId);
    process.stdout.write(`removed ${senderId}\n`);
    return;
  }

  if (subcommand === "policy") {
    const policy = args[1];
    if (policy !== "pairing" && policy !== "allowlist" && policy !== "disabled") {
      throw new Error("policy must be one of: pairing, allowlist, disabled");
    }
    setPolicy(policy);
    process.stdout.write(`policy ${policy}\n`);
    return;
  }

  throw new Error(`unknown access subcommand: ${subcommand}`);
}
