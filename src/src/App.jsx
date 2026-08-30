import { useState } from 'react'

// A hard-coded catalogue. There is no API yet.
const PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', price: 149 },
  { id: 2, name: 'Ultrawide Monitor', price: 699 },
  { id: 3, name: 'Standing Desk', price: 429 },
]

function App() {
  const [status, setStatus] = useState(null)

  return (
    <main>
      <h1>🛍️ Shop Storefront</h1>
      <p className="hint">A static catalogue — nothing is fetched yet.</p>
      {status && <p className="status">{status}</p>}
      <ul>
        {PRODUCTS.map((p) => (
          <li key={p.id}>
            <span>
              {p.name} — ${p.price}
            </span>
            <button onClick={() => setStatus(`Ordered ${p.name} ✔`)}>Order</button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
