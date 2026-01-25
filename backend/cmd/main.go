package main

import (
	"context"
	"log"
	"os"

	"github.com/SimplifySchool/simplify-school/backend/internal/auth"
	"github.com/SimplifySchool/simplify-school/backend/internal/config"
	"github.com/SimplifySchool/simplify-school/backend/internal/users"
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
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	authCfg, err := config.LoadAuthConfig()
	if err != nil {
		log.Fatal("Failed to load auth config: ", err)
	}

	jwtValidator, err := auth.NewValidator(authCfg.Domain, authCfg.Audience)
	if err != nil {
		log.Fatal("Failed to create JWT validator: ", err)
	}

	jwtMiddleware, err := auth.NewMiddleware(jwtValidator)
	if err != nil {
		log.Fatal("Failed to create JWT middleware: ", err)
	}

	// Connect to PostgreSQL database
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
		log.Fatal("Unable to ping database: ", err)
	}
	api := app.Group("/api")
	// Public routes (no authentication required)
	api.Get("/public", auth.PublicHandler)

	// Protected routes (authentication required)
	api.Get("/private", jwtMiddleware, auth.PrivateHandler)
	api.Get("/scoped", jwtMiddleware, auth.ScopedHandler)

	userModule := users.NewModule(pgxConn)
	userModule.RegisterRoutes(api, jwtMiddleware)

	log.Println("Starting server on :3000")
	_ = app.Listen(":3000")
}
