function PackageToolbar({
  onCreateClick,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <section className="packages-toolbar">
      <div>
        <h1>Packages</h1>
        <p>Create and manage session packages for your clients.</p>
      </div>

      <div className="packages-toolbar-actions">
        <input
          type="text"
          className="package-search-input"
          placeholder="Search packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button
          type="button"
          className="package-create-btn"
          onClick={onCreateClick}
        >
          + Create Package
        </button>
      </div>
    </section>
  );
}

export default PackageToolbar;
