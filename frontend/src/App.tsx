import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // NEW: to wait for validation

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      // Validate token with backend
      fetch(`${import.meta.env.VITE_API_URL}/api/users/validate`, {
        headers: { Authorization: `Bearer ${savedToken}` } // ✅ use savedToken
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then(() => {
          setToken(savedToken); // token is valid
        })
        .catch(() => {
          localStorage.removeItem("token"); // token invalid/expired
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (loading) {
    return <div>Loading...</div>; // show spinner/loader while checking
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home token={token} logout={logout} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard logout={logout} />
            </ProtectedRoute>
          }
        />
        {/* Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
