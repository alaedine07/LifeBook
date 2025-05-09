package models

import "time"

// DayEntry represents a user's daily reflection
type DayEntry struct {
	ID        string             `json:"id"`
	Date      time.Time          `json:"date"`
	Responses []QuestionResponse `json:"responses"`
	CreatedAt time.Time          `json:"created_at"` // Timestamp for when the entry was created
    UpdatedAt time.Time          `json:"updated_at"` // Timestamp for when the entry was last updated
}

// QuestionResponse represents an answer to a specific question for a day
type QuestionResponse struct {
	QuestionID string `json:"question_id"`
	Answer     string `json:"answer"`
	CreatedAt  time.Time `json:"created_at"` // Timestamp for when the response was created
    UpdatedAt  time.Time `json:"updated_at"` // Timestamp for when the response was last updated
}
