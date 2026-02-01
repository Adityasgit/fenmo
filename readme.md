# Expense Tracker – Full Stack Assignment
https://fenmo-zobc.onrender.com/
A minimal, production-oriented **Expense Tracker** built as part of a technical assignment.
The application allows users to record, view, filter, and analyze personal expenses while
handling realistic conditions such as refreshes, retries, and unreliable networks.

## 🧱 Tech Stack

**Frontend**
- Next.js (App Router)
- React (JavaScript)
- Tailwind CSS

**Backend**
- Next.js API Routes
- SQLite (better-sqlite3)

---

## 🗄️ Data Model

Each expense includes:
- id (UUID)
- amount (number)
- category (string)
- description (string)
- date (YYYY-MM-DD)
- created_at (ISO timestamp)

---

## 📡 API Endpoints

### GET /api/expenses
Supports query params:
- sort=date_asc | date_desc
- category=CategoryName
- date=today | 7d | 30d

### POST /api/expenses
Creates a new expense with validation.

### DELETE /api/expenses
Deletes an expense by id.

---

## 🧠 Design Decisions

- SQLite chosen for simplicity and persistence across refreshes
- Server-side filtering and sorting for correctness
- URL-based state for filters and sorting
- Trade-offs made consciously to fit assignment scope

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 👤 Author

Aditya Arora  
Email: aditya.arora.works@gmail.com
