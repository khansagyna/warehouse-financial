package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"warehouse-financial/models"
)

type CategoryController struct {
	DB *gorm.DB
}

type CreateCategoryRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}

// GET /api/categories
func (cc CategoryController) GetCategories(c *gin.Context) {
	var categories []models.Category

	result := cc.DB.Find(&categories)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get categories",
			"error":   result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// POST /api/categories
func (cc CategoryController) CreateCategory(c *gin.Context) {
	var request CreateCategoryRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	name := strings.TrimSpace(request.Name)

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Category name cannot be empty",
		})
		return
	}

	category := models.Category{
		Name: name,
	}

	result := cc.DB.Create(&category)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create category",
			"error":   result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// PUT /api/categories/:id
func (cc CategoryController) UpdateCategory(c *gin.Context) {
	id := c.Param("id")

	var category models.Category

	// Cari category berdasarkan ID
	result := cc.DB.First(&category, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
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

	// Ambil data dari request
	var request CreateCategoryRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	name := strings.TrimSpace(request.Name)

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Category name cannot be empty",
		})
		return
	}

	// Update nama category
	category.Name = name

	result = cc.DB.Save(&category)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update category",
			"error":   result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, category)
}

// DELETE /api/categories/:id
func (cc CategoryController) DeleteCategory(c *gin.Context) {
	id := c.Param("id")

	var category models.Category

	// Cari category
	result := cc.DB.First(&category, id)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
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

	// Hapus category
	result = cc.DB.Delete(&category)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to delete category",
			"error":   result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Category deleted successfully",
	})
}