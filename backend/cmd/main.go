package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type CompletionStatus string

const (
	ToDo  CompletionStatus = "To Do"
	Doing CompletionStatus = "Doing"
	Done  CompletionStatus = "Done"
)

func CompletionStatusValidation(c CompletionStatus) bool {
	switch c {
	case ToDo, Doing, Done:
		return true
	default:
		return false
	}
}

type Assignment struct { // Struct received from the DB
	ID               int              `db:"id"`
	Title            string           `db:"title"`
	Description      string           `db:"description"`
	CompletionStatus CompletionStatus `db:"completion_status"`
	DueDate          *time.Time       `db:"due_date"`
	CreatedAt        time.Time        `db:"created_at"`
	UserID           int              `db:"user_id"`
}

type AssignmentResponse struct { // Struct used to send data to frontend, so whatever we want it to display
	ID               int              `json:"id"`
	Title            string           `json:"title"`
	Description      string           `json:"description"`
	CompletionStatus CompletionStatus `json:"completion_status"`
	DueDate          *time.Time       `json:"due_date"`
	CreatedAt        time.Time        `json:"created_at"`
}

func ToAssignmentResponse(a Assignment) AssignmentResponse {
	return AssignmentResponse{
		ID:               a.ID,
		Title:            a.Title,
		Description:      a.Description,
		CompletionStatus: a.CompletionStatus,
		DueDate:          a.DueDate,
		CreatedAt:        a.CreatedAt,
	}

}

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

	app.Get("/assignments", func(c *fiber.Ctx) error {
		assignments := []Assignment{
			{
				ID:               1,
				Title:            "Math Homework",
				Description:      "Chapter 5 problems",
				CompletionStatus: ToDo,
				CreatedAt:        time.Now(),
				UserID:           1,
			},
			{
				ID:               2,
				Title:            "Physics Lab",
				Description:      "Projectile motion",
				CompletionStatus: Doing,
				CreatedAt:        time.Now(),
				UserID:           1,
			},
		}

		responses := make([]AssignmentResponse, 0, len(assignments))
		for _, a := range assignments {
			responses = append(responses, ToAssignmentResponse(a))
		}

		return c.JSON(responses)
	})

	app.Listen(":3000")
}
