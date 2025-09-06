import { useState } from "react";

const API_URL = "http://localhost:5000/api/expenses";

export default function AddExpenseForm({
  onAdd,
}: {
  onAdd: (newExpense: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

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
        body: JSON.stringify({ title, amount, category }),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      const newExpense = await res.json();

      // Optimistic UI update
      onAdd(newExpense);

      // Clear form
      setTitle("");
      setAmount("");
      setCategory("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row gap-4 mb-6"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full sm:w-32 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition"
      >
        Add Expense
      </button>
    </form>
  );
}
