import { useState } from "react";
import API from "../services/api";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      return setError("Please enter email and password");
    }

    try {
      setLoading(true);
      setError("");
      const res = await API.post("/auth/login", { email, password });
      // Save token + user
      localStorage.setItem("user", JSON.stringify(res.data));

      window.location = "/chat";
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
