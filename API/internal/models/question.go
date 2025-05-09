package models

// Question represents a daily reflection question
type Question struct {
	ID       string `json:"id"`
	Question string `json:"question"`
	CreatedAt time.Time `json:"created_at"` // Timestamp for when the question was created
    UpdatedAt time.Time `json:"updated_at"` // Timestamp for when the question was last updated
}
