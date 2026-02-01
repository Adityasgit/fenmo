"use client";

import { useEffect, useState } from "react";
import {
  groupByDate,
  calculateTotal,
  spendingByCategory,
} from "@/lib/utils";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food & Dining",
    description: "",
    date: "",
  });

  const getExpenses = async () => {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const submitExpense = async (e) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({
      amount: "",
      category: "Food & Dining",
      description: "",
      date: "",
    });

    await getExpenses();
    setLoading(false);
  };

  const deleteExpense = async (id) => {
    await fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    getExpenses();
  };

  const total = calculateTotal(expenses);
  const grouped = groupByDate(expenses);
  const categoryTotals = spendingByCategory(expenses);
  const maxCategoryValue = Math.max(...Object.values(categoryTotals), 1);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 grid grid-cols-12 gap-6 max-w-7xl mx-auto">

      {/* Add Expense */}
      <div className="col-span-12 md:col-span-4 ">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <p className="text-slate-500 mt-2">Track and manage your expenses easily.</p>
          {/* beautful hr */}
          <hr className="my-4 border-slate-200" />

        <div className="mt-4 text-sm text-slate-400">
          Developed by Aditya Arora | <a href="mailto:aditya.arora.works@gmail.com" className="underline">Contact Me</a>
        </div>
        {/* github repo */}
        <div className="mt-2 text-sm text-slate-400">
          <a href="https://github.com/Adityasgit/fenmo" className="underline">GitHub Repository</a>
          </div>
    </div>
        <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-6">＋ Add Expense</h2>

        <form onSubmit={submitExpense} className="space-y-4">
          <input
            type="number"
            placeholder="₹ 0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          >
            <option>Food & Dining</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Utilities</option>
          </select>

          <input
            type="text"
            placeholder="What did you spend on?"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-12 md:col-span-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">Total Expenses</p>
            <p className="text-2xl font-bold">₹{total.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-sm text-slate-500">Total Transactions</p>
            <p className="text-2xl font-bold">{expenses.length}</p>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Spending by Category</h3>

          {Object.entries(categoryTotals).map(([cat, value]) => (
            <div key={cat} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{cat}</span>
                <span>₹{value.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-slate-200 rounded">
                <div
                  className="h-2 bg-indigo-600 rounded"
                  style={{ width: `${(value / maxCategoryValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Expenses (Grouped by Date) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Recent Expenses</h3>

          {Object.keys(grouped).length === 0 && (
            <p className="text-slate-500 text-center py-8">
              No expenses yet
            </p>
          )}

          {Object.entries(grouped).map(([date, list]) => (
            <div key={date} className="mb-6">
              <div className="flex justify-between text-sm font-medium mb-3">
                <span>{date}</span>
                <span>
                  ₹
                  {list.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </span>
              </div>

              {list.map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between items-center bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-2"
                >
                  <div>
                    <p className="font-medium">{e.description}</p>
                    <p className="text-sm text-orange-600">{e.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">₹{e.amount.toFixed(2)}</p>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="text-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
