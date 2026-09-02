# Shop.Storefront

Part of **Local Dev from First Principles — Docker, Tilt & Caddy**.
Workspace repo: https://github.com/rahulpnath/tilt-series

Will hold `storefront-web` (:5173) — a Vite + React shop front.

**This repo has no code yet.** It gets its first commit in the video that
introduces it, and carries a `vN-start` / `vN-end` tag from then on. The
series repos are built up one video at a time, so what you check out at a tag
is exactly what was on screen — nothing from a later video leaks backwards.

## Start here instead

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v1-start
```

`bootstrap.sh` puts the workspace on a tag and clones every app repo that
exists at that tag into `main/`. Repos the series hasn't introduced yet —
including this one — are skipped.
