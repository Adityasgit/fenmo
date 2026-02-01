export function groupByDate(expenses) {
  return expenses.reduce((acc, expense) => {
    const date = expense.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(expense);
    return acc;
  }, {});
}

export function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function spendingByCategory(expenses) {
  return expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
}
