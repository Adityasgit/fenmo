import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "expenses.db");

const db = new Database(dbPath);

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`).run();

export default db;
