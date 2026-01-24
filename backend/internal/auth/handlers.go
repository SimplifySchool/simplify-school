package auth

import (
	"github.com/auth0/go-jwt-middleware/v3/validator"
	"github.com/gofiber/fiber/v2"
)

// PublicHandler - no authentication required
func PublicHandler(ctx *fiber.Ctx) error {
	response := map[string]string{
		"message": "Hello from a public endpoint! You don't need to be authenticated to see this.",
	}
	return ctx.JSON(response)
}

// PrivateHandler - requires valid JWT
func PrivateHandler(ctx *fiber.Ctx) error {
	response := map[string]string{
		"message": "Hello from a private endpoint! You need to be authenticated to see this.",
	}
	return ctx.JSON(response)
}

// ScopedHandler - requires 'read:messages' permission
func ScopedHandler(ctx *fiber.Ctx) error {
	// Extract validated token from context (set by middleware)
	token, ok := ctx.Locals("token").(*validator.ValidatedClaims)
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized.",
		})
	}

	// Check for required scope in custom claims
	customClaims, ok := token.CustomClaims.(*CustomClaims)
	if !ok || !customClaims.HasScope("read:messages") {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Insufficient scope.",
		})
	}

	response := map[string]string{
		"message": "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
	}
	return ctx.JSON(response)
}
