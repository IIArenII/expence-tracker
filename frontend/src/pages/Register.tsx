import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // simple email format check (backend will validate again)
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Register
      const registerRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      // Login after registration
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) throw new Error("Login failed after registration");

      const { token } = await loginRes.json();
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("❌ Error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential?: string | null) => {
    if (!credential) {
      alert("Google login failed: no credential returned.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Google login failed");
      }

      const { token } = await res.json();
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-lg bg-white p-6 sm:p-8 shadow-md"
      >
        <h2 className="mb-6 text-center text-2xl sm:text-3xl font-semibold text-gray-700">
          Register
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full mb-3 rounded border border-gray-300 px-3 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
          required
          autoComplete="name"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-3 rounded border border-gray-300 px-3 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
          required
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-4 rounded border border-gray-300 px-3 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
          required
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Register"}
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => handleGoogleSuccess(cred.credential)}
            onError={() => alert("Google login failed")}
            useOneTap
          />
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline hover:text-indigo-800"
          >
            Login
          </Link>
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 w-full rounded border border-gray-300 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
        >
          Go Home
        </button>
      </form>
    </div>
  );
}
