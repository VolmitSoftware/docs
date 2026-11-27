---
title: "API - Addons"
description: "Namespaces, AdaptAddon, ContentRegistrar, installing, refreshing and uninstalling, load errors, and id rules"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

An addon is one provider of content: skills, adaptations, custom items, commands, messages and art. It is a class that implements `AdaptAddon`, installed once from your plugin or mod entry point ([Getting started](/adapt/41-api-getting-started)). Adapt's built-in content is the addon with the namespace `adapt`.

## The example addon

`GeologyAddon`, from `examples/example-content`, is the whole addon:

```java
package com.example.geology;

import art.arcane.adapt.api.AdaptApi;
import art.arcane.adapt.api.addon.AdaptAddon;
import art.arcane.adapt.api.addon.AddonHandle;
import art.arcane.adapt.api.addon.ContentRegistrar;
import art.arcane.adapt.api.asset.AssetBundle;
import art.arcane.adapt.api.player.PlayerSection;
import art.arcane.adapt.api.text.MessageBundle;
import art.arcane.adapt.platform.value.Id;

import java.util.Optional;

/** The whole example addon: one skill with its own adaptations, one adaptation for a built-in skill. */
public final class GeologyAddon implements AdaptAddon {
  public static final String NAMESPACE = "example";
  public static final Id GEOLOGY = Id.of(NAMESPACE, "geology");
  public static final Id PICKAXE = Id.adapt("pickaxe");
  private volatile AddonHandle handle;
  private volatile PlayerSection<FieldNotes> notes;

  /** Installs the addon and keeps the handle: only the installer may refresh or uninstall it. */
  public static AddonHandle install() {
    GeologyAddon addon = new GeologyAddon();
    addon.handle = AdaptApi.addons().install(addon);
    return addon.handle;
  }

  /** The handle {@link #install()} got; empty before it returns. */
  Optional<AddonHandle> handle() {
    return Optional.ofNullable(handle);
  }

  /** The field notes section the last {@code register} declared; empty before the first. */
  Optional<PlayerSection<FieldNotes>> notes() {
    return Optional.ofNullable(notes);
  }

  @Override
  public String namespace() {
    return NAMESPACE;
  }

  @Override
  public void register(ContentRegistrar registrar) {
    registrar.messages(MessageBundle.resources(GeologyAddon.class, "example/lang"));
    registrar.assets(AssetBundle.resources(GeologyAddon.class, "assets/example"));
    notes = registrar.playerSection("field_notes", FieldNotes.class, FieldNotes::new);
    registrar.skill(GEOLOGY, GeologySkill::new);
    registrar.adaptation(PICKAXE, Aftershock.ID, Aftershock::new);
    GeologyConsole console = new GeologyConsole(this::handle, this::notes);
    registrar.listener(console);
    registrar.command(console.command());
  }
}
```

It declares:

