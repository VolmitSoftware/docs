---
title: "Data Files & Hot Reload"
description: "Gloss documentation: Data Files & Hot Reload"
published: true
date: 2026-08-19T00:00:00.000Z
tags: "gloss"
editor: markdown
dateCreated: 2026-08-19T00:00:00.000Z
---
All Gloss content is plain JSON on disk under `plugins/Gloss/`. Most kinds share one document
envelope, one loader and one watchdog, so the rules on this page apply the same way to a hologram, a
scoreboard, an emoji and the tablist. Everything hot-reloads: edit a file, save it, and the change
applies within a few ticks with no command and no restart.

## The document envelope

Every hologram, board, emoji, animation, bubble style, tablist and MOTD document begins with the same
two keys:

```json
{
  "schemaVersion": 1,
  "revision": 7
}
```

`schemaVersion` must be exactly `1`. Any other value is a hard reject with
`unsupported <kind> schemaVersion: <n>`, where `<kind>` is the folder name (`holograms`, `boards`,
`emoji`, `animations`, `bubbles`, `tablist`, `motd`).

`revision` must be between `1` and `9007199254740991`, the largest integer a browser can represent
exactly. Anything outside that rejects with `<kind> revision must be between 1 and 9007199254740991`.
The revision is server-owned: Gloss increments it by one on every write it makes, and revision-checked
mutations refuse to run when the document on disk has moved on, reporting
`document <id> is at revision <actual>, expected <expected>`. Hand-editing a file does not need you to
bump the revision, but leaving it alone means the web editor and the command layer both see the file
as unchanged in revision terms, so bump it if you care about that.

Three kinds keep their own shapes instead. Menus have no envelope at all and use a SHA-256 hash of the
file's own text as their revision. Panels carry `schemaVersion`, `id`, `uuid` and a numeric `revision`
of their own. Container preview documents carry no version keys.

## Ids come from the file path

