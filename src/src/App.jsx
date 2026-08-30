import { useEffect, useState } from 'react'

// Where the browser looks for the two APIs, set by compose.yaml. These are
// Docker service names, which your browser has never heard of.
const CATALOG_URL = import.meta.env.VITE_CATALOG_URL
const ORDERS_URL = import.meta.env.VITE_ORDERS_URL

function App() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState(null)

  const load = () =>
    fetch(`${CATALOG_URL}/products`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data)
        setStatus(null)
      })
      .catch((e) =>
        setStatus({ err: true, text: `Could not reach catalog-api at ${CATALOG_URL} — ${e.message}` }),
      )

  useEffect(() => {
    load()
  }, [])

  const order = async (product) => {
    setStatus({ text: `Ordering ${product.name}…` })
    try {
      await fetch(`${ORDERS_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: product.name, quantity: 1 }),
      })
      setStatus({ text: `Ordered ${product.name} ✔` })
    } catch (e) {
      setStatus({ err: true, text: `Could not reach orders-api at ${ORDERS_URL} — ${e.message}` })
    }
  }

  return (
    <main>
      <h1>🛍️ Shop Storefront</h1>
      <p className="hint">
        Reads <code>catalog-api</code> at <code>{CATALOG_URL}</code>, orders via{' '}
        <code>{ORDERS_URL}</code>.
      </p>
      <button onClick={load}>Refresh</button>
      {status && <p className={status.err ? 'status err' : 'status'}>{status.text}</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <span>
              {p.name} — ${p.price}
            </span>
            <button onClick={() => order(p)}>Order</button>
          </li>
        ))}
        {products.length === 0 && !status && <li>No products yet.</li>}
      </ul>
    </main>
  )
}

export default App
