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
	// =========================
	// DATABASE
	// =========================
	db, err := database.Connect()
	if err != nil {
		panic(err)
	}

	fmt.Println("Database connected successfully:", db != nil)

	// =========================
	// DATABASE MIGRATION
	// =========================
	err = db.AutoMigrate(
		&models.Category{},
		&models.Product{},
	)

	if err != nil {
		panic(err)
	}

	fmt.Println("Database migration successful")

	// =========================
	// ROUTER
	// =========================
	router := gin.Default()

	// =========================
	// CORS
	// =========================
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://localhost:5174",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
		},
		AllowCredentials: true,
	}))

	// =========================
	// CONTROLLERS
	// =========================
	categoryController := controllers.CategoryController{
		DB: db,
	}

	productController := controllers.ProductController{
		DB: db,
	}

	// =========================
	// CATEGORY ROUTES
	// =========================

	// Get all categories
	router.GET(
		"/api/categories",
		categoryController.GetCategories,
	)

	// Create category
	router.POST(
		"/api/categories",
		categoryController.CreateCategory,
	)

	// Update category
	router.PUT(
		"/api/categories/:id",
		categoryController.UpdateCategory,
	)

	// Delete category
	router.DELETE(
		"/api/categories/:id",
		categoryController.DeleteCategory,
	)

	// =========================
	// PRODUCT ROUTES
	// =========================

	// Get all products
	router.GET(
		"/api/products",
		productController.GetProducts,
	)

	// Get product by ID
	router.GET(
		"/api/products/:id",
		productController.GetProduct,
	)

	// Create product
	router.POST(
		"/api/products",
		productController.CreateProduct,
	)

	// Update product
	router.PUT(
		"/api/products/:id",
		productController.UpdateProduct,
	)

	// Delete product
	router.DELETE(
		"/api/products/:id",
		productController.DeleteProduct,
	)

	// =========================
	// HEALTH CHECK
	// =========================
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Warehouse Financial API is running",
		})
	})

	// =========================
	// RUN SERVER
	// =========================
	fmt.Println("Server running on http://localhost:8080")

	err = router.Run(":8080")
	if err != nil {
		panic(err)
	}
}