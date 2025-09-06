import ExpensesList from "../components/ExpensesList";

interface DashboardProps {
  logout: () => void;
}

export default function Dashboard({ logout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={logout}
          className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Expenses Section */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 lg:p-8">
        <ExpensesList />
      </div>
    </div>
  );
}
