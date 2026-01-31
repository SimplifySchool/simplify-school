package assignments

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/SimplifySchool/simplify-school/backend/internal/users"
	"github.com/auth0/go-jwt-middleware/v3/validator"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service     *Service
	userService *users.Service
}

func NewHandler(service *Service, userService *users.Service) *Handler {
	return &Handler{
		service:     service,
		userService: userService,
	}
}

// getAuthenticatedUserID extracts the user's Auth0 ID from the JWT token and retrieves their database ID
func (h *Handler) getAuthenticatedUserID(c *fiber.Ctx) (int, error) {
	// Extract validated claims from context
	token, ok := c.Locals("claims").(*validator.ValidatedClaims)
	if !ok {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	// Get Auth0 ID (subject) from token
	auth0ID := token.RegisteredClaims.Subject
	if auth0ID == "" {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "Invalid token: missing subject")
	}

	// Fetch user from database
	user, err := h.userService.GetUserByAuth0ID(c.Context(), auth0ID)
	if err != nil {
		return 0, fiber.NewError(fiber.StatusNotFound, "User not found. Please sync your account first.")
	}

	return user.ID, nil
}

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

	// Get authenticated user ID
	userID, err := h.getAuthenticatedUserID(c)
	if err != nil {
		return err
	}

	res, err := h.service.CreateAssignment(c.Context(), req, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

func (h *Handler) GetAssignments(c *fiber.Ctx) error {
	// Get authenticated user ID
	userID, err := h.getAuthenticatedUserID(c)
	if err != nil {
		return err
	}

	assignments, err := h.service.GetAssignments(c.Context(), userID)
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

	// Get authenticated user ID
	userID, err := h.getAuthenticatedUserID(c)
	if err != nil {
		return err
	}

	deleteAssignmentError := h.service.DeleteAssignment(c.Context(), assignmentID, userID)
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
	if err := CompletionStatusValidation(CompletionStatus(strings.TrimSpace(string(assignment.CompletionStatus)))); err == false {
		msg := fmt.Sprintf("Completion Status does not fit one of the three possibilities: %s", assignment.CompletionStatus)
		return fiber.NewError(fiber.StatusBadRequest, msg)
	}

	// Get authenticated user ID
	userID, err := h.getAuthenticatedUserID(c)
	if err != nil {
		return err
	}

	response, err := h.service.UpdateAssignment(c.Context(), assignment, assignmentID, userID)
	if err != nil {
		if errors.Is(err, ErrAssignmentNotFound) {
			return fiber.NewError(fiber.StatusNotFound, err.Error())
		}
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(response)

}
