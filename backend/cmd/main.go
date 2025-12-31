package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	app := fiber.New()
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file: ", err)
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,PUT,POST,DELETE",
		AllowHeaders:     "Content-Type",
		AllowCredentials: true,
	}))

	pgxURL := "postgres://" +
		os.Getenv("POSTGRES_USER") + ":" +
		os.Getenv("POSTGRES_PASSWORD") +
		"@localhost:5432/postgres"

	pgxConn, err := pgxpool.New(context.Background(), pgxURL)
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}
	defer pgxConn.Close()

	err = pgxConn.Ping(context.Background())
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}

	app.Listen(":3000")
}
