package main

import (
	"context"
	"log"
	"os"

	"github.com/SimplifySchool/simplify-school/backend/internal/assignments"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("CORS_ORIGINS"),
		AllowMethods:     "GET,PUT,POST,DELETE",
		AllowHeaders:     "Content-Type",
		AllowCredentials: true,
	}))

	pgxURL := "postgres://" +
		os.Getenv("POSTGRES_USER") + ":" +
		os.Getenv("POSTGRES_PASSWORD") +
		"@" + os.Getenv("DATABASE_URL") + "/" +
		os.Getenv("DATABASE_NAME")

	pgxConn, err := pgxpool.New(context.Background(), pgxURL)
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}
	defer pgxConn.Close()

	err = pgxConn.Ping(context.Background())
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}
	log.Println("Listening to database")
	repo := assignments.NewRepository(pgxConn)
	service := assignments.NewService(repo)
	handler := assignments.NewHandler(service)

	app.Get("/assignments", handler.GetAssignments)
	app.Post("/assignments", handler.CreateAssignment)
	app.Delete("/assignments/:id", handler.DeleteAssignment)
	app.Put("/assignments/:id", handler.PutAssignment)

	log.Println("Listening on port:" + os.Getenv("SERVER_PORT"))
	app.Listen(":" + os.Getenv("SERVER_PORT"))
}
