package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"API/internal/database"
	"API/internal/models"

	"github.com/gorilla/mux"
)

// DayEntryHandler manages HTTP handlers for day entry operations
type DayEntryHandler struct {
	DB *database.Database
}

func (h *DayEntryHandler) generateUniqueID() string {
	for {
		// Generate a random 5-digit number
		id := fmt.Sprintf("%05d", rand.Intn(100000))

		// Check if the ID already exists
		var exists bool
		err := h.DB.Conn.QueryRow("SELECT EXISTS(SELECT 1 FROM day_entries WHERE id = ?)", id).Scan(&exists)
		if err != nil {
			// If there's an error, log it but continue trying
			continue
		}

		// If the ID doesn't exist, return it
		if !exists {
			return id
		}
	}
}

// NewDayEntryHandler creates a new DayEntryHandler
func NewDayEntryHandler(db *database.Database) *DayEntryHandler {
	// Create a new random source and generator
	rand.NewSource(time.Now().UnixNano())
	return &DayEntryHandler{DB: db}
}

// AddDayEntry handles adding a new day entry
func (h *DayEntryHandler) AddDayEntry(w http.ResponseWriter, r *http.Request) {
	var dayEntry models.DayEntry

	// Decode request body
	err := json.NewDecoder(r.Body).Decode(&dayEntry)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Start a transaction
	tx, err := h.DB.Conn.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback() // Rollback in case of error

	// Generate a unique ID for the day entry
	dayEntry.ID = h.generateUniqueID()

	// Insert day entry
	insertDayEntrySQL := `INSERT INTO day_entries (id, date) VALUES (?, ?)`
	_, err = tx.Exec(insertDayEntrySQL, dayEntry.ID, dayEntry.Date.Format(time.RFC3339))
	if err != nil {
		http.Error(w, "Failed to add day entry", http.StatusInternalServerError)
		return
	}

	// Prepare statement for inserting responses
	insertResponseSQL := `
		INSERT INTO question_responses (id, day_entry_id, question_id, answer)
		VALUES (?, ?, ?, ?)
	`
	preparedStmt, err := tx.Prepare(insertResponseSQL)
	if err != nil {
		http.Error(w, "Failed to prepare response statement", http.StatusInternalServerError)
		return
	}
	defer preparedStmt.Close()

	// Insert each response
	for _, response := range dayEntry.Responses {
		// Generate a unique ID for each response
		responseID := fmt.Sprintf("%05d", rand.Intn(100000))

		// Verify the question exists
		var exists bool
		err := tx.QueryRow("SELECT EXISTS(SELECT 1 FROM questions WHERE id = ?)", response.QuestionID).Scan(&exists)
		if err != nil || !exists {
			http.Error(w, fmt.Sprintf("Invalid question ID: %s", response.QuestionID), http.StatusBadRequest)
			return
		}

		// Execute the prepared statement
		_, err = preparedStmt.Exec(responseID, dayEntry.ID, response.QuestionID, response.Answer)
		if err != nil {
			http.Error(w, "Failed to add response", http.StatusInternalServerError)
			return
		}
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(dayEntry)
}

// GetDayEntryByDate retrieves a day entry for a specific date
func (h *DayEntryHandler) GetDayEntryByDate(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	dateStr := vars["date"]

	// Parse the date
	date, err := time.Parse(time.RFC3339, dateStr)
	if err != nil {
		http.Error(w, "Invalid date format", http.StatusBadRequest)
		return
	}

	// Find the day entry
	var dayEntry models.DayEntry
	var dayEntryID string
	var storedDateStr string
	err = h.DB.Conn.QueryRow(`SELECT id, date FROM day_entries WHERE date = ?`, date.Format(time.RFC3339)).Scan(&dayEntryID, &storedDateStr)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "No entry found for this date", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to retrieve day entry", http.StatusInternalServerError)
		return
	}

	// Parse the stored date string
	parsedDate, err := time.Parse(time.RFC3339, storedDateStr)
	if err != nil {
		http.Error(w, "Failed to parse stored date", http.StatusInternalServerError)
		return
	}
	dayEntry.ID = dayEntryID
	dayEntry.Date = parsedDate

	// Retrieve responses for this day entry
	rows, err := h.DB.Conn.Query(`
		SELECT qr.question_id, q.question, qr.answer
		FROM question_responses qr
		JOIN questions q ON qr.question_id = q.id
		WHERE qr.day_entry_id = ?
	`, dayEntryID)
	if err != nil {
		http.Error(w, "Failed to retrieve responses", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var responses []models.QuestionResponse
	for rows.Next() {
		var response models.QuestionResponse
		var questionText string
		if err := rows.Scan(&response.QuestionID, &questionText, &response.Answer); err != nil {
			http.Error(w, "Error scanning responses", http.StatusInternalServerError)
			return
		}
		responses = append(responses, response)
	}

	dayEntry = models.DayEntry{
		ID:        dayEntryID,
		Date:      date,
		Responses: responses,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dayEntry)
}

// ListDayEntries retrieves all day entries
func (h *DayEntryHandler) ListDayEntries(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Conn.Query(`SELECT id, date FROM day_entries`)
	if err != nil {
		http.Error(w, "Failed to retrieve day entries", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var dayEntries []models.DayEntry
	for rows.Next() {
		var dayEntry models.DayEntry
		var dateString string
		if err := rows.Scan(&dayEntry.ID, &dateString); err != nil {
			fmt.Println(err)
			http.Error(w, "Error scanning day entries", http.StatusInternalServerError)
			return
		}

		// Parse the date string
		parsedDate, err := time.Parse(time.RFC3339, dateString)
		if err != nil {
			http.Error(w, "Error parsing date", http.StatusInternalServerError)
			return
		}
		dayEntry.Date = parsedDate

		// Retrieve responses for this day entry
		responseRows, err := h.DB.Conn.Query(`
			SELECT question_id, answer
			FROM question_responses
			WHERE day_entry_id = ?
		`, dayEntry.ID)
		if err != nil {
			http.Error(w, "Failed to retrieve responses", http.StatusInternalServerError)
			return
		}
		defer responseRows.Close()

		var responses []models.QuestionResponse
		for responseRows.Next() {
			var response models.QuestionResponse
			if err := responseRows.Scan(&response.QuestionID, &response.Answer); err != nil {
				http.Error(w, "Error scanning responses", http.StatusInternalServerError)
				return
			}
			responses = append(responses, response)
		}

		dayEntry.Responses = responses
		dayEntries = append(dayEntries, dayEntry)
	}

	if len(dayEntries) == 0 {
		dayEntries = []models.DayEntry{} // Explicitly create an empty slice
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dayEntries)
}

// GetDayEntryById retrieves a day entry by given id
func (h *DayEntryHandler) GetDayEntryById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	dayEntryId := vars["id"]

	// Find the day entry
	var dayEntry models.DayEntry
	var dayEntryID string
	var storedDateStr string
	err := h.DB.Conn.QueryRow(`SELECT id, date FROM day_entries WHERE id = ?`, dayEntryId).Scan(&dayEntryID, &storedDateStr)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "No entry found for this id", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to retrieve day entry", http.StatusInternalServerError)
		return
	}

	// Parse the stored date string
	parsedDate, err := time.Parse(time.RFC3339, storedDateStr)
	if err != nil {
		http.Error(w, "Failed to parse stored date", http.StatusInternalServerError)
		return
	}
	dayEntry.ID = dayEntryID
	dayEntry.Date = parsedDate

	// Retrieve responses for this day entry
	rows, err := h.DB.Conn.Query(`
		SELECT qr.question_id, q.question, qr.answer
		FROM question_responses qr
		JOIN questions q ON qr.question_id = q.id
		WHERE qr.day_entry_id = ?
	`, dayEntryID)
	if err != nil {
		http.Error(w, "Failed to retrieve responses", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var responses []models.QuestionResponse
	for rows.Next() {
		var response models.QuestionResponse
		var questionText string
		if err := rows.Scan(&response.QuestionID, &questionText, &response.Answer); err != nil {
			http.Error(w, "Error scanning responses", http.StatusInternalServerError)
			return
		}
		responses = append(responses, response)
	}

	dayEntry = models.DayEntry{
		ID:        dayEntryID,
		Date:      dayEntry.Date,
		Responses: responses,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dayEntry)
}
