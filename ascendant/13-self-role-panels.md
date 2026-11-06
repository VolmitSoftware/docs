---
title: Self-role panels
description: Let members choose community roles with eligibility rules and optional expiry
published: true
date: 2026-11-05T00:00:00.000Z
tags: ascendant, community, roles
editor: markdown
dateCreated: 2026-10-29T06:00:00.000Z
---

Open **Community → Self-role panels** to create messages that let members select community roles. Owners and administrators with unrestricted plugin access and View permission can inspect panels. Configure permission is required to edit and save panels; Publish permission is also required to post them to Discord.

## Create a panel

Select **New panel**, give it a name, choose a channel and add its roles. Each role row has an emoji, a label and the role to assign; menu panels also show an optional description. Panels support buttons or a selection menu. Use a menu when members must select a minimum number of roles; buttons toggle one choice at a time. Set a maximum to limit how many choices a member can hold from the panel.

There can be up to 20 panels with 25 choices each. Each offered role must be unique across the configured panels. A button panel containing a row of message links supports 20 choices; menus still support 25.

Edit the message with the shared editor, or load a copy from **Message templates**. Self-role messages support static text, embeds and link buttons. Variables are unavailable because one message is shared by every member. The preview beside the editor shows the full panel, including its role controls, and follows each edit.

Turn on **Members can use this panel** to make it available. Turn on **Members can remove roles they got elsewhere** when the panel replaces an older role menu, so members can drop roles that staff or another bot gave them; when it is off, a panel removes only the roles it gave out.

## Save and publish

One button saves every panel and sends each changed, turned-on panel to Discord. Its label names the result: **Save and post panel** for a panel that has no message yet, **Save and update panel** for one that does. A panel that is still in its original channel is updated in place, so members keep their roles and its buttons keep working. Moving a panel to another channel posts a new message there, and the old message's buttons stop working. If the panel's message was deleted, a new one is posted. Turned-off panels are saved without posting. **Discard changes** returns every panel to its saved version.

Discord lists messages in the order they were posted, so a panel cannot be moved up or down in place. To make a panel the newest message in its channel, save any changes and select **Post again at the bottom** beside the preview. Ascendant posts a fresh copy, tracks it, and deletes the old message. Members keep their roles, but links to the old message stop working. If the old message cannot be deleted, the panel shows a reminder to delete it in Discord.

Members receive private confirmations. An old or unrecognized control explains that the panel is no longer active. The bot requires access to the destination and **Manage Roles**, with its highest role above the roles it assigns.

## Eligibility and exclusive choices

A choice can require existing roles or exclude members holding specified roles. Required roles must all be present. Choices with the same exclusive-group name within a panel replace other choices from that group only when those roles were assigned by this feature. Roles a member already had are retained.

Ascendant rejects managed roles, elevated Discord permissions, privileged channel overrides and roles reserved by other features. Reserved roles include staff and beta access, verification, application decisions, earned rewards, shop roles, join roles and product notification panels. Eligibility is checked again when the member uses the panel, so a later permission change cannot turn an ordinary community choice into an access grant.

## Temporary roles

Set a choice's duration in minutes, up to 30 days, or use zero for no expiry. The expiry worker tracks grants made by self-role panels. It does not adopt roles a member already held. Membership identity prevents an old grant from removing a role after a member leaves and rejoins.

A separate assignment of a role the member already holds is not observable through Discord. Avoid having other systems independently manage temporary self-role choices. If staff take over a role, open **Tracked member roles** and select **Release** for that member and role; releasing ownership does not remove the Discord role.

## Delivery and recovery

Publication and role changes retain durable records. If Discord does not confirm an operation, Ascendant keeps it for staff attention instead of blindly repeating it. When Discord does not confirm a post, the panel shows **Check the last post** and is not sent again until staff resolve it. If the message is in the channel, paste its ID and select **Keep this message**; Ascendant verifies the bot message and its controls. Otherwise select **Discard attempt** and publish again.

`SELF_ROLES_FILE` selects the SQLite data file. Backups include settings, publication evidence and role provenance. Restoring requires both services to be stopped. Restored settings are disabled and old controls cannot be revived simply by turning panels on; publish them again. Current grant evidence is preserved so restoring an older backup does not invent ownership of members' roles.

Review mode permits saving and previews, while blocking posts and Discord role changes.
