import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
} from "react-icons/fi";
import api, { getData } from "../../services/api.js";
import "./products.css";

const EMPTY_FORM = {
  title: "",
  price: "",
  oldPrice: "",
  discount: "",
  rating: "",
  image: "",
  category: "",
  stock: "",
  description: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getData("/api/products", { params: { limit: 100 } });
      setProducts(Array.isArray(data) ? data : (data?.products || []));
    } catch (err) {
      setError(err.response?.data?.message || "Products load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      title: product.title || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      discount: product.discount ?? "",
      rating: product.rating ?? "",
      image: product.image || "",
      category: product.category || "",
      stock: product.stock ?? "",
      description: product.description || "",
    });
    setEditingId(product._id);
    setFormError("");
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      title: form.title,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice === "" ? undefined : Number(form.oldPrice),
      discount: form.discount === "" ? undefined : Number(form.discount),
      rating: form.rating === "" ? undefined : Number(form.rating),
      image: form.image,
      category: form.category,
      stock: form.stock === "" ? undefined : Number(form.stock),
      description: form.description,
    };

    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload);
      } else {
        await api.post("/api/products", payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save nahi hua");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteId(null);
    try {
      await api.delete(`/api/products/${deleteId}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Delete nahi hua");
    }
  };

  return (
    <div className="page">
      <div className="products-head">
        <h1 className="products-title">Products</h1>
        <div className="products-actions">
          <div className="products-search">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search title/category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn" onClick={openAddModal}>
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      {loading && <div className="spinner" />}
      {!loading && error && <div className="card page-state">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="card page-state">
          {search ? "Koi product match nahi hua." : "Abhi koi product nahi hai. 'Add Product' se pehla product add karein."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        className="table-thumb"
                        src={p.image}
                        alt={p.title}
                      />
                    </td>
                    <td className="td-title">{p.title}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td><span className="pill">{p.category || "—"}</span></td>
                    <td>
                      <span
                        className={`stock ${Number(p.stock) === 0 ? "out" : Number(p.stock) < 10 ? "low" : ""}`}
                      >
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-btn"
                          onClick={() => openEditModal(p)}
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          className="icon-btn danger"
                          onClick={() => setDeleteId(p._id)}
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="modal-head">
              <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX size={17} />
              </button>
            </div>

            {formError && <div className="form-error">{formError}</div>}

            <div className="form-grid">
              <label className="form-field span-2">
                <span>Title *</span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Price ($) *</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Old Price ($)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Discount (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Rating (0-5)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Category</span>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Casual"
                />
              </label>

              <label className="form-field">
                <span>Stock</span>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field span-2">
                <span>Image (URL) *</span>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </label>

              <label className="form-field span-2">
                <span>Description</span>
                <textarea
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div
            className="modal modal-small"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-head-title">Delete product?</h2>
            <p className="modal-text">
              Yeh product permanently delete ho jayega. Aap sure hain?
            </p>
            <div className="modal-foot">
              <button
                className="btn btn-outline"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