There is no `id` key inside an enveloped document. The id is the file name with `.json` removed, so
renaming a file renames the document. Ids may not contain `/`, `\` or `..` when Gloss writes them.

Only files ending in `.json` are read, and only files sitting directly inside the folder — a
subdirectory below `holograms/` or `emoji/` is ignored entirely. Menus are the exception: a menu id is
its whole path below `menus/`, so `menus/shop/weapons.json` is the menu `shop/weapons`.

Panels are the other exception. They keep an id and a UUID inside the document, and the file path must
match the canonical form of that id or the file is refused.

## Content hashing and self-writes

Each loaded document is kept with the SHA-256 of its raw text alongside the parsed value. Holograms
and boards write through a store that records the hash of the bytes it just wrote; when the folder
watcher later sees that file change, it compares the file's current hash against the recorded one and
skips the file if they match. That is what stops a command edit from bouncing straight back through
the hot-reload path. `config.toml` uses the same guard against its own canonicalisation rewrites.

Writes are atomic. The document is serialised to a temporary file in the same folder and moved into
place, so a reader never sees a half-written document.

## Hot reload

One repeating watchdog task polls the shared kinds every `[hotload] watchIntervalTicks` (default `5`).
Each registered watcher runs in turn; if one throws, it logs
`<name>: hot reload pass failed: <reason>` and the remaining watchers still run, so a single broken
kind cannot silence the rest. Changing `watchIntervalTicks` restarts the task on the next reload.

| Watcher | What a change does |
|---|---|
| `config` | Re-reads `config.toml` and reloads every service in place |
| `holograms` | Applies each changed document to its live display and logs `Hotloaded hologram <id>.json`; a deleted file despawns the hologram and logs `Hologram <id> removed from disk.` |
| `boards` | Rebuilds the metadata for changed ids, drops removed ones, then re-runs board selection for every player |
| `emoji` | Rebuilds the entire replacement table from the folder snapshot, ordered by document id |
| `animations` | Unregisters every `\|animation.<id>\|` text function and re-registers them from the snapshot |
| `bubbles` | Republishes the style snapshot; styles are read per bubble, so the change applies to the next bubble |
| `tablist` | Clears the applied header/footer and list-name caches so the next driver tick re-pushes them, or resets them on players when the document turns those features off |
| `motd` | Republishes the document snapshot; the next ping uses it |
| `menus` | Re-scans `menus/` and `images/`. A changed menu whose content hash actually differs destroys every open session of that menu, notifies those players, and re-registers the definition; a changed, added or removed image refreshes every open menu session and every live panel. The same pass also refreshes the localization overlay |
| `previews` | Recompiles changed and added `previews/*.json`, drops deleted ones, republishes the resolution snapshot and closes every open preview so the raycast rebuilds it |

Every watcher, menus and previews included, is one entry on that single watchdog task — no subsystem
runs a hot-reload task of its own. The `menus` entry does its fast pass (edits to files it already
knows) and its full folder walk (new and removed files) back to back inside the same pass, because a
`FolderWatcher` consumes each change exactly once: two separate tasks sharing one watcher would race,
and whichever fired first would eat a change the other one needed.

Panels are not watched at all. Edit a panel file by hand and apply it with `/gloss panel reload`.

A document that fails to parse is logged as `<kind>/<id>.json <reason>` and skipped. The copy already
in memory stays live, so a bad edit stops applying but does not delete working content. Fix the file
and the next poll picks it up.

## Document kinds

| Kind | Path | Envelope | Shipped defaults | Reset command | Documented on |
|---|---|---|---|---|---|
| Holograms | `holograms/<id>.json` | yes | none | — | [Holograms](/gloss/04-holograms) |
| Boards | `boards/<id>.json` | yes | `default` | `/gloss board reset [name=*]` | [Scoreboards & Groups](/gloss/05-scoreboards-groups) |
| Tablist | `tablist.json` | yes | one document | `/gloss tablist reset` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| MOTD | `motd.json` | yes | one document | `/gloss motd reset` | [Tablist & Server List MOTD](/gloss/06-tablist-motd) |
| Emoji | `emoji/<id>.json` | yes | 67 documents | `/gloss emoji reset [name=*]` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Animations | `animations/<id>.json` | yes | `rainbow` | `/gloss animations reset [name=*]` | [Emoji, Text & Animations](/gloss/07-emoji-text-animations) |
| Bubble styles | `bubbles/<id>.json` | yes | `default` | `/gloss bubbles reset [name=*]` | [Chat Bubbles, Indicators & Drops](/gloss/08-bubbles-indicators-drops) |
| Menus | `menus/**.json` | no, hash revision | none | — | [Hologram Menus](/gloss/09-menus) |
| Images | `images/<file>` | not JSON | none | — | [Icons](/gloss/11-icons) |
| Container previews | `previews/<id>.json` | no | 13 documents | `/gloss preview reset [name=*]` | [Container Previews](/gloss/15-container-previews) |
| Panels | `panels/<id>.json` | own id/uuid/revision | none | — | [Panels](/gloss/16-panels) |

`tablist.json` and `motd.json` live at the root of `plugins/Gloss/`, not inside a folder of their own.

## Shipped defaults and resets

At enable, each kind that ships defaults extracts only the files that are missing from its folder. An
edited file is never overwritten; a deleted file returns on the next boot. A file that is missing from
the jar logs `<kind>/<name>.json: missing from the jar, not extracted.` and is skipped.

The reset commands re-extract on demand and **do** overwrite. Each takes an optional name, defaulting
to `*` for every shipped document of that kind; `/gloss tablist reset` and `/gloss motd reset` take no
argument because each has exactly one document.

| Command | Permission |
|---|---|
| `/gloss emoji reset [name=*]` | `gloss.emoji.reset` |
| `/gloss animations reset [name=*]` | `gloss.animations.reset` |
| `/gloss bubbles reset [name=*]` | `gloss.bubbles.reset` |
| `/gloss board reset [name=*]` | `gloss.boards.edit` |
| `/gloss tablist reset` | `gloss.tablist.reset` |
| `/gloss motd reset` | `gloss.motd.reset` |
| `/gloss preview reset [name=*]` | `gloss.previews.reset` |

> A reset overwrites the named file on disk with the copy from the jar. Local edits to that file are
> gone, and there is no backup. Naming something that is not a shipped document writes nothing.
{.is-warning}

A reset only restores shipped documents. It never deletes extra documents you added, so a board or a
preview you created yourself survives `reset *` untouched — including one whose id shadows a shipped
name in a folder that resolves by priority.

The five reset permissions `gloss.emoji.reset`, `gloss.animations.reset`, `gloss.bubbles.reset`,
`gloss.tablist.reset` and `gloss.motd.reset` are children of `gloss.admin`. Board and preview resets
sit under their own subsystem nodes instead.

## Baselines are never extracted

Two documents inside the jar are read on demand and never written to the data folder:

| Baseline | Used by |
|---|---|
| `baselines/hologram.json` | `/gloss hologram create` and `/gloss hologram rendertext` |
| `baselines/menu-blank.json` | `/gloss menu new` |

There is no baseline file to edit. Change what a new hologram or a new menu looks like by editing the
document the command produced.

## Importing HoloUi data

`plugins/holoui` (or `plugins/HoloUi`) beside the Gloss data folder is imported automatically. The
boot-time run happens only when both conditions hold: `plugins/Gloss/holoui-import.json` does not
exist, and a source folder does. Writing that receipt is what makes the import one-shot.

The importer copies. It never moves, never deletes and never modifies anything inside the source
folder — the HoloUi folder is left exactly as it was, so you can keep it until you are satisfied and
then delete it yourself.

| Source | Destination | Notes |
|---|---|---|
| `menus/**` | `menus/**` | `.json` files only |
| `images/**` | `images/**` | any file type |
| `boards/**` | `panels/**` | HoloUi boards are Gloss panels; `.json` files only |
| `previews/*.json` | `previews/` | `holoui.preview.*` localization keys are rewritten to `gloss.preview.*` |
| `preview-scales.json` | `preview-scales.json` | verbatim |
| `language.yml` | `language.yml` | verbatim |
| `settings.json` | `config.toml` | keys overlaid, then the whole config re-serialised so comments regenerate |

Files and folders whose path contains a dot-prefixed segment are skipped, and symbolic links are never
followed. A rewritten preview whose bytes end up identical to a shipped Gloss default is not written;
the shipped copy is already there.

Three things are never copied under any circumstances, and the receipt records why:

| Path | Reason |
|---|---|
| `editor-sync-sessions.json` | Session secrets are never imported |
| `editor-sync-transactions/`, `editor-sync-backups/` | Editor sync state is never imported |
| `custom-items.json` | Regenerable with `/gloss item export` |

A HoloUi `editorSyncEndpoint` ending in `/v1` is also refused, because a v1 relay cannot speak the v2
sync protocol; the Gloss default endpoint is kept instead.

### The receipt

`plugins/Gloss/holoui-import.json` records `schemaVersion`, `importedAtMs`, the absolute `source`
path, whether the run was forced, and an `entries` array with one line per touched path:

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

Dispositions are `copied`, `skipped-shipped-identical`, `skipped-existing`, `skipped-secret`,
`skipped-retired-endpoint`, `overlaid-config-key` and `error`. A per-category summary is also logged
to the console when the import runs.

### Re-running it

```
/gloss import holoui
```

Permission `gloss.import`. This always runs with force semantics: files that were skipped last time
because the destination already existed are overwritten now. It still never touches the source folder
and still never copies the secrets above. The receipt is rewritten and Gloss reloads in place when the
run finishes.

> Forcing the import overwrites imported menus, panels, images and previews with the HoloUi copies.
> Edits you made in Gloss to those files are lost.
{.is-danger}

If no source folder is present the command reports that and does nothing.

## Migrating pre-merger Gloss data

The legacy migration is separate: it works in place, on files already inside `plugins/Gloss/`, and
converts pre-envelope documents to the current shape. It runs on every boot and can be re-run with:

```
/gloss import legacy
```

Permission `gloss.import`. It reloads Gloss in place when it finishes.

A file is legacy when it has no `schemaVersion` key. Its original bytes are copied to
`import-backups/<yyyyMMdd-HHmmss>/<kind>/<file>` before it is rewritten, and the rewritten document
starts at `revision` 1. Files that already carry an envelope are skipped, which makes the pass a no-op
on every boot after the first.

| Kind | Conversion |
|---|---|
| `holograms/` | `{id, world, x, y, z, lines}` becomes `anchor.world` plus `anchor.position`; the embedded `id` is dropped so the file name is the only id |
| `boards/` | `{title, content, primary, permission}` becomes the current shape, `content` becomes `lines`, and an empty `groups` list is added |
| `emoji/` | `{trigger, emoji, enabled}` gains the envelope; the legacy `<uses :id:>` trigger sentinel becomes an empty trigger |
| `animations/` | `target-framerate` becomes `frameIntervalMs` rounded from `1000 / framerate`, and `animation-type` is lowercased into `mode` |

`groups/` is absorbed rather than converted. Each `groups/<name>.yml` contributes its `tablist-name`
to `tablist.json` under the lowercased group name, and its `default-board` appends the group onto that
board document's `groups` list. A `default-board` naming a board that does not exist is recorded as a
note and skipped. When every group file processed without error, the whole `groups/` directory is
**moved** into the timestamped backup, which is why the folder disappears from the data tree.

A legacy `config.yml` is overlaid last. Its mechanical keys land in `config.toml`, its tablist keys
merge into `tablist.json`, its `chat-bubbles` keys into `bubbles/default.json`, and its `motd.texts`
into `motd.json` (each text split on newlines and truncated to the 2-line MOTD limit). The bubble and
MOTD content are only applied while the target document is still byte-identical to the shipped
default; a customised document is left alone and a note explains that the content was not applied.
The file is then renamed to `config.yml.imported`.

Both importers report their failures and keep going. An importer that throws logs
`HoloUi data import failed; continuing enable.` or `Legacy Gloss data migration failed; continuing
enable.` and startup proceeds.

## Importing holograms from other plugins

`/gloss import preview <source>` and `/gloss import apply <source>` are unrelated to the two importers
above. They read holograms from another plugin's data folder — `gholo`, `decent-holograms`,
`holographic-displays` or `fancy-holograms` — and are covered on
[Commands & Permissions](/gloss/17-commands-permissions).
