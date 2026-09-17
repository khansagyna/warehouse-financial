package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"warehouse-financial/models"
)

type InventoryController struct {
	DB *gorm.DB
}

func NewInventoryController(db *gorm.DB) *InventoryController {
	return &InventoryController{
		DB: db,
	}
}

func (controller *InventoryController) GetInventories(c *gin.Context) {
	var inventories []models.Inventory

	result := controller.DB.
		Preload("Product").
		Find(&inventories)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to get inventories",
		})
		return
	}

	c.JSON(http.StatusOK, inventories)
}