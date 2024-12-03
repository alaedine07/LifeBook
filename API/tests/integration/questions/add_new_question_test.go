package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"API/internal/models"
)

func QuestionsCrudTest(t *testing.T) {
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

		t.Run("Fetch Created Question", func(t *testing.T) {
			fmt.Println(createdQuestion)
			fetchResp, err := http.Get(fmt.Sprintf("http://localhost:8080/questions/%s", createdQuestion.ID))
			if err != nil {
				t.Fatalf("Failed to fetch question: %v", err)
			}
			defer fetchResp.Body.Close()

			// Check response status code
			if fetchResp.StatusCode != http.StatusOK {
				t.Errorf("Expected status code %d, got %d", http.StatusOK, fetchResp.StatusCode)
			}

			// Decode fetched question
			var fetchedQuestion models.Question
			err = json.NewDecoder(fetchResp.Body).Decode(&fetchedQuestion)
			if err != nil {
				t.Fatalf("Failed to decode fetched question: %v", err)
			}

			// Validate fetched question
			if fetchedQuestion.ID != createdQuestion.ID {
				t.Errorf("Expected ID %s, got %s", createdQuestion.ID, fetchedQuestion.ID)
			}
			if fetchedQuestion.Question != question.Question {
				t.Errorf("Expected question text '%s', got '%s'", question.Question, fetchedQuestion.Question)
			}
		})

		t.Run("Update Question", func(t *testing.T) {
			// Prepare updated question data
			updatedQuestion := models.Question{
				ID:       createdQuestion.ID,
				Question: "updated question text",
			}

			// Convert updated question to JSON
			updatedJsonData, err := json.Marshal(updatedQuestion)
			if err != nil {
				t.Fatalf("Failed to marshal updated JSON: %v", err)
			}

			// Create PUT request
			req, err := http.NewRequest(
				"PUT",
				fmt.Sprintf("http://localhost:8080/questions/%s", createdQuestion.ID),
				bytes.NewBuffer(updatedJsonData),
			)
			if err != nil {
				t.Fatalf("Failed to create PUT request: %v", err)
			}
			req.Header.Set("Content-Type", "application/json")

			// Send PUT request
			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				t.Fatalf("Failed to send PUT request: %v", err)
			}
			defer resp.Body.Close()

			// Check response status code
			if resp.StatusCode != http.StatusOK {
				t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
			}

			// Decode updated question response
			var returnedQuestion models.Question
			err = json.NewDecoder(resp.Body).Decode(&returnedQuestion)
			if err != nil {
				t.Fatalf("Failed to decode updated question: %v", err)
			}

			// Validate updated question
			if returnedQuestion.Question != updatedQuestion.Question {
				t.Errorf("Expected updated question text '%s', got '%s'", updatedQuestion.Question, returnedQuestion.Question)
			}
		})

		t.Run("Delete Question", func(t *testing.T) {
			// Create DELETE request
			fmt.Println("created question id", createdQuestion.ID)
			req, err := http.NewRequest(
				"DELETE",
				fmt.Sprintf("http://localhost:8080/questions/%s", createdQuestion.ID),
				nil,
			)
			if err != nil {
				t.Fatalf("Failed to create DELETE request: %v", err)
			}

			// Send DELETE request
			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				t.Fatalf("Failed to send DELETE request: %v", err)
			}
			defer resp.Body.Close()

			// Check response status code
			if resp.StatusCode != http.StatusNoContent {
				t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
			}

			// Verify question is deleted by trying to fetch it
			fetchResp, err := http.Get(fmt.Sprintf("http://localhost:8080/questions/%s", createdQuestion.ID))
			if err != nil {
				t.Fatalf("Failed to fetch deleted question: %v", err)
			}
			defer fetchResp.Body.Close()

			// Expect a 404 Not Found status
			if fetchResp.StatusCode != http.StatusNotFound {
				t.Errorf("Expected status code %d for deleted question, got %d", http.StatusNotFound, fetchResp.StatusCode)
			}
		})
	})

	t.Run("Add Invalid Question", func(t *testing.T) {
		// Test adding a question with empty text
		invalidQuestion := models.Question{
			Question: "",
		}

		jsonData, err := json.Marshal(invalidQuestion)
		if err != nil {
			t.Fatalf("Failed to marshal JSON: %v", err)
		}

		resp, err := http.Post("http://localhost:8080/questions", "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			t.Fatalf("Failed to send POST request: %v", err)
		}
		defer resp.Body.Close()

		// Expect a bad request status
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Expected status code %d for invalid question, got %d", http.StatusBadRequest, resp.StatusCode)
		}
	})

	t.Run("Update Non-Existent Question", func(t *testing.T) {
		// Try to update a question with a non-existent ID
		nonExistentQuestion := models.Question{
			ID:       "non-existent-id",
			Question: "Updated non-existent question",
		}

		jsonData, err := json.Marshal(nonExistentQuestion)
		if err != nil {
			t.Fatalf("Failed to marshal JSON: %v", err)
		}

		req, err := http.NewRequest(
			"PUT",
			fmt.Sprintf("http://localhost:8080/questions/%s", nonExistentQuestion.ID),
			bytes.NewBuffer(jsonData),
		)
		if err != nil {
			t.Fatalf("Failed to create PUT request: %v", err)
		}
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("Failed to send PUT request: %v", err)
		}
		defer resp.Body.Close()

		// Expect a not found status
		if resp.StatusCode != http.StatusNotFound {
			t.Errorf("Expected status code %d for non-existent question, got %d", http.StatusNotFound, resp.StatusCode)
		}
	})
}
