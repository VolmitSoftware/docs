---
title: "Sigil: Installation and configuration"
description: "Install Sigil, find its files and configure reward vouchers"
published: true
date: 2026-10-24T00:00:00.000Z
tags: "sigil, installation, configuration"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Sigil supports released Minecraft 26.1 through 26.3 versions on released Java 25 or newer. A startup check enforces this range before loading dependencies. Settings and voucher definitions use TOML and can be edited through `/sigil config`.

## Install

1. Stop the server and back up its plugin data.
2. Place one Sigil distribution jar in `plugins/`.
3. Start the server and check the log for successful enablement.
4. Run `/sigil status`, then open `/sigil config` in-game.

Keep Sigil's data directory when updating. Existing vouchers depend on both the signing key and the redemption database.

On first start, SlimJar downloads Gson, TOML, Adventure, SQLite JDBC, SLF4J and the bStats runtime into `plugins/Sigil/.libs/`. Keep that cache when moving to an offline installation. Translation downloads use a separate system and require published language sources.

Some distributions extract their bundled runtime into `cache/runtime/` and reuse it on later starts. Runtime extraction works offline; library downloads require the `.libs/` cache or an internet connection.

## Files

Paths are relative to `plugins/Sigil/`.

| Path | Purpose |
|---|---|
| `config.toml` | Plugin settings |
| `.libs/` | Downloaded runtime libraries and relocated copies |
| `cache/runtime/` | Verified runtime extracted by an XZ distribution |
| `vouchers/<id>.toml` | One voucher definition per file |
| `languages/en_US.toml` | Editable English catalog, created on first start |
| `languages/<locale>.toml` | Installed translations |
| `languages/language-preferences.properties` | Saved personal language choices |
| `storage/redemptions.sqlite` | Issuance, claims, limits and reward outcomes |
| `storage/signing.key` | Key used to sign and verify voucher items |
| `debug/` | Local diagnostic reports |

## Main settings

| Setting | Default | Meaning |
|---|---|---|
| `general.enabled` | `true` | Enable voucher operations |
| `general.hotreload` | `true` | Watch configuration and installed language files |
| `general.reload-interval-ticks` | `100` | Reload interval, from 20 to 12,000 ticks |
| `general.language` | `"en_US"` | Default message language |
| `general.splash` | `true` | Show the startup banner |
| `general.debug-upload` | `false` | Permit explicitly requested diagnostic uploads |
| `general.maximum-pending-redemptions` | `256` | Maximum concurrent pending redemptions |
| `presentation.effects-enabled` | `true` | Play sound, particle and cosmetic lightning rewards |
| `commands.allow-operator` | `false` | Allow operator-mode commands on non-regionized servers |
| `commands.maximum-give-amount` | `64` | Maximum amount per give request |
| `integrations.update-notifications` | `false` | Enable shared GitHub update checks |
| `integrations.github-repository` | `"VolmitSoftware/Sigil"` | Placeholder GitHub owner/repository |
| `integrations.bstats-enabled` | `true` | Permit reporting when an assigned project ID exists |
| `integrations.bstats-id` | `0` | Placeholder; zero creates no reporter |

See [languages and integrations](/sigil/04-languages-integrations) before enabling external services.

File reload and editor saves validate the complete replacement before applying it. Invalid files leave the working configuration active. A save based on an outdated editor view is rejected so it cannot overwrite newer changes.

When changing the default language, reload validates the newly selected catalog before applying the configuration. A malformed new default rejects the change; switching away from a malformed previous default is allowed. Personal catalogs retain their last valid messages when a file cannot be read.

In the field editor, click a boolean to toggle it. Other values open a chat prompt; enter the value in JSON form, such as `12`, `"text"` or `["world"]`. Type `cancel` to leave the value unchanged. Cancellation, invalid input and the 60-second timeout return you to the originating editor page. Running another command cancels the prompt without reopening it. The default-language field opens the shared server language picker.

## Voucher fields

Use the supplied `trail-provisions.toml` as a starting point, or create a disabled definition in the editor.

| Area | Fields |
|---|---|
| Availability | `enabled`, `permission`, `denied-permissions` |
| Appearance | `material`, `name`, `lore`, `glow`, `custom-model-data`, `head-texture-url` |
| Redemption | `consume`, `confirmation`, `expiry-seconds`, `bind-on-give` |
| Cooldowns | `cooldown-seconds`, `cooldown-scope`, `cooldown-group` |
| Limits | `per-player-limit`, `global-limit`, `required-empty-slots` |
| Location and mode | `allowed-worlds`, `denied-worlds`, `allowed-game-modes` |
| Rewards | `rewards`, `weighted-rewards` |

Zero expiry or usage limits disable that limit. Empty world and game-mode allowlists allow any value. A group cooldown requires a group name; a reusable voucher (`consume = false`) requires a positive cooldown. `required-empty-slots` is an eligibility check, not a reservation of space for every reward.

Names and lore support MiniMessage formatting. A head texture requires `material = "PLAYER_HEAD"` and an HTTPS `textures.minecraft.net/texture/…` URL.

## Rewards

Each `[[rewards]]` table defines one ordered step. Supported types are `command`, `item`, `custom_item`, `xp`, `heal`, `feed`, `potion`, `message`, `broadcast`, `actionbar`, `title`, `sound`, `particle` and `lightning`. Every step accepts `delay-ticks`.

```toml
[[rewards]]
type = "item"
material = "BREAD"
amount = 8

[[rewards]]
type = "message"
text = "<gold>Your supplies are ready, %player%.</gold>"
```

Command rewards use `mode = "console"`, `"player"`, `"chat"` or `"operator"`. Store commands without a leading slash. Operator mode requires the explicit global setting and is unavailable on Folia and other regionized servers. Commands executed by another plugin retain that plugin's thread-safety requirements.

Captured items store their metadata in `item-data`; use the capture command or GUI to create it. Sound, particle and potion names must exist on the running server. Particles requiring extra block, item or color data are unsupported.

Weighted rewards choose one entire group after the guaranteed steps. Preview shows all possible groups and their relative chances. Edit group membership, weights and order in TOML.

```toml
[[weighted-rewards]]
id = "diamond"
weight = 1

[[weighted-rewards.rewards]]
type = "item"
material = "DIAMOND"
amount = 2

[[weighted-rewards]]
id = "emerald"
weight = 3

[[weighted-rewards.rewards]]
type = "item"
material = "EMERALD"
amount = 5
```

This example adds either two diamonds (25%) or five emeralds (75%) after any guaranteed rewards.

[Languages and integrations](/sigil/04-languages-integrations) · [Back to Sigil](/sigil)
