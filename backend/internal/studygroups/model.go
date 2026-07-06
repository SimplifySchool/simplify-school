package studygroups

import "time"

type StudyGroup struct {
	ID          int       `db:"id"`
	Name        string    `db:"name"`
	Description string    `db:"description"`
	CreatedAt   time.Time `db:"created_at"`
	AdminID     int       `db:"admin_id"`
}

type StudyGroupInput struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type StudyGroupResponse struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	AdminID     int       `json:"admin_id"`
}

// AssignmentStats holds the completed/missing counts for a user's assignments
type AssignmentStats struct {
	CompletedCount int `json:"completed_count"`
	MissingCount   int `json:"missing_count"`
}

// MemberResponse represents a study group member with their assignment stats.
// This struct is designed to be extended with additional fields (e.g. study time tracking).
type MemberResponse struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Email          string `json:"email"`
	CompletedCount int    `json:"completed_count"`
	MissingCount   int    `json:"missing_count"`
}

// StudyGroupDetailResponse combines group info with its member list
type StudyGroupDetailResponse struct {
	ID          int              `json:"id"`
	Name        string           `json:"name"`
	Description string           `json:"description"`
	CreatedAt   time.Time        `json:"created_at"`
	AdminID     int              `json:"admin_id"`
	Members     []MemberResponse `json:"members"`
}
