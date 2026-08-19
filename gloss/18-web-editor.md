---
title: "Web Editor & Sync"
description: "Gloss documentation: Web Editor & Sync"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
Gloss has a companion browser editor for authoring its JSON documents on a calibrated canvas. The
plugin does not ship it, host it or need it — it only knows how to hand a document to it and, for two
document kinds, how to accept edits back. This page covers what the editor can do, what live sync
actually covers, the two link paths, the v2 sync protocol and the schema files in the plugin
repository.

## What the editor is

The editor is a separate browser application. It needs no account, keeps its workspace in browser
storage, and exports the same JSON files the plugin reads. It can open, edit and export ten Gloss
document kinds locally:

hologram menus, container previews, panels, holograms, animations, scoreboards, MOTD, emoji, bubble
styles and tablist.

Everything above works offline as file editing: export from the editor, drop the file into
`plugins/Gloss/`, and the hot reload described in [Data Files & Hot Reload](/gloss/03-data-files)
picks it up.

## Live sync covers menus and panels only

Live sync is a much narrower feature than local editing. The plugin side declares exactly two
syncable subjects — `EditorSyncKind` has `MENU` and `PANEL` — and a publication carrying any other
kind is refused with `sync document '<id>' has kind '<kind>', which this Gloss build cannot edit;
update Gloss`.

| Document kind | Editable in the editor | Published back through live sync |
|---|---|---|
| Hologram menus | yes | **yes** |
| Panels | yes | **yes** |
| Container previews | yes | no |
| Holograms | yes | no |
| Scoreboards | yes | no |
| Tablist | yes | no |
| MOTD | yes | no |
| Emoji | yes | no |
| Animations | yes | no |
| Bubble styles | yes | no |

> Scoreboards, tablist, MOTD, emoji, animations, bubble styles and holograms are edited on disk or in
> game. The editor can open and export them, but there is no path that publishes them back into a
> running server. Do not expect a sync session to carry them.
{.is-info}

## Hosting and URLs

Two independent addresses are configured, and neither is served by the plugin.

| Key | Default | What it points at |
|---|---|---|
| `[editor] builderUrl` | `https://gloss.volmitsoftware.com` | The browser editor itself |
| `[editor.sync] endpoint` | `https://sync.gloss.volmitsoftware.com/v2` | The relay that brokers live sessions |

The hosted editor moved off the retired HoloUi hostname onto `gloss.volmitsoftware.com`, and the
relay default moved with it. Gloss neither ships nor hosts either service and cannot guarantee that
either address is reachable from your network. If it is not, point `builderUrl` at a build you host
yourself and `[editor.sync] endpoint` at your own relay.

`builderUrl` is sanitized on every config load. It must begin with `http://` or `https://` and
contain no whitespace, quote, apostrophe, `<`, `>` or `\`; anything else silently restores the
default. Beyond that it is free-form, so `https://editor.example.com/gloss` and
`http://127.0.0.1:8080` are both accepted.

`endpoint` is stricter. It must be `https`, or `http` to `localhost`, `127.0.0.1` or `::1`; it must
carry no userinfo, query or fragment; its path must end in `/v2` and contain no `//`, `/./` or
`/../`; and the normalised form must be at most 1024 characters. A value failing any of those is
replaced by the default. Scheme and host are lowercased and trailing slashes are trimmed on write.

Gloss never accepts an inbound web connection. Every exchange is an outbound HTTPS request the plugin
makes to the relay.

## The one-way handoff

When live sync is not in play, Gloss builds a self-contained link that carries the document inside
the URL fragment. Nothing comes back: edits made in the editor stay in the browser and must be
exported and copied to the server by hand.

| Command | Permission | What it does |
|---|---|---|
| `/gloss menu builder` | `gloss.menus.builder` | Prints the configured `builderUrl` as a clickable link, with no document attached |
| `/gloss menu edit <menu>` | `gloss.menus.edit` | Live session if possible, one-way handoff otherwise |
| `/gloss panel web <board>` | `gloss.panels.editweb` | Live session if possible, one-way handoff otherwise |

The handoff falls out of `menu edit` or `panel web` whenever any of these hold: `[editor.sync]
enabled` is `false`, the sync service is not available, the sender does not hold `gloss.sync`, or
session creation failed. In every one of those cases the sender is told first, in as many words, that
live sync is unavailable and that the editor copy's saves do not return to this server. A failed
create is additionally logged with its cause.

