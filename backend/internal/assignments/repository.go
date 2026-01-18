package assignments

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

/*
Makes a new repository the assignments table, facilitates writing code later in order to avoid passing down DB as a parameter every time

	@param db (*pgxpool.Pool) The database
	@return (&Repository) a pointer to the repository
*/
func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

/*
Gets all the assignments that a user has created

	@param ctx (context.Context) the conext
	@param userID (int) The ID of the user
	@return ([]Assignment, error) Returns an array of assignment data that will be displayed on the frontend, nil if an error is not nil
*/
func (r *Repository) GetAssignments(ctx context.Context, userID int) ([]Assignment, error) {

	query := `
        SELECT id, title, description, completion_status, due_date, created_at, user_id
        FROM assignments
        WHERE user_id = $1
        ORDER BY created_at DESC
    `

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	assignments := []Assignment{}

	for rows.Next() {
		var a Assignment
		err := rows.Scan(
			&a.ID,
			&a.Title,
			&a.Description,
			&a.CompletionStatus,
			&a.DueDate,
			&a.CreatedAt,
			&a.UserID,
		)
		if err != nil {
			return nil, err
		}

		assignments = append(assignments, a)
	}

	return assignments, nil
}

/*
Inserts an assignment inside the DB through a POST request from the frontend

	@param ctx (context.Context) The context
	@param a (Assignment) The assignment "object" that contains the data that will be inserted in the DB
	@return (int, error) The id of the assignment, nil if error exists
*/
func (r *Repository) InsertAssignment(ctx context.Context, a Assignment) (int, error) {

	var id int

	query := `
        INSERT INTO assignments
            (title, description, completion_status, due_date, created_at, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `

	err := r.db.QueryRow(ctx, query,
		a.Title,
		a.Description,
		a.CompletionStatus,
		a.DueDate,
		a.CreatedAt,
		a.UserID,
	).Scan(&a.ID)

	id = a.ID

	if err != nil {
		return 0, err
	}

	return id, nil
}

func (r *Repository) DeleteAssignment(ctx context.Context, ID int, userID int) error {

	query := `
	DELETE FROM assignments
	WHERE user_id = $1 AND id = $2
	`

	tag, err := r.db.Exec(ctx, query,
		userID,
		ID)

	if err != nil {
		return err
	}

	if tag.RowsAffected() == 0 {
		return errors.New("Assignment not found")
	}

	return nil
}

func (r *Repository) PutAssignment(ctx context.Context, a Assignment) (Assignment, error) {

	query := `
	UPDATE assignments
	SET
		title = $2,
		description = $3,
		completion_status = $4,
		due_date = $5
	WHERE id = $1 AND user_id = $6
	RETURNING title, description, completion_status, due_date, created_at;
	`
	rA := Assignment{ // returnedAssignment
		ID:     a.ID,
		UserID: a.UserID,
	}

	err := r.db.QueryRow(ctx, query,
		a.ID,
		a.Title,
		a.Description,
		a.CompletionStatus,
		a.DueDate,
		a.UserID,
	).Scan(
		&rA.Title,
		&rA.Description,
		&rA.CompletionStatus,
		&rA.DueDate,
		&rA.CreatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return Assignment{}, ErrAssignmentNotFound
		}
		return Assignment{}, err
	}

	return rA, nil
}
