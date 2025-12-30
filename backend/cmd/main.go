package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,PUT,POST,DELETE",
		AllowHeaders:     "Content-Type",
		AllowCredentials: true,
	}))

	app.Listen(":3000")
}
