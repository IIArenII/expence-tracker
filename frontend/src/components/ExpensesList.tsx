import { useEffect, useState } from "react";
import AddExpenseForm from "./AddExpenseForm";

const API_URL = "http://localhost:5000/api/expenses";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Fetch expenses on component mount
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

  // --- 📌 Calculate totals ---
  const calculateTotal = (days: number) => {
    const now = new Date();
    return expenses
      .filter((expense) => {
        const expDate = new Date(expense.date); // make sure backend sends ISO date
        const diff = (now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= days;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

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

      {/* Totals Section */}
      <div className="flex justify-around mt-6 text-center">
        <div className="bg-green-100 px-4 py-2 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Last 7 Days</p>
          <p className="text-green-700 font-bold text-xl">${weeklyTotal}</p>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Last 30 Days</p>
          <p className="text-blue-700 font-bold text-xl">${monthlyTotal}</p>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mt-8 mb-4 text-center">
        Your Expenses
      </h1>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        <ul className="space-y-4">
          {expenses.map((expense) => (
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
