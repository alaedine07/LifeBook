package models

// Question represents a daily reflection question
type Question struct {
	ID       string `json:"id"`
	Question string `json:"question"`
}
