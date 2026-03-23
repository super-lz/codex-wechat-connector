import assert from "node:assert/strict";
import test from "node:test";

import { parseSlashControlCommand } from "../src/bridge/control.js";

test("parses workspace set slash command into control action", () => {
  const parsed = parseSlashControlCommand("/workspace set /tmp/project");
  assert.deepEqual(parsed, {
    handled: true,
    actions: [{ type: "workspace.set", path: "/tmp/project" }]
  });
});

test("parses thread reset slash command into control action", () => {
  const parsed = parseSlashControlCommand("/thread reset");
  assert.deepEqual(parsed, {
    handled: true,
    actions: [{ type: "thread.reset" }]
  });
});

test("returns validation message for invalid workspace set", () => {
  const parsed = parseSlashControlCommand("/workspace set relative/path");
  assert.deepEqual(parsed, {
    handled: true,
    text: "工作目录必须是绝对路径。"
  });
});
