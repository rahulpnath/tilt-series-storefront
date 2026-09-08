import './App.css'

const products = [
  { id: 1, name: 'Espresso Machine', price: 749.0 },
  { id: 2, name: 'Burr Grinder', price: 219.0 },
  { id: 3, name: 'Milk Frother', price: 89.0 },
]

export default function App() {
  return (
    <main className="storefront">
      <header>
        <h1>Shop</h1>
        <p>Everything you need for better coffee at home.</p>
      </header>

      <ul className="products">
        {products.map((product) => (
          <li key={product.id} className="product">
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <button type="button">Add to cart</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
