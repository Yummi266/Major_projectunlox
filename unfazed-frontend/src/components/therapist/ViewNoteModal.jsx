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

function ViewNoteModal({ note, onClose, onDelete }) {
  if (!note) return null;

  const initials = note.clientName
    ? note.clientName
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CL";

  const formattedDate = note.sessionDate
    ? new Date(note.sessionDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "—";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="note-modal-card view-note-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="note-view-header-profile">
            <div className="note-avatar large">{initials}</div>
            <div>
              <h2>{note.clientName}</h2>
              <div className="note-view-subhead">
                <span className="note-session-pill">{note.sessionNumber}</span>
                <span className="note-date-text">{formattedDate}</span>
                <span
                  className={`note-status ${
                    note.status === "Draft" ? "draft" : "completed"
                  }`}
                >
                  {note.status}
                </span>
              </div>
            </div>
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

        <div className="note-view-body">
          <label className="note-section-label">Session Notes & Clinical Log</label>
          <div className="note-content-display">{note.content}</div>

          {note.tags && note.tags.length > 0 && (
            <div className="note-tags-wrap">
              <span className="note-tags-title">Tags:</span>
              <div className="note-tags-list">
                {note.tags.map((t, idx) => (
                  <span key={idx} className="note-tag-pill">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions space-between">
          {onDelete && (
            <button
              type="button"
              className="note-delete-action-btn"
              onClick={() => onDelete(note._id, note.clientName)}
            >
              Delete Note
            </button>
          )}

          <button
            type="button"
            className="modal-btn-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewNoteModal;
