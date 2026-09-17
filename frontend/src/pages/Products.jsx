import { useEffect, useState } from "react"

import PageHeader from "../components/PageHeader"
import {
  getProducts,
  getCategories,
  createProduct,
  deleteProduct,
} from "../services/api"
function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category_id: "",
    unit: "",
    selling_price: "",
    purchase_price: "",
    minimum_stock: 0,
    is_active: true,
  })

  const fetchProducts = async () => {
    try {
      const data = await getProducts()

      setProducts(data)
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal mengambil data product")
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()

      setCategories(data)
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal mengambil data category")
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ])

      setLoading(false)
    }

    loadData()
  }, [])

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleAddProduct = async (event) => {
    event.preventDefault()

    if (
      !form.sku.trim() ||
      !form.name.trim() ||
      !form.category_id ||
      !form.unit.trim()
    ) {
      alert(
        "SKU, nama, category, dan unit wajib diisi"
      )

      return
    }

    try {
      setSaving(true)

      await createProduct({
        sku: form.sku,
        name: form.name,
        category_id: Number(form.category_id),
        unit: form.unit,
        selling_price: Number(form.selling_price),
        purchase_price: Number(form.purchase_price),
        minimum_stock: Number(form.minimum_stock),
        is_active: form.is_active,
      })

      setForm({
        sku: "",
        name: "",
        category_id: "",
        unit: "",
        selling_price: "",
        purchase_price: "",
        minimum_stock: 0,
        is_active: true,
      })

      await fetchProducts()
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal menambahkan product")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Yakin mau menghapus product ini?"
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteProduct(id)

      await fetchProducts()
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal menghapus product")
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage products and product information"
      />

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 font-semibold text-slate-800">
          Add Product
        </h3>

        <form
          onSubmit={handleAddProduct}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              SKU
            </label>

            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="e.g. ELK-001"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.ID}
                  value={category.ID}
                >
                  {category.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Unit
            </label>

            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="pcs, box, kg, etc."
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Purchase Price
            </label>

            <input
              type="number"
              name="purchase_price"
              value={form.purchase_price}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Selling Price
            </label>

            <input
              type="number"
              name="selling_price"
              value={form.selling_price}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Minimum Stock
            </label>

            <input
              type="number"
              name="minimum_stock"
              value={form.minimum_stock}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-7">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <label className="text-sm font-medium text-slate-700">
              Product is active
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800">
            Product List
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Products currently registered in the system
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">
                  SKU
                </th>

                <th className="px-5 py-3 font-medium">
                  Product
                </th>

                <th className="px-5 py-3 font-medium">
                  Category
                </th>

                <th className="px-5 py-3 font-medium">
                  Unit
                </th>

                <th className="px-5 py-3 font-medium">
                  Purchase Price
                </th>

                <th className="px-5 py-3 font-medium">
                  Selling Price
                </th>

                <th className="px-5 py-3 font-medium">
                  Status
                </th>

                <th className="px-5 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    Loading products...
                  </td>
                </tr>
              )}

              {!loading &&
                products.map((product) => (
                  <tr
                    key={product.ID}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {product.SKU}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {product.Name}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {product.Category?.Name || "-"}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {product.Unit}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      Rp{" "}
                      {Number(
                        product.PurchasePrice
                      ).toLocaleString("id-ID")}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      Rp{" "}
                      {Number(
                        product.SellingPrice
                      ).toLocaleString("id-ID")}
                    </td>

                    <td className="px-5 py-4">
                      {product.IsActive ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.ID)
                        }
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && products.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Products