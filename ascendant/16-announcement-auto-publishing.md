---
title: Announcement auto-publishing
description: The dashboard automatically publishes each newly sent release to followers when the destination is a Discord announcement channel and DISCORD_TOKEN is configured in the p
published: true
date: 2026-11-08T03:45:00.000Z
tags: ascendant, discord, announcements
editor: markdown
dateCreated: 2026-11-01T00:00:00.000Z
---

The dashboard automatically publishes each newly sent release to followers when the destination is a Discord announcement channel and `DISCORD_TOKEN` is configured in the panel server's environment. Restart the panel after changing the environment. Never put the token in a webhook field or share it in chat.

Invite the bot to the server and allow View Channel, Send Messages, and Manage Messages in the destination channel. Webhook messages are not authored by the bot, so publishing them requires Manage Messages as well as Send Messages. See [Discord's crosspost documentation](https://docs.discord.com/developers/resources/message#crosspost-message).

Regular channels and threads are skipped. Edits do not trigger a new crosspost. Delivery history reports whether publishing succeeded, was skipped, or needs attention. Publishing failures never turn a confirmed send into a failed delivery. There is no automatic retry on rate limits or uncertain responses; use Discord's Publish action after checking the message. Repeating the same delivery request does not send or publish it again.

Existing messages are not published retroactively.

## Delivery webhooks

Each release category has one shared webhook: **Plugin updates** for plugin releases and **Modded updates** for modded editions. A product without its own webhook sends through the shared webhook for its category. A product's own webhook overrides the shared one.

Set both in **Updates > Delivery settings**. The shared webhook field shows for the category of the selected edition, and only owners and administrators can save or remove it. Staff who can configure a product can save its own webhook, or choose **Use the shared webhook** to remove the product's webhook and fall back to the shared one. Removing a shared webhook stops products without their own webhook from sending until one is saved.

Webhook URLs are write-only. The dashboard shows whether each product sends through its own webhook, the shared webhook, or none. Beta announcements and bStats reports use the same webhook choice.
