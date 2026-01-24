package users

import (
	"github.com/auth0/go-jwt-middleware/v3/validator"
	"github.com/gofiber/fiber/v2"
)

// Handler handles HTTP requests for users
type Handler struct {
	service *Service
}

// NewHandler creates a new user handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// SyncUser syncs Auth0 user to local database
func (h *Handler) SyncUser(ctx *fiber.Ctx) error {
	// Verify JWT token is present
	token, ok := ctx.Locals("token").(*validator.ValidatedClaims)
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized.",
		})
	}

	// Parse request body
	var req SyncUserRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body.",
		})
	}

	// Validate required fields
	if req.Auth0ID == "" || req.Email == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "auth0_id and email are required.",
		})
	}

	// Verify the token subject matches the auth0_id in the request
	if token.RegisteredClaims.Subject != req.Auth0ID {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Cannot sync user for different Auth0 ID.",
		})
	}

	// Sync user via service
	user, err := h.service.SyncUser(ctx.Context(), req.Auth0ID, req.Name, req.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to sync user.",
			"error":   err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "User synced successfully.",
		"user":    user,
	})
}
