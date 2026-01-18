package assignments

import (
	"errors"
	"time"
)

var ErrAssignmentNotFound = errors.New("assignment not found")

type CompletionStatus string

const (
	ToDo  CompletionStatus = "To Do"
	Doing CompletionStatus = "Doing"
	Done  CompletionStatus = "Done"
)

/*
Turns an Assignment "object" into an AssignmentResponse "object" by removing the UserID

	@param a (Assignment) the assignment "object"
	@return (AssignmentResponse) the AssignmentResponse "object"
*/
func ToAssignmentResponse(a Assignment) AssignmentResponse {
	return AssignmentResponse{
		ID:               a.ID,
		Title:            a.Title,
		Description:      a.Description,
		CompletionStatus: a.CompletionStatus,
		DueDate:          a.DueDate,
		CreatedAt:        a.CreatedAt,
	}
}

/*
Validates completion status variable.

	@param c (CompletionStatus) The variable that will be checked if it is one of the three allowed values.
	@return (boolean) returns a true value if the given param is one of three allowed values, false if not.
*/
func CompletionStatusValidation(c CompletionStatus) bool {
	switch c {
	case ToDo, Doing, Done:
		return true
	default:
		return false
	}
}

/*
Struct that represnts an assignment, Database model
  - Data received from Database and mirrors the table
  - NEVER sent to frontend
*/
type Assignment struct {
	ID               int              `db:"id"`
	Title            string           `db:"title"`
	Description      string           `db:"description"`
	CompletionStatus CompletionStatus `db:"completion_status"`
	DueDate          *time.Time       `db:"due_date"`
	CreatedAt        time.Time        `db:"created_at"`
	UserID           int              `db:"user_id"`
}

/*
Struct that represents an assignment response (Response to frontend's HTTP request), API response model
  - Similiar to the Assignment struct except without the UserID
  - Only data we want displayed is sent to the front end using this
*/
type AssignmentResponse struct {
	ID               int              `json:"id"`
	Title            string           `json:"title"`
	Description      string           `json:"description"`
	CompletionStatus CompletionStatus `json:"completion_status"`
	DueDate          *time.Time       `json:"due_date"`
	CreatedAt        time.Time        `json:"created_at"`
}

/*
Struct that represents an assignment input (Frontend's input for a POST request)
  - Similiar to the Assignment struct except without the ID, UserID, CreatedAt, and CompletionStatus
  - The data the client can customize when making an assignment for the first time
*/
type AssignmentInput struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	DueDate     *time.Time `json:"due_date"`
}

/*
Struct that represents all the fields a user can modify once having created the assginment (Frontend's input for a PUT request)
  - ID, UserID and CreatedAt fields have been omitted for it should not be something the user decides, but the backend
*/
type AssignmentModifiable struct {
	Title            string           `json:"title"`
	Description      string           `json:"description"`
	CompletionStatus CompletionStatus `json:"completion_status"`
	DueDate          *time.Time       `json:"due_date"`
}
