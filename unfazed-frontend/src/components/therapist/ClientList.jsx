import { useState, useEffect } from "react";
import axios from "axios";
import { SearchIcon, CheckIcon } from "../common/Icons";

function ClientList({ refreshKey }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch real registered clients exclusively from MongoDB backend
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/clients");
        if (res.data?.clients && Array.isArray(res.data.clients)) {
          const dbClients = res.data.clients.map((c) => {
            const used = typeof c.sessionsUsed === "number" ? c.sessionsUsed : 0;
            const total = typeof c.totalSessions === "number" && c.totalSessions > 0 ? c.totalSessions : 6;
            const remaining = Math.max(0, total - used);
            const status = c.isActive === false ? "Inactive" : remaining <= 1 ? "Ending Soon" : "Active";

            return {
              _id: c._id,
              name: c.name || "Client",
              email: c.email,
              phone: c.phone || "",
              package: c.package || "6-pack Care Bundle",
              sessions: `${used} / ${total}`,
              used,
              total,
              remaining: `${remaining} left`,
              status,
              createdAt: c.createdAt
            };
          });

          setClients(dbClients);
        } else {
          setClients([]);
        }
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [refreshKey]);

  // Handle client deletion
  const handleDeleteClient = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete client "${name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete client");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      client.status.toLowerCase().replace(" ", "-") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="clients-card">
      <div className="clients-card-header">
        <div className="clients-header-left">
          <h2>All Clients</h2>
          <span className="clients-count-badge">
            {clients.length} {clients.length === 1 ? "client" : "clients"}
          </span>
        </div>

        <div className="clients-header-actions">
          {/* Status Filter Tabs */}
          <div className="clients-status-tabs">
            <button
              type="button"
              className={`status-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({clients.length})
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === "active" ? "active" : ""}`}
              onClick={() => setStatusFilter("active")}
            >
              Active
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === "ending-soon" ? "active" : ""}`}
              onClick={() => setStatusFilter("ending-soon")}
            >
              Ending Soon
            </button>
          </div>

          {/* Search Box */}
          <div className="clients-search">
            <SearchIcon size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="clients-table">
        <div className="clients-table-header">
          <span>Client</span>
          <span>Package</span>
          <span>Progress</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        <div className="clients-table-body">
          {loading ? (
            <div className="clients-empty">
              <p>Loading clients directory from database...</p>
            </div>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => {
              const initials = client.name
                .split(" ")
                .filter(Boolean)
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "CL";

              const percentage =
                client.total > 0
                  ? Math.min(100, Math.round((client.used / client.total) * 100))
                  : 0;

              return (
                <div className="client-table-row" key={client._id}>
                  {/* 1. Client Profile with Avatar */}
                  <div className="client-profile">
                    <div className="client-avatar-small">{initials}</div>

                    <div className="client-meta-info">
                      <strong className="client-name">{client.name}</strong>
                      <span className="client-email">{client.email}</span>
                    </div>
                  </div>

                  {/* 2. Package */}
                  <div className="client-package">
                    <span>{client.package}</span>
                  </div>

                  {/* 3. Progress */}
                  <div className="client-progress-col">
                    <div className="progress-label-row">
                      <strong>{client.sessions}</strong>
                      <span className="remaining-text">({client.remaining})</span>
                    </div>
                    <div className="mini-progress-track">
                      <div
                        className="mini-progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 4. Status Badge */}
                  <div className="client-status-col">
                    <span
                      className={`client-status-badge ${
                        client.status === "Ending Soon"
                          ? "ending"
                          : client.status === "Inactive"
                          ? "inactive"
                          : "active"
                      }`}
                    >
                      {client.status === "Active" && <CheckIcon size={11} />}
                      <span>{client.status}</span>
                    </span>
                  </div>

                  {/* 5. Actions: View Profile & Delete Client */}
                  <div className="client-action-col text-right">
                    <button className="client-view-btn" type="button">
                      View
                    </button>
                    <button
                      className="client-delete-btn"
                      type="button"
                      onClick={() => handleDeleteClient(client._id, client.name)}
                      disabled={deletingId === client._id}
                      title={`Delete ${client.name}`}
                    >
                      {deletingId === client._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="clients-empty">
              <p>
                {searchQuery
                  ? `No clients found matching "${searchQuery}"`
                  : 'No clients in directory yet. Click "+ Add Client" above to add your first client.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ClientList;
