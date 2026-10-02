import { Link } from "react-router-dom";

function ViewPackageModal({ pkg, isOpen, onClose, onEditClick }) {
  if (!isOpen || !pkg) return null;

  const perSession =
    pkg.sessions > 0
      ? Math.round(pkg.price / pkg.sessions).toLocaleString()
      : pkg.price.toLocaleString();

  return (
    <div className="package-modal-overlay" onClick={onClose}>
      <div className="package-modal" onClick={(e) => e.stopPropagation()}>
        <div className="package-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="package-icon">◇</div>
            <div>
              <h3 style={{ margin: 0 }}>{pkg.name}</h3>
              <span
                className={`package-status ${
                  pkg.status === "Active" ? "active" : "inactive"
                }`}
                style={{ marginTop: "4px", display: "inline-block" }}
              >
                {pkg.status}
              </span>
            </div>
          </div>
          <button className="package-modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="package-modal-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingBottom: "16px",
              borderBottom: "1px solid #e7eff4",
              marginBottom: "16px"
            }}
          >
            <div>
              <span style={{ fontSize: "12px", color: "#6e8a9c" }}>Total Price</span>
              <div className="package-price" style={{ margin: "2px 0 0" }}>
                {pkg.currency || "₹"}{Number(pkg.price).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "12px", color: "#6e8a9c" }}>Per Session</span>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#174d73" }}>
                {pkg.currency || "₹"}{perSession}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px"
            }}
          >
            <div style={{ background: "#f8fbfd", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2edf3" }}>
              <span style={{ fontSize: "11.5px", color: "#6b879a" }}>Sessions</span>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#174d73", marginTop: "3px" }}>
                {pkg.sessions} Sessions
              </div>
            </div>

            <div style={{ background: "#f8fbfd", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2edf3" }}>
              <span style={{ fontSize: "11.5px", color: "#6b879a" }}>Duration</span>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#174d73", marginTop: "3px" }}>
                {pkg.duration || "50 min"}
              </div>
            </div>
          </div>

          {pkg.description && (
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#274b64", display: "block", marginBottom: "4px" }}>
                Description
              </span>
              <p style={{ margin: 0, fontSize: "13px", color: "#4f7086", lineHeight: 1.5 }}>
                {pkg.description}
              </p>
            </div>
          )}

          {Array.isArray(pkg.features) && pkg.features.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#274b64", display: "block", marginBottom: "6px" }}>
                Package Inclusions
              </span>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#4f7086", fontSize: "13px", lineHeight: 1.6 }}>
                {pkg.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="enrolled-clients-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h4 style={{ margin: 0 }}>
                Enrolled Clients ({pkg.clients || 0})
              </h4>
              <Link to="/clients" style={{ fontSize: "12px", color: "#174d73", fontWeight: 600, textDecoration: "none" }}>
                Manage in Clients →
              </Link>
            </div>

            {Array.isArray(pkg.enrolledClients) && pkg.enrolledClients.length > 0 ? (
              <div>
                {pkg.enrolledClients.map((client) => {
                  const used = client.sessionsUsed || 0;
                  const total = client.totalSessions || pkg.sessions;
                  return (
                    <div key={client.id} className="enrolled-client-item">
                      <div>
                        <strong>{client.name}</strong>
                        <span>{client.email}</span>
                      </div>
                      <span className="enrolled-client-badge">
                        {used} / {total} sessions used
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: "16px",
                  background: "#f9fcfe",
                  border: "1px dashed #d5e5ef",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: "12.5px",
                  color: "#6b8699"
                }}
              >
                No clients currently assigned to this package.
              </div>
            )}
          </div>
        </div>

        <div className="package-modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onClose();
              onEditClick(pkg);
            }}
          >
            Edit Package
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewPackageModal;
