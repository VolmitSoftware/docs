---
title: "Docs Agent Guide"
description: "Content and format rules for automated documentation edits"
published: false
date: 2026-10-17T00:00:00.000Z
tags: "meta"
editor: markdown
dateCreated: 2026-10-17T00:00:00.000Z
---

This repository is the Wiki.js source for all Volmit Software product documentation. Read [contributing.md](contributing.md) and [README.md](README.md) before editing.

## Content rules

- Pages are a manual for the current product: installation, use, configuration, commands, permissions, and integration APIs. Every section must help a reader perform a supported task or understand a setting.
- Write in the present tense about current behavior only. When behavior changes, rewrite the affected instructions in place.
- No changelog-level content. This includes:
  - version history: "since 4.0", "as of version X", "new in", "introduced in", "previously", "no longer", "now does X"
  - renamed or retired names mentioned only to say they changed
  - upgrade or migration notes
  - status updates and dated verification notes ("checked on October 14")
  - endpoint or test results
  - release-readiness notes and maintainer to-dos
  - "not yet" or work-in-progress notes
  - roadmaps, priority or "next" lists, known gaps, and feature audits

  Change history belongs in the product's changelog or release notes.
- Current compatibility facts stay: supported Minecraft and server versions, Java requirement, platform differences.
- No smoke tests, regression plans, QA scripts, test results, troubleshooting sections, performance-tuning guides, implementation internals, or bug and fix histories.
- Use synthetic examples only. Never include private server names, hostnames, addresses, account names, credentials, or deployment details.

## Format

- Every page keeps Wiki.js YAML frontmatter (`title`, `description`, `published`, `date`, `tags`, `editor`, `dateCreated`) and no leading H1. Bump `date` whenever a page changes.
- Use absolute wiki paths for internal links (`/adapt/04-commands-permissions`). When adding, renaming, or deleting a page, fix every cross-reference and the product's landing page.
