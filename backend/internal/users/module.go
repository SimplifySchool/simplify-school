package users

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	Handler *Handler
}

func NewModule(db *pgxpool.Pool) *Module {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)
	return &Module{Handler: handler}
}

func (m *Module) RegisterRoutes(appRoutes fiber.Router, jwtMiddleware fiber.Handler) {
	userRoutes := appRoutes.Group("/users")
	userRoutes.Post("/sync", jwtMiddleware, m.Handler.SyncUser)
}
