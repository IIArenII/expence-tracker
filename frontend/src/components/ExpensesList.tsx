import { useEffect, useState } from "react";
import AddExpenseForm from "./AddExpenseForm";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;

const categories = [
  "Grocery", "Clothes", "Personal", "Bills", "Transport", "Health",
  "Education", "Entertainment", "Travel", "Rent", "Utilities",
  "Dining Out", "Subscriptions", "Savings", "Other",
];

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0",
  "#DC143C", "#FF69B4", "#20B2AA", "#FF4500", "#2E8B57",
  "#1E90FF", "#FFD700", "#FF1493", "#8B4513", "#4B0082"
];

const ExpensesList = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch expenses
  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Delete expense
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete expense");

      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered expenses for list and chart
  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  // Pie chart data
  const pieData = categories
    .map((cat) => ({
      category: cat,
      total: filteredExpenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((c) => c.total > 0);

  // --- Calculate totals for last 1, 7, 30 days ---
  const calculateTotal = (days: number) => {
    const now = new Date();
    return filteredExpenses
      .filter((expense) => {
        const expDate = new Date(expense.date);
        const diff = (now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= days;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const daylyTotal = calculateTotal(1);
  const weeklyTotal = calculateTotal(7);
  const monthlyTotal = calculateTotal(30);

  if (error)
    return <div className="text-red-500 text-center mt-6">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 sm:px-6">
      {/* Add Expense Form */}
      <AddExpenseForm
        onAdd={(newExpense: any) =>
          setExpenses((prev) => [newExpense, ...prev])
        }
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-full overflow-x-auto">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg shadow text-sm font-medium whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Totals Section */}
      <div className="flex flex-col sm:flex-row sm:justify-around gap-3 mt-4 text-center">
        <div className="bg-yellow-100 px-4 py-2 sm:px-6 sm:py-4 rounded-xl shadow flex-1">
          <p className="text-green-600 text-xs sm:text-sm font-medium">Last 1 Day</p>
          <p className="text-gray-700 font-bold text-lg sm:text-2xl mt-1">${daylyTotal}</p>
        </div>

        <div className="bg-green-100 px-4 py-2 sm:px-6 sm:py-4 rounded-xl shadow flex-1">
          <p className="text-gray-600 text-xs sm:text-sm font-medium">Last 7 Days</p>
          <p className="text-green-700 font-bold text-lg sm:text-2xl mt-1">${weeklyTotal}</p>
        </div>

        <div className="bg-blue-100 px-4 py-2 sm:px-6 sm:py-4 rounded-xl shadow flex-1">
          <p className="text-gray-600 text-xs sm:text-sm font-medium">Last 30 Days</p>
          <p className="text-blue-700 font-bold text-lg sm:text-2xl mt-1">${monthlyTotal}</p>
        </div>
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <div
          className="h-64 mt-6 outline-none focus:outline-none focus:ring-0"
          tabIndex={-1}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      )}

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No expenses found.</p>
      ) : (
        <ul className="space-y-4 mt-6">
          {filteredExpenses.map((expense) => (
            <li
              key={expense._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <div className="mb-2 sm:mb-0">
                <p className="font-semibold text-lg text-gray-800">{expense.title}</p>
                <p className="text-sm text-gray-500">{expense.category}</p>
              </div>

              <div className="flex justify-between sm:justify-end items-center gap-4">
                <p className="text-green-600 font-semibold text-lg">
                  ${expense.amount}
                </p>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpensesList;
