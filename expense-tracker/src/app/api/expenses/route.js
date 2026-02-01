import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * GET /api/expenses
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const sort = searchParams.get("sort") || "date_desc";
  const category = searchParams.get("category");
  const dateFilter = searchParams.get("date");

  // ----- SORT (whitelisted) -----
  let orderBy = "date DESC, created_at DESC";
  if (sort === "date_asc") {
    orderBy = "date ASC, created_at ASC";
  }

  // ----- FILTERS -----
  const whereClauses = [];
  const values = [];

  // Category filter
  if (category) {
    whereClauses.push("category = ?");
    values.push(category);
  }

  // Date filter
  if (dateFilter) {
    const today = new Date();
    let fromDate = null;

    if (dateFilter === "today") {
      fromDate = today.toISOString().split("T")[0];
    }

    if (dateFilter === "7d") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      fromDate = d.toISOString().split("T")[0];
    }

    if (dateFilter === "30d") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      fromDate = d.toISOString().split("T")[0];
    }

    if (fromDate) {
      whereClauses.push("date >= ?");
      values.push(fromDate);
    }
  }

  // ----- BUILD QUERY -----
  const whereSQL =
    whereClauses.length > 0
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

  const expenses = db
    .prepare(`
      SELECT *
      FROM expenses
      ${whereSQL}
      ORDER BY ${orderBy}
    `)
    .all(...values);

  return NextResponse.json(expenses);
}


/**
 * POST /api/expenses
 */
export async function POST(req) {
  const body = await req.json();
  const { amount, category, description, date } = body;

  if (!amount || amount <= 0 || !category || !description || !date) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const expense = {
    id: crypto.randomUUID(),
    amount: Number(amount),
    category,
    description,
    date,
    created_at: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO expenses (
      id,
      amount,
      category,
      description,
      date,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    expense.id,
    expense.amount,
    expense.category,
    expense.description,
    expense.date,
    expense.created_at
  );

  return NextResponse.json(expense, { status: 201 });
}

/**
 * DELETE /api/expenses
 */
export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

  db.prepare(`DELETE FROM expenses WHERE id = ?`).run(id);

  return NextResponse.json({ success: true });
}
