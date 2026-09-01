# Shop.Storefront

The customer-facing app of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v4-end
```

## At `v4-end`

A `Tiltfile`, and nothing else. `compose.yaml` is untouched.

```sh
tilt up          # from this folder — the Storefront on its own
```

One resource, and Vite still does the reloading. `project_name` matters here for
the same reason it does everywhere: Tilt ignores the `name:` key in the compose
file, and without the argument every repo the workspace loads collapses into one
project.

`v4-start` did not change this repo — its tag points at the same commit as
`v3-end`.

---

## Earlier: `v3-end`

It lists products from `catalog-api` and places orders through `orders-api`,
and it reaches both at **host addresses**:

```yaml
VITE_CATALOG_URL: "http://localhost:5101"
VITE_ORDERS_URL:  "http://localhost:5102"
```

### Why this project is not on `shopnet`

Catalog and Orders share an external network so they can call each other by
service name. This project deliberately does not join it, because it would gain
nothing.

The `fetch` calls in `App.jsx` do not run in this container. They run in **your
browser**, which is not a container, is not on any Docker network, and has never
heard of Docker's DNS. `http://catalog-api:5101` resolves between containers and
is meaningless there — so the browser gets host addresses, and those work
because both APIs publish a port.

That's the whole distinction Video 3 turns on: `orders-api` → `catalog-api` is a
Docker DNS problem, and storefront → `catalog-api` is a *"you are not in Docker"*
problem. Same-looking error, different fixes.

A wide-open dev CORS policy in both APIs is what stops the browser rejecting the
cross-origin calls. Video 5 removes the need for it.

---

## Earlier: `v3-start` — pointed at names the browser can't resolve

The storefront gets its own compose file, and is pointed at the two APIs for the
first time.

```sh
docker compose -f docker/compose.yaml up
# http://localhost:5173
```

It lists products from `catalog-api` and places orders through `orders-api` —
or it would, if it could reach either. Open it and every call fails:

```
Could not reach catalog-api at http://catalog-api:5101 — Failed to fetch
```

### Why, and why it's a different failure to the Orders one

`orders-api` can't reach `catalog-api` because they're on different Docker
networks. This is not that.

This code runs in **your browser**. Your browser is not a container, is not on
any Docker network, and has never heard of Docker's DNS. `http://catalog-api:5101`
is a name only containers can resolve, so the fetch dies before it leaves your
machine. Video 3 is where both failures get explained and fixed — they need
different fixes.

---

## Earlier: `v1.2-end` — the container

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
