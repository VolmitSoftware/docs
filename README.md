# Volmit Software Documentation

Source for the Volmit Software documentation wiki, synced bi-directionally with Wiki.js.

## Layout

File paths map directly to wiki page paths. `iris.md` is `/iris`; `iris/commands.md` is
`/iris/commands`.

## Where content comes from

Most pages are **ported from `docs/` directories in the plugin repositories** — Iris, Adapt,
React, Wormholes and HoloUI each maintain docs alongside their code. Editing those pages here
will be overwritten on the next import; fix them upstream instead.

Pages written for this wiki (the BileTools set, HiddenOre's operator pages, all plugin landing
pages, `home.md`) are edited here directly.

## Source branches

| Plugin | Branch |
|---|---|
| Iris, Adapt, React | `unification` |
| HoloUI, HiddenOre, BileTools, Wormholes | `master` |

The `master` branches of Iris, Adapt and React are older and target much earlier Minecraft
versions. Do not document from them.

## Contributing

Fork, edit the markdown, open a pull request. See `contributing.md`.
