import { useEffect, useState } from "react"

const API_URL = "http://localhost:8080/api"

function App() {
  const [categories, setCategories] = useState([])
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState("")

  // =========================
  // GET CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      setError("")

      const response = await fetch(`${API_URL}/categories`)

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.json()

      setCategories(data)
    } catch (error) {
      console.error(error)
      setError("Gagal mengambil data category")
    } finally {
      setLoadingCategories(false)
    }
  }

  // =========================
  // GET DATA SAAT PAGE DIBUKA
  // =========================
  useEffect(() => {
    fetchCategories()
  }, [])

  // =========================
  // CREATE CATEGORY
  // =========================
  const handleAddCategory = async (event) => {
    event.preventDefault()

    const name = categoryName.trim()

    if (!name) {
      alert("Nama category tidak boleh kosong")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category")
      }

      // Kosongkan input
      setCategoryName("")

      // Ambil data terbaru
      await fetchCategories()

    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal menambahkan category")
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // UPDATE CATEGORY
  // =========================
  const handleEditCategory = async (category) => {
    const newName = window.prompt(
      "Masukkan nama category baru:",
      category.Name
    )

    // User tekan Cancel
    if (newName === null) {
      return
    }

    const name = newName.trim()

    if (!name) {
      alert("Nama category tidak boleh kosong")
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/categories/${category.ID}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update category")
      }

      await fetchCategories()

    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal mengubah category")
    }
  }

  // =========================
  // DELETE CATEGORY
  // =========================
  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Yakin mau menghapus category ini?"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/categories/${id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category")
      }

      await fetchCategories()

    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal menghapus category")
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside className="w-64 border-r border-slate-200 bg-white p-5">

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-800">
            Warehouse
          </h1>

          <p className="text-sm text-slate-500">
            Financial System
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          <a
            href="#"
            className="block rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white"
          >
            Dashboard
          </a>

          <a
            href="#"
            className="block rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Products
          </a>

          <a
            href="#"
            className="block rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Categories
          </a>

          <a
            href="#"
            className="block rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Suppliers
          </a>

          <a
            href="#"
            className="block rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Customers
          </a>

          <a
            href="#"
            className="block rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Purchases
          </a>

          <a
            href="#"
            className="block rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Sales
          </a>

          <a
            href="#"
            className="block rounded-lg px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Reports
          </a>

        </nav>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">

          <h2 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your warehouse and financial system
          </p>

        </div>

        {/* =========================
            STATISTICS
        ========================== */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* Products */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              0
            </p>

          </div>

          {/* Categories */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              {categories.length}
            </p>

          </div>

          {/* Low Stock */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Low Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              0
            </p>

          </div>

          {/* Sales */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Sales
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              Rp 0
            </p>

          </div>

        </div>

        {/* =========================
            CATEGORY SECTION
        ========================== */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b border-slate-200 p-5">

            <h3 className="font-semibold text-slate-800">
              Categories
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage product categories
            </p>

            {/* Add Category Form */}
            <form
              onSubmit={handleAddCategory}
              className="mt-4 flex gap-3"
            >

              <input
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(event.target.value)
                }
                placeholder="Enter category name"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Category"}
              </button>

            </form>

          </div>

          {/* Error */}
          {error && (
            <div className="m-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =========================
              CATEGORY TABLE
          ========================== */}
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-slate-500">

                <tr>

                  <th className="px-5 py-3 font-medium">
                    ID
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Category Name
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Created At
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* Loading */}
                {loadingCategories && (
                  <tr>

                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Loading categories...
                    </td>

                  </tr>
                )}

                {/* Data */}
                {!loadingCategories &&
                  categories.map((category) => (
                    <tr
                      key={category.ID}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4 text-slate-500">
                        {category.ID}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {category.Name}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {new Date(
                          category.CreatedAt
                        ).toLocaleDateString("id-ID")}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleEditCategory(category)
                            }
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteCategory(category.ID)
                            }
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                {/* Empty */}
                {!loadingCategories &&
                  categories.length === 0 && (
                    <tr>

                      <td
                        colSpan="4"
                        className="px-5 py-8 text-center text-slate-400"
                      >
                        No categories found
                      </td>

                    </tr>
                  )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  )
}

export default App