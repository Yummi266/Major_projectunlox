function PackageList({
  packages = [],
  loading = false,
  statusFilter = "All",
  setStatusFilter,
  onView,
  onEdit
}) {
  const filteredPackages = packages.filter((pkg) => {
    if (statusFilter === "All") return true;
    return pkg.status === statusFilter;
  });

  return (
    <section className="packages-card">
      <div className="packages-card-header">
        <div>
          <h2>Your Packages</h2>
          <span>
            {loading
              ? "Loading packages..."
              : `${filteredPackages.length} package${filteredPackages.length === 1 ? "" : "s"} listed`}
          </span>
        </div>

        <div className="package-filter-pills">
          {["All", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`package-pill-btn ${statusFilter === tab ? "active" : ""}`}
              onClick={() => setStatusFilter && setStatusFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "48px 16px", textAlign: "center", color: "#6a889d" }}>
          Loading packages from database...
        </div>
      ) : filteredPackages.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "#f9fcfd",
            borderRadius: "10px",
            border: "1px dashed #d5e5ef"
          }}
        >
          <div style={{ fontSize: "28px", color: "#8aa6b8", marginBottom: "8px" }}>◇</div>
          <h3 style={{ margin: "0 0 6px", color: "#174d73", fontSize: "16px" }}>
            No packages found
          </h3>
          <p style={{ margin: 0, color: "#6a889d", fontSize: "13px" }}>
            {statusFilter !== "All"
              ? `No ${statusFilter.toLowerCase()} packages match your filter.`
              : "No packages currently set up. Click '+ Create Package' to add your first one."}
          </p>
        </div>
      ) : (
        <div className="package-grid">
          {filteredPackages.map((item) => {
            const formattedPrice = `${item.currency || "₹"}${Number(item.price).toLocaleString()}`;
            const isActive = item.status === "Active";

            return (
              <article className="package-item" key={item._id || item.name}>
                <div className="package-item-top">
                  <div className="package-icon">◇</div>
                  <span className={`package-status ${isActive ? "active" : "inactive"}`}>
                    {item.status || "Active"}
                  </span>
                </div>

                <h3>{item.name}</h3>

                {item.description ? (
                  <p className="package-desc">{item.description}</p>
                ) : (
                  <p className="package-desc" style={{ fontStyle: "italic", opacity: 0.7 }}>
                    Session package plan
                  </p>
                )}

                <div className="package-price">{formattedPrice}</div>

                <div className="package-details">
                  <div>
                    <span>Sessions</span>
                    <strong>{item.sessions}</strong>
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>{item.duration || "50 min"}</strong>
                  </div>

                  <div>
                    <span>Active clients</span>
                    <strong>{item.clients || 0}</strong>
                  </div>
                </div>

                <div className="package-actions">
                  <button
                    type="button"
                    className="package-view-btn"
                    onClick={() => onView && onView(item)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="package-edit-btn"
                    onClick={() => onEdit && onEdit(item)}
                  >
                    Edit
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default PackageList;
