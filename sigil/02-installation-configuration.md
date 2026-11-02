---
title: "Sigil: Installation and configuration"
description: "Install Sigil, find its files and configure reward vouchers"
published: true
date: 2026-10-28T00:00:00.000Z
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

The appearance and reward editors use individual controls and plain-text or numeric chat input. The general field editor uses JSON values, such as `12`, `"text"` or `["world"]`; click a boolean to toggle it. The default-language field opens the shared server language picker.

Type `cancel` to leave a prompted value unchanged. Cancellation, invalid input and the 60-second timeout return you to the originating editor page. Running another command cancels the prompt without reopening it. Saves reject an editor view that has become outdated.

## Voucher fields

Use the supplied `trail-provisions.toml` as a starting point, or create a disabled definition in the editor.

| Area | Fields |
|---|---|
| Availability | `enabled`, `permission`, `denied-permissions` |
| Appearance | `material`, `name`, `lore`, `head-texture-url`, `appearance` |
| Redemption | `consume`, `confirmation`, `expiry-seconds`, `bind-on-give` |
| Cooldowns | `cooldown-seconds`, `cooldown-scope`, `cooldown-group` |
| Limits | `per-player-limit`, `global-limit`, `required-empty-slots` |
| Location and mode | `allowed-worlds`, `denied-worlds`, `allowed-game-modes` |
| Rewards | `rewards`, `weighted-rewards` |

Zero expiry or usage limits disable that limit. Empty world and game-mode allowlists allow any value. A group cooldown requires a group name; a reusable voucher (`consume = false`) requires a positive cooldown. `required-empty-slots` is an eligibility check, not a reservation of space for every reward.

Names and lore support MiniMessage formatting. A head texture requires `material = "PLAYER_HEAD"` and an HTTPS `textures.minecraft.net/texture/…` URL.

## Voucher appearance

Open `/sigil config`, choose **Vouchers**, select a definition, then open **Voucher appearance**. The item at the top previews the appearance used for issuance. Changes affect future items; items already issued retain their appearance.

Hold an item and select **Use held item appearance** to copy its material and supported metadata into `appearance.template`. The capture keeps the held stack unchanged and replaces the definition's appearance settings with the captured item. Existing name, lore and head texture overrides are cleared so the captured appearance is used. Template previews contain no Sigil voucher identity, and each issued item gets a fresh signed identity. **Remove item template** keeps the chosen material and explicit overrides while removing captured metadata.

Empty bundles and container items, and unload crossbows, before capturing their appearance. Items configured to leave another item after use cannot serve as appearance templates. These restrictions also apply to templates loaded from a file; captured item rewards can retain their contents.

Edit the name, material or head texture through their controls. The lore editor adds, edits or removes individual lines. Click glint, unbreakable or tooltip visibility to cycle between **Use item template**, **On** and **Off**. Rarity cycles through inheritance and the four rarity levels. Tooltip component controls show the component identifier and its hidden/visible state; the available components depend on the running server's API.

Custom model data has separate lists for numbers, flags, text and colors. Editing one list in the GUI preserves the values in the other three lists. **Use item template** removes the corresponding name, lore, tooltip-component or custom-model-data override. The model-data reset restores the entire captured model-data component, including all four lists.

| Field under `appearance` | Values and behavior |
|---|---|
| `template` | Encoded item snapshot created by the capture control; omit it for a plain material item |
| `glint` | `"inherit"`, `"on"` or `"off"`; controls visual glint without adding an enchantment |
| `unbreakable` | `"inherit"`, `"on"` or `"off"` |
| `hide-tooltip` | `"inherit"`, `"on"` or `"off"` |
| `item-model` | Namespaced model key, `"none"` to clear, or `"inherit"` |
| `tooltip-style` | Namespaced style key, `"none"` to clear, or `"inherit"` |
| `rarity` | `"inherit"`, `"common"`, `"uncommon"`, `"rare"` or `"epic"` |
| `hidden-components` | List of Bukkit item flags such as `"HIDE_ATTRIBUTES"`; `[]` shows all components, omission keeps the template's flags |
| `custom-model-data.floats` | Up to 64 finite numbers |
| `custom-model-data.flags` | Up to 64 boolean values (`true` or `false`) |
| `custom-model-data.strings` | Up to 64 strings, each at most 256 characters |
| `custom-model-data.colors` | Up to 64 quoted `"#RRGGBB"` colors |

Appearance switches default to inheritance. When a template is present, omit the top-level `name` or `lore` to retain its captured text. An explicit `lore = []` clears the lore. Omitting `appearance.custom-model-data` keeps captured model data; defining that table replaces all four lists, with omitted lists empty. Custom models and tooltip styles require matching resources in the player's resource pack.

```toml
[appearance]
glint = "on"
unbreakable = "on"
hide-tooltip = "off"
rarity = "rare"
item-model = "example:reward_ticket"
tooltip-style = "example:ticket"
hidden-components = ["HIDE_ATTRIBUTES", "HIDE_ENCHANTS"]

[appearance.custom-model-data]
floats = [1.0, 2.5]
flags = [true, false]
strings = ["copper"]
colors = ["#FFC66D", "#F08A5D"]
```

## Rewards

Each `[[rewards]]` table defines one ordered step. Supported types are `command`, `item`, `custom_item`, `xp`, `heal`, `feed`, `potion`, `message`, `broadcast`, `actionbar`, `title`, `sound`, `particle` and `lightning`. Every step accepts `delay-ticks`.

### In-game reward editing

1. Open the voucher's **Edit rewards** control and choose **Guaranteed rewards** or the weighted group list.
2. Select an existing reward or **Add reward**, then choose its type. The editor shows only fields used by that type.
3. Click a field and enter its value in chat. Command mode cycles through the available modes.
4. Select **Save reward** to validate and apply the complete reward. **Discard changes** leaves the saved reward unchanged.

Closing the draft or selecting **Discard changes** leaves it unsaved. Choosing another reward type starts that type with its default fields. **Move earlier** and **Move later** reorder the saved step immediately; they do not save draft field changes. **Remove reward** asks for confirmation. **Capture held item** copies the held stack into a captured-item draft; **Replace captured item** replaces that draft's item. Capturing does not consume the original stack. Save the draft to apply it.

To create a weighted group, select **Add weighted group**, enter a unique lowercase name using letters, digits or internal hyphens, and save its first reward. Open a group's **Weight** control to rename it, change its weight, reorder it or remove it with confirmation. A group must keep at least one reward, and a voucher must keep at least one guaranteed reward or weighted group.

| Reward | Fields in addition to delay |
|---|---|
| Command | Command text, execution mode |
| Ordinary item | Material, amount |
| Captured item | Captured stack, amount |
| Experience | Amount |
| Sound | Sound name, volume, pitch |
| Particle | Particle name, amount |
| Potion | Effect name, duration, amplifier |
| Title | Text, subtitle, fade-in, stay and fade-out times |
| Message, broadcast, action bar | Text |
| Heal, feed, lightning | No additional fields |

Delays and durations use server ticks; 20 ticks is one second at normal tick rate. Each guaranteed list or group holds at most 64 steps. Guaranteed steps plus any selected group must fit within 64 steps. A voucher supports up to 32 weighted groups and 1,024 total steps across all lists. Weights are integers from 1 to 1,000,000.

### TOML reward definitions

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

Weighted rewards choose one entire group after the guaranteed steps. Preview shows all possible groups and their relative chances. The editor and TOML definitions control the same group membership, weights and order.

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
