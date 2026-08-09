---
title: "BileTools — Configuration"
description: "Every config.yml key with its shipped default"
published: true
date: 2026-08-09T00:00:00.000Z
tags: "biletools, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

`plugins/BileTools/config.yml`. Values below are the defaults written on first run. BileTools
rewrites the file after loading, so unknown keys are dropped and missing keys are restored.

## Watcher

Controls the automatic hot-reload behaviour.

| Key | Default | Effect |
|---|---|---|
| `watcher.idle-poll-ticks` | `20` | Poll interval when nothing has changed recently. Minimum `1` |
| `watcher.active-poll-ticks` | `5` | Poll interval after a change is detected. Minimum `1` |
| `watcher.fingerprint-debounce-ticks` | `8` | Ticks a jar's fingerprint must stay stable before acting. Minimum `1` |
| `watcher.coalesce-window-ticks` | `10` | Batches nearby jar changes into one dependency-aware reload flush. Minimum `0` |
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

These are excluded because hot-reloading them on a dev box is usually either dangerous or
pointless — they hold static state, register protocol hooks, or are depended on by everything
else.

The debounce exists because a Gradle or Maven build writes the jar incrementally. Acting on
the first write would load a truncated file; BileTools waits for the fingerprint to settle.

## Lifecycle and observability

| Key | Default | Effect |
|---|---|---|
| `lifecycle.health-check` | `true` | Fail the reload if the plugin is not actually enabled and registered afterwards |
| `observability.log-timings` | `true` | Log unload, load and reload phase timings |
| `archive-plugins` | `true` | Archive a copy of a jar before `uninstall` deletes it |

Leave `health-check` on. Without it a plugin that throws during `onEnable` reports a
successful reload while sitting inert.

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

Both halves default to off. See [Remote Deploy](/biletools/remote-deploy) before enabling
either — the credential model needs reading first.
