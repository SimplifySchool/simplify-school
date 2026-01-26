package users

import "time"

// User represents a user in the system
type User struct {
	ID        int       `json:"id"`
	Auth0ID   string    `json:"auth0_id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// SyncUserRequest represents the request body for syncing a user
type SyncUserRequest struct {
	Auth0ID string `json:"auth0_id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
}
