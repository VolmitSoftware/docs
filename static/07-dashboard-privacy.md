---
title: Static - Dashboard and privacy
description: Read-only web reports, access tokens, and profile visibility
published: true
date: 2026-10-14T00:00:00.000Z
tags: static, dashboard, privacy
editor: markdown
dateCreated: 2026-10-14T00:00:00.000Z
---

The optional dashboard shows server participation, rankings, player history, detailed counters, records, milestones, seasons, and player comparisons. It is read-only and disabled by default.

## Enable operator access

| Setting under `dashboard` | Default | Purpose |
|---|---|---|
| `enabled` | `false` | Starts the HTTP listener on `127.0.0.1` |
| `port` | `8791` | Listener port, from 1024 to 65535 |
| `publicOrigin` | `http://127.0.0.1:8791` | Browser origin allowed to access reports |
| `publicProfilesEnabled` | `false` | Allows opted-in public player pages |

Enable the listener and open its address on the server machine. Enter the generated token from `plugins/Static/dashboard/access-token`. The token grants operator access to all recorded profiles, including private ones. The browser keeps it in the current tab's memory; reloading, closing the tab, or signing out clears it.

For remote access, put an HTTPS reverse proxy in front of the loopback listener and set `publicOrigin` to its exact scheme, host, and optional port, without a path or trailing slash. The listener does not bind to a public interface. Failed configuration changes retain the working listener.

To revoke the shared token, stop Static, remove `dashboard/access-token`, and restart. Static generates a new token. Named staff accounts and per-account permissions are not available.

Reports show coverage and retention limits. Comparisons use selected players and available periods; no unrecorded history is inferred. The dashboard uses the server's selected language with English fallback.

## Player visibility

`/static privacy` shows your current choice. Set it with `/static privacy private`, `/static privacy server`, or `/static privacy public`.

| Mode | In-game access | Public web page |
|---|---|---|
| `private` | Owner and administrators with `static.privacy.bypass` | Unavailable |
| `server` (default) | Permitted in-game viewers and rankings | Unavailable |
| `public` | Permitted in-game viewers and rankings | Available when enabled by the operator |

Public profiles use `/player/<uuid>` and show lifetime statistics and record values. They omit sessions and activity dates. Both `dashboard.enabled` and `dashboard.publicProfilesEnabled` must be enabled, and the player must select `public`.

Private players are excluded from rankings shown to ordinary players and from PlaceholderAPI output. Operator dashboard access and the trusted Java API can still read stored data. Visibility controls access; they do not stop collection or delete history.

[Installation](/static/01-installation-configuration) · [History and records](/static/05-history-records) · [API and placeholders](/static/90-api-placeholders)
