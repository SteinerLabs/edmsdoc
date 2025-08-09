package domain

type Service struct {
	ID          string
	Name        string
	Description string

	Position Position

	CanPublish []Event
	CanReceive []Event

	ReactionRules []ReactionRule
}

type Event struct {
	ID          string
	Name        string
	Description string
	Color       string
}

type ReactionRule struct {
	ID            string
	Service       Service
	TriggerEvent  Event
	EmittedEvents []Event
}

type Position struct {
	X float64
	Y float64
}

type User struct {
	ID       string
	Email    string
	Password string
}
