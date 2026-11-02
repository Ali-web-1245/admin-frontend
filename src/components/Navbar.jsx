import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiSun, FiMoon, FiShield } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext.jsx";
import "./navbar.css";

export default function Navbar({ open, setOpen }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "null");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-menu"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <FiMenu size={20} />
        </button>
      </div>

      <div className="navbar-right">
        {adminInfo && (
          <div className="navbar-admin" title={adminInfo.email}>
            <FiShield size={16} />
            <span>{adminInfo.email}</span>
          </div>
        )}

        <button
          className="navbar-action"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <button className="navbar-logout" onClick={handleLogout}>
          <FiLogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
