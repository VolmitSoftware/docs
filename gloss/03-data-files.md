---
title: "Data Files & Hot Reload"
description: "Gloss documentation: Data Files & Hot Reload"
published: true
date: 2026-08-24
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---

All Gloss content is plain JSON on disk under `plugins/Gloss/`. Most kinds share one document envelope, one loader and one watchdog. The rules on this page apply the same way to a hologram, a scoreboard, an emoji, real-drop settings and the tablist. Watched kinds hot-reload through a queued automatic batch; panel placement documents are the explicit manual-reload exception.

## The document envelope

Every hologram, board, emoji, animation, bubble style, real-drop settings, tablist and MOTD document starts with the same two keys:

```json
{
  "schemaVersion": 1,
  "revision": 7
}
```

`schemaVersion` must match that document kind. Holograms, boards, emoji, animations, real-drop settings, tablist and MOTD use `1`; bubble styles use `2`. Any other value is a hard reject with `unsupported <kind> schemaVersion: <n>`. `<kind>` is the folder or file kind (`holograms`, `boards`, `emoji`, `animations`, `bubbles`, `real-drops`, `tablist`, `motd`). On enable, Gloss atomically replaces only a `bubbles/default.json` whose bytes are identical to the former shipped schema-1 default with the new shipped schema-2 default and logs the upgrade. An edited or reformatted schema-1 bubble style is not interpreted as schema 2: update its shape before loading it on this release.

`revision` must be between `1` and `9007199254740991`. That is the largest integer a browser can represent exactly. Anything outside that range is rejected with `<kind> revision must be between 1 and 9007199254740991`. The revision is server-owned. Gloss increments it by one on every write it makes. Revision-checked mutations refuse to run when the document on disk has moved on. They report `document <id> is at revision <actual>, expected <expected>`. A hand edit of a file does not need you to bump the revision. If you leave it alone, the web editor and the command layer both see the file as unchanged in revision terms. Bump it if you care about that.

Three kinds keep their own shapes instead. Menus have no envelope at all. They use a SHA-256 hash of the file text as their revision. Panels carry `schemaVersion`, `id`, `uuid` and a numeric `revision` of their own. Container preview documents carry no version keys.

## Ids come from the file path

