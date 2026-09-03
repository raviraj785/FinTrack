import { useState } from "react";

function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "fintrack_token",
        data.token
      );

      // Save logged-in user
      localStorage.setItem(
        "fintrack_user",
        JSON.stringify(data.user)
      );

      // Save login status
      localStorage.setItem(
        "fintrack_logged_in",
        "true"
      );

      // Go to Dashboard
      onLogin();

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-box">
            💳
          </div>

          <h1>FinTrack</h1>
        </div>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to manage your finances
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?

          <button
            type="button"
            onClick={onSignup}
          >
            Sign Up
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;