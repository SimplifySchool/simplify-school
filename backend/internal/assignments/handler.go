package assignments

import (
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

const mockUserID = 1 // We use a mock user ID for now because auth has not been implemented yet

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

	res, err := h.service.CreateAssignment(c.Context(), req, mockUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *Handler) GetAssignments(c *fiber.Ctx) error {

	assignments, err := h.service.GetAssignments(c.Context(), mockUserID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.JSON(assignments)
}

func (h *Handler) DeleteAssignment(c *fiber.Ctx) error {
	idParamater := c.Params("id")
	assignmentID, err := strconv.Atoi(idParamater)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Assignment ID")
	}

	deleteAssignmentError := h.service.DeleteAssignment(c.Context(), assignmentID, mockUserID)
	if deleteAssignmentError != nil {
		if deleteAssignmentError.Error() == "assignment not found" {
			return fiber.NewError(fiber.StatusNotFound, deleteAssignmentError.Error())
		}
		return fiber.NewError(fiber.StatusInternalServerError, deleteAssignmentError.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}
