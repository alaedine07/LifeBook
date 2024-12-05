package main

import (
	"log"
	"net/http"

	"API/internal/database"
	"API/internal/handlers"
	"API/internal/middleware"

	"github.com/gorilla/mux"
)

func main() {
	// Initialize database
	db := database.New()
	defer db.Close()

	// Create question handler
	questionHandler := handlers.NewQuestionHandler(db)
	dayEntryHandler := handlers.NewDayEntryHandler(db)

	// Create router
	r := mux.NewRouter()

	// Apply CORS middleware
	r.Use(middleware.CORS)

	// Define routes
	r.HandleFunc("/questions", questionHandler.GetQuestions).Methods("GET")
	r.HandleFunc("/questions/{id}", questionHandler.GetQuestionById).Methods("GET")
	r.HandleFunc("/questions", questionHandler.AddQuestion).Methods("POST")
	r.HandleFunc("/questions/{id}", questionHandler.UpdateQuestion).Methods("PUT")
	r.HandleFunc("/questions/{id}", questionHandler.DeleteQuestion).Methods("DELETE")

	// Day entry routes
	r.HandleFunc("/day-entries", dayEntryHandler.AddDayEntry).Methods("POST")
	r.HandleFunc("/day-entries", dayEntryHandler.ListDayEntries).Methods("GET")
	r.HandleFunc("/day-entries/day/{date}", dayEntryHandler.GetDayEntryByDate).Methods("GET")
	r.HandleFunc("/day-entries/{id}", dayEntryHandler.GetDayEntryById).Methods("GET")

	// Start server
	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
