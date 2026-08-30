# Shop.Storefront

The customer-facing app of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v1.2-end
```

## At `v1.2-end`

The same app, in a container, with hot reload intact.

```sh
docker build -f docker/storefront-web.dev.Dockerfile -t shop-storefront-web:dev .

docker run --rm -p 5173:5173 \
  -v "$PWD/src/src:/app/src" \
  shop-storefront-web:dev
# http://localhost:5173
```

Edit `src/src/App.jsx`, save, and the browser updates without a reload and
without a rebuild.

### The two things that will stop you

**Vite binds loopback.** By default the dev server listens on `127.0.0.1`, and
inside a container that means *the container* — you publish a port and forward
it to something that isn't listening. The page never loads and nothing logs an
error. `server.host: true` in `vite.config.js`, or `--host` on the command line,
binds `0.0.0.0` instead. You can tell it took from the startup banner: no
`Network:` line means no `--host`.

**Mount what you edit, not the whole app.** The image runs `npm install` at
build time, so `node_modules` lives inside the container. Mount your app folder
over `/app` and you hide it. The usual patch for that is a second
`-v /app/node_modules` putting it back — and that is the one to avoid: Docker
creates a mount point only when the path is missing, so on a fresh clone it
makes `src/node_modules` on your host, empty and owned by **root**. A later
`npm install` on your machine then fails with `EACCES`, and you can't delete the
folder without borrowing root back from a container.

Mounting only `src/src` — the code you actually edit — sidesteps all of it.
`node_modules`, `index.html` and `vite.config.js` stay in the image, so nothing
the container owns reaches your working tree, and a host `node_modules` built
for your OS can never shadow the Alpine one. The cost is that changing
`package.json` or `vite.config.js` needs a rebuild, which is the right signal
anyway.

`.dockerignore` matters here too. Without `**/node_modules/` in it, the build
context is hundreds of megabytes before the build even starts.

HMR needs nothing else. The client works out its websocket URL from the page's
own address, so a published port is enough — even a remapped one. That changes
in video 5, when Caddy terminates on 443 and the browser sees a different port
than Vite does.

> **Video 2 doesn't change this repo.** `v2-start` and `v2-end` point at this
> same commit — video 2 puts *Catalog* into a compose file, and the storefront
> gets its own compose file in video 3. Nothing here moves in between.

---

## Earlier: `v1.2-start`

A Vite + React app, and nothing else.

```sh
cd src
npm install
npm run dev
# http://localhost:5173
```

The catalogue is a hard-coded array in `src/src/App.jsx`. No API call, no
database, no Docker. The point of this tag is that the app runs because *your*
machine happens to have the right Node — which is the same "works on my machine"
problem the .NET side has, and it gets solved the same way.
