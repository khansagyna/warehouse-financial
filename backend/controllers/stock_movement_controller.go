package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"warehouse-financial/models"
)

type StockMovementController struct {
	DB *gorm.DB
}

func NewStockMovementController(db *gorm.DB) *StockMovementController {
	return &StockMovementController{
		DB: db,
	}
}

// GetStockMovements mengambil semua riwayat perubahan stok
func (controller *StockMovementController) GetStockMovements(c *gin.Context) {
	var movements []models.StockMovement

	result := controller.DB.
		Preload("Product").
		Order("created_at DESC").
		Find(&movements)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get stock movements",
		})
		return
	}

	c.JSON(http.StatusOK, movements)
}

// CreateStockMovement membuat perubahan stok IN atau OUT
func (controller *StockMovementController) CreateStockMovement(c *gin.Context) {
	var input struct {
		ProductID uint   `json:"product_id" binding:"required"`
		Type      string `json:"type" binding:"required"`
		Quantity  int    `json:"quantity" binding:"required,min=1"`
		Reference string `json:"reference"`
		Note      string `json:"note"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request data",
			"error":   err.Error(),
		})
		return
	}

	// Normalisasi type
	input.Type = strings.ToUpper(strings.TrimSpace(input.Type))

	if input.Type != "IN" && input.Type != "OUT" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Type must be IN or OUT",
		})
		return
	}

	// Transaction database
	err := controller.DB.Transaction(func(tx *gorm.DB) error {

		// Cari produk
		var product models.Product

		if err := tx.First(&product, input.ProductID).Error; err != nil {
			return err
		}

		// Cari inventory berdasarkan product
		var inventory models.Inventory

		result := tx.
			Where("product_id = ?", input.ProductID).
			First(&inventory)

		// Kalau inventory belum ada, buat inventory baru
		if result.Error == gorm.ErrRecordNotFound {
			inventory = models.Inventory{
				ProductID: input.ProductID,
				Stock:     0,
			}

			if err := tx.Create(&inventory).Error; err != nil {
				return err
			}
		} else if result.Error != nil {
			return result.Error
		}

		stockBefore := inventory.Stock
		stockAfter := stockBefore

		// =========================
		// STOCK IN
		// =========================

		if input.Type == "IN" {
			stockAfter = stockBefore + input.Quantity
		}

		// =========================
		// STOCK OUT
		// =========================

		if input.Type == "OUT" {

			// Tidak boleh mengeluarkan stok
			// lebih besar dari stok tersedia
			if input.Quantity > stockBefore {
				return gorm.ErrInvalidData
			}

			stockAfter = stockBefore - input.Quantity
		}

		// Update inventory
		inventory.Stock = stockAfter

		if err := tx.Save(&inventory).Error; err != nil {
			return err
		}

		// Simpan history perubahan stok
		movement := models.StockMovement{
			ProductID:   input.ProductID,
			Type:        input.Type,
			Quantity:    input.Quantity,
			StockBefore: stockBefore,
			StockAfter:  stockAfter,
			Reference:   input.Reference,
			Note:        input.Note,
		}

		if err := tx.Create(&movement).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {

		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Product not found",
			})
			return
		}

		if err == gorm.ErrInvalidData {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Insufficient stock",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create stock movement",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Stock movement created successfully",
	})
}