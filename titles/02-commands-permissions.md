---
title: Titles commands and permissions
description: Player commands, administrative actions, and access nodes
published: true
date: 2026-10-24T00:00:00.000Z
tags: titles
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

The root command is /titles, with /title and /tags aliases. Running it without arguments opens Director help. Help lists only permitted commands and supports paging with /titles help=2; /titles ? also opens help. The debug group exposes version with titles.use and dump with titles.debug. Inventory menus require a player; list, grants, reload, status, version, and diagnostic commands support console use.

## Commands

| Command | Permission | Purpose |
| --- | --- | --- |
| /titles menu | titles.use | Browse the collection |
| /titles list [page] | titles.use | Paginated chat listing |
| /titles search <text> | titles.use | Search title IDs and display text |
| /titles category <id> | titles.use | Browse one category |
| /titles categories | titles.use | Open the category picker |
| /titles details <id> | titles.use | Inspect access, metadata, and actions |
| /titles preview <id> | titles.use | Show a wrapped title and sample chat line |
| /titles select <id> | titles.use | Select an accessible title |
| /titles clear | titles.use | Clear selection |
| /titles random | titles.use | Select an accessible random-reward title |
| /titles favorite <id> | titles.favorite | Toggle a favorite |
| /titles color <hex, gradient, or reset> | titles.color | Recolor the selected title |
| /titles give <player or UUID> <id or random> [duration] [reason=...] | titles.give | Grant access; duration is seconds, zero is permanent |
| /titles revoke <player or UUID> <id> [reason=...] | titles.revoke | Remove the grant and explicitly deny access |
| /titles history <player or UUID> [page] | titles.history | Read retained title operations, newest first |
| /titles create <id> | titles.admin | Create a definition |
| /titles delete <id> <confirmation> | titles.admin | Delete by repeating the exact ID |
| /titles edit <id> | titles.config | Open a title editor |
| /titles config | titles.config | Open settings and catalog tools |
| /titles language | Shared language permissions | Select a personal locale or access permitted language tools |
| /titles reload | titles.reload | Reload configuration and languages |
| /titles status | titles.admin | Show catalog and runtime status |
| /titles debug dump [upload=false] | titles.debug | Save a diagnostic report; upload requires explicit true and debugUpload |
| /titles debug version | titles.use | Show the installed version |
| /titles version | titles.use | Hidden alias for the version response |

## Permission defaults

Players receive titles.use, titles.favorite, and titles.color by default. Administrative nodes default to operators. titles.admin includes config, debug, reload, give, revoke, history, and update permissions. titles.all defaults to false. The shared language service manages self-selection and editing permissions; Titles language editing requires titles.config.

The optional title-specific colorPermission adds another requirement to titles.color. Color changes also require global and per-title recoloring to be enabled. Operators do not automatically receive every dynamic titles.title.<id> node.

## Grants

Online recipients may be addressed by exact name; offline recipients require a UUID. Random awards require an online recipient. Granting does not select the title. A new grant clears an explicit denial and replaces the previous expiry; repeated timed grants do not add their durations together. Acquisition metadata retains the first recorded grant time and source.

Deleting a configured default or fallback definition is rejected until the corresponding setting changes. Success messages for player-data changes follow the completed persistent write.

Queued grants and revocations check that the catalog remains current before saving. If a catalog edit invalidates an operation, repeat the command against the updated definitions. Random grants also check saved ownership before writing. Expected gameplay failures, including locked titles and cooldowns, use the sender's selected language with English fallback.

## Operation history and reasons

`/titles history <player or UUID> [page]` reads ten entries per page, newest first, from the player's latest 256 retained operations. Page numbers range from 1 to 26; a page beyond the retained entries returns an empty result. Exact names resolve online players; offline lookups require a UUID. `titles.history` defaults to operators and is included in `titles.admin`.

Each entry shows its UTC timestamp, action, title ID, actor, source, reason, expiry in epoch milliseconds, operation UUID, and changed flag. Zero expiry means no grant deadline. These are saved operation facts; they do not establish the player's current permission-based access. Output labels follow the sender's language, while stored identifiers and metadata remain literal text.

Give and revoke accept an optional reason, for example `/titles give ExamplePlayer pathfinder duration=3600 reason=event_reward`. Reasons permit up to 512 characters without control characters. Each command creates an operation UUID, uses `command` as its source, and records the sender's player UUID or console name as actor. Omitted reasons are empty. Explicit player selections and clears also create receipts; default initialization, colors, and favorites do not.
