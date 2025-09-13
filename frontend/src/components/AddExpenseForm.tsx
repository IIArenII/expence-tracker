import { useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;
// Fixed category options
const categories = [
  "Grocery",
  "Clothes",
  "Personal",
  "Bills",
  "Transport",
  "Health",
  "Education",
  "Entertainment",
  "Travel",
  "Rent",
  "Utilities",
  "Dining Out",
  "Subscriptions",
  "Savings",
  "Other",
];

export default function AddExpenseForm({
  onAdd,
}: {
  onAdd: (newExpense: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]); // default first option

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, amount: Number(amount), category }),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      const newExpense = await res.json();

      // Optimistic UI update
      onAdd(newExpense);

      // Clear form
      setTitle("");
      setAmount("");
      setCategory(categories[0]); // reset to first category
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row gap-4 mb-6"
    >
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full sm:w-32 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition w-full sm:w-auto"
      >
        Add Expense
      </button>
    </form>
  );
}
