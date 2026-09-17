import { useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"
import { getInventories } from "../services/api"

function Inventory() {
  const [inventories, setInventories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadInventories = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getInventories()
      setInventories(data)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventories()
  }, [])

  const totalStock = inventories.reduce(
    (total, inventory) => total + inventory.Stock,
    0
  )

  const lowStock = inventories.filter((inventory) => {
    const minimumStock = inventory.Product?.MinimumStock ?? 0
    return inventory.Stock <= minimumStock
  }).length

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Monitor and manage current product stock"
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Products in Inventory</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {inventories.length}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Products with inventory records
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Stock</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {totalStock}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Total available quantity
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Low Stock</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {lowStock}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Products at or below minimum stock
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-800">
              Current Inventory
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Current stock for each product
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading inventory...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-red-500">
            {error}
          </div>
        ) : inventories.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-slate-600">
              No inventory data available
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Stock will appear here after a stock movement is recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Minimum
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {inventories.map((inventory) => {
                  const product = inventory.Product
                  const minimumStock = product?.MinimumStock ?? 0
                  const isLowStock = inventory.Stock <= minimumStock

                  return (
                    <tr
                      key={inventory.ID}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">
                          {product?.Name ?? "-"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {product?.SKU ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {product?.Category?.Name ?? "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">
                          {inventory.Stock}
                        </span>
                        <span className="ml-1 text-sm text-slate-400">
                          {product?.Unit ?? ""}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {minimumStock}
                      </td>

                      <td className="px-6 py-4">
                        {isLowStock ? (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory