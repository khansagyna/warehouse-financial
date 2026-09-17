import { useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"
import {
  getStockMovements,
  getProducts,
  createStockMovement,
} from "../services/api"

function StockMovements() {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])

  const [form, setForm] = useState({
    product_id: "",
    type: "IN",
    quantity: "",
    reference: "",
    note: "",
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadData = async () => {
    try {
      setLoadingData(true)
      setError("")

      const [movementData, productData] = await Promise.all([
        getStockMovements(),
        getProducts(),
      ])

      setMovements(movementData)
      setProducts(productData)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await createStockMovement({
        product_id: Number(form.product_id),
        type: form.type,
        quantity: Number(form.quantity),
        reference: form.reference,
        note: form.note,
      })

      setSuccess("Stock movement created successfully.")

      setForm({
        product_id: "",
        type: "IN",
        quantity: "",
        reference: "",
        note: "",
      })

      await loadData()
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const totalIn = movements
    .filter((movement) => movement.Type === "IN")
    .reduce((total, movement) => total + movement.Quantity, 0)

  const totalOut = movements
    .filter((movement) => movement.Type === "OUT")
    .reduce((total, movement) => total + movement.Quantity, 0)

  return (
    <div>
      <PageHeader
        title="Stock Movement"
        description="Record and monitor all stock changes"
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Movements</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {movements.length}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Recorded stock movements
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Stock In</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalIn}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Total quantity added
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Stock Out</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalOut}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Total quantity removed
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="font-semibold text-slate-800">
              Add Stock Movement
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Record stock coming in or going out.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-6"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Product
              </label>

              <select
                name="product_id"
                value={form.product_id}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Select product</option>

                {products.map((product) => (
                  <option key={product.ID} value={product.ID}>
                    {product.Name} ({product.SKU})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Movement Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              >
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                required
                placeholder="Enter quantity"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Reference
              </label>

              <input
                type="text"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="e.g. PURCHASE-001"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Note
              </label>

              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows="3"
                placeholder="Optional note"
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Save Movement"}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="font-semibold text-slate-800">
              Stock History
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              History of stock changes
            </p>
          </div>

          {loadingData ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading stock history...
            </div>
          ) : movements.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-600">
                No stock movement yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your stock history will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reference
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {movements.map((movement) => (
                    <tr
                      key={movement.ID}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {movement.Product?.Name ?? "-"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {movement.Product?.SKU ?? "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {movement.Type === "IN" ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                            IN
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                            OUT
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {movement.Quantity}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {movement.StockBefore}
                        <span className="mx-1 text-slate-300">
                          →
                        </span>
                        <span className="font-semibold text-slate-800">
                          {movement.StockAfter}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {movement.Reference || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StockMovements