There is no `id` key inside an enveloped document. The id is the file name with `.json` removed. If you rename a file, you rename the document. Ids may not contain `/`, `\` or `..` when Gloss writes them.

Only files ending in `.json` are read. Only files sitting directly inside the folder are read. A subdirectory below `holograms/` or `emoji/` is ignored. Menus are the exception. A menu id is its whole path below `menus/`. `menus/shop/weapons.json` is the menu `shop/weapons`.

Panels are the other exception. They keep an id and a UUID inside the document. The file path must match the canonical form of that id. If it does not, the file is refused.

## Content hashing and self-writes

Each loaded document is kept with the SHA-256 of its raw text beside the parsed value. Holograms and boards write through a store that records the hash of the bytes it just wrote. When the folder watcher later sees that file change, it compares the file current hash against the recorded one. It skips the file if they match. That is what stops a command edit from bouncing back through the hot-reload path. `gloss.toml` uses the same guard against its own canonicalization rewrites.

Writes are atomic. The document is serialized to a temporary file in the same folder and moved into place. A reader never sees a half-written document.

## Hot reload

One repeating watchdog task requests a pass every `[hotload] watchIntervalTicks` (default `5`). Native watchers retain changes between passes, and an ordinary idle pass only drains those events. JSON registries perform a full directory-membership safety scan about every 18 seconds and start exact-content reconciliation about every 6 seconds; both windows restart when their preceding work completes. The ten registry kinds are split evenly between two 3-second start slots so their safety work does not all land in one pass. Exact reconciliation walks already-known documents in stable id order. Across every registry in one watchdog pass, it yields after 32 files, 8 MiB, or about 10 ms; a single file or full membership scan may exceed the time budget, and documents above 2 MiB are rejected before their content is hashed or parsed. An unfinished walk continues on a later pass, and its reconciliation batch is published only after the complete walk finishes. Automatic passes start no more than once every 3 seconds after the preceding apply batch completes, and requests made while one is waiting or running collapse into one trailing latest-state pass. Deletions are held for 3 seconds so an FTP or atomic replacement gap cannot unload live content. A document snapshot becomes live only after its consumer finishes applying it; a refused server-thread handoff or apply failure keeps the last-good snapshot live and rereads that pending file against the exact latest state. Each registered watcher runs in turn. If one throws, it logs the full failure for `<name>` and the remaining watchers still run. A single broken kind cannot silence the rest. If you change `watchIntervalTicks`, Gloss reschedules the tick pump without releasing the active batch; the new interval begins behind that batch's completion cooldown.

After a successful automatic batch, every online player with `gloss.admin` receives one coalesced action-bar notice naming the changed kinds and one Gloss success chime. Several files or kinds changed in the same pass still produce only one notice and one sound. `[commands] sounds` controls the chime; the visual notice remains enabled. Startup loads, `/gloss reload`, Gloss-owned writes, rejected documents and failed apply attempts do not produce this automatic success feedback.

The polling itself runs on a dedicated `Gloss-Watchdog-IO` thread. Stat, read and parse never touch the server tick. Anything that has to touch the world hops back to the server thread, or on Folia and Canvas to the owning region thread, before it applies. The console shows both halves:

```text
[Gloss-Watchdog-IO/INFO]: [Gloss] gloss.toml changed on disk; reloading.
[Server thread/INFO]: [Gloss] Reloaded in-place from disk.
```

Only one pass is ever in flight. If another request arrives while a disk scan or its server apply phase is still running, Gloss remembers one trailing pass and reads the latest state when the 3-second completion cooldown opens. A burst cannot stack unbounded work or lose its final save.

| Watcher | What a change does |
|---|---|
| `config` | Re-reads `gloss.toml` and reloads the services whose own config section actually changed |
| `holograms` | Applies each changed document to its live display and logs `Hotloaded hologram <id>.json`. A deleted file despawns the hologram and logs `Hologram <id> removed from disk.` |
| `boards` | Rebuilds the metadata for changed ids, drops removed ones, then re-runs board selection for every player |
| `emoji` | Rebuilds the entire replacement table from the folder snapshot, ordered by document id |
| `animations` | Unregisters every `\|animation.<id>\|` text function and re-registers them from the snapshot |
| `bubbles` | Republishes the style snapshot. Styles are read per bubble, so the change applies to the next bubble |
| `real-drops` | Rebuilds the cached presentation profile, recreates active drop displays, and rehydrates loaded items on their owning threads |
| `tablist` | Clears the applied header/footer and list-name caches so the next driver tick re-pushes them, or resets them on players when the document turns those features off |
| `motd` | Republishes the document snapshot. The next ping uses it |
| `menus` | Re-scans `menus/` and every subdirectory below it. A changed menu whose content hash actually differs destroys every open session of that menu, notifies those players, and re-registers the definition |
| `images` | A changed, added or removed image file refreshes every open menu session and every live panel |
| `locale` | Refreshes the localization overlay from `language.yml` |
| `previews` | Recompiles changed and added `previews/*.json`, drops deleted ones, republishes the resolution snapshot and closes every open preview so the raycast rebuilds it |

Every watcher is one entry on that single watchdog task. No subsystem
runs a hot-reload task of its own, and `menus/` is no longer the
exception: it is a folder-tree document registry on the same spine as
`holograms/` and `boards/`, so its discovery, self-write suppression and
parse-failure handling are the ones described on this page. `images/`
uses a reactive byte watcher rather than the document parser because an
image file has no document id, envelope, or revision. Its rolling digest
still detects a silent same-metadata replacement without decoding every
image on every pass. A
`FolderWatcher` consumes native recursive events and reconciles directory
state after overflow, deletion, recreation, or watcher-key loss. It does
not follow symlinks. Parsed documents use their SHA-256 content as the
final identity, so a touch or a late duplicate event is a no-op while an
atomic replacement or same-metadata edit still applies once. A target
that returns during the 3-second deletion grace cancels the pending
unload and is parsed from its final bytes.

A config edit picked up by the watchdog only cycles the services whose
section moved. Config sections compare as whole values, so editing
`[commands] sounds` no longer despawns and respawns every hologram on the
server the way it once did. Document watchers are unaffected either way:
a hologram file edit still hot-reloads that hologram.

`/gloss reload` is the deliberate config exception. It cycles every config-driven core service
unconditionally instead of only the services whose section changed. Panel placement documents
remain outside that path and use `/gloss panel reload`.

Panels are not watched at all. If you edit a panel file by hand, apply it with `/gloss panel reload`.

A document that fails to parse is skipped and the copy already in memory stays live. Automatic watching waits for the same invalid bytes to be observed on two separate passes before logging `<kind>/<id>.json <reason>`. This absorbs the zero-byte interval produced by editors that truncate and then rewrite a file. If valid or different bytes arrive on the next pass, no stale warning is emitted; unchanged invalid content logs once and remains rejected until fixed. Startup and `/gloss reload` remain immediate and report invalid files on their first read.

## Document kinds

| Kind | Path | Envelope | Shipped defaults | Reset command | Documented on |
|---|---|---|---|---|---|
| Holograms | `holograms/<id>.json` | yes | none | — | [Holograms](/gloss/04-holograms) |
| Boards | `boards/<id>.json` | yes | `default`, `animation-showcase` | `/gloss board reset [name=*]` | [Scoreboards & Groups](/gloss/05-scoreboards-groups) |
| Tablist | `tablist.json` | yes | one document | `/gloss tablist reset` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| MOTD | `motd.json` | yes | one document | `/gloss motd reset` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| Emoji | `emoji/<id>.json` | yes | 67 documents | `/gloss emoji reset [name=*]` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Animations | `animations/<id>.json` | yes | `rainbow`, `marquee`, `timeline`, `typewriter`, `flash`, `wipe`, `scanner`, `decode`, `odometer`, `wave` | `/gloss animations reset [name=*]` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Bubble styles | `bubbles/<id>.json` | yes | `default` | `/gloss bubbles reset [name=*]` | [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) |
| Real-drop settings | `real-drops/default.json` | yes | `default` | `/gloss drops reset [name=*]` | [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) |
| Menus | `menus/**.json` | no, hash revision | none | — | [Hologram Menus](/gloss/09-menus) |
| Images | `images/<file>` | not JSON | none | — | [Icons](/gloss/11-icons) |
| Container previews | `previews/<id>.json` | no | 14 documents | `/gloss preview reset [name=*]` | [Container Previews](/gloss/15-container-previews) |
| Panels | `panels/<id>.json` | own id/uuid/revision | none | — | [Panels](/gloss/16-panels) |

`tablist.json` and `motd.json` live at the root of `plugins/Gloss/`. They do not live inside a folder of their own.

A folder in that table exists only once there is something in it. Gloss creates `holograms/`, `menus/`, `images/` and `panels/` when the first document or asset is written to them, not at enable, and it never leaves an empty folder behind. Deleting a folder does not make the watcher recreate it; it comes back the next time a document of that kind is saved. Every document below a removed folder enters the same 3-second deletion grace and unregisters only if still absent; restoration cancels the pending unload.

## Shipped defaults and resets

At enable, each kind that ships defaults extracts only the files that are missing from its folder. An edited file is never overwritten. A deleted file returns on the next boot. A file that is missing from the jar logs `<kind>/<name>.json: missing from the jar, not extracted.` and is skipped.

Extraction is what creates those folders, and it follows the feature toggle. `previews/` is written only while `[features] previews` is on, `bubbles/` only while `chatBubbles` is on, `real-drops/` only while `realDrops` is on, `boards/` only while `boards` is on, `emoji/` and `animations/` only while their own feature is on, `tablist.json` only while `tablist` is on and `motd.json` only while `motd` is on — and `motd` ships off, so a stock data folder has no MOTD document at all.

Turning one of those features on extracts its defaults on the config reload rather than at the next restart. `previews` is again the exception: the preview registry is only constructed during enable, so `previews/` does not appear until the server restarts.

The reset commands re-extract on demand and **do** overwrite. Each takes an optional name. The default is `*` for every shipped document of that kind. `/gloss tablist reset` and `/gloss motd reset` take no argument. Each has exactly one document.

| Command | Permission |
|---|---|
| `/gloss emoji reset [name=*]` | `gloss.emoji.reset` |
| `/gloss animations reset [name=*]` | `gloss.animations.reset` |
| `/gloss bubbles reset [name=*]` | `gloss.bubbles.reset` |
| `/gloss drops reset [name=*]` | `gloss.drops.reset` |
| `/gloss board reset [name=*]` | `gloss.boards.edit` |
| `/gloss tablist reset` | `gloss.tablist.reset` |
| `/gloss motd reset` | `gloss.motd.reset` |
| `/gloss preview reset [name=*]` | `gloss.previews.reset` |

> A reset overwrites the named file on disk with the copy from the jar. Local edits to that file are gone. There is no backup. If you name something that is not a shipped document, Gloss writes nothing.
{.is-warning}

A reset only restores shipped documents. It never deletes extra documents you added. A board or a preview you created yourself survives `reset *` untouched. That includes one whose id shadows a shipped name in a folder that resolves by priority.

The six reset permissions `gloss.emoji.reset`, `gloss.animations.reset`, `gloss.bubbles.reset`, `gloss.drops.reset`, `gloss.tablist.reset` and `gloss.motd.reset` are children of `gloss.admin`. Board and preview resets sit under their own subsystem nodes instead.

## Baselines are never extracted

Two documents inside the jar are read on demand. They are never written to the data folder:

| Baseline | Used by |
|---|---|
| `baselines/hologram.json` | `/gloss hologram create` and `/gloss hologram rendertext` |
| `baselines/menu-blank.json` | `/gloss menu new` |

There is no baseline file to edit. Change what a new hologram or a new menu looks like. Edit the document the command produced.

## Importing HoloUi data

`plugins/holoui` (or `plugins/HoloUi`) beside the Gloss data folder is imported automatically. The boot-time run happens only when both conditions hold: `plugins/Gloss/holoui-import.json` does not exist, and a source folder does. Writing that receipt is what makes the import one-shot.

The importer copies. It never moves. It never deletes. It never modifies anything inside the source folder. The HoloUi folder is left exactly as it was. You can keep it until you are satisfied. Then delete it yourself.

| Source | Destination | Notes |
|---|---|---|
| `menus/**` | `menus/**` | `.json` files only |
| `images/**` | `images/**` | any file type |
| `boards/**` | `panels/**` | HoloUi boards are Gloss panels. `.json` files only |
| `previews/*.json` | `previews/` | `holoui.preview.*` localization keys are rewritten to `gloss.preview.*` |
| `preview-scales.json` | `preview-scales.json` | verbatim |
| `language.yml` | `language.yml` | message overrides copy verbatim; remove any copied top-level `locale` key because selection is authoritative in `gloss.toml` and the stale key is rejected |
| `settings.json` | `gloss.toml` | keys overlaid, then the whole config re-serialized so comments regenerate |

Files and folders whose path contains a dot-prefixed segment are skipped. Symbolic links are never followed. A rewritten preview whose bytes end up identical to a shipped Gloss default is not written. The shipped copy is already there.

Three things are never copied under any circumstances. The receipt records why:

| Path | Reason |
|---|---|
| `editor-sync-sessions.json` | Session secrets are never imported |
| `editor-sync-transactions/`, `editor-sync-backups/` | Editor sync state is never imported |
| `custom-items.json` | Regenerable with `/gloss item export` |

A HoloUi `editorSyncEndpoint` ending in `/v1` is also refused. A v1 relay cannot speak the v2 sync protocol. The Gloss default endpoint is kept instead.

### The receipt

`plugins/Gloss/holoui-import.json` records `schemaVersion`, `importedAtMs`, the absolute `source` path, whether the run was forced, and an `entries` array with one line per touched path:

```json
{
  "schemaVersion": 1,
  "importedAtMs": 1755561600000,
  "source": "/srv/mc/plugins/holoui",
  "force": false,
  "entries": [
    { "path": "menus/shop.json", "disposition": "copied" },
    { "path": "editor-sync-sessions.json", "disposition": "skipped-secret",
      "detail": "session secrets are never imported" }
  ]
}
```

Dispositions are `copied`, `skipped-shipped-identical`, `skipped-existing`, `skipped-secret`, `skipped-retired-endpoint`, `overlaid-config-key` and `error`. A per-category summary is also logged to the console when the import runs.

### Re-running it

```
/gloss import holoui
```

Permission `gloss.import`. This always runs with force semantics. Files that were skipped last time because the destination already existed are overwritten now. It still never touches the source folder. It still never copies the secrets above. The receipt is rewritten. Gloss reloads in place when the run finishes.

> If you force the import, Gloss overwrites imported menus, panels, images and previews with the HoloUi copies. Edits you made in Gloss to those files are lost.
{.is-danger}

If no source folder is present, the command reports that and does nothing.

## Migrating pre-merger Gloss data

The legacy migration is separate. It works in place on files already inside `plugins/Gloss/`. It converts pre-envelope documents to the current shape. It runs on every boot. You can re-run it with:

```
/gloss import legacy
```

Permission `gloss.import`. It reloads Gloss in place when it finishes.

A file is legacy when it has no `schemaVersion` key. Its original bytes are copied to `import-backups/<yyyyMMdd-HHmmss>/<kind>/<file>` before it is rewritten. The rewritten document starts at `revision` 1. Files that already carry an envelope are skipped. That makes the pass a no-op on every boot after the first.

| Kind | Conversion |
|---|---|
| `holograms/` | `{id, world, x, y, z, lines}` becomes `anchor.world` plus `anchor.position`. The embedded `id` is dropped so the file name is the only id |
| `boards/` | `{title, content, primary, permission}` becomes the current shape, `content` becomes `lines`, and an empty `groups` list is added |
| `emoji/` | `{trigger, emoji, enabled}` gains the envelope. The legacy `<uses :id:>` trigger sentinel becomes an empty trigger |
| `animations/` | `target-framerate` becomes `frameIntervalMs` rounded from `1000 / framerate`, and `animation-type` is lowercased into `mode` |

`groups/` is absorbed rather than converted. Each `groups/<name>.yml` contributes its `tablist-name` to `tablist.json` under the lowercased group name. Its `default-board` appends the group onto that board document `groups` list. A `default-board` that names a board that does not exist is recorded as a note and skipped. When every group file processed without error, the whole `groups/` directory is **moved** into the timestamped backup. That is why the folder disappears from the data tree.

A legacy `config.yml` is overlaid last. Its mechanical keys land in `gloss.toml`. Its tablist keys merge into `tablist.json`. Its `chat-bubbles` prefix, offset, wrap, lifetime, follow and hide values merge into the matching fields of the schema-2 `bubbles/default.json`. Legacy fly-away on keeps the shipped late-fly motion; fly-away off writes identity translation, scale, rotation and opacity expressions. Line stagger is discarded because one message is now one multiline display. Its `motd.texts` merge into `motd.json` (each text split on newlines and truncated to the 2-line MOTD limit). Bubble and MOTD content are only applied while the target document is still byte-identical to the shipped default. A customized document is left alone. A note explains that the content was not applied. The file is then renamed to `config.yml.imported`.

Both importers report their failures and keep going. An importer that throws logs `HoloUi data import failed; continuing enable.` or `Legacy Gloss data migration failed; continuing enable.` Startup proceeds.

## Importing holograms from other plugins

`/gloss import preview <source>` and `/gloss import apply <source>` are unrelated to the two importers above. They read holograms from another plugin data folder — `gholo`, `decent-holograms`, `holographic-displays` or `fancy-holograms`. They are covered on [Commands & Permissions](/gloss/17-commands-permissions).
