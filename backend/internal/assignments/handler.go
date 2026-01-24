package assignments

import (
	"errors"
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
		return fiber.NewError(fiber.StatusBadRequest, "Title is required")
	}

	if strings.TrimSpace(req.Description) == "" { // Frontend already checks for this but we still check
		return fiber.NewError(fiber.StatusBadRequest, "Description is required")
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
		if errors.Is(deleteAssignmentError, ErrAssignmentNotFound) {
			return fiber.NewError(fiber.StatusNotFound, deleteAssignmentError.Error())
		}
		return fiber.NewError(fiber.StatusInternalServerError, deleteAssignmentError.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (h *Handler) PutAssignment(c *fiber.Ctx) error {
	var assignment AssignmentModifiable

	idParameter := c.Params("id")
	assignmentID, idErr := strconv.Atoi(idParameter)
	if idErr != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Assignment ID")
	}

	if err := c.BodyParser(&assignment); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid JSON")
	}

	if strings.TrimSpace(assignment.Title) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Title is required")
	}

	if strings.TrimSpace(assignment.Description) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Description is required")
	}

	// Validate completion status using shared helper to ensure it is one of the allowed values
	if err := CompletionStatusValidation(strings.TrimSpace(assignment.CompletionStatus)); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	response, err2 := h.service.UpdateAssignment(c.Context(), assignment, assignmentID, mockUserID)

	if err2 != nil {
		if errors.Is(err2, ErrAssignmentNotFound) {
			return fiber.NewError(fiber.StatusNotFound, err2.Error())
		}
		return fiber.NewError(fiber.StatusInternalServerError, err2.Error())
	}

	return c.Status(fiber.StatusOK).JSON(response)

}
