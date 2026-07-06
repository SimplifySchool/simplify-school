package studygroups

import (
	"strconv"
	"strings"

	"github.com/SimplifySchool/simplify-school/backend/internal/users"
	"github.com/auth0/go-jwt-middleware/v3/validator"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service     *Service
	userService *users.Service
}

func NewHandler(service *Service, userService *users.Service) *Handler {
	return &Handler{
		service:     service,
		userService: userService,
	}
}

// getAuthenticatedUserID extracts the user's Auth0 ID from the JWT token and retrieves their database ID
func (h *Handler) getAuthenticatedUserID(c *fiber.Ctx) (int, error) {
	token, ok := c.Locals("claims").(*validator.ValidatedClaims)
	if !ok {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "User not found. Please sync your account first.")
	}

	auth0ID := token.RegisteredClaims.Subject
	if auth0ID == "" {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "Invalid token: missing subject")
	}

	user, err := h.userService.GetUserByAuth0ID(c.Context(), auth0ID)
	if err != nil {
		return 0, fiber.NewError(fiber.StatusNotFound, "User not found. Please sync your account first.")
	}

	return user.ID, nil
}

func (h *Handler) CreateGroup(c *fiber.Ctx) error {
	var req StudyGroupInput

	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid JSON")
	}

	if strings.TrimSpace(req.Name) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Name is required")
	}

	if strings.TrimSpace(req.Description) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Description is required")
	}

	userID, err := h.getAuthenticatedUserID(c)
	if err != nil {
		return err
	}

	res, err := h.service.CreateGroupWithAdmin(c.Context(), &req, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

// GetUserGroups returns all study groups the authenticated user belongs to
func (h *Handler) GetUserGroups(c *fiber.Ctx) error {
	userID, err := h.getAuthenticatedUserID(c)
	if err != nil {
		return err
	}

	groups, err := h.service.GetGroupsByUser(c.Context(), userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	// Return empty array instead of null when there are no groups
	if groups == nil {
		groups = []StudyGroup{}
	}

	var res []StudyGroupResponse
	for _, g := range groups {
		res = append(res, StudyGroupResponse{
			ID:          g.ID,
			Name:        g.Name,
			Description: g.Description,
			CreatedAt:   g.CreatedAt,
			AdminID:     g.AdminID,
		})
	}

	if res == nil {
		res = []StudyGroupResponse{}
	}

	return c.JSON(res)
}

// GetGroupDetail returns detailed info about a study group including members and their assignment stats.
// Only accessible to members of the group.
func (h *Handler) GetGroupDetail(c *fiber.Ctx) error {
	idParam := c.Params("id")
	groupID, err := strconv.Atoi(idParam)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid group ID")
	}

	userID, err := h.getAuthenticatedUserID(c)
	if err != nil {
		return err
	}

	// Membership validation: only members can view group details
	isMember, err := h.service.IsUserMemberOfGroup(c.Context(), groupID, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if !isMember {
		return fiber.NewError(fiber.StatusForbidden, "You are not a member of this study group")
	}

	detail, err := h.service.GetGroupDetail(c.Context(), groupID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.JSON(detail)
}
