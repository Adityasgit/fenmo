# Expense Tracker – Full Stack Assignment

A minimal, production-oriented **Expense Tracker** built as part of a technical assignment.  
The application allows users to record, view, filter, and analyze personal expenses while handling realistic conditions such as refreshes, retries, and unreliable networks.

---

## ✨ Features

### Core Functionality
- Add a new expense with:
  - Amount
  - Category
  - Description
  - Date
- View a list of expenses
- Sort expenses by date (newest / oldest first)
- Filter expenses by:
  - Category
  - Date range (Today, Last 7 days, Last 30 days)
- View total expenses and total transactions
- Group expenses by date
- View **Spending by Category** summary

### Real-World Considerations
- Data persists across page refreshes
- Server-side filtering and sorting
- Input validation on both frontend and backend
- Future dates are blocked for expenses
- URL-based filters & sorting (refresh-safe and shareable)

---

## 🧱 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React (JavaScript)**
- **Tailwind CSS**

### Backend
- **Next.js API Routes**
- **SQLite** (via `better-sqlite3`)

---

## 🗄️ Data Model

Each expense includes:
- `id` (UUID)
- `amount` (number)
- `category` (string)
- `description` (string)
- `date` (YYYY-MM-DD)
- `created_at` (ISO timestamp)

SQLite is used for persistence to ensure data survives refreshes and retries.

---

## 📡 API Endpoints

### `GET /api/expenses`
Returns a list of expenses.

**Query parameters supported:**
- `sort`: `date_asc` | `date_desc`
- `category`: filter by category
- `date`: `today` | `7d` | `30d`

Example:
