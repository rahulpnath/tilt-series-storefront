import { useEffect, useState } from 'react'
import './App.css'

// This code runs in the browser, so these are addresses on your machine.
const CATALOG_URL = import.meta.env.VITE_CATALOG_URL
const ORDERS_URL = import.meta.env.VITE_ORDERS_URL

export default function App() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch(`${CATALOG_URL}/products`)
      .then((r) => r.json())
      .then(setProducts)
      .catch((e) => {
        setFailed(true)
        setStatus(`Could not load products from ${CATALOG_URL} — ${e.message}`)
      })
  }, [])

  const order = async (product) => {
    try {
      const r = await fetch(`${ORDERS_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })
      const placed = await r.json()
      setFailed(false)
      setStatus(`Order #${placed.id} placed — ${placed.productName}`)
    } catch (e) {
      setFailed(true)
      setStatus(`Could not place order at ${ORDERS_URL} — ${e.message}`)
    }
  }

  return (
    <main className="storefront">
      <header>
        <h1>Shop</h1>
        <p>Everything you need for better coffee at home.</p>
        {status && <p className={failed ? 'status status-error' : 'status'}>{status}</p>}
      </header>

      <ul className="products">
        {products.map((product) => (
          <li key={product.id} className="product">
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <button type="button" onClick={() => order(product)}>Order</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