For a panel, the one-way link carries the panel's **root menu**, not the panel document. A panel's
placement, ranges, visibility and follow settings only round-trip through a live session.

The link has the form:

```
<builderUrl>/#/import/menu/<payload>
```

`builderUrl` is normalised first: scheme and host lowercased, a trailing slash added, and a URL with
userinfo or a non-HTTP scheme rejected outright. The payload is unpadded base64url of a
gzip-compressed UTF-8 envelope:

```json
{ "version": 1, "kind": "menu", "runtimeId": "shops/main", "json": "{ ...the menu file... }" }
```

The compressed payload is capped at 48,000 URL characters. A menu that exceeds it is refused with a
message telling you to export the file instead. Because the document rides in the fragment, it never
reaches the editor's web server; the browser decodes it locally, previews it and adds it as a new
document only after you confirm.

## Live sync sessions

A live session is a capability brokered by a relay. Gloss polls the relay, applies validated
publications to disk and acknowledges them; the editor talks to the same relay from the browser. The
two never connect directly.

### Configuration

| Key | Default | Range and notes |
|---|---|---|
| `[editor.sync] enabled` | `true` | Turns the whole live path off; commands fall back to the one-way handoff |
| `[editor.sync] endpoint` | `https://sync.gloss.volmitsoftware.com/v2` | Validated as described above |
| `[editor.sync] createToken` | `""` | 22 to 128 characters of `A-Z a-z 0-9 _ -`. Anything else is blanked with a warning |
| `[editor.sync] sessionMinutes` | `60` | Clamped 5..1440. Requested session lifetime |
| `[editor.sync] pollSeconds` | `3` | Clamped 1..60. Delay between relay polls |
| `[editor.sync] maxProjectMiB` | `8` | Clamped 1..32. Cap on one canonical project |

All six live in `config.toml` and hot reload with it. See [Configuration](/gloss/02-configuration).

When `endpoint` is still the shipped default and `createToken` is blank, session creation is refused
before any request is sent, with `the official editor sync relay requires editorSyncCreateToken`. No
static secret ships in Gloss, so out of the box the commands produce the one-way handoff until an
operator supplies a token or points the endpoint at a relay that admits anonymous creation.

### The capability link

A successful create returns a link of this form:

```
<builderUrl>/#/sync/<sessionId>/<editorToken>?relay=<unpadded-base64url-endpoint>
```

The session id, the editor token and the relay address all sit in the URL fragment, so they are not
sent to the editor's web server and do not appear in ordinary access logs or referrer headers.

> Whoever holds that link can publish changes to your server until the session expires or is revoked.
> Treat the whole link as a secret.
{.is-danger}

A player is given three buttons — Open Editor, Copy Link and Revoke — rather than the raw URL, so the
capability is never pasted into chat where others can read it. The Revoke button runs
`/gloss sync revoke` for that session. Console gets the bare URL, preceded by an explicit warning that
it can publish to the server until revoked or expired.

The editor token is the browser's credential. A separate **server token** never leaves the server: it
is stored locally and is what Gloss uses to poll, acknowledge and revoke.

### The session store

Sessions live in `plugins/Gloss/editor-sync-sessions.json`. The file holds `version`, `1`, and a
`sessions` array; each entry carries `sessionId`, `serverToken`, `endpoint`, `kind`, `subjectId`,
`expiresAt`, `lastPublicationRevision`, `baseProject` and an optional `pendingAck`.

> This file contains live bearer credentials. Never copy it to another server, never commit it, never
> paste it into a support channel. Gloss writes it atomically and restricts it to owner read/write
> where the filesystem supports POSIX permissions, and the HoloUi importer refuses to copy it.
{.is-danger}

Gloss refuses to use the store if it is a symbolic link, if any ancestor of the data directory is a
symlink or missing, or if the file exceeds 80 MiB. A malformed entry is quarantined — kept verbatim
in the file, excluded from polling, and logged — rather than discarding the whole store. Sessions
carrying a retired v1 project are quarantined the same way at startup.

