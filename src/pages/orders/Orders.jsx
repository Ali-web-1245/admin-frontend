import { useEffect, useMemo, useState } from "react";
import { FiEye, FiX } from "react-icons/fi";
import api, { getData } from "../../services/api.js";
import "./orders.css";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getData("/api/orders", { params: { limit: 100 } });
      setOrders(Array.isArray(data) ? data : (data?.orders || []));
    } catch (err) {
      setError(err.response?.data?.message || "Orders load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = async (order, status) => {
    setUpdatingId(order._id);
    try {
      await api.put(`/api/orders/${order._id}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update nahi hua");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="page">
      <div className="orders-head">
        <h1 className="orders-title">Orders</h1>
        <div className="orders-filter">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="spinner" />}
      {!loading && error && <div className="card page-state">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="card page-state">
          {statusFilter
            ? `No orders with status "${statusFilter}".`
            : "Abhi koi order nahi hai."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="card">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o._id}
                    className="order-row"
                    onClick={() => setDetail(o)}
                  >
                    <td className="td-id">#{o._id.slice(-6).toUpperCase()}</td>
                    <td>{o.customerInfo?.name || "—"}</td>
                    <td>{(o.items || []).length}</td>
                    <td>${Number(o.totalAmount || o.total || 0).toFixed(2)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`status-select status-${o.status}`}
                        value={o.status}
                        disabled={updatingId === o._id}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="icon-btn"
                        title="View details"
                        onClick={() => setDetail(o)}
                      >
                        <FiEye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div
            className="modal order-detail"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <h2>Order #{detail._id.slice(-6).toUpperCase()}</h2>
              <button
                className="icon-btn"
                onClick={() => setDetail(null)}
                title="Close"
              >
                <FiX size={17} />
              </button>
            </div>

            <div className="detail-section">
              <h3>Customer Info</h3>
              <div className="detail-grid">
                <div><span>Name</span><p>{detail.customerInfo?.name || "—"}</p></div>
                <div><span>Email</span><p>{detail.customerInfo?.email || "—"}</p></div>
                <div><span>Phone</span><p>{detail.customerInfo?.phone || "—"}</p></div>
                <div><span>Address</span><p>{detail.customerInfo?.address || "—"}</p></div>
                <div><span>Payment Method</span><p>{(detail.paymentMethod || "—").toUpperCase()}</p></div>
                <div><span>Date</span><p>{detail.createdAt ? new Date(detail.createdAt).toLocaleString() : "—"}</p></div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Items ({(detail.items || []).length})</h3>
              <ul className="detail-items">
                {(detail.items || []).map((item, idx) => (
                  <li key={idx}>
                    {item.image && (
                      <img src={item.image} alt={item.title} />
                    )}
                    <div>
                      <p>{item.title}</p>
                      <span>
                        {item.quantity} x ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                    <strong>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-total">
              <span>Total Amount</span>
              <strong>${Number(detail.totalAmount || detail.total || 0).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
