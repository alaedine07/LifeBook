package models

import "time"

// DayEntry represents a user's daily reflection
type DayEntry struct {
	ID        string             `json:"id"`
	Date      time.Time          `json:"date"`
	Responses []QuestionResponse `json:"responses"`
}

// QuestionResponse represents an answer to a specific question for a day
type QuestionResponse struct {
	QuestionID string `json:"question_id"`
	Answer     string `json:"answer"`
}
