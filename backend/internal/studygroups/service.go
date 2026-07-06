package studygroups

import "context"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateGroupWithAdmin(ctx context.Context, req *StudyGroupInput, adminID int) (*StudyGroup, error) {
	return s.repo.CreateGroupWithAdmin(ctx, req, adminID)
}

func (s *Service) GetGroupByID(ctx context.Context, groupID int) (*StudyGroup, error) {
	return s.repo.GetGroupByID(ctx, groupID)
}

func (s *Service) GetGroupsByUser(ctx context.Context, userID int) ([]StudyGroup, error) {
	return s.repo.GetGroupsByUser(ctx, userID)
}

// IsUserMemberOfGroup checks whether a user belongs to a study group
func (s *Service) IsUserMemberOfGroup(ctx context.Context, groupID int, userID int) (bool, error) {
	return s.repo.IsUserMemberOfGroup(ctx, groupID, userID)
}

// GetGroupDetail returns the full study group detail including members with assignment stats.
// It fetches group info, then all members, and enriches each member with their assignment stats.
func (s *Service) GetGroupDetail(ctx context.Context, groupID int) (*StudyGroupDetailResponse, error) {
	group, err := s.repo.GetGroupByID(ctx, groupID)
	if err != nil {
		return nil, err
	}

	members, err := s.repo.GetGroupMembers(ctx, groupID)
	if err != nil {
		return nil, err
	}

	// Enrich each member with their assignment stats
	for i := range members {
		stats, err := s.repo.GetMemberAssignmentStats(ctx, members[i].ID)
		if err != nil {
			return nil, err
		}
		members[i].CompletedCount = stats.CompletedCount
		members[i].MissingCount = stats.MissingCount
	}

	return &StudyGroupDetailResponse{
		ID:          group.ID,
		Name:        group.Name,
		Description: group.Description,
		CreatedAt:   group.CreatedAt,
		AdminID:     group.AdminID,
		Members:     members,
	}, nil
}
