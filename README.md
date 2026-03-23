# Codex WeChat Connector

[中文说明](./README.zh-CN.md)

WeChat bridge for local Codex App Server sessions.

<img src="./assets/demo.jpg" alt="WeChat demo" width="320" />

## Overview

- sends WeChat messages to Codex
- sends Codex replies back to WeChat
- supports pairing and allowlist access control
- gives each approved user an isolated workspace
- supports image and file transfer in both directions

## Quick Start

```bash
cd /path/to/codex-wechat-connector
npm install
npm run smoke
npm run login
npm run wechat
```

When the bot sends you a pairing code, approve it with:

```bash
npm run access -- pair <code>
```

## Paths

This project uses two root directories by default:

- `gateway home`: `$HOME/.codex-wechat-connector`
- `worker root`: `$HOME/codex-wechat-connector-worker`

Default layout:

```text
$HOME/.codex-wechat-connector/
  cache/
  config/config.json
  logs/
  sessions/
  wechat/

$HOME/codex-wechat-connector-worker/
  users/<user-workspace>/
```

Inbound files are stored under:

```text
$HOME/.codex-wechat-connector/cache/users/<user>/inbound/
```

## Configuration

Config file:

```bash
$HOME/.codex-wechat-connector/config/config.json
```

Persistent env overrides:

```bash
$HOME/.codex-wechat-connector/config/env.sh
```

Example:

```json
{
  "codexBin": "/path/to/codex",
  "workRoot": "$HOME/codex-wechat-connector-worker",
  "codexApprovalPolicy": "never",
  "codexSandboxMode": "workspace-write"
}
```

Optional overrides:

```bash
export CODEX_BIN=/absolute/path/to/codex
export CODEX_WECHAT_CONNECTOR_HOME=/absolute/path/to/.codex-wechat-connector
export WECHAT_CODEX_CONNECTOR_WORKROOT=/absolute/path/to/codex-wechat-connector-worker
export CODEX_APPROVAL_POLICY=never
export CODEX_SANDBOX_MODE=workspace-write
```

If you want the launcher to load env vars automatically, put them into `config/env.sh`.
Example:
- [env.example.sh](./env.example.sh)

## Bridge Actions

To send a local file or image back to WeChat, or to ask the gateway to switch workspace or reset thread, Codex can include a `codex-actions` block:

````text
```codex-actions
{
  "send": [
    { "type": "image", "path": "/absolute/path/out.png" },
    { "type": "file", "path": "/absolute/path/report.pdf" }
  ],
  "control": [
    { "type": "workspace.set", "path": "/absolute/path/project" },
    { "type": "thread.reset" }
  ]
}
```
````

Rules:

- only absolute local paths are accepted
- `image` is for inline viewing in WeChat
- `file` is for attachments
- `workspace.set`, `workspace.reset`, and `thread.reset` are supported host control actions
- WeChat may transcode `image`; use `file` if format preservation matters

Inside WeChat, you can also ask in natural language, such as `switch to /path/to/project and continue there`.

Slash commands are still available as a fallback:

```text
/workspace
/workspace set /absolute/path
/workspace reset
/thread reset
```

Changing the workspace resets the current thread automatically, so the next message starts fresh in the new directory.

Note: natural-language bridge actions depend on the developer instructions attached when a thread is created. If behavior seems stale after upgrading the gateway, reset the thread and try again.

## Common Commands

```bash
npm run smoke
npm run login
npm run wechat
npm run access -- status
npm run access -- pair <code>
npm run reset -- state
npm run reset -- all
```

`reset -- state` clears saved gateway state. `reset -- all` also removes user workspaces.

## Development

```bash
npm run test
npm run check
npm run build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).
