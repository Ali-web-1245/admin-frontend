import { NavLink as Nav } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiDatabase,
  FiUsers,
  FiUser,
  FiPieChart,
  FiFileText,
  FiCreditCard,
  FiBarChart2,
  FiActivity,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "./sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: <FiHome size={19} /> },
  { to: "/products", label: "Products", icon: <FiBox size={19} /> },
  { to: "/orders", label: "Orders", icon: <FiShoppingCart size={19} /> },
  { to: "/data", label: "Data", icon: <FiDatabase size={19} /> },
  { to: "/users", label: "Users", icon: <FiUsers size={19} /> },
  { to: "/customers", label: "Customers", icon: <FiUser size={19} /> },
  { to: "/crm", label: "CRM", icon: <FiActivity size={19} /> },
  { to: "/blog", label: "Blog", icon: <FiFileText size={19} /> },
  { to: "/invoice", label: "Invoice", icon: <FiCreditCard size={19} /> },
  { to: "/charts", label: "Charts", icon: <FiBarChart2 size={19} /> },
  { to: "/statistics", label: "Statistics", icon: <FiPieChart size={19} /> },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-top">
          <span className="sidebar-logo">AdminPanel</span>
          <button
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Nav
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Nav>
          ))}
        </nav>

        <button
          className="sidebar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={18} />
        </button>
      </aside>
    </>
  );
}
