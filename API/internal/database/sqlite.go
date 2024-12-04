package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

// Database manages the SQLite database connection
type Database struct {
	Conn *sql.DB
}

// New creates and initializes a new database connection
func New() *Database {
	// Ensure the directory exists
	os.MkdirAll("./data", os.ModePerm)

	// Open SQLite database
	db, err := sql.Open("sqlite3", "./data/life_book_local.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Create questions table if not exists
	createQuestionsTableSQL := `
	CREATE TABLE IF NOT EXISTS questions (
		id TEXT PRIMARY KEY,
		question TEXT NOT NULL
	);`

	// Create day_entries table if not exists
	createDayEntriesTableSQL := `
	CREATE TABLE IF NOT EXISTS day_entries (
		id TEXT PRIMARY KEY,
		date TEXT NOT NULL UNIQUE
	);`

	// Create question_responses table if not exists
	createResponsesTableSQL := `
	CREATE TABLE IF NOT EXISTS question_responses (
		id TEXT PRIMARY KEY,
		day_entry_id TEXT NOT NULL,
		question_id TEXT NOT NULL,
		answer TEXT NOT NULL,
		FOREIGN KEY(day_entry_id) REFERENCES day_entries(id),
		FOREIGN KEY(question_id) REFERENCES questions(id)
	);`

	// Execute table creation statements
	_, err = db.Exec(createQuestionsTableSQL)
	if err != nil {
		log.Fatalf("Failed to create questions table: %v", err)
	}

	_, err = db.Exec(createDayEntriesTableSQL)
	if err != nil {
		log.Fatalf("Failed to create day_entries table: %v", err)
	}

	_, err = db.Exec(createResponsesTableSQL)
	if err != nil {
		log.Fatalf("Failed to create question_responses table: %v", err)
	}

	return &Database{Conn: db}
}

// Close closes the database connection
func (db *Database) Close() {
	if db.Conn != nil {
		db.Conn.Close()
	}
}
