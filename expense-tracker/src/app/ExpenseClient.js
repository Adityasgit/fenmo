"use client";

import { useEffect, useState } from "react";
import {
  groupByDate,
  calculateTotal,
  spendingByCategory,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || "date_desc";

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food & Dining",
    description: "",
    date: "",
  });

  const getExpenses = async () => {
    const res = await fetch(`/api/expenses?${searchParams.toString()}`);
    const data = await res.json();
    setExpenses(data);
  };


  useEffect(() => {
    getExpenses();
  }, [searchParams.toString()]);

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
              min="0.01"
              step="0.01"
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
              max={new Date().toISOString().split("T")[0]}
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
        {/* filters for category, date */}

        <div className="bg-white rounded-xl shadow p-4 flex flex-wrap items-center gap-4">
          <span className="font-medium text-sm">Filter by:</span>

          {/* Category Filter */}
          <select
            value={searchParams.get("category") || "all"}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              const value = e.target.value;

              if (value === "all") {
                params.delete("category");
              } else {
                params.set("category", value);
              }

              router.push(`/?${params.toString()}`);
            }}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
          </select>

          {/* Date Filter */}
          <select
            value={searchParams.get("date") || "all"}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              const value = e.target.value;

              if (value === "all") {
                params.delete("date");
              } else {
                params.set("date", value);
              }

              router.push(`/?${params.toString()}`);
            }}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>


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

        {/* Recent Expenses (Grouped by Date) */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Expenses</h3>

            <select
              value={sort}
              onChange={(e) => {
                const value = e.target.value;
                router.push(`/?sort=${value}`);
              }}
              className="border rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="date_desc">Latest</option>
              <option value="date_asc">Earliest</option>
            </select>
          </div>

          {Object.keys(grouped).length === 0 && (
            <p className="text-slate-500 text-center py-8">
              No expenses yet
            </p>
          )}

          {Object.entries(grouped).map(([date, list]) => (
            <div key={date} className="mb-6">
              <div className="flex justify-between text-sm font-medium mb-3">
                <span>{new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}</span>
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
      {expenses?.length > 0 && <div className="col-span-12 space-y-6">
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
      </div>}
    </main>
  );
}
