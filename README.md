# Shop.Storefront

The storefront of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v3-start
```

## At `v4-end`

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

Then open http://localhost:5173. Edits to `src/src` hot reload through the bind mount.

```
Shop.Storefront/
├── compose.yaml                  # web on :5173; the two API URLs
├── storefront-web.dev.Dockerfile # node:24, npm ci, Vite bound to every interface
├── .dockerignore
└── src/
    ├── vite.config.js            # port, strictPort, usePolling
    └── src/                      # the only folder mounted into the container
        └── App.jsx               # fetches /products, POSTs /orders
```

**Prerequisites:** Docker only.
