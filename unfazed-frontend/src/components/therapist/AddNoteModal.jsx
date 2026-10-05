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

function AddNoteModal({ onClose, onSuccess }) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [sessionNumber, setSessionNumber] = useState("Session 1");
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("Completed");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
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
        console.error("Failed to load clients list for note:", err);
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
    if (!content.trim()) {
      setError("Please enter the clinical note content.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tagList = tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      await axios.post("http://localhost:5000/api/notes", {
        clientId: selectedClientId || null,
        clientName: finalClientName,
        sessionNumber,
        sessionDate,
        content: content.trim(),
        status,
        tags: tagList
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create note. Please try again."
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
            <h2>Add Clinical Note</h2>
            <p>Document observations, assessment, and session progress.</p>
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
              <label htmlFor="note-client-select">Client *</label>
              {clients.length > 0 ? (
                <select
                  id="note-client-select"
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
                  id="note-client-select"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              )}
            </div>

            {}
            <div className="modal-field">
              <label htmlFor="note-session-number">Session</label>
              <input
                id="note-session-number"
                type="text"
                placeholder="e.g. Session 1, Follow-up"
                value={sessionNumber}
                onChange={(e) => setSessionNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-row-grid">
            {}
            <div className="modal-field">
              <label htmlFor="note-session-date">Date</label>
              <input
                id="note-session-date"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>

            {}
            <div className="modal-field">
              <label htmlFor="note-status-select">Status</label>
              <select
                id="note-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {}
          <div className="modal-field">
            <label htmlFor="note-content">Clinical Content & Observations *</label>
            <textarea
              id="note-content"
              rows={5}
              placeholder="Document client progress, themes discussed, behavioral observations, coping strategies introduced, and agreed action items..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {}
          <div className="modal-field">
            <label htmlFor="note-tags">Focus Tags (optional)</label>
            <input
              id="note-tags"
              type="text"
              placeholder="e.g. Anxiety, Coping Strategies, CBT (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
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
              {loading ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNoteModal;