If the store is replaced but its durability cannot be confirmed, Gloss marks persistence unhealthy,
logs at `SEVERE`, and pauses new sessions and publication pulls until the server is restarted.

### Polling and expiry

One background task polls every active session on a fixed delay of `pollSeconds`. A failing poll
backs that session off exponentially: the delay starts at the larger of `pollSeconds` and 3 seconds,
doubles per consecutive failure, is capped at 300 seconds, and carries up to ten percent jitter
derived from the session id. A successful poll clears the backoff. Each failure logs the session, its
subject and the retry delay.

An expired session is removed on the next pass. Gloss stores at most 32 active sessions and 64 MiB of
canonical project bytes across all of them; a create that would exceed either is refused.

Every outbound relay exchange has a 20-second total deadline, and response bodies are size-capped
before parsing.

### Commands

Every node is gated by `gloss.sync`.

| Command | What it does |
|---|---|
| `/gloss sync list` | Every active session with its kind, subject, seconds to expiry, last publication revision and pending state |
| `/gloss sync status <session>` | The same fields for one session |
| `/gloss sync revoke <session>` | Revokes the capability at the relay and drops the session locally |
| `/gloss sync pull <session>` | Polls that session immediately instead of waiting for the next tick |

`pull` also answers to `poll`. Session ids are displayed abbreviated to their first 12 characters.
`status`, `revoke` and `pull` accept either the exact id or a unique prefix of at least 12
characters; a shorter prefix does not resolve and an ambiguous one is rejected.

`revoke` refuses while that session is processing a publication. `pull` reports that the session is
already being polled rather than queueing a second poll. The full command tree and its permissions are
on [Commands & Permissions](/gloss/17-commands-permissions); the panel commands a session edits are on
[Panels](/gloss/16-panels).

## Protocol v2

A sync project is one JSON object. `format` is `gloss-sync-project` and `version` is `2`.

```json
{
  "format": "gloss-sync-project",
  "version": 2,
  "kind": "panel",
  "subjectId": "spawn-hub",
  "documents": [
    { "kind": "menu",  "id": "spawn-hub",       "json": "{ ... }" },
    { "kind": "menu",  "id": "spawn-hub/shop",  "json": "{ ... }" },
    { "kind": "panel", "id": "spawn-hub",       "json": "{ ... }" }
  ],
  "images": [ { "path": "sync/spawn-hub/icon.png", "data": "data:image/png;base64,..." } ],
  "constraints": {
    "subjectId": "spawn-hub",
    "menuIds": ["spawn-hub", "spawn-hub/shop"],
    "imagePaths": ["sync/spawn-hub/icon.png"],
    "newMenuPrefix": "spawn-hub/",
    "newImagePrefix": "sync/spawn-hub/",
    "allowDeletes": false
  },
  "warnings": [],
  "baseRevision": "sha256:<64 lowercase hex characters>"
}
```

### The documents array

`documents[]` replaced v1's separate `menus[]` array and conditional `board` object with one uniform
list. Each entry is `{kind, id, json}` or `{kind, id, revision, json}` — no other field combination is
accepted.

| Rule | Value |
|---|---|
| Entries per project | 1 to 512 |
| Ordering | sorted by kind, then id; out-of-order is rejected |
| Uniqueness | one entry per (kind, id) pair |
| `id` length | at most 256 characters |
| `json` size | at most 2 MiB of UTF-8 |
| `revision` | optional; when present, an integer from 1 to 9007199254740991 |

`kind` is an open slug on the wire, matching `^[a-z][a-z0-9-]{0,31}$`. The relay never interprets it —
it is kind-agnostic and stores whatever slug the editor sends. Gloss then maps the slug onto the kinds
it has a codec for and rejects the rest with the actionable per-document error quoted above. The two
slugs Gloss handles are `menu` and `panel`; `panel` is the wire name for a world-anchored panel, which
was `board` in HoloUi.

A panel entry's `json` must already be canonical JSON text. A panel document whose text does not
re-canonicalize to itself is refused.

### Canonical text and hashing

`baseRevision` is `sha256:` followed by 64 lowercase hex characters: the SHA-256 of the UTF-8
canonical form of the project with only the root `baseRevision` key removed. Canonical form is:

