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

function AddSessionModal({ onClose, onSuccess }) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [type, setType] = useState("Video");
  const [topic, setTopic] = useState("CBT & Anxiety Management");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("11:00 AM");
  const [endTime, setEndTime] = useState("11:50 AM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/clients");
        if (res.data?.clients && Array.isArray(res.data.clients)) {
          setClients(res.data.clients);
          if (res.data.clients.length > 0) {
            setSelectedClientId(res.data.clients[0]._id);
            setClientName(res.data.clients[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load clients list:", err);
      }
    };
    loadClients();
  }, []);

  const handleClientSelect = (e) => {
    const val = e.target.value;
    setSelectedClientId(val);
    const found = clients.find((c) => c._id === val);
    if (found) {
      setClientName(found.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalClientName = clientName.trim();
    if (!finalClientName) {
      setError("Please select or enter a client name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/appointments", {
        clientId: selectedClientId || null,
        clientName: finalClientName,
        type,
        topic: topic.trim(),
        date,
        startTime,
        endTime,
        isCompleted: false,
        status: "Upcoming"
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to schedule appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="note-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2>Schedule New Session</h2>
            <p>Book a therapy appointment with a registered client.</p>
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
          <div className="modal-row-grid">
            {}
            <div className="modal-field">
              <label htmlFor="session-client-select">Client *</label>
              {clients.length > 0 ? (
                <select
                  id="session-client-select"
                  value={selectedClientId}
                  onChange={handleClientSelect}
                  required
                >
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="session-client-select"
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              )}
            </div>

            {}
            <div className="modal-field">
              <label htmlFor="session-type-select">Session Medium</label>
              <select
                id="session-type-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Video">Video Session</option>
                <option value="Chat">Chat Session</option>
                <option value="In-Person">In-Person Consultation</option>
              </select>
            </div>
          </div>

          <div className="modal-row-grid">
            {}
            <div className="modal-field">
              <label htmlFor="session-start-time">Start Time</label>
              <input
                id="session-start-time"
                type="text"
                placeholder="e.g. 10:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            {}
            <div className="modal-field">
              <label htmlFor="session-end-time">End Time</label>
              <input
                id="session-end-time"
                type="text"
                placeholder="e.g. 10:50 AM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-row-grid">
            {}
            <div className="modal-field">
              <label htmlFor="session-date-picker">Date</label>
              <input
                id="session-date-picker"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {}
            <div className="modal-field">
              <label htmlFor="session-topic-input">Consultation Focus</label>
              <input
                id="session-topic-input"
                type="text"
                placeholder="e.g. Stress Regulation & Goal Setting"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
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
              {loading ? "Scheduling..." : "Schedule Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSessionModal;
