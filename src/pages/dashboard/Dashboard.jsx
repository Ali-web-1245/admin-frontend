import { useEffect, useState } from "react";
import {
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import { getData } from "../../services/api.js";
import "./dashboard.css";

const CARDS = [
  { key: "totalProducts", label: "Total Products", icon: <FiBox size={22} /> },
  { key: "totalOrders", label: "Total Orders", icon: <FiShoppingCart size={22} /> },
  { key: "totalRevenue", label: "Total Revenue", icon: <FiDollarSign size={22} />, money: true },
  { key: "totalCustomers", label: "Total Customers", icon: <FiUsers size={22} /> },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getData("/api/admin/stats");
        setStats(data || {});
      } catch (err) {
        setError(err.response?.data?.message || "Stats load nahi hue");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page">
      <h1 className="dashboard-title">Dashboard</h1>

      {loading && <div className="spinner" />}
      {!loading && error && <div className="card page-state">{error}</div>}

      {!loading && !error && (
        <>
          <div className="dashboard-cards">
            {CARDS.map((card) => (
              <div className="stat-card" key={card.key}>
                <div className="stat-icon">{card.icon}</div>
                <div>
                  <p className="stat-value">
                    {card.money && stats[card.key] !== undefined
                      ? `$${Number(stats[card.key] || 0).toFixed(2)}`
                      : (stats?.[card.key] ?? 0)}
                  </p>
                  <span className="stat-label">{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="card-title">
              <FiClock size={17} className="recent-icon" /> Recent Orders
            </h2>

            {(stats?.recentOrders?.length || 0) === 0 ? (
              <div className="page-state">Abhi koi recent order nahi hai.</div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o) => (
                      <tr key={o._id}>
                        <td className="td-id">
                          #{o._id.slice(-6).toUpperCase()}
                        </td>
                        <td>{o.customerInfo?.name || "—"}</td>
                        <td>{(o.items || []).length}</td>
                        <td>
                          ${Number(o.totalAmount || o.total || 0).toFixed(2)}
                        </td>
                        <td>
                          <span className={`badge badge-${o.status}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
