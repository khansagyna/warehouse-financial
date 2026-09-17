package models

import "time"

type StockMovement struct {
	ID uint `gorm:"primaryKey"`

	ProductID uint    `gorm:"not null"`
	Product   Product `gorm:"foreignKey:ProductID"`

	Type string `gorm:"not null"`
	// IN  = stok masuk
	// OUT = stok keluar

	Quantity int `gorm:"not null"`
	StockBefore int `gorm:"not null"`
	StockAfter  int `gorm:"not null"`

	Reference string
	Note      string

	CreatedAt time.Time
}