package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"API/internal/models"
)

func TestAddQuestion(t *testing.T) {
	// Test case for adding a new question
	t.Run("Add Valid Question", func(t *testing.T) {
		// Prepare the question data
		question := models.Question{
			Question: "how are you my friend",
		}

		// Convert question to JSON
		jsonData, err := json.Marshal(question)
		// json.Marshal is a mehod used to convert a struct to JSON
		// from the package /encoding.json
		if err != nil {
			t.Fatalf("Failed to marshal JSON: %v", err)
		}

		// Send POST request
		resp, err := http.Post("http://localhost:8080/questions", "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatalf("Failed to send POST request: %v", err)
		}

		// Ensure the response body is closed when the function exits
		defer resp.Body.Close()

		// Check response status code
		if resp.StatusCode != http.StatusCreated {
			t.Errorf("Expected status code %d, got %d", http.StatusCreated, resp.StatusCode)
		}

		// Decode response body
		var createdQuestion models.Question
		err = json.NewDecoder(resp.Body).Decode(&createdQuestion)
		if err != nil {
			t.Fatalf("Failed to decode response: %v", err)
		}

		// Validate response
		if createdQuestion.Question != question.Question {
			t.Errorf("Expected question text '%s', got '%s'", question.Question, createdQuestion.Question)
		}

		// Validate ID was generated
		if createdQuestion.ID == "" {
			t.Error("Expected non-empty ID, got empty string")
		}
	})
}
