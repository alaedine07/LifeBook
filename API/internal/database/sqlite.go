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
		question TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	// Create day_entries table if not exists
	createDayEntriesTableSQL := `
	CREATE TABLE IF NOT EXISTS day_entries (
		id TEXT PRIMARY KEY,
		date TEXT NOT NULL UNIQUE,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	// Create question_responses table if not exists
	createResponsesTableSQL := `
	CREATE TABLE IF NOT EXISTS question_responses (
		id TEXT PRIMARY KEY,
		day_entry_id TEXT NOT NULL,
		question_id TEXT NOT NULL,
		answer TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(day_entry_id) REFERENCES day_entries(id) ON DELETE CASCADE,
		FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE
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

	// Add indexes for foreign keys in question_responses
	createIndexDayEntryIDSQL := `
	CREATE INDEX IF NOT EXISTS idx_question_responses_day_entry_id
	ON question_responses(day_entry_id);`

	createIndexQuestionIDSQL := `
	CREATE INDEX IF NOT EXISTS idx_question_responses_question_id
	ON question_responses(question_id);`

	// Execute index creation statements
	_, err = db.Exec(createIndexDayEntryIDSQL)
	if err != nil {
		log.Fatalf("Failed to create index on day_entry_id: %v", err)
	}

	_, err = db.Exec(createIndexQuestionIDSQL)
	if err != nil {
		log.Fatalf("Failed to create index on question_id: %v", err)
	}

	// create triggers
	// Trigger to update `updated_at` in questions table
	createQuestionsTriggerSQL := `
	CREATE TRIGGER IF NOT EXISTS trigger_update_questions_updated_at
	AFTER UPDATE ON questions
	BEGIN
		UPDATE questions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
	END;`

	// Trigger to update `updated_at` in day_entries table
	createDayEntriesTriggerSQL := `
	CREATE TRIGGER IF NOT EXISTS trigger_update_day_entries_updated_at
	AFTER UPDATE ON day_entries
	BEGIN
		UPDATE day_entries SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
	END;`

	// Trigger to update `updated_at` in question_responses table
	createResponsesTriggerSQL := `
	CREATE TRIGGER IF NOT EXISTS trigger_update_question_responses_updated_at
	AFTER UPDATE ON question_responses
	BEGIN
		UPDATE question_responses SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
	END;`

	// Execute trigger creation statements
	_, err = db.Exec(createQuestionsTriggerSQL)
	if err != nil {
		log.Fatalf("Failed to create trigger for questions table: %v", err)
	}

	_, err = db.Exec(createDayEntriesTriggerSQL)
	if err != nil {
		log.Fatalf("Failed to create trigger for day_entries table: %v", err)
	}

	_, err = db.Exec(createResponsesTriggerSQL)
	if err != nil {
		log.Fatalf("Failed to create trigger for question_responses table: %v", err)
	}

	return &Database{Conn: db}
}

// Close closes the database connection
func (db *Database) Close() {
	if db.Conn != nil {
		db.Conn.Close()
	}
}
