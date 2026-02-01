import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * GET /api/expenses
 */
export async function GET() {
  const expenses = db
    .prepare(`
      SELECT *
      FROM expenses
      ORDER BY date DESC, created_at DESC
    `)
    .all();

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
