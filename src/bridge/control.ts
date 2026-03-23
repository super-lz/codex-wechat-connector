import { mkdirSync } from "node:fs";
import path from "node:path";

import { SessionManager } from "../gateway/session-manager.js";
import { getUserWorkspace } from "../gateway/workspace.js";
import type { ControlAction } from "../protocol/actions.js";
import { WechatApiClient } from "../wechat/api.js";

type SlashControlParseResult =
  | { handled: false }
  | { handled: true; actions?: ControlAction[]; text?: string };

export async function executeControlActions(params: {
  senderId: string;
  sessions: SessionManager;
  actions: ControlAction[];
}): Promise<string[]> {
  const notices: string[] = [];

  for (const action of params.actions) {
    if (action.type === "workspace.set") {
      mkdirSync(action.path, { recursive: true, mode: 0o755 });
      params.sessions.setWorkspaceOverrideForUser(params.senderId, action.path);
      params.sessions.clearThreadIdForUser(params.senderId);
      notices.push(`已切换工作目录到：${action.path}\n下一条消息会在新目录的新 thread 中开始。`);
      continue;
    }

    if (action.type === "workspace.reset") {
      params.sessions.clearWorkspaceOverrideForUser(params.senderId);
      params.sessions.clearThreadIdForUser(params.senderId);
      notices.push(
        `已恢复默认工作目录：${getUserWorkspace(params.senderId)}\n下一条消息会在默认目录的新 thread 中开始。`
      );
      continue;
    }

    params.sessions.clearThreadIdForUser(params.senderId);
    notices.push("已重置当前 thread。下一条消息会创建新 thread。");
  }

  return notices;
}

export function parseSlashControlCommand(text: string): SlashControlParseResult {
  const normalized = text.trim();
  if (!normalized.startsWith("/")) {
    return { handled: false };
  }

  const parts = normalized.split(/\s+/);
  const command = parts[0];

  if (command === "/thread" && parts[1] === "reset") {
    return { handled: true, actions: [{ type: "thread.reset" }] };
  }

  if (command === "/workspace" && parts[1] === "reset") {
    return { handled: true, actions: [{ type: "workspace.reset" }] };
  }

  if (command === "/workspace" && parts[1] === "set") {
    const workspace = normalized.slice("/workspace set".length).trim();
    if (!workspace) {
      return { handled: true, text: "用法：/workspace set /absolute/path" };
    }
    if (!path.isAbsolute(workspace)) {
      return { handled: true, text: "工作目录必须是绝对路径。" };
    }
    return { handled: true, actions: [{ type: "workspace.set", path: workspace }] };
  }

  if (command === "/workspace") {
    return { handled: true, text: "__SHOW_WORKSPACE__" };
  }

  return { handled: false };
}

export async function handleSlashControlCommand(params: {
  senderId: string;
  text: string;
  contextToken: string;
  sessions: SessionManager;
  api: WechatApiClient;
}): Promise<{ handled: boolean }> {
  const parsed = parseSlashControlCommand(params.text);
  if (!parsed.handled) {
    return parsed;
  }

  if (parsed.text === "__SHOW_WORKSPACE__") {
    const currentWorkspace =
      params.sessions.getWorkspaceOverrideForUser(params.senderId) ?? getUserWorkspace(params.senderId);
    await params.api.sendTextMessage({
      toUserId: params.senderId,
      text: `当前工作目录：${currentWorkspace}`,
      contextToken: params.contextToken
    });
    return { handled: true };
  }

  if (parsed.text) {
    await params.api.sendTextMessage({
      toUserId: params.senderId,
      text: parsed.text,
      contextToken: params.contextToken
    });
    return { handled: true };
  }

  if (parsed.actions?.length) {
    const notices = await executeControlActions({
      senderId: params.senderId,
      sessions: params.sessions,
      actions: parsed.actions
    });
    await params.api.sendTextMessage({
      toUserId: params.senderId,
      text: notices.join("\n\n"),
      contextToken: params.contextToken
    });
    return { handled: true };
  }

  return { handled: true };
}
