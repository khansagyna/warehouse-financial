const API_URL = "http://localhost:8080/api"

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

export const getCategories = () => {
  return request("/categories")
}

export const createCategory = (data) => {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const updateCategory = (id, data) => {
  return request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const deleteCategory = (id) => {
  return request(`/categories/${id}`, {
    method: "DELETE",
  })
}

export const getProducts = () => {
  return request("/products")
}

export const getProduct = (id) => {
  return request(`/products/${id}`)
}

export const createProduct = (data) => {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export const updateProduct = (id, data) => {
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const deleteProduct = (id) => {
  return request(`/products/${id}`, {
    method: "DELETE",
  })
}