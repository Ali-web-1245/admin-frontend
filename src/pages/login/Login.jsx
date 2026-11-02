import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiShield, FiMail, FiLock, FiLogIn } from "react-icons/fi";
import api from "../../services/api.js";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/admin/login", {
        email: form.email,
        password: form.password,
      });

      const { admin, token } = res.data?.data || {};
      if (!token) {
        throw new Error(res.data?.message || "Login failed");
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminInfo", JSON.stringify(admin || {}));

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <span className="login-badge">
            <FiShield size={26} />
          </span>
          <h1>Admin Login</h1>
          <p>Dashboard access ke liye login karein</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <label className="login-field">
          <span><FiMail size={15} /> Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="login-field">
          <span><FiLock size={15} /> Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        <button className="login-btn" type="submit" disabled={loading}>
          <FiLogIn size={16} />
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
