# Shop.Storefront

The storefront of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v5-end
```

## At `v5-end`

Behind **Caddy**. Three changes in `compose.yaml`, one in the `Tiltfile`, nothing in `src/`.

The service joins **`shopnet`** and takes the alias **`storefront-web`** there. Caddy — the
workspace's `caddy/` project — is a container on that network, and `storefront-web:5173` is where it
forwards every request for `https://storefront.localhost`. The alias is needed for the same reason
as the APIs' in video 3: on the shared network `web` alone would collide with Admin's `web`.

The two API addresses are the names Caddy answers on, over HTTPS:

```yaml
VITE_CATALOG_URL: "https://catalog.localhost"
VITE_ORDERS_URL: "https://orders.localhost"
```

Still addresses on your machine — the `fetch` runs in the browser — just names instead of ports.
The pages and the APIs are different origins, so the APIs' CORS policy stays.

**`ports:` is gone.** Nothing outside Docker needs this container's door: the browser reaches it
through Caddy, and Caddy reaches it by name on the network. Tilt built its link from the published
port, so the `Tiltfile` now says `links=['https://storefront.localhost']` instead.

Vite serves `storefront.localhost` without configuration — `.localhost` hosts are allowed by default —
and hot reload's websocket connects through Caddy as `wss://storefront.localhost` on its own.

### Running it

From the workspace root, `tilt up`, then **https://storefront.localhost** — after trusting Caddy's
root certificate once (the workspace README shows how). `docker compose up` in this folder alone
still works with infra and Caddy up, but there is no `localhost:5173` any more.

## Earlier: `v4-end`

A `Tiltfile`, and nothing else. `compose.yaml` is untouched.

```python
docker_compose('compose.yaml', project_name='shop-storefront')

dc_resource('web', new_name='storefront-web', labels=['storefront'])
```

`tilt up` from this folder runs the Storefront on its own. From the workspace root, its `Tiltfile`
`include()`s this one, and this repo stays its own compose project either way.

`project_name` is not optional — Tilt does not read the `name:` key in `compose.yaml`.
`new_name` is what Tilt calls each service: resource names are global across every repo the
workspace loads, and `Shop.Admin` has a `web` too. The service and container names are unchanged.

## Earlier: `v3-start`

The dev container from `v1.3-end`, now with a **`compose.yaml`** — the same shape as the other
two repos — and real API calls: `App.jsx` loads the products from Catalog and places orders
with Orders.

```yaml
VITE_CATALOG_URL: "http://localhost:5101"
VITE_ORDERS_URL: "http://localhost:5102"
```

Those are `localhost`, not container names, and this service is **not** on `shopnet`. The
`fetch` calls run in your browser, on your machine — outside every Docker network — so the
only way in is a published port. Video 3 makes that distinction, and deals with what the
browser says when it first tries.

### Running it

With infra, Catalog and Orders up (see the workspace README):

```sh
docker compose up
```

Then open http://localhost:5173 (at `v3-start`; from `v5-end` it is https://storefront.localhost). Edits to `src/src` hot reload through the bind mount.

```
Shop.Storefront/
├── compose.yaml                  # web on shopnet as storefront-web; the two API names; no ports
├── storefront-web.dev.Dockerfile # node:24, npm ci, Vite bound to every interface
├── .dockerignore
└── src/
    ├── vite.config.js            # port, strictPort, usePolling
    └── src/                      # the only folder mounted into the container
        └── App.jsx               # fetches /products, POSTs /orders
```

**Prerequisites:** Docker only.
