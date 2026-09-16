package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"warehouse-financial/controllers"
	"warehouse-financial/database"
	"warehouse-financial/models"
)

func main() {
	// Connect ke database
	db, err := database.Connect()
	if err != nil {
		panic(err)
	}

	fmt.Println("Database connected successfully:", db != nil)

	// Migration
	err = db.AutoMigrate(&models.Category{})
	if err != nil {
		panic(err)
	}

	fmt.Println("Category table migrated successfully")

	// Router
	router := gin.Default()

	// Izinkan frontend React mengakses backend
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5174"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	// Controller
	categoryController := controllers.CategoryController{
		DB: db,
	}

	// Category routes
	router.GET("/api/categories", categoryController.GetCategories)
	router.POST("/api/categories", categoryController.CreateCategory)
	router.PUT("/api/categories/:id", categoryController.UpdateCategory)
	router.DELETE("/api/categories/:id", categoryController.DeleteCategory)

	// Health check
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Warehouse Financial API is running",
		})
	})

	// Run server
	fmt.Println("Server running on http://localhost:8080")

	router.Run(":8080")
}