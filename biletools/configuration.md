---
title: "BileTools: Configuration"
description: "Every biletools.yml key with its default"
published: true
date: 2026-09-16T00:00:00.000Z
tags: "biletools, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Configuration lives in `plugins/BileTools/biletools.yml`. The table below lists the defaults written on first run. BileTools rewrites supported values after loading and restores missing keys. On a Velocity proxy, settings live in `plugins/biletools/biletools.json` instead; that file has its own section below.

## Runtime

| Key | Default | Effect |
|---|---|---|
| `language` | `en_US` | Selects the default locale used for player and operator text. The selector updates this value |
| `metrics` | `true` | Enables anonymous bStats reporting. Changes from the in-game editor apply immediately |

## Watcher

Controls automatic hot-reload.

| Key | Default | Effect |
|---|---|---|
| `watcher.idle-poll-ticks` | `20` | Coordinator check interval when no watcher, staging, deletion, or reload work is pending. Minimum `1` |
| `watcher.active-poll-ticks` | `5` | Coordinator check interval while watcher, staging, deletion, or reload work is pending. Minimum `1` |
| `watcher.fingerprint-debounce-ticks` | `8` | Consecutive stable file-stamp checks required before staging a jar. Minimum `1` |
| `watcher.ignore` | see below | Plugin names the watcher will never auto-manage |
| `watcher.only` | `[]` | If non-empty, switches to allowlist mode: **only** these are auto-managed |
{.dense}

Default `watcher.ignore`:

```yaml
watcher:
  ignore:
    - LuckPerms
    - Vault
    - ProtocolLib
    - packetevents
    - WorldGuard
    - CoreProtect
    - spark
```

These plugins are excluded because they commonly hold static state, register protocol hooks, or support other plugins.

Automatic reload waits for a jar to finish changing. Temporary upload files are ignored. Changes made during a reload apply in the next batch.

Manual `/bile load`, `/bile unload`, and `/bile reload` operations bypass the
automatic filter and cadence.

## Lifecycle and observability

| Key | Default | Effect |
|---|---|---|
| `lifecycle.health-check` | `true` | Fail the reload if the plugin is not actually enabled and registered afterwards |
| `observability.log-timings` | `true` | Log unload, load and reload phase timings |
| `archive-plugins` | `true` | Archive a copy of a jar before `uninstall` deletes it |

Keep `health-check` enabled so a failed `onEnable` does not report a successful reload.

## Remote deploy

| Key | Default | Effect |
|---|---|---|
| `remote-deploy.slave.slave-enabled` | `false` | Listen for incoming jar deployments |
| `remote-deploy.slave.slave-port` | `9876` | Listener port |
| `remote-deploy.slave.slave-payload` | `pickapassword` | Shared secret the master must present |
| `remote-deploy.master.master-enabled` | `false` | Push jars to configured targets |
| `remote-deploy.master.master-deploy-to` | `["yourserver.com:9876:password"]` | Targets as `host:port:password` |
| `remote-deploy.master.master-deploy-signatures` | `["MyPlugin", "AnotherPlugin"]` | Which plugins get pushed |
| `remote-deploy.socket-timeout-ms` | `15000` | Socket timeout. Minimum `1000` |
| `remote-deploy.max-transfer-bytes` | `268435456` | 256 MiB cap per transfer. Minimum 1 MiB |
{.dense}

The master and the slave both default to off. Read
[Remote Deploy](/biletools/remote-deploy) before you enable either half.

## Velocity proxy (biletools.json)

The proxy edition reads `plugins/biletools/biletools.json`. It is written with every key on first run, and missing keys are restored with their defaults on load.

| Key | Default | Effect |
|---|---|---|
| `watcher.enabled` | `true` | Watch the proxy's plugins directory and reload changed jars automatically |
| `watcher.idle-poll-millis` | `1000` | Check interval when no work is pending. Clamped to 100-60000 |
| `watcher.active-poll-millis` | `250` | Check interval while a change is being processed. Clamped to 50 up to the idle interval |
| `watcher.fingerprint-debounce-polls` | `8` | Consecutive unchanged checks required before a jar is staged. Clamped to 1-200 |
| `watcher.ignore` | `[]` | Plugin ids the watcher never manages automatically |
| `watcher.only` | `[]` | If non-empty, switches to allowlist mode: only these ids are managed automatically |
| `archive-plugins` | `true` | Move a plugin's working copy to `plugins/biletools/archive/` when it is unloaded instead of deleting it |
| `lifecycle.health-check` | `true` | Fail the operation if the plugin is not actually registered and running afterwards |
| `lifecycle.operation-timeout-seconds` | `120` | Give up on a plugin that never returns from its initialize or shutdown event. Clamped to 5-3600 |
| `observability.log-timings` | `true` | Log one timing line per load, unload, and reload |
| `notifications.players` | `true` | Send automatic reload results to players with `bile.use`, not just the console |
{.dense}

Plugin ids are matched without case, and manual commands bypass `watcher.ignore` and `watcher.only`. The proxy edition has no language, metrics, remote-deploy, or in-game editor settings. See [Velocity proxy](/biletools/velocity).

## Language files

Startup creates editable `plugins/BileTools/languages/en_US.toml` when missing. Non-English catalogs download only when their local file is missing. Partial catalogs remain selectable; valid translations stay active and missing or invalid messages fall back to built-in English individually. Installed catalogs work offline. An unreadable file uses English at startup or selection. During hot reload, invalid TOML syntax keeps the last readable snapshot until the file is repaired.

Player preferences are stored by UUID in `plugins/BileTools/languages/language-preferences.properties`. `self reset` removes a personal override. The server default applies to console output and players without an override.

Language files use grouped TOML sections: `[command.feedback]` with `saved = "..."` represents `command.feedback.saved`. Generated English and downloaded catalogs share four localized header sections: file editing, prefix behavior, formatting, and individual variable definitions. Editor saves keep the existing leading comments and group message keys; other valid local files are not rewritten just to change their layout.

BileTools stores catalogs at `plugins/BileTools/languages/<locale>.toml`. Local files are not replaced automatically. Missing or invalid values use built-in English, unknown TOML keys are retained, and a valid save reloads the active file. Localized header comments explain formatting and variables; the Bile prefix is written directly in each chat message.

## In-game settings editor

`/bile config` exposes every current setting. Boolean, numeric, and non-secret list values are editable, and the language entry opens the language tools. Changes are validated, saved atomically, and applied live. Receiver changes restart the listener; metrics changes start or stop bStats.

`remote-deploy.slave.slave-payload` and `remote-deploy.master.master-deploy-to` are represented as redacted, file-only entries because they contain secrets. Edit them directly in `biletools.yml`, then reload BileTools or restart the server.

### In-game language editor

`/bile language server edit [locale]` opens the inventory editor for a language. Omit the locale to choose one; browsing and editing leave the server default and every personal selection unchanged. Access requires `biletools.config` or `volmit.language.admin`.

Select a message and enter its replacement in private chat. Enter `cancel` or wait 60 seconds to stop. BileTools validates placeholders, message shape, and stale edits before saving.

Edits are saved atomically to `plugins/BileTools/languages/<locale>.toml` and applied to users of that locale. Other locales and language selections stay unchanged. Incomplete installed catalogs can be repaired without selecting them.
