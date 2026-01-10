package assignments

import (
	"context"
	"time"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateAssignment(ctx context.Context, req AssignmentInput, userID int) (AssignmentResponse, error) {
	now := time.Now()
	a := Assignment{
		Title:            req.Title,
		Description:      req.Description,
		DueDate:          req.DueDate,
		CompletionStatus: ToDo,
		CreatedAt:        now,
		UserID:           userID,
	}

	id, err := s.repo.InsertAssignment(ctx, a)

	if err != nil {
		return AssignmentResponse{}, err
	}

	return AssignmentResponse{
		ID:               id,
		Title:            a.Title,
		Description:      a.Description,
		DueDate:          a.DueDate,
		CompletionStatus: a.CompletionStatus,
		CreatedAt:        a.CreatedAt,
	}, nil
}

func (s *Service) GetAssignments(ctx context.Context, userID int) ([]AssignmentResponse, error) {
	assignments, err := s.repo.getAssignments(ctx, userID)
	if err != nil {
		return nil, err
	}

	var res []AssignmentResponse
	for _, a := range assignments {
		res = append(res, ToAssignmentResponse(a))
	}

	return res, nil
}