- object keys sorted lexicographically, array order preserved
- strings quoted with ordinary JSON escapes, `\u00xx` only for control characters and lone surrogates
- numbers by IEEE-754 value — zero is `0`, values from `0.000001` up to `1e21` in plain decimal,
  anything outside that in lowercase exponent form, and non-finite numbers rejected

A project whose `baseRevision` does not equal the hash of its own content is rejected before anything
else happens.

### Structural and asset limits

| Limit | Value |
|---|---|
| Whole canonical project | `[editor.sync] maxProjectMiB`, 1 to 32 MiB |
| JSON nesting depth | 64 |
| JSON nodes | 200,000 |
| Characters in one string | 2,000,000 |
| Characters in one property name | 256 |
| Menu documents | 1 to 256 |
| Bytes per menu document | 2 MiB |
| Image assets | 512 |
| Bytes per image | 512 KiB |
| Image dimensions | at most 64 by 64, and at most 4,096 pixels |
| Aggregate stored image pixels | 262,144 |
| Aggregate image rows | 4,096 |
| Warnings | 256, each at most 512 characters |

Image data arrives as a base64 data URL. The declared media type must be one of `image/png`,
`image/jpeg`, `image/gif`, `image/webp` or `image/bmp`, and it must match what the leading bytes
actually are. A referenced image that is absent from the project is rejected, and a newly added image
that nothing references is rejected.

### Constraints and what a session may change

`constraints` is captured when the session opens and is immutable for its lifetime. A publication that
alters it is rejected with `sync publication cannot change its capability constraints`.

- `allowDeletes` is always `false`. Nothing in the session base may be dropped from a later
  publication — not a menu, not a panel, not an image.
- A menu session may publish only its own subject menu, may not create additional menus, and may not
  publish a panel document at all.
- A panel session must publish exactly its subject panel document. Its menu set is the root menu plus
  every loaded menu reachable from it, following `navigate` actions in `push`, `replace` or absent
  mode and `command` actions with an absent or `player` source that run a canonical menu-open command.
  Traversal is cycle-safe and capped at 256 menus. A referenced menu that is not loaded becomes a
  project warning rather than a failure; only a missing **root** menu fails the session.
- New menus in a panel session must sit under `constraints.newMenuPrefix`, and must be reachable from
  the panel root. That prefix is the root menu's parent path, so a root of `shops/main` gives
  `shops/` and a root of `spawn-hub` gives `spawn-hub/`.
- New images must sit under `constraints.newImagePrefix` — `sync/<panelId>/` for a panel session,
  `sync/menus/<menuId>/` for a menu session.
- The panel's `id`, `uuid`, `schemaVersion` and `revision` are server-owned. The editor sees the
  revision it opened with; Gloss assigns the next one on publication.

### Publication outcomes

Gloss polls for a pending publication, validates it, and acknowledges it with exactly one of three
statuses.

| Status | When | What the server does |
|---|---|---|
| `applied` | Everything validated and committed | Writes the files, republishes the menus, hot reloads the panel, and returns the fresh server snapshot |
| `conflict` | The server project moved since the session opened, so `baseRevision` no longer matches | Changes nothing and returns the current server snapshot for the editor to rebase on |
| `rejected` | The payload failed validation, or the subject no longer exists | Changes nothing and returns the reason |

Acknowledgement is idempotent and is retried; a session with an unsent acknowledgement reconciles it
on the next poll before fetching anything new.

### Version 1 is gone

A project whose `format` is `holoui-sync-project`, or whose `version` is `1`, is refused outright:

```
sync project uses protocol v1 (holoui-sync-project); Gloss speaks v2 only.
Open a fresh session with a v2 editor and relay.
```

Stored sessions carrying a v1 project are quarantined at startup and never polled. A HoloUi
`editorSyncEndpoint` ending in `/v1` is likewise refused by the importer, which keeps the Gloss
default instead. There is no migration path for an in-flight v1 session: revoke it on the old server
and open a fresh one.

### Relay surface

For an operator running their own relay, these are the four calls Gloss makes against
`<endpoint>`, each carrying the server token as a bearer credential except the create call, which
carries `createToken` when one is configured.

