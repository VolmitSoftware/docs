---
title: "Cache: Commands and permissions"
description: "Player commands, kit administration and permission defaults"
published: true
date: 2026-11-06T12:00:00.000Z
tags: "cache, commands, permissions"
editor: markdown
dateCreated: 2026-10-15T12:00:00.000Z
---

<nav class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/cache">Cache</a><span aria-hidden="true">/</span><span aria-current="page">Commands and permissions</span></nav>

Use `/cache` or `/ck` for Director help. Optional arguments appear in brackets below and must use `name=value` syntax, such as `uses=3` or `mode=ALL`. Angle brackets mark required values. Kit IDs are lowercase stable identifiers, not display names.

## Player commands

| Command | Behavior |
|---|---|
| `/kits` or `/cache browse` | Open the categorized kit browser |
| `/kit <kit>` or `/cache claim <kit>` | Start an ordinary claim, opening preview when configured or when a price applies |
| `/previewkit <kit>`, `/pk <kit>` or `/cache preview <kit>` | View rewards and their configured chances |
| `/cache redeem [kit=<id>]` | Redeem the key in the main hand; specify a kit for an any-kit key |
| `/cache why <kit> [player=self]` | Explain availability for yourself or an online player |
| `/cache history [player=self]` | Show the unresolved claim and up to 16 outcomes from the last 30 days as `kit: state (claim UUID)`; staff may supply an online name or UUID |
| `/cache retry` | Resume your saved READY delivery without rerolling |
| `/cache cancel` | Cancel your inactive READY claim and release its reserved key use |
| `/cache language` | Open personal language, server-language and editor controls according to permission |
{.dense}

Availability includes permissions, world restrictions, pending work and cooldowns. A READY result does not guarantee funds, inventory space or approval by integration listeners. Use the browser's refresh control to update displayed availability.

## Administration

| Command | Required permission | Behavior |
|---|---|---|
| `/cache create <kit>` | `cache.admin.edit` | Capture the player's inventory as a new kit; an existing ID is refused, so use the editor's capture button to replace items |
| `/cache edit <kit>` | `cache.admin.edit` | Open the kit/reward editor |
| `/cache delete <kit> [confirm=false]` | `cache.admin.edit` | Without `confirm=true`, print the confirming command; starter, crate and display references must be removed first |
| `/cache rollback <kit> <revision>` | `cache.admin.edit` | Publish a retained revision as a new revision |
| `/cache give <kit> <target>` | `cache.admin.give` | Grant to an online name, UUID or `all` online players; offline UUIDs receive a pending grant |
| `/cache key <kit> <player> [uses=1] [mode=ROLL]` | `cache.admin.key` | Issue one targeted or `*` any-kit key with 1 to 1,000,000 uses to an online player; mode is `ROLL` or `ALL` |
| `/cache crate <crate> <player>` | `cache.admin.key` | Issue one configured crate to an online player |
| `/cache config` | `cache.config` | Open the settings editor |
| `/cache language update` | `cache.config` or `volmit.language.admin` | Check the language repository now and merge changes into installed locales, at most once every five minutes |
| `/cache display bind <kit> [action=PREVIEW]` | `cache.admin.display` | Bind the block within six blocks of the player's sight; action is `PREVIEW`, `CLAIM` or `KEY` |
| `/cache display remove` | `cache.admin.display` | Remove the binding on the targeted block |
| `/cache reset <uuid> <kit>` | `cache.admin.resolve` | Reset the kit's shared cooldown group for that UUID |
| `/cache resolve <uuid> <claim> <complete\|cancel>` | `cache.admin.resolve` | Reconcile a REVIEW claim after inspecting its effects |
| `/cache status` | `cache.command` | Show current runtime counts and integration state |
| `/cache debug version` | `cache.command` | Show the installed descriptor version; `/cache version` is a hidden shortcut |
| `/cache debug dump [upload=true]` | `cache.debug` | Create a report and request upload; use `upload=false` for a local report, and uploads require the configured opt-in |
{.dense}

Creating, editing, browsing, configuration menus and block binding require a player. Console may use administrative delivery, history, reset, reconciliation, status and debug commands. Inspection of another player's history or availability requires `cache.admin.inspect`.

`reset` affects every kit using the same cooldown group. It does not erase prior-claim history or make a starter kit eligible again. `resolve` records an outcome; it does not issue replacement rewards, reverse items or perform refunds. Malformed UUIDs, unknown options and missing revisions are reported in chat without a console error. Settings and installed TOML files reload through the watcher and editor; there is no public reload command.

## Permission defaults

| Permission | Default | Scope |
|---|---|---|
| `cache.command` | Everyone | Root command access, status and version |
| `cache.claim` | Everyone | Ordinary claims, alongside the kit's optional permission |
| `cache.preview` | Everyone | Reward previews |
| `cache.buy` | Everyone | Ordinary claims with a price |
| `cache.redeem` | Everyone | Key and crate redemption |
| `cache.language.self` | Everyone | Personal language selection |
| `cache.config`, `cache.debug` | Operators | Settings and diagnostics |
| `cache.update` | Operators | Update notices; the shared `volmit.update` permission also qualifies |
| `cache.admin` | Operators | All declared kit administration permissions, configuration and debug access |
| `cache.admin.edit`, `.give`, `.key`, `.inspect`, `.resolve`, `.display` | Operators | Individual administrative operations; expand each suffix under `cache.admin` |
| `cache.bypass.cooldown` | Nobody | Bypass timed and once-only cooldowns for ordinary claims |
{.dense}

The shared language controls use the configured `cache.config` administrative gate for server defaults and message editing. A custom kit permission applies to ordinary claims. Staff grants and keys follow their own delivery paths, while enabled/world restrictions still apply.

## Related pages

- [Kits and rewards *Create definitions and place rewards*](/cache/03-kits-rewards)
- [Keys and displays *Token modes and block actions*](/cache/04-keys-displays)
- [Delivery and recovery *Understand READY and REVIEW before resolving a claim*](/cache/06-delivery-recovery)
{.links-list}
