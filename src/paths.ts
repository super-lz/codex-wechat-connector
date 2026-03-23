import { homedir } from "node:os";
import { join } from "node:path";

const APP_DIR_NAME = ".codex-wechat-connector";
const WORKER_DIR_NAME = "codex-wechat-connector-worker";

export type AppRoots = {
  appHome: string;
  cacheDir: string;
  configDir: string;
  logsDir: string;
  sessionsDir: string;
  wechatDir: string;
};

export function getUserHomeDir(): string {
  return homedir();
}

export function getDefaultAppHome(): string {
  return join(getUserHomeDir(), APP_DIR_NAME);
}

export function getDefaultWorkerRoot(): string {
  return join(getUserHomeDir(), WORKER_DIR_NAME);
}

export function getAppHome(): string {
  return process.env.CODEX_WECHAT_CONNECTOR_HOME || process.env.CODEX_PLUGIN_WECHAT_HOME || getDefaultAppHome();
}

export function getAppRoots(): AppRoots {
  const appHome = getAppHome();
  return {
    appHome,
    cacheDir: join(appHome, "cache"),
    configDir: join(appHome, "config"),
    logsDir: join(appHome, "logs"),
    sessionsDir: join(appHome, "sessions"),
    wechatDir: join(appHome, "wechat")
  };
}

export function getWorkerRoot(configuredWorkRoot?: string): string {
  return (
    process.env.WECHAT_CODEX_CONNECTOR_WORKROOT ||
    process.env.WECHAT_CODEX_WORKROOT ||
    configuredWorkRoot ||
    getDefaultWorkerRoot()
  );
}
