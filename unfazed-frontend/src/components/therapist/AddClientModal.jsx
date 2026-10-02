import { useState, useEffect } from "react";
import axios from "axios";

function CloseIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function AddClientModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [packageName, setPackageName] = useState("Standard Package");
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/packages");
        if (res.data?.packages && res.data.packages.length > 0) {
          setAvailablePackages(res.data.packages);
          setPackageName(res.data.packages[0].name);
        }
      } catch (err) {
        console.error("Failed to load packages in AddClientModal:", err);
      }
    };
    fetchAvailable();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in both name and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/clients", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        package: packageName
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add client. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="client-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2>Add New Client</h2>
            <p>Register a client into your directory and assign care packages.</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {error && <div className="modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="client-name">Full Name *</label>
            <input
              id="client-name"
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="client-email">Email Address *</label>
            <input
              id="client-email"
              type="email"
              placeholder="eleanor.vance@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="client-phone">Phone Number (optional)</label>
            <input
              id="client-phone"
              type="tel"
              placeholder="+1 (555) 234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="client-package">Care Package</label>
            <select
              id="client-package"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
            >
              {availablePackages.length > 0 ? (
                availablePackages.map((p) => (
                  <option key={p._id || p.name} value={p.name}>
                    {p.name} ({p.sessions} sessions - {p.currency || "₹"}{Number(p.price).toLocaleString()})
                  </option>
                ))
              ) : (
                <>
                  <option value="Standard Package">Standard Package (6 sessions)</option>
                  <option value="Starter Package">Starter Package (3 sessions)</option>
                  <option value="Extended Package">Extended Package (10 sessions)</option>
                  <option value="Single Session">Single Session (1 session)</option>
                </>
              )}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClientModal;
