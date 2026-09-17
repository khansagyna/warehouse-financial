package models

import "time"

type Inventory struct {
	ID        uint      `gorm:"primaryKey"`
	ProductID uint      `gorm:"not null;unique"`
	Product   Product   `gorm:"foreignKey:ProductID"`
	Stock     int       `gorm:"not null;default:0"`
	CreatedAt time.Time
	UpdatedAt time.Time
}