---
title: Self-role panels
description: Let members choose community roles with eligibility rules and optional expiry
published: true
date: 2026-10-29T06:00:00.000Z
tags: ascendant, community, roles
editor: markdown
dateCreated: 2026-10-29T06:00:00.000Z
---

Open **Community → Self-role panels** to create messages that let members select community roles. Owners and administrators with unrestricted plugin access and View permission can inspect panels. Configure permission is required to edit their drafts; Publish permission is also required to review and publish them.

## Create a panel

Create a named panel, choose a destination and add its role choices. Each choice has a label, optional description and emoji. Panels support buttons or a selection menu. Use a menu when members must select a minimum number of roles; buttons toggle one choice at a time. Set a maximum to limit how many choices a member can hold from the panel.

There can be up to 20 panels with 25 choices each. Each offered role must be unique across the configured panels. A button panel containing a row of message links supports 20 choices; menus still support 25.

Edit the message with the shared editor, or load a copy from **Message templates**. Self-role messages support static text, embeds and link buttons. Variables are unavailable because one message is shared by every member. Saving changed panel settings deactivates that panel's old controls. Enable the feature and panel, review the destination and choices, then publish a new message with the reviewed version. Unchanged panels remain active.

Members receive private confirmations. An old or unrecognized control explains that the panel is no longer active. The bot requires access to the destination and **Manage Roles**, with its highest role above the roles it assigns.

## Eligibility and exclusive choices

A choice can require existing roles or exclude members holding specified roles. Required roles must all be present. Choices with the same exclusive-group name within a panel replace other choices from that group only when those roles were assigned by this feature. Roles a member already had are retained.

Ascendant rejects managed roles, elevated Discord permissions, privileged channel overrides and roles reserved by other features. Reserved roles include staff and beta access, verification, application decisions, earned rewards, shop roles, join roles and product notification panels. Eligibility is checked again when the member uses the panel, so a later permission change cannot turn an ordinary community choice into an access grant.

## Temporary roles

Set a choice's duration in minutes, up to 30 days, or use zero for no expiry. The expiry worker tracks grants made by self-role panels. It does not adopt roles a member already held. Membership identity prevents an old grant from removing a role after a member leaves and rejoins.

A separate assignment of a role the member already holds is not observable through Discord. Avoid having other systems independently manage temporary self-role choices. If staff take over a role, use the grant attention controls to relinquish its self-role ownership; relinquishing ownership does not remove the Discord role.

## Delivery and recovery

Publication and role changes retain durable records. If Discord does not confirm an operation, Ascendant keeps it for staff attention instead of blindly repeating it. For an uncertain publication, inspect the destination and supply the matching message ID through recovery. Recovery verifies the actual bot message and its controls.

`SELF_ROLES_FILE` selects the SQLite data file. Backups include settings, publication evidence and role provenance. Restoring requires both services to be stopped. Restored settings are disabled and old controls cannot be revived simply by enabling the feature; review and publish again. Current grant evidence is preserved so restoring an older backup does not invent ownership of members' roles.

Review mode permits local drafts and previews, while blocking publication and Discord role changes.
