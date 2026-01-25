package users

import (
	"context"
	"fmt"
)

// Service handles business logic for users
type Service struct {
	repo *Repository
}

// NewService creates a new user service
func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// SyncUser syncs a user from Auth0 to the local database
func (s *Service) SyncUser(ctx context.Context, auth0ID, name, email string) (*User, error) {
	// Validate input
	if auth0ID == "" {
		return nil, fmt.Errorf("auth0_id is required")
	}
	if email == "" {
		return nil, fmt.Errorf("email is required")
	}

	// Upsert user in database
	user, err := s.repo.UpsertUser(ctx, auth0ID, name, email)
	if err != nil {
		return nil, fmt.Errorf("failed to upsert user: %w", err)
	}

	return user, nil
}

// GetUserByAuth0ID retrieves a user by their Auth0 ID
func (s *Service) GetUserByAuth0ID(ctx context.Context, auth0ID string) (*User, error) {
	if auth0ID == "" {
		return nil, fmt.Errorf("auth0_id is required")
	}

	user, err := s.repo.GetUserByAuth0ID(ctx, auth0ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}
