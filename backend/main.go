package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"warehouse-financial/database"
)

func main() {
	db, err := database.Connect()
	if err != nil {
		panic(err)
	}

	fmt.Println("Database connected successfully:", db != nil)

	router := gin.Default()

	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Warehouse Financial API is running",
		})
	})

	router.Run(":8080")
}