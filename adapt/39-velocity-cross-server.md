---
title: "Cross-Server SQL & Redis"
description: "Fenced SQL storage and Redis handoff across backend servers"
published: true
date: 2026-09-28T18:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-08-09T00:00:00.000Z
---

SQL is the authority for shared player data. Redis carries a request-correlated snapshot of the SQL owner being replaced. There is no proxy plugin. This path runs only when `sql.enabled` and `redis.enabled` are both true. Every backend that shares players uses the same schema, the same Redis service, and the same Adapt jar. `Adapt:data:v2` has no mixed-version decoder.

A backend with Redis disabled reads committed SQL only. It cannot recover an uncommitted in-memory snapshot from another backend.

On a server switch, the destination asks the previous owner for the live profile. If the handoff cannot be verified, the Minecraft login still succeeds and Adapt stays inactive for that player. Adapt does not create a second profile. It retries at most three times, after 2, 4, and 8 seconds. A reconnect starts a new claim.

A reset replaces the profile on the current backend. If the player is active on another backend, they reconnect there before Adapt resumes.

Redis has no TLS, database-number, or channel-name setting in Adapt. Separate networks that share one Redis service can see each other's traffic. Fence checks reject a snapshot for a different owner. Use a separate Redis service per network.

| Surface | Purpose |
|---|---|
| `Adapt:data:v2` | Fenced transfer requests, and epoch-only reset or purge notices |
| `Adapt:data:v2:reply:<request-id>` | Direct snapshot reply for one request |
| `Adapt:data:v2:stage:<player>:<owner>:<epoch>` | Staged snapshot for that fence. TTL 60 seconds |

Staging covers a lost reply only after `SETEX` completes. A source that stops before that write can lose the last uncommitted change. After the 60 second TTL, SQL and a matching `data/players/<uuid>.json.pending-sql` file are the remaining copies.

| Key | Default | What it does |
|---|---|---|
| `redis.enabled` | `false` | Handoff. Ignored unless SQL is enabled |
| `redis.host` | `"127.0.0.1"` | Redis address |
| `redis.port` | `6379` | Redis port |
| `redis.username` | `""` | ACL username. Sent when username or password is set |
| `redis.password` | `""` | Redis password, stored in the config as plain text |

SQL and Redis settings apply on restart. A later edit of those keys does not reconnect either service.

SQL keys, the InnoDB requirement, and the pending file are in [Installation and configuration](/adapt/01-installation-configuration).
