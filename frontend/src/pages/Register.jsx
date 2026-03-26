import { useState } from "react";
import API from "../services/api";
import "./auth.css";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    if (!data.name || !data.email || !data.password) {
      return setError("All fields are required");
    }

    if (data.password !== data.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password
      });

      alert("Registered Successfully 🎉");
      window.location = "/";
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Name"
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={e => setData({ ...data, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={e => setData({ ...data, confirmPassword: e.target.value })}
          onKeyDown={e => e.key === "Enter" && register()}
        />

        <button onClick={register} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="switch">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}
