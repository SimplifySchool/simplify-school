package main

import (
	"context"
	"log"
	"os"

	"github.com/SimplifySchool/simplify-school/backend/internal/assignments"
	"github.com/SimplifySchool/simplify-school/backend/internal/auth"
	"github.com/SimplifySchool/simplify-school/backend/internal/config"
	"github.com/SimplifySchool/simplify-school/backend/internal/users"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
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
		AllowOrigins:     os.Getenv("CORS_ORIGINS"),
		AllowMethods:     "GET,PUT,POST,DELETE",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	app.Use(logger.New())

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
	databaseName := os.Getenv("DATABASE_NAME")
	if databaseName == "" {
		databaseName = "postgres"
	}
	pgxURL := "postgres://" +
		os.Getenv("POSTGRES_USER") + ":" +
		os.Getenv("POSTGRES_PASSWORD") +
		"@" + os.Getenv("DATABASE_URL") + "/" + databaseName

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

	userModule := users.NewModule(pgxConn)
	userModule.RegisterRoutes(api, jwtMiddleware)

	repo := assignments.NewRepository(pgxConn)
	service := assignments.NewService(repo)
	handler := assignments.NewHandler(service, userModule.Service)

	api.Get("/assignments", jwtMiddleware, handler.GetAssignments)
	api.Post("/assignments", jwtMiddleware, handler.CreateAssignment)
	api.Delete("/assignments/:id", jwtMiddleware, handler.DeleteAssignment)
	api.Put("/assignments/:id", jwtMiddleware, handler.PutAssignment)

	serverPort := os.Getenv("SERVER_PORT")
	if serverPort == "" {
		serverPort = "3000"
	}
	log.Println("Starting server on :" + serverPort)
	_ = app.Listen(":" + serverPort)
}
