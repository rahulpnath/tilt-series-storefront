# Shop.Storefront

The customer-facing app of the demo shop, used by the
**[Local Dev from First Principles](https://github.com/rahulpnath/tilt-series)**
series (Docker, Tilt & Caddy).

Don't clone this repo on its own — clone the workspace repo and let it assemble
the right set of repos at the right tag:

```sh
git clone https://github.com/rahulpnath/tilt-series
cd tilt-series
./bootstrap.sh v1.2-start
```

## At `v1.2-start`

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
