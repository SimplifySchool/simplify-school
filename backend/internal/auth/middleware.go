package auth

import (
	"log/slog"
	"strings"

	"github.com/auth0/go-jwt-middleware/v3/validator"
	"github.com/gofiber/fiber/v2"
)

func NewMiddleware(jwtValidator *validator.Validator) (fiber.Handler, error) {
	return func(c *fiber.Ctx) error {
		// Skip OPTIONS requests
		if c.Method() == "OPTIONS" {
			return c.Next()
		}

		// Extract token from Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			slog.Error("JWT validation failed", "error", "missing authorization header", "path", c.Path())
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Failed to validate JWT.",
			})
		}

		// Check for Bearer token format
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			slog.Error("JWT validation failed", "error", "invalid authorization header format", "path", c.Path())
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Failed to validate JWT.",
			})
		}

		tokenString := parts[1]

		// Validate the token using Auth0 validator
		token, err := jwtValidator.ValidateToken(c.Context(), tokenString)
		if err != nil {
			slog.Error("JWT validation failed", "error", err, "path", c.Path())
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Failed to validate JWT.",
			})
		}

		// Store validated claims in context for use in handlers
		c.Locals("claims", token)

		return c.Next()
	}, nil
}
