package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"warehouse-financial/models"
)

type ProductController struct {
	DB *gorm.DB
}

type CreateProductRequest struct {
	SKU           string  `json:"sku" binding:"required,max=50"`
	Name          string  `json:"name" binding:"required,max=150"`
	CategoryID    uint    `json:"category_id" binding:"required"`
	Unit          string  `json:"unit" binding:"required,max=30"`
	SellingPrice  float64 `json:"selling_price" binding:"gte=0"`
	PurchasePrice float64 `json:"purchase_price" binding:"gte=0"`
	MinimumStock  int     `json:"minimum_stock" binding:"gte=0"`
	IsActive      *bool   `json:"is_active"`
}

// GET /api/products
func (pc ProductController) GetProducts(c *gin.Context) {
	var products []models.Product

	result := pc.DB.Preload("Category").Find(&products)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get products",
			"error":   result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, products)
}

// GET /api/products/:id
func (pc ProductController) GetProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product

	result := pc.DB.
		Preload("Category").
		First(&product, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Product not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get product",
			"error":   result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, product)
}

// POST /api/products
func (pc ProductController) CreateProduct(c *gin.Context) {
	var request CreateProductRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	sku := strings.TrimSpace(request.SKU)
	name := strings.TrimSpace(request.Name)
	unit := strings.TrimSpace(request.Unit)

	// Validasi manual
	if sku == "" || name == "" || unit == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "SKU, name, and unit cannot be empty",
		})
		return
	}

	// Cek category
	var category models.Category

	result := pc.DB.First(&category, request.CategoryID)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Category not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to find category",
			"error":   result.Error.Error(),
		})
		return
	}

	// Cek SKU
	var existingProduct models.Product

	result = pc.DB.
		Where("sku = ?", sku).
		First(&existingProduct)

	if result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{
			"message": "SKU already exists",
		})
		return
	}

	if result.Error != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to check SKU",
			"error":   result.Error.Error(),
		})
		return
	}

	// Default active = true
	isActive := true

	if request.IsActive != nil {
		isActive = *request.IsActive
	}

	product := models.Product{
		SKU:           sku,
		Name:          name,
		CategoryID:    request.CategoryID,
		Unit:          unit,
		SellingPrice:  request.SellingPrice,
		PurchasePrice: request.PurchasePrice,
		MinimumStock:  request.MinimumStock,
		IsActive:      isActive,
	}

	result = pc.DB.Create(&product)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create product",
			"error":   result.Error.Error(),
		})
		return
	}

	// Ambil lagi dengan Category
	pc.DB.Preload("Category").First(&product, product.ID)

	c.JSON(http.StatusCreated, product)
}

// PUT /api/products/:id
func (pc ProductController) UpdateProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product

	result := pc.DB.First(&product, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Product not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to find product",
			"error":   result.Error.Error(),
		})
		return
	}

	var request CreateProductRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	sku := strings.TrimSpace(request.SKU)
	name := strings.TrimSpace(request.Name)
	unit := strings.TrimSpace(request.Unit)

	if sku == "" || name == "" || unit == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "SKU, name, and unit cannot be empty",
		})
		return
	}

	// Cek category
	var category models.Category

	result = pc.DB.First(&category, request.CategoryID)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Category not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to find category",
			"error":   result.Error.Error(),
		})
		return
	}

	// Cek SKU hanya kalau SKU berubah
	if sku != product.SKU {
		var existingProduct models.Product

		result = pc.DB.
			Where("sku = ? AND id != ?", sku, product.ID).
			First(&existingProduct)

		if result.Error == nil {
			c.JSON(http.StatusConflict, gin.H{
				"message": "SKU already exists",
			})
			return
		}

		if result.Error != gorm.ErrRecordNotFound {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to check SKU",
				"error":   result.Error.Error(),
			})
			return
		}
	}

	isActive := product.IsActive

	if request.IsActive != nil {
		isActive = *request.IsActive
	}

	product.SKU = sku
	product.Name = name
	product.CategoryID = request.CategoryID
	product.Unit = unit
	product.SellingPrice = request.SellingPrice
	product.PurchasePrice = request.PurchasePrice
	product.MinimumStock = request.MinimumStock
	product.IsActive = isActive

	result = pc.DB.Save(&product)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update product",
			"error":   result.Error.Error(),
		})
		return
	}

	pc.DB.Preload("Category").First(&product, product.ID)

	c.JSON(http.StatusOK, product)
}

// DELETE /api/products/:id
func (pc ProductController) DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product

	result := pc.DB.First(&product, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Product not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to find product",
			"error":   result.Error.Error(),
		})
		return
	}

	result = pc.DB.Delete(&product)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete product",
			"error":   result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})
}