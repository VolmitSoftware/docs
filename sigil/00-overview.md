---
title: "Sigil: Getting started"
description: "Issue a voucher, redeem it, and use the in-game editor"
published: true
date: 2026-10-28T00:00:00.000Z
tags: "sigil, vouchers, getting-started"
editor: markdown
dateCreated: 2026-10-15T00:00:00.000Z
---

Sigil turns configured rewards into signed inventory items. Players redeem them from their main hand; Sigil records each claim and reward outcome in a local database.

## Try a voucher

1. [Install Sigil](/sigil/02-installation-configuration) on Minecraft 26.1 through 26.3 with released Java 25 or newer.
2. Join with operator permissions and run `/sigil give player=YourName voucher=trail-provisions`.
3. Hold the issued voucher in your main hand and right-click, or run `/sigil redeem`.
4. Review the reward summary and confirm. The supplied voucher gives eight bread and 50 experience points, then sends a message.

Cancelling leaves the voucher intact. Changing the held item or the voucher definition while a confirmation is open requires a fresh attempt.

## Edit vouchers

Open `/sigil config`. The home menu contains configuration, vouchers, languages and a reload control. Voucher pages provide appearance and reward editors, settings, previews, issuance, cloning and confirmed deletion. Back and page controls return to the surrounding list.

New and cloned definitions start disabled. Review their rewards and restrictions before enabling them. Open **Voucher appearance** and choose **Use held item appearance** to use the held item as the voucher template. This copies its supported metadata without consuming it; issued vouchers receive their own signed identities.

Open **Edit rewards** to add, edit, remove or reorder guaranteed rewards and weighted groups. Choose a reward type, enter its values, then select **Save reward**. To make the held item a reward, use **Capture held item** in the selected reward list or `/sigil capture voucher=<id>` for a guaranteed reward. Both leave the held stack unchanged. See [configuration](/sigil/02-installation-configuration) for appearance controls, reward fields and TOML examples.

## Reward behavior

Each redemption runs its guaranteed rewards, followed by one weighted group when groups are configured. The selected group is recorded before delivery and stays fixed through later configuration changes.

Rewards include items, captured items, experience, healing, food, effects, messages and commands. Reusable vouchers require a positive cooldown. Expiry, player binding, permissions, world/game-mode restrictions and usage limits are optional per definition.

Issue vouchers to online players. Item rewards that do not fit are dropped at the player's location. Interrupted rewards appear in [recovery](/sigil/05-operations#interrupted-deliveries) for operator review.

[Commands and permissions](/sigil/03-commands-permissions) · [Back to Sigil](/sigil)
