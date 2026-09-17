import { useEffect, useState } from "react"

import PageHeader from "../components/PageHeader"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api"

function Categories() {
  const [categories, setCategories] = useState([])
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    try {
      setLoading(true)

      const data = await getCategories()

      setCategories(data)
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal mengambil data category")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (event) => {
    event.preventDefault()

    const name = categoryName.trim()

    if (!name) {
      alert("Nama category tidak boleh kosong")
      return
    }

    try {
      setSaving(true)

      await createCategory({
        name,
      })

      setCategoryName("")

      await fetchCategories()
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal menambahkan category")
    } finally {
      setSaving(false)
    }
  }

  const handleEditCategory = async (category) => {
    const newName = window.prompt(
      "Masukkan nama category baru:",
      category.Name
    )

    if (newName === null) {
      return
    }

    const name = newName.trim()

    if (!name) {
      alert("Nama category tidak boleh kosong")
      return
    }

    try {
      await updateCategory(category.ID, {
        name,
      })

      await fetchCategories()
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal mengubah category")
    }
  }

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Yakin mau menghapus category ini?"
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteCategory(id)

      await fetchCategories()
    } catch (error) {
      console.error(error)
      alert(error.message || "Gagal menghapus category")
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage product categories"
      />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <form
            onSubmit={handleAddCategory}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={categoryName}
              onChange={(event) =>
                setCategoryName(event.target.value)
              }
              placeholder="Enter category name"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
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
              {loading && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                categories.map((category) => (
                  <tr
                    key={category.ID}
                    className="border-t border-slate-100 hover:bg-slate-50"
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
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteCategory(category.ID)
                          }
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && categories.length === 0 && (
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
    </div>
  )
}

export default Categories