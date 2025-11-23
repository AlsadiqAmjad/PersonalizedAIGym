import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, setAuthToken } from "../../services/api";
import { LogIn, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      if (!response.success) {
        setError(response.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      const { user, tokens } = response.data;

      // Check if user is active
      if (!user.isActive) {
        setError("Your account is inactive. Please contact support.");
        setLoading(false);
        return;
      }

      // Store tokens and user info
      setAuthToken(tokens.accessToken);
      localStorage.setItem("userId", user._id || user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("username", `${user.firstName} ${user.lastName}`);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      // Redirect based on role
      if (user.role === "coach") {
        navigate("/coach");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/member/landingPage");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <LogIn className="w-8 h-8" />
            Login
          </h1>
          <p className="text-gray-400">Welcome back! Please sign in to your account</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="px-4 py-2 bg-gray-700 text-gray-100 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Demo: Use "password123" for test accounts</p>
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-900/30 text-red-300 rounded text-sm border border-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
