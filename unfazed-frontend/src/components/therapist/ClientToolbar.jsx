function ClientToolbar({ onAddClient }) {
  return (
    <section className="clients-toolbar">
      <div className="clients-toolbar-info">
        <h1>Clients</h1>
        <p>Manage your client directory, treatment packages, and session progress.</p>
      </div>

      <div className="clients-toolbar-actions">
        <button
          className="client-add-btn"
          type="button"
          onClick={onAddClient}
        >
          + Add Client
        </button>
      </div>
    </section>
  );
}

export default ClientToolbar;
