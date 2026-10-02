import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ClientPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/clients");
        if (res.data?.clients && Array.isArray(res.data.clients)) {
          const mapped = res.data.clients.map((c) => {
            const used = typeof c.sessionsUsed === "number" ? c.sessionsUsed : 0;
            const total = typeof c.totalSessions === "number" && c.totalSessions > 0 ? c.totalSessions : 6;
            return {
              id: c._id,
              client: c.name || "Client",
              package: c.package || "6-pack Care Bundle",
              used,
              total
            };
          });
          setPackages(mapped);
        } else {
          setPackages([]);
        }
      } catch (err) {
        console.error("Failed to fetch client packages:", err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <article className="dashboard-card packages-card">
      <div
        className="card-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>Client Packages</h2>
        <Link
          to="/packages"
          style={{
            fontSize: "12px",
            color: "#155078",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          Manage Packages →
        </Link>
      </div>

      <div className="packages-list">
        {loading ? (
          <div style={{ padding: "24px 12px", textAlign: "center", color: "#607d92", fontSize: "13px" }}>
            Loading packages...
          </div>
        ) : packages.length > 0 ? (
          packages.map((item) => {
            const remaining = Math.max(0, item.total - item.used);
            const percentage =
              item.total > 0
                ? Math.min(100, Math.round((item.used / item.total) * 100))
                : 0;

            return (
              <div className="package-item" key={item.id}>
                <div className="package-top">
                  <div>
                    <strong>{item.client}</strong>
                    <span>{item.package}</span>
                  </div>

                  <span className="package-left">{remaining} left</span>
                </div>

                <div className="package-progress">
                  <div
                    className="package-progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {remaining <= 1 && (
                  <button type="button" className="renew-button">
                    Send Renewal Link
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ padding: "24px 12px", textAlign: "center", color: "#607d92", fontSize: "13px" }}>
            No client packages in directory.
          </div>
        )}
      </div>
    </article>
  );
}

export default ClientPackages;