package domain

type CreateServiceRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Position    Position `json:"position"`
}

type CreateServiceResponse struct {
	ID string `json:"id"`
}

type CreateEventRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Color       string `json:"color"`
}

type CreateEventResponse struct {
	ID string `json:"id"`
}

type CreateReactionRuleRequest struct {
	ServiceID       string   `json:"service_id"`
	TriggerEventId  string   `json:"trigger_event_id"`
	EmittedEventIds []string `json:"emitted_event_ids"`
}

type CreateReactionRuleResponse struct {
	ID string `json:"id"`
}

type CreateUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateUserResponse struct {
	ID    string `json:"id"`
	Token string `json:"token"`
}
