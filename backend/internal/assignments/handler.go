package assignments

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	app.Get("/assignments", getAssignments)
}

func getAssignments(c *fiber.Ctx) error {
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
}
