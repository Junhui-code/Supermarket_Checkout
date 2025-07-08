import { Routes, Route } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ProductCard from './components/ProductCard.jsx'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Supermarket Online Platform</h1>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/test" element={<h2>Test Route Works!</h2>} />
        </Routes>
      </main>
      
      <footer>
        <p>© 2025 Supermarket Online</p>
      </footer>
    </div>
  )
}

export default App