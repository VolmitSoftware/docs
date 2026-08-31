---
title: "BileTools — Remote Deploy"
description: "Push plugin jars to other servers, and the security model"
published: true
date: 2026-08-24T00:00:00.000Z
tags: "biletools"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

BileTools can push built jars from one server (the master) to others (slaves)
over a TCP socket. Both the master and the slave are disabled by default.

> **Read this before you enable remote deploy.** The slave authenticates the
> master with a shared secret. The secret is stored in plaintext in
> `biletools.yml`. The master stores each target password in plaintext in
> `master-deploy-to`. The transport is a raw socket.
>
> Anyone who can reach the listener port and knows or guesses the secret can
> push arbitrary code. BileTools then loads that code. Do not expose the
> listener to the internet. Do not reuse a password from another system. Do not
> enable this on production.
{.is-danger}

## Slave side

```yaml
remote-deploy:
  slave:
    slave-enabled: false
    slave-port: 9876
    slave-payload: pickapassword
```

| Key | Default | Effect |
|---|---|---|
| `slave-enabled` | `false` | Open the listener |
| `slave-port` | `9876` | Port to listen on |
| `slave-payload` | `pickapassword` | Shared secret the master must present |

Change `slave-payload` before you enable the slave. The default is a literal
placeholder.

Bind the port to a private interface, or restrict it at the firewall. If your
servers are on different hosts, put the traffic inside a VPN or an SSH tunnel.
Do not expose the port.

## Master side

```yaml
remote-deploy:
  master:
    master-enabled: false
    master-deploy-to:
      - "yourserver.com:9876:password"
    master-deploy-signatures:
      - MyPlugin
      - AnotherPlugin
```

| Key | Default | Effect |
|---|---|---|
| `master-enabled` | `false` | Push jars to the configured targets |
| `master-deploy-to` | one placeholder entry | Targets as `host:port:password` |
| `master-deploy-signatures` | `["MyPlugin", "AnotherPlugin"]` | Which plugins are eligible to push |

Only plugins named in `master-deploy-signatures` are pushed. A rebuild of an
unrelated jar is not distributed. Both default entries are placeholders.
Replace them, or the feature does nothing.
## Transfer limits

| Key | Default | Minimum |
|---|---|---|
| `remote-deploy.socket-timeout-ms` | `15000` | `1000` |
| `remote-deploy.max-transfer-bytes` | `268435456` (256 MiB) | 1 MiB |

The size cap bounds a single transfer. Raise it only if you deploy jars larger
than 256 MiB. The cap also bounds how much a hostile peer can make the server
buffer.
