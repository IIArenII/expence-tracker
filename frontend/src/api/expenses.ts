const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;

// Get all expenses
export const getExpenses = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
};

// Add a new expense
export const addExpense = async (expense: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
};

// Delete an expense
export const deleteExpense = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
};

// Update an expense
export const updateExpense = async (id: string, updatedExpense: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedExpense),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
};
