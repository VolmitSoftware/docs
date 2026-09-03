---
title: "BileTools — Configuration"
description: "Every biletools.yml key with its default"
published: true
date: 2026-09-03T07:34:52.375Z
tags: "biletools, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Configuration lives in `plugins/BileTools/biletools.yml`. The table below lists the defaults written on first run. BileTools rewrites supported values after loading and restores missing keys.

## Runtime

| Key | Default | Effect |
|---|---|---|
| `language` | `en_US` | Selects the default locale used for player and operator text. `language.yml` contains sparse overrides only |
| `metrics` | `true` | Starts anonymous bStats reporting during enable. Requires a restart to change |

## Watcher

Controls automatic hot-reload.

| Key | Default | Effect |
|---|---|---|
| `watcher.idle-poll-ticks` | `20` | Coordinator check interval when no watcher, staging, deletion, or reload work is pending. Minimum `1` |
| `watcher.active-poll-ticks` | `5` | Coordinator check interval while watcher, staging, deletion, or reload work is pending. Minimum `1` |
| `watcher.fingerprint-debounce-ticks` | `8` | Consecutive stable file-stamp checks required before staging a jar. Minimum `1` |
| `watcher.ignore` | see below | Plugin names the watcher will never auto-manage |
| `watcher.only` | `[]` | If non-empty, switches to allowlist mode — **only** these are auto-managed |
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

These plugins are excluded by default. Hot-reload is often dangerous or
pointless for them. They hold static state. They register protocol hooks. Other
plugins depend on them.

Automatic reload waits for a jar to finish changing. Temporary upload files are ignored. Changes made during a reload apply in the next batch.

Manual `/bile load`, `/bile unload`, and `/bile reload` operations bypass the
automatic filter and cadence.

## Lifecycle and observability

| Key | Default | Effect |
|---|---|---|
| `lifecycle.health-check` | `true` | Fail the reload if the plugin is not actually enabled and registered afterwards |
| `observability.log-timings` | `true` | Log unload, load and reload phase timings |
| `archive-plugins` | `true` | Archive a copy of a jar before `uninstall` deletes it |

Leave `health-check` on. If you turn it off, a plugin that throws during
`onEnable` reports a successful reload. The plugin stays inert.

`observability.log-timings` controls reload timing summaries.

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

## Language files

VolmLib downloads a selected non-English catalog on demand, validates its templates and placeholders, and installs it atomically. Locale files are excluded from the plugin jar. Installed catalogs are reused offline, and English defaults remain in Java.

If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, and the command reports that the language is unavailable and English is being used. Invalid command syntax and unlisted locales are rejected without changing the selection.

Player preferences are stored by UUID in `language-preferences.properties` in the plugin data folder. `self reset` removes a personal override. The server default applies to console output and players without an override. Sparse local message overrides remain active above the downloaded catalog.

BileTools installs catalogs to `plugins/BileTools/languages/<locale>.yml`. Add message replacements under `messages` in `plugins/BileTools/language.yml`; its existing watcher reloads those overrides. `/bile language` opens the clickable picker, and `/bile language server` opens the server default picker.

### In-game language editor

`/bile language server edit [locale]` opens the inventory editor for a language. Omit the locale to choose one; browsing and editing leave the server default and every personal selection unchanged. Access requires `bile.use` or `volmit.language.admin`.

The editor shows message keys and current values, with search and pages of up to 45 entries. Select a message, then enter its replacement in private chat; `cancel` or 60 seconds without input cancels the prompt. Placeholders and message shapes are validated before saving, and a message changed since the editor opened must be reopened before editing.

Edits are saved atomically to `plugins/BileTools/languages/overrides/<locale>.yml`. These per-language values override `language.yml`, which continues to override the installed `languages/<locale>.yml` catalog. English overrides use `en_US.yml` and work without downloading a catalog. A successful save immediately updates users of the edited locale; other locales and all selected preferences remain unchanged. Installed incomplete catalogs can be edited without selecting them; opening a missing official catalog may download it, and failed loads leave the editor closed and selections unchanged.
