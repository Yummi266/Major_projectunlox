import { useState } from "react";
import axios from "axios";

function CreatePackageModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [sessions, setSessions] = useState(6);
  const [duration, setDuration] = useState("50 min");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a package name.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!sessions || Number(sessions) <= 0) {
      setError("Please enter the number of sessions.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const featureList = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      await axios.post("http://localhost:5000/api/packages", {
        name: name.trim(),
        sessions: Number(sessions),
        duration: duration.trim() || "50 min",
        price: Number(price),
        currency: "₹",
        status,
        description: description.trim(),
        features: featureList
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error("Failed to create package:", err);
      setError(err.response?.data?.message || "Failed to create package.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="package-modal-overlay" onClick={onClose}>
      <div className="package-modal" onClick={(e) => e.stopPropagation()}>
        <div className="package-modal-header">
          <h3>Create New Session Package</h3>
          <button className="package-modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                placeholder="e.g., Deep Healing Intensive"
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
                  placeholder="e.g., 7500"
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
                  placeholder="e.g., 6"
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
                  placeholder="e.g., 50 min"
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
                placeholder="Brief summary of who this package is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="modal-form-group">
              <label>Key Features (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., 6 Video sessions, Clinical notes, Flexible rescheduling"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
          </div>

          <div className="package-modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePackageModal;