| Call | Expected |
|---|---|
| `POST /sessions` with `{protocol, expiresInSeconds, snapshot}` | `201` and `{protocol, sessionId, editorToken, serverToken, expiresAt, baseRevision}` |
| `GET /sessions/<id>/publication?after=<revision>` | `200` with a pending publication, or `204` when there is none |
| `POST /sessions/<id>/publication/<revision>/ack` | `200` |
| `DELETE /sessions/<id>` | `200`, `204`, `404` or `410` |

Gloss validates the response shape strictly: unknown or missing fields, a session id that does not
match, a capability outside 22..128 characters of `[A-Za-z0-9_-]`, a `baseRevision` that is not a
SHA-256 revision, or an expiry outside the requested window all fail the exchange.

## Durable publication

An `applied` publication is not a loose set of file writes. Gloss stages it as one journaled
transaction under the same persistence coordinator the in-game writers and file watchers use, so a
command edit cannot interleave with a publication.

Two working directories sit in the data folder:

| Path | Contents |
|---|---|
| `editor-sync-transactions/` | In-flight transactions: `journal.json`, a `stage/` tree and a `backup/` tree |
| `editor-sync-backups/` | Archived transactions, pruned to the most recent 20 |

Each transaction records the state it reached — `prepared`, `publishing`, `published`, `committed` or
`rolledback` — and every replaced file is hash-checked against the snapshot taken when the session
opened. A target that changed independently since then aborts the transaction rather than overwriting
the change.

Recovery runs at enable, before the config manager and any service start. A `committed` transaction is
archived; anything else is rolled back from its backup tree, marked `rolledback` and archived.
Unjournaled leftovers are validated and cleaned. If recovery cannot complete, Gloss refuses to enable
rather than starting on an inconsistent data folder.

Two failure modes are surfaced rather than swallowed. If commit succeeded but backup cleanup did not,
it is logged as a warning and retried at the next startup. If the commit marker itself could not be
made durable, the session is flagged as needing restart recovery and its relay acknowledgement is
paused — `/gloss sync pull` on it reports that the session requires server restart recovery.

> Do not hand-edit, move or delete `editor-sync-transactions/` or `editor-sync-backups/` while the
> server is running. They are the rollback record for a publication in flight.
{.is-warning}

Neither directory is copied by the HoloUi importer. See [Data Files & Hot Reload](/gloss/03-data-files).

## The JSON Schema files

The Gloss repository carries two hand-maintained JSON Schema 2020-12 files:

| File | Describes |
|---|---|
| `schema/gloss.schema.json` | A hologram menu document and all its components, icons and actions |
| `schema/gloss-preview.schema.json` | A container preview document |

They are documentation grade only, and both say so in their own `description`. No build step generates
them, the plugin never loads them, and they are not written into `plugins/Gloss/`. They exist so an
editor or IDE can offer completion and so the format has a readable reference.

**The Java parser is the format's source of truth.** A key that does not exist in Java does not exist,
whatever a schema says, and the parser enforces rules JSON Schema cannot express. Where a schema and
the runtime disagree, the runtime wins and the schema is the thing that is wrong. The behaviour pages
— [Hologram Menus](/gloss/09-menus), [Components & Hitboxes](/gloss/10-components-hitboxes),
[Icons](/gloss/11-icons), [Actions](/gloss/12-actions) and
[Container Previews](/gloss/15-container-previews) — take precedence over both.

## The custom item catalog

`/gloss item export` writes `plugins/Gloss/custom-items.json`, which is what the editor reads to offer
custom-item id completion, an approximate sprite and a warning when a referenced id is not in the
export.

```json
{
  "version": 1,
  "generated": 1755561600000,
  "providers": ["itemsadder", "oraxen"],
  "items": [
    { "provider": "itemsadder", "id": "myblocks:ruby", "name": "Ruby", "material": "diamond" }
  ]
}
```

Ids are probed by actually resolving them and dropped on failure, so the catalog never advertises an
id the server cannot produce. Output is at most 10,000 items per provider. The export runs
asynchronously and needs `gloss.items.export`; it refuses while a previous export is still running,
and both `/gloss item` nodes refuse entirely when `[items] customItems` is off.

The catalog is optional — custom-item icons export correctly without it — and it is not uploaded
anywhere. You load the file into the editor yourself. It is also regenerable at any time, which is why
the HoloUi importer skips it rather than copying it. See
[Custom Items & Item Providers](/gloss/14-custom-items).
