package handlers

import (
	"encoding/json"
	"net/http"

	"API/internal/database"
	"API/internal/models"

	"github.com/gorilla/mux"
)

// QuestionHandler manages HTTP handlers for question operations
type QuestionHandler struct {
	DB *database.Database
}

// NewQuestionHandler creates a new QuestionHandler
func NewQuestionHandler(db *database.Database) *QuestionHandler {
	return &QuestionHandler{DB: db}
}

// AddQuestion handles adding a new question
func (h *QuestionHandler) AddQuestion(w http.ResponseWriter, r *http.Request) {
	var question models.Question

	// Decode request body
	err := json.NewDecoder(r.Body).Decode(&question)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if question.Question == "" {
		http.Error(w, "Question cannot be empty", http.StatusBadRequest)
		return
	}

	// Insert question into database
	insertSQL := `INSERT INTO questions (id, question) VALUES (?, ?)`
	_, err = h.DB.Conn.Exec(insertSQL, question.ID, question.Question)
	if err != nil {
		http.Error(w, "Failed to add question", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(question)
}

// GetQuestions retrieves all questions
func (h *QuestionHandler) GetQuestions(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Conn.Query("SELECT id, question FROM questions")
	if err != nil {
		http.Error(w, "Failed to retrieve questions", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var questions []models.Question
	for rows.Next() {
		var q models.Question
		if err := rows.Scan(&q.ID, &q.Question); err != nil {
			http.Error(w, "Error scanning questions", http.StatusInternalServerError)
			return
		}
		questions = append(questions, q)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(questions)
}

// UpdateQuestion updates an existing question
func (h *QuestionHandler) UpdateQuestion(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	questionID := vars["id"]

	var question models.Question
	err := json.NewDecoder(r.Body).Decode(&question)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Update question in database
	updateSQL := `UPDATE questions SET question = ? WHERE id = ?`
	result, err := h.DB.Conn.Exec(updateSQL, question.Question, questionID)
	if err != nil {
		http.Error(w, "Failed to update question", http.StatusInternalServerError)
		return
	}

	// Check if any rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Question not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(question)
}

// DeleteQuestion removes a question by ID
func (h *QuestionHandler) DeleteQuestion(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	questionID := vars["id"]

	// Delete question from database
	deleteSQL := `DELETE FROM questions WHERE id = ?`
	result, err := h.DB.Conn.Exec(deleteSQL, questionID)
	if err != nil {
		http.Error(w, "Failed to delete question", http.StatusInternalServerError)
		return
	}

	// Check if any rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Question not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
