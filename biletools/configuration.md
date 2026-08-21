---
title: "BileTools — Configuration"
description: "Every config.yml key with its shipped default"
published: true
date: 2026-08-20T00:00:00.000Z
tags: "biletools, configuration"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

`plugins/BileTools/config.yml`. Values below are the defaults written on first
run. BileTools rewrites supported values after loading and restores missing
keys.

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

The debounce exists because builds and FTP clients can write a jar
incrementally. After the source stamp settles, BileTools creates and validates
an immutable off-thread snapshot. If the source changes during the copy, the
snapshot is rejected and the newest generation is retried. Temporary files
such as `.jar.part` are ignored until they are renamed to `.jar`.

After an automatic reload batch finishes, the next automatic batch cannot start
for three seconds. Only one batch runs at a time; changes that arrive during it
are coalesced by plugin into one latest-wins trailing batch. Jar deletion also
uses a fixed three-second grace period that recreation cancels. These two
intervals are not configurable.
The former `watcher.coalesce-window-ticks` key is removed when the configuration
is next loaded.

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
