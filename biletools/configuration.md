---
title: "BileTools: Configuration"
description: "Every biletools.yml key with its default"
published: true
date: 2026-09-19T00:00:00.000Z
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

The proxy edition reads `plugins/biletools/biletools.json` and has no language, metrics, remote-deploy, or in-game editor settings. Its keys are listed on [Velocity proxy](/biletools/velocity#settings).

## Language files

The server default is the `language` key above. Catalogs live at `plugins/BileTools/languages/<locale>.toml`, and personal choices in `languages/language-preferences.properties`.

English is generated on first start. Other catalogs download only when the local file is missing, and an installed file is never rewritten. A partial catalog stays selectable: its valid messages are used and the rest fall back to English one key at a time. During hot reload, invalid TOML keeps the last readable version active until you fix the file.

See [Languages](/languages).

## In-game settings editor

`/bile config` exposes every current setting. Boolean, numeric, and non-secret list values are editable, and the language entry opens the language tools. Changes are validated, saved atomically, and applied live. Receiver changes restart the listener; metrics changes start or stop bStats.

`remote-deploy.slave.slave-payload` and `remote-deploy.master.master-deploy-to` are represented as redacted, file-only entries because they contain secrets. Edit them directly in `biletools.yml`, then reload BileTools or restart the server.

The language entry opens `/bile language server edit`, which edits messages without changing anyone's selected language. It needs `biletools.config` or `volmit.language.admin`.
