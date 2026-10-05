import { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon } from "../common/Icons";
import ViewNoteModal from "./ViewNoteModal";

function formatRelativeTime(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function NotesList({ refreshKey, onNewNote }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/notes");
        if (res.data?.notes && Array.isArray(res.data.notes)) {
          setNotes(res.data.notes);
        } else {
          setNotes([]);
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [refreshKey]);

  const handleDeleteNote = async (id, clientName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this clinical note for "${clientName || "Client"}"?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (selectedNote?._id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      (note.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.sessionNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.preview || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (note.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="notes-card">
      <div className="notes-card-header">
        <div className="notes-header-left">
          <h2>Session Notes</h2>
          <span className="notes-count-badge">
            {notes.length} {notes.length === 1 ? "note" : "notes"} in directory
          </span>
        </div>

        <div className="notes-header-actions">
          {}
          <div className="notes-status-tabs">
            <button
              type="button"
              className={`notes-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({notes.length})
            </button>
            <button
              type="button"
              className={`notes-tab ${statusFilter === "completed" ? "active" : ""}`}
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </button>
            <button
              type="button"
              className={`notes-tab ${statusFilter === "draft" ? "active" : ""}`}
              onClick={() => setStatusFilter("draft")}
            >
              Draft
            </button>
          </div>

          {}
          <div className="notes-search">
            <SearchIcon size={14} className="notes-search-icon" />
            <input
              type="text"
              placeholder="Search notes by client, content, or session..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="notes-list">
        <div className="notes-list-header">
          <span>Client</span>
          <span>Session</span>
          <span>Clinical Note Summary</span>
          <span>Status</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="notes-empty">
            <p>Loading clinical notes from database...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note) => {
            const initials = note.clientName
              ? note.clientName
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "CL";

            const displayDate = note.sessionDate
              ? new Date(note.sessionDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              : "—";

            const relativeUpdated = formatRelativeTime(
              note.updatedAt || note.createdAt
            );

            return (
              <div className="note-row" key={note._id}>
                {}
                <div className="note-client">
                  <div className="note-avatar">{initials}</div>
                  <div className="note-client-meta">
                    <strong>{note.clientName}</strong>
                    <span>{displayDate}</span>
                  </div>
                </div>

                {}
                <span className="note-session-badge">{note.sessionNumber}</span>

                {}
                <div
                  className="note-preview"
                  onClick={() => setSelectedNote(note)}
                  title="Click to view full note"
                >
                  {note.preview || note.content}
                </div>

                {}
                <span
                  className={`note-status ${
                    note.status === "Draft" ? "draft" : "completed"
                  }`}
                >
                  {note.status}
                </span>

                {}
                <span className="note-updated">{relativeUpdated}</span>

                {}
                <div className="note-actions text-right">
                  <button
                    type="button"
                    className="note-view-btn"
                    onClick={() => setSelectedNote(note)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="note-delete-btn"
                    onClick={() => handleDeleteNote(note._id, note.clientName)}
                    disabled={deletingId === note._id}
                    title="Delete note"
                  >
                    {deletingId === note._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="notes-empty">
            <p>
              {searchQuery
                ? `No clinical notes found matching "${searchQuery}"`
                : "No clinical notes documented yet."}
            </p>
            {!searchQuery && onNewNote && (
              <button
                type="button"
                className="notes-empty-add-btn"
                onClick={onNewNote}
              >
                + Create First Note
              </button>
            )}
          </div>
        )}
      </div>

      {}
      {selectedNote && (
        <ViewNoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onDelete={handleDeleteNote}
        />
      )}
    </section>
  );
}

export default NotesList;
