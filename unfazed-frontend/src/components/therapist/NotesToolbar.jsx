function NotesToolbar({ onNewNote }) {
  return (
    <section className="notes-toolbar">
      <div className="notes-toolbar-info">
        <h1>Clinical Notes</h1>
        <p>Document, review, and manage your client session notes.</p>
      </div>

      <div className="notes-toolbar-actions">
        <button
          className="notes-add-btn"
          type="button"
          onClick={onNewNote}
        >
          + New Note
        </button>
      </div>
    </section>
  );
}

export default NotesToolbar;
