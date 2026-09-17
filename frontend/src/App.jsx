import { useEffect, useState } from "react"

import Sidebar from "./components/Sidebar"

import Dashboard from "./pages/Dashboard"
import Categories from "./pages/Categories"
import Products from "./pages/Products"
import Suppliers from "./pages/Suppliers"
import Customers from "./pages/Customers"
import Purchases from "./pages/Purchases"
import Sales from "./pages/Sales"
import Reports from "./pages/Reports"

import {
  getCategories,
  getProducts,
} from "./services/api"

function App() {
  const [activePage, setActivePage] = useState("dashboard")

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          categoriesData,
          productsData,
        ] = await Promise.all([
          getCategories(),
          getProducts(),
        ])

        setCategories(categoriesData)
        setProducts(productsData)
      } catch (error) {
        console.error(error)
      }
    }

    loadDashboardData()
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            categories={categories}
            products={products}
          />
        )

      case "products":
        return <Products />

      case "categories":
        return <Categories />

      case "suppliers":
        return <Suppliers />

      case "customers":
        return <Customers />

      case "purchases":
        return <Purchases />

      case "sales":
        return <Sales />

      case "reports":
        return <Reports />

      default:
        return (
          <Dashboard
            categories={categories}
            products={products}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        {renderPage()}
      </main>
    </div>
  )
}

export default App