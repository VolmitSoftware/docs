---
title: "BileTools: Remote Deploy"
description: "Push plugin jars to other servers, and the security model"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

BileTools can push built jars from one server (the master) to others (receivers).
Every transfer runs over mutual TLS 1.3: each server has its own Ed25519 key, and
each side accepts only the keys you list. Both halves are disabled by default.

## How a transfer is checked

1. When `allowed-addresses` is set, the receiver closes connections from other
   addresses before any TLS traffic.
2. The master and the receiver prove their keys to each other in the TLS
   handshake. The receiver refuses a master whose key is not in its
   `remote-deploy.slave.trusted-keys`, and the master refuses a receiver whose key
   is not in its `remote-deploy.master.trusted-keys`.
3. The master sends the jar name, size, and SHA-256 digest, then the jar, all
   inside the encrypted connection.
4. The receiver installs the jar only if its SHA-256 digest matches, then
   BileTools loads it.

No password or shared secret crosses the network, the jar is encrypted in transit,
and a recorded connection cannot be replayed. A server that has not proven a
trusted key never receives jar bytes. Both servers log the fingerprint of a
refused key.

> Anyone who holds a server's `server.key` can act as that server: push code to
> every receiver that trusts it, or receive jars meant for it. Keep that file
> private. Keep the listener off the public internet, and do not enable this on
> production.
{.is-warning}

Both servers must run the same BileTools version. Remote deploy needs Ed25519,
which standard Java 17 and newer runtimes include through the `jdk.crypto.ec`
module. If a trimmed runtime lacks it, BileTools logs an error and does not start
either half.

## Setting up

Remote deploy trust settings are file-only. The in-game editor offers the
enable switches, the receiver port, and the plugin names, but never shows or
edits either `trusted-keys` list, `allowed-addresses`, `slave-bind-address`, or
`master-deploy-to`. Edit those in `biletools.yml`, then restart the server or
reload BileTools. Diagnostic reports show only how many entries each list has.

1. Enable `master-enabled` on the master and `slave-enabled` on each receiver,
   then restart them or reload BileTools.
2. Each server creates `plugins/BileTools/remote-deploy/server.key` and
   `server.pub` the first time either half is enabled, and logs its public key
   and fingerprint on every start.
3. On each receiver, add the contents of the master's `server.pub` to
   `remote-deploy.slave.trusted-keys`.
4. On the master, add the contents of each receiver's `server.pub` to
   `remote-deploy.master.trusted-keys`, and list the receivers in
   `master-deploy-to`.
5. Restart the servers or reload BileTools.

To trust several servers, list each public key. To revoke one, remove its key. To
replace a server's key, delete both files in its `remote-deploy/` folder, restart
it, and put the new public key on every server that trusts it. If only one of the
two files exists, BileTools refuses to load the key and names the missing file.

## Receiver side

```yaml
remote-deploy:
  slave:
    slave-enabled: false
    slave-port: 9876
    slave-bind-address: 0.0.0.0
    trusted-keys: []
    allowed-addresses: []
```

| Key | Default | Effect |
|---|---|---|
| `slave-enabled` | `false` | Open the listener |
| `slave-port` | `9876` | Port to listen on |
| `slave-bind-address` | `0.0.0.0` | Interface to listen on. `0.0.0.0` listens on every interface |
| `trusted-keys` | `[]` | Public keys of masters allowed to deploy, one per entry |
| `allowed-addresses` | `[]` | Master IP addresses or CIDR ranges allowed to connect, such as `10.0.0.5` or `10.0.0.0/8`. Empty allows any address |

The listener does not start while `trusted-keys` is empty, or while
`trusted-keys` or `allowed-addresses` contains an invalid entry. The log names
the problem entry. `allowed-addresses` takes IP literals only, not hostnames.
A refused address is logged with the connecting IP.

`allowed-addresses` adds a second check on top of the key. It does not replace
`trusted-keys`, because a source address can be spoofed or shared.

Set `slave-bind-address` to a private or loopback address, or restrict the port
at the firewall, so strangers cannot reach the listener at all.

## Master side

```yaml
remote-deploy:
  master:
    master-enabled: false
    master-deploy-to: []
    trusted-keys: []
    master-deploy-signatures:
      - MyPlugin
      - AnotherPlugin
```

| Key | Default | Effect |
|---|---|---|
| `master-enabled` | `false` | Push jars to the configured targets |
| `master-deploy-to` | `[]` | Targets as `host:port`. Write IPv6 hosts as `[address]:port` |
| `trusted-keys` | `[]` | Public keys of receivers this master sends to, one per entry |
| `master-deploy-signatures` | `["MyPlugin", "AnotherPlugin"]` | Which plugins are eligible to push |

Only plugins named in `master-deploy-signatures` are pushed. A rebuild of an
unrelated jar is not distributed. The default plugin names are placeholders.
Replace them, or the feature does nothing. While `trusted-keys` is empty or
invalid, the master skips deploying and logs why.

## Transfer limits

| Key | Default | Minimum |
|---|---|---|
| `remote-deploy.socket-timeout-ms` | `15000` | `1000` |
| `remote-deploy.max-transfer-bytes` | `268435456` (256 MiB) | 1 MiB |

The size cap bounds a single transfer. Raise it only if you deploy jars larger
than 256 MiB. The cap also bounds how much a hostile peer can make the server
buffer.
