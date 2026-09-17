const API_URL = "http://localhost:8080/api"

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    let data = null

    try {
      data = await response.json()
    } catch {
      // Response tidak memiliki JSON
    }

    if (!response.ok) {
      throw new Error(
        data?.message || `Request failed with status ${response.status}`
      )
    }

    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

// CATEGORY

export const getCategories = () =>
  request("/categories")

export const getCategory = (id) =>
  request(`/categories/${id}`)

export const createCategory = (data) =>
  request("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const updateCategory = (id, data) =>
  request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })

export const deleteCategory = (id) =>
  request(`/categories/${id}`, {
    method: "DELETE",
  })

// PRODUCT

export const getProducts = () =>
  request("/products")

export const getProduct = (id) =>
  request(`/products/${id}`)

export const createProduct = (data) =>
  request("/products", {
    method: "POST",
    body: JSON.stringify(data),
  })

export const updateProduct = (id, data) =>
  request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })

export const deleteProduct = (id) =>
  request(`/products/${id}`, {
    method: "DELETE",
  })

// INVENTORY

export const getInventories = () =>
  request("/inventories")

// STOCK MOVEMENT

export const getStockMovements = () =>
  request("/stock-movements")

export const createStockMovement = (data) =>
  request("/stock-movements", {
    method: "POST",
    body: JSON.stringify(data),
  })