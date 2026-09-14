# Shop.Storefront

The storefront of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v1.3-end
```

## At `v1.3-end`

The storefront runs in a **dev container**: `storefront-web.dev.Dockerfile` pins Node 24,
installs from the lockfile, and starts Vite bound to every interface — so `-p` can reach it.
Only `src/src` is bind-mounted; `node_modules` and the config stay in the image, so nothing
root-owned lands in your tree and changing `package.json` means a rebuild.

```sh
docker build -f storefront-web.dev.Dockerfile -t storefront-web:dev .
docker run --rm -it -p 5173:5173 --name storefront-web \
  -v "$PWD/src/src:/app/src" \
  storefront-web:dev
```

Then open http://localhost:5173 and edit `src/src/App.jsx` — HMR works through the mount.
`vite.config.js` sets `server.watch.usePolling`, because bind-mounted files don't raise
change events on every host.

The product list is still hardcoded; no API calls yet.

**Prerequisites:** Docker only. Node runs in the container.
