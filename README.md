# Shop.Storefront

The storefront of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v1.3-start
```

## At `v1.3-start`

`storefront-web`, a Vite + React app listing the shop's products. The list is
hardcoded in `src/src/App.jsx` — no API calls, no database, nothing to install
beyond the dependencies themselves.

```sh
cd src
npm install
npm run dev
```

Then open http://localhost:5173.

**No Docker at this tag.** That arrives in video 1.3, which turns this into a
development container with hot reload working through it.

**Prerequisites:** Node 24 — pinned in `src/.nvmrc`, so `nvm use` or `fnm use`
puts you on it if you already have it.

Which is the point the next video opens on: that file records what this app
needs, but it can't install it, it does nothing for a teammate on a different
version manager, and the next project you clone will want something else.
