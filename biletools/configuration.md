---
title: "BileTools — Configuration"
description: "Every biletools.yml key with its default"
published: true
date: 2026-09-04T04:02:05.398Z
tags: "biletools, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

Configuration lives in `plugins/BileTools/biletools.yml`. The table below lists the defaults written on first run. BileTools rewrites supported values after loading and restores missing keys.

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

If a requested download fails, is incomplete, or fails catalog preparation, the selected personal or server scope uses validated built-in English. The selected personal preference or server default is saved as `en_US`. The unavailable locale is never activated or saved, the command reports that English is being used, and the console warning states that code-owned English and installed local files remain active. Invalid command syntax and unlisted locales are rejected without changing the selection.

Player preferences are stored by UUID in `plugins/BileTools/languages/language-preferences.properties`. `self reset` removes a personal override. The server default applies to console output and players without an override.

BileTools installs and edits each catalog directly at `plugins/BileTools/languages/<locale>.toml`. English is generated from the typed Java catalog as `en_US.toml`; non-English catalogs download only when missing from the repository's [`master/src/main/resources/languages`](https://github.com/VolmitSoftware/BileTools/tree/master/src/main/resources/languages) directory. BileTools-owned IDs begin directly with `command`, `parameter`, `error`, `message`, and `gui`; shared VolmLib text remains under `director` and `language`. There is no redundant outer `bile` table. Every repository catalog and the generated English file define the exact purpose of all case-sensitive placeholders in their reference headers. Local files are never replaced automatically, missing keys fall back to code-owned English, unknown TOML keys are retained, and the active file reloads after a complete valid save. `/bile language` opens the clickable picker, and `/bile language server` opens the server default picker.

## In-game settings editor

`/bile config` opens the same 54-slot category layout used by ShapedPortals. Every current `biletools.yml` setting is represented, and the settings inside each category are centered across the five content rows. Boolean, numeric, and non-secret list values are editable; the language entry opens the shared selector/editor. Changes are validated, saved atomically, and applied live. A successful edit sends one compact localized line ordered as the Bile-prefixed setting name, new value, and previous value. Delivery flattens line breaks from older local receipt templates, so existing editable language files cannot split the result across multiple chat messages. It does not render a Director result page. Remote receiver changes safely restart its listener, and metrics changes start or stop bStats without reloading the plugin.

`remote-deploy.slave.slave-payload` and `remote-deploy.master.master-deploy-to` are represented as redacted, file-only entries because they contain secrets. Edit them directly in `biletools.yml`, then reload BileTools or restart the server.

### In-game language editor

`/bile language server edit [locale]` opens the inventory editor for a language. Omit the locale to choose one; browsing and editing leave the server default and every personal selection unchanged. Access requires `biletools.config` or `volmit.language.admin`.

The editor shows message keys and current values, with search and pages of up to 45 entries. Select a message, then enter its replacement in private chat; `cancel` or 60 seconds without input cancels the prompt. Placeholders and message shapes are validated before saving, and a message changed since the editor opened must be reopened before editing.

Edits are saved atomically into the selected `plugins/BileTools/languages/<locale>.toml` file. Text, line-list, and plural-table message shapes are preserved. A successful save immediately updates users of the edited locale and sends one compact localized line ordered as the Bile-prefixed message key, new value, and previous value. It does not render a Director result menu. Line breaks inside either value are shown as `\\n`, and long values are bounded. Other locales and all selected preferences remain unchanged. Installed incomplete catalogs can be edited without selecting them; opening a missing official catalog may download it, and failed loads leave the editor closed and selections unchanged.
