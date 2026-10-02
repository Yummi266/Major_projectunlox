import { useState, useEffect } from "react";
import axios from "axios";

function EditPackageModal({ pkg, isOpen, onClose, onUpdated, onDeleted }) {
  const [name, setName] = useState("");
  const [sessions, setSessions] = useState(1);
  const [duration, setDuration] = useState("50 min");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pkg) {
      setName(pkg.name || "");
      setSessions(pkg.sessions || 1);
      setDuration(pkg.duration || "50 min");
      setPrice(pkg.price !== undefined ? pkg.price : "");
      setStatus(pkg.status || "Active");
      setDescription(pkg.description || "");
      setFeatures(Array.isArray(pkg.features) ? pkg.features.join(", ") : "");
      setError("");
    }
  }, [pkg]);

  if (!isOpen || !pkg) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a package name.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const featureList = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      await axios.put(`http://localhost:5000/api/packages/${pkg._id}`, {
        name: name.trim(),
        sessions: Number(sessions),
        duration: duration.trim() || "50 min",
        price: Number(price),
        status,
        description: description.trim(),
        features: featureList
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update package:", err);
      setError(err.response?.data?.message || "Failed to update package.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (pkg.clients > 0) {
      setError(`Cannot delete: ${pkg.clients} client(s) currently enrolled. Set status to 'Inactive' instead.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the package "${pkg.name}"?`)) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await axios.delete(`http://localhost:5000/api/packages/${pkg._id}`);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Failed to delete package:", err);
      setError(err.response?.data?.message || "Failed to delete package.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="package-modal-overlay" onClick={onClose}>
      <div className="package-modal" onClick={(e) => e.stopPropagation()}>
        <div className="package-modal-header">
          <h3>Edit Package: {pkg.name}</h3>
          <button className="package-modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="package-modal-body">
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#b91c1c",
                  fontSize: "12.5px",
                  marginBottom: "16px"
                }}
              >
                {error}
              </div>
            )}

            <div className="modal-form-group">
              <label>Package Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Total Sessions *</label>
                <input
                  type="number"
                  value={sessions}
                  onChange={(e) => setSessions(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label>Session Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="modal-form-group">
              <label>Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="modal-form-group">
              <label>Key Features (comma-separated)</label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
          </div>

          <div className="package-modal-footer">
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleting || saving}
            >
              {deleting ? "Deleting..." : "Delete Package"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving || deleting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving || deleting}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPackageModal;