| Id | What it is | Page |
|---|---|---|
| `example:geology` | A skill that pays XP for breaking natural stone and ore | [Skills and XP](/adapt/43-api-skills) |
| `example:geology/stone_skin` | Extra armor while learned | [Adaptations](/adapt/44-api-adaptations) |
| `example:geology/prospect` | Sneak and right-click stone with a pickaxe to mark nearby ore, with a cooldown | [Adaptations](/adapt/44-api-adaptations) |
| `example:geology/core_sample` | Broken stone sometimes yields a sample; a preference picks where it goes; needs `adapt:pickaxe/gem_polish` at level 1 | [Adaptations](/adapt/44-api-adaptations) |
| `example:geology/geode_lens` | Unlocks the recipe of the Geode Lens | [Adaptations](/adapt/44-api-adaptations) |
| `example:geode_lens` | A custom item that doubles the Prospect radius from the off hand | [Adaptations](/adapt/44-api-adaptations) |
| `example:pickaxe/aftershock` | An adaptation added to the built-in skill `adapt:pickaxe` | [Adaptations](/adapt/44-api-adaptations) |
| `example:field_notes` | The addon's own section in each player's save, counting the field notes a player wrote | [Players and content](/adapt/48-api-players-content#your-own-data-in-the-players-save) |
| `/adapt geology` | Operator commands that drive the API | [Commands](/adapt/53-api-commands) |

The jar holds the message files under `example/lang/` ([Text and translations](/adapt/45-api-text)) and the art under `assets/example/` ([Icons, art and themes](/adapt/46-api-art-themes)).

## Namespace

`namespace()` returns the namespace of every id the addon registers. It also names the addon's message bundle, its config folders, its data folder and its permission nodes.

- It matches `[a-z][a-z0-9_-]*` and has at most 32 characters.
- `adapt` and `minecraft` are reserved.
- One installed addon per namespace.
- It must return the same value on every call.

## Register

Adapt calls `register(ContentRegistrar)` every time its core starts, at once when you install while a core is running, and again on each refresh. It must declare the same content each time and must not keep the registrar, which is valid only during the call.

Content is passed as suppliers. Adapt builds a fresh instance on each core start and after a config reload, and retires the old one, so never build a skill or adaptation yourself and never keep one in a static field.

| `ContentRegistrar` method | Declares |
|---|---|
| `namespace()` | The namespace of the addon being registered |
| `messages(MessageBundle)` | The addon's messages. May be called more than once; a key defined twice is refused |
| `assets(AssetBundle)` | The addon's art. Experimental |
| `skill(Id, Supplier)` | A skill. The built skill must report the same id |
| `adaptation(Id skill, Id id, Supplier)` | An adaptation added to a skill of any addon, built-in skills included |
| `item(CustomItem.Definition)` | A custom item that belongs to no adaptation |
| `listener(Object)` | An object whose `@Handle` methods stay subscribed while the addon is installed |
| `command(AdaptCommand)` | A command below `/adapt`, see [Commands](/adapt/53-api-commands). Its permission nodes start with `<namespace>.` |
| `playerSection(path, type, initial)` | The addon's own data section `<namespace>:<path>` in each player's save. Returns the `PlayerSection` that reads it. Experimental, see [Players and content](/adapt/48-api-players-content#your-own-data-in-the-players-save) |
| `blockSlice(path, type, codec)` | A kind of per-block value `<namespace>:<path>` kept in world data. Returns the `BlockSlice` that reads it. Experimental, see [Players and content](/adapt/48-api-players-content#values-per-block) |
| `signature(...)`, `pairText(...)`, `pairName(...)` | Content for one mutation pair: a hand-made adaptation, a description, a name. Experimental, see [pair content](/adapt/47-api-mutations#pair-content) |

Every id must be in the addon's own namespace. A second registration of an id that already exists is refused with both owners named; nothing is overwritten. Any refusal, and any exception thrown from `register`, rejects the whole addon. The reason is logged and kept on its handle, and other addons are not affected.

### Adding to another addon's skill

`adaptation(skill, id, factory)` places an adaptation in your namespace under a skill another addon owns. The example adds Aftershock to the built-in Pickaxes skill:

```java
registrar.adaptation(PICKAXE, Aftershock.ID, Aftershock::new);
```

It appears on that skill's pages after the skill's own adaptations and is priced, learned and saved like them. If the skill is not installed, the adaptation waits and appears when the skill does.

## Load errors

When an addon is rejected, `handle.rejection()` and the server log give the reason. The common ones name what to fix:

| Problem | The reason names |
|---|---|
| A message file that is not valid TOML | The bundle as `<namespace>:<locale>`, the file, the parser's message, and the line number with the text of that line |
| A message key defined twice | The key, and the file that defines it again |
| A skill or adaptation supplier that throws | The content, as `Building skill example:geology failed: <reason>` or `Building adaptation <id> failed: <reason>` |
| An id registered twice | The addon, the kind of content and the id |
| A command word Adapt or another addon already uses | The word, and the addon that holds it |
| A command permission node outside the addon's namespace | The command, the node, and the `<namespace>.` it must start with |
| A player section or block slice path declared twice, or outside the id grammar | The path |
| A mutation slot or pair another addon already claimed | Both namespaces |

Fix the cause and restart, or call `handle.refresh()`.

## Install

```java
handle = AdaptApi.addons().install(new GeologyAddon());
```

`install` throws `IllegalArgumentException` when the namespace is malformed, reserved, or already installed, and names the addon that holds it. Install order and timing do not matter: an addon installed before Adapt starts is registered when the core starts.

The `AddonHandle` that `install` returns is the only way to refresh, uninstall or veto in the addon's name, so keep it. The example's `GeologyAddon.install()` installs a new `GeologyAddon` and stores the handle in a field of that addon, where its own `/adapt geology uninstall` command finds it; every entry point calls `GeologyAddon.install()`.

`AdaptApi.addons().find(namespace)` returns an `AddonInfo` of any installed addon: its namespace, `state()` and `rejection()`. `installed()` lists them in the order content is applied: `adapt` first, then install order. These values are copies taken at the call and cannot change the addon they describe, so ask again for a later state. The `AddonHandle` reads its own addon's state live.

| `AddonState` | Meaning |
|---|---|
| `WAITING` | Installed, waiting for a core to start |
| `ACTIVE` | Its content is registered in the running core |
| `REJECTED` | Its last `register` failed or broke a rule. Nothing of it is registered. `rejection()` gives the reason |
| `UNINSTALLED` | Removed. The handle is dead |

## Data folder

`handle.dataDirectory()` is the addon's own folder for files it keeps, `<Adapt data folder>/addons/<namespace>`, created when missing. It needs a running core and throws `IllegalStateException` otherwise. Skill and adaptation configs are not kept there; Adapt writes them to `skills/<namespace>/` and `adaptations/<namespace>/`.

## Refresh

`handle.refresh()` removes what the addon declared in `register` and runs `register` again, for an addon that reloaded its own data. Players keep their progress. Ability policies, cost providers and protectors stay registered, because they are registered outside `register`. A refresh fires `AddonUninstalledEvent` and then `AddonInstalledEvent`. It does nothing while no core runs.

## Uninstall

`handle.uninstall()` removes the addon while the server runs:

- its skills, adaptations, items, recipes, advancements, commands, messages and art leave the running core at once
- listeners it registered through `ContentRegistrar.listener` stop, and vetoes it placed are lifted
- ability policies, cost providers and protectors registered with its namespace, or whose classes its own class loader defined, are removed ([Abilities, protection and world](/adapt/50-api-abilities-protection))
- the permission nodes of its content and its commands are unregistered
- services it provided under its namespace through `AdaptApi.services()` are withdrawn

Uninstalling while no core runs removes the addon and its hooks and fires no event.

Players keep what they learned. Their saved XP, knowledge and adaptation levels in the addon's content stay in their save untouched and count toward nothing. When the addon is installed again, the progress counts again. Saved progress with no installed provider is called an orphan; `PlayerProfile.orphans()` lists it ([Players and content](/adapt/48-api-players-content#orphaned-progress)) and admins manage it with [`/adapt orphans`](/adapt/04-commands-permissions#orphaned-progress).

## Events

| Event | Fired |
|---|---|
| `AddonInstalledEvent` | An addon's content was registered in the running core: at install, at each core start, and at the end of each refresh |
| `AddonUninstalledEvent` | An addon's content was removed from the running core: at uninstall, and at the start of each refresh |
| `CatalogChangedEvent` | The set of registered content changed |

## Id rules

Content ids are `art.arcane.adapt.platform.value.Id` values, `namespace:path`, with a tighter alphabet than vanilla resource locations, because one id serves as a message key, a permission node, a config path and a save key.

- Namespace: `[a-z][a-z0-9_-]*`, at most 32 characters.
- Path: one or more segments of `[a-z0-9][a-z0-9_-]*` joined by `/`, at most 160 characters.
- No dots. A path's `/` becomes a dot in message keys and permission nodes, so a dot in the id would let two ids share a key.
- A skill id has one segment: `example:geology`.
- An adaptation id starts with its home skill's path by convention: `example:geology/prospect`. Adapt never reads the owning skill from the id; it is the skill the adaptation is registered under. Aftershock is `example:pickaxe/aftershock` because it lives on Pickaxes.

`ContentIds` checks and converts ids:

| Method | Result for `example:geology/prospect` |
|---|---|
| `ContentIds.require(id, what)` | The id, or `IllegalArgumentException` naming `what` |
| `ContentIds.child(skill, "prospect")` | `example:geology/prospect` from `example:geology` |
| `ContentIds.dotted(id)` | `example.geology.prospect` |
| `ContentIds.usePermission(id)` | `adapt.use.example.geology.prospect` |
| `ContentIds.configPath(id)` | `example/geology/prospect.toml`, below `adaptations/` |
| `ContentIds.display(id)` | `example:geology/prospect`; for `adapt` content, the bare path |
| `ContentIds.parse(text)` | Parses admin input. A bare path gets the `adapt` namespace |

`Id.parse` gives a bare path the `minecraft` namespace and is for Minecraft ids. Use `ContentIds.parse` or `Id.parseAdapt` for anything an admin types about Adapt content.
