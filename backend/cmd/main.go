package main

import (
	"context"
	"log"
	"os"
	"time"

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
	// The app will assume variables are provided by Kubernetes.
	if err != nil {
		log.Println("No .env file found")
	}

	log.Println("Got to middleware config")
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("CORS_ORIGINS"),
		AllowMethods:     "GET,PUT,POST,DELETE",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${method} ${path}\n",
		Next: func(c *fiber.Ctx) bool {
			if c.Path() == "/ping" {
				return true
			}
			return false
		},
	}))
	log.Println("Middleware configured")

	// Load Auth0 configuration
	log.Println("Loading Auth Config")
	authCfg, err := config.LoadAuthConfig()
	if err != nil {
		log.Fatal("Failed to load auth config: ", err)
	}

	log.Println("Creating JWT validator and middleware")
	jwtValidator, err := auth.NewValidator(authCfg.Domain, authCfg.Audience)
	if err != nil {
		log.Fatal("Failed to create JWT validator: ", err)
	}

	jwtMiddleware, err := auth.NewMiddleware(jwtValidator)
	if err != nil {
		log.Fatal("Failed to create JWT middleware: ", err)
	}

	log.Println("Connecting to PostgreSQL database:")
	// Connect to PostgreSQL database
	databaseName := os.Getenv("DATABASE_NAME")
	if databaseName == "" {
		databaseName = "postgres"
	}
	pgxURL := "postgres://" +
		os.Getenv("POSTGRES_USER") + ":" +
		os.Getenv("POSTGRES_PASSWORD") +
		"@" + os.Getenv("DATABASE_URL") + "/" + databaseName
	log.Println(pgxURL)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	pgxConn, err := pgxpool.New(ctx, pgxURL)
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}
	defer pgxConn.Close()

	err = pgxConn.Ping(context.Background())
	if err != nil {
		log.Fatal("Unable to ping database: ", err)
	}
	log.Println("Listening to database")

	log.Println("Registering routes and starting server")
	api := app.Group("/api")

	userModule := users.NewModule(pgxConn)
	userModule.RegisterRoutes(api, jwtMiddleware)

	repo := assignments.NewRepository(pgxConn)
	service := assignments.NewService(repo)
	handler := assignments.NewHandler(service, userModule.Service)

	app.Get("/ping", func(ctx *fiber.Ctx) error {
		return ctx.JSON(fiber.Map{"message": "pong"})
	})

	api.Get("/assignments", jwtMiddleware, handler.GetAssignments)
	api.Post("/assignments", jwtMiddleware, handler.CreateAssignment)
	api.Delete("/assignments/:id", jwtMiddleware, handler.DeleteAssignment)
	api.Put("/assignments/:id", jwtMiddleware, handler.PutAssignment)

	serverPort := os.Getenv("SERVER_PORT")
	if serverPort == "" {
		serverPort = "3000"
	}
	log.Println("Starting server on :" + serverPort)
	err = app.Listen(":" + serverPort)
	if err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
