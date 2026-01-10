package assignments

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) CreateAssignment(c *fiber.Ctx) error {
	var req AssignmentInput

	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid JSON")
	}

	if strings.TrimSpace(req.Title) == "" { // Frontend already checks for this but we still check
		return fiber.NewError(fiber.StatusBadGateway, "Title is required")
	}

	if strings.TrimSpace(req.Title) == "" { // Frontend already checks for this but we still check
		return fiber.NewError(fiber.StatusBadGateway, "Description is required")
	}

	mockUserID := 1 // We use a mock user ID for now because auth has not been implemented yet

	res, err := h.service.CreateAssignment(c.Context(), req, mockUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *Handler) GetAssignments(c *fiber.Ctx) error {
	mockUserID := 1 // Again, we use a mock user ID here because we have not implemented auth yet

	assignments, err := h.service.GetAssignments(c.Context(), mockUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.JSON(assignments)
}
