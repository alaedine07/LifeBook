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
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS questions (
		id TEXT PRIMARY KEY,
		question TEXT NOT NULL
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}

	return &Database{Conn: db}
}

// Close closes the database connection
func (db *Database) Close() {
	if db.Conn != nil {
		db.Conn.Close()
	}
}
