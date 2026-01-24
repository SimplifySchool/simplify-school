package users

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository handles database operations for users
type Repository struct {
	pool *pgxpool.Pool
}

// NewRepository creates a new user repository
func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

// UpsertUser inserts or updates a user based on their Auth0 ID
func (r *Repository) UpsertUser(ctx context.Context, auth0ID, name, email string) (*User, error) {
	query := `
		INSERT INTO users (auth0_id, name, email, created_at, updated_at)
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		ON CONFLICT (auth0_id) 
		DO UPDATE SET 
			name = EXCLUDED.name,
			email = EXCLUDED.email,
			updated_at = CURRENT_TIMESTAMP
		RETURNING id, auth0_id, name, email, created_at, updated_at
	`

	var user User
	err := r.pool.QueryRow(ctx, query, auth0ID, name, email).Scan(
		&user.ID,
		&user.Auth0ID,
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUserByAuth0ID retrieves a user by their Auth0 ID
func (r *Repository) GetUserByAuth0ID(ctx context.Context, auth0ID string) (*User, error) {
	query := `
		SELECT id, auth0_id, name, email, created_at, updated_at
		FROM users
		WHERE auth0_id = $1
	`

	var user User
	err := r.pool.QueryRow(ctx, query, auth0ID).Scan(
		&user.ID,
		&user.Auth0ID,
		&user.Name,
		&user.Email,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
