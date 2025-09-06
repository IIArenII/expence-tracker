import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

type LoginProps = {
  setToken: (token: string) => void;
};

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Normal email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  // Google login
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!response.ok) {
        alert("Google login failed");
        return;
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Something went wrong with Google login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-lg bg-white p-6 sm:p-8 shadow-md"
      >
        <h2 className="mb-6 text-center text-2xl sm:text-3xl font-semibold text-gray-700">
          Login
        </h2>

        {/* Email */}
        <label className="mb-2 block text-sm font-medium text-gray-600" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
          required
        />

        {/* Password */}
        <label className="mb-2 block text-sm font-medium text-gray-600" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded border border-gray-300 px-3 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition mb-4"
        >
          Login
        </button>

        {/* OR separator */}
        <div className="my-4 text-center text-gray-500">OR</div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google login failed")}
          />
        </div>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline hover:text-indigo-800">
            Register
          </Link>
        </p>

        {/* Go Home */}
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
};

export default Login;
