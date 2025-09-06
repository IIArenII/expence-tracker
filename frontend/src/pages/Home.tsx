import { Link } from "react-router-dom";

interface HomeProps {
  token: string | null;
  logout: () => void;
}

export default function Home({ token, logout }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Expense Tracker</h1>

          <div className="flex items-center gap-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-800">
          Welcome to the Home Page
        </h2>

        {!token ? (
          <p className="text-gray-600 max-w-md">
            Please login or register to continue.
          </p>
        ) : (
          <p className="text-green-600 font-semibold max-w-md">
            You are logged in.
          </p>
        )}
      </main>
    </div>
  );
}
