---
title: "API - Text and Translations"
description: "Message bundles, convention keys, Text values and arguments, config field labels, and admin overrides of addon messages"
published: true
date: 2026-11-27T00:00:00.000Z
tags: "adapt"
editor: markdown
dateCreated: 2026-11-26T00:00:00.000Z
---

Every string an addon shows comes from its message bundle. Content names nothing in code: a skill, adaptation, item or advancement finds its strings by convention keys built from its id.

## Message bundles

A bundle belongs to the addon's namespace, and its keys are relative to it. The entry `skill.geology.name` in the `example` bundle is the message `example.skill.geology.name`. A bundle cannot define a message outside its namespace.

Ship one TOML file per locale in the jar and register them in `register`:

```java
registrar.messages(MessageBundle.resources(GeologyAddon.class, "example/lang"));
```

`MessageBundle.resources(owner, root)` reads every `<root>/<locale>.toml` from the jar that holds `owner`, on every platform, including the jar file systems of Forge and NeoForge. `en_US.toml` is required; a message missing from another locale falls back to it. Locale names are the ones Adapt uses, such as `en_US`, `de_DE` and `pt_PT`.

```none
src/main/resources/
  example/lang/
    en_US.toml
    de_DE.toml
```

In the file, tables nest keys, and an array of strings is a multi-line message. From the example's `en_US.toml`:

```toml
[skill.geology]
name = "Geology"
description = "Read the rock you break and learn what lies inside it."
quip = "Every stone has a story."
xp_note = "Placed blocks pay nothing."

[skill.geology.group]
field = "Field work"
workshop = "Workshop"

[skill.geology.xp]
stone = "Break natural stone"
ore = "Break ore"

[adaptation.geology.prospect]
name = "Prospect"
description = "Sneak and right-click stone with a pickaxe to reveal nearby ore."
lore1 = "Scan radius"
lore2 = "Cooldown"

[adaptation.geology.prospect.hud]
found = "Ore nearby: {count}"

[adaptation.geology.core_sample.preference.delivery]
name = "Where samples go"

[adaptation.geology.core_sample.preference.delivery.choice]
drop = "Drop on the ground"
inventory = "Straight to inventory"

[adaptation.pickaxe.aftershock]
name = "Aftershock"
description = "Breaking ore sometimes grants a burst of Haste."
lore1 = "Chance per ore"

[item.geode_lens]
name = "Geode Lens"
lore1 = "Hold in your off hand while prospecting."

[advancement.geology_rocks_100]
title = "Rock Collector"
description = "Break 100 natural stone."
```

Aftershock lives on the built-in Pickaxes skill, yet its messages are in the `example` bundle, below its own id: `example.adaptation.pickaxe.aftershock`.

For messages written in code, build a bundle instead. `message(key, text)` adds an `en_US` message and `message(locale, key, text)` one in another locale:

```java
MessageBundle bundle = MessageBundle.builder()
    .message("skill.geology.name", "Geology")
    .message("de_DE", "skill.geology.name", "Geologie")
    .build();
registrar.messages(bundle);
```

`messages` may be called more than once.

### Errors in a bundle

A broken bundle rejects the addon, and the reason says where to look. A file that is not valid TOML names the bundle as `<namespace>:<locale>`, such as `example:de_DE`, the file, the parser's message, and the line number with the text of that line. A key defined twice, in one file or across bundles, names the key and the file that defines it again. A dotted key that is both a message and a table, such as `preference.delivery` next to `preference.delivery.drop`, is not valid TOML; the convention keys below never need one.

## Convention keys

For the skill `example:geology` and the adaptation `example:geology/prospect`, with the namespace prefix shown in full:

| Key | Use |
|---|---|
| `example.skill.geology.name` | Skill name |
| `example.skill.geology.description` | Skill description |
| `example.skill.geology.emoji` | One glyph shown before the name. Optional |
| `example.skill.geology.quip` | Toast line when a player discovers the skill |
| `example.skill.geology.unlock_quip.1` | Toast lines for unlocked adaptations, numbered from 1. Optional |
| `example.skill.geology.xp.<source>` | The XP guide line of a declared source |
| `example.skill.geology.mutated.noun`, `.mutated.adjective` | Mutation name when the skill leads or joins as partner |
| `example.skill.geology.block.<slot>` | The phrase of each mutation block |
| `example.pair.<lead>.<partner>.<recipe>` | Text of a signature or pair text this addon registers, with both parent ids dotted, such as `example.pair.example.geology.adapt.pickaxe.graft`. `TextKeys.pair(namespace, slot)` builds it |
| `example.adaptation.geology.prospect.name` | Adaptation name |
| `example.adaptation.geology.prospect.description` | Adaptation description |
| `example.adaptation.geology.prospect.short_name` | Name on its skill's pages. Optional |
| `example.adaptation.geology.prospect.lore1` | Stat labels, numbered from 1 |
| `<owner key>.preference.<id>.name` | The label of a preference without one of its own |
| `<owner key>.preference.<id>.choice.<value>` | The label of a choice without one of its own, the value in lower case |
| `example.advancement.<key>.title`, `.description` | Advancement text |
| `example.item.geode_lens.name`, `.lore1` | Custom item name and lore lines |
| `example.config.fields.skills.geology.<field>.label` | Config menu label of a skill config field. Declared by Adapt, see below |
| `example.config.fields.adaptations.geology.prospect.<field>.description` | Config menu description of an adaptation config field, multi-line. Declared by Adapt, see below |

