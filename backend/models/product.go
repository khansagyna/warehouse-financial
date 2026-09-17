package models

import "time"

type Product struct {
	ID uint `gorm:"primaryKey"`

	SKU  string `gorm:"not null;unique"`
	Name string `gorm:"not null"`

	CategoryID uint
	Category   Category `gorm:"foreignKey:CategoryID"`

	Unit string `gorm:"not null"`

	SellingPrice float64 `gorm:"not null"`
	PurchasePrice float64 `gorm:"not null"`

	MinimumStock int `gorm:"not null;default:0"`

	IsActive bool `gorm:"not null;default:true"`

	CreatedAt time.Time
	UpdatedAt time.Time
}