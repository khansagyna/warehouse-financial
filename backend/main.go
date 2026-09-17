package main

import (
	"log"

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
		log.Fatal(err)
	}

	// =========================
	// AUTO MIGRATION
	// =========================

	err = db.AutoMigrate(
		&models.Category{},
		&models.Product{},
		&models.Inventory{},
		&models.StockMovement{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migration completed")

	// =========================
	// GIN ROUTER
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

	inventoryController := controllers.InventoryController{
		DB: db,
	}

	stockMovementController := controllers.StockMovementController{
		DB: db,
	}

	// =========================
	// HEALTH CHECK
	// =========================

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Warehouse Financial API is running",
		})
	})

	// =========================
	// API ROUTES
	// =========================

	api := router.Group("/api")
	{
		// =========================
		// CATEGORY
		// =========================

		api.GET(
			"/categories",
			categoryController.GetCategories,
		)

		api.POST(
			"/categories",
			categoryController.CreateCategory,
		)

		api.PUT(
			"/categories/:id",
			categoryController.UpdateCategory,
		)

		api.DELETE(
			"/categories/:id",
			categoryController.DeleteCategory,
		)

		// =========================
		// PRODUCT
		// =========================

		api.GET(
			"/products",
			productController.GetProducts,
		)

		api.GET(
			"/products/:id",
			productController.GetProduct,
		)

		api.POST(
			"/products",
			productController.CreateProduct,
		)

		api.PUT(
			"/products/:id",
			productController.UpdateProduct,
		)

		api.DELETE(
			"/products/:id",
			productController.DeleteProduct,
		)

		// =========================
		// INVENTORY
		// =========================

		api.GET(
			"/inventories",
			inventoryController.GetInventories,
		)

		// =========================
		// STOCK MOVEMENT
		// =========================

		api.GET(
			"/stock-movements",
			stockMovementController.GetStockMovements,
		)

		api.POST(
			"/stock-movements",
			stockMovementController.CreateStockMovement,
		)
	}

	// =========================
	// START SERVER
	// =========================

	log.Println("Server running on http://localhost:8080")

	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}