The owner key of a preference is the message key of the skill or adaptation that declares it, such as `example.adaptation.geology.core_sample`. A preference or choice with its own label, keyed or literal, uses that label instead; the choices of `CommonPreferences.toggle` and `scale` use Adapt's shared `adapt.preferences.*` keys ([Adaptations](/adapt/44-api-adaptations#player-preferences)).

A path's `/` becomes a dot. `TextKeys` builds each of these from an id: `TextKeys.skill(id)`, `adaptation(id)`, `item(id)`, `advancement(owner, key)`, `xpSource(skill, source)`, `skillConfigField(skill, field)`, `adaptationConfigField(adaptation, field)`.

Inside a skill or adaptation, `text("relative.key")` is a message below the component's own key: in Prospect, `text("hud.found")` is `example.adaptation.geology.prospect.hud.found`.

Adapt declares the config field keys of every skill, adaptation, upgrade and mutation block an addon registers, in English, from the config class: the label is the field name split into words, `stoneXp` as "Stone Xp", and the description is the field's `@ConfigDoc` text followed by `Effect: ` and its `impact`. Editing the annotation edits the English everywhere, the TOML file comment and the config menu alike. A bundle translates these keys in any locale without restating the English, and an `en_US` entry for one of them replaces the derived English. Adapt's built-in content gets its config field English the same way.

The built-in content's own messages are the bundle of the namespace `adapt`, and every built-in key starts with `adapt.`, as in `adapt.skill.swords.name` or `adapt.gui.preferences.reset`. Built-in keys and addon keys share one key space split by namespace, so no addon namespace, `gui`, `skill` or `herbalism` included, can clash with a built-in key. `TextKeys` builds a built-in key from a built-in id the same way as an addon's: `TextKeys.skill(Id.adapt("swords"))` is `adapt.skill.swords`.

A table whose keys are plural categories, `other` among them, and whose values share one placeholder is one plural message: `[gears]` with `one = "{count} gear"` and `other = "{count} gears"` is the message `example.gears`, which picks its form by the `count` argument.

`Text.renderFor(viewer, action)` runs `action` so that every `resolve()` inside it, on that thread, uses the viewer's language; use it to build a menu or label out of many texts for one player. `Markup` converts between Adapt markup, legacy section text and stored JSON components. Both are experimental.

## Text values

`Text` is a message that is not yet in any language: a key with arguments, or a literal. It is immutable.

| Method | Gives |
|---|---|
| `Text.key("example.skill.geology.name")` | A message by its full key |
| `Text.literal("Geology")` | Text shown as written in every language |
| `with(name, value)` | Adds an argument shown as plain text. Formatting inside it is escaped, so player input is safe here |
| `withMarkup(name, markup)` | Adds an argument that may carry formatting. Never pass player input |
| `with(name, nested)` | Adds another `Text`, resolved in the same language |
| `resolve()` | The string for the player Adapt is rendering for, or in the server's language outside a render |
| `resolve(player)` | The string in that player's language |
| `resolve("de_DE")` | The string in a named locale. A locale the server has no language file for renders in the server's language |

A message refers to an argument as `{name}`. Prospect's HUD line is `found = "Ore nearby: {count}"`, and the adaptation fills it:

```java
HudStatus.show(player, this, text("hud.found").with("count", ores.size()));
```

When a message and its arguments do not match, the message still renders. A placeholder no argument fills shows as written, `{count}`, and an argument the message does not name is dropped. The key is logged once, naming what is unfilled and what is unused, so a translator's typo shows in the text instead of failing the code that renders it.

A key no bundle defines resolves to the key itself and is logged once.

Strings shown to players use section-sign formatting codes. `TextFormat` holds them, and a constant's `toString()` is its code, so it concatenates into a string: `TextFormat.GREEN + "+ " + TextFormat.GRAY + label`. `TextFormat.of(Rgb)` gives an exact colour, `nearest(Rgb)` the closest of the sixteen, and `strip(text)` removes all codes.

## Admin overrides

A server admin overrides any addon message in `languages/<namespace>/<locale>.toml` in Adapt's data folder, such as `plugins/Adapt/languages/example/de_DE.toml`. The file uses the full keys, namespace first, in the same TOML layout:

```toml
[example.skill.geology]
name = "Gesteinskunde"
```

An entry there wins over the addon's own translation for that locale; keys it leaves out keep the addon's text. A broken override file is reported and skipped without affecting other addons.

Adapt's built-in messages keep their own files, `languages/<locale>.toml`, with their tables under `adapt`, described in [Localization](/adapt/07-localization).
