---
title: "Bastion: Claim welcome messages"
description: Owner-managed entry text, visitor rules, and website links
published: true
date: 2026-11-06T00:00:00.000Z
tags: bastion, claims, welcome
editor: markdown
dateCreated: 2026-10-10T09:48:05.000Z
---

Claim owners can configure a welcome message, visitor rules, and an optional website link. Entry messages are disabled by default and use a fixed 60-second cooldown per visitor across all claims.

## Editing

Select a claim and run `/bastion welcome`, or open its owner management menu. Editing requires ownership plus `bastion.command` and `bastion.manage`; administrator bypass does not grant permission to write another owner's message.

| Field | Limit | Accepted content |
| --- | --- | --- |
| Welcome message | 160 characters | Single-line plain text |
| Visitor rules | 240 characters | Single-line plain text |
| Website link | 256 characters | HTTP or HTTPS URL with a host and no embedded login credentials |

Choose a field and type its value in chat within 30 seconds. Type `clear` to empty that field, or `cancel` to leave it unchanged. Control characters are rejected and surrounding whitespace is trimmed. Formatting markup in owner text is displayed literally.

Use **Enable entry messages** after adding at least one field. **Disable entry messages** retains the content. **Preview messages** shows the current content to the owner even when delivery is disabled. **Clear welcome content** removes all fields and disables delivery. An editor whose content changed before saving is rejected; reopen it to review the current values.

## Delivery

Allowed visitors receive messages when entering a different claim, teleporting into it, or joining inside it. Empty fields are omitted, so an arrival produces up to three lines. The website line contains an explicit clickable link; delivery does not automatically open the address.

Moving within a claim does not resend its welcome. The cooldown applies across claims, preventing repeated messages from nearby borders, and is cleared on logout. Cancelled movement or teleport events do not trigger delivery, and denied entry does not send a welcome.

On Folia and Canvas, some teleports do not fire Bukkit's teleport event. Bastion checks player positions every ten seconds, so a welcome for those arrivals can be up to ten seconds late.

The fixed cooldown has no configuration setting. Owner content is saved verbatim and is not automatically translated; the surrounding interface and message labels use the player's selected language.

## Claim changes

Welcome content is saved with the claim. Ownership transfer clears it, merging retains the destination's content, and splitting copies it to the new claim. Welcome changes appear as settings changes in claim activity and the notification inbox.

[Public directory](/bastion/07-public-directory) · [Notification inbox](/bastion/06-notification-inbox) · [Bastion](/bastion)
