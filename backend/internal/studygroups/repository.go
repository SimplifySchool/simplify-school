package studygroups

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateGroupWithAdmin(ctx context.Context, req *StudyGroupInput, adminID int) (*StudyGroup, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	groupQuery := `INSERT INTO study_groups (name, description, admin_id) VALUES ($1, $2, $3) RETURNING id`

	var group StudyGroup
	err = tx.QueryRow(ctx, groupQuery, req.Name, req.Description, adminID).Scan(&group)
	if err != nil {
		return nil, err
	}

	memberQuery := `INSERT INTO study_group_members (study_group_id, user_id) VALUES ($1, $2)`
	_, err = tx.Exec(ctx, memberQuery, group.ID, adminID)
	if err != nil {
		return nil, err
	}

	return &group, tx.Commit(ctx)
}

func (r *Repository) GetGroupByID(ctx context.Context, groupID int) (*StudyGroup, error) {
	query := `SELECT * FROM study_groups WHERE id = $1`
	var group StudyGroup
	err := r.db.QueryRow(ctx, query, groupID).Scan(&group.ID, &group.Name, &group.Description, &group.CreatedAt, &group.AdminID)
	return &group, err
}

func (r *Repository) GetGroupsByUser(ctx context.Context, userID int) ([]StudyGroup, error) {
	query := `SELECT sg.* FROM study_groups sg JOIN study_group_members sgm ON sg.id = sgm.study_group_id WHERE sgm.user_id = $1`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []StudyGroup
	for rows.Next() {
		var group StudyGroup
		err = rows.Scan(&group.ID, &group.Name, &group.Description, &group.CreatedAt, &group.AdminID)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	return groups, nil
}

// IsUserMemberOfGroup checks whether a user belongs to a study group
func (r *Repository) IsUserMemberOfGroup(ctx context.Context, groupID int, userID int) (bool, error) {
	query := `SELECT COUNT(*) FROM study_group_members WHERE study_group_id = $1 AND user_id = $2`
	var count int
	err := r.db.QueryRow(ctx, query, groupID, userID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// GetGroupMembers returns all members (user info) of a study group
func (r *Repository) GetGroupMembers(ctx context.Context, groupID int) ([]MemberResponse, error) {
	query := `
		SELECT u.id, u.name, u.email
		FROM users u
		JOIN study_group_members sgm ON u.id = sgm.user_id
		WHERE sgm.study_group_id = $1
		ORDER BY u.name ASC
	`

	rows, err := r.db.Query(ctx, query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []MemberResponse
	for rows.Next() {
		var m MemberResponse
		err = rows.Scan(&m.ID, &m.Name, &m.Email)
		if err != nil {
			return nil, err
		}
		members = append(members, m)
	}

	return members, nil
}

// GetMemberAssignmentStats returns the completed/missing assignment counts for a user.
// "Done" = completed, "To Do" or "Doing" = missing.
func (r *Repository) GetMemberAssignmentStats(ctx context.Context, userID int) (*AssignmentStats, error) {
	query := `
		SELECT
			COALESCE(SUM(CASE WHEN completion_status = 'Done' THEN 1 ELSE 0 END), 0) AS completed_count,
			COALESCE(SUM(CASE WHEN completion_status IN ('To Do', 'Doing') THEN 1 ELSE 0 END), 0) AS missing_count
		FROM assignments
		WHERE user_id = $1
	`

	var stats AssignmentStats
	err := r.db.QueryRow(ctx, query, userID).Scan(&stats.CompletedCount, &stats.MissingCount)
	if err != nil {
		return nil, err
	}

	return &stats, nil
}
