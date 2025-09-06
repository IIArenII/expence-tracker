import { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';

interface AuthProps {
  setToken: (token: string) => void;
}

const Auth = ({ setToken }: AuthProps) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-10">
      {showLogin ? <Login setToken={setToken} /> : <Register />}
      <button
        className="mt-4 text-blue-600 underline"
        onClick={() => setShowLogin(!showLogin)}
      >
        {showLogin
          ? "Don't have an account? Register here"
          : "Already have an account? Login here"}
      </button>
    </div>
  );
};

export default Auth